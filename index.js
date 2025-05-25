const chooseMode = document.getElementById("choose-mode");
const chooseCatg = document.getElementById("choose-catg");
const startGameBtn = document.getElementById("start-game-btn");
const gameSection = document.getElementById("game");
const resultSection = document.getElementById("result");
const gameBoardDiv = document.getElementById("game-board");
const gameInfo = document.getElementById("game-info");
const restartBtn = document.getElementById("restart-btn");
const cat1Select = document.getElementById("category-1");
const cat2Select = document.getElementById("category-2");
const clickSound = document.getElementById("click-sound");
const winSound = document.getElementById("win-sound");
let unicEmoji=[]
clickSound.volume = 0.5;
winSound.volume = 0.8;
let startTime = null;
let endTime = null;
let points = 0;
const categoryEmojis = {
  Animal: [
    "🐶", "🐱", "🦁", "🐯", "🐮",
    "🐷", "🐸", "🐵", "🐔", "🐧",
    "🐢", "🐍", "🦊", "🦉", "🐳"
  ],

  Food: [
    "🍕", "🍔", "🍟", "🌭", "🍿",
    "🥗", "🍩", "🍪", "🍎", "🍉",
    "🍇", "🍒", "🍣", "🍜", "🍰"
  ],

  Sports: [
    "⚽", "🏀", "🏈", "⚾", "🎾",
    "🏐", "🏉", "🥊", "🥋", "🎽",
    "🏓", "🏸", "⛳", "🏹", "🛹"
  ],

  Nature: [
    "🌲", "🌳", "🌴", "🌵", "🌿",
    "🍀", "🌻", "🌼", "🌺", "🌸",
    "🌞", "🌝", "🌧️", "⛰️", "🌊"
  ],

  Music: [
    "🎵", "🎶", "🎼", "🎤", "🎧",
    "🎹", "🥁", "🎷", "🎺", "🎸",
    "🪕", "🪗", "📻", "🎚️", "🎛️"
  ],

  Faces: [
    "😀", "😁", "😂", "🤣", "😅",
    "😊", "😍", "😎", "😡", "😭",
    "🤔", "😴", "🤩", "😷", "🥶"
  ],

  AI: [
    "🤖", "🧠", "👁️", "🛠️", "📡",
    "🔬", "💾", "💡", "🧬", "⚙️",
    "📊", "🧑‍💻", "📱"
  ],

  Weather: [
    "☀️", "🌤️", "⛅", "🌥️", "🌦️",
    "🌧️", "⛈️", "🌩️", "❄️", "🌨️",
    "🌪️", "🌈", "🌫️", "💨", "🌬️"
  ],

  Space: [
    "🌌", "🌠", "🌟", "✨", "🚀",
    "🛸", "🛰️", "🌕", "🌑", "🪐",
    "🌍", "🌎", "🌒", "🪂", "🌙"
  ],

  Places: [
    "🏞️", "🏝️", "🏜️", "🏖️", "🏕️",
    "🏔️", "🏙️", "🌆", "🌇", "🏛️",
    "🗽", "🗼", "⛩️", "🏯", "🕌"
  ]
};
let board = Array(9).fill(null);
let currentPlayer = 1;
let player1Category = null;
let player2Category = null;
const maxEmojis = 3;
let selectedMode = "";
const playerPositions = { 1: [], 2: [] };
function handleClick(mode) {
  selectedMode = mode;
  chooseMode.classList.add("invisible");
  document.getElementById("game-rules").classList.add("invisible");
  chooseCatg.classList.remove("invisible");
}
function getRandomEmoji(category) {
  const emojis = categoryEmojis[category];
  return emojis[Math.ceil(Math.random()*(Math.floor(Math.random() * emojis.length)))];
   
}
function checkStartCondition() {
  const cat1 = cat1Select.value;
  const cat2 = cat2Select.value;
  startGameBtn.disabled = !(cat1 && cat2 && cat1 !== cat2);
}

cat1Select.addEventListener("change", checkStartCondition);
cat2Select.addEventListener("change", checkStartCondition);

