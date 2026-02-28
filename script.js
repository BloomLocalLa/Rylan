/**
 * RPL Entertainment - Award-Winning Website
 * Advanced interactions, animations, and effects
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
});

// After preloader completes
function initApp() {
    initLenis();
    initCursor();
    initNavigation();
    initHeroAnimations();
    initScrollAnimations();
    initParticles();
    initTestimonials();
    initFAQ();
    initMagnetic();
    initContactForm();
    initCountUp();
}

/**
 * Preloader
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.preloader-progress');
    const counter = document.querySelector('.preloader-counter');

    let count = 0;
    const duration = 2000;
    const interval = duration / 100;

    const timer = setInterval(() => {
        count++;
        counter.textContent = count;
        progress.style.width = `${count}%`;

        if (count >= 100) {
            clearInterval(timer);

            gsap.to(preloader, {
                yPercent: -100,
                duration: 0.8,
                ease: 'power4.inOut',
                delay: 0.3,
                onComplete: () => {
                    preloader.style.display = 'none';
                    initApp();
                }
            });
        }
    }, interval);
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

    // Connect to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: -80 });
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

    // Smooth outline follow
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        gsap.set(cursorOutline, { x: outlineX, y: outlineY });
        gsap.set(cursorText, { x: outlineX, y: outlineY });

        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, [data-magnetic]');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Text cursor for work items
    const workItems = document.querySelectorAll('[data-cursor-text]');
    workItems.forEach(item => {
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

    // Scroll effect
    ScrollTrigger.create({
        start: 'top -100',
        onUpdate: (self) => {
            if (self.direction === 1) {
                nav.classList.add('scrolled');
            }
            if (self.progress === 0) {
                nav.classList.remove('scrolled');
            }
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Hero Animations
 */
function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Animate title words
    tl.to('.title-word', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1
    })
    .to('.hero-label', {
        y: 0,
        opacity: 1,
        duration: 0.8
    }, '-=0.8')
    .to('.hero-description', {
        y: 0,
        opacity: 1,
        duration: 0.8
    }, '-=0.6')
    .to('.hero-cta', {
        y: 0,
        opacity: 1,
        duration: 0.8
    }, '-=0.6')
    .to('.stat-item', {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1
    }, '-=0.6');
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    // Section headers
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        });
    });

    // Section labels
    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.from(label, {
            scrollTrigger: {
                trigger: label,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power4.out'
        });
    });

    // Work items
    gsap.utils.toArray('.work-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 80,
            opacity: 0,
            duration: 1,
            delay: i * 0.1,
            ease: 'power4.out'
        });
    });

    // About section
    gsap.from('.about-left', {
        scrollTrigger: {
            trigger: '.about-content',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
    });

    gsap.from('.about-right', {
        scrollTrigger: {
            trigger: '.about-content',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        x: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power4.out'
    });

    // Image reveal
    gsap.from('.image-reveal img', {
        scrollTrigger: {
            trigger: '.about-image',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        scale: 1.2,
        duration: 1.5,
        ease: 'power4.out'
    });

    // Service items
    gsap.utils.toArray('.service-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power4.out'
        });
    });

    // FAQ items
    gsap.utils.toArray('.faq-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.05,
            ease: 'power4.out'
        });
    });

    // Contact section
    gsap.from('.contact-left', {
        scrollTrigger: {
            trigger: '.contact-inner',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
    });

    gsap.from('.contact-form-wrapper', {
        scrollTrigger: {
            trigger: '.contact-inner',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power4.out'
    });

    // Parallax effects
    gsap.utils.toArray('.work-image img').forEach(img => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.closest('.work-item'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: -50,
            ease: 'none'
        });
    });
}

/**
 * Particle Background
 */
function initParticles() {
    const canvas = document.getElementById('visualizer');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 162, 39, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Connect nearby particles
    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(201, 162, 39, ${0.1 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connect();
        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * Testimonials Slider
 */
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');

    if (!testimonials.length) return;

    let current = 0;
    const total = testimonials.length;

    function showTestimonial(index) {
        testimonials.forEach((t, i) => {
            t.classList.remove('active');
            dots[i].classList.remove('active');
        });

        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function next() {
        current = (current + 1) % total;
        showTestimonial(current);
    }

    function prev() {
        current = (current - 1 + total) % total;
        showTestimonial(current);
    }

    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            current = i;
            showTestimonial(current);
        });
    });

    // Auto-play
    setInterval(next, 5000);
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');

        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

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
    const magneticElements = document.querySelectorAll('[data-magnetic]');

    if (window.matchMedia('(pointer: coarse)').matches) return;

    magneticElements.forEach(el => {
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
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach(counter => {
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
        const originalText = btn.querySelector('.btn-text').textContent;

        // Show loading
        btn.querySelector('.btn-text').textContent = 'Sending...';
        btn.disabled = true;

        // Simulate submission (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success state
        btn.querySelector('.btn-text').textContent = 'Sent!';
        btn.style.background = '#22c55e';

        // Reset form
        form.reset();

        // Reset button after delay
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
}

/**
 * HoneyBook Integration
 * Uncomment and add your company ID to enable
 */
function initHoneyBook(companyId) {
    const container = document.getElementById('honeybook-form');
    const fallbackForm = document.getElementById('contact-form');

    if (!container || !companyId) return;

    // Hide fallback form
    if (fallbackForm) {
        fallbackForm.style.display = 'none';
    }

    // Create HoneyBook embed
    const script = document.createElement('script');
    script.src = 'https://widget.honeybook.com/widget_embed.js';
    script.setAttribute('data-companyId', companyId);
    script.setAttribute('data-widgetType', 'contact_form');
    container.appendChild(script);
}

// To enable HoneyBook, call:
// initHoneyBook('YOUR_HONEYBOOK_COMPANY_ID');
