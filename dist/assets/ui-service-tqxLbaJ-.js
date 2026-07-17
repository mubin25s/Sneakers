class s{constructor(){typeof document<"u"&&this.initContainers()}initContainers(){if(!document.querySelector(".modal-overlay")){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
                <div class="modal-container">
                    <div class="modal-close">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <div class="modal-content"></div>
                </div>
            `,document.body.appendChild(t);const o=t.querySelector(".modal-close");o&&(o.onclick=()=>this.hideModal()),t.onclick=e=>{e.target===t&&this.hideModal()}}if(!document.querySelector(".toast-container")){const t=document.createElement("div");t.className="toast-container",document.body.appendChild(t)}}showModal(t,o={}){const e=document.querySelector(".modal-overlay");if(!e)return;const i=e.querySelector(".modal-content");if(!i)return;i.innerHTML=t;const n=e.querySelector(".modal-container");n&&o.maxWidth&&(n.style.maxWidth=o.maxWidth),e.classList.add("active"),document.body.style.overflow="hidden"}hideModal(){const t=document.querySelector(".modal-overlay");t&&t.classList.remove("active"),document.body.style.overflow=""}showToast(t,o="success",e=3e3){const i=document.querySelector(".toast-container");if(!i)return;const n=document.createElement("div");n.className=`toast toast-${o}`;const c=o==="success"?'<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>':'<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';n.innerHTML=`
            <div class="toast-icon">${c}</div>
            <div class="toast-message">${t}</div>
        `,i.appendChild(n),setTimeout(()=>n.classList.add("active"),10),setTimeout(()=>{n.classList.remove("active"),setTimeout(()=>n.remove(),300)},e)}confirm(t,o="Confirm Action"){return new Promise(e=>{const i=`
                <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">${o}</h3>
                <p style="color: var(--color-text-muted); margin-bottom: 2rem;">${t}</p>
                <div class="flex gap-4 justify-end">
                    <button class="btn btn-outline" id="modal-cancel">Cancel</button>
                    <button class="btn btn-primary" id="modal-confirm">Confirm</button>
                </div>
            `;this.showModal(i);const n=document.getElementById("modal-cancel"),c=document.getElementById("modal-confirm");n&&(n.onclick=()=>{this.hideModal(),e(!1)}),c&&(c.onclick=()=>{this.hideModal(),e(!0)})})}alert(t,o="Notification"){const e=`
            <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">${o}</h3>
            <p style="color: var(--color-text-muted); margin-bottom: 2rem;">${t}</p>
            <div class="flex justify-end">
                <button class="btn btn-primary" id="modal-alert-ok">Understood</button>
            </div>
        `;this.showModal(e);const i=document.getElementById("modal-alert-ok");i&&(i.onclick=()=>this.hideModal())}}const a=new s;typeof window<"u"&&(window.ui=a);export{a as u};
