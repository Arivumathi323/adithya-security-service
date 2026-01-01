/**
 * ADITHYA Security Services - Main JavaScript
 * Handles all interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Preloader.init();
    Header.init();
    MobileMenu.init();
    HeroSlider.init();
    StatsCounter.init();
    TestimonialsSlider.init();
    AOSAnimations.init();
    BackToTop.init();
    Forms.init();
});

/**
 * Preloader Module
 */
const Preloader = {
    init: function() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }, 500);
        });
    }
};

/**
 * Header Module - Scroll effects
 */
const Header = {
    init: function() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add scrolled class
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show on scroll direction (optional)
            if (currentScroll > lastScroll && currentScroll > 500) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
};

/**
 * Mobile Menu Module
 */
const MobileMenu = {
    init: function() {
        const toggle = document.getElementById('mobileToggle');
        const menu = document.getElementById('navMenu');
        
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function() {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        });

        // Handle dropdowns on mobile
        const dropdowns = document.querySelectorAll('.has-dropdown');
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });

        // Close menu on link click
        const navLinks = document.querySelectorAll('.nav-menu a:not(.has-dropdown > .nav-link)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
};

/**
 * Hero Slider Module
 */
const HeroSlider = {
    currentSlide: 1,
    totalSlides: 3,
    autoPlayInterval: null,
    
    init: function() {
        const slider = document.querySelector('.hero-slider');
        if (!slider) return;

        this.bindEvents();
        this.startAutoPlay();
    },

    bindEvents: function() {
        // Next/Prev buttons
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Dots
        const dots = document.querySelectorAll('.slider-dots .dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideNum = parseInt(dot.dataset.slide);
                this.goToSlide(slideNum);
            });
        });

        // Pause on hover
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', () => this.stopAutoPlay());
            hero.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    },

    goToSlide: function(num) {
        // Update slides
        const slides = document.querySelectorAll('.hero-slide');
        slides.forEach(slide => {
            slide.classList.remove('active');
            if (parseInt(slide.dataset.slide) === num) {
                slide.classList.add('active');
            }
        });

        // Update dots
        const dots = document.querySelectorAll('.slider-dots .dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (parseInt(dot.dataset.slide) === num) {
                dot.classList.add('active');
            }
        });

        this.currentSlide = num;
    },

    nextSlide: function() {
        const next = this.currentSlide >= this.totalSlides ? 1 : this.currentSlide + 1;
        this.goToSlide(next);
    },

    prevSlide: function() {
        const prev = this.currentSlide <= 1 ? this.totalSlides : this.currentSlide - 1;
        this.goToSlide(prev);
    },

    startAutoPlay: function() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 6000);
    },

    stopAutoPlay: function() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
};

/**
 * Stats Counter Animation
 */
const StatsCounter = {
    init: function() {
        const stats = document.querySelectorAll('.stat-number');
        if (stats.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    },

    animateCounter: function(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
};

/**
 * Testimonials Slider
 */
const TestimonialsSlider = {
    currentTestimonial: 1,
    totalTestimonials: 3,
    autoPlayInterval: null,

    init: function() {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;

        this.bindEvents();
        this.startAutoPlay();
    },

    bindEvents: function() {
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const testimonialNum = parseInt(dot.dataset.testimonial);
                this.goToTestimonial(testimonialNum);
            });
        });
    },

    goToTestimonial: function(num) {
        const cards = document.querySelectorAll('.testimonial-card');
        cards.forEach(card => {
            card.classList.remove('active');
            if (parseInt(card.dataset.testimonial) === num) {
                card.classList.add('active');
            }
        });

        const dots = document.querySelectorAll('.testimonial-dots .dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (parseInt(dot.dataset.testimonial) === num) {
                dot.classList.add('active');
            }
        });

        this.currentTestimonial = num;
    },

    nextTestimonial: function() {
        const next = this.currentTestimonial >= this.totalTestimonials ? 1 : this.currentTestimonial + 1;
        this.goToTestimonial(next);
    },

    startAutoPlay: function() {
        this.autoPlayInterval = setInterval(() => this.nextTestimonial(), 5000);
    }
};

/**
 * AOS-like Scroll Animations
 */
const AOSAnimations = {
    init: function() {
        const elements = document.querySelectorAll('[data-aos]');
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add delay if specified
                    const delay = entry.target.dataset.aosDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, delay);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => observer.observe(el));
    }
};

/**
 * Back to Top Button
 */
const BackToTop = {
    init: function() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

/**
 * Form Handling
 */
const Forms = {
    init: function() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        });
    },

    handleSubmit: function(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Simple validation
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                field.addEventListener('input', () => field.classList.remove('error'), { once: true });
            }
        });

        if (isValid) {
            // Show success message
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.disabled = true;

            setTimeout(() => {
                form.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 3000);
        }
    }
};

/**
 * Smooth Scroll for Anchor Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
