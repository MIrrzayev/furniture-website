// ==========================================
// 1. ÜMUMİ İDARƏETMƏ (DOM YÜKLƏNDİKDƏ İŞƏ DÜŞÜR)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");

    if (menuToggle && navbar) {
        menuToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            navbar.classList.toggle("mobile-open");
        });

        // Səhifənin başqa yerinə kliklədikdə menyunu bağla
        document.addEventListener("click", function (event) {
            if (!navbar.contains(event.target) && !menuToggle.contains(event.target)) {
                navbar.classList.remove("mobile-open");
            }
        });
    }
});

// ==========================================
// MƏHSULLARIN YÜKLƏNMƏSİ (TƏKRARLANMANIN QARŞISI ALINIB)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("products-container");
    const productsLoading = document.getElementById("products-loading");

    if (container) {
        fetch("http://localhost:8080/products")
            .then(response => {
                if (!response.ok) throw new Error("Məhsullar yüklənmədi.");
                return response.json();
            })
            .then(products => {
                if (productsLoading) {
                    productsLoading.style.display = "none";
                }

                const isProductPage = window.location.pathname.includes("products.html");
                const visibleProducts = isProductPage ? products : products.slice(0, 3);

                if (visibleProducts.length === 0) {
                    container.innerHTML = "<p>Heç bir məhsul tapılmadı.</p>";
                    return;
                }

                // Əmin olmaq üçün əvvəlcə konteyneri tamamilə boşaldırıq
                container.innerHTML = "";

                visibleProducts.forEach(product => {
                    container.innerHTML += `
                        <article class="product-card">
                            <div class="product-image">
                                <img src="${product.image}" alt="${product.name}">
                            </div>
                            <div class="product-info">
                                <p class="product-type">${product.type}</p>
                                <h3>${product.name}</h3>
                                <div class="product-bottom">
                                    <span class="product-price">₼ ${product.price}</span>
                                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')" class="btn-buy-pill">SƏBƏTƏ AT</button>
                                </div>
                            </div>
                        </article>
                    `;
                });
            })
            .catch(error => {
                if (productsLoading) {
                    productsLoading.textContent = error.message;
                }
            });
    }
});

// ==========================================
// 3. XİDMƏTLƏRİN (SERVICES) YÜKLƏNMƏSİ (CLIENT SIDE)
// ==========================================

fetch("http://localhost:8080/services")
    .then(response => {
        if (!response.ok) {
            throw new Error("Xidmətlər yüklənmədi.");
        }
        return response.json();
    })
    .then(services => {
        const container = document.getElementById("service-container");
        const servicesLoading = document.getElementById("services-loading");
        
        if (container) {
            if(servicesLoading) {
                servicesLoading.style.display = "none";
            }
            
            if (services.length === 0) {
                container.innerHTML = "<p>Heç bir xidmət yoxdur.</p>";
                return;
            }
            
            services.forEach(service => {
                container.innerHTML += `
                    <article class="service-card">
                        <div class="service-info">
                            <p class="service-price"> ₼ ${service.price} </p>
                            <h3>${service.name}</h3>
                            <p>${service.description}</p>
                        </div>
                    </article>
                `;
            });
        }
    })
    .catch(error => {
        const servicesLoading = document.getElementById("services-loading");
        if (servicesLoading) {
            servicesLoading.textContent = error.message;
        }
    });


// ==========================================
// 4. ƏLAQƏ FORMASININ GÖNDƏRİLMƏSİ
// ==========================================

const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        if(formMessage) formMessage.textContent = "";
        
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        const formData = { name, email, message };
        
        fetch("http://localhost:8080/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        }).then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        }).then(data => {
            if(formMessage) {
                formMessage.style.color = "green";
                formMessage.textContent = "Mesajınız uğurla göndərildi.";
            }
            contactForm.reset();
        }).catch(error => {
            if(formMessage) {
                formMessage.style.color = "red";
                formMessage.textContent = error.message;
            }
        });
    });
}


// ==========================================
// 5. GİRİŞ (LOGIN) İDARƏETMƏSİ
// ==========================================

const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const loginMessage = document.getElementById("login-message");
        const loginData = { username, password };
        
        if(loginMessage) loginMessage.textContent = "";
        
        fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        }).then(response => {
            if (!response.ok) {
                throw new Error("İstifadeçi və ya şifrə yanlışdır.");
            }
            return response.text();
        }).then(token => {
            localStorage.setItem("token", token);
            window.location.href = "admin.html";
        }).catch(error => {
            if(loginMessage) loginMessage.textContent = error.message;
        });
    });
}


