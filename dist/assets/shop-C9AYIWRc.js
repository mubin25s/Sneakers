import{g as s}from"./index-B7t212jl.js";import{a as f,f as p,b as w}from"./api-service-BoQdS-68.js";import{u as a}from"./ui-service-tqxLbaJ-.js";import{c as l}from"./cart-service-CGQ-SGad.js";import{a as m}from"./auth-service-D2X2caue.js";let o="",c="",n=[];document.addEventListener("DOMContentLoaded",async()=>{s.from("header",{y:-100,opacity:0,duration:.8,ease:"power3.out"}),s.from("aside",{x:-100,opacity:0,duration:1,ease:"power3.out"}),s.from("main h2",{y:30,opacity:0,duration:.8,delay:.2,ease:"power3.out"}),n=await f();const e=new URLSearchParams(window.location.search).get("category");e&&(o=e),await g(),await h(),window.renderProducts()});async function g(){const r=await p(),e=document.getElementById("category-list");if(e){if(o){const i=e.querySelector(".filter-item");i&&i.classList.remove("active")}r.forEach(i=>{const t=document.createElement("div");t.className="filter-item"+(o===i.id?" active":""),t.textContent=i.name,t.onclick=()=>window.filterBy("category",i.id,t),e.appendChild(t)})}}async function h(){const r=await w(),e=document.getElementById("brand-list");e&&r.forEach(i=>{const t=document.createElement("div");t.className="filter-item",t.textContent=i,t.onclick=()=>window.filterBy("brand",i,t),e.appendChild(t)})}window.filterBy=(r,e,i)=>{const t=i.parentElement;t&&t.querySelectorAll(".filter-item").forEach(d=>d.classList.remove("active")),i.classList.add("active"),r==="category"&&(o=e),r==="brand"&&(c=e),window.renderProducts()};window.renderProducts=()=>{const r=document.getElementById("product-grid");if(!r)return;const e=n.filter(t=>{const d=!o||t.category===o,u=!c||t.brand===c;return d&&u}),i=document.getElementById("product-total");if(i&&(i.innerText=e.length.toString()),e.length===0){r.innerHTML='<p class="text-muted">No products found in this category.</p>';return}r.innerHTML=e.map(t=>`
        <div class="product-card">
            <div class="product-image-container" onclick="window.openBuySection(${t.id})">
                <img src="${t.image}" alt="${t.name}" style="cursor: pointer;">
                <div class="quick-add" onclick="event.stopPropagation(); window.quickViewModal(${t.id})">QUICK VIEW</div>
            </div>
            <div style="padding: 1.5rem;">
                <div class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">${t.brand}</div>
                <h3 style="font-size: 1.1rem; margin-bottom: 0.8rem; font-weight: 700;">
                    <a href="javascript:void(0)" onclick="window.openBuySection(${t.id})">${t.name}</a>
                </h3>
                <div class="flex justify-between items-center">
                    <span class="text-primary font-bold" style="font-size: 1.2rem;">$${t.price}</span>
                    <button onclick="window.addToCart(${t.id})" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">QUICK ADD +</button>
                </div>
            </div>
        </div>
    `).join(""),s.from("#product-grid .product-card",{opacity:0,y:30,duration:.5,stagger:.06,ease:"power2.out"})};window.quickViewModal=async r=>{const e=n.find(t=>t.id===r);if(!e)return;const i=`
        <div class="flex flex-col md-flex-row gap-8">
            <div style="flex: 1; border-radius: var(--radius-md); overflow: hidden; height: 350px;">
                <img src="${e.image}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1;">
                <span class="text-primary font-bold uppercase" style="font-size: 0.7rem;">${e.brand}</span>
                <h2 style="font-size: 2rem; margin: 0.5rem 0 1rem; font-weight: 800;">${e.name}</h2>
                <div style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem;" class="text-primary">$${e.price}</div>
                <p class="text-muted" style="margin-bottom: 2rem; font-size: 0.9rem;">${e.description}</p>
                <button onclick="window.addToCart(${e.id}); ui.hideModal();" class="btn btn-primary" style="width: 100%;">ADD TO SHOPPING BAG</button>
            </div>
        </div>
    `;a.showModal(i,{maxWidth:"850px"})};window.openBuySection=r=>{const e=n.find(t=>t.id===r);if(!e)return;const i=document.getElementById("shop-quick-view");i&&(i.innerHTML=`
        <div class="flex flex-col md-flex-row gap-12 items-center glass-card animate-fade-in" style="padding: 3rem; text-align: left; position: relative; z-index: 10;">
            <button onclick="window.closeQuickView()" class="btn-close-qv" style="position: absolute; top: 1.5rem; right: 1.5rem; width: 44px; height: 44px; border-radius: 50%; background: var(--color-surface-light); border: 1px solid var(--glass-border); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 110; transition: var(--transition);">
                <svg style="pointer-events: none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div style="flex: 1; border-radius: var(--radius-lg); overflow: hidden; height: 450px;">
                <img src="${e.image}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            
            <div style="flex: 1.2;">
                <span class="text-primary font-bold letter-spacing uppercase" style="font-size: 0.8rem;">${e.brand}</span>
                <h2 style="font-size: 3rem; font-weight: 800; margin: 0.5rem 0 1rem; line-height: 1.1;">${e.name}</h2>
                <div class="text-primary font-bold" style="font-size: 2rem; margin-bottom: 1.5rem;">$${e.price}</div>
                <p class="text-muted" style="margin-bottom: 2.5rem; font-size: 1.1rem;">${e.description}</p>
                
                <div style="margin-bottom: 2.5rem;">
                    <h4 style="font-size: 0.75rem; font-weight: 800; color: white; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em;">SELECT YOUR SIZE (US)</h4>
                    <div class="flex gap-2 flex-wrap" id="qv-size-container">
                        ${[7,8,9,10,11,12].map(t=>`
                            <div class="size-chip ${t===9?"active":""}" onclick="window.selectQVSize(this, '${t}')" style="padding: 0.8rem 1.2rem; border: 1px solid var(--glass-border); border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); background: var(--glass-bg); font-weight: 600;">${t}</div>
                        `).join("")}
                    </div>
                </div>
                
                <button onclick="window.addToCartWithParams(${e.id})" class="btn btn-primary" style="width: 100%; height: 60px; font-size: 1.1rem; border-radius: 50px;">ADD TO SHOPPING BAG</button>
            </div>
        </div>
    `,i.classList.remove("hidden"),window.scrollTo({top:0,behavior:"smooth"}),window.currentSelectedSize="9")};window.selectQVSize=(r,e)=>{document.querySelectorAll(".size-chip").forEach(i=>i.classList.remove("active")),r.classList.add("active"),window.currentSelectedSize=e};window.closeQuickView=()=>{const r=document.getElementById("shop-quick-view");r&&r.classList.add("hidden")};window.addToCartWithParams=async r=>{if(!m.getUser()){a.showToast("Please log in to participate in exclusive drops.","error"),setTimeout(()=>window.location.href="login.html",1500);return}const e=n.find(i=>i.id===r);e&&(l.addItem(e,window.currentSelectedSize||"9"),a.showToast(`${e.name} (Size ${window.currentSelectedSize||"9"}) added to cart!`,"success"))};window.addToCart=async r=>{if(!m.getUser()){a.showToast("Please log in to participate in exclusive drops.","error"),setTimeout(()=>window.location.href="login.html",1500);return}const e=n.find(i=>i.id===r);e&&(l.addItem(e),a.showToast(`Successfully added ${e.name} to cart.`,"success"))};
