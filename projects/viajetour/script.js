document.addEventListener('DOMContentLoaded', () => {
    // Scroll event for Navbar
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        revealElements.forEach((el) => {
            const revealTop = el.getBoundingClientRect().top;

            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    // Initial check
    revealOnScroll();

    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);

    // Mobile Menu Toggle (Basic implementation)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'white';
        navLinks.style.padding = '2rem';
        navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        navLinks.style.zIndex = '999';
    });

    // Card Details Toggle
    const expandBtns = document.querySelectorAll('.expand-btn');
    expandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const details = btn.nextElementSibling;
            if (!details) return;
            
            const openText = btn.getAttribute('data-open');
            const closeText = btn.getAttribute('data-close');
            
            if (details.classList.contains('open')) {
                details.classList.remove('open');
                if (closeText) {
                    btn.innerHTML = closeText;
                } else if (!btn.hasAttribute('data-open')) {
                    btn.textContent = 'Ver más';
                }
            } else {
                details.classList.add('open');
                if (openText) {
                    btn.innerHTML = openText;
                } else if (!btn.hasAttribute('data-open')) {
                    btn.textContent = 'Ver menos';
                }
            }
        });
    });
});
