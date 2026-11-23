# PESA EARN — setup and deployment

This is a responsive KES earning dashboard starter. It uses Supabase Auth/Postgres with Row Level Security and Supabase Edge Functions for server-side M-Pesa payout requests. It is **not live or payment-ready** until you complete the configuration below, select a legitimate ad provider, and test the full flow with Daraja sandbox credentials.

## Included
- Member registration/login and individual dashboard.
- KES wallet view and transaction history.
- Active sponsored video listing and admin ad management.
- Admin-only user and withdrawal views.
- Atomic withdrawal-request RPC that reserves pending requests against the user's balance.
- Supabase RLS policies; browser clients cannot credit wallet balances.
- M-Pesa Daraja B2C Edge Function scaffold for approved payouts and a callback handler.
- Admin promotion instructions for `mcmbuish@gmail.com`.

## 1. Supabase setup
1. Create a Supabase project at https://supabase.com/.
2. In SQL Editor, run all of `supabase/schema.sql`.
3. In Project Settings → API, copy the Project URL and public anon/publishable key into `config.js`.
4. Never put the `service_role` key or any M-Pesa secret in `config.js`, HTML, GitHub, or other browser code.
5. Deploy the frontend to GitHub Pages or another HTTPS static host. Add the deployed URL to Supabase Authentication → URL Configuration → Redirect URLs.
6. Register using the administrator email `mcmbuish@gmail.com`, confirm the email, then run this in Supabase SQL Editor:

   ```sql
   update public.profiles set role='admin', status='active'
   where email='mcmbuish@gmail.com';
   ```

   Sign out and back in to refresh the role.

## 2. M-Pesa Daraja (B2C payouts)
Create a Daraja app and test with sandbox credentials first. Deploy the Edge Functions:

```bash
supabase functions deploy mpesa-b2c
supabase functions deploy mpesa-callback
```

Set secrets in Supabase (never in frontend files):

```bash
supabase secrets set MPESA_BASE_URL="https://sandbox.safaricom.co.ke"
supabase secrets set MPESA_CONSUMER_KEY="..."
supabase secrets set MPESA_CONSUMER_SECRET="..."
supabase secrets set MPESA_SHORTCODE="..."
supabase secrets set MPESA_INITIATOR_NAME="..."
supabase secrets set MPESA_SECURITY_CREDENTIAL="..."
supabase secrets set MPESA_CALLBACK_TOKEN="use-a-long-random-secret"
supabase secrets set MPESA_CALLBACK_URL="https://YOUR_PROJECT_REF.supabase.co/functions/v1/mpesa-callback?token=YOUR_RANDOM_SECRET"
```

For production, use Safaricom's production Daraja base URL and approved shortcode/initiator/security credential. Generate the `SecurityCredential` using Safaricom's certificate and your initiator password; do not store the password in source code. Confirm the exact B2C command, shortcode, callback registration and account permissions with Safaricom before live payouts.

The B2C function submits a payout only after an admin approves it. It changes the request to `processing`; the callback changes it to `paid` and posts a wallet debit only after a successful provider result. Test success, timeout, duplicate callback, failed payout and reconciliation cases in sandbox. Have a developer review callback authenticity and idempotency before production; the callback token is an additional guard, not a substitute for provider reconciliation.

**Important:** M-Pesa B2C is a payout to the member's phone. It does not send the member an OTP/PIN prompt to approve a withdrawal. A customer-initiated STK Push is a separate collection flow that prompts the payer to enter their M-Pesa PIN on their handset. This starter does not require members to pay an upfront fee to unlock their own balance. If the business charges a legitimate processing fee, disclose the amount and deduct it from the payout where legally and technically appropriate. Never ask for an M-Pesa PIN or OTP on this website.

## 3. Video advertising and rewards
There is no universal API that proves a person watched a video. Select an ad network/provider that supports server-to-server completion callbacks. Implement its signature validation and event mapping in `supabase/functions/verify-ad-view/README.md` before crediting rewards. Browser timers, video-player events and screenshots are not proof. The admin ad list is currently a catalog; automatic rewards are intentionally disabled until provider verification is integrated.

Only fund reward amounts from actual advertiser revenue. Publish clear reward rates, eligibility rules, privacy terms, fraud rules and withdrawal thresholds. Do not advertise guaranteed income or charge a pay-to-withdraw fee.

## 4. Admin operations
- Add ads from **Manage ads**.
- Review users in **Users**.
- Approve withdrawal requests in **Withdrawals**, then use **Send M-Pesa** to submit the B2C payout.
- Only mark a payout paid after the provider callback and reconciliation confirm it.

## 5. Before launch
- Add business identity, contact/support, Terms, Privacy and refund/dispute information.
- Confirm Safaricom Daraja eligibility and applicable Kenyan payment, advertising, consumer-protection and data-protection requirements.
- Configure Supabase Auth email confirmation and SMTP.
- Add provider-backed ad verification, audit logs, rate limits, monitoring, backups and admin MFA.
- Review RLS policies and Edge Functions with a qualified developer. Use a separate sandbox project for testing.

## Files
- `index.html`, `styles.css`, `app.js`: frontend.
- `config.js`: public Supabase URL/key only.
- `supabase/schema.sql`: tables, RLS and withdrawal RPC.
- `supabase/functions/mpesa-b2c`: secure payout submission.
- `supabase/functions/mpesa-callback`: payout result handling.
- `supabase/functions/verify-ad-view/README.md`: provider-specific ad verification requirements.
