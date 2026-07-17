import { cartService } from './cart-service.ts';
import ui from './ui-service.ts';
import gsap from 'gsap';

const container = document.getElementById('cart-container');
const summary = document.getElementById('cart-summary');

function renderCart(): void {
    if (!container || !summary) return;
    const cart = cartService.getCart();
    
    if (cart.length === 0) {
        summary.classList.add('hidden');
        container.innerHTML = `
            <div class="glass-card text-center" style="padding: 4rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🛍️</div>
                <h2 style="margin-bottom: 1rem;">Your bag is empty.</h2>
                <p class="text-muted" style="margin-bottom: 2rem;">Looks like you haven't added anything to your bag yet.</p>
                <a href="shop.html" class="btn btn-primary">START SHOPPING</a>
            </div>
        `;
        return;
    }

    summary.classList.remove('hidden');
    const total = cartService.getTotal();
    
    const subtotalEl = document.getElementById('summary-subtotal');
    const totalEl = document.getElementById('summary-total');
    if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    container.innerHTML = `
        <div class="flex flex-col gap-4">
            ${cart.map(item => `
                <div class="glass-card flex items-center gap-6" style="padding: 1rem;">
                    <img src="${item.image}" alt="${item.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: var(--radius-md);">
                    <div style="flex: 1;">
                        <div class="text-primary font-bold" style="font-size: 0.7rem; text-transform: uppercase;">${item.brand || 'PREMIUM'}</div>
                        <h3 style="font-weight: 800; font-size: 1.2rem; margin-bottom: 0.5rem;">${item.name}</h3>
                        <p class="text-muted" style="font-size: 0.9rem;">Selected Size: <span style="color: white; font-weight: 700;">${item.size}</span></p>
                        <div class="text-primary font-bold" style="margin-top: 0.5rem; font-size: 1.1rem;">$${item.price}</div>
                    </div>
                    <div class="flex flex-col items-end gap-4">
                        <div class="flex items-center" style="background: rgba(255,255,255,0.05); border-radius: var(--radius-md); padding: 0.2rem;">
                            <button class="btn btn-outline q-btn" data-id="${item.id}" data-size="${item.size}" data-action="minus" style="padding: 0.4rem 0.8rem; border: none;">-</button>
                            <span style="min-width: 30px; text-align: center; font-weight: bold;">${item.quantity}</span>
                            <button class="btn btn-outline q-btn" data-id="${item.id}" data-size="${item.size}" data-action="plus" style="padding: 0.4rem 0.8rem; border: none;">+</button>
                        </div>
                        <button class="rm-btn" data-id="${item.id}" data-size="${item.size}" style="background:none; border:none; color: var(--color-text-muted); cursor:pointer; font-size: 0.8rem; text-decoration: underline;">REMOVE</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    document.querySelectorAll('.q-btn').forEach(btn => {
        (btn as HTMLElement).onclick = () => {
            const id = parseInt((btn as HTMLElement).dataset.id || '0');
            const size = (btn as HTMLElement).dataset.size || '9';
            const action = (btn as HTMLElement).dataset.action;
            const item = cart.find(i => i.id === id && i.size === size);
            if (item) {
                const newQ = action === 'plus' ? item.quantity + 1 : item.quantity - 1;
                cartService.updateQuantity(id, size, newQ);
                renderCart();
            }
        };
    });

    document.querySelectorAll('.rm-btn').forEach(btn => {
        (btn as HTMLElement).onclick = async () => {
            if (await ui.confirm('Are you sure you want to remove this item?')) {
                cartService.removeItem(parseInt((btn as HTMLElement).dataset.id || '0'), (btn as HTMLElement).dataset.size || '9');
                renderCart();
            }
        };
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = async () => {
            const confirmed = await ui.confirm('Proceed to checkout with total $' + total.toFixed(2) + '?');
            if (confirmed) {
                ui.showModal(`
                    <div class="text-center">
                        <div style="font-size: 4rem; margin-bottom: 2rem;">🎉</div>
                        <h2 style="font-size: 2rem; margin-bottom: 1rem;">ORDER PLACED!</h2>
                        <p class="text-muted" style="margin-bottom: 2.5rem;">Thank you for your purchase. We've sent a confirmation email to your account.</p>
                        <button onclick="location.href='index.html'" class="btn btn-primary">RETURN HOME</button>
                    </div>
                `);
                cartService.clearCart();
                renderCart();
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // GSAP page intro animations
    gsap.from('header', { y: -100, opacity: 0, duration: 0.8, ease: 'power3.out' });
    gsap.from('main h1', { y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    gsap.from('#cart-wrapper', { opacity: 0, y: 40, duration: 1.0, delay: 0.3, ease: 'power3.out' });

    window.addEventListener('cartUpdated', renderCart);
    renderCart();
});
