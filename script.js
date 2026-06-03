document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-links');

    // Mobile Menu Toggle
    mobileMenu.addEventListener('click', () => {
        navList.classList.toggle('active');
        mobileMenu.classList.toggle('is-active');
    });

    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');

            // Hide mobile menu if open
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                mobileMenu.classList.remove('is-active');
            }

            // Get target section id
            const targetId = this.getAttribute('href').substring(1);

            // Hide all sections
            sections.forEach(sec => {
                sec.classList.remove('active-section');
            });

            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
            }
        });
    });

    // Handle 'Más info' buttons
    const infoBtns = document.querySelectorAll('.info-btn');
    infoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.service-card');
            
            if (card.classList.contains('expanded')) {
                card.classList.remove('expanded');
                this.textContent = 'Más info';
            } else {
                card.classList.add('expanded');
                this.textContent = 'Menos info';
            }
        });
    });


    // Add subtle parallax effect to cards on mouse move
    const cards = document.querySelectorAll('.service-card');
    
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        
        cards.forEach(card => {
            // Only apply if the section is visible
            if (card.closest('.active-section')) {
                // Limit the rotation angle
                const rotateX = Math.max(-5, Math.min(5, yAxis));
                const rotateY = Math.max(-5, Math.min(5, -xAxis));
                
                card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            }
        });
    });

    // Reset card transform on mouse out
    document.addEventListener('mouseleave', () => {
        cards.forEach(card => {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    });
});
