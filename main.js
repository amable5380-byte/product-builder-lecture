document.addEventListener('DOMContentLoaded', () => {
    // --- Internationalization (i18n) --- //
    const languageConfig = {
        // English titles
        en: {
            'index.html': 'AI Webtoon Shorts Maker - Animate Your Day',
            'about.html': 'About - AI Webtoon Shorts Maker',
            'contact.html': 'Contact Us - AI Webtoon Shorts Maker',
            'privacy.html': 'Privacy Policy - AI Webtoon Shorts Maker',
            'webtoon.html': 'Create Shorts - AI Webtoon Shorts Maker' // Added for webtoon page
        },
        // Korean titles
        ko: {
            'index.html': 'AI 웹툰 쇼츠 제작기 - 당신의 일상을 더 즐겁게',
            'about.html': '소개 - AI 웹툰 쇼츠 제작기',
            'contact.html': '문의하기 - AI 웹툰 쇼츠 제작기',
            'privacy.html': '개인정보처리방침 - AI 웹툰 쇼츠 제작기',
            'webtoon.html': '쇼츠 제작 - AI 웹툰 쇼츠 제작기' // Added for webtoon page
        }
    };

    function setPageTitle() {
        const userLang = navigator.language || navigator.userLanguage;
        const lang = userLang.startsWith('ko') ? 'ko' : 'en';
        const path = window.location.pathname.split('/').pop() || 'index.html';

        if (languageConfig[lang] && languageConfig[lang][path]) {
            document.title = languageConfig[lang][path];
        }
    }

    setPageTitle();

    // --- Contact Form Logic --- //
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && formStatus && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = '전송 중...';

            // Simulate form submission
            setTimeout(() => {
                formStatus.textContent = '메시지가 성공적으로 전송되었습니다! 감사합니다.';
                formStatus.style.color = '#28a745';
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = '메시지 보내기';
            }, 1000);
        });
    }
});
