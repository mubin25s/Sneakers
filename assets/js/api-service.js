import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from './mock-data.js';

export async function fetchProducts(category = '', brand = '') {
    try {
        const response = await fetch(`api/products.php?action=list&category=${category}&brand=${brand}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        
        // Try parsing JSON. If it fails (returns PHP code or HTML error), fallback.
        try {
            return JSON.parse(text);
        } catch (e) {
            console.warn('API did not return valid JSON. Falling back to mock data.');
            throw new Error('Invalid JSON');
        }
    } catch (error) {
        console.warn('Using Mock Products due to API error:', error);
        
        // Mock Filtering Logic
        return MOCK_PRODUCTS.filter(p => {
            const matchCat = !category || p.category === category;
            const matchBrand = !brand || p.brand === brand;
            return matchCat && matchBrand;
        });
    }
}

export async function fetchCategories() {
    try {
        const response = await fetch('api/products.php?action=categories');
        if (!response.ok) throw new Error('API Error');
        const text = await response.text();
        try { return JSON.parse(text); } catch (e) { throw e; }
    } catch (error) {
        console.warn('Using Mock Categories');
        return MOCK_CATEGORIES;
    }
}

export async function fetchBrands() {
    try {
        const response = await fetch('api/products.php?action=brands');
        if (!response.ok) throw new Error('API Error');
        const text = await response.text();
        try { return JSON.parse(text); } catch (e) { throw e; }
    } catch (error) {
        console.warn('Using Mock Brands');
        return MOCK_BRANDS;
    }
}
