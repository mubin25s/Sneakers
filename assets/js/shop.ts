import { fetchProducts, fetchCategories, fetchBrands } from './api-service.ts';
import ui from './ui-service.ts';
import { Product } from './mock-data.ts';
import { cartService } from './cart-service.ts';
import { authService } from './auth-service.ts';
import gsap from 'gsap';

declare global {
    interface Window {
        filterBy: (type: 'category' | 'brand', val: string, el: HTMLElement) => void;
        renderProducts: () => void;
        quickViewModal: (id: number) => void;
        openBuySection: (id: number) => void;
        selectQVSize: (el: HTMLElement, size: string) => void;
        closeQuickView: () => void;
        addToCartWithParams: (id: number) => void;
        addToCart: (id: number) => void;
        currentSelectedSize: string;
    }
}

let currentCat = '';
let currentBrand = '';
let allProducts: Product[] = [];

document.addEventListener('DOMContentLoaded', async () => {
    // GSAP page intro animations
    gsap.from('header', { y: -100, opacity: 0, duration: 0.8, ease: 'power3.out' });
    gsap.from('aside', { x: -100, opacity: 0, duration: 1.0, ease: 'power3.out' });
    gsap.from('main h2', { y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });

    allProducts = await fetchProducts();
    
    // Parse URL Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) currentCat = catParam;

    await loadCategories();
    await loadBrands();
    window.renderProducts();
});

async function loadCategories(): Promise<void> {
    const cats = await fetchCategories();
    const list = document.getElementById('category-list');
    if (!list) return;
    
    // Clear default if we have a param
    if (currentCat) {
        const allItem = list.querySelector('.filter-item');
        if (allItem) allItem.classList.remove('active');
    }

    cats.forEach(c => {
        const item = document.createElement('div');
        item.className = 'filter-item' + (currentCat === c.id ? ' active' : '');
        item.textContent = c.name;
        item.onclick = () => window.filterBy('category', c.id, item);
        list.appendChild(item);
    });
}

async function loadBrands(): Promise<void> {
    const brands = await fetchBrands();
    const list = document.getElementById('brand-list');
    if (!list) return;
    brands.forEach(b => {
        const item = document.createElement('div');
        item.className = 'filter-item';
        item.textContent = b;
        item.onclick = () => window.filterBy('brand', b, item);
        list.appendChild(item);
    });
}

window.filterBy = (type, val, el) => {
    const group = el.parentElement;
    if (group) {
        group.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
    }
    el.classList.add('active');

    if (type === 'category') currentCat = val;
    if (type === 'brand') currentBrand = val;
    
    window.renderProducts();
};

