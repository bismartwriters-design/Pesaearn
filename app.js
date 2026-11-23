// Front-end demonstration only. Never use browser storage as a source of real balances.
let balance=0, watched=0, today=0, running=false, seconds=15, interval=null;
const $=id=>document.getElementById(id);
function render(){ $('balance').textContent=balance.toFixed(2);$('watched').textContent=watched;$('today').textContent=today.toFixed(2); }
function log(text){const item=document.createElement('p');item.textContent=text;$('activity').prepend(item);}
$('watchBtn').addEventListener('click',()=>{
 if(running)return;running=true;seconds=15;$('watchBtn').disabled=true;$('watchBtn').textContent='Watching…';
 interval=setInterval(()=>{seconds--;$('timer').textContent=`00:${String(seconds).padStart(2,'0')} remaining`;$('progress').style.width=`${(15-seconds)/15*100}%`;
 if(seconds<=0){clearInterval(interval);running=false;watched++;balance+=10;today+=10;render();$('watchBtn').disabled=false;$('watchBtn').textContent='Watch again';$('timer').textContent='Completed — KES 10 demo credit added';log('Completed sample advert · +KES 10 demo credit');}
 },1000);
});
$('withdrawBtn').addEventListener('click',()=>{
 const phone=$('phone').value.trim(), amount=Number($('withdrawAmount').value);
 const valid=/^(?:\+254|0)7\d{8}$/.test(phone);
 if(!valid){$('message').textContent='Enter a valid Kenyan mobile number (07XXXXXXXX or +2547XXXXXXXX).';return;}
 if(!Number.isFinite(amount)||amount<=0){$('message').textContent='Enter a valid withdrawal amount.';return;}
 if(amount>balance){$('message').textContent='Insufficient demo balance.';return;}
 $('message').textContent=`Demo review only: KES ${amount.toFixed(2)} to ${phone}. No payment has been sent. Connect a secure backend and official M-Pesa API before enabling payouts.`;
});
render();