// ==========================================
// 6. ADMİN PANEL FUNKSİYALARI VƏ YOXLANILMALAR (PROTECTED ROUTES)
// ==========================================

const token = localStorage.getItem("token");

if (window.location.pathname.includes("admin.html")) {
    // Token yoxlaması
    if (!token) {
        window.location.href = "login.html";
    }

    // Çıxış (Logout) düyməsi
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        });
    }

    // Role (Admin/Super_Admin) yoxlanması
    if(token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const role = payload.role;
            const adminSection = document.getElementById("admin-management-section");
            
            if (role !== "SUPER_ADMIN" && adminSection) {
                adminSection.style.display = "none";
            }
            
            if (role === "SUPER_ADMIN") {
                loadSuperAdminData(token);
            }
        } catch (e) {
            console.error("Token parse error", e);
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    }

    // Admin Məhsullar Yüklənməsi
    loadAdminProducts();

    // Admin Xidmətlər Yüklənməsi
    loadAdminServices();

    // Admin Mesajlar Yüklənməsi
    loadAdminMessages(token);
}

// -------------------------------------------------------------------
// ADMİN: MƏHSULLARIN İDARƏ EDİLMƏSİ
// -------------------------------------------------------------------
function loadAdminProducts() {
    const productContainer = document.getElementById("admin-products");
    const productsLoading = document.getElementById("products-loading");
    
    if(!productContainer) return;

    fetch("http://localhost:8080/products")
        .then(response => {
            if (!response.ok) throw new Error("Məhsullar yüklənmədi.");
            return response.json();
        })
        .then(products => {
            if(productsLoading) productsLoading.style.display = "none";
            
            if (products.length === 0) {
                productContainer.textContent = "Heç bir məhsul yoxdur";
                return;
            }
            
            productContainer.innerHTML = "";
            products.forEach(product => {
                productContainer.innerHTML += `
                    <div class="admin-product">
                        <div>
                            <h3>${product.name}</h3>
                            <p>${product.type}</p>
                            <span>₼ ${product.price}</span>
                        </div>
                        <div>
                            <button onclick="editProduct(${product.id})">Edit</button>
                            <button onclick="deleteProduct(${product.id})">Delete</button>
                        </div>
                    </div>
                `;
            });
        }).catch(error => {
            if(productsLoading) productsLoading.textContent = error.message;
        });
}

const addProductButton = document.getElementById("add-product");
if (addProductButton) {
    addProductButton.addEventListener("click", function () {
        const addProductForm = document.getElementById("add-product-form");
        if(addProductForm) {
            addProductForm.innerHTML = `
                <div class="admin-edit-form">
                    <h2>Yeni məhsul əlavə et</h2>
                    <input type="text" id="add-name" placeholder="Məhsul adı">
                    <input type="text" id="add-type" placeholder="Məhsul tipi">
                    <input type="number" id="add-price" placeholder="Qiymət">
                    <input type="text" id="add-image" placeholder="Şəkil yolu">
                    <button onclick="addProduct()">Əlavə et</button>
                    <p id="add-product-message"></p>
                </div>
            `;
        }
    });
}

function addProduct() {
    const name = document.getElementById("add-name").value;
    const type = document.getElementById("add-type").value;
    const price = document.getElementById("add-price").value;
    const image = document.getElementById("add-image").value;
    const productData = { name, type, price, image };
    
    fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(productData)
    }).then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
    }).then(() => {
        location.reload();
    }).catch(error => {
        const message = document.getElementById("add-product-message");
        if(message) message.textContent = error.message;
    });
}

