const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* ---- Edit your menu here ---- */
const MENU=[
 {t:'Dosha',p:40,c:'Tiffin',i:'img/dosha.jpg',e:'🥞'},
 {t:'Egg Omelette',p:50,c:'Non-Veg',i:'img/egg-Omelette.jpg',e:'🍳'},
 {t:'Chicken Fry',p:100,c:'Non-Veg',i:'img/chickan-fry.jpg',e:'🍗'},
 {t:'Mutton Biriyani',p:150,c:'Biriyani',i:'img/motton-briyani.jpg',e:'🍛'},
 {t:'Parotta',p:40,c:'Tiffin',i:'img/parotta.jpg',e:'🫓'},
 {t:'Fish Fry',p:50,c:'Non-Veg',i:'img/fish-fry.jpg',e:'🐟'},
 {t:'Chicken Biriyani',p:200,c:'Biriyani',i:'img/chickan-briyani.jpg',e:'🍛'},
 {t:'Chicken Parotta',p:100,c:'Non-Veg',i:'img/chickan-parotta.jpg',e:'🌯'}
];
const DELIVERY=30;
/* ---- Put YOUR real UPI ID here ---- */
const UPI_ID='yourname@upi', UPI_NAME='Online Food';

let cart=JSON.parse(localStorage.getItem('cart')||'[]');
const save=()=>localStorage.setItem('cart',JSON.stringify(cart));
const sub=()=>cart.reduce((a,x)=>a+x.p*x.q,0);
const thumb=x=>`<div class="thumb">${x.e}<img src="${x.i}" alt="" onerror="this.remove()"></div>`;

function toast(m){const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)}

/* ---- Cart ---- */
function renderCart(){
  const n=cart.reduce((a,x)=>a+x.q,0), b=$('#badge');
  if(b){b.textContent=n;b.style.display=n?'grid':'none'}
  const box=$('#items'); if(!box)return;
  box.innerHTML=cart.length?cart.map(x=>`<div class="item">${thumb(x)}
    <div><h4>${x.t}</h4><small>Rs.${x.p}</small>
    <div class="qty"><button data-a="-" data-t="${x.t}">−</button><b>${x.q}</b><button data-a="+" data-t="${x.t}">+</button></div></div>
    <button class="del" data-a="x" data-t="${x.t}" aria-label="Remove">🗑️</button></div>`).join(''):'<p class="muted">Your cart is empty 🍽️</p>';
  $('#total').textContent='Rs.'+sub();
}
function openCart(o){$('#cart').classList.toggle('open',o);$('#overlay').classList.toggle('on',o)}

/* ---- Menu page ---- */
if($('#grid')){
  let cat='All', q='';
  const cats=['All',...new Set(MENU.map(m=>m.c))];
  $('#chips').innerHTML=cats.map(c=>`<button class="chip${c==='All'?' on':''}">${c}</button>`).join('');
  const draw=()=>{
    const list=MENU.filter(m=>(cat==='All'||m.c===cat)&&m.t.toLowerCase().includes(q));
    $('#grid').innerHTML=list.length?list.map(m=>`<article class="card"><div class="pic">${m.e}<img src="${m.i}" alt="${m.t}" loading="lazy" onerror="this.remove()"></div>
      <div class="info"><small>${m.c}</small><h3>${m.t}</h3><div class="row"><b>Rs.${m.p}</b><button class="add" data-t="${m.t}" aria-label="Add ${m.t}">+</button></div></div></article>`).join(''):'<p class="empty">No dishes found 😕</p>';
  };
  $('#chips').onclick=e=>{if(!e.target.matches('.chip'))return;cat=e.target.textContent;$$('.chip').forEach(c=>c.classList.toggle('on',c===e.target));draw()};
  $('#q').oninput=e=>{q=e.target.value.toLowerCase().trim();draw()};
  $('#grid').onclick=e=>{
    const b=e.target.closest('.add'); if(!b)return;
    const m=MENU.find(x=>x.t===b.dataset.t), f=cart.find(x=>x.t===m.t);
    f?f.q++:cart.push({t:m.t,p:m.p,i:m.i,e:m.e,q:1});
    save();renderCart();toast(m.t+' added to cart');
  };
  $('#items').onclick=e=>{
    const b=e.target.closest('button'); if(!b)return;
    const x=cart.find(i=>i.t===b.dataset.t); if(!x)return;
    if(b.dataset.a==='+')x.q++;
    if(b.dataset.a==='-')x.q--;
    if(b.dataset.a==='x'||x.q<1)cart=cart.filter(i=>i!==x);
    save();renderCart();

/* footer Home button: scroll to top */
if($('#homeBtn'))$('#homeBtn').onclick=e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})};
  };
  $('#cartBtn').onclick=()=>openCart(true);
  $('#cartClose').onclick=$('#overlay').onclick=()=>openCart(false);
  $('#checkout').onclick=()=>cart.length?location.href='payment.html':toast('Your cart is empty');
  draw();
}

