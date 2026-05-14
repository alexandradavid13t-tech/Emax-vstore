/* ============================================
   EMAX E-Commerce - Main JavaScript
   Premium functionality with smooth animations
   ============================================ */

// ============================================
// DATA & STATE
// ============================================

// Default products (seed data)
const defaultProducts = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 299.99,
        category: "electronics",
        description: "Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        isNew: true
    },
    {
        id: 2,
        name: "Luxury Leather Watch",
        price: 499.99,
        category: "accessories",
        description: "Handcrafted genuine leather watch with Swiss movement. Water-resistant up to 50m with sapphire crystal glass. A timeless piece for the modern gentleman.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
        isNew: false
    },
    {
        id: 3,
        name: "Designer Sunglasses",
        price: 189.99,
        category: "fashion",
        description: "UV400 protection polarized lenses in a sleek titanium frame. Lightweight and durable, perfect for any occasion from beach to boardroom.",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
        isNew: true
    },
    {
        id: 4,
        name: "Smart Home Speaker",
        price: 149.99,
        category: "electronics",
        description: "Voice-controlled smart speaker with premium sound quality. Compatible with all major smart home ecosystems. Control your home with just your voice.",
        image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=600&q=80",
        isNew: false
    },
    {
        id: 5,
        name: "Premium Sneakers",
        price: 249.99,
        category: "fashion",
        description: "Limited edition premium sneakers crafted with Italian leather. Cushioned sole technology provides all-day comfort with street-style aesthetics.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
        isNew: true
    },
    {
        id: 6,
        name: "Minimalist Desk Lamp",
        price: 129.99,
        category: "home",
        description: "Adjustable LED desk lamp with wireless charging base. Touch-sensitive controls with 5 brightness levels and 3 color temperatures.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
        isNew: false
    },
    {
        id: 7,
        name: "Leather Messenger Bag",
        price: 349.99,
        category: "accessories",
        description: "Full-grain leather messenger bag with laptop compartment. Hand-stitched details with brass hardware. The perfect companion for work and travel.",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
        isNew: false
    },
    {
        id: 8,
        name: "Ceramic Vase Set",
        price: 89.99,
        category: "home",
        description: "Handcrafted ceramic vase set in matte finish. Three-piece collection perfect for modern home decor. Each piece is unique with subtle variations.",
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80",
        isNew: true
    }
];

// App State
let products = [];
let cart = [];
let currentFilter = 'all';
let currentSearch = '';
let editingProductId = null;

// ============================================
// LOCAL STORAGE
// ============================================

function loadProducts() {
    const stored = localStorage.getItem('emax_products');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = [...defaultProducts];
        saveProducts();
    }
}

function saveProducts() {
    localStorage.setItem('emax_products', JSON.stringify(products));
}

function loadCart() {
    const stored = localStorage.getItem('emax_cart');
    if (stored) {
        cart = JSON.parse(stored);
    }
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('emax_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = document.getElementById('cart-count');
    if (count) {
        count.textContent = cart.length;
        count.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

// ============================================
// LOADING SCREEN
// ============================================

function hideLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3500);
}

// ============================================
// THEME TOGGLE
// ============================================

function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');
    const current = html.getAttribute('data-theme');

    if (current === 'dark') {
        html.removeAttribute('data-theme');
        icon.className = 'fas fa-moon';
        localStorage.setItem('emax_theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
        localStorage.setItem('emax_theme', 'dark');
    }
}

function initTheme() {
    const saved = localStorage.getItem('emax_theme');
    const icon = document.getElementById('theme-icon');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (icon) icon.className = 'fas fa-sun';
    }
}

// ============================================
// NAVIGATION
// ============================================

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
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

function toggleSidebar() {
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

// ============================================
// SEARCH
// ============================================

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput) {
        // Toggle search input on button click
        searchBtn.addEventListener('click', () => {
            searchInput.classList.toggle('active');
            if (searchInput.classList.contains('active')) {
                searchInput.focus();
            }
        });

        // Search on input
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            renderProducts();
        });

        // Close search on escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.classList.remove('active');
                searchInput.value = '';
                currentSearch = '';
                renderProducts();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.classList.toggle('active');
        if (searchInput.classList.contains('active')) {
            searchInput.focus();
        }
    }
}

