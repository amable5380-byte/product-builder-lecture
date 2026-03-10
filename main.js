const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const predictButton = document.getElementById('predict-button');
const labelContainer = document.getElementById('label-container');

const URL = "https://teachablemachine.withgoogle.com/models/x8ciNIai5/";

let model;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                predictButton.style.display = 'block';
                labelContainer.innerHTML = ''; // Clear previous results
            };
            reader.readAsDataURL(file);
        }
    });

    predictButton.addEventListener('click', async () => {
        if (imagePreview.src) {
            const prediction = await model.predict(imagePreview);
            displayPredictions(prediction);
        }
    });
}

function displayPredictions(prediction) {
    labelContainer.innerHTML = ''; // Clear previous results
    prediction.forEach(p => {
        const classPrediction = `${p.className}: ${p.probability.toFixed(2)}`;
        const div = document.createElement('div');
        div.innerText = classPrediction;
        labelContainer.appendChild(div);
    });
}

init();