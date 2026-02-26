document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
    });

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

    document.getElementById('generator-btn').addEventListener('click', () => {
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
});
