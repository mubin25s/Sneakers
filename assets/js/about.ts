import gsap from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    gsap.from('header', { y: -100, opacity: 0, duration: 0.8, ease: 'power3.out' });
    gsap.from('main .animate-fade-in', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' });
    gsap.from('main img', { scale: 0.9, opacity: 0, duration: 0.8, delay: 0.3, stagger: 0.15, ease: 'power3.out' });
});