function deleteProduct(id) {
    const confirmDelete = confirm("Bu məhsulu silmək istədiyinizə əminsiniz?");
    if (!confirmDelete) return;

    fetch(`http://localhost:8080/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    }).then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message); });
        }
        location.reload();
    }).catch(error => {
        const message = document.getElementById("product-message");
        if(message) message.textContent = error.message;
    });
}

function editProduct(id) {
    fetch(`http://localhost:8080/products/${id}`)
        .then(response => {
            if (!response.ok) throw new Error("Məhsul tapılmadı.");
            return response.json();
        }).then(product => {
            const editForm = document.getElementById("edit-product-form");
            if(editForm) {
                editForm.innerHTML = `
                    <div class="admin-edit-form">
                        <h2>Məhsulu dəyiş</h2>
                        <input type="text" id="edit-name" value="${product.name}">
                        <input type="text" id="edit-type" value="${product.type}">
                        <input type="number" id="edit-price" value="${product.price}">
                        <input type="text" id="edit-image" value="${product.image}">
                        <button onclick="updateProduct(${product.id})">Yadda saxla</button>
                        <p id="edit-product-message"></p>
                    </div>
                `;
            }
        }).catch(error => {
            const message = document.getElementById("edit-product-message");
            if (message) message.textContent = error.message;
        });
}

function updateProduct(id) {
    const name = document.getElementById("edit-name").value;
    const type = document.getElementById("edit-type").value;
    const price = document.getElementById("edit-price").value;
    const image = document.getElementById("edit-image").value;
    const productData = { name, type, price, image };

    fetch(`http://localhost:8080/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(productData)
    }).then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
    }).then(() => {
        location.reload();
    }).catch(error => {
        const message = document.getElementById("edit-product-message");
        if(message) message.textContent = error.message;
    });
}

// -------------------------------------------------------------------
// ADMİN: XİDMƏTLƏRİN İDARƏ EDİLMƏSİ
// -------------------------------------------------------------------
function loadAdminServices() {
    const serviceContainer = document.getElementById("admin-services-list");
    const servicesLoading = document.getElementById("services-loading");
    
    if(!serviceContainer) return;

    fetch("http://localhost:8080/services")
        .then(response => {
            if (!response.ok) throw new Error("Xidmətlər yüklənmədi.");
            return response.json();
        })
        .then(services => {
            if(servicesLoading) servicesLoading.style.display = "none";
            
            if (services.length === 0) {
                serviceContainer.textContent = "Heç bir xidmət yoxdur";
                return;
            }
            serviceContainer.innerHTML = "";
            services.forEach(service => {
                serviceContainer.innerHTML += `
                    <div class="admin-service">
                        <div>
                            <h3>${service.name}</h3>
                            <p>${service.description}</p>
                            <span>₼ ${service.price}</span>
                        </div>
                        <div>
                            <button onclick="editService(${service.id})">Edit</button>
                            <button onclick="deleteService(${service.id})">Delete</button>
                        </div>
                    </div>
                `;
            });
        }).catch(error => {
            if(servicesLoading) servicesLoading.textContent = error.message;
        });
}

const addServiceButton = document.getElementById("add-service");
if (addServiceButton) {
    addServiceButton.addEventListener("click", function () {
        const addServiceForm = document.getElementById("add-service-form");
        if(addServiceForm) {
            addServiceForm.innerHTML = `
                <div class="admin-edit-form">
                    <h2>Yeni xidmət əlavə et</h2>
                    <input type="text" id="add-service-name" placeholder="Xidmət adı">
                    <input type="text" id="add-service-description" placeholder="Xidmət açıqlaması">
                    <input type="number" id="add-service-price" placeholder="Qiymət">
                    <button onclick="addService()">Əlavə et</button>
                    <p id="add-service-message"></p>
                </div>
            `;
        }
    });
}

function addService() {
    const name = document.getElementById("add-service-name").value;
    const description = document.getElementById("add-service-description").value;
    const price = document.getElementById("add-service-price").value;
    const serviceData = { name, description, price };

    fetch("http://localhost:8080/services", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(serviceData)
    }).then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
    }).then(() => {
        location.reload();
    }).catch(error => {
        const message = document.getElementById("add-service-message");
        if(message) message.textContent = error.message;
    });
}

function deleteService(id) {
    const confirmDelete = confirm("Bu xidməti silmək istədiyinizə əminsiniz?");
    if (!confirmDelete) return;

    fetch(`http://localhost:8080/services/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    }).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                if (text) {
                    const error = JSON.parse(text);
                    throw new Error(error.message);
                }
                throw new Error("Xidmət silinmədi.");
            });
        }
        location.reload();
    }).catch(error => {
        const message = document.getElementById("service-message");
        if(message) message.textContent = error.message;
    });
}

