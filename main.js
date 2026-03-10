
const menuDisplay = document.getElementById('menu-display');
const generateButton = document.getElementById('generate');
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

const dinnerMenus = [
    "치킨", "피자", "삼겹살", "떡볶이", "초밥", "파스타",
    "김치찌개", "된장찌개", "부대찌개", "곱창", "족발", "보쌈",
    "짜장면", "짬뽕", "탕수육", "라멘", "돈까스", "햄버거"
];

const recommendDinner = () => {
    const randomIndex = Math.floor(Math.random() * dinnerMenus.length);
    const recommendedMenu = dinnerMenus[randomIndex];
    menuDisplay.textContent = recommendedMenu;
};

generateButton.addEventListener('click', recommendDinner);

toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Recommend a dinner on initial load
recommendDinner();
