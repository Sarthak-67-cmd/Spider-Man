// --- 1. SUIT DATA ---
const suits = [
    {
        name: "HOMEMADE SUIT",
        armor: 45, tech: 30, agility: 95,
        image: "https://cdn-icons-png.flaticon.com/512/1090/1090806.png" 
    },
    {
        name: "INTEGRATED SUIT",
        armor: 85, tech: 95, agility: 90,
        image: "https://cdn-icons-png.flaticon.com/512/1709/1709121.png"
    },
    {
        name: "IRON SPIDER",
        armor: 100, tech: 100, agility: 80,
        image: "https://cdn-icons-png.flaticon.com/512/1090/1090806.png"
    },
    {
        name: "BLACK & GOLD",
        armor: 65, tech: 85, agility: 85,
        image: "https://cdn-icons-png.flaticon.com/512/1709/1709121.png"
    }
];

let currentSuitIndex = 0;

// DOM Elements
const uiVoice = document.getElementById('voice-ui');
const uiFabricator = document.getElementById('fabricator-ui');
const micBtn = document.getElementById('mic-btn');
const statusText = document.getElementById('status-text');

// --- 2. VOICE RECOGNITION (J.A.R.V.I.S) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    let isListening = false;
    
    micBtn.addEventListener('click', () => {
        if (isListening) return;

        try {
            recognition.start();
            isListening = true;
            micBtn.classList.add('listening');
            statusText.innerText = "LISTENING...";
        } catch (error) {
            console.log("Microphone active or error.");
        }
    });

    recognition.onresult = (event) => {
        isListening = false;
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Heard: ", transcript);
        micBtn.classList.remove('listening');

        if (transcript.includes("jarvis") && transcript.includes("spider")) {
            statusText.innerText = "ACCESS GRANTED";
            setTimeout(activateFabricator, 1200);
        } else {
            statusText.innerText = "TRY AGAIN";
        }
    };

    recognition.onerror = () => {
        isListening = false;
        micBtn.classList.remove('listening');
        statusText.innerText = "AUDIO ERROR";
    };
    
    recognition.onend = () => {
        isListening = false;
        micBtn.classList.remove('listening');
    };
    
} else {
    statusText.innerText = "NO SPEECH API";
}

// --- 3. UI TRANSITION ---
function activateFabricator() {
    uiVoice.style.opacity = '0';
    uiVoice.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        uiVoice.classList.add('hidden');
        uiFabricator.classList.remove('hidden');
        
        setTimeout(() => {
            uiFabricator.style.opacity = '1';
            uiFabricator.style.transition = 'opacity 1s ease';
            updateSuitDisplay();
        }, 50);
    }, 800);
}

// --- 4. DISPLAY & STATS ---
function updateSuitDisplay() {
    const suit = suits[currentSuitIndex];
    const imgEl = document.getElementById('suit-image');
    
    imgEl.style.opacity = '0';
    imgEl.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        imgEl.src = suit.image;
        imgEl.style.opacity = '1';
        imgEl.style.transform = 'translateY(0)';
    }, 300);

    document.getElementById('suit-name').innerText = suit.name;
    
    updateBar('armor', suit.armor);
    updateBar('tech', suit.tech);
    updateBar('agility', suit.agility);
}

function updateBar(statName, value) {
    document.getElementById(`stat-${statName}`).style.width = '0%';
    setTimeout(() => {
        document.getElementById(`stat-${statName}`).style.width = `${value}%`;
        document.getElementById(`stat-${statName}-val`).innerText = `${value}%`;
    }, 100);
}

function nextSuit() {
    currentSuitIndex = (currentSuitIndex + 1) % suits.length;
    updateSuitDisplay();
}

function prevSuit() {
    currentSuitIndex = (currentSuitIndex - 1 + suits.length) % suits.length;
    updateSuitDisplay();
}

// --- 5. FABRICATION ACTION ---
function fabricateSuit() {
    const suit = suits[currentSuitIndex];
    const projection = document.querySelector('.holo-projection');
    const fabBtn = document.querySelector('.fabricate-btn');
    
    fabBtn.disabled = true;
    fabBtn.innerText = "FABRICATING...";
    projection.classList.add('fabricating');

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const voiceMessage = new SpeechSynthesisUtterance(`Initiating fabrication process for the ${suit.name}.`);
        voiceMessage.rate = 0.95;
        window.speechSynthesis.speak(voiceMessage);
    }

    setTimeout(() => {
        projection.classList.remove('fabricating');
        fabBtn.disabled = false;
        fabBtn.innerText = "COMPLETE";

        if ('speechSynthesis' in window) {
            const completeMessage = new SpeechSynthesisUtterance(`${suit.name} ready.`);
            window.speechSynthesis.speak(completeMessage);
        }

        setTimeout(() => { fabBtn.innerText = "FABRICATE"; }, 2500);
    }, 3500);
}