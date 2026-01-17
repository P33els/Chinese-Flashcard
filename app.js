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

// SRS (Spaced Repetition System) Data Structure
let srsData = {}; // { hanzi: { nextReview, interval, easeFactor, reviewCount } }

// Prevent rapid clicking
let isProcessing = false;
let autoAdvanceTimeout = null;

// Session state (for preserving position on refresh)
let sessionState = {
    currentIndex: 0,
    filterValue: 'all'
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
        
        // Restore filter selection
        if (sessionState.filterValue) {
            filterSelect.value = sessionState.filterValue;
        }
        
        applyFilter();
        
        // Restore card position
        if (sessionState.currentIndex >= 0 && sessionState.currentIndex < filteredWords.length) {
            currentIndex = sessionState.currentIndex;
        }
        
        updateDisplay();
        updateStatsDisplay();
    } catch (error) {
        console.error('Error loading words:', error);
        // Try loading from script tag as fallback
        if (typeof wordsData !== 'undefined' && wordsData !== null) {
            words = wordsData;
            loadUserStats();
            
            // Restore filter selection
            if (sessionState.filterValue) {
                filterSelect.value = sessionState.filterValue;
            }
            
            applyFilter();
            
            // Restore card position
            if (sessionState.currentIndex >= 0 && sessionState.currentIndex < filteredWords.length) {
                currentIndex = sessionState.currentIndex;
            }
            
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
    
    // Load SRS data
    const savedSRS = localStorage.getItem('flashcardSRS');
    if (savedSRS) {
        srsData = JSON.parse(savedSRS);
    }
    
    // Load session state (position and filter)
    const savedSession = localStorage.getItem('flashcardSession');
    if (savedSession) {
        sessionState = JSON.parse(savedSession);
    }
}

// Save user stats to localStorage
function saveUserStats() {
    localStorage.setItem('flashcardStats', JSON.stringify(userStats));
    localStorage.setItem('flashcardSRS', JSON.stringify(srsData));
    localStorage.setItem('flashcardSession', JSON.stringify(sessionState));
}

// Apply filter based on selection
function applyFilter() {
    const filter = filterSelect.value;
    const now = Date.now();
    
    switch (filter) {
        case 'all':
            filteredWords = [...words];
            break;
        case 'due':
            // Show only cards that are due for review
            filteredWords = words.filter(w => {
                const srs = srsData[w.hanzi];
                return !srs || !srs.nextReview || srs.nextReview <= now;
            });
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
    
    // Update SRS indicator
    updateSRSIndicator(word.hanzi);
    
    // Reset flip state
    flashcard.classList.remove('flipped');
    
    // Hide stroke container
    strokeContainer.classList.remove('active');
    
    // Update navigation buttons
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === filteredWords.length - 1;
    
    // Highlight current status
    highlightStatus(word.hanzi);
    
    // Save session state
    sessionState.currentIndex = currentIndex;
    sessionState.filterValue = filterSelect.value;
    saveUserStats();
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

// Update SRS indicator
function updateSRSIndicator(hanzi) {
    const srsIndicator = document.getElementById('srsIndicator');
    const srs = srsData[hanzi];
    
    if (!srs || !srs.nextReview) {
        srsIndicator.textContent = '🆕 คำใหม่';
        srsIndicator.className = 'srs-indicator new';
        return;
    }
    
    const now = Date.now();
    const daysUntil = Math.ceil((srs.nextReview - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 0) {
        srsIndicator.textContent = '⏰ ถึงเวลาทบทวน';
        srsIndicator.className = 'srs-indicator due';
    } else if (daysUntil === 1) {
        srsIndicator.textContent = '📅 ทบทวนพรุ่งนี้';
        srsIndicator.className = 'srs-indicator soon';
    } else if (daysUntil <= 7) {
        srsIndicator.textContent = `📅 ทบทวนใน ${daysUntil} วัน`;
        srsIndicator.className = 'srs-indicator soon';
    } else {
        srsIndicator.textContent = `✅ ทบทวนใน ${daysUntil} วัน`;
        srsIndicator.className = 'srs-indicator future';
    }
}

// SRS Algorithm (similar to SM-2)
function calculateNextReview(hanzi, quality) {
    // quality: 3 = remember, 2 = not-sure, 1 = forgot
    const srs = srsData[hanzi] || {
        interval: 0,
        easeFactor: 2.5,
        reviewCount: 0,
        nextReview: null
    };
    
    let newInterval;
    let newEaseFactor = srs.easeFactor;
    
    // Update ease factor based on quality
    newEaseFactor = Math.max(1.3, srs.easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02)));
    
    // Calculate new interval
    if (quality < 2) {
        // Forgot or not sure - reset to beginning
        newInterval = 1;
    } else {
        if (srs.reviewCount === 0) {
            newInterval = 1;
        } else if (srs.reviewCount === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(srs.interval * newEaseFactor);
        }
    }
    
    // Calculate next review date
    const nextReview = Date.now() + (newInterval * 24 * 60 * 60 * 1000);
    
    srsData[hanzi] = {
        interval: newInterval,
        easeFactor: newEaseFactor,
        reviewCount: quality >= 2 ? srs.reviewCount + 1 : 0,
        nextReview: nextReview,
        lastReview: Date.now()
    };
    
    return newInterval;
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
    
    // Update progress bar (handle division by zero)
    const rememberPercent = total > 0 ? (rememberCount / total) * 100 : 0;
    const notSurePercent = total > 0 ? (notSureCount / total) * 100 : 0;
    const forgotPercent = total > 0 ? (forgotCount / total) * 100 : 0;
    
    // Update progress bar widths
    const progressRemember = document.getElementById('progressRemember');
    const progressNotSure = document.getElementById('progressNotSure');
    const progressForgot = document.getElementById('progressForgot');
    
    if (progressRemember) progressRemember.style.width = rememberPercent + '%';
    if (progressNotSure) progressNotSure.style.width = notSurePercent + '%';
    if (progressForgot) progressForgot.style.width = forgotPercent + '%';
}

// Mark word status
function markWord(status) {
    if (filteredWords.length === 0 || isProcessing) return;
    
    // Prevent rapid clicking
    isProcessing = true;
    
    // Clear any pending auto-advance
    if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
        autoAdvanceTimeout = null;
    }
    
    const hanzi = filteredWords[currentIndex].hanzi;
    
    // Remove from all categories first
    delete userStats.remember[hanzi];
    delete userStats.notSure[hanzi];
    delete userStats.forgot[hanzi];
    
    // Add to selected category
    let quality;
    switch (status) {
        case 'remember':
            userStats.remember[hanzi] = true;
            quality = 3;
            break;
        case 'not-sure':
            userStats.notSure[hanzi] = true;
            quality = 2;
            break;
        case 'forgot':
            userStats.forgot[hanzi] = true;
            quality = 1;
            break;
    }
    
    // Update SRS
    const daysUntil = calculateNextReview(hanzi, quality);
    
    userStats.sessionCount++;
    saveUserStats();
    updateStatsDisplay();
    highlightStatus(hanzi);
    
    // Show SRS feedback
    showSRSFeedback(status, daysUntil);
    
    // Disable buttons temporarily
    disableAnswerButtons();
    
    // Auto advance to next card
    if (currentIndex < filteredWords.length - 1) {
        autoAdvanceTimeout = setTimeout(() => {
            currentIndex++;
            updateDisplay();
            isProcessing = false;
            enableAnswerButtons();
            autoAdvanceTimeout = null;
        }, 800);
    } else {
        // Show completion message if it's the last card
        autoAdvanceTimeout = setTimeout(() => {
            showCompletionMessage();
            isProcessing = false;
            enableAnswerButtons();
            autoAdvanceTimeout = null;
        }, 800);
    }
}

// Show SRS feedback
function showSRSFeedback(status, daysUntil) {
    const srsIndicator = document.getElementById('srsIndicator');
    const messages = {
        'remember': `✨ เยี่ยมมาก! ทบทวนอีกครั้งใน ${daysUntil} วัน`,
        'not-sure': `💪 พยายามต่อไป! ทบทวนอีกครั้งใน ${daysUntil} วัน`,
        'forgot': '📚 ไม่เป็นไร เจอกันพรุ่งนี้นะ!'
    };
    
    const originalText = srsIndicator.textContent;
    const originalClass = srsIndicator.className;
    
    srsIndicator.textContent = messages[status];
    srsIndicator.className = 'srs-indicator feedback ' + status;
    
    setTimeout(() => {
        srsIndicator.textContent = originalText;
        srsIndicator.className = originalClass;
    }, 3000);
}

// Show completion message
function showCompletionMessage() {
    const dueCount = words.filter(w => {
        const srs = srsData[w.hanzi];
        return !srs || !srs.nextReview || srs.nextReview <= Date.now();
    }).length;
    
    if (dueCount === 0) {
        alert('🎉 เยี่ยมมาก! คุณทบทวนครบทุกคำที่ถึงเวลาแล้ว\nกลับมาทบทวนใหม่ตามกำหนดเวลานะ!');
        filterSelect.value = 'all';
        applyFilter();
        currentIndex = 0;
        updateDisplay();
    }
}

// Disable answer buttons
function disableAnswerButtons() {
    rememberBtn.disabled = true;
    notSureBtn.disabled = true;
    forgotBtn.disabled = true;
    rememberBtn.style.opacity = '0.5';
    notSureBtn.style.opacity = '0.5';
    forgotBtn.style.opacity = '0.5';
}

// Enable answer buttons
function enableAnswerButtons() {
    rememberBtn.disabled = false;
    notSureBtn.disabled = false;
    forgotBtn.disabled = false;
    rememberBtn.style.opacity = '1';
    notSureBtn.style.opacity = '1';
    forgotBtn.style.opacity = '1';
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
    if (confirm('ต้องการรีเซ็ตสถิติทั้งหมดหรือไม่?\n(รวมถึงข้อมูล SRS ด้วย)')) {
        // Clear all stats
        userStats = {
            remember: {},
            notSure: {},
            forgot: {},
            sessionCount: 0,
            startTime: Date.now()
        };
        srsData = {};
        
        // Clear session state (back to start)
        sessionState = {
            currentIndex: 0,
            filterValue: 'all'
        };
        
        // Clear processing flag
        isProcessing = false;
        if (autoAdvanceTimeout) {
            clearTimeout(autoAdvanceTimeout);
            autoAdvanceTimeout = null;
        }
        
        // Save and update
        saveUserStats();
        updateStatsDisplay();
        
        // Re-enable buttons
        enableAnswerButtons();
        
        // Reset filter and position
        filterSelect.value = 'all';
        applyFilter();
        currentIndex = 0;
        updateDisplay();
        
        alert('✅ รีเซ็ตสถิติเรียบร้อยแล้ว!');
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
    if (currentIndex > 0 && !isProcessing) {
        // Clear any pending auto-advance
        if (autoAdvanceTimeout) {
            clearTimeout(autoAdvanceTimeout);
            autoAdvanceTimeout = null;
        }
        currentIndex--;
        updateDisplay();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < filteredWords.length - 1 && !isProcessing) {
        // Clear any pending auto-advance
        if (autoAdvanceTimeout) {
            clearTimeout(autoAdvanceTimeout);
            autoAdvanceTimeout = null;
        }
        currentIndex++;
        updateDisplay();
    }
});

shuffleBtn.addEventListener('click', shuffleCards);
resetBtn.addEventListener('click', resetStats);

filterSelect.addEventListener('change', () => {
    applyFilter();
    currentIndex = 0;  // Reset to first card when filter changes
    updateDisplay();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Don't trigger if typing in input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.key) {
        case ' ':
        case 'Enter':
            e.preventDefault();
            if (!isProcessing) {
                flashcard.classList.toggle('flipped');
            }
            break;
        case 'ArrowLeft':
            e.preventDefault();
            if (currentIndex > 0 && !isProcessing) {
                // Clear any pending auto-advance
                if (autoAdvanceTimeout) {
                    clearTimeout(autoAdvanceTimeout);
                    autoAdvanceTimeout = null;
                }
                currentIndex--;
                updateDisplay();
            }
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (currentIndex < filteredWords.length - 1 && !isProcessing) {
                // Clear any pending auto-advance
                if (autoAdvanceTimeout) {
                    clearTimeout(autoAdvanceTimeout);
                    autoAdvanceTimeout = null;
                }
                currentIndex++;
                updateDisplay();
            }
            break;
        case '1':
            e.preventDefault();
            if (!isProcessing && !forgotBtn.disabled) {
                markWord('forgot');
            }
            break;
        case '2':
            e.preventDefault();
            if (!isProcessing && !notSureBtn.disabled) {
                markWord('not-sure');
            }
            break;
        case '3':
            e.preventDefault();
            if (!isProcessing && !rememberBtn.disabled) {
                markWord('remember');
            }
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

// Touch gesture support for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

flashcard.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

flashcard.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0 && !isProcessing) {
            // Swipe right - previous card
            if (currentIndex > 0) {
                if (autoAdvanceTimeout) {
                    clearTimeout(autoAdvanceTimeout);
                    autoAdvanceTimeout = null;
                }
                currentIndex--;
                updateDisplay();
            }
        } else if (diffX < 0 && !isProcessing) {
            // Swipe left - next card
            if (currentIndex < filteredWords.length - 1) {
                if (autoAdvanceTimeout) {
                    clearTimeout(autoAdvanceTimeout);
                    autoAdvanceTimeout = null;
                }
                currentIndex++;
                updateDisplay();
            }
        }
    }
}

// Load words on page load
document.addEventListener('DOMContentLoaded', loadWords);

// Hide loading screen after everything is loaded
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }, 500);
    }
});
