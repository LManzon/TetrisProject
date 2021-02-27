const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll(".grid div"));
const width = 10;
const scoreDisplay = document.querySelector("#score");
const levelDisplay = document.querySelector("#level");
const startBtn = document.querySelector("#start-button");
let timerId = 0;
let score = 0;
const colors = [
  "rgb(230, 4, 230)",
  "rgb(16, 224, 161)",
  "rgb(20, 144, 228)",
  "rgb(235, 17, 82)",
  "rgb(235, 133, 17)",
];

const audioGame = new Audio("./mountainTrails.mp3");
const audioGameOver = new Audio("./superMario.mp3");

let isPause = true;

const level1 = 1000;
const level2 = 900;
const level3 = 800;
const level4 = 700;
const level5 = 600;
const level6 = 500;
const level7 = 450;
const level8 = 350;
const level9 = 250;
const level10 = 200;

let currentLevel = level1;
let displayLevel = 1;

function checkScore() {
  if (score >= 0 && score < 21) {
    currentLevel = level1;
    displayLevel = 1;
  } else if (score >= 21 && score < 61) {
    currentLevel = level2;
    displayLevel = 2;
  } else if (score >= 61 && score < 81) {
    currentLevel = level3;
    displayLevel = 3;
  } else if (score >= 81 && score < 101) {
    currentLevel = level4;
    displayLevel = 4;
  } else if (score >= 101 && score < 121) {
    currentLevel = level5;
    displayLevel = 5;
  } else if (score >= 121 && score < 171) {
    currentLevel = level6;
    displayLevel = 6;
  } else if (score >= 171 && score < 251) {
    currentLevel = level7;
    displayLevel = 7;
  } else if (score >= 251 && score < 301) {
    currentLevel = level8;
    displayLevel = 8;
  } else if (score >= 301 && score < 401) {
    currentLevel = level9;
    displayLevel = 9;
  } else if (score >= 401) {
    currentLevel = level10;
    displayLevel = 10;
  }
  timerId = setInterval(moveDown, currentLevel);
  levelDisplay.innerHTML = displayLevel;
}

const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const theTetrominoes = [
  lTetromino,
  zTetromino,
  tTetromino,
  oTetromino,
  iTetromino,
];

let currentPosition = 4;
let currentRotation = 0;

let random = Math.floor(Math.random() * theTetrominoes.length);

let current = theTetrominoes[random][currentRotation];

function draw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.add("tetromino");
    squares[currentPosition + index].style.backgroundColor = colors[random];
  });
}

function undraw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("tetromino");
    squares[currentPosition + index].style.backgroundColor = "";
  });
}

function control(e) {
  if (e.keyCode === 37) {
    moveLeft();
  } else if (e.keyCode === 38) {
    rotate();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}
document.addEventListener("keyup", control);

function moveDown() {
  gameZone();
  undraw();
  currentPosition += width;
  draw();
  freeze();
  addScore();
  gameOver();
}

function freeze() {
  if (
    current.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    current.forEach((index) =>
      squares[currentPosition + index].classList.add("taken")
    );

    random = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    draw();
  }
}

function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(
    (index) => (currentPosition + index) % width === 0
  );
  if (!isAtLeftEdge) currentPosition -= 1;
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition += 1;
  }
  draw();
}

function moveRight() {
  undraw();
  const isAtRightEdge = current.some(
    (index) => (currentPosition + index) % width === width - 1
  );
  if (!isAtRightEdge) currentPosition += 1;
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition -= 1;
  }
  draw();
}

function isAtRight() {
  return current.some((index) => (currentPosition + index + 1) % width === 0);
}

function isAtLeft() {
  return current.some((index) => (currentPosition + index) % width === 0);
}

function checkRotatedPosition(P) {
  P = P || currentPosition;
  if ((P + 1) % width < 4) {
    if (isAtRight()) {
      currentPosition += 1;
      checkRotatedPosition(P);
    }
  } else if (P % width > 5) {
    if (isAtLeft()) {
      currentPosition -= 1;
      checkRotatedPosition(P);
    }
  }
}

function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) {
    currentRotation = 0;
  }
  current = theTetrominoes[random][currentRotation];
  checkRotatedPosition();
  draw();
}

function gameZone() {
  clearInterval(timerId);
  console.log(timerId);
  console.log("GAME STARTED");
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    squares.forEach((index) => {
      index.classList.remove("tetromino");
      index.classList.remove("taken");
      if (index.classList.contains("base")) {
        index.classList.add("taken");
      }
      index.style.backgroundColor = "";
      scoreDisplay.innerHTML = 0;
    });

    audioGame.pause();
  } else if (isPause) {
    console.log("stop count");
    clearInterval(timerId);
    timerId = 0;
    audioGame.pause();
  } else {
    draw();

    checkScore();
    console.log(currentLevel);
    console.log(score);

    audioGame.play();
  }
}

startBtn.onclick = () => {
  isPause = !isPause;
  gameZone();
};

function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => squares[index].classList.contains("taken"))) {
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach((index) => {
        squares[index].classList.remove("taken");
        squares[index].classList.remove("tetromino");
        squares[index].style.backgroundColor = "";
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }
}

function gameOver() {
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    scoreDisplay.innerHTML = "Game Over";
    clearInterval(timerId);
    audioGame.pause();
    audioGameOver.play();
  }
}
