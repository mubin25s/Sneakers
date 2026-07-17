import { fetchProducts } from './api-service.ts';
import { cartService } from './cart-service.ts';
import ui from './ui-service.ts';
import { authService } from './auth-service.ts';
import { Product } from './mock-data.ts';
import gsap from 'gsap';

let currentProduct: Product | null = null;
let selectedSize: number | null = null;

document.addEventListener('DOMContentLoaded', () => {
    // GSAP page entrance
    gsap.from('header', { y: -100, opacity: 0, duration: 0.8, ease: 'power3.out' });
    gsap.from('#product-detail', { opacity: 0, y: 50, duration: 1.0, delay: 0.2, ease: 'power3.out' });

    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('id');

    if (pid) {
        fetchProducts().then(products => {
            const product = products.find(p => p.id == parseInt(pid)) || products[0]; 
            
            if (product) {
                currentProduct = product;
                const brandEl = document.getElementById('p-brand');
                const nameEl = document.getElementById('p-name');
                const priceEl = document.getElementById('p-price');
                const descEl = document.getElementById('p-desc');
                const imgEl = document.getElementById('p-image') as HTMLImageElement;
                const loadingEl = document.getElementById('p-loading');

                if (brandEl) brandEl.innerText = product.brand;
                if (nameEl) nameEl.innerText = product.name;
                if (priceEl) priceEl.innerText = '$' + product.price;
                if (descEl) descEl.innerText = product.description;
                if (imgEl) imgEl.src = product.image;
                if (loadingEl) loadingEl.style.display = 'none';
                
                generateSizes();
            }
        });
    }
});

function generateSizes(): void {
    const container = document.getElementById('size-container');
    if (!container) return;
    const sizes = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13];

    sizes.forEach(size => {
        const chip = document.createElement('div');
        chip.className = 'size-chip';
        chip.innerText = size.toString();
        
        chip.onclick = () => {
            document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            selectedSize = size;
        };

        container.appendChild(chip);
    });
}

const addBtn = document.getElementById('add-to-cart-btn');
if (addBtn) {
    addBtn.onclick = async () => {
        if (!authService.getUser()) {
            ui.showToast('Authentication required to secure elite drops.', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        if (!currentProduct) return;
        if (!selectedSize) {
            ui.showToast('Please select a size first.', 'error');
            return;
        }

        cartService.addItem(currentProduct, selectedSize.toString());
        ui.showToast(`${currentProduct.name} added to your bag.`, 'success');
    };
}
