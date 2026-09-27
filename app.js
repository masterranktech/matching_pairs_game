// 1. Icon Pool (8 distinct pairs)
const ICONS = [
  "fa-biking",
  "fa-bomb",
  "fa-candy-cane",
  "fa-cat",
  "fa-child",
  "fa-crow",
  "fa-crown",
  "fa-dragon"
];

// 2. Application State
const state = {
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  mistakes: 0,
  hintsLeft: 3,
  isLocked: false,
  timerInterval: null,
  totalSeconds: 0,
  hasStarted: false
};

// 3. DOM Cache
const dom = {
  board: document.getElementById("gameBoard"),
  movesCount: document.getElementById("movesCount"),
  timerDisplay: document.getElementById("timerDisplay"),
  hintsCount: document.getElementById("hintsCount"),
  hintBtn: document.getElementById("hintBtn"),
  restartBtn: document.getElementById("restartBtn"),
  winModal: document.getElementById("winModal"),
  finalTime: document.getElementById("finalTime"),
  finalMoves: document.getElementById("finalMoves"),
  finalMistakes: document.getElementById("finalMistakes"),
  playAgainBtn: document.getElementById("playAgainBtn")
};

// 4. Utility: Fisher-Yates Array Shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 5. Timer Management
function startTimer() {
  if (state.hasStarted) return;
  state.hasStarted = true;
  state.timerInterval = setInterval(() => {
    state.totalSeconds++;
    const minutes = String(Math.floor(state.totalSeconds / 60)).padStart(2, "0");
    const seconds = String(state.totalSeconds % 60).padStart(2, "0");
    dom.timerDisplay.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
}

// 6. Board Setup
function createBoard() {
  dom.board.innerHTML = "";
  const cardPool = shuffle([...ICONS, ...ICONS]);

  cardPool.forEach((iconName, index) => {
    const card = document.createElement("li");
    card.className = "card";
    card.dataset.icon = iconName;
    card.dataset.index = index;

    card.innerHTML = `
      <div class="card-face card-face-back"></div>
      <div class="card-face card-face-front">
        <i class="fa-solid ${iconName}"></i>
      </div>
    `;

    dom.board.appendChild(card);
  });
}

// 7. Core Match Logic
function handleCardClick(card) {
  if (state.isLocked || card.classList.contains("flipped") || card.classList.contains("matched")) {
    return;
  }

  startTimer();
  card.classList.add("flipped");
  state.flippedCards.push(card);

  if (state.flippedCards.length === 2) {
    state.moves++;
    dom.movesCount.textContent = state.moves;
    checkMatch();
  }
}

function checkMatch() {
  const [firstCard, secondCard] = state.flippedCards;
  const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    state.matchedPairs++;
    state.flippedCards = [];

    if (state.matchedPairs === ICONS.length) {
      handleGameOver();
    }
  } else {
    state.isLocked = true;
    state.mistakes++;
    firstCard.classList.add("mismatch");
    secondCard.classList.add("mismatch");

    setTimeout(() => {
      firstCard.classList.remove("flipped", "mismatch");
      secondCard.classList.remove("flipped", "mismatch");
      state.flippedCards = [];
      state.isLocked = false;
    }, 900);
  }
}

// 8. Hint System
function triggerHint() {
  if (state.hintsLeft <= 0 || state.isLocked) return;

  state.hintsLeft--;
  dom.hintsCount.textContent = state.hintsLeft;
  if (state.hintsLeft === 0) {
    dom.hintBtn.disabled = true;
  }

  state.isLocked = true;
  const unflippedCards = document.querySelectorAll(".card:not(.matched):not(.flipped)");
  unflippedCards.forEach(c => c.classList.add("preview"));

  setTimeout(() => {
    unflippedCards.forEach(c => c.classList.remove("preview"));
    state.isLocked = false;
  }, 1200);
}

// 9. Game Reset / Finish
function handleGameOver() {
  stopTimer();
  dom.finalTime.textContent = dom.timerDisplay.textContent;
  dom.finalMoves.textContent = state.moves;
  dom.finalMistakes.textContent = state.mistakes;
  dom.winModal.classList.add("open");
}

function resetGame() {
  stopTimer();
  state.flippedCards = [];
  state.matchedPairs = 0;
  state.moves = 0;
  state.mistakes = 0;
  state.hintsLeft = 3;
  state.isLocked = false;
  state.totalSeconds = 0;
  state.hasStarted = false;

  dom.movesCount.textContent = "0";
  dom.timerDisplay.textContent = "00:00";
  dom.hintsCount.textContent = "3";
  dom.hintBtn.disabled = false;
  dom.winModal.classList.remove("open");

  createBoard();
}

// 10. Event Delegation & Init
function init() {
  dom.board.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) handleCardClick(card);
  });

  dom.hintBtn.addEventListener("click", triggerHint);
  dom.restartBtn.addEventListener("click", resetGame);
  dom.playAgainBtn.addEventListener("click", resetGame);

  resetGame();
}

init();