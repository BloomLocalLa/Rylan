/**
 * RPL Entertainment - Wedding DJ Website
 * JavaScript for interactivity and HoneyBook integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initContactForm();
    initAnimations();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Scroll effects and animations
 */
function initScrollEffects() {
    // Parallax effect for hero (if supported)
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    }

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPos = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Contact form handling
 * Note: This is a fallback form. Replace with HoneyBook embed for production.
 */
function initContactForm() {
    const form = document.getElementById('fallback-contact-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            // In production, this should either:
            // 1. Be replaced by HoneyBook embed
            // 2. Send to a backend endpoint
            // 3. Use a form service like Formspree, Netlify Forms, etc.

            setTimeout(function() {
                // Show success message
                showFormMessage('success', 'Thank you! We\'ll be in touch within 24 hours.');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);

            console.log('Form submitted:', data);
        });
    }
}

/**
 * Show form submission message
 */
function showFormMessage(type, message) {
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 4px;
        text-align: center;
        font-weight: 500;
        animation: fadeIn 0.3s ease;
        ${type === 'success'
            ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
            : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
    `;
    messageEl.textContent = message;

    // Insert at top of form
    const form = document.getElementById('fallback-contact-form');
    form.insertBefore(messageEl, form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageEl.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);
}

/**
 * Initialize scroll animations
 */
function initAnimations() {
    // Add fade-in class to sections
    const animatedElements = document.querySelectorAll(
        '.about-content, .about-image, .service-card, .gallery-item, .testimonial-card, .faq-item'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * HoneyBook Integration Helpers
 *
 * To integrate HoneyBook:
 *
 * 1. EMBEDDED FORM (Recommended):
 *    - Log into HoneyBook
 *    - Go to Tools > Contact Forms
 *    - Create or select a form
 *    - Click "Embed" and copy the code
 *    - Replace the fallback form in index.html with the embed code
 *
 * 2. POPUP FORM:
 *    Use the function below to trigger a HoneyBook popup
 *    Call: openHoneyBookPopup('YOUR_COMPANY_ID')
 *
 * 3. BUTTON LINK:
 *    Direct users to your HoneyBook hosted page
 *    https://www.honeybook.com/widget/YOUR_COMPANY_ID/contact
 */

function openHoneyBookPopup(companyId) {
    // Check if HoneyBook widget is loaded
    if (typeof HB !== 'undefined' && HB.showWidget) {
        HB.showWidget({
            companyId: companyId,
            type: 'contact_form'
        });
    } else {
        // Fallback: open in new tab
        window.open(`https://www.honeybook.com/widget/${companyId}/contact`, '_blank');
    }
}

/**
 * Initialize HoneyBook embed
 * Call this function after setting your company ID
 */
function initHoneyBook(companyId) {
    const container = document.getElementById('honeybook-form');
    if (!container) return;

    // Hide fallback form
    const fallbackForm = document.getElementById('fallback-contact-form');
    if (fallbackForm) {
        fallbackForm.style.display = 'none';
    }

    // Create HoneyBook embed script
    const script = document.createElement('script');
    script.src = 'https://widget.honeybook.com/widget_embed.js';
    script.setAttribute('data-companyId', companyId);
    script.setAttribute('data-widgetType', 'contact_form');
    container.appendChild(script);
}

// Uncomment and add your HoneyBook company ID to enable:
// initHoneyBook('YOUR_HONEYBOOK_COMPANY_ID');

/**
 * CSS for form messages (add to style.css or keep here)
 */
const formMessageStyles = document.createElement('style');
formMessageStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(formMessageStyles);
