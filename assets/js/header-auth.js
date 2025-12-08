import { authService } from './auth-service.js';

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuth();
});

function updateHeaderAuth() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const user = authService.getUser();
    const cartLink = navActions.querySelector('a[href="cart.html"]'); 
    // Preserve cart link, remove others (like Login)
    
    // We want to replace the Login link with User info, or keep Login if no user
    // Simplest way: Rebuild the innerHTML but keep the cart icon logic if possible, 
    // or just find the Login link and replace it.

    const loginLink = navActions.querySelector('a[href="login.html"]');

    if (user) {
        if (loginLink) {
            loginLink.remove();
        }

        // Check if user info already exists to avoid duplication
        if (document.getElementById('user-info')) return;

        const userInfo = document.createElement('div');
        userInfo.id = 'user-info';
        userInfo.className = 'flex items-center gap-4';
        userInfo.innerHTML = `
            <span class="text-accent" style="font-size: 0.9rem;">Hi, ${user.first_name}</span>
            <button id="logout-btn" class="text-cta hover:text-accent" style="background:none; border:none; cursor:pointer; font-size: 0.9rem;">Logout</button>
        `;

        // Insert before cart
        if (cartLink) {
            navActions.insertBefore(userInfo, cartLink);
        } else {
            navActions.appendChild(userInfo);
        }

        document.getElementById('logout-btn').addEventListener('click', () => {
            authService.logout();
            window.location.reload();
        });

    } else {
        // Ensure Login link exists if not logged in
        if (!loginLink && !document.getElementById('user-info')) {
             const login = document.createElement('a');
             login.href = 'login.html';
             login.className = 'text-accent hover:text-cta';
             login.style.fontSize = '0.9rem';
             login.innerText = 'Login';
             
             if (cartLink) {
                 navActions.insertBefore(login, cartLink);
                 // Add some spacing/gap if needed, handled by flex gap-4 class on parent
             } else {
                 navActions.appendChild(login);
             }
        }
    }
}
