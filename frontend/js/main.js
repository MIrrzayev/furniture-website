fetch("http://localhost:8080/products")
    .then(response => {
        if(!response.ok){
            throw new Error("Məhsullar yüklənmədi.");
        }
        return response.json();
    })
    .then(products => {
        const container = document.getElementById("products-container");
        const productsLoading = document.getElementById("products-loading");
        if(container){
            const isProductPage = window.location.pathname.includes("products.html"); 
            const visibleProducts = isProductPage ? products : products.slice(0, 3);
            productsLoading.style.display = "none";
            if(visibleProducts.length === 0){
                container.textContent = "Heç bir məhsul yoxdur";
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
                            <span class="product-price">
                                ₼ ${product.price}
                            </span>
                        </div>
                    </article>
                `;         
            });
        }
    })
    .catch(error => {
        const productsLoading = document.getElementById("products-loading");
        if(productsLoading){
            productsLoading.textContent = error.message;
        }
    });
fetch("http://localhost:8080/services")
    .then(response => {
         if(!response.ok){
            throw new Error("Xidmətlər yüklənmədi.");
        }
        return response.json();
    })
    .then(services => {
        const container = document.getElementById("service-container");
        const servicesLoading = document.getElementById("services-loading");
        if(container){
            servicesLoading.style.display = "none";
            if(services.length === 0){
                container.textContent = "Heç bir xidmət yoxdur";
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
        if(servicesLoading){
            servicesLoading.textContent = error.message;
        }
    });
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
if(contactForm){
    contactForm.addEventListener("submit", function(event){
        event.preventDefault();
        formMessage.textContent = "";
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        const formData = {name, email, message};
        fetch("http://localhost:8080/message", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        }).then(response => {
            if(!response.ok){
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        }).then(data => {
            formMessage.textContent = "Mesajınız uğurla göndərildi.";
            contactForm.reset();
        }).catch(error => {
            formMessage.textContent = error.message;
        });
    });
}
const loginForm = document.getElementById("login-form");
if(loginForm){
    loginForm.addEventListener("submit", function(event){
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const loginMessage = document.getElementById("login-message");
        const loginData = {username, password};
        loginMessage.textContent = "";
        fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(loginData)
        }).then(response => {
            if(!response.ok){
                throw new Error("İstifadeçi və ya şifrə yanlışdır.");
            }
            return response.text();
        }).then(token => {
            localStorage.setItem("token", token);
            window.location.href = "admin.html";
        }).catch(error => {
            loginMessage.textContent = error.message;
        });
    });
}
const token = localStorage.getItem("token");
if(window.location.pathname.includes("admin.html")){
    if(!token){
        window.location.href = "login.html";
    }
    const productContainer = document.getElementById("admin-products");
    const productsLoading = document.getElementById("products-loading");
    fetch("http://localhost:8080/products")
        .then(response => {
            if(!response.ok){
                throw new Error("Məhsullar yüklənmədi.");
            }
            return response.json();
        })
        .then(products => {
            productsLoading.style.display = "none";
            if(products.length === 0){
                productContainer.textContent = "Heç bir məhsul yoxdur";
                return;
            }
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
                `
            });
        }).catch(error => {
            productsLoading.textContent = error.message;
        });
}
function deleteProduct(id){
    const token = localStorage.getItem("token");
    const confirmDelete = confirm("Bu məhsulu silmək istədiyinizə əminsiniz?");
    if(!confirmDelete){
        return
    }
    fetch(`http://localhost:8080/products/${id}`,{
        method: "DELETE",
        headers:{"Authorization": "Bearer " + token}
    }).then(response => {
        if(!response.ok){
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        location.reload();
    }).catch(error => {
        const message = document.getElementById("product-message");
        message.textContent = error.message;
    });
}
function editProduct(id){
    fetch(`http://localhost:8080/products/${id}`)
        .then(response => {
            if(!response.ok){
                throw new Error("Məhsul tapılmadı.");
            }
            return response.json();
        }).then(product =>{
            const editForm = document.getElementById("edit-product-form");
            editForm.innerHTML=`
                <div class="admin-edit-form">
                    <h2>Məhsulu dəyiş</h2>
                    <input type="text" id="edit-name" value="${product.name}">
                    <input type="text" id="edit-type" value="${product.type}">
                    <input type="number" id="edit-price" value="${product.price}">
                    <input type="text" id="edit-image" value="${product.image}">
                    <button onclick="updateProduct(${product.id})">Yadda saxla</button>
                    <p id="edit-product-message"></p>
                </div>
            `
        }).catch(error => {
            const message = document.getElementById("edit-product-message");
            if(message){
                message.textContent = error.message;
            }
        });
}
function updateProduct(id){
    const token = localStorage.getItem("token");
    const name = document.getElementById("edit-name").value;
    const type = document.getElementById("edit-type").value;
    const price = document.getElementById("edit-price").value;
    const image = document.getElementById("edit-image").value;
    const productData = {name, type, price, image};
    fetch(`http://localhost:8080/products/${id}`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(productData)
    }).then(response => {
        if(!response.ok){
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        return response.json();
    }).then(product => {
        location.reload();
    }).catch(error => {
        const message = document.getElementById("edit-product-message");
        message.textContent = error.message;
    });
}
const addProductButton = document.getElementById("add-product")
if(addProductButton){
    addProductButton.addEventListener("click", function(){
        const addProductForm = document.getElementById("add-product-form");
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
    });
}
function addProduct(){
    const token = localStorage.getItem("token");
    const name = document.getElementById("add-name").value;
    const type = document.getElementById("add-type").value;
    const price = document.getElementById("add-price").value;
    const image = document.getElementById("add-image").value;
    const productData = {name, type, price, image}
    fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(productData)
    }).then(response => {
        if(!response.ok){
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        return response.json();
    }).then(product => {
        location.reload();
    }).catch(error => {
        const message = document.getElementById("add-product-message");
        message.textContent = error.message;
    })
}
if(window.location.pathname.includes("admin.html")){
    const serviceContainer = document.getElementById("admin-services-list");
    const servicesLoading = document.getElementById("services-loading");
    fetch("http://localhost:8080/services")
        .then(response => {
            if(!response.ok){
                throw new Error("Xidmətlər yüklənmədi.");
            }
            return response.json();
        })
        .then(services => {
            servicesLoading.style.display = "none";
            if(services.length === 0){
                serviceContainer.textContent = "Heç bir xidmət yoxdur";
                return;
            }
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
            servicesLoading.textContent = error.message;
        });
}
function deleteService(id){
    const token = localStorage.getItem("token");
    const confirmDelete = confirm("Bu xidməti silmək istədiyinizə əminsiniz?");
     if(!confirmDelete){
        return;
    }
    fetch(`http://localhost:8080/services/${id}`,{
        method: "DELETE",
        headers: {"Authorization": "Bearer " + token}
    }).then(response => {
        if(!response.ok){
            return response.text().then(text => {
                if(text){
                    const error = JSON.parse(text);
                    throw new Error(error.message);
                }
                throw new Error("Xidmət silinmədi.");
            });
        }
        location.reload();
    })
    .catch(error => {
        const message = document.getElementById("service-message");
        message.textContent = error.message;
    });
}
function editService(id){
    fetch(`http://localhost:8080/services/${id}`)
        .then(response => {
            if(!response.ok){
                throw new Error("Xidmət tapılmadı.");
            }
            return response.json();
        }).then(service => {
            const editForm = document.getElementById("edit-service-form");
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
        }).catch(error => {
            const message = document.getElementById("edit-service-message");
            if(message){
                message.textContent = error.message;
            }
        });
}
function updateService(id){
    const token = localStorage.getItem("token");
    const name = document.getElementById("edit-service-name").value;
    const description = document.getElementById("edit-service-description").value;
    const price = document.getElementById("edit-service-price").value;
    const serviceData = {name, description, price};
    fetch(`http://localhost:8080/services/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(serviceData)
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        return response.json();
    })
    .then(service => {
        location.reload();
    })
    .catch(error => {
        const message = document.getElementById("edit-service-message");
        message.textContent = error.message;
    });
}
const addServiceButton = document.getElementById("add-service");
if(addServiceButton){
    addServiceButton.addEventListener("click", function(){
        const addServiceForm = document.getElementById("add-service-form");
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
    });
}
function addService(){
    const token = localStorage.getItem("token");
    const name = document.getElementById("add-service-name").value;
    const description = document.getElementById("add-service-description").value;
    const price = document.getElementById("add-service-price").value;
    const serviceData = {name, description, price};
    fetch("http://localhost:8080/services",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(serviceData)
    }).then(response => {
        if(!response.ok){
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        return response.json();
    }).then(service => {
        location.reload();
    }).catch(error => {
        const message = document.getElementById("add-service-message");
        message.textContent = error.message;
    });
}
if(window.location.pathname.includes("admin.html") && token){
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;
    const adminSection = document.getElementById("admin-management-section")
    if(role !== "SUPER_ADMIN"){
        adminSection.style.display = "none";
    }
    if(role === "SUPER_ADMIN"){
        const adminContainer = document.getElementById("admin-list");
        fetch("http://localhost:8080/admin", {
            headers: {"Authorization": "Bearer " + token}
        }).then(response => {
            if(!response.ok){
                throw new Error("Adminlər yüklənmədi.");
            }
            return response.json();
        }).then(admins => {
            admins.forEach(admin => {
                if(admin.role === "SUPER_ADMIN"){
                    return;
                }
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
             if(message){
                message.textContent = error.message;
            }
        });
    }  
}
const addAdminButton = document.getElementById("add-admin");
if(addAdminButton){
    addAdminButton.addEventListener("click", function(){
        const addAdminForm = document.getElementById("add-admin-form");
        addAdminForm.innerHTML = `
            <div class="admin-edit-form">
                <h2>Yeni admin əlavə et</h2>
                <input type="text" id="add-admin-username" placeholder="Username">
                <input type="password" id="add-admin-password" placeholder="Password">
                <button onclick="addAdmin()">Əlavə et</button>
                <p id="add-admin-message"></p>
            </div>
        `;
    });
}
function addAdmin(){
    const username = document.getElementById("add-admin-username").value;
    const password = document.getElementById("add-admin-password").value;
    const adminData = {username, password};
    fetch("http://localhost:8080/admin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(adminData)
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        return response.json();
    })
    .then(admin => {
        location.reload();
    })
    .catch(error => {
        const message = document.getElementById("add-admin-message");
        message.textContent = error.message;
    });
}
function editAdmin(id){
    const editAdminForm = document.getElementById("edit-admin-form");
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
function updateAdmin(id){
    const username = document.getElementById("edit-admin-username").value;
    const password = document.getElementById("edit-admin-password").value;
    const adminData = {username, password};
    fetch(`http://localhost:8080/admin/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(adminData)
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        return response.json();
    })
    .then(admin => {
        location.reload();
    })
    .catch(error => {
        const message = document.getElementById("edit-admin-message");
        message.textContent = error.message;
    });
}
function deleteAdmin(id){
    const confirmDelete = confirm("Bu admini silmək istədiyinizə əminsiniz?");
    if(!confirmDelete){
        return;
    }
    fetch(`http://localhost:8080/admin/${id}`, {
        method: "DELETE",
        headers: {"Authorization": "Bearer " + token}
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        location.reload();
    })
    .catch(error => {
        const message = document.getElementById("admin-message");
        message.textContent = error.message;
    });
}
const messageContainer = document.getElementById("message-list");
if(messageContainer){
    const messagesLoading = document.getElementById("messages-loading");
    fetch("http://localhost:8080/message", {
        headers: {"Authorization": "Bearer " + token}
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Mesajlar yüklənmədi.");
        }
        return response.json();
    })
    .then(messages => {
        messagesLoading.style.display = "none";
        if(messages.length === 0){
            messageContainer.textContent = "Heç bir mesaj yoxdur";
            return;
        }
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
    })
    .catch(error => {
        messagesLoading.textContent = error.message;
    });
}
function deleteMessage(id){
    const confirmDelete = confirm("Bu mesajı silmək istədiyinizə əminsiniz?");
    if(!confirmDelete){
        return;
    }
    fetch(`http://localhost:8080/message/${id}`, {
        method: "DELETE",
        headers: {"Authorization": "Bearer " + token}
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        location.reload();
    })
    .catch(error => {
        const message = document.getElementById("message-error");
        message.textContent = error.message;
    });
}
const logoutButton = document.getElementById("logout-button");
if(logoutButton){
    logoutButton.addEventListener("click", function(){
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}
const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
if (menuToggle && navbar) {
    menuToggle.addEventListener("click", function () {
        navbar.classList.toggle("mobile-open");
    });
}
let currentPage = window.location.pathname.split("/").pop();
if(currentPage === ""){
    currentPage = "index.html";
}
document.querySelectorAll(".navbar a").forEach(link => {
    const linkPage = link.getAttribute("href");
    if(linkPage === currentPage){
        link.classList.add("active");
    }
});