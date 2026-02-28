/**
 * RPL Entertainment - Award-Winning Website
 * Premium animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
});

/**
 * Preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progress = document.getElementById('preloaderProgress');

    if (!preloader) {
        initApp();
        return;
    }

    let count = 0;
    const duration = 2000;
    const interval = duration / 100;

    const timer = setInterval(() => {
        count++;
        if (progress) progress.style.width = `${count}%`;

        if (count >= 100) {
            clearInterval(timer);

            gsap.to(preloader, {
                opacity: 0,
                duration: 0.6,
                delay: 0.3,
                ease: 'power2.inOut',
                onComplete: () => {
                    preloader.classList.add('hidden');
                    initApp();
                    animateHero();
                }
            });
        }
    }, interval);
}

/**
 * Initialize App
 */
function initApp() {
    initLenis();
    initCursor();
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initMagnetic();
}

/**
 * Lenis Smooth Scroll
 */
let lenis;
function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
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

    // Anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    lenis.scrollTo(target, { offset: -100 });
                }
            }
        });
    });
}

/**
 * Custom Cursor
 */
function initCursor() {
    const cursor = document.getElementById('cursor');
    const cursorBall = document.querySelector('.cursor-ball');
    const cursorText = document.querySelector('.cursor-text');

    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        ballX += (mouseX - ballX) * 0.15;
        ballY += (mouseY - ballY) * 0.15;

        gsap.set(cursorBall, {
            x: ballX - 6,
            y: ballY - 6
        });

        if (cursorText) {
            gsap.set(cursorText, {
                x: ballX,
                y: ballY
            });
        }

        requestAnimationFrame(animate);
    }
    animate();

    // Hover states
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Active states with text
    document.querySelectorAll('[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            if (cursorText) cursorText.textContent = el.dataset.cursor;
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
    });
    document.addEventListener('mouseenter', () => {
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
    });
}

/**
 * Header Scroll Effect
 */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Hero Animation
 */
function animateHero() {
    const words = document.querySelectorAll('.hero-title .word');
    const badge = document.querySelector('.hero-badge');
    const tagline = document.querySelector('.hero-tagline');
    const ctas = document.querySelector('.hero-ctas');
    const stats = document.querySelectorAll('.stat');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');

    if (words.length) {
        gsap.to(words, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power4.out'
        });
    }

    const tl = gsap.timeline({ delay: 0.3 });

    if (badge) {
        tl.from(badge, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out'
        }, 0);
    }

    if (tagline) {
        tl.from(tagline, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out'
        }, 0.6);
    }

    if (ctas) {
        tl.from(ctas.children, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        }, 0.7);
    }

    if (stats.length) {
        tl.from(stats, {
            opacity: 0,
            x: 30,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        }, 0.8);
    }

    if (scrollIndicator) {
        tl.from(scrollIndicator, {
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, 1);
    }
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Intro section
    gsap.utils.toArray('.intro-text').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Section tags and titles
    gsap.utils.toArray('.section-tag, .section-title, .section-title-large').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // About images
    gsap.utils.toArray('.about-img').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 80,
            scale: 0.95,
            duration: 1,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });

    // Service cards
    gsap.utils.toArray('.service-card').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // Gallery items
    gsap.utils.toArray('.gallery-item').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 60,
            scale: 0.98,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // Testimonial
    const testimonialContent = document.querySelector('.testimonial-content');
    if (testimonialContent) {
        gsap.from(testimonialContent, {
            scrollTrigger: {
                trigger: testimonialContent,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out'
        });
    }

    // CTA section
    const ctaContent = document.querySelector('.cta-content');
    const ctaLogo = document.querySelector('.cta-logo');
    if (ctaContent) {
        gsap.from(ctaContent, {
            scrollTrigger: {
                trigger: ctaContent,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: 'power3.out'
        });
    }
    if (ctaLogo) {
        gsap.from(ctaLogo, {
            scrollTrigger: {
                trigger: ctaLogo,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0.8,
            rotation: -10,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    // Parallax for hero image
    const heroImg = document.querySelector('.hero-img-wrapper');
    if (heroImg) {
        gsap.to(heroImg, {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: 150,
            ease: 'none'
        });
    }

    // FAQ items (for services page)
    gsap.utils.toArray('.faq-item').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.5,
            delay: i * 0.05,
            ease: 'power3.out'
        });
    });

    // Value cards (for about page)
    gsap.utils.toArray('.value-card').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // Testimonial cards
    gsap.utils.toArray('.testimonial-card').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });
}

/**
 * Magnetic Effect
 */
function initMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.btn-primary, .btn-outline, .logo').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

/**
 * FAQ Accordion (for services page)
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

// Initialize FAQ on page load
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
});

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

        // Simulate submission
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

// Initialize contact form
document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
});
