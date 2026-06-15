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

    // Handle CTA button in hero section
    const ctaMain = document.querySelector('.cta-main');
    if (ctaMain) {
        ctaMain.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to Contact link
            const contactLink = document.querySelector('a[href="#contact"]');
            if (contactLink) contactLink.classList.add('active');

            // Hide all sections
            sections.forEach(sec => {
                sec.classList.remove('active-section');
            });

            // Show contact section
            const targetSection = document.getElementById('contact');
            if (targetSection) {
                targetSection.classList.add('active-section');
            }
        });
    }

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

    // Portfolio Modal Logic
    const modal = document.getElementById('portfolio-modal');
    const closeBtn = document.querySelector('.close-modal');
    const modalImage = document.getElementById('modal-image');
    const modalIframe = document.getElementById('modal-iframe');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalExternalLink = document.getElementById('modal-external-link');
    
    // Aquí puedes definir los datos de tus proyectos
    const projectData = {
        '1': {
            url: 'projects/viajetour/index.html',
            title: 'Agencia de Viajes "ViajeTour"',
            description: 'Desarrollo de una web interactiva para una agencia de viajes. El proyecto incluye menús desplegables tipo acordeón, animaciones 3D, un diseño moderno y responsive, y una paleta de colores vibrante.'
        },
        '2': {
            url: 'projects/gasgas/index.html',
            title: 'GasGas Payment Kiosk',
            description: 'Interfaz interactiva diseñada para un kiosco de pagos de gasolinera. Desarrollada con un diseño moderno y centrado en la experiencia del usuario (UX) para facilitar el proceso de pago e interacción.'
        },
        '3': {
            url: 'projects/e-commerce/index.html',
            title: 'Lumina Cosmetics E-Commerce',
            description: 'Desarrollo de una tienda online de cosméticos con un diseño elegante, moderno y responsivo. Incluye catálogo de productos, carrito de compras interactivo y un layout optimizado para conversiones.'
        }
    };

    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            const data = projectData[projectId];
            
            if(data) {
                if (window.innerWidth <= 768 && data.url) {
                    window.location.href = data.url;
                    return;
                }

                if (data.url) {
                    modalIframe.src = data.url;
                    modalIframe.style.display = 'block';
                    modalImage.style.display = 'none';
                    modalImage.src = '';
                    if (modalExternalLink) {
                        modalExternalLink.href = data.url;
                        modalExternalLink.style.display = 'inline-block';
                    }
                } else if (data.image) {
                    modalImage.src = data.image;
                    modalImage.style.display = 'block';
                    modalIframe.style.display = 'none';
                    modalIframe.src = '';
                    if (modalExternalLink) {
                        modalExternalLink.style.display = 'none';
                    }
                }

                modalTitle.textContent = data.title;
                modalDescription.textContent = data.description;
                
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevenir scroll del body
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restaurar scroll
        modalIframe.src = ''; // Limpiar iframe al cerrar
    });

    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            modalIframe.src = ''; // Limpiar iframe al cerrar
        }
    });
});
