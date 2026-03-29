import { initTheme } from '../../constants/themeConstants.js';
import { initialDrivers } from '../../database/database.js';
const adminUser = {
    name: "  admin_zaid  ", 
    role: "manager"
};
adminUser.permissions = ["view", "add", "edit"];
adminUser.role = "admin";
adminUser.permissions.push("delete"); 
delete adminUser.tempSession;
let drivers = [...initialDrivers];
const grid = document.getElementById('driver-grid');
const driverForm = document.getElementById('driver-form');
const modal = document.getElementById('modal-overlay');
const renderDrivers = (data = drivers) => {
    const statsRev = document.getElementById('stats-revenue');
    if(statsRev) statsRev.innerText = data.reduce((acc, curr) => acc + curr.price, 0);
    grid.innerHTML = data.map(driver => {
        const rule = { condition: driver.price > 100, message: "Premium Service" };
        const badge = rule.condition ? rule.message : "Standard Service";
        const cleanName = driver.name.trim().toUpperCase();
        const priceLabel = "PKR ".concat(driver.price, "/km");
        const formattedId = String(driver.id).padStart(3, '0');
        const shortCat = driver.category.length > 10 ? driver.category.slice(0, 10).concat("..") : driver.category;
        const starRating = "⭐".repeat(Math.floor(driver.rating));
        const deleteBtn = adminUser.permissions.includes("delete")
            ? `<button onclick="deleteDriver(${driver.id})" class="text-red-400 hover:text-red-300 font-semibold">Remove</button>` 
            : "";
        return `
            <div class="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-yellow-400 transition shadow-lg">
                <div class="flex justify-between items-start mb-4">
                    <span class="bg-yellow-400/10 text-yellow-400 text-xs font-bold px-2 py-1 rounded">${shortCat}</span>
                    <span class="text-gray-500 text-[10px] uppercase font-bold">${badge}</span>
                </div>
                <h3 class="text-xl font-bold mb-1 text-white">${cleanName}</h3>
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-yellow-400 text-sm">${starRating}</span>
                    <span class="text-gray-400 text-xs">(${driver.rating})</span>
                </div>
                <p class="text-gray-400 text-sm mb-4">${priceLabel} | ID: ${formattedId}</p>
                <div class="flex gap-4 pt-4 border-t border-zinc-800">
                    <button onclick="editDriver(${driver.id})" class="text-sm font-semibold text-blue-400 hover:text-blue-300">Update</button>
                    ${deleteBtn}
                </div>
            </div>
        `;
    }).join('');
};
driverForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    let rawInput = document.getElementById('d-name').value;
    const sanitizedName = rawInput.trim().charAt(0).toUpperCase() + rawInput.trim().slice(1).toLowerCase();

    const driverObj = {
        id: id ? parseInt(id) : Date.now(),
        name: sanitizedName,
        price: parseInt(document.getElementById('d-price').value),
        rating: parseFloat(document.getElementById('d-rating').value),
        category: document.getElementById('d-cat').value,
        date: new Date()
    };

    if (id) {
        drivers = drivers.map(d => d.id === driverObj.id ? driverObj : d);
    } 
    else {
        drivers.push(driverObj);
    }

    closeModalFunc();
    renderDrivers();
});
const applyFilters = () => {
    const searchTerm = document.getElementById('searchName').value.toLowerCase().trim();
    const cat = document.getElementById('filterCategory').value;
    const sortVal = document.getElementById('sortBy').value;
    let filtered = drivers.filter(d => {
        const matchesName = d.name.toLowerCase().includes(searchTerm);
        const matchesCat = cat === 'all' || d.category === cat;
        const isTopRated = sortVal === 'topRated' ? d.rating >= 4.8 : true;
        return matchesName && matchesCat && isTopRated;
    });
    if (sortVal === 'priceLow') filtered.sort((a, b) => a.price - b.price);
    else if (sortVal === 'ratingHigh' || sortVal === 'topRated') filtered.sort((a, b) => b.rating - a.rating);
    renderDrivers(filtered);
};
window.deleteDriver = (id) => {
    if(confirm("Are you sure?")) {
        drivers = drivers.filter(d => d.id !== id);
        renderDrivers();
    }
};
window.editDriver = (id) => {
    const driver = drivers.find(d => d.id === id);
    if(driver) {
        document.getElementById('modal-title').innerText = "Update Driver";
        document.getElementById('edit-id').value = driver.id;
        document.getElementById('d-name').value = driver.name;
        document.getElementById('d-price').value = driver.price;
        document.getElementById('d-rating').value = driver.rating;
        document.getElementById('d-cat').value = driver.category;
        modal.classList.replace('hidden', 'flex');
    }
};
const closeModalFunc = () => {
    modal.classList.replace('flex', 'hidden');
    driverForm.reset();
    document.getElementById('edit-id').value = "";
};
document.getElementById('searchName')?.addEventListener('input', applyFilters);
document.getElementById('filterCategory')?.addEventListener('change', applyFilters);
document.getElementById('sortBy')?.addEventListener('change', applyFilters);
document.getElementById('openAddModal')?.addEventListener('click', () => {
    document.getElementById('modal-title').innerText = "Add New Driver";
    modal.classList.replace('hidden', 'flex');
});
document.getElementById('close-modal')?.addEventListener('click', closeModalFunc);
document.addEventListener('DOMContentLoaded', () => {
    renderDrivers();
    initTheme();
});
function login() {
    let user = document.getElementById("username").value.trim().toLowerCase();
    let pass = document.getElementById("password").value.trim();
    if (user === "admin" && pass === "1234") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        document.getElementById("logoutBtn").style.display = "block";
        localStorage.setItem("adminLogin", "true");
    } 
    else {
        document.getElementById("error").innerText = "Invalid credentials";
    }
}
function logout() {
    localStorage.removeItem("adminLogin");
    location.reload();
}
window.onload = () => {
    if (localStorage.getItem("adminLogin") === "true") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        document.getElementById("logoutBtn").style.display = "block";
    }
};