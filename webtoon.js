document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://127.0.0.1:5000';

    const createShortsBtn = document.getElementById('create-shorts-btn');
    const webtoonUrlInput = document.getElementById('webtoon-url');
    const statusContainer = document.getElementById('webtoon-status');

    if (createShortsBtn) {
        createShortsBtn.addEventListener('click', () => {
            const url = webtoonUrlInput.value.trim();
            
            // Clear previous status and disable button before any other logic
            statusContainer.innerHTML = '';
            createShortsBtn.disabled = true;
            createShortsBtn.textContent = '⏳ 제작 중...';

            if (!url || !url.startsWith('http')) {
                addStatusMessage('❌ 유효하지 않은 URL입니다. 웹툰 주소를 정확히 입력해주세요.');
                // Re-enable button immediately if input is invalid
                createShortsBtn.disabled = false;
                createShortsBtn.textContent = '쇼츠 제작하기';
                return;
            }

            requestShortsCreation(url);
        });
    }

    function addStatusMessage(message) {
        if (!statusContainer) return; // Guard clause
        const p = document.createElement('p');
        p.innerHTML = message; // Use innerHTML to render line breaks
        statusContainer.appendChild(p);
        statusContainer.scrollTop = statusContainer.scrollHeight;
    }

    function addDownloadButton(downloadUrl, fileName) {
        if (!statusContainer) return; // Guard clause

        const downloadBtn = document.createElement('a');
        downloadBtn.href = `${API_BASE_URL}${downloadUrl}`;
        downloadBtn.textContent = `🎬 ${fileName} 다운로드`;
        downloadBtn.classList.add('button-link');
        downloadBtn.setAttribute('download', fileName);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginTop = '20px';
        buttonContainer.appendChild(downloadBtn);
        statusContainer.appendChild(buttonContainer);
        statusContainer.scrollTop = statusContainer.scrollHeight;
    }

    async function requestShortsCreation(url) {
        try {
            // The status message is now added inside the try block.
            addStatusMessage('✅ 요청이 접수되었습니다. 백엔드 서버에 작업을 요청하는 중입니다...');

            const response = await fetch(`${API_BASE_URL}/api/create-shorts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `서버 응답 오류: ${response.status}`);
            }

            const result = await response.json();
            addStatusMessage('✅ 영상 제작이 완료되었습니다! 아래 버튼을 클릭하여 다운로드하세요.');
            addDownloadButton(result.downloadUrl, result.fileName);

        } catch (error) {
            console.error('Error creating shorts:', error);
            let errorMessage = `❌ 오류가 발생했습니다: ${error.message}`;
            if (error.message.includes("Failed to fetch")) {
                errorMessage += '\n\n💡 팁: 백엔드 서버가 로컬에서 HTTPS로 실행 중인지 확인하세요.<br>브라우저에서 처음 접속 시 나타나는 \'주의 요함\' 경고를 무시하고 \'계속 진행\'을 클릭해야 할 수 있습니다.';
            }
            addStatusMessage(errorMessage);
        } finally {
            // This block will now always execute, ensuring the button is re-enabled.
            createShortsBtn.disabled = false;
            createShortsBtn.textContent = '쇼츠 제작하기';
        }
    }
});
