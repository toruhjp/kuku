// ========================================
// 九九の練習 - Application Logic
// Pure Vanilla JavaScript (ES6+)
// ========================================

// ========================================
// 1. State Management
// ========================================

const gameState = {
  // Application flow state
  currentScreen: 'selection',
  
  // User selections
  selectedFirstFactors: [],
  
  // Current question
  currentQuestion: {
    firstFactor: null,
    secondFactor: null,
    correctAnswer: null
  },
  
  // Dialpad answer tracking
  currentAnswer: '',
  
  // Tracking
  combinationCounts: {},
  answeredCombinations: new Set(),
  totalCombinations: 0,
  questionsAnsweredCount: 0,
  
  // UI state
  feedbackMessage: '',
  showFeedback: false,
  autoAdvanceTimerId: null,
  countdownTimerId: null
};

// ========================================
// 2. Question Generator
// ========================================

/**
 * Initialize combination tracking for selected 初項
 */
function initializeCombinations(selectedFirstFactors) {
  gameState.combinationCounts = {};
  gameState.answeredCombinations = new Set();
  
  // Create all combinations for selected 初項
  selectedFirstFactors.forEach(firstFactor => {
    for (let secondFactor = 1; secondFactor <= 9; secondFactor++) {
      const key = `${firstFactor}-${secondFactor}`;
      gameState.combinationCounts[key] = 0;
    }
  });
  
  gameState.totalCombinations = selectedFirstFactors.length * 9;
}

/**
 * Get next question using even distribution algorithm
 * Prefer combinations with lowest ask-count
 */
function getNextQuestion() {
  const validCombinations = [];
  
  // Step 1: Get all valid combinations
  gameState.selectedFirstFactors.forEach(firstFactor => {
    for (let secondFactor = 1; secondFactor <= 9; secondFactor++) {
      validCombinations.push({ firstFactor, secondFactor });
    }
  });
  
  // Step 2: Find minimum count
  let minCount = Infinity;
  validCombinations.forEach(combo => {
    const key = `${combo.firstFactor}-${combo.secondFactor}`;
    const count = gameState.combinationCounts[key] || 0;
    if (count < minCount) {
      minCount = count;
    }
  });
  
  // Step 3: Collect all combinations with minimum count
  const candidateCombinations = validCombinations.filter(combo => {
    const key = `${combo.firstFactor}-${combo.secondFactor}`;
    const count = gameState.combinationCounts[key] || 0;
    return count === minCount;
  });
  
  // Step 4: Randomly select from candidates
  const randomIndex = Math.floor(Math.random() * candidateCombinations.length);
  const selectedCombination = candidateCombinations[randomIndex];
  
  // Step 5: Record selection
  const key = `${selectedCombination.firstFactor}-${selectedCombination.secondFactor}`;
  gameState.combinationCounts[key] = (gameState.combinationCounts[key] || 0) + 1;
  
  return {
    firstFactor: selectedCombination.firstFactor,
    secondFactor: selectedCombination.secondFactor,
    correctAnswer: selectedCombination.firstFactor * selectedCombination.secondFactor
  };
}

/**
 * Record that a combination has been answered
 */
function recordQuestionAnswered(firstFactor, secondFactor) {
  const key = `${firstFactor}-${secondFactor}`;
  gameState.answeredCombinations.add(key);
  gameState.questionsAnsweredCount++;
}

// ========================================
// 3. Validation Engine
// ========================================

/**
 * Validate user answer and provide feedback
 */
function validateAnswer(userInput, firstFactor, secondFactor) {
  const correctAnswer = firstFactor * secondFactor;
  const userAnswer = parseInt(userInput, 10);
  
  const isCorrect = userAnswer === correctAnswer;
  
  // Record the combination as answered
  recordQuestionAnswered(firstFactor, secondFactor);
  
  return {
    correct: isCorrect,
    message: formatFeedback(isCorrect, correctAnswer)
  };
}

