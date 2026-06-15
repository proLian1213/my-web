document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let currentUser = JSON.parse(localStorage.getItem('lumina_user')) || null;
    let cart = JSON.parse(localStorage.getItem('lumina_cart')) || [];
    
    // --- DOM Elements ---
    const userBtn = document.getElementById('userBtn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const cartBtn = document.getElementById('cartBtn');
    const cartCount = document.querySelector('.cart-count');
    
    const authModal = document.getElementById('authModal');
    const cartModal = document.getElementById('cartModal');
    const authClose = document.querySelector('.auth-close');
    const cartClose = document.querySelector('.cart-close');
    
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalDisplay = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    // --- Init ---
    updateUI();
    
    // --- Event Listeners ---
    
    // Modals
    userBtn.addEventListener('click', () => {
        if(currentUser) {
            if(confirm('¿Deseas cerrar sesión?')) {
                logout();
            }
        } else {
            authModal.classList.add('show');
        }
    });
    
    cartBtn.addEventListener('click', () => {
        renderCart();
        cartModal.classList.add('show');
    });
    
    authClose.addEventListener('click', () => authModal.classList.remove('show'));
    cartClose.addEventListener('click', () => cartModal.classList.remove('show'));
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if(e.target === authModal) authModal.classList.remove('show');
        if(e.target === cartModal) cartModal.classList.remove('show');
    });
    
    // Toggle Auth Forms
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });
    
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });
    
    // Authentication
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        
        // Simulating DB with localStorage
        const users = JSON.parse(localStorage.getItem('lumina_db_users')) || {};
        if(users[email]) {
            alert('El email ya está registrado.');
            return;
        }
        
        users[email] = { name, password };
        localStorage.setItem('lumina_db_users', JSON.stringify(users));
        
        // Auto login
        login(name, email);
        registerForm.reset();
        authModal.classList.remove('show');
    });
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const users = JSON.parse(localStorage.getItem('lumina_db_users')) || {};
        const user = users[email];
        
        if(user && user.password === password) {
            login(user.name, email);
            loginForm.reset();
            authModal.classList.remove('show');
        } else {
            alert('Credenciales incorrectas');
        }
    });
    
    // Cart Functionality
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const img = btn.getAttribute('data-img');
            
            addToCart({ id, name, price, img });
            
            // Visual feedback
            const originalText = btn.innerText;
            btn.innerText = '¡Añadido!';
            btn.style.backgroundColor = 'var(--text-color)';
            btn.style.color = 'white';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 1000);
        });
    });
    
    checkoutBtn.addEventListener('click', () => {
        if(cart.length === 0) {
            alert('Tu cesta está vacía.');
            return;
        }
        
        if(!currentUser) {
            alert('Por favor, inicia sesión para realizar el pago.');
            cartModal.classList.remove('show');
            authModal.classList.add('show');
            return;
        }
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        alert(`¡Gracias por tu compra, ${currentUser.name}!\n\nSe ha procesado un pago de ${total} Ⱡ usando ${paymentMethod.toUpperCase()}.\nTu pedido está en camino.`);
        
        // Clear cart
        cart = [];
        saveCart();
        updateUI();
        cartModal.classList.remove('show');
    });
    
    // --- Functions ---
    function login(name, email) {
        currentUser = { name, email };
        localStorage.setItem('lumina_user', JSON.stringify(currentUser));
        updateUI();
    }
    
    function logout() {
        currentUser = null;
        localStorage.removeItem('lumina_user');
        updateUI();
    }
    
    function addToCart(product) {
        cart.push(product);
        saveCart();
        updateUI();
    }
    
    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        updateUI();
        renderCart(); // Re-render modal contents
    }
    
    function saveCart() {
        localStorage.setItem('lumina_cart', JSON.stringify(cart));
    }
    
    function updateUI() {
        // User
        if(currentUser) {
            userNameDisplay.innerText = currentUser.name.split(' ')[0];
            userBtn.innerHTML = `<i class="fas fa-user-check"></i> <span id="userNameDisplay">${currentUser.name.split(' ')[0]}</span>`;
        } else {
            userNameDisplay.innerText = 'Perfil';
            userBtn.innerHTML = `<i class="far fa-user"></i> <span id="userNameDisplay">Perfil</span>`;
        }
        
        // Cart count
        cartCount.innerText = cart.length;
    }
    
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if(cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; padding: 2rem 0; color: var(--text-light);">Tu cesta está vacía.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.img}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            <p>${item.price} Ⱡ</p>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="window.removeCartItem(${index})"><i class="fas fa-trash"></i></button>
                `;
                cartItemsContainer.appendChild(div);
            });
        }
        
        cartTotalDisplay.innerText = `${total} Ⱡ`;
    }
    
    // Make remove globally available for inline onclick
    window.removeCartItem = removeFromCart;

    // --- Cookies Management ---
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    const rejectCookiesBtn = document.getElementById('rejectCookies');

    if (cookieBanner && acceptCookiesBtn && rejectCookiesBtn) {
        // Check if cookies are already accepted/rejected
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000); // Show after 1 second
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });

        rejectCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'false');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Live Search ---
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.classList.remove('show');
            return;
        }

        searchResults.innerHTML = ''; // Clear previous results
        let matchCount = 0;

        // Gather all products
        const allProducts = [];
        document.querySelectorAll('.product-card').forEach(card => {
            allProducts.push({
                title: card.querySelector('h3').innerText,
                category: card.querySelector('.category').innerText,
                price: card.querySelector('.current-price').innerText,
                img: card.querySelector('img').src,
                element: card // To optionally scroll to it
            });
        });
        
        document.querySelectorAll('.full-slide').forEach(slide => {
            allProducts.push({
                title: slide.querySelector('h3').innerText,
                category: slide.querySelector('.category').innerText,
                price: slide.querySelector('.current-price').innerText,
                img: slide.querySelector('img').src,
                element: slide
            });
        });

        // Filter and display
        allProducts.forEach(product => {
            if (product.title.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)) {
                matchCount++;
                const itemDiv = document.createElement('div');
                itemDiv.className = 'search-result-item';
                itemDiv.innerHTML = `
                    <img src="${product.img}" alt="${product.title}">
                    <div class="search-result-info">
                        <h4>${product.title}</h4>
                        <p>${product.category} - ${product.price}</p>
                    </div>
                `;
                
                // Click to scroll to product
                itemDiv.addEventListener('click', () => {
                    product.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    searchResults.classList.remove('show');
                    searchInput.value = '';
                });

                searchResults.appendChild(itemDiv);
            }
        });

        if (matchCount === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No se encontraron productos.</div>';
        }

        searchResults.classList.add('show');
    }

    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('show');
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });
    }

    // --- Slider Dots Sync ---
    const slider = document.querySelector('.full-width-slider');
    const dots = document.querySelectorAll('.slider-dots .dot');

    if (slider && dots.length > 0) {
        // Sync dots on scroll
        slider.addEventListener('scroll', () => {
            const slideWidth = slider.clientWidth;
            const scrollLeft = slider.scrollLeft;
            // Calculate current index based on scroll position (round to nearest slide)
            const index = Math.round(scrollLeft / slideWidth);
            
            // Update active dot
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });

        // Click on dot to scroll to slide
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const slideWidth = slider.clientWidth;
                slider.scrollTo({
                    left: slideWidth * index,
                    behavior: 'smooth'
                });
            });
        });
    }
});
