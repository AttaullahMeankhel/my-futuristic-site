const products=[
{id:1,name:"NOVA X1",cat:"Audio",price:349,desc:"Premium wireless headphones",shape:"shape-headphones",featured:true,new:true},
{id:2,name:"VECTOR ONE",cat:"Computing",price:1899,desc:"Performance laptop",shape:"shape-laptop",new:true},
{id:3,name:"PULSE S",cat:"Wearables",price:299,desc:"Intelligent smart wearable",shape:"shape-watch"},
{id:4,name:"AURA PRO",cat:"Smart Home",price:229,desc:"Adaptive audio system",shape:"shape-speaker",new:true},
{id:5,name:"NEXUS KEYS",cat:"Computing",price:159,desc:"Precision mechanical keyboard",shape:"shape-keyboard"},
{id:6,name:"ARC VISION",cat:"Wearables",price:499,desc:"Cinematic capture system",shape:"shape-camera"}
];
let cart=JSON.parse(localStorage.getItem("nexaCart")||"[]");
let activeCategory="All";
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const grid=$("#productGrid"), cartDrawer=$("#cartDrawer"), overlay=$("#overlay"), toast=$("#toast");

function money(n){return "$"+n.toLocaleString()}
function renderProducts(){
 let list=products.filter(p=>activeCategory==="All"||p.cat===activeCategory);
 const sort=$("#sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price);
 if(sort==="high")list.sort((a,b)=>b.price-a.price);
 if(sort==="newest")list.sort((a,b)=>Number(b.new)-Number(a.new));
 grid.innerHTML=list.map(p=>`
 <article class="product-card reveal visible" data-id="${p.id}">
  <div class="product-visual"><div class="prod-shape ${p.shape}"></div></div>
  <div class="product-info">
   <div class="product-top"><div><small>${p.cat.toUpperCase()}</small><h3>${p.name}</h3><p>${p.desc}</p></div><button class="icon-btn wish-product" data-id="${p.id}" aria-label="Wishlist">♡</button></div>
   <div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name}">+</button></div>
  </div>
 </article>`).join("");
}
function addToCart(id){
 const p=products.find(x=>x.id===+id); if(!p)return;
 const existing=cart.find(x=>x.id===p.id);
 if(existing)existing.qty++; else cart.push({id:p.id,qty:1});
 saveCart(); showToast(`${p.name} added to your cart`);
}
function saveCart(){localStorage.setItem("nexaCart",JSON.stringify(cart));renderCart()}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0); $("#cartCount").textContent=count;
 const items=$("#cartItems");
 if(!cart.length){items.innerHTML='<div class="cart-empty">Your cart is waiting for something exceptional.</div>';$("#cartTotal").textContent="$0";return}
 let total=0;
 items.innerHTML=cart.map(x=>{const p=products.find(v=>v.id===x.id);total+=p.price*x.qty;return`
 <div class="cart-item"><div class="cart-thumb"><div class="prod-shape ${p.shape}"></div></div>
 <div><h4>${p.name}</h4><p>${money(p.price)} × ${x.qty}</p><button data-remove="${p.id}">Remove</button></div><strong>${money(p.price*x.qty)}</strong></div>`}).join("");
 $("#cartTotal").textContent=money(total);
}
function showToast(msg){toast.textContent="✓ "+msg;toast.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show");document.body.style.overflow="hidden"}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show");document.body.style.overflow=""}
function openSearch(){ $("#searchOverlay").classList.add("open");$("#searchInput").focus();document.body.style.overflow="hidden";searchProducts("")}
function closeSearch(){ $("#searchOverlay").classList.remove("open");document.body.style.overflow=""}
function searchProducts(q){const results=products.filter(p=>(p.name+" "+p.cat+" "+p.desc).toLowerCase().includes(q.toLowerCase())).slice(0,5);$("#searchResults").innerHTML=results.map(p=>`<div class="search-result" data-search-id="${p.id}"><strong>${p.name}</strong><span>${p.cat} · ${money(p.price)}</span></div>`).join("")||'<p style="color:#68747c">No products found.</p>'}
function openModal(id){
 const p=products.find(x=>x.id===+id);if(!p)return;
 $("#modalContent").innerHTML=`<div class="modal-product"><div class="modal-visual"><div class="prod-shape ${p.shape}"></div></div><div><p class="eyebrow">${p.cat.toUpperCase()} / NEXA OBJECT</p><h2>${p.name}</h2><p>${p.desc}. Designed around premium materials, intelligent performance and a refined everyday experience.</p><h3>${money(p.price)}</h3><button class="btn btn-primary" data-modal-add="${p.id}">Add to cart <span>+</span></button></div></div>`;
 $("#quickModal").classList.add("open");
}
$$("[data-category]").forEach(btn=>btn.addEventListener("click",()=>{$$("[data-category]").forEach(b=>b.classList.remove("active"));btn.classList.add("active");activeCategory=btn.dataset.category;renderProducts()}));
$("#sortSelect").addEventListener("change",renderProducts);
grid.addEventListener("click",e=>{const add=e.target.closest("[data-add]");if(add)addToCart(add.dataset.add)});
$("#cartBtn").addEventListener("click",openCart);overlay.addEventListener("click",closeCart);$$("[data-close]").forEach(x=>x.addEventListener("click",closeCart));
$("#searchBtn").addEventListener("click",openSearch);$$("[data-close-search]").forEach(x=>x.addEventListener("click",closeSearch));
$("#searchInput").addEventListener("input",e=>searchProducts(e.target.value));
$("#searchResults").addEventListener("click",e=>{const x=e.target.closest("[data-search-id]");if(x){closeSearch();openModal(x.dataset.searchId)}});
$$("[data-close-modal]").forEach(x=>x.addEventListener("click",()=>$("#quickModal").classList.remove("open")));
$("#quickModal").addEventListener("click",e=>{if(e.target.id==="quickModal")e.currentTarget.classList.remove("open");const b=e.target.closest("[data-modal-add]");if(b){addToCart(b.dataset.modalAdd);e.currentTarget.classList.remove("open")}});
$(".add-featured").addEventListener("click",e=>addToCart(e.currentTarget.dataset.id));
$("#quickFeatured").addEventListener("click",()=>openModal(1));
$$("[data-category-jump]").forEach(b=>b.addEventListener("click",()=>{$$("[data-category]").forEach(x=>{x.classList.toggle("active",x.dataset.category===b.dataset.categoryJump)});activeCategory=b.dataset.categoryJump;renderProducts();$("#shop").scrollIntoView({behavior:"smooth"})}));
$(".checkout").addEventListener("click",()=>{if(!cart.length)return showToast("Your cart is empty");showToast("Demo checkout ready — connect your payment provider");});
$("#menuBtn").addEventListener("click",()=>{const links=$(".nav-links");links.style.display=links.style.display==="flex"?"none":"flex";links.style.position="absolute";links.style.top="70px";links.style.left="15px";links.style.right="15px";links.style.margin="0";links.style.padding="20px";links.style.flexDirection="column";links.style.background="#0a1014";links.style.border="1px solid rgba(255,255,255,.1)";links.style.borderRadius="15px"});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeSearch();$("#quickModal").classList.remove("open")}});
document.addEventListener("mousemove",e=>{const g=$(".cursor-glow");if(g){g.style.left=e.clientX+"px";g.style.top=e.clientY+"px"}});
$$("[data-tilt]").forEach(el=>el.addEventListener("mousemove",e=>{if(innerWidth<800)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1100px) rotateX(${y*-2}deg) rotateY(${x*2}deg)`}));
$$("[data-tilt]").forEach(el=>el.addEventListener("mouseleave",()=>el.style.transform=""));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.1});
$$(".reveal").forEach(x=>observer.observe(x));
document.addEventListener("click",e=>{const r=e.target.closest("[data-remove]");if(r){cart=cart.filter(x=>x.id!==+r.dataset.remove);saveCart()}});
renderProducts();renderCart();
