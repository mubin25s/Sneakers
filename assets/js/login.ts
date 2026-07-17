import { authService } from './auth-service.ts';
import ui from './ui-service.ts';
import gsap from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    // GSAP page entrance
    gsap.from('.auth-portal', { scale: 0.85, opacity: 0, duration: 1.0, ease: 'power4.out' });
    gsap.from('.bg-glow', { scale: 0.5, opacity: 0, duration: 1.5, ease: 'power3.out' });

    const authPortal = document.getElementById('auth-portal');
    const signUpBtn = document.getElementById('signUp');
    const signInBtn = document.getElementById('signIn');

    if (signUpBtn && authPortal) {
        signUpBtn.onclick = () => authPortal.classList.add("right-panel-active");
    }
    if (signInBtn && authPortal) {
        signInBtn.onclick = () => authPortal.classList.remove("right-panel-active");
    }

    // Handle URL Hash for direct page state
    if (window.location.hash === '#register' && authPortal) {
        authPortal.classList.add("right-panel-active");
    }

    // Login Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = (document.getElementById('login-email') as HTMLInputElement).value;
            const pass = (document.getElementById('login-pass') as HTMLInputElement).value;
            const btn = loginForm.querySelector('button') as HTMLButtonElement;

            btn.disabled = true;
            btn.innerHTML = '<span style="letter-spacing: 0.5em; font-size: 0.6rem;">VALIDATING...</span>';

            const res = await authService.login(email, pass);
            if (res.success && res.user) {
                ui.showToast(`ACCESS GRANTED. Welcome, ${res.user.first_name}.`, 'success');
                setTimeout(() => window.location.href = 'index.html', 1200);
            } else {
                ui.showToast(res.message || 'Login failed', 'error');
                btn.disabled = false;
                btn.innerText = 'AUTHENTICATE';
            }
        };
    }

    // Register Submit
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault();
            const fullName = (document.getElementById('reg-name') as HTMLInputElement).value;
            const email = (document.getElementById('reg-email') as HTMLInputElement).value;
            const pass = (document.getElementById('reg-pass') as HTMLInputElement).value;
            const btn = registerForm.querySelector('button') as HTMLButtonElement;

            const [fname, ...rest] = fullName.split(' ');
            const lname = rest.join(' ') || '';

            btn.disabled = true;
            btn.innerHTML = '<span style="letter-spacing: 0.5em; font-size: 0.6rem;">INITIALIZING...</span>';

            const res = await authService.register({ first_name: fname, last_name: lname, email, password: pass });
            if (res.success) {
                ui.showToast('REGISTRATION COMPLETE. Please authenticate.', 'success');
                if (signInBtn) (signInBtn as HTMLButtonElement).click();
                btn.disabled = false;
                btn.innerText = 'CREATE ACCOUNT';
            } else {
                ui.showToast(res.message || 'Registration failed', 'error');
                btn.disabled = false;
                btn.innerText = 'CREATE ACCOUNT';
            }
        };
    }
});
