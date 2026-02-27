document.addEventListener('DOMContentLoaded', () => {
    // Translations
    const translations = {
        ko: {
            "animal-title": "동물상 테스트",
            "animal-subtitle": "강아지, 고양이, 고슴도치 중 당신은 어떤 동물상인가요?",
            "start-test": "테스트 시작하기",
            "loading-model": "모델을 불러오는 중...",
            "other-tool": "다른 도구:",
            "lotto-nav": "로또 번호 생성기",
            "lotto-title": "로또 번호 생성기",
            "generate-btn": "번호 생성하기",
            "animal-nav": "동물상 테스트",
            "collab-ask": "비즈니스 협업을 원하시나요?",
            "contact-btn": "제휴 문의하기",
            "toggle-mode": "테마 변경",
            "camera-error": "카메라를 시작할 수 없습니다. 권한을 확인해주세요.",
            "mode-camera": "카메라",
            "mode-file": "파일 업로드",
            "upload-image": "이미지 선택하기",
            "Dog": "강아지",
            "Cat": "고양이",
            "Hedgehog": "고슴도치",
            "contact-title": "제휴 문의 - 로또 번호 생성기",
            "contact-h2": "제휴 문의",
            "contact-p": "제휴 및 협력 제안을 남겨주시면 검토 후 연락드리겠습니다.",
            "label-name": "이름",
            "label-email": "이메일",
            "label-message": "문의 내용",
            "placeholder-name": "성함을 입력해주세요",
            "placeholder-email": "이메일 주소를 입력해주세요",
            "placeholder-message": "문의하실 내용을 입력해주세요",
            "submit-btn": "보내기",
            "back-to-main": "← 메인으로 돌아가기",
            "comments-title": "댓글"
        },
        en: {
            "animal-title": "Animal Face Test",
            "animal-subtitle": "Dog, Cat, or Hedgehog - which animal face do you have?",
            "start-test": "Start Test",
            "loading-model": "Loading model...",
            "other-tool": "Other Tool:",
            "lotto-nav": "Lotto Generator",
            "lotto-title": "Lotto Number Generator",
            "generate-btn": "Generate Numbers",
            "animal-nav": "Animal Face Test",
            "collab-ask": "Want to collaborate?",
            "contact-btn": "Contact Us",
            "toggle-mode": "Toggle Mode",
            "camera-error": "Cannot start camera. Please check permissions.",
            "mode-camera": "Camera",
            "mode-file": "File Upload",
            "upload-image": "Select Image",
            "Dog": "Dog",
            "Cat": "Cat",
            "Hedgehog": "Hedgehog",
            "contact-title": "Contact Us - Lotto Generator",
            "contact-h2": "Contact Us",
            "contact-p": "Please leave your partnership or collaboration proposals, and we will get back to you after review.",
            "label-name": "Name",
            "label-email": "Email",
            "label-message": "Message",
            "placeholder-name": "Please enter your name",
            "placeholder-email": "Please enter your email address",
            "placeholder-message": "Please enter your inquiry",
            "submit-btn": "Send",
            "back-to-main": "← Back to Main",
            "comments-title": "Comments"
        }
    };

    let currentLang = localStorage.getItem('preferred-lang') || 'ko';

    function updateLanguage() {
        // Text content translation
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.textContent = translations[currentLang][key];
            }
        });

        // Placeholder translation
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[currentLang][key]) {
                el.placeholder = translations[currentLang][key];
            }
        });

        // Title translation
        const titleKey = document.querySelector('title').getAttribute('data-i18n');
        if (titleKey && translations[currentLang][titleKey]) {
            document.title = translations[currentLang][titleKey];
        }

        localStorage.setItem('preferred-lang', currentLang);

        // Update result labels if they exist
        if (typeof labelContainer !== 'undefined' && labelContainer && typeof model !== 'undefined' && model) {
            const resultLabels = labelContainer.querySelectorAll('.result-label');
            resultLabels.forEach((label, i) => {
                const originalLabel = model.getClassLabels()[i];
                label.textContent = translations[currentLang][originalLabel] || originalLabel;
            });
        }
    }

    // Initial language set
    updateLanguage();

    const langSwitcher = document.getElementById('lang-switcher');
    langSwitcher.addEventListener('click', () => {
        currentLang = currentLang === 'ko' ? 'en' : 'ko';
        updateLanguage();
    });

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
        if (webcam) webcam.stop();
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
    const imagePreview = document.getElementById('image-preview');
    const imageUpload = document.getElementById('image-upload');
    const uploadTriggerBtn = document.getElementById('upload-trigger-btn');
    const cameraControls = document.getElementById('camera-controls');
    const fileControls = document.getElementById('file-controls');
    const modeCameraBtn = document.getElementById('mode-camera-btn');
    const modeFileBtn = document.getElementById('mode-file-btn');

    // Mode selection logic
    modeCameraBtn.addEventListener('click', () => {
        modeCameraBtn.classList.add('active');
        modeFileBtn.classList.remove('active');
        cameraControls.classList.remove('hidden');
        fileControls.classList.add('hidden');
        webcamContainer.classList.remove('hidden');
        imagePreview.classList.add('hidden');
        if (webcam) webcam.play();
    });

    modeFileBtn.addEventListener('click', () => {
        modeFileBtn.classList.add('active');
        modeCameraBtn.classList.remove('active');
        fileControls.classList.remove('hidden');
        cameraControls.classList.add('hidden');
        imagePreview.classList.remove('hidden');
        webcamContainer.classList.add('hidden');
        if (webcam) webcam.stop();
    });

    async function loadModel() {
        if (!model) {
            loadingSpinner.classList.remove('hidden');
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
            loadingSpinner.classList.add('hidden');
            createLabelContainer();
        }
    }

    function createLabelContainer() {
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = '';
        for (let i = 0; i < maxPredictions; i++) {
            const originalLabel = model.getClassLabels()[i];
            const resultBar = document.createElement("div");
            resultBar.className = "result-bar-container";
            resultBar.innerHTML = `
                <div class="result-label">${translations[currentLang][originalLabel] || originalLabel}</div>
                <div class="result-bar-bg">
                    <div class="result-bar-fill" style="width: 0%"></div>
                </div>
                <div class="result-percentage">0%</div>
            `;
            labelContainer.appendChild(resultBar);
        }
    }

    async function initWebcam() {
        await loadModel();
        cameraControls.classList.add('hidden');

        try {
            const flip = true; 
            webcam = new tmImage.Webcam(200, 200, flip); 
            await webcam.setup(); 
            await webcam.play();
            window.requestAnimationFrame(loop);
            webcamContainer.appendChild(webcam.canvas);
        } catch (error) {
            console.error("Error starting webcam:", error);
            alert(translations[currentLang]["camera-error"]);
            cameraControls.classList.remove('hidden');
        }
    }

    async function loop() {
        if (webcam && !webcam.paused) {
            webcam.update();
            await predict(webcam.canvas);
            window.requestAnimationFrame(loop);
        }
    }

    async function predict(inputMedia) {
        if (!model) return;
        const prediction = await model.predict(inputMedia);
        for (let i = 0; i < maxPredictions; i++) {
            const percentage = (prediction[i].probability * 100).toFixed(0);
            const bar = labelContainer.childNodes[i].querySelector('.result-bar-fill');
            const percentText = labelContainer.childNodes[i].querySelector('.result-percentage');
            
            bar.style.width = percentage + "%";
            percentText.innerHTML = percentage + "%";
        }
    }

    startBtn.addEventListener('click', initWebcam);

    // File upload logic
    uploadTriggerBtn.addEventListener('click', () => imageUpload.click());

    imageUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            imagePreview.src = event.target.result;
            imagePreview.onload = async () => {
                await loadModel();
                await predict(imagePreview);
            };
        };
        reader.readAsDataURL(file);
    });

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