function editService(id) {
    fetch(`http://localhost:8080/services/${id}`)
        .then(response => {
            if (!response.ok) throw new Error("Xidmət tapılmadı.");
            return response.json();
        }).then(service => {
            const editForm = document.getElementById("edit-service-form");
            if(editForm) {
                editForm.innerHTML = `
                    <div class="admin-edit-form">
                        <h2>Xidməti dəyiş</h2>
                        <input type="text" id="edit-service-name" value="${service.name}">
                        <input type="text" id="edit-service-description" value="${service.description}">
                        <input type="number" id="edit-service-price" value="${service.price}">
                        <button onclick="updateService(${service.id})">Yadda saxla</button>
                        <p id="edit-service-message"></p>
                    </div>
                `;
            }
        }).catch(error => {
            const message = document.getElementById("edit-service-message");
            if (message) message.textContent = error.message;
        });
}

function updateService(id) {
    const name = document.getElementById("edit-service-name").value;
    const description = document.getElementById("edit-service-description").value;
    const price = document.getElementById("edit-service-price").value;
    const serviceData = { name, description, price };

    fetch(`http://localhost:8080/services/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(serviceData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
    }).then(() => {
        location.reload();
    }).catch(error => {
        const message = document.getElementById("edit-service-message");
        if(message) message.textContent = error.message;
    });
}


// -------------------------------------------------------------------
// ADMİN: MESAJLARIN İDARƏ EDİLMƏSİ
// -------------------------------------------------------------------
function loadAdminMessages(token) {
    const messageContainer = document.getElementById("message-list");
    if (!messageContainer) return;

    const messagesLoading = document.getElementById("messages-loading");
    
    fetch("http://localhost:8080/message", {
        headers: { "Authorization": "Bearer " + token }
    }).then(response => {
        if (!response.ok) throw new Error("Mesajlar yüklənmədi.");
        return response.json();
    }).then(messages => {
        if(messagesLoading) messagesLoading.style.display = "none";
        if (messages.length === 0) {
            messageContainer.textContent = "Heç bir mesaj yoxdur";
            return;
        }
        messageContainer.innerHTML = "";
        messages.forEach(message => {
            messageContainer.innerHTML += `
                <div class="admin-message">
                    <div class="admin-message-info">
                        <h3>${message.name}</h3>
                        <p>${message.email}</p>
                        <span>${message.createdAt}</span>
                    </div>
                    <div class="admin-message-content">
                        <p>${message.message}</p>
                    </div>
                    <div class="admin-message-actions">
                        <button class="delete-button" onclick="deleteMessage(${message.id})">Delete</button>                            
                    </div>
                </div>
            `;
        });
    }).catch(error => {
        if(messagesLoading) messagesLoading.textContent = error.message;
    });
}

function deleteMessage(id) {
    const confirmDelete = confirm("Bu mesajı silmək istədiyinizə əminsiniz?");
    if (!confirmDelete) return;

    fetch(`http://localhost:8080/message/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    }).then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message); });
        }
        location.reload();
    }).catch(error => {
        const messageError = document.getElementById("message-error");
        if(messageError) messageError.textContent = error.message;
    });
}

// -------------------------------------------------------------------
// SUPER ADMİN FUNKSİYALARI (İSTİFADƏÇİ/ADMİN YARATMA VƏ İDARƏETMƏ)
// -------------------------------------------------------------------
function loadSuperAdminData(token) {
    const adminContainer = document.getElementById("admin-list");
    if(!adminContainer) return;

    fetch("http://localhost:8080/admin", {
        headers: { "Authorization": "Bearer " + token }
    }).then(response => {
        if (!response.ok) throw new Error("Adminlər yüklənmədi.");
        return response.json();
    }).then(admins => {
        adminContainer.innerHTML = "";
        admins.forEach(admin => {
            if (admin.role === "SUPER_ADMIN") return;
            
            adminContainer.innerHTML += `
                <div class="admin-user">
                    <div class="admin-user-info">
                        <h3>${admin.username}</h3>
                        <p>${admin.role}</p>
                    </div>
                    <div class="admin-user-actions">
                        <button onclick="editAdmin(${admin.id})">Edit</button>                           
                        <button onclick="deleteAdmin(${admin.id})">Delete</button>                                                                           
                    </div>
                </div>
            `;
        });
    }).catch(error => {
        const message = document.getElementById("admin-message");
        if (message) message.textContent = error.message;
    });
}

