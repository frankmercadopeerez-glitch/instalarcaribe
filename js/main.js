document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration ---
    const CONFIG = {
        animationThreshold: 0.1,
        particles: {
            count: 50,
            color: 'rgba(255, 255, 255, 0.5)',
            connectionDistance: 100
        }
    };

    // --- Mobile Menu Logic ---
    const initMobileMenu = () => {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (!menuButton || !mobileMenu) return;

        const toggleMenu = () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                // Small delay to allow display:block to apply before opacity transition
                setTimeout(() => {
                    mobileMenu.classList.remove('opacity-0', '-translate-y-4');
                }, 10);
            } else {
                mobileMenu.classList.add('opacity-0', '-translate-y-4');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300); // Match transition duration
            }
        };

        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('opacity-0', '-translate-y-4');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            });
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && 
                !mobileMenu.contains(e.target) && 
                !menuButton.contains(e.target)) {
                toggleMenu();
            }
        });
    };

    // --- Scroll Animations ---
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.animate-fade-in-up, .animate-slide-in-left, .animate-slide-in-right');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: CONFIG.animationThreshold });

            animatedElements.forEach(el => observer.observe(el));
        } else {
            animatedElements.forEach(el => el.classList.add('is-visible'));
        }
    };

    // --- Navbar Scroll Effect ---
    const initNavbarScroll = () => {
        const header = document.getElementById('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-lg', 'bg-white/95');
                header.classList.remove('py-4');
                header.classList.add('py-2');
            } else {
                header.classList.remove('shadow-lg', 'bg-white/95');
                header.classList.add('py-4');
                header.classList.remove('py-2');
            }
        });
    };

    // --- Hero Particles Effect ---
    const initParticles = () => {
        const canvas = document.getElementById('hero-particles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = CONFIG.particles.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < CONFIG.particles.count; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONFIG.particles.connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / CONFIG.particles.connectionDistance)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });

        resizeCanvas();
        createParticles();
        animate();
    };

    // --- Form Handling ---
    const initForm = () => {
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');

        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            formStatus.textContent = 'Enviando mensaje...';
            formStatus.className = 'text-center mt-4 text-orange-500 font-medium';

            // Simulate API call
            setTimeout(() => {
                formStatus.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
                formStatus.className = 'text-center mt-4 text-green-500 font-bold';
                contactForm.reset();
                
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }, 1500);
        });
    };

    // --- Footer Year ---
    const initFooter = () => {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    };

    // --- Initialization ---
    initMobileMenu();
    initScrollAnimations();
    initNavbarScroll();
    initParticles();
    initForm();
    initFooter();
});
