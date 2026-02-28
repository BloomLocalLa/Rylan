/**
 * RPL Entertainment - Multi-Page Website
 * Award-winning interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on homepage (has preloader)
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        initPreloader();
    } else {
        initApp();
    }
});

/**
 * Preloader (homepage only)
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.preloader-progress');

    let count = 0;
    const duration = 1500;
    const interval = duration / 100;

    const timer = setInterval(() => {
        count++;
        if (progress) progress.style.width = `${count}%`;

        if (count >= 100) {
            clearInterval(timer);

            gsap.to(preloader, {
                yPercent: -100,
                duration: 0.8,
                ease: 'power4.inOut',
                delay: 0.2,
                onComplete: () => {
                    preloader.style.display = 'none';
                    initApp();
                }
            });
        }
    }, interval);
}

/**
 * Initialize all app components
 */
function initApp() {
    initLenis();
    initCursor();
    initNavigation();
    initAnimations();
    initFAQ();
    initMagnetic();
    initContactForm();
    initCountUp();
}

/**
 * Lenis Smooth Scroll
 */
let lenis;
function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    lenis.scrollTo(target, { offset: -80 });
                }
            }
        });
    });
}

/**
 * Custom Cursor
 */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorText = document.querySelector('.cursor-text');

    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        gsap.to(cursorDot, {
            x: mouseX,
            y: mouseY,
            duration: 0.1
        });
    });

    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        gsap.set(cursorOutline, { x: outlineX, y: outlineY });
        gsap.set(cursorText, { x: outlineX, y: outlineY });

        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover effects
    document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Text cursor for gallery/work items
    document.querySelectorAll('[data-cursor-text]').forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.classList.add('text');
            cursorText.textContent = item.dataset.cursorText;
        });
        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('text');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        gsap.to(cursor, { opacity: 0, duration: 0.3 });
    });
    document.addEventListener('mouseenter', () => {
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
    });
}

/**
 * Navigation
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Scroll effect (only if not already scrolled class)
    if (!nav.classList.contains('scrolled')) {
        ScrollTrigger.create({
            start: 'top -100',
            onUpdate: (self) => {
                if (self.direction === 1 || window.scrollY > 100) {
                    nav.classList.add('scrolled');
                }
                if (self.progress === 0 && window.scrollY <= 100) {
                    nav.classList.remove('scrolled');
                }
            }
        });
    }

    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

/**
 * Scroll Animations
 */
function initAnimations() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Fade in elements
    gsap.utils.toArray('.section-title, .section-label, .page-title').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Service cards, value cards, etc.
    gsap.utils.toArray('.service-card, .value-card, .testimonial-card, .stat-card').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // Gallery items
    gsap.utils.toArray('.gallery-item, .work-item, .work-main').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.05,
            ease: 'power3.out'
        });
    });

    // Service blocks
    gsap.utils.toArray('.service-block').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // FAQ items
    gsap.utils.toArray('.faq-item').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.5,
            delay: i * 0.05,
            ease: 'power3.out'
        });
    });

    // Parallax images
    gsap.utils.toArray('.work-main img, .work-item img').forEach(img => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.closest('.work-main, .work-item'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: -30,
            ease: 'none'
        });
    });
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            // Open clicked if wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Magnetic Elements
 */
function initMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

/**
 * Count Up Animation
 */
function initCountUp() {
    if (typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('[data-count]').forEach(counter => {
        const target = parseInt(counter.dataset.count);

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerText: 1 },
                    onUpdate: function() {
                        counter.textContent = Math.round(this.targets()[0].innerText);
                    }
                });
            }
        });
    });
}

/**
 * Contact Form
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn-submit');
        if (!btn) return;

        const btnText = btn.querySelector('.btn-text');
        const originalText = btnText ? btnText.textContent : 'Send';

        // Show loading
        if (btnText) btnText.textContent = 'Sending...';
        btn.disabled = true;

        // Simulate submission (replace with actual endpoint or HoneyBook)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success state
        if (btnText) btnText.textContent = 'Sent!';
        btn.style.background = '#22c55e';

        // Reset form
        form.reset();

        // Reset button
        setTimeout(() => {
            if (btnText) btnText.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
}

/**
 * HoneyBook Integration
 *
 * To enable HoneyBook:
 * 1. Get your company ID from HoneyBook
 * 2. Call initHoneyBook('YOUR_COMPANY_ID') below
 *
 * The function will:
 * - Hide the fallback form
 * - Inject the HoneyBook widget
 */
function initHoneyBook(companyId) {
    const container = document.getElementById('honeybook-form');
    const fallbackForm = document.getElementById('contact-form');

    if (!container || !companyId) return;

    // Hide fallback form
    if (fallbackForm) {
        fallbackForm.style.display = 'none';
    }

    // Create HoneyBook widget
    const script = document.createElement('script');
    script.src = 'https://widget.honeybook.com/widget_embed.js';
    script.setAttribute('data-companyId', companyId);
    script.setAttribute('data-widgetType', 'contact_form');
    container.appendChild(script);
}

// Uncomment and add your HoneyBook company ID:
// initHoneyBook('YOUR_HONEYBOOK_COMPANY_ID');