/**
 * Generate varied feedback messages
 */
function formatFeedback(isCorrect, correctAnswer) {
  if (isCorrect) {
    // Vary between 3 positive messages
    const positiveMessages = ['いいね！', 'すごい！', 'そのちょうし！'];
    const randomIndex = Math.floor(Math.random() * positiveMessages.length);
    return positiveMessages[randomIndex];
  } else {
    return `おしい！答えは${correctAnswer}です`;
  }
}

// ========================================
// 4. Dialpad Controller
// ========================================

/**
 * Update answer display with current answer
 */
function updateAnswerDisplay() {
  const answerDisplay = document.getElementById('answer-display');
  if (answerDisplay) {
    answerDisplay.textContent = gameState.currentAnswer;
  }
}

/**
 * Handle digit button click
 */
function handleDialpadDigit(digit) {
  // Max 2 digits (max answer is 81)
  if (gameState.currentAnswer.length < 2) {
    gameState.currentAnswer += digit;
    updateAnswerDisplay();
  }
}

/**
 * Handle clear button click (for dialpad)
 */
function handleDialpadClear() {
  gameState.currentAnswer = '';
  updateAnswerDisplay();
}

/**
 * Handle submit from dialpad
 */
function handleDialpadSubmit() {
  if (!gameState.currentAnswer) {
    return; // Don't submit empty answer
  }
  
  const result = validateAnswer(
    gameState.currentAnswer,
    gameState.currentQuestion.firstFactor,
    gameState.currentQuestion.secondFactor
  );
  
  displayFeedback(result.message, result.correct);
  updateProgressDisplay();
}

// ========================================
// 5. UI Controller
// ========================================

/**
 * Show specific screen and hide others
 */
function showScreen(screenName) {
  const screens = ['selection-screen', 'countdown-screen', 'question-screen', 'completion-screen'];
  
  screens.forEach(screen => {
    const element = document.getElementById(screen);
    if (element) {
      element.classList.remove('active');
    }
  });
  
  const targetScreen = document.getElementById(`${screenName}-screen`);
  if (targetScreen) {
    targetScreen.classList.add('active');
    gameState.currentScreen = screenName;
  }
}

/**
 * Update progress display (X/Y format)
 */
function updateProgressDisplay() {
  const progressDisplay = document.getElementById('progress-display');
  if (progressDisplay) {
    progressDisplay.textContent = `${gameState.answeredCombinations.size} / ${gameState.totalCombinations}`;
  }
}

/**
 * Display question with proper formatting
 */
function displayQuestion(question) {
  const firstFactorEl = document.getElementById('first-factor');
  const secondFactorEl = document.getElementById('second-factor');
  const particleEl = document.getElementById('particle');
  
  if (firstFactorEl) firstFactorEl.textContent = question.firstFactor;
  if (secondFactorEl) secondFactorEl.textContent = question.secondFactor;
  
  // Show particle 「が」only when answer < 10
  if (particleEl) {
    if (question.correctAnswer < 10) {
      particleEl.classList.remove('hidden');
    } else {
      particleEl.classList.add('hidden');
    }
  }
  
  // Store current question
  gameState.currentQuestion = question;
  
  // Update progress
  updateProgressDisplay();
  
  // Clear current answer and update display
  gameState.currentAnswer = '';
  updateAnswerDisplay();
  
  // Hide next button and clear feedback
  const nextButton = document.getElementById('next-button');
  const feedbackDisplay = document.getElementById('feedback-display');
  if (nextButton) nextButton.classList.remove('show');
  if (feedbackDisplay) {
    feedbackDisplay.textContent = '';
    feedbackDisplay.classList.remove('show', 'correct', 'incorrect');
  }

  // Show dialpad (ensure it's visible for new question)
  const dialpad = document.getElementById('dialpad');
  if (dialpad) dialpad.classList.remove('hidden');
}

/**
 * Display feedback message with animation
 */
