/**
 * UI Service for custom modals and toasts
 * Replaces native browser popups with premium website modals
 */

export interface ModalOptions {
    maxWidth?: string;
}

class UIService {
    constructor() {
        if (typeof document !== 'undefined') {
            this.initContainers();
        }
    }

    initContainers(): void {
        // Create Modal Container
        if (!document.querySelector('.modal-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal-container">
                    <div class="modal-close">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <div class="modal-content"></div>
                </div>
            `;
            document.body.appendChild(overlay);

            const closeBtn = overlay.querySelector('.modal-close');
            if (closeBtn) {
                (closeBtn as HTMLElement).onclick = () => this.hideModal();
            }
            overlay.onclick = (e) => {
                if (e.target === overlay) this.hideModal();
            };
        }

        // Create Toast Container
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    showModal(content: string, options: ModalOptions = {}): void {
        const overlay = document.querySelector('.modal-overlay') as HTMLElement;
        if (!overlay) return;
        const contentArea = overlay.querySelector('.modal-content') as HTMLElement;
        if (!contentArea) return;
        contentArea.innerHTML = content;
        
        const container = overlay.querySelector('.modal-container') as HTMLElement;
        if (container && options.maxWidth) {
            container.style.maxWidth = options.maxWidth;
        }

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal(): void {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    showToast(message: string, type: 'success' | 'error' = 'success', duration: number = 3000): void {
        const container = document.querySelector('.toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 
            `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>` : 
            `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;

        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('active'), 10);

        // Remove
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    confirm(message: string, title: string = 'Confirm Action'): Promise<boolean> {
        return new Promise((resolve) => {
            const content = `
                <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">${title}</h3>
                <p style="color: var(--color-text-muted); margin-bottom: 2rem;">${message}</p>
                <div class="flex gap-4 justify-end">
                    <button class="btn btn-outline" id="modal-cancel">Cancel</button>
                    <button class="btn btn-primary" id="modal-confirm">Confirm</button>
                </div>
            `;
            this.showModal(content);

            const cancelBtn = document.getElementById('modal-cancel');
            const confirmBtn = document.getElementById('modal-confirm');

            if (cancelBtn) {
                cancelBtn.onclick = () => {
                    this.hideModal();
                    resolve(false);
                };
            }
            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    this.hideModal();
                    resolve(true);
                };
            }
        });
    }

    alert(message: string, title: string = 'Notification'): void {
        const content = `
            <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">${title}</h3>
            <p style="color: var(--color-text-muted); margin-bottom: 2rem;">${message}</p>
            <div class="flex justify-end">
                <button class="btn btn-primary" id="modal-alert-ok">Understood</button>
            </div>
        `;
        this.showModal(content);
        const okBtn = document.getElementById('modal-alert-ok');
        if (okBtn) {
            okBtn.onclick = () => this.hideModal();
        }
    }
}

const ui = new UIService();
export default ui;

declare global {
    interface Window {
        ui: UIService;
    }
}

if (typeof window !== 'undefined') {
    window.ui = ui; // Global access for quick buttons
}
