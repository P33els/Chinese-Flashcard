// Global Variables
let words = [];
let filteredWords = [];
let currentIndex = 0;
let userStats = {
    remember: {},
    notSure: {},
    forgot: {},
    sessionCount: 0,
    startTime: Date.now()
};

// wordsData is loaded from words.js (external file)

// DOM Elements
const flashcard = document.getElementById('flashcard');
const hanziEl = document.getElementById('hanzi');
const pinyinEl = document.getElementById('pinyin');
const cardTypeEl = document.getElementById('cardType');
const hanziBackEl = document.getElementById('hanziBack');
const meaningEl = document.getElementById('meaning');
const exampleCnEl = document.getElementById('exampleCn');
const exampleThEl = document.getElementById('exampleTh');
const noteEl = document.getElementById('note');
const soundBtn = document.getElementById('soundBtn');
const strokeBtn = document.getElementById('strokeBtn');
const strokeContainer = document.getElementById('strokeContainer');
const strokeDisplay = document.getElementById('strokeDisplay');
const rememberBtn = document.getElementById('rememberBtn');
const notSureBtn = document.getElementById('notSureBtn');
const forgotBtn = document.getElementById('forgotBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const resetBtn = document.getElementById('resetBtn');
const filterSelect = document.getElementById('filterSelect');
const statsBtn = document.getElementById('statsBtn');
const statsModal = document.getElementById('statsModal');
const closeModal = document.getElementById('closeModal');

// Load words from JSON
async function loadWords() {
    try {
        // Try to load from embedded data first (for file:// protocol)
        if (typeof wordsData !== 'undefined' && wordsData !== null) {
            words = wordsData;
        } else {
            // Try fetch (works with http:// and Live Server)
            const response = await fetch('words.json');
            if (!response.ok) throw new Error('Fetch failed');
            words = await response.json();
        }
        loadUserStats();
        applyFilter();
        updateDisplay();
        updateStatsDisplay();
    } catch (error) {
        console.error('Error loading words:', error);
        // Try loading from script tag as fallback
        if (typeof wordsData !== 'undefined' && wordsData !== null) {
            words = wordsData;
            loadUserStats();
            applyFilter();
            updateDisplay();
            updateStatsDisplay();
        } else {
            hanziEl.textContent = '❌';
            meaningEl.textContent = 'ไม่สามารถโหลดข้อมูลได้';
            document.querySelector('.flip-hint').textContent = 'กรุณาใช้ Live Server หรือเซิร์ฟเวอร์เพื่อเปิดไฟล์';
        }
    }
}

// Load user stats from localStorage
function loadUserStats() {
    const saved = localStorage.getItem('flashcardStats');
    if (saved) {
        userStats = JSON.parse(saved);
        userStats.startTime = Date.now();
        userStats.sessionCount = 0;
    }
}

// Save user stats to localStorage
function saveUserStats() {
    localStorage.setItem('flashcardStats', JSON.stringify(userStats));
}

// Apply filter based on selection
function applyFilter() {
    const filter = filterSelect.value;
    
    switch (filter) {
        case 'all':
            filteredWords = [...words];
            break;
        case 'unseen':
            filteredWords = words.filter(w => 
                !userStats.remember[w.hanzi] && 
                !userStats.notSure[w.hanzi] && 
                !userStats.forgot[w.hanzi]
            );
            break;
        case 'remember':
            filteredWords = words.filter(w => userStats.remember[w.hanzi]);
            break;
        case 'not-sure':
            filteredWords = words.filter(w => userStats.notSure[w.hanzi]);
            break;
        case 'forgot':
            filteredWords = words.filter(w => userStats.forgot[w.hanzi]);
            break;
    }
    
    if (filteredWords.length === 0) {
        filteredWords = [...words];
        filterSelect.value = 'all';
    }
    
    currentIndex = 0;
    document.getElementById('totalCards').textContent = filteredWords.length;
}

// Update card display
function updateDisplay() {
    if (filteredWords.length === 0) return;
    
    const word = filteredWords[currentIndex];
    
    // Front side
    hanziEl.textContent = word.hanzi;
    pinyinEl.textContent = word.pinyin;
    cardTypeEl.textContent = word.type || '';
    
    // Back side
    hanziBackEl.textContent = word.hanzi;
    meaningEl.textContent = word.meaning;
    exampleCnEl.textContent = word.example_cn || '';
    exampleThEl.textContent = word.example_th || '';
    noteEl.innerHTML = word.note || '';
    
    // Update progress
    document.getElementById('currentIndex').textContent = currentIndex + 1;
    
    // Reset flip state
    flashcard.classList.remove('flipped');
    
    // Hide stroke container
    strokeContainer.classList.remove('active');
    
    // Update navigation buttons
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === filteredWords.length - 1;
    
    // Highlight current status
    highlightStatus(word.hanzi);
}

// Highlight current word status
function highlightStatus(hanzi) {
    rememberBtn.classList.remove('active');
    notSureBtn.classList.remove('active');
    forgotBtn.classList.remove('active');
    
    if (userStats.remember[hanzi]) {
        rememberBtn.style.boxShadow = '0 0 20px rgba(46, 213, 115, 0.8)';
    } else {
        rememberBtn.style.boxShadow = '';
    }
    
    if (userStats.notSure[hanzi]) {
        notSureBtn.style.boxShadow = '0 0 20px rgba(255, 193, 7, 0.8)';
    } else {
        notSureBtn.style.boxShadow = '';
    }
    
    if (userStats.forgot[hanzi]) {
        forgotBtn.style.boxShadow = '0 0 20px rgba(255, 71, 87, 0.8)';
    } else {
        forgotBtn.style.boxShadow = '';
    }
}

// Update stats display
function updateStatsDisplay() {
    const rememberCount = Object.keys(userStats.remember).length;
    const notSureCount = Object.keys(userStats.notSure).length;
    const forgotCount = Object.keys(userStats.forgot).length;
    const total = words.length;
    
    document.getElementById('rememberCount').textContent = rememberCount;
    document.getElementById('notSureCount').textContent = notSureCount;
    document.getElementById('forgotCount').textContent = forgotCount;
    document.getElementById('totalCount').textContent = total;
    
    // Update progress bar
    const rememberPercent = (rememberCount / total) * 100;
    const notSurePercent = (notSureCount / total) * 100;
    const forgotPercent = (forgotCount / total) * 100;
    
    document.getElementById('progressRemember').style.width = rememberPercent + '%';
    document.getElementById('progressNotSure').style.width = notSurePercent + '%';
    document.getElementById('progressForgot').style.width = forgotPercent + '%';
    
    // Update modal stats
    document.getElementById('statRememberPercent').textContent = Math.round(rememberPercent) + '%';
    document.getElementById('statNotSurePercent').textContent = Math.round(notSurePercent) + '%';
    document.getElementById('statForgotPercent').textContent = Math.round(forgotPercent) + '%';
    document.getElementById('sessionCount').textContent = userStats.sessionCount;
    
    const studyMinutes = Math.round((Date.now() - userStats.startTime) / 60000);
    document.getElementById('studyTime').textContent = studyMinutes;
}

// Mark word status
function markWord(status) {
    if (filteredWords.length === 0) return;
    
    const hanzi = filteredWords[currentIndex].hanzi;
    
    // Remove from all categories first
    delete userStats.remember[hanzi];
    delete userStats.notSure[hanzi];
    delete userStats.forgot[hanzi];
    
    // Add to selected category
    switch (status) {
        case 'remember':
            userStats.remember[hanzi] = true;
            break;
        case 'not-sure':
            userStats.notSure[hanzi] = true;
            break;
        case 'forgot':
            userStats.forgot[hanzi] = true;
            break;
    }
    
    userStats.sessionCount++;
    saveUserStats();
    updateStatsDisplay();
    highlightStatus(hanzi);
    
    // Auto advance to next card
    if (currentIndex < filteredWords.length - 1) {
        setTimeout(() => {
            currentIndex++;
            updateDisplay();
        }, 300);
    }
}

// Play sound using Web Speech API or Google Translate TTS
function playSound() {
    if (filteredWords.length === 0) return;
    
    const text = filteredWords[currentIndex].hanzi;
    
    // Try Web Speech API first
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.8;
        
        // Get Chinese voice if available
        const voices = speechSynthesis.getVoices();
        const chineseVoice = voices.find(v => v.lang.includes('zh'));
        if (chineseVoice) {
            utterance.voice = chineseVoice;
        }
        
        speechSynthesis.speak(utterance);
    } else {
        // Fallback to Google TTS
        const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=zh-CN&client=tw-ob`);
        audio.play().catch(e => {
            console.log('Audio play failed:', e);
            alert('ไม่สามารถเล่นเสียงได้ กรุณาใช้เบราว์เซอร์อื่น');
        });
    }
}

// Show stroke order using HanziWriter library
function showStrokeOrder() {
    strokeContainer.classList.toggle('active');
    
    if (strokeContainer.classList.contains('active')) {
        strokeDisplay.innerHTML = '';
        
        if (filteredWords.length === 0) return;
        
        const hanzi = filteredWords[currentIndex].hanzi;
        const chars = hanzi.split('').filter(c => /[\u4e00-\u9fa5]/.test(c));
        
        if (chars.length === 0) {
            strokeDisplay.innerHTML = '<p style="color: #666;">ไม่มีตัวอักษรจีนในคำนี้</p>';
            return;
        }
        
        // Load HanziWriter dynamically
        if (!window.HanziWriter) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js';
            script.onload = () => createStrokeWriters(chars);
            document.head.appendChild(script);
        } else {
            createStrokeWriters(chars);
        }
    }
}

// Create HanziWriter instances for each character
function createStrokeWriters(chars) {
    strokeDisplay.innerHTML = '';
    
    chars.forEach((char, index) => {
        const container = document.createElement('div');
        container.id = `stroke-${index}`;
        container.className = 'stroke-char';
        strokeDisplay.appendChild(container);
        
        try {
            const writer = HanziWriter.create(`stroke-${index}`, char, {
                width: 120,
                height: 120,
                padding: 5,
                strokeAnimationSpeed: 1,
                delayBetweenStrokes: 300,
                strokeColor: '#333',
                radicalColor: '#168F16',
                showOutline: true,
                showCharacter: false
            });
            
            container.addEventListener('click', () => {
                writer.animateCharacter();
            });
            
            // Auto animate first character
            if (index === 0) {
                setTimeout(() => writer.animateCharacter(), 500);
            }
        } catch (e) {
            console.error('HanziWriter error:', e);
            container.innerHTML = `<span style="font-size: 3rem; display: flex; justify-content: center; align-items: center; height: 100%; color: #333;">${char}</span>`;
        }
    });
}

// Shuffle cards
function shuffleCards() {
    filteredWords = filteredWords.sort(() => Math.random() - 0.5);
    currentIndex = 0;
    updateDisplay();
}

// Reset all stats
function resetStats() {
    if (confirm('ต้องการรีเซ็ตสถิติทั้งหมดหรือไม่?')) {
        userStats = {
            remember: {},
            notSure: {},
            forgot: {},
            sessionCount: 0,
            startTime: Date.now()
        };
        saveUserStats();
        updateStatsDisplay();
        updateDisplay();
    }
}

// Event Listeners
flashcard.addEventListener('click', (e) => {
    if (e.target !== soundBtn && !soundBtn.contains(e.target)) {
        flashcard.classList.toggle('flipped');
    }
});

soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound();
});

strokeBtn.addEventListener('click', showStrokeOrder);

rememberBtn.addEventListener('click', () => markWord('remember'));
notSureBtn.addEventListener('click', () => markWord('not-sure'));
forgotBtn.addEventListener('click', () => markWord('forgot'));

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateDisplay();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < filteredWords.length - 1) {
        currentIndex++;
        updateDisplay();
    }
});

shuffleBtn.addEventListener('click', shuffleCards);
resetBtn.addEventListener('click', resetStats);

filterSelect.addEventListener('change', () => {
    applyFilter();
    updateDisplay();
});

statsBtn.addEventListener('click', () => {
    updateStatsDisplay();
    statsModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    statsModal.classList.remove('active');
});

statsModal.addEventListener('click', (e) => {
    if (e.target === statsModal) {
        statsModal.classList.remove('active');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Don't trigger if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    
    switch (e.key) {
        case ' ':
            e.preventDefault();
            flashcard.classList.toggle('flipped');
            break;
        case 'ArrowLeft':
            if (currentIndex > 0) {
                currentIndex--;
                updateDisplay();
            }
            break;
        case 'ArrowRight':
            if (currentIndex < filteredWords.length - 1) {
                currentIndex++;
                updateDisplay();
            }
            break;
        case '1':
            markWord('forgot');
            break;
        case '2':
            markWord('not-sure');
            break;
        case '3':
            markWord('remember');
            break;
        case 's':
        case 'S':
            playSound();
            break;
    }
});

// Initialize voices for speech synthesis
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
    };
}

// Load words on page load
document.addEventListener('DOMContentLoaded', loadWords);
