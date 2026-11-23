# PESA EARN — front-end starter

This is a responsive **demo interface**, not a live earning or payment platform.

## Deploy to GitHub Pages
1. Extract this ZIP on your phone or computer.
2. In the `Vipesa` repository, choose **Add file → Upload files**.
3. Upload `index.html`, `style.css`, `app.js`, and `README.md` (the files inside this folder, not the containing folder).
4. Commit to the `main` branch. GitHub Pages should serve `index.html` from the repository root.

## Important before real launch
- Demo credits are generated only in the browser and have no cash value.
- Do not collect M-Pesa PINs or OTPs in this website.
- Real earnings, advert completion verification, balances, withdrawals, admin roles, and audit logs must be implemented on a trusted server/database.
- Integrate M-Pesa using the official Daraja API from the backend only; verify callbacks and reconcile transactions server-side.
- Configure any withdrawal/processing fee transparently in KES and show it before the user confirms. Do not disguise a fee as an OTP or unlock charge.
- Never place Supabase service-role keys, Daraja secrets, or other private credentials in GitHub Pages or browser JavaScript.

## Included
- Member dashboard and demo balance
- Timed sample advert task
- Demo reward activity
- Withdrawal review form with Kenyan phone validation
- Clear demo-mode and payment safety notices

Admin authentication and live M-Pesa payments are intentionally not represented as operational features in this static starter.