function displayFeedback(message, isCorrect) {
  const feedbackDisplay = document.getElementById('feedback-display');
  if (feedbackDisplay) {
    feedbackDisplay.textContent = message;
    feedbackDisplay.classList.add('show', isCorrect ? 'correct' : 'incorrect');
  }
  
  // Show next button
  const nextButton = document.getElementById('next-button');
  if (nextButton) {
    nextButton.classList.add('show');
  }

  // Hide answer-related buttons after submission to guide user to "つぎへ"
  const submitButton = document.getElementById('submit-button');
  const clearButton = document.getElementById('clear-button');
  if (submitButton) submitButton.classList.add('hidden');
  if (clearButton) clearButton.classList.add('hidden');
  
  // Start auto-advance timer (3 seconds)
  if (gameState.autoAdvanceTimerId) {
    clearTimeout(gameState.autoAdvanceTimerId);
  }
  
  gameState.autoAdvanceTimerId = setTimeout(() => {
    handleNextQuestion();
  }, 3000);
}

/**
 * Show completion overlay with animation
 */
function showCompletionOverlay() {
  showScreen('completion');
  
  const finalCount = document.getElementById('final-count');
  if (finalCount) {
    finalCount.textContent = `${gameState.totalCombinations}/${gameState.totalCombinations} done`;
  }
}

// ========================================
// 5. Event Handlers
// ========================================

/**
 * Handle start button click
 */
function handleStartClick() {
  const checkboxes = document.querySelectorAll('.factor-checkbox input[type="checkbox"]:checked');
  const selectedFactors = Array.from(checkboxes).map(cb => parseInt(cb.value, 10));
  
  if (selectedFactors.length === 0) {
    const errorEl = document.getElementById('selection-error');
    if (errorEl) {
      errorEl.textContent = '少なくとも1つの段を選んでください';
    }
    return;
  }
  
  // Clear error
  const errorEl = document.getElementById('selection-error');
  if (errorEl) {
    errorEl.textContent = '';
  }
  
  // Initialize game state
  gameState.selectedFirstFactors = selectedFactors;
  initializeCombinations(selectedFactors);
  
  // Start countdown
  startCountdown();
}

/**
 * Start countdown sequence (3-2-1)
 */
function startCountdown() {
  showScreen('countdown');
  
  let count = 3;
  const countdownEl = document.getElementById('countdown-number');
  
  function updateCountdown() {
    if (countdownEl) {
      countdownEl.textContent = count;
      // Trigger animation by removing and re-adding class
      countdownEl.style.animation = 'none';
      setTimeout(() => {
        countdownEl.style.animation = '';
      }, 10);
    }
    
    if (count > 1) {
      count--;
      gameState.countdownTimerId = setTimeout(updateCountdown, 1000);
    } else {
      // Countdown finished, show first question
      setTimeout(() => {
        showScreen('question');
        const firstQuestion = getNextQuestion();
        displayQuestion(firstQuestion);
      }, 1000);
    }
  }
  
  updateCountdown();
}

/**
 * Handle answer submission (now uses dialpad)
 */
function handleSubmitAnswer() {
  handleDialpadSubmit();
}

/**
 * Handle next question navigation
 */
function handleNextQuestion() {
  // Clear auto-advance timer
  if (gameState.autoAdvanceTimerId) {
    clearTimeout(gameState.autoAdvanceTimerId);
    gameState.autoAdvanceTimerId = null;
  }
  
  // Check if all combinations completed
  if (gameState.answeredCombinations.size >= gameState.totalCombinations) {
    showCompletionOverlay();
    return;
  }
  
  // Generate and display next question
  const nextQuestion = getNextQuestion();
  displayQuestion(nextQuestion);
}

/**
 * Handle clear button click (now uses dialpad)
 */
function handleClearClick() {
  handleDialpadClear();
}

/**
 * Handle restart button click
 */