/* ---- Payment page ---- */
if($('#payForm')){
  const s=sub(), d=cart.length?DELIVERY:0, total=s+d;
  $('#sumItems').innerHTML=cart.length?cart.map(x=>`<div class="item" style="grid-template-columns:62px 1fr auto">${thumb(x)}<div><h4>${x.t}</h4><small>Qty ${x.q}</small></div><b>Rs.${x.p*x.q}</b></div>`).join(''):'<p class="muted">Cart is empty. <a href="index.html" style="color:var(--brand)">Add food</a></p>';
  $('#sub').textContent='Rs.'+s;$('#del').textContent='Rs.'+d;$('#grand').textContent='Rs.'+total;
  $('#qrAmt').textContent='Rs.'+total;$('#qrTo').textContent=UPI_ID;

  const upiLink=(pa,am)=>`upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(UPI_NAME)}&am=${am}&cu=INR&tn=${encodeURIComponent('Food order')}`;
  let tab='id';

  const sync=()=>{
    const m=$('input[name=pay]:checked').value;
    $('#cardFields').hidden=m!=='card';
    $$('#cardFields input').forEach(i=>i.disabled=m!=='card');
    $('#upiPanel').hidden=m!=='upi';
    $('#upiId').disabled=!(m==='upi'&&tab==='id');
    $('#paidChk').disabled=!(m==='upi'&&tab==='qr');
    $('#Orderbtn').textContent=m==='upi'&&tab==='qr'?"I've paid, place order":m==='cod'?'Place order (Pay on delivery)':'Order Now!';
  };
  $$('input[name=pay]').forEach(r=>r.onchange=sync);
  $$('.tab').forEach(t=>t.onclick=()=>{
    tab=t.dataset.tab;
    $$('.tab').forEach(x=>x.classList.toggle('on',x===t));
    $('#tabId').hidden=tab!=='id';$('#tabQr').hidden=tab!=='qr';sync();
  });

  const okRe=/^[A-Za-z0-9._\-]{2,}@[A-Za-z]{2,}$/;
  $('#upiId').oninput=e=>$('.upi-input').classList.toggle('valid',okRe.test(e.target.value));
  $$('.suffixes button').forEach(b=>b.onclick=()=>{
    const i=$('#upiId'); i.value=i.value.split('@')[0]+b.dataset.s; i.dispatchEvent(new Event('input')); i.focus();
  });
  $$('.app').forEach(a=>a.onclick=e=>{
    e.preventDefault();
    if(!total)return toast('Your cart is empty');
    location.href=upiLink(UPI_ID,total.toFixed(2));
    setTimeout(()=>toast('If nothing opened, use the UPI ID or QR option'),1500);
  });
  sync();

  $('#cc').oninput=e=>e.target.value=e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  $('#ex').oninput=e=>{let v=e.target.value.replace(/\D/g,'').slice(0,4);e.target.value=v.length>2?v.slice(0,2)+'/'+v.slice(2):v};

  $('#payForm').onsubmit=e=>{
    e.preventDefault();
    if(!cart.length)return toast('Your cart is empty');
    $('#oid').textContent='#'+Math.floor(100000+Math.random()*900000);
    $('#modal').classList.add('on');
    cart=[];save();
    setTimeout(()=>location.href='index.html',3000);
  };
}

/* ---- Contact page ---- */
if($('#contactForm')){
  $('#contactForm').onsubmit=e=>{e.preventDefault();e.target.reset();toast('Message sent. Thank you!');setTimeout(()=>location.href='index.html',1500)};
}

renderCart();

/* footer Home button: scroll to top */
if($('#homeBtn'))$('#homeBtn').onclick=e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})};
