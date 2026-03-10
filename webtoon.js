document.addEventListener('DOMContentLoaded', () => {
    const createShortsBtn = document.getElementById('create-shorts-btn');
    const webtoonUrlInput = document.getElementById('webtoon-url');
    const statusContainer = document.getElementById('webtoon-status');

    if (createShortsBtn) {
        createShortsBtn.addEventListener('click', () => {
            const url = webtoonUrlInput.value.trim();
            if (!url || !url.startsWith('http')) {
                addStatusMessage('❌ 유효하지 않은 URL입니다. 웹툰 주소를 정확히 입력해주세요.');
                return;
            }

            // Clear previous status
            statusContainer.innerHTML = ''; 

            // Simulate the creation process
            simulateShortsCreation(url);
        });
    }

    function addStatusMessage(message) {
        const p = document.createElement('p');
        p.textContent = message;
        statusContainer.appendChild(p);
        statusContainer.scrollTop = statusContainer.scrollHeight; // Scroll to bottom
    }

    function addDownloadButton(webtoonName) {
        const downloadBtn = document.createElement('a');
        downloadBtn.href = '#'; // Placeholder link for simulation
        downloadBtn.textContent = `🎬 ${webtoonName}.mp4 다운로드`;
        downloadBtn.classList.add('button-link'); // Re-use button-link style
        downloadBtn.setAttribute('download', `${webtoonName}.mp4`); // Simulate download attribute
        
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('이것은 시뮬레이션 기능입니다. 실제 파일은 생성되지 않았습니다.');
        });
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginTop = '20px';
        buttonContainer.appendChild(downloadBtn);

        statusContainer.appendChild(buttonContainer);
        statusContainer.scrollTop = statusContainer.scrollHeight;
    }

    async function simulateShortsCreation(url) {
        addStatusMessage('✅ 요청이 접수되었습니다. 쇼츠 제작을 시작합니다.');
        await new Promise(r => setTimeout(r, 1000));

        addStatusMessage('🌐 브라우저를 실행하고 웹툰 페이지를 분석하고 있습니다...');
        await new Promise(r => setTimeout(r, 2000));

        addStatusMessage('📸 웹툰의 모든 컷을 캡처하고 있습니다...');
        await new Promise(r => setTimeout(r, 3000));

        addStatusMessage('🖼️ 캡처한 이미지를 하나로 합치는 중입니다...');
        await new Promise(r => setTimeout(r, 1500));

        addStatusMessage('🎥 고퀄리티 영상 편집 효과를 적용하고 있습니다 (스크롤, 자막, BGM)...');
        await new Promise(r => setTimeout(r, 4000));

        addStatusMessage('✨ AI가 SEO에 최적화된 영상 제목을 생성하고 있습니다...');
        await new Promise(r => setTimeout(r, 1000));
        const webtoonName = url.split('/').pop() || '추천웹툰';
        const seoTitle = getSeoTitle(webtoonName);
        addStatusMessage(`✅ 완성! 추천 제목: ${seoTitle}`);
        
        // Add the download button
        addDownloadButton(webtoonName);
    }

    function getSeoTitle(webtoonName) {
        const strategies = [
            `솔직히 '${webtoonName}'... 안 본 사람 없게 해주세요 (결말 소름) ㄷㄷ`,
            `당신이 '${webtoonName}' 주인공이라면? 네이버 레전드 찍음 🔥`,
            `[${webtoonName}] 1화부터 정주행 각! 1분 만에 몰아보기 🚀`,
            `AI가 직접 제작한 ${webtoonName} 쇼츠 퀄리티 실화냐?? 😱`
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }
});