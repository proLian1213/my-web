const app = {
    audioCtx: null,
    state: {
        license: '',
        fuelType: '',
        pumpNumber: 0,
        paymentMethod: '',
        totalAmount: 0,
        dni: '',
        wantsInvoice: false
    },

    init() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        this.showScreen('screen-welcome');


        // Precargar las voces del sistema
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }

        // Añadir sonido a todos los botones interactivos
        document.querySelectorAll('button, .fuel-card, .payment-card').forEach(el => {
            el.addEventListener('click', () => this.playClickSound());
        });
    },

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    },

    playClickSound() {
        this.initAudio();
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.type = 'sine'; // Sonido suave estilo "bip" digital
        oscillator.frequency.setValueAtTime(1200, this.audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioCtx.currentTime + 0.08);

        gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + 0.08);
    },

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('time-display').textContent = timeString;
    },

    showScreen(screenId) {
        const targetScreen = document.getElementById(screenId);
        
        // Evitar quitar la clase active si ya la tiene (esto abortaba el autoplay de Safari al hacer un display:none temporal)
        if (!targetScreen.classList.contains('active')) {
            document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
            targetScreen.classList.add('active');
        }

        // Text-to-speech mapping
        let textToSpeak = '';
        switch(screenId) {
            case 'screen-welcome':
                textToSpeak = 'Bienvenido a GasGas. Toca la pantalla para empezar.';
                break;
            case 'screen-user-type':
                textToSpeak = '¿Es usted usuario registrado?';
                break;
            case 'screen-license':
                textToSpeak = 'Por favor, introduzca su matrícula.';
                break;
            case 'screen-fuel':
                textToSpeak = 'Seleccione el tipo de combustible.';
                break;
            case 'screen-pump':
                textToSpeak = 'Seleccione el número de surtidor.';
                break;
            case 'screen-payment-method':
                textToSpeak = '¿Cómo desea realizar el pago?';
                break;
            case 'screen-cash':
                textToSpeak = 'Indique el importe que va a introducir en metálico. Recuerde que la máquina no devuelve cambio.';
                break;
            case 'screen-card':
                textToSpeak = 'Seleccione el importe a pagar.';
                break;
            case 'screen-invoice-ask':
                textToSpeak = '¿Desea factura de esta operación?';
                break;
            case 'screen-invoice-details':
                textToSpeak = 'Introduzca su Documento Nacional de Identidad.';
                break;
            case 'screen-success':
                textToSpeak = 'Operación completada. Puede suministrarse. Gracias por confiar en GasGas. ¡Buen viaje!';
                break;
        }
        
        // Timeout to ensure DOM is ready and any click interactions register
        setTimeout(() => this.speak(textToSpeak), 300);
    },

    speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any previous speech
            
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'es-ES';
            msg.rate = 1.0;
            msg.pitch = 1.0; // Tono normal para mayor realismo
            
            // Buscar una voz más realista (nativa premium o de Google)
            const voices = window.speechSynthesis.getVoices();
            const preferredVoices = [
                'Google español', 
                'Monica', // macOS premium España
                'Jorge',  // macOS premium España
                'Luciana', // macOS premium Latam
                'Paulina', // macOS premium México
                'Microsoft Sabina', // Windows premium
                'Microsoft Helena'  // Windows premium
            ];
            
            let selectedVoice = voices.find(v => preferredVoices.some(p => v.name.includes(p)));
            
            if (!selectedVoice) {
                // Fallback a cualquier voz en español si no se encuentra la premium
                selectedVoice = voices.find(v => v.lang.startsWith('es'));
            }
            
            if (selectedVoice) {
                msg.voice = selectedVoice;
            }
            
            const indicator = document.getElementById('ai-voice-indicator');
            indicator.classList.add('speaking');
            
            msg.onend = () => indicator.classList.remove('speaking');
            msg.onerror = () => indicator.classList.remove('speaking');

            window.speechSynthesis.speak(msg);
        }
    },

    toggleKeypad() {
        const nums = document.getElementById('keypad-numbers');
        const lets = document.getElementById('keypad-letters');
        if (nums.style.display !== 'none') {
            nums.style.display = 'none';
            lets.style.display = 'grid';
        } else {
            nums.style.display = 'grid';
            lets.style.display = 'none';
        }
    },

    // License Plate Logic
    typeLicense(char) {
        if (this.state.license.length < 8) {
            this.state.license += char;
            this.updateLicenseDisplay();
        }
    },

    deleteLicense() {
        this.state.license = this.state.license.slice(0, -1);
        this.updateLicenseDisplay();
    },

    updateLicenseDisplay() {
        const display = document.getElementById('license-display');
        display.textContent = this.state.license || '_ _ _ _ _ _ _';
    },

    skipLicense() {
        this.state.license = '';
        this.updateLicenseDisplay();
        this.showScreen('screen-fuel');
    },

    submitLicense() {
        if (this.state.license.length >= 4) {
            this.showScreen('screen-fuel');
        } else {
            const display = document.getElementById('license-display');
            display.style.borderColor = 'red';
            setTimeout(() => display.style.borderColor = 'var(--primary-color)', 500);
        }
    },

    goBackFromFuel() {
        if (this.state.license === '') {
            this.showScreen('screen-user-type');
        } else {
            this.showScreen('screen-license');
        }
    },

    // Fuel Logic
    selectFuel(type) {
        this.state.fuelType = type;
        this.showScreen('screen-pump');
    },

    // Pump Logic
    selectPump(number) {
        this.state.pumpNumber = number;
        this.showScreen('screen-payment-method');
    },

    // Payment Method Logic
    selectPaymentMethod(method) {
        this.state.paymentMethod = method;
        this.state.totalAmount = 0;
        this.updateAmountDisplay();
        
        if (method === 'Efectivo') {
            this.showScreen('screen-cash');
        } else {
            this.showScreen('screen-card');
        }
    },

    // Card Amount Logic
    addAmount(amount) {
        this.state.totalAmount += amount;
        this.updateAmountDisplay();
    },

    resetAmount() {
        this.state.totalAmount = 0;
        this.updateAmountDisplay();
    },

    updateAmountDisplay() {
        const displays = document.querySelectorAll('.dynamic-amount');
        displays.forEach(display => {
            display.textContent = `${this.state.totalAmount.toFixed(2)} €`;
        });
    },

    processCardPayment() {
        if (this.state.totalAmount > 0) {
            this.showScreen('screen-invoice-ask');
        } else {
            const display = document.getElementById('total-amount-display');
            display.style.color = 'red';
            setTimeout(() => display.style.color = 'var(--primary-color)', 500);
        }
    },

    processCashPayment() {
        if (this.state.totalAmount > 0) {
            this.showScreen('screen-invoice-ask');
        } else {
            const display = document.getElementById('cash-amount-display');
            display.style.color = 'red';
            setTimeout(() => display.style.color = 'var(--primary-color)', 500);
        }
    },

    // Invoice Logic
    wantsInvoice(yesOrNo) {
        this.state.wantsInvoice = yesOrNo;
        if (yesOrNo) {
            this.state.dni = '';
            this.updateDNIDisplay();
            this.showScreen('screen-invoice-details');
        } else {
            this.finishProcess();
        }
    },

    typeDNI(char) {
        if (this.state.dni.length < 9) {
            this.state.dni += char;
            this.updateDNIDisplay();
        }
    },

    deleteDNI() {
        this.state.dni = this.state.dni.slice(0, -1);
        this.updateDNIDisplay();
    },

    updateDNIDisplay() {
        const display = document.getElementById('dni-display');
        display.textContent = this.state.dni || '_ _ _ _ _ _ _ _ _';
    },

    submitDNI() {
        if (this.state.dni.length >= 8) {
            this.finishProcess();
        } else {
            const display = document.getElementById('dni-display');
            display.style.borderColor = 'red';
            setTimeout(() => display.style.borderColor = 'var(--primary-color)', 500);
        }
    },

    // Success
    finishProcess() {
        const receiptContainer = document.getElementById('receipt-info');
        receiptContainer.innerHTML = `
            <div><span>Surtidor:</span> <strong>${this.state.pumpNumber}</strong></div>
            <div><span>Combustible:</span> <strong>${this.state.fuelType}</strong></div>
            <div><span>Pago:</span> <strong>${this.state.paymentMethod}</strong></div>
            <div><span>Importe:</span> <strong>${this.state.totalAmount.toFixed(2)} €</strong></div>
            ${this.state.wantsInvoice ? `<div><span>Factura a:</span> <strong>${this.state.dni}</strong></div>` : ''}
        `;
        this.showScreen('screen-success');
    },

    resetApp() {
        this.state = {
            license: '',
            fuelType: '',
            pumpNumber: 0,
            paymentMethod: '',
            totalAmount: 0,
            dni: '',
            wantsInvoice: false
        };
        this.updateLicenseDisplay();
        this.updateAmountDisplay();
        this.updateDNIDisplay();
        this.showScreen('screen-welcome');
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
