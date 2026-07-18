import{g as s}from"./index-DzjGLEWQ.js";/* empty css              */import{c as e}from"./cart-service-CGQ-SGad.js";import{u as d}from"./ui-service-tqxLbaJ-.js";const c=document.getElementById("cart-container"),l=document.getElementById("cart-summary");function o(){if(!c||!l)return;const n=e.getCart();if(n.length===0){l.classList.add("hidden"),c.innerHTML=`
            <div class="glass-card text-center" style="padding: 4rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🛍️</div>
                <h2 style="margin-bottom: 1rem;">Your bag is empty.</h2>
                <p class="text-muted" style="margin-bottom: 2rem;">Looks like you haven't added anything to your bag yet.</p>
                <a href="shop.html" class="btn btn-primary">START SHOPPING</a>
            </div>
        `;return}l.classList.remove("hidden");const r=e.getTotal(),m=document.getElementById("summary-subtotal"),u=document.getElementById("summary-total");m&&(m.textContent=`$${r.toFixed(2)}`),u&&(u.textContent=`$${r.toFixed(2)}`),c.innerHTML=`
        <div class="flex flex-col gap-4">
            ${n.map(t=>`
                <div class="glass-card flex items-center gap-6" style="padding: 1rem;">
                    <img src="${t.image}" alt="${t.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: var(--radius-md);">
                    <div style="flex: 1;">
                        <div class="text-primary font-bold" style="font-size: 0.7rem; text-transform: uppercase;">${t.brand||"PREMIUM"}</div>
                        <h3 style="font-weight: 800; font-size: 1.2rem; margin-bottom: 0.5rem;">${t.name}</h3>
                        <p class="text-muted" style="font-size: 0.9rem;">Selected Size: <span style="color: white; font-weight: 700;">${t.size}</span></p>
                        <div class="text-primary font-bold" style="margin-top: 0.5rem; font-size: 1.1rem;">$${t.price}</div>
                    </div>
                    <div class="flex flex-col items-end gap-4">
                        <div class="flex items-center" style="background: rgba(255,255,255,0.05); border-radius: var(--radius-md); padding: 0.2rem;">
                            <button class="btn btn-outline q-btn" data-id="${t.id}" data-size="${t.size}" data-action="minus" style="padding: 0.4rem 0.8rem; border: none;">-</button>
                            <span style="min-width: 30px; text-align: center; font-weight: bold;">${t.quantity}</span>
                            <button class="btn btn-outline q-btn" data-id="${t.id}" data-size="${t.size}" data-action="plus" style="padding: 0.4rem 0.8rem; border: none;">+</button>
                        </div>
                        <button class="rm-btn" data-id="${t.id}" data-size="${t.size}" style="background:none; border:none; color: var(--color-text-muted); cursor:pointer; font-size: 0.8rem; text-decoration: underline;">REMOVE</button>
                    </div>
                </div>
            `).join("")}
        </div>
    `,document.querySelectorAll(".q-btn").forEach(t=>{t.onclick=()=>{const p=parseInt(t.dataset.id||"0"),f=t.dataset.size||"9",b=t.dataset.action,i=n.find(a=>a.id===p&&a.size===f);if(i){const a=b==="plus"?i.quantity+1:i.quantity-1;e.updateQuantity(p,f,a),o()}}}),document.querySelectorAll(".rm-btn").forEach(t=>{t.onclick=async()=>{await d.confirm("Are you sure you want to remove this item?")&&(e.removeItem(parseInt(t.dataset.id||"0"),t.dataset.size||"9"),o())}});const y=document.getElementById("checkout-btn");y&&(y.onclick=async()=>{await d.confirm("Proceed to checkout with total $"+r.toFixed(2)+"?")&&(d.showModal(`
                    <div class="text-center">
                        <div style="font-size: 4rem; margin-bottom: 2rem;">🎉</div>
                        <h2 style="font-size: 2rem; margin-bottom: 1rem;">ORDER PLACED!</h2>
                        <p class="text-muted" style="margin-bottom: 2.5rem;">Thank you for your purchase. We've sent a confirmation email to your account.</p>
                        <button onclick="location.href='index.html'" class="btn btn-primary">RETURN HOME</button>
                    </div>
                `),e.clearCart(),o())})}document.addEventListener("DOMContentLoaded",()=>{s.from("header",{y:-100,opacity:0,duration:.8,ease:"power3.out"}),s.from("main h1",{y:30,opacity:0,duration:.8,delay:.2,ease:"power3.out"}),s.from("#cart-wrapper",{opacity:0,y:40,duration:1,delay:.3,ease:"power3.out"}),window.addEventListener("cartUpdated",o),o()});
