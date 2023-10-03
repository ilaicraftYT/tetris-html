import './style.css'

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const BLOCK_SIZE = 20

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

let board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const pieces = {
  t: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: "purple"
  },
  o: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: "yellow"
  },
  i: {
    shape: [
      [1],
      [1],
      [1],
      [1]
    ],
    color: "cyan"
  },
  s: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: "green"
  },
  z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: "red"
  },
  j: {
    shape: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: "blue"
  },
  l: {
    shape: [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    color: "orange"
  }
}

let currentPiece = {
  ...pieces[Object.keys(pieces)[Math.floor(Math.random() * Object.keys(pieces).length)]],
  x: 0,
  y: 0
}

let lastTime = 0
let drop = 0
let speed = 320;

let gameStartTime = 0;
let speedIncreaseInterval = 15 * 1000;
let nextSpeedIncreaseTime = speedIncreaseInterval;

update()

function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  if (!gameStartTime) {
    gameStartTime = time;
  }

  const elapsedTime = (time - gameStartTime) / 1000;

  if (elapsedTime >= nextSpeedIncreaseTime / 1000) {
    speed /= 2;
    nextSpeedIncreaseTime += speedIncreaseInterval;
  }

  drop += deltaTime

  if (drop > speed) {
    currentPiece.y++
    drop = 0
  }

  if (isColissioning()) {
    currentPiece.y--
    solidifyPiece()
    checkRows()
  }

  // if more than 5 secs playing, speed it x2

  draw()
  window.requestAnimationFrame(update)
}

function draw() {
  context.fillStyle = "black"
  context.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)

  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell == 1) {
        context.fillStyle = "green"
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  currentPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell == 1) {
        context.fillStyle = currentPiece.color
        context.fillRect(x + currentPiece.x, y + currentPiece.y, 1, 1)
      }
    })
  })
}

function isColissioning() {
  return currentPiece.shape.find((row, y) => {
    return row.find((cell, x) => {
      return (cell === 1 && board[y + currentPiece.y]?.[x + currentPiece.x]) !== 0
    })
  })
}

function solidifyPiece() {
  currentPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + currentPiece.y][x + currentPiece.x] = 1
      }
    })
  })

  currentPiece = {
    x: 0,
    y: 0,
    ...pieces[Object.keys(pieces)[Math.floor(Math.random() * Object.keys(pieces).length)]]
  }

  if (isColissioning()) {
    window.alert("gameover")
    board.forEach((row) => row.fill(0))
    gameStartTime = 0;
    speedIncreaseInterval = 15 * 1000;
    nextSpeedIncreaseTime = speedIncreaseInterval;
  }
}

function checkRows() {
  let rowsToRemove = []

  board.forEach((row, y) => {
    if (row.every(cell => cell === 1)) {
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const emptyRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(emptyRow)
  })
}

document.addEventListener("keydown", (ev) => {
  switch (ev.key) {
    case "ArrowDown":
      currentPiece.y++

      if (isColissioning()) {
        currentPiece.y--
        solidifyPiece()
        checkRows()
      }
      break;
    case "ArrowRight":
      currentPiece.x++

      if (isColissioning()) currentPiece.x--
      break;
    case "ArrowLeft":
      currentPiece.x--

      if (isColissioning()) currentPiece.x++
      break;
    case " ":
      while (!isColissioning()) {
        currentPiece.y++
      }
      currentPiece.y--
      break;
    case "ArrowUp":
      const numRows = currentPiece.shape.length;
      const numCols = currentPiece.shape.length;

      // Create a new empty matrix with swapped dimensions
      const rotatedMatrix = new Array(numCols).fill().map(() => []);

      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          // Transpose the elements
          rotatedMatrix[j][numRows - 1 - i] = currentPiece.shape[i][j];
        }
      }
      const previousShape = currentPiece.shape
      currentPiece.shape = rotatedMatrix
      if (isColissioning()) {
        currentPiece.shape = previousShape
      }
  }
})