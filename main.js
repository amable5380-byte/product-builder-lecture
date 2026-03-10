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
    if (toggleFeatureBtn) {
        toggleFeatureBtn.addEventListener('click', () => {
            if (dinnerFeature.style.display !== 'none') {
                dinnerFeature.style.display = 'none';
                animalFeature.style.display = 'block';
                updateUIText(document.documentElement.lang);
            } else {
                dinnerFeature.style.display = 'block';
                animalFeature.style.display = 'none';
                updateUIText(document.documentElement.lang);
            }
        });
    }

    // --- Language Toggle ---
    let currentLang = document.documentElement.lang || 'ko';
    if (toggleLangBtn) {
        toggleLangBtn.addEventListener('click', () => {
            currentLang = (currentLang === 'ko') ? 'en' : 'ko';
            document.documentElement.lang = currentLang;
            updateUIText(currentLang);
        });
    }

    function updateUIText(lang) {
        document.querySelectorAll('[data-ko]').forEach(el => {
            // Update text content for non-input/button elements
            if (el.tagName !== 'INPUT' && el.tagName !== 'BUTTON' && !el.classList.contains('custom-file-upload')) {
                el.textContent = el.dataset[lang];
            } else if (el.id === 'toggle-feature-btn') {
                const isDinnerVisible = dinnerFeature && dinnerFeature.style.display !== 'none';
                if (isDinnerVisible) {
                    el.textContent = lang === 'ko' ? '동물상 테스트' : 'Animal Face Test';
                } else {
                    el.textContent = lang === 'ko' ? '저녁 메뉴 추천' : 'Dinner Suggestion';
                }
            } else {
                 el.textContent = el.dataset[lang];
            }
        });
         // Special handling for title
        if (document.title.includes('오늘 뭐 먹지')) {
            document.title = lang === 'ko' 
                ? '오늘 뭐 먹지? & 동물상 테스트 - 당신의 일상을 더 즐겁게' 
                : 'What to Eat & Animal Face Test - Make Your Day More Enjoyable';
        } else if (document.title.includes('소개')) {
            document.title = lang === 'ko' ? '소개 - 오늘 뭐 먹지? & 동물상 테스트' : 'About - What to Eat & Animal Face Test';
        } else if (document.title.includes('개인정보처리방침')) {
            document.title = lang === 'ko' ? '개인정보처리방침 - 오늘 뭐 먹지? & 동물상 테스트' : 'Privacy Policy - What to Eat & Animal Face Test';
        } else if (document.title.includes('문의하기')) {
            document.title = lang === 'ko' ? '문의하기 - 오늘 뭐 먹지? & 동물상 테스트' : 'Contact - What to Eat & Animal Face Test';
        }
    }

    // --- Dark Mode Toggle ---
    if (toggleDarkModeBtn) {
        toggleDarkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            toggleDarkModeBtn.textContent = isDarkMode ? 'White Mode' : 'Dark Mode';
        });
    }

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

        if (dinnerSuggestionBox) {
            dinnerSuggestionBox.classList.add('animate');
            setTimeout(() => {
                dinnerSuggestionBox.textContent = suggestion;
                dinnerSuggestionBox.classList.remove('animate');
            }, 500); // Animation duration
        }
    }

    if (generateDinnerBtn) {
        generateDinnerBtn.addEventListener('click', generateDinnerSuggestion);
    }

    // --- "Animal Face Test" Feature ---
    const URL = "https://teachablemachine.withgoogle.com/models/x8ciNIai5/";
    let model;

    async function initAnimalTest() {
        if (typeof tmImage !== 'undefined') {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";
            try {
                model = await tmImage.load(modelURL, metadataURL);
            } catch (e) {
                console.error("Error loading model:", e);
            }
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
                    if (labelContainer) labelContainer.innerHTML = '';
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
        if (!labelContainer) return;
        labelContainer.innerHTML = '';
        let highestProb = 0;
        let bestClass = "";

        prediction.forEach(p => {
            if (p.probability > highestProb) {
                highestProb = p.probability;
                bestClass = p.className;
            }
        });
        
        const lang = document.documentElement.lang || 'ko';
        const resultText = lang === 'ko' ? `${bestClass}상일 확률이 높습니다.` : `You are likely a ${bestClass}.`;
        const div = document.createElement('div');
        div.innerText = resultText;
        labelContainer.appendChild(div);
    }

    // Initial UI text update
    updateUIText(currentLang);
});