const addAdminButton = document.getElementById("add-admin");
if (addAdminButton) {
    addAdminButton.addEventListener("click", function () {
        const addAdminForm = document.getElementById("add-admin-form");
        if(addAdminForm) {
            addAdminForm.innerHTML = `
                <div class="admin-edit-form">
                    <h2>Yeni admin əlavə et</h2>
                    <input type="text" id="add-admin-username" placeholder="Username">
                    <input type="password" id="add-admin-password" placeholder="Password">
                    <button onclick="addAdmin()">Əlavə et</button>
                    <p id="add-admin-message"></p>
                </div>
            `;
        }
    });
}

function addAdmin() {
    const username = document.getElementById("add-admin-username").value;
    const password = document.getElementById("add-admin-password").value;
    const adminData = { username, password };

    fetch("http://localhost:8080/admin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(adminData)
    }).then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
    }).then(() => {
        location.reload();
    }).catch(error => {
        const message = document.getElementById("add-admin-message");
        if(message) message.textContent = error.message;
    });
}

function editAdmin(id) {
    const editAdminForm = document.getElementById("edit-admin-form");
    if(editAdminForm) {
        editAdminForm.innerHTML = `
            <div class="admin-edit-form">
                <h2>Admini redaktə et</h2>
                <input type="text" id="edit-admin-username" placeholder="Yeni username">
                <input type="password" id="edit-admin-password" placeholder="Yeni password">
                <button onclick="updateAdmin(${id})">Yadda saxla</button>
                <p id="edit-admin-message"></p>
            </div>
        `;
    }
}

function updateAdmin(id) {
    const username = document.getElementById("edit-admin-username").value;
    const password = document.getElementById("edit-admin-password").value;
    const adminData = { username, password };

    fetch(`http://localhost:8080/admin/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(adminData)
    }).then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
    }).then(() => {
        location.reload();
    }).catch(error => {
        const message = document.getElementById("edit-admin-message");
        if(message) message.textContent = error.message;
    });
}

function deleteAdmin(id) {
    const confirmDelete = confirm("Bu admini silmək istədiyinizə əminsiniz?");
    if (!confirmDelete) return;

    fetch(`http://localhost:8080/admin/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    }).then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message); });
        }
        location.reload();
    }).catch(error => {
        const message = document.getElementById("admin-message");
        if(message) message.textContent = error.message;
    });
}

// ==========================================
// AXTARIŞ (SEARCH) VƏ AÇILAN MENYU (DROPDOWN) - YENİLƏNMİŞ
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchDropdown = document.getElementById("search-dropdown");
    const searchWrapper = document.getElementById("search-wrapper");
    const searchIcon = document.querySelector(".search-icon");

    if (searchInput && searchDropdown && searchWrapper) {
        // Input-a kliklədikdə və ya fokus olduqda dropdown menyunu aç
        searchInput.addEventListener("focus", function (e) {
            e.stopPropagation();
            searchDropdown.classList.add("show");
        });

        // İkona kliklədikdə də açılsın və ya axtarış işə düşsün
        if (searchIcon) {
            searchIcon.addEventListener("click", function (e) {
                e.stopPropagation();
                searchDropdown.classList.toggle("show");
                searchInput.focus();
            });
        }

        // Səhifənin istənilən yerinə kliklədikdə dropdown-u bağla
        document.addEventListener("click", function (event) {
            if (!searchWrapper.contains(event.target)) {
                searchDropdown.classList.remove("show");
            }
        });

        // Enter düyməsinə basdıqda yönləndirmə
        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                const query = searchInput.value.trim().toLowerCase();
                
                if (query === "") return;
                
                // Sözə uyğun səhifəyə keçid
                if (query.includes("giriş") || query.includes("login") || query.includes("admin")) {
                    window.location.href = "login.html";
                } else if (query.includes("xidmət") || query.includes("service")) {
                    window.location.href = "services.html";
                } else if (query.includes("haqq") || query.includes("about")) {
                    window.location.href = "about.html";
                } else if (query.includes("əlaqə") || query.includes("kontakt")) {
                    window.location.href = "contact.html";
                } else {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
});

