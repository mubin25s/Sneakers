import { authService } from './auth-service.js';
import ui from './ui-service.js';

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuth();
});

function updateHeaderAuth() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const user = authService.getUser();
    const cartLink = navActions.querySelector('.cart-icon'); 
    const authLink = navActions.querySelector('#auth-link');

    if (user) {
        if (authLink) authLink.remove();
        if (document.getElementById('user-info')) return;

        const userInfo = document.createElement('div');
        userInfo.id = 'user-info';
        userInfo.className = 'flex items-center gap-4';
        userInfo.innerHTML = `
            <span class="text-muted" style="font-size: 0.85rem; font-weight: 600;">Hi, ${user.first_name}</span>
            <button id="logout-btn" class="text-primary hover:underline" style="background:none; border:none; cursor:pointer; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">LOGOUT</button>
        `;

        if (cartLink) {
            navActions.insertBefore(userInfo, cartLink);
        } else {
            navActions.appendChild(userInfo);
        }

        document.getElementById('logout-btn').onclick = async () => {
            if (await ui.confirm('Are you sure you want to sign out?', 'Sign Out')) {
                authService.logout();
                ui.showToast('Logged out successfully.', 'success');
                setTimeout(() => window.location.reload(), 800);
            }
        };

    } else {
        if (!authLink && !document.getElementById('user-info')) {
             const login = document.createElement('a');
             login.href = 'login.html';
             login.id = 'auth-link';
             login.className = 'text-muted hover:text-white';
             login.style.fontSize = '0.9rem';
             login.innerText = 'Login';
             
             if (cartLink) {
                 navActions.insertBefore(login, cartLink);
             } else {
                 navActions.appendChild(login);
             }
        }
    }
}
