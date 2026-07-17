import { Product } from './mock-data.ts';

export interface CartItem extends Product {
    size: string;
    quantity: number;
}

const CART_KEY = 'shoezone_cart';

export const cartService = {
    getCart(): CartItem[] {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    addItem(product: Product, size: string = '9'): void { // Default size 9 for quick adds
        let cart = this.getCart();
        // Check if item exists with same ID and Size
        const existingItem = cart.find(item => item.id === product.id && item.size === size);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                size: size,
                quantity: 1
            });
        }
        
        this.saveCart(cart);
        this.updateCartCount();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    },

    removeItem(id: number, size: string): void {
        let cart = this.getCart();
        cart = cart.filter(item => !(item.id === id && item.size === size));
        this.saveCart(cart);
        this.updateCartCount();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    },

    updateQuantity(id: number, size: string, quantity: number): void {
        let cart = this.getCart();
        const item = cart.find(item => item.id === id && item.size === size);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                return this.removeItem(id, size);
            }
        }
        this.saveCart(cart);
        this.updateCartCount();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    },

    clearCart(): void {
        localStorage.removeItem(CART_KEY);
        this.updateCartCount();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    },

    saveCart(cart: CartItem[]): void {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    },

    getCount(): number {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    getTotal(): number {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateCartCount(): void {
        const count = this.getCount();
        const badge = document.getElementById('cart-count');
        if (badge) {
            badge.innerText = count.toString();
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
};

// Export individual functions for easier access
export const addItem = (product: Product, size?: string) => cartService.addItem(product, size);
export const getCart = () => cartService.getCart();
export const updateCartCount = () => cartService.updateCartCount();

// Initial update on load
if (typeof document !== 'undefined') {
    cartService.updateCartCount();
}

// Sync cart across tabs
window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) {
        cartService.updateCartCount();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
});

// Also trigger on pages where it might be imported dynamically late
window.addEventListener('load', () => {
    cartService.updateCartCount();
});
