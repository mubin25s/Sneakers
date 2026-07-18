import gsap from 'gsap';

interface ShoeData {
    image: string;
    bg: string;
    price: string;
    tech: string;
    mat: string;
    desc: string;
}

const limeImg = new URL('../images/jordan/jordan-lime.png', import.meta.url).href;
const crimsonImg = new URL('../images/jordan/jordan-crimson.png', import.meta.url).href;
const midnightImg = new URL('../images/jordan/jordan-midnight.png', import.meta.url).href;
const chalkImg = new URL('../images/jordan/jordan-chalk.png', import.meta.url).href;

const colorways: Record<string, ShoeData> = {
    lime: {
        image: limeImg,
        bg: '#d6f578',
        price: '$135',
        tech: 'Zoom Air',
        mat: 'Tumbled Leather',
        desc: 'Engineered with signature responsive Zoom Air cushioning, double-lasted stability wrap, and premium tumbled leather panels for maximum courtside control and off-court prestige.'
    },
    crimson: {
        image: crimsonImg,
        bg: '#ffd3d3',
        price: '$145',
        tech: 'Carbon Shank',
        mat: 'Durabuck Leather',
        desc: 'Bold aesthetics meet infrared heritage. Featuring a reinforced dual-density carbon shank and micro-perforated durabuck detailing designed for lightning-fast responsiveness and structural support.'
    },
    midnight: {
        image: midnightImg,
        bg: '#d5e3f7',
        price: '$150',
        tech: 'Dynamic Fit',
        mat: 'Metallic Suede',
        desc: 'A luxurious midnight execution featuring golden metallic accents, wrap-around dynamic fit inner sleeve, and responsive foam-infused midsoles for high-end casual wear or lifestyle expression.'
    },
    chalk: {
        image: chalkImg,
        bg: '#f2f2eb',
        price: '$130',
        tech: 'Classic Sail',
        mat: 'Vintage Nubuck',
        desc: 'Minimalist heritage in vintage chalk and sail shades. Premium nubuck leather and breathable mesh layers pair with a classic rubber cupsole for time-tested durability and lightweight all-day comfort.'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const card = document.getElementById('product-card');
    const shoeImg = document.getElementById('shoe-image') as HTMLImageElement;
    const shoeWrapper = document.getElementById('shoe-image-wrapper');
    const shadowGlow = document.getElementById('shoe-shadow');
    const watermark = document.getElementById('watermark-text');
    const swatches = document.querySelectorAll('.swatch-dot');
    
    // Text updating elements
    const priceText = document.getElementById('shoe-price');
    const descText = document.getElementById('shoe-description');
    const techText = document.getElementById('spec-tech');
    const matText = document.getElementById('spec-mat');

    if (!card || !shoeImg || !shoeWrapper || !shadowGlow || !watermark) return;

    // 1. Initial Load Entrance Animation
    gsap.set(shoeImg, { transformStyle: 'preserve-3d' });
    gsap.set(shoeWrapper, { transformStyle: 'preserve-3d' });
    
    const loadTimeline = gsap.timeline();
    
    // Scale and fade watermark
    loadTimeline.fromTo(watermark, 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out' }
    );

    // Fade up the card
    loadTimeline.fromTo(card, 
        { y: 80, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' },
        '-=1.2'
    );

    // Dynamic dynamic entry glide for the shoe
    loadTimeline.fromTo(shoeImg, 
        { x: 350, rotationY: 45, rotationZ: -12, opacity: 0, scale: 0.8 }, 
        { x: 0, rotationY: 0, rotationZ: 0, opacity: 1, scale: 1, duration: 1.6, ease: 'elastic.out(1, 0.75)' },
        '-=0.8'
    );

    // Soft fade in for shadow
    loadTimeline.fromTo(shadowGlow,
        { scaleX: 0.3, opacity: 0 },
        { scaleX: 1, opacity: 0.7, duration: 1.2, ease: 'power2.out' },
        '-=1.4'
    );

    // Staggered load for left column contents
    loadTimeline.from('.brand-tag, .shoe-title, .price-tag, .shoe-description, .size-selector-wrap, .action-buttons-wrap', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out'
    }, '-=1.2');

    // 2. Hover Floating Physics (Idle loop)
    // Runs when not interacting or resets smoothly
    let idleTween: gsap.core.Tween;
    
    function startIdleFloat() {
        if (idleTween) idleTween.kill();
        idleTween = gsap.to(shoeImg, {
            y: -14,
            duration: 2.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            overwrite: 'auto'
        });
    }
    
    // Start floating right after entrance finishes
    loadTimeline.add(() => {
        startIdleFloat();
    });

    // 3. Parallax Mouse Move Event
    let isTransitioning = false;

    function handleMouseMove(e: MouseEvent) {
        if (isTransitioning) return;

        const rect = card!.getBoundingClientRect();
        
        // Calculate normalized mouse coords (-1 to 1) relative to card center
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        
        const normX = mouseX / (rect.width / 2);
        const normY = mouseY / (rect.height / 2);

        // Pause/adjust the idle animation so mouse takes control over Y-axis smoothly
        if (idleTween && idleTween.isActive()) {
            idleTween.pause();
        }

        // Parallax Shoe rotations & translation
        gsap.to(shoeWrapper, {
            rotationY: normX * 18,   // Horizontal tilt
            rotationX: -normY * 12,  // Vertical tilt
            x: normX * 25,           // Light horizontal glide
            y: normY * 15,           // Light vertical glide
            duration: 0.6,
            ease: 'power1.out',
            overwrite: 'auto'
        });

        // Parallax Shadow (Opposite direction to match depth)
        gsap.to(shadowGlow, {
            x: `calc(-50% + ${normX * -15}px)`,
            scaleX: 1 - Math.abs(normY) * 0.12,
            opacity: 0.7 - Math.abs(normY) * 0.1,
            duration: 0.6,
            ease: 'power1.out',
            overwrite: 'auto'
        });

        // Parallax Watermark text (Subtle, slow background shift)
        gsap.to(watermark, {
            x: normX * -30,
            y: normY * -15,
            duration: 1.0,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    }

    function handleMouseLeave() {
        if (isTransitioning) return;

        // Animate elements back to neutral center state
        gsap.to(shoeWrapper, {
            rotationY: 0,
            rotationX: 0,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
            onComplete: () => {
                // Resume idle floating physics
                startIdleFloat();
            }
        });

        gsap.to(shadowGlow, {
            x: '-50%',
            scaleX: 1,
            opacity: 0.7,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto'
        });

        gsap.to(watermark, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    }

    // Attach listeners to the card container
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    // 4. Dynamic Color Swatch Swap Logic
    swatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            if (target.classList.contains('active') || isTransitioning) return;

            isTransitioning = true;
            
            // Highlight active swatch
            swatches.forEach(s => s.classList.remove('active'));
            target.classList.add('active');

            const colorName = target.getAttribute('data-color') || 'lime';
            const data = colorways[colorName];

            // Trigger click bounce on the dot itself
            gsap.fromTo(target, 
                { scale: 0.8 }, 
                { scale: 1.15, duration: 0.4, ease: 'back.out(2)' }
            );

            // Stop idle float during swap
            if (idleTween) idleTween.kill();

            // Timeline for exit and entrance of new shoe
            const swapTimeline = gsap.timeline({
                onComplete: () => {
                    isTransitioning = false;
                    startIdleFloat();
                }
            });

            // A: Shoe Transitions Out (Glide left, tilt, fade out)
            swapTimeline.to(shoeImg, {
                x: -180,
                rotationY: -45,
                rotationZ: -8,
                opacity: 0,
                scale: 0.85,
                duration: 0.4,
                ease: 'power2.in'
            });

            // B: Swap Content, Info & Background Color (Simultaneous in middle of shoe swap)
            swapTimeline.add(() => {
                // Change image source
                shoeImg.src = data.image;

                // Animate background color change smoothly
                gsap.to(document.body, {
                    backgroundColor: data.bg,
                    duration: 1.0,
                    ease: 'power2.out'
                });

                // Update text content with subtle crossfades
                if (priceText) priceText.textContent = data.price;
                if (techText) techText.textContent = data.tech;
                if (matText) matText.textContent = data.mat;
                
                // Crossfade description text
                gsap.fromTo(descText, 
                    { opacity: 0, y: 5 }, 
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', textContent: data.desc }
                );
            }, '-=0.1');

            // C: Shoe Transitions In (Glide in from right, rotate, elastic spring settles)
            swapTimeline.fromTo(shoeImg,
                { x: 220, rotationY: 45, rotationZ: 10, opacity: 0, scale: 0.9 },
                { 
                    x: 0, 
                    rotationY: 0, 
                    rotationZ: 0, 
                    opacity: 1, 
                    scale: 1, 
                    duration: 0.8, 
                    ease: 'elastic.out(1, 0.7)' 
                }
            );

            // Reset shoe shadow glow size and opacity in tandem
            swapTimeline.fromTo(shadowGlow,
                { scaleX: 0.4, opacity: 0.2 },
                { scaleX: 1, opacity: 0.7, duration: 0.6, ease: 'power2.out' },
                '-=0.6'
            );
        });
    });

    // 5. Interactive Size Selectors
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            (e.currentTarget as HTMLElement).classList.add('active');
            
            // Pop button interaction
            gsap.fromTo(e.currentTarget, 
                { scale: 0.9 }, 
                { scale: 1, duration: 0.3, ease: 'back.out(2)' }
            );
        });
    });

    // Buy Button Ripple Pop
    const buyBtn = document.getElementById('btn-buy-now');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            gsap.fromTo(buyBtn, 
                { scale: 0.95 }, 
                { scale: 1, duration: 0.4, ease: 'elastic.out(1.2, 0.5)' }
            );
        });
    }
});
