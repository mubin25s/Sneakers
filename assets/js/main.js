document.addEventListener('DOMContentLoaded', () => {
    setupGlobalNavigation();
});

function setupGlobalNavigation() {
    const backBtn = document.getElementById('global-back-btn');
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Logic: Go back in history if not homepage, else stay/reload
            if (window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html')) {
                window.history.back();
            } else {
                console.log('Already on homepage');
            }
        });
    }
}