// ============================================
// PRODUCTS
// ============================================

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    if (!grid) return;

    let filtered = products;

    // Filter by category
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter);
    }

    // Filter by search
    if (currentSearch) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(currentSearch) ||
            p.description.toLowerCase().includes(currentSearch) ||
            p.category.toLowerCase().includes(currentSearch)
        );
    }

    // Show/hide no results
    if (filtered.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        noResults.style.display = 'none';
    }

    grid.innerHTML = filtered.map(product => `
        <div class="product-card reveal">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.isNew ? '<span class="product-badge">New Arrival</span>' : ''}
                <div class="product-actions">
                    <button class="product-action-btn" onclick="addToCart(${product.id})" title="Add to Cart">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                    <button class="product-action-btn" onclick="openModal(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <div class="product-buttons">
                        <a href="https://wa.me/2349066542856?text=Hello%20EMAX,%20I%20want%20to%20buy%20this%20product:%20${encodeURIComponent(product.name)}" 
                           class="btn-buy" target="_blank">
                            <i class="fab fa-whatsapp"></i> Buy Now
                        </a>
                        <button class="btn-view" onclick="openModal(${product.id})">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Update category counts
    updateCategoryCounts();

    // Re-init scroll reveal for new elements
    setTimeout(initScrollReveal, 100);
}

function filterProducts(category) {
    currentFilter = category;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });

    // Scroll to products section
    const section = document.getElementById('featured');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }

    renderProducts();
}

function updateCategoryCounts() {
    const categories = ['electronics', 'fashion', 'accessories', 'home'];
    categories.forEach(cat => {
        const count = products.filter(p => p.category === cat).length;
        const el = document.getElementById(`cat-${cat}`);
        if (el) el.textContent = `${count} items`;
    });
}

// ============================================
// PRODUCT MODAL
// ============================================

function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-img').alt = product.name;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modal-desc').textContent = product.description;

    const buyBtn = document.getElementById('modal-buy');
    buyBtn.href = `https://wa.me/2349066542856?text=Hello%20EMAX,%20I%20want%20to%20buy%20this%20product:%20${encodeURIComponent(product.name)}`;

    const modal = document.getElementById('product-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on overlay click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeCart();
    }
});

// ============================================
// CART
// ============================================

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    cart.push(product);
    saveCart();
    showToast(`${product.name} added to cart!`, 'success');
}

function showCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    const body = document.getElementById('cart-body');

    if (cart.length === 0) {
        body.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-basket"></i>
                </div>
                <p>Your cart is empty</p>
                <span>Browse our premium collection</span>
            </div>
        `;
    } else {
        body.innerHTML = cart.map((item, index) => `
            <div class="cart-item" style="display:flex; gap:16px; padding:16px; border-bottom:1px solid var(--border); align-items:center;">
                <img src="${item.image}" alt="${item.name}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;">
                <div style="flex:1;">
                    <h4 style="font-size:0.9rem; margin-bottom:4px;">${item.name}</h4>
                    <span style="color:var(--primary); font-weight:700;">$${item.price.toFixed(2)}</span>
                </div>
                <button onclick="removeFromCart(${index})" style="width:32px; height:32px; border-radius:50%; background:#ef4444; color:white; display:flex; align-items:center; justify-content:center;">
                    <i class="fas fa-trash" style="font-size:0.8rem;"></i>
                </button>
            </div>
        `).join('');
    }

    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    showCart();
    showToast('Item removed from cart', 'info');
}

// ============================================
// PARTICLES
// ============================================

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ============================================
// SCROLL REVEAL
// ============================================

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// ============================================
// CONTACT FORM
// ============================================

function handleContactSubmit(e) {
    e.preventDefault();
    showToast('Message sent successfully! We will get back to you soon.', 'success');
    e.target.reset();
}

// ============================================
// ADMIN FUNCTIONS (shared)
// ============================================

function getNextProductId() {
    return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

function addProduct(productData) {
    const newProduct = {
        id: getNextProductId(),
        ...productData
    };
    products.push(newProduct);
    saveProducts();
    return newProduct;
}

function updateProduct(id, updates) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        saveProducts();
        return products[index];
    }
    return null;
}

function deleteProduct(id) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        const deleted = products.splice(index, 1)[0];
        saveProducts();
        return deleted;
    }
    return null;
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCart();
    initTheme();
    initNavbar();
    initSearch();
    initParticles();
    renderProducts();
    initScrollReveal();
    hideLoadingScreen();
});