function renderBoard(highlightedIndexes = []) {
  gameBoardDiv.innerHTML = "";
  board.forEach((cell, idx) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    if (cell) cellDiv.textContent = cell.emoji;
    cellDiv.dataset.index = idx;

    if (highlightedIndexes.includes(idx)) {
      cellDiv.classList.add("highlight", "blast");
    }

    cellDiv.addEventListener("click", handleCellClick);
    gameBoardDiv.appendChild(cellDiv);
  });
}

function updateGameInfo(text) {
  gameInfo.textContent = text;
}

function checkWin(player) {
  const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of winLines) {
    if (line.every((idx) => board[idx] && board[idx].player === player)) {
      return line;  
    }
  }
  return null;
}

function placeEmoji(index) {
  if (board[index]) {
    updateGameInfo("Cell already occupied! Choose another.");
    return;
  }

  const player = currentPlayer;
  const category = player === 1 ? player1Category : player2Category;
  const emoji = getRandomEmoji(category);

  if (playerPositions[player].length === maxEmojis) {
    const oldestIndex = playerPositions[player].shift();
    if (oldestIndex === index) {
      updateGameInfo("Can't replace oldest emoji! Choose another cell.");
      playerPositions[player].unshift(oldestIndex);
      return;
    }
    board[oldestIndex] = null;
  }
  board[index] = { player, emoji };
  playerPositions[player].push(index);
  clickSound.currentTime = 0;
  clickSound.play();
  renderBoard();

  const winLine = checkWin(player);
  if (winLine) {
    winSound.currentTime = 0;
    winSound.play();
    updateGameInfo(`Player - ${player}`);

    renderBoard(winLine);

    setTimeout(() => {
      endGame();
    }, 2000);
    return;
  }

  currentPlayer = player === 1 ? 2 : 1;
  updateGameInfo(
    `Player ${currentPlayer}'s turn (${
      currentPlayer === 1 ? player1Category : player2Category
    })`
  );
}
function handleCellClick(event) {
  const index = parseInt(event.target.dataset.index);
  placeEmoji(index);
}
function startGame() {
  player1Category = cat1Select.value;
  player2Category = cat2Select.value;
  chooseCatg.classList.add("invisible");
  gameSection.classList.remove("invisible");
   
   
  board = Array(9).fill(null);
  currentPlayer = 1;
  playerPositions[1] = [];
  playerPositions[2] = [];
  startTime = new Date();
  renderBoard();
  updateGameInfo(`Your's turn (${player1Category})`);
  startGameBtn.style.display = "none";
  cat1Select.disabled = true;
  cat2Select.disabled = true;
  restartBtn.style.display = "inline-block";
}
function endGame() {
  endTime = new Date();
  const durationInSeconds = Math.floor((endTime - startTime) / 1000);

  if (durationInSeconds <= 60) {
    points = 30;
  } else if (durationInSeconds <= 120) {
    points = 15;
  } else if (durationInSeconds <= 180) {
    points = 10;
  } else {
    points = 5;
  }
  console.log("Ending game, hiding game section");
  console.log(gameSection);
  gameSection.classList.add("invisible");
  resultSection.classList.remove("invisible");
  const resultInfo = document.getElementById("result-info");
  resultInfo.innerHTML= `${gameInfo.textContent}<br><strong>Time Taken</strong>: ${durationInSeconds}s<br><strong>Points Earned</strong>: ${points}`;
  
   
}
function restartGame() {
  board = Array(9).fill(null);
  currentPlayer = 1;
  playerPositions[1] = [];
  playerPositions[2] = [];
  startTime = null;
  endTime = null;
  points = 0;
  selectedMode = "";
  cat1Select.disabled = false;
  cat2Select.disabled = false;
  cat1Select.value = "";
  cat2Select.value = "";
  startGameBtn.disabled = true;
  gameSection.classList.add("invisible");
  resultSection.classList.add("invisible");
  chooseCatg.classList.remove("invisible");
  restartBtn.style.display = "none";
  startGameBtn.style.display = "block";
  gameInfo.textContent = "";
  gameBoardDiv.innerHTML = "";
}
restartBtn.addEventListener("click", () => {
  
  restartGame();
});
startGameBtn.addEventListener("click", startGame);
