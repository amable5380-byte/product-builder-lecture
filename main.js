
const numbersContainer = document.querySelector('.numbers');
const generateButton = document.getElementById('generate');
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

const generateLottoNumbers = () => {
    // Clear previous numbers
    numbersContainer.innerHTML = '';

    const lottoNumbers = new Set();
    while (lottoNumbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        lottoNumbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(lottoNumbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
        const numberElement = document.createElement('div');
        numberElement.classList.add('number');
        numberElement.textContent = number;
        // Assign a color based on the number range
        numberElement.style.backgroundColor = getNumberColor(number);
        numberElement.style.color = 'white'; 
        numbersContainer.appendChild(numberElement);
    });
};

const getNumberColor = (number) => {
    if (number <= 10) return '#f44336'; // Red
    if (number <= 20) return '#ff9800'; // Orange
    if (number <= 30) return '#4caf50'; // Green
    if (number <= 40) return '#2196f3'; // Blue
    return '#9c27b0'; // Purple
};


generateButton.addEventListener('click', generateLottoNumbers);

toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Generate numbers on initial load
generateLottoNumbers();