window.renderProducts = () => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const filtered = allProducts.filter(p => {
        const catMatch = !currentCat || p.category === currentCat;
        const brandMatch = !currentBrand || p.brand === currentBrand;
        return catMatch && brandMatch;
    });

    const totalEl = document.getElementById('product-total');
    if (totalEl) totalEl.innerText = filtered.length.toString();

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="text-muted">No products found in this category.</p>';
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="product-image-container" onclick="window.openBuySection(${p.id})">
                <img src="${p.image}" alt="${p.name}" style="cursor: pointer;">
                <div class="quick-add" onclick="event.stopPropagation(); window.quickViewModal(${p.id})">QUICK VIEW</div>
            </div>
            <div style="padding: 1.5rem;">
                <div class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">${p.brand}</div>
                <h3 style="font-size: 1.1rem; margin-bottom: 0.8rem; font-weight: 700;">
                    <a href="javascript:void(0)" onclick="window.openBuySection(${p.id})">${p.name}</a>
                </h3>
                <div class="flex justify-between items-center">
                    <span class="text-primary font-bold" style="font-size: 1.2rem;">$${p.price}</span>
                    <button onclick="window.addToCart(${p.id})" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">QUICK ADD +</button>
                </div>
            </div>
        </div>
    `).join('');

    // GSAP grid item entrance transition
    gsap.from('#product-grid .product-card', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out'
    });
};

window.quickViewModal = async (id) => {
    const p = allProducts.find(item => item.id === id);
    if (!p) return;
    const content = `
        <div class="flex flex-col md-flex-row gap-8">
            <div style="flex: 1; border-radius: var(--radius-md); overflow: hidden; height: 350px;">
                <img src="${p.image}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1;">
                <span class="text-primary font-bold uppercase" style="font-size: 0.7rem;">${p.brand}</span>
                <h2 style="font-size: 2rem; margin: 0.5rem 0 1rem; font-weight: 800;">${p.name}</h2>
                <div style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem;" class="text-primary">$${p.price}</div>
                <p class="text-muted" style="margin-bottom: 2rem; font-size: 0.9rem;">${p.description}</p>
                <button onclick="window.addToCart(${p.id}); ui.hideModal();" class="btn btn-primary" style="width: 100%;">ADD TO SHOPPING BAG</button>
            </div>
        </div>
    `;
    ui.showModal(content, { maxWidth: '850px' });
};

window.openBuySection = (id) => {
    const p = allProducts.find(item => item.id === id);
    if (!p) return;

    const quickViewArea = document.getElementById('shop-quick-view');
    if (!quickViewArea) return;
    
    quickViewArea.innerHTML = `
        <div class="flex flex-col md-flex-row gap-12 items-center glass-card animate-fade-in" style="padding: 3rem; text-align: left; position: relative; z-index: 10;">
            <button onclick="window.closeQuickView()" class="btn-close-qv" style="position: absolute; top: 1.5rem; right: 1.5rem; width: 44px; height: 44px; border-radius: 50%; background: var(--color-surface-light); border: 1px solid var(--glass-border); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 110; transition: var(--transition);">
                <svg style="pointer-events: none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div style="flex: 1; border-radius: var(--radius-lg); overflow: hidden; height: 450px;">
                <img src="${p.image}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            
            <div style="flex: 1.2;">
                <span class="text-primary font-bold letter-spacing uppercase" style="font-size: 0.8rem;">${p.brand}</span>
                <h2 style="font-size: 3rem; font-weight: 800; margin: 0.5rem 0 1rem; line-height: 1.1;">${p.name}</h2>
                <div class="text-primary font-bold" style="font-size: 2rem; margin-bottom: 1.5rem;">$${p.price}</div>
                <p class="text-muted" style="margin-bottom: 2.5rem; font-size: 1.1rem;">${p.description}</p>
                
                <div style="margin-bottom: 2.5rem;">
                    <h4 style="font-size: 0.75rem; font-weight: 800; color: white; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em;">SELECT YOUR SIZE (US)</h4>
                    <div class="flex gap-2 flex-wrap" id="qv-size-container">
                        ${[7, 8, 9, 10, 11, 12].map(s => `
                            <div class="size-chip ${s === 9 ? 'active' : ''}" onclick="window.selectQVSize(this, '${s}')" style="padding: 0.8rem 1.2rem; border: 1px solid var(--glass-border); border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); background: var(--glass-bg); font-weight: 600;">${s}</div>
                        `).join('')}
                    </div>
                </div>
                
                <button onclick="window.addToCartWithParams(${p.id})" class="btn btn-primary" style="width: 100%; height: 60px; font-size: 1.1rem; border-radius: 50px;">ADD TO SHOPPING BAG</button>
            </div>
        </div>
    `;

    quickViewArea.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.currentSelectedSize = '9';
};

window.selectQVSize = (el, size) => {
    document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    window.currentSelectedSize = size;
};

window.closeQuickView = () => {
     const q = document.getElementById('shop-quick-view');
     if (q) q.classList.add('hidden');
};

window.addToCartWithParams = async (id) => {
    if (!authService.getUser()) {
        ui.showToast('Please log in to participate in exclusive drops.', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const p = allProducts.find(item => item.id === id);
    if (p) {
        cartService.addItem(p, window.currentSelectedSize || '9');
        ui.showToast(`${p.name} (Size ${window.currentSelectedSize || '9'}) added to cart!`, 'success');
    }
};

window.addToCart = async (id) => {
    if (!authService.getUser()) {
        ui.showToast('Please log in to participate in exclusive drops.', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const p = allProducts.find(item => item.id === id);
    if (p) {
        cartService.addItem(p); // Uses default size 9
        ui.showToast(`Successfully added ${p.name} to cart.`, 'success');
    }
};
