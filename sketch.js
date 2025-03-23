let cols = 100;
let rows;
let cellSize;
let grid = [];
let alive = 1;
let dead = 0;
let ripples = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10);

  cellSize = windowWidth / cols;
  rows = floor(windowHeight / cellSize);

  makeInitialGrid();
}

function draw() {
  background(50);
  noStroke();
  drawGrid();
  computeNextGen();
  updateRipples();
}

// Create random grid
function makeInitialGrid() {
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = dead;
    }
  }
}

// Draw grid
function drawGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === alive) {
        fill(255);
      } else {
        noFill();
      }
      rect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

// Game of Life logic
function computeNextGen() {
  let next = [];

  for (let i = 0; i < cols; i++) {
    next[i] = [];
    for (let j = 0; j < rows; j++) {
      let neighbors = 0;

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          let x = i + dx;
          let y = j + dy;
          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            neighbors += grid[x][y];
          }
        }
      }

      if (grid[i][j] === alive && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = dead;
      } else if (grid[i][j] === dead && neighbors === 3) {
        next[i][j] = alive;
      } else {
        next[i][j] = grid[i][j];
      }
    }
  }

  grid = next;
}

// Handle mouse click
function mousePressed() {
  let i = floor(mouseX / cellSize);
  let j = floor(mouseY / cellSize);
  ripples.push({ i: i, j: j, radius: 1, maxRadius: 10 });
}

// Expand ripple each frame
function updateRipples() {
  for (let r = ripples.length - 1; r >= 0; r--) {
    let ripple = ripples[r];
    let i = ripple.i;
    let j = ripple.j;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        let d = dist(x, y, i, j);
        if (abs(d - ripple.radius) < 0.5) {
          grid[x][y] = alive;
        }
      }
    }

    ripple.radius += 1;

    if (ripple.radius > ripple.maxRadius) {
      ripples.splice(r, 1);
    }
  }
}
