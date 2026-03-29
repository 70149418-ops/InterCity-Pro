document.addEventListener('DOMContentLoaded', function() {
    const card = document.getElementById('card-tilt');
    const container = document.querySelector('.booking-card-container');
    const innerCard = document.querySelector('.booking-card');
    const title = innerCard.querySelector('h2');
    const formGroups = innerCard.querySelectorAll('.form-group');
    const btnBook = innerCard.querySelector('.btn-book');
    container.addEventListener('mousemove', (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        innerCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    container.addEventListener('mouseenter', (e) => {
        innerCard.style.transition = 'none';
        title.style.transform = 'translateZ(50px)';
        btnBook.style.transform = 'translateZ(30px)';
        formGroups.forEach(group => {
            group.style.transform = 'translateZ(20px)';
        });
    });
    container.addEventListener('mouseleave', (e) => {
        innerCard.style.transition = 'all 0.5s ease';
        innerCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
        title.style.transform = 'translateZ(0px)';
        btnBook.style.transform = 'translateZ(0px)';
        formGroups.forEach(group => {
            group.style.transform = 'translateZ(0px)';
        });
    });
});
const actionBtn = document.getElementById('action-btn');
const fareDisplay = document.getElementById('fare-display');
const pkrPrice = document.getElementById('pkr-price');
const optStatus = document.getElementById('optimization-status');
const taxiForm = document.getElementById('taxiForm');
let isFareCalculated = false;
actionBtn.addEventListener('click', function() {
    const pickup = document.getElementById('pickup').value;
    const drop = document.getElementById('drop').value;
    if(!pickup || !drop) {
        alert("Please enter both locations first!");
        return;
    }
    if(!isFareCalculated) {
        const baseFare = 800;
        const randomKM = Math.floor(Math.random() * (350 - 50) + 50); 
        const perKM = 22; 
        let total = baseFare + (randomKM * perKM);
        const foundReturn = Math.random() > 0.4;
        if(foundReturn) {
            total = total * 0.75;
            optStatus.innerText = "✓ Return Passenger Found! (Discount Applied)";
        } 
        else{
            optStatus.innerText = "Standard Intercity Rate (No return match)";
            optStatus.style.color = "#aaa";
        }
        pkrPrice.innerText = Math.floor(total).toLocaleString();
        fareDisplay.style.display = "block";
        actionBtn.innerText = "Confirm & Book Ride";
        actionBtn.style.background = "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)";
        isFareCalculated = true;
    } 
    else {
        taxiForm.submit();
    }
});
const handleTheme = () => {
    const themeSlider = document.getElementById('theme-slider');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        if (themeSlider) themeSlider.checked = false;
    } 
    else {
        body.classList.remove('dark-theme');
        if (themeSlider) themeSlider.checked = true;
    }
    if (themeSlider) {
        themeSlider.removeEventListener('change', toggleTheme);
        themeSlider.addEventListener('change', toggleTheme);
    }
};
const toggleTheme = (e) => {
    if (!e.target.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
};
handleTheme();
document.addEventListener('DOMContentLoaded', handleTheme);