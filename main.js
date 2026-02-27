document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
    });

    // Navigation logic
    const showLottoBtn = document.getElementById('show-lotto');
    const showAnimalBtn = document.getElementById('show-animal');
    const lottoSection = document.querySelector('.lotto-section');
    const animalSection = document.querySelector('.container:not(.lotto-section)');

    showLottoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        lottoSection.classList.remove('hidden');
        animalSection.classList.add('hidden');
    });

    showAnimalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        animalSection.classList.remove('hidden');
        lottoSection.classList.add('hidden');
    });

    // Teachable Machine Logic
    const URL = "https://teachablemachine.withgoogle.com/models/GRZnprcWV/";
    let model, webcam, labelContainer, maxPredictions;

    const startBtn = document.getElementById('start-test-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const webcamContainer = document.getElementById('webcam-container');

    async function init() {
        startBtn.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        try {
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            const flip = true; 
            webcam = new tmImage.Webcam(200, 200, flip); 
            await webcam.setup(); 
            await webcam.play();
            window.requestAnimationFrame(loop);

            loadingSpinner.classList.add('hidden');
            webcamContainer.appendChild(webcam.canvas);
            
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) {
                const resultBar = document.createElement("div");
                resultBar.className = "result-bar-container";
                resultBar.innerHTML = `
                    <div class="result-label">${model.getClassLabels()[i]}</div>
                    <div class="result-bar-bg">
                        <div class="result-bar-fill" style="width: 0%"></div>
                    </div>
                    <div class="result-percentage">0%</div>
                `;
                labelContainer.appendChild(resultBar);
            }
        } catch (error) {
            console.error("Error starting webcam:", error);
            alert("카메라를 시작할 수 없습니다. 권한을 확인해주세요.");
            startBtn.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    }

    async function loop() {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }

    async function predict() {
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const percentage = (prediction[i].probability * 100).toFixed(0);
            const bar = labelContainer.childNodes[i].querySelector('.result-bar-fill');
            const percentText = labelContainer.childNodes[i].querySelector('.result-percentage');
            
            bar.style.width = percentage + "%";
            percentText.innerHTML = percentage + "%";
        }
    }

    startBtn.addEventListener('click', init);

    // Lotto Logic
    class LottoBall extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
            const number = this.getAttribute('number');
            const backgroundColor = this.getAttribute('color-hex') || '#2ecc71';

            this.shadowRoot.innerHTML = `
                <style>
                    .ball {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: white;
                        font-size: 28px;
                        font-weight: 700;
                        background-color: ${backgroundColor};
                        background-image: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 60%);
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), 
                                    inset 0 -8px 15px rgba(0, 0, 0, 0.2);
                        text-shadow: 0 1px 3px rgba(0,0,0,0.4);
                        animation: pop-in 0.5s ease-out forwards;
                    }

                    @keyframes pop-in {
                        from {
                            transform: scale(0);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                </style>
                <div class="ball">
                    <span>${number}</span>
                </div>
            `;
        }
    }

    customElements.define('lotto-ball', LottoBall);

    const generatorBtn = document.getElementById('generator-btn');
    if (generatorBtn) {
        generatorBtn.addEventListener('click', () => {
            const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
            lottoNumbersContainer.innerHTML = '';
            const numbers = new Set();
            while (numbers.size < 6) {
                const randomNumber = Math.floor(Math.random() * 45) + 1;
                numbers.add(randomNumber);
            }
            
            const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

            const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22'];
            colors.sort(() => Math.random() - 0.5);

            sortedNumbers.forEach((number, index) => {
                setTimeout(() => {
                    const lottoBall = document.createElement('lotto-ball');
                    lottoBall.setAttribute('number', number);
                    lottoBall.setAttribute('color-hex', colors[index]);
                    lottoNumbersContainer.appendChild(lottoBall);
                }, index * 250);
            });
        });
    }
});