function handleRestartClick() {
  // Reset all state
  gameState.selectedFirstFactors = [];
  gameState.currentQuestion = { firstFactor: null, secondFactor: null, correctAnswer: null };
  gameState.currentAnswer = '';
  gameState.combinationCounts = {};
  gameState.answeredCombinations = new Set();
  gameState.totalCombinations = 0;
  gameState.questionsAnsweredCount = 0;
  
  // Clear timers
  if (gameState.autoAdvanceTimerId) {
    clearTimeout(gameState.autoAdvanceTimerId);
    gameState.autoAdvanceTimerId = null;
  }
  if (gameState.countdownTimerId) {
    clearTimeout(gameState.countdownTimerId);
    gameState.countdownTimerId = null;
  }
  
  // Uncheck all checkboxes
  const checkboxes = document.querySelectorAll('.factor-checkbox input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.checked = false;
  });
  
  // Return to selection screen
  showScreen('selection');
}

/**
 * Handle Enter key press in answer input
 */
function handleAnswerKeyPress(event) {
  if (event.key === 'Enter') {
    handleSubmitAnswer();
  }
}

// ========================================
// 6. Orientation Enforcer
// ========================================

/**
 * Check and update orientation enforcement
 */
function checkOrientation() {
  const orientationOverlay = document.getElementById('orientation-overlay');
  const appContainer = document.getElementById('app-container');
  
  // Orientation is primarily handled by CSS media queries
  // This function provides additional JavaScript support for dynamic updates
  
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  
  if (orientationOverlay && appContainer) {
    if (isPortrait) {
      orientationOverlay.style.display = 'flex';
      appContainer.style.display = 'none';
    } else {
      orientationOverlay.style.display = 'none';
      appContainer.style.display = 'flex';
    }
  }
}

/**
 * Setup orientation change listener
 */
function setupOrientationListener() {
  // Use matchMedia for better performance
  const mediaQuery = window.matchMedia('(orientation: portrait)');
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', checkOrientation);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(checkOrientation);
  }
  
  // Check immediately on load
  checkOrientation();
}

// ========================================
// 7. Application Initialization
// ========================================

/**
 * Initialize the application
 */
function initApp() {
  // Setup orientation enforcement
  setupOrientationListener();
  
  // Attach event listeners
  const startButton = document.getElementById('start-button');
  if (startButton) {
    startButton.addEventListener('click', handleStartClick);
  }
  
  const submitButton = document.getElementById('submit-button');
  if (submitButton) {
    submitButton.addEventListener('click', handleSubmitAnswer);
  }
  
  const clearButton = document.getElementById('clear-button');
  if (clearButton) {
    clearButton.addEventListener('click', handleClearClick);
  }
  
  const nextButton = document.getElementById('next-button');
  if (nextButton) {
    nextButton.addEventListener('click', handleNextQuestion);
  }
  
  const restartButton = document.getElementById('restart-button');
  if (restartButton) {
    restartButton.addEventListener('click', handleRestartClick);
  }
  
  // Attach dialpad digit button listeners
  const digitButtons = document.querySelectorAll('.digit-btn');
  digitButtons.forEach(button => {
    button.addEventListener('click', () => {
      const digit = button.getAttribute('data-digit');
      handleDialpadDigit(digit);
    });
  });
  
  // Enable/disable start button based on checkbox selection
  const checkboxes = document.querySelectorAll('.factor-checkbox input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateStartButtonState);
  });
  
  // Initial button state
  updateStartButtonState();
  
  // Show selection screen
  showScreen('selection');
}

/**
 * Update start button enabled/disabled state
 */
function updateStartButtonState() {
  const startButton = document.getElementById('start-button');
  const checkboxes = document.querySelectorAll('.factor-checkbox input[type="checkbox"]:checked');
  
  if (startButton) {
    startButton.disabled = checkboxes.length === 0;
  }
}

// ========================================
// 8. Start Application
// ========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
