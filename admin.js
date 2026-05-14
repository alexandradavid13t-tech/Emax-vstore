/* ============================================
   EMAX Admin Dashboard JavaScript
   Product management with LocalStorage
   ============================================ */

// Admin password
const ADMIN_PASSWORD = 'Fathiu';
let isLoggedIn = false;

// ============================================
// LOGIN / AUTH
// ============================================

function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;

    if (password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        localStorage.setItem('emax_admin_logged_in', 'true');
        showDashboard();
        showToast('Welcome to Admin Dashboard!', 'success');
    } else {
        showToast('Incorrect password. Please try again.', 'error');
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
    }
}

function showDashboard() {
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    renderAdminProducts();
}

function logout() {
    isLoggedIn = false;
    localStorage.removeItem('emax_admin_logged_in');
    document.getElementById('login-overlay').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('admin-password').value = '';
    showToast('Logged out successfully', 'info');
}

function checkAuth() {
    const loggedIn = localStorage.getItem('emax_admin_logged_in');
    if (loggedIn === 'true') {
        isLoggedIn = true;
        showDashboard();
    }
}

// ============================================
// IMAGE HANDLING
// ============================================

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imgData = e.target.result;
        showImagePreview(imgData);
        // Store in a hidden field for form submission
        document.getElementById('product-image-url').value = imgData;
    };
    reader.readAsDataURL(file);
}

function handleImageUrl(url) {
    if (url.trim()) {
        showImagePreview(url);
    } else {
        clearImagePreview();
    }
}

function showImagePreview(src) {
    const preview = document.getElementById('image-preview');
    const img = document.getElementById('preview-img');
    const text = document.getElementById('preview-text');

    img.src = src;
    img.style.display = 'block';
    text.style.display = 'none';
}

function clearImagePreview() {
    const preview = document.getElementById('image-preview');
    const img = document.getElementById('preview-img');
    const text = document.getElementById('preview-text');

    img.src = '';
    img.style.display = 'none';
    text.style.display = 'flex';
    document.getElementById('product-image').value = '';
}

// ============================================
// PRODUCT FORM
// ============================================

function handleProductSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('edit-product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value.trim();
    const imageUrl = document.getElementById('product-image-url').value.trim();
    const isNew = document.getElementById('product-new').checked;

    // Default image if none provided
    const image = imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';

    const productData = {
        name,
        price,
        category,
        description,
        image,
        isNew
    };

    if (id) {
        // Update existing product
        const updated = updateProduct(parseInt(id), productData);
        if (updated) {
            showToast('Product updated successfully!', 'success');
        }
    } else {
        // Add new product
        const newProduct = addProduct(productData);
        showToast('Product added successfully!', 'success');
    }

    resetForm();
    renderAdminProducts();
}

function resetForm() {
    document.getElementById('product-form').reset();
    document.getElementById('edit-product-id').value = '';
    document.getElementById('form-title').textContent = 'Add Product';
    document.getElementById('submit-btn').innerHTML = '<i class="fas fa-save"></i> Add Product';
    document.getElementById('cancel-btn').style.display = 'none';
    clearImagePreview();
    editingProductId = null;
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingProductId = id;
    document.getElementById('edit-product-id').value = id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image-url').value = product.image;
    document.getElementById('product-new').checked = product.isNew || false;

    showImagePreview(product.image);

    document.getElementById('form-title').textContent = 'Edit Product';
    document.getElementById('submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Product';
    document.getElementById('cancel-btn').style.display = 'inline-flex';

    // Scroll to form
    document.querySelector('.admin-sidebar').scrollIntoView({ behavior: 'smooth' });
}

function confirmDeleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
        const deleted = deleteProduct(id);
        if (deleted) {
            renderAdminProducts();
            showToast('Product deleted successfully', 'info');
        }
    }
}

// ============================================
// RENDER ADMIN PRODUCTS
// ============================================

function renderAdminProducts() {
    const list = document.getElementById('admin-products-list');
    const count = document.getElementById('product-count');

    if (count) {
        count.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;
    }

    if (!list) return;

    if (products.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
                <i class="fas fa-box-open" style="font-size:3rem; margin-bottom:16px; display:block;"></i>
                <p>No products yet. Add your first product using the form.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'">
            <div class="admin-product-info">
                <h4>${product.name}</h4>
                <span>${product.category} ${product.isNew ? '• <span style="color:var(--primary);">New</span>' : ''}</span>
            </div>
            <div class="admin-product-price">$${product.price.toFixed(2)}</div>
            <div class="admin-product-actions">
                <button class="admin-btn admin-btn-edit" onclick="editProduct(${product.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-btn admin-btn-delete" onclick="confirmDeleteProduct(${product.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    checkAuth();

    // Enter key on password field
    const passwordField = document.getElementById('admin-password');
    if (passwordField) {
        passwordField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin(e);
            }
        });
        passwordField.focus();
    }
});
