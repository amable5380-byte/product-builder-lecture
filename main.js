document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const toggleFeatureBtn = document.getElementById('toggle-feature-btn');
    const toggleLangBtn = document.getElementById('toggle-lang-btn');
    const toggleDarkModeBtn = document.getElementById('toggle-dark-mode-btn');

    const dinnerFeature = document.getElementById('dinner-feature');
    const animalFeature = document.getElementById('animal-feature');

    const dinnerSuggestionBox = document.getElementById('dinner-suggestion-box');
    const generateDinnerBtn = document.getElementById('generate-dinner-btn');

    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const predictButton = document.getElementById('predict-button');
    const labelContainer = document.getElementById('label-container');

    // --- Feature Toggle ---
    toggleFeatureBtn.addEventListener('click', () => {
        if (dinnerFeature.style.display !== 'none') {
            dinnerFeature.style.display = 'none';
            animalFeature.style.display = 'block';
            toggleFeatureBtn.textContent = document.documentElement.lang === 'ko' ? '저녁 메뉴 추천' : 'Dinner Suggestion';
        } else {
            dinnerFeature.style.display = 'block';
            animalFeature.style.display = 'none';
            toggleFeatureBtn.textContent = document.documentElement.lang === 'ko' ? '동물상 테스트' : 'Animal Face Test';
        }
    });

    // --- Language Toggle ---
    let currentLang = 'ko';
    toggleLangBtn.addEventListener('click', () => {
        currentLang = (currentLang === 'ko') ? 'en' : 'ko';
        document.documentElement.lang = currentLang;
        updateUIText(currentLang);
    });

    function updateUIText(lang) {
        document.querySelectorAll('[data-ko]').forEach(el => {
            el.textContent = el.dataset[lang];
        });
    }

    // --- Dark Mode Toggle ---
    toggleDarkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleDarkModeBtn.textContent = document.body.classList.contains('dark-mode') 
            ? (currentLang === 'ko' ? "White Mode" : "White Mode") 
            : (currentLang === 'ko' ? "Dark Mode" : "Dark Mode");
    });

    // --- "What to Eat for Dinner?" Feature ---
    const dinnerMenus = {
        ko: ["치킨", "피자", "삼겹살", "떡볶이", "초밥", "파스타", "김치찌개", "된장찌개", "부대찌개", "곱창"],
        en: ["Chicken", "Pizza", "Pork Belly", "Tteokbokki", "Sushi", "Pasta", "Kimchi Jjigae", "Doenjang Jjigae", "Budae Jjigae", "Gopchang"]
    };

    function generateDinnerSuggestion() {
        const lang = document.documentElement.lang || 'ko';
        const menus = dinnerMenus[lang];
        const randomIndex = Math.floor(Math.random() * menus.length);
        const suggestion = menus[randomIndex];

        dinnerSuggestionBox.classList.add('animate');
        setTimeout(() => {
            dinnerSuggestionBox.textContent = suggestion;
            dinnerSuggestionBox.classList.remove('animate');
        }, 500); // Animation duration
    }

    if (generateDinnerBtn) {
        generateDinnerBtn.addEventListener('click', generateDinnerSuggestion);
    }

    // --- "Animal Face Test" Feature ---
    const URL = "https://teachablemachine.withgoogle.com/models/x8ciNIai5/";
    let model;

    async function initAnimalTest() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        try {
            model = await tmImage.load(modelURL, metadataURL);
        } catch (e) {
            console.error("Error loading model:", e);
        }
    }

    if (imageUpload) {
        initAnimalTest();

        imageUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    predictButton.style.display = 'inline-block';
                    labelContainer.innerHTML = '';
                };
                reader.readAsDataURL(file);
            }
        });

        predictButton.addEventListener('click', async () => {
            if (imagePreview.src && model) {
                const prediction = await model.predict(imagePreview);
                displayPredictions(prediction);
            }
        });
    }

    function displayPredictions(prediction) {
        labelContainer.innerHTML = '';
        let highestProb = 0;
        let bestClass = "";

        prediction.forEach(p => {
            if (p.probability > highestProb) {
                highestProb = p.probability;
                bestClass = p.className;
            }
        });
        
        const resultText = currentLang === 'ko' ? `${bestClass}상일 확률이 높습니다.` : `You are likely a ${bestClass}.`;
        const div = document.createElement('div');
        div.innerText = resultText;
        labelContainer.appendChild(div);
    }

    // Initial UI text update
    updateUIText(currentLang);
});