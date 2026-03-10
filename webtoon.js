document.addEventListener('DOMContentLoaded', () => {
    // Configuration for the backend server endpoint.
    // In a real deployment, this would be a public URL.
    const API_BASE_URL = 'http://127.0.0.1:5000'; 

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

            // Disable button to prevent multiple requests
            createShortsBtn.disabled = true;
            createShortsBtn.textContent = '⏳ 제작 중...';

            // Clear previous status and start the process
            statusContainer.innerHTML = ''; 
            requestShortsCreation(url);
        });
    }

    function addStatusMessage(message) {
        const p = document.createElement('p');
        p.textContent = message;
        statusContainer.appendChild(p);
        statusContainer.scrollTop = statusContainer.scrollHeight; // Scroll to bottom
    }

    function addDownloadButton(downloadUrl, fileName) {
        const downloadBtn = document.createElement('a');
        // The URL points to our backend's download endpoint
        downloadBtn.href = `${API_BASE_URL}${downloadUrl}`;
        downloadBtn.textContent = `🎬 ${fileName} 다운로드`;
        downloadBtn.classList.add('button-link'); 
        // The 'download' attribute tells the browser to download the file
        downloadBtn.setAttribute('download', fileName);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginTop = '20px';
        buttonContainer.appendChild(downloadBtn);

        statusContainer.appendChild(buttonContainer);
        statusContainer.scrollTop = statusContainer.scrollHeight;
    }

    async function requestShortsCreation(url) {
        addStatusMessage('✅ 요청이 접수되었습니다. 백엔드 서버에 작업을 요청하는 중입니다...');

        try {
            const response = await fetch(`${API_BASE_URL}/api/create-shorts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });

            // Re-enable the button regardless of outcome
            createShortsBtn.disabled = false;
            createShortsBtn.textContent = '쇼츠 제작하기';

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `서버 오류: ${response.status}`);
            }

            const result = await response.json();

            addStatusMessage('✅ 영상 제작이 완료되었습니다! 아래 버튼을 클릭하여 다운로드하세요.');
            addDownloadButton(result.downloadUrl, result.fileName);

        } catch (error) {
            console.error('Error creating shorts:', error);
            addStatusMessage(`❌ 오류가 발생했습니다: ${error.message}`);
            addStatusMessage('백엔드 서버가 실행 중인지, FFmpeg가 설치되었는지 확인해주세요.');
            // Re-enable the button on error
            createShortsBtn.disabled = false;
            createShortsBtn.textContent = '쇼츠 제작하기';
        }
    }
});
