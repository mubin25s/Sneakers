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
    const existingAuth = navActions.querySelector('#auth-link') || navActions.querySelector('#user-info');

    if (user) {
        if (existingAuth && existingAuth.id === 'auth-link') existingAuth.remove();
        if (document.getElementById('user-info')) return;

        const userInfo = document.createElement('div');
        userInfo.id = 'user-info';
        userInfo.className = 'flex items-center gap-4';
        userInfo.innerHTML = `
            <div class="auth-nav-link">
                <span style="opacity: 0.6; font-size: 0.7rem;">ELITE MEMBER</span>
                <span style="color: white; font-weight: 800;">${user.first_name.toUpperCase()}</span>
            </div>
            <button id="logout-btn" class="dashboard-btn" style="padding: 0.6rem 1rem; background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: var(--color-primary);">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
        `;

        if (cartLink) {
            navActions.insertBefore(userInfo, cartLink);
        } else {
            navActions.appendChild(userInfo);
        }

        document.getElementById('logout-btn').onclick = async () => {
            if (await ui.confirm('Are you sure you want to sign out of the elite collective?', 'Secure Logout')) {
                authService.logout();
                ui.showToast('Authentication session ended.', 'success');
                setTimeout(() => window.location.reload(), 800);
            }
        };

    } else {
        if (!document.getElementById('auth-link') && !document.getElementById('user-info')) {
             const login = document.createElement('a');
             login.href = 'login.html';
             login.id = 'auth-link';
             login.innerHTML = `
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Login
             `;
             
             if (cartLink) {
                 navActions.insertBefore(login, cartLink);
             } else {
                 navActions.appendChild(login);
             }
        }
    }
}
