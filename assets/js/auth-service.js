const USERS_KEY = 'shoezone_users';
const SESSION_KEY = 'shoezone_session';

export const authService = {
    async register(userData) {
        try {
            // Try Backend First
            const response = await fetch('api/auth.php?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            
            if(!response.ok) throw new Error('API Error');
            const data = await response.json();
            
            if (data.success) {
                return { success: true, message: data.message };
            } else {
                throw new Error(data.message); // Server returned specific error
            }

        } catch (error) {
            console.warn('Auth API failed, using LocalStorage fallback:', error);
            // Fallback: Register in LocalStorage
            let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            
            if (users.find(u => u.email === userData.email)) {
                return { success: false, message: 'Email already registered (Local)' };
            }

            // Simple hash not possible in frontend JS securely without libs, storing plaintext for Mock demo
            users.push(userData); 
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            
            return { success: true, message: 'Registration successful (Local)' };
        }
    },

    async login(email, password) {
        try {
            // Try Backend First
            const response = await fetch('api/auth.php?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if(!response.ok) throw new Error('API Error');
            const data = await response.json();

            if(data.success) {
                this.setSession(data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }

        } catch (error) {
            console.warn('Auth API failed, using LocalStorage fallback:', error);
            // Fallback: Login from LocalStorage
            let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Return user without password
                const safeUser = { ...user };
                delete safeUser.password;
                this.setSession(safeUser);
                return { success: true, user: safeUser };
            } else {
                return { success: false, message: 'Invalid credentials (Local)' };
            }
        }
    },

    logout() {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'login.html';
    },

    setSession(user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    },

    getUser() {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    },

    isAuthenticated() {
        return !!localStorage.getItem(SESSION_KEY);
    }
};
