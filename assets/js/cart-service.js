const CART_KEY = 'shoezone_cart';

export const cartService = {
    getCart() {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    addItem(product, size = '9') { // Default size 9 for quick adds
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

    removeItem(id, size) {
        let cart = this.getCart();
        cart = cart.filter(item => !(item.id === id && item.size === size));
        this.saveCart(cart);
        this.updateCartCount();
    },

    updateQuantity(id, size, quantity) {
        let cart = this.getCart();
        const item = cart.find(item => item.id === id && item.size === size);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                return this.removeItem(id, size);
            }
        }
        this.saveCart(cart);
        this.updateCartCount();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    },

    clearCart() {
        localStorage.removeItem(CART_KEY);
        this.updateCartCount();
    },

    saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    },

    getCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    getTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateCartCount() {
        const count = this.getCount();
        const badge = document.getElementById('cart-count');
        if(badge) {
            badge.innerText = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
};

// Export individual functions for easier access
export const addItem = (product, size) => cartService.addItem(product, size);
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