// ==========================================
// MƏHSULLARIN YÜKLƏNMƏSİ VƏ SƏBƏT (CART) MƏNTİQİ
// ==========================================
fetch("http://localhost:8080/products")
    .then(response => {
        if (!response.ok) throw new Error("Məhsullar yüklənmədi.");
        return response.json();
    })
    .then(products => {
        const container = document.getElementById("products-container");
        const productsLoading = document.getElementById("products-loading");
        
        if (container) {
            const isProductPage = window.location.pathname.includes("products.html");
            const visibleProducts = isProductPage ? products : products.slice(0, 3);
            
            if(productsLoading) productsLoading.style.display = "none";
            
            if (visibleProducts.length === 0) {
                container.innerHTML = "<p>Heç bir məhsul tapılmadı.</p>";
                return;
            }
            
            visibleProducts.forEach(product => {
                container.innerHTML += `
                    <article class="product-card">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <p class="product-type">${product.type}</p>
                            <h3>${product.name}</h3>
                            <div class="product-bottom">
                                <span class="product-price">₼ ${product.price}</span>
                                <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')" class="btn-buy-pill">SƏBƏTƏ AT</button>
                            </div>
                        </div>
                    </article>
                `;
            });
        }
    })
    .catch(error => {
        const productsLoading = document.getElementById("products-loading");
        if (productsLoading) productsLoading.textContent = error.message;
    });

