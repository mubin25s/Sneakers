document.addEventListener('DOMContentLoaded', () => {
    setupGlobalNavigation();
});

function setupGlobalNavigation() {
    const backBtn = document.querySelector('.global-back-btn');
    
    if (backBtn) {
        backBtn.onclick = (e) => {
            e.preventDefault();
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'index.html';
            }
        };
    }
}