// Səbətə əlavə etmə funksiyası
function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Məhsul artıq səbətdə varmı yoxlayaq
    let existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} səbətə əlavə olundu!`);
}

// Səbət səhifəsində məhsulların göstərilməsi
const cartContainer = document.getElementById("cart-container");
if (window.location.pathname.includes("cart.html") && cartContainer) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `<div class="empty-cart"><p>Səbətiniz hələ ki boşdur.</p><a href="products.html" class="btn-dark-pill" style="margin-top:20px;">Məhsullara bax</a></div>`;
    } else {
        let itemsHtml = `<div class="cart-grid"><div class="cart-items-list">`;
        let subtotal = 0;
        
        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;
            itemsHtml += `
                <div class="cart-item-card">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>Say: ${item.quantity}</p>
                    </div>
                    <span class="cart-item-price">₼ ${item.price * item.quantity}</span>
                    <button onclick="removeFromCart(${index})" class="btn-logout" style="padding: 6px 12px; font-size:10px;">Sil</button>
                </div>
            `;
        });
        
        itemsHtml += `</div>`; // End items list
        
        itemsHtml += `
            <div class="cart-summary">
                <h2>Sifarişin Yekunu</h2>
                <div class="summary-row">
                    <span>Məhsulların cəmi:</span>
                    <span>₼ ${subtotal}</span>
                </div>
                <div class="summary-row">
                    <span>Çatdırılma:</span>
                    <span>Pulsuz</span>
                </div>
                <div class="summary-total">
                    <span>Yekun məbləğ:</span>
                    <span>₼ ${subtotal}</span>
                </div>
                <button onclick="openCheckoutModal()" class="btn-dark-pill btn-checkout">SİFARİŞİ RƏSMİLƏŞDİR</button>
            </div>
        </div>`;
        
        cartContainer.innerHTML = itemsHtml;
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}

// ==========================================
// CHECKOUT MODAL MƏNTİQİ
// ==========================================
const checkoutModal = document.getElementById("checkout-modal");
const closeModalBtn = document.getElementById("close-modal");
const checkoutForm = document.getElementById("checkout-form");

// "Sifarişi rəsmiləşdir" düyməsi kliklənəndə çağırılacaq funksiya
function openCheckoutModal() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Səbətiniz boşdur!");
        return;
    }
    if (checkoutModal) {
        checkoutModal.classList.add("active");
    }
}

// Modalı bağlamaq
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
        checkoutModal.classList.remove("active");
    });
}

// Modalın çölünə (arka plana) kliklədikdə bağlansın
if (checkoutModal) {
    checkoutModal.addEventListener("click", function (e) {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove("active");
        }
    });
}

// Form göndərildikdə (Sifariş təsdiq olunanda)
if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const name = document.getElementById("cust-name").value;
        const phone = document.getElementById("cust-phone").value;
        const address = document.getElementById("cust-address").value;

        // Burada məlumatları alıb istəsəniz backend-ə də göndərə bilərsiniz.
        alert(`Təşəkkürlər, ${name}! Sifarişiniz uğurla qəbul olundu. Ən qısa zamanda sizinlə əlaqə saxlanılacaq.`);
        
        // Səbəti təmizləyirik və səhifəni yeniləyirik
        localStorage.removeItem("cart");
        checkoutModal.classList.remove("active");
        window.location.href = "products.html";
    });
}

// ==========================================
// CUSTOM FİLTRELLƏMƏ MƏNTİQİ
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("products-container");
    const productsLoading = document.getElementById("products-loading");

    let allProducts = [];
    let currentCategory = "all";
    let currentPriceOrder = "default";

    if (container) {
        fetch("http://localhost:8080/products")
            .then(response => {
                if (!response.ok) throw new Error("Məhsullar yüklənmədi.");
                return response.json();
            })
            .then(products => {
                if (productsLoading) productsLoading.style.display = "none";
                allProducts = products;
                
                const isProductPage = window.location.pathname.includes("products.html");
                let initialProducts = isProductPage ? allProducts : allProducts.slice(0, 3);
                
                renderProducts(initialProducts);

                if (isProductPage) {
                    setupCustomDropdowns();
                }
            })
            .catch(error => {
                if (productsLoading) productsLoading.textContent = error.message;
            });
    }

    function setupCustomDropdowns() {
        const typeBtn = document.getElementById("type-select-btn");
        const typeList = document.getElementById("type-dropdown-list");
        const typeText = document.getElementById("selected-type-text");

        const priceBtn = document.getElementById("price-select-btn");
        const priceList = document.getElementById("price-dropdown-list");
        const priceText = document.getElementById("selected-price-text");

        if (typeBtn && typeList) {
            typeBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                typeList.classList.toggle("show");
                if (priceList) priceList.classList.remove("show");
            });

            typeList.querySelectorAll(".dropdown-option").forEach(option => {
                option.addEventListener("click", function (e) {
                    e.stopPropagation();
                    typeList.querySelectorAll(".dropdown-option").forEach(opt => opt.classList.remove("active"));
                    this.classList.add("active");
                    currentCategory = this.getAttribute("data-value");
                    typeText.textContent = this.textContent;
                    typeList.classList.remove("show");
                    applyFilters();
                });
            });
        }

        if (priceBtn && priceList) {
            priceBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                priceList.classList.toggle("show");
                if (typeList) typeList.classList.remove("show");
            });

            priceList.querySelectorAll(".dropdown-option").forEach(option => {
                option.addEventListener("click", function (e) {
                    e.stopPropagation();
                    priceList.querySelectorAll(".dropdown-option").forEach(opt => opt.classList.remove("active"));
                    this.classList.add("active");
                    currentPriceOrder = this.getAttribute("data-value");
                    priceText.textContent = this.textContent;
                    priceList.classList.remove("show");
                    applyFilters();
                });
            });
        }

        // Səhifənin başqa yerinə kliklədikdə menyuların bağlanması
        document.addEventListener("click", function () {
            if (typeList) typeList.classList.remove("show");
            if (priceList) priceList.classList.remove("show");
        });
    }

    function applyFilters() {
        let filtered = [...allProducts];

        if (currentCategory !== "all") {
            filtered = filtered.filter(p => p.type && p.type.trim().toLowerCase() === currentCategory.trim().toLowerCase());
        }

        if (currentPriceOrder === "low-high") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (currentPriceOrder === "high-low") {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderProducts(filtered);
    }

    function renderProducts(productsArray) {
        if (!container) return;
        container.innerHTML = "";

        if (productsArray.length === 0) {
            container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px;'>Seçilmiş kriteriyalara uyğun məhsul tapılmadı.</p>";
            return;
        }

        productsArray.forEach(product => {
            container.innerHTML += `
                <article class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <p class="product-type">${product.type}</p>
                        <h3>${product.name}</h3>
                        <div class="product-bottom">
                            <span class="product-price">₼ ${product.price}</span>
                            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')" class="btn-buy-pill">SƏBƏTƏ AT</button>
                        </div>
                    </div>
                </article>
            `;
        });
    }
});

// ==========================================
// ŞİFRƏNI GÖSTƏR / GİZLƏT MƏNTİQİ
// ==========================================
const togglePasswordBtn = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");

if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", function () {
        // Type atributunu 'password'-dən 'text'-ə və ya əksinə dəyişirik
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordBtn.textContent = "👁️‍🗨️"; // Açiq göz və ya gizlətmə simvolu
        } else {
            passwordInput.type = "password";
            togglePasswordBtn.textContent = "👁️"; // Bağlı göz simvolu
        }
    });
}