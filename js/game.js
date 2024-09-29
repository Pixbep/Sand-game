// game.js

const canvas = document.getElementById('sandboxCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 10; // Size of each "pixel"
const canvasWidth = canvas.width / GRID_SIZE;
const canvasHeight = canvas.height / GRID_SIZE;

let grid = createGrid(canvasWidth, canvasHeight);
let currentElement = 'sand';

// Set up the grid with empty cells
function createGrid(width, height) {
    let grid = [];
    for (let x = 0; x < width; x++) {
        grid[x] = [];
        for (let y = 0; y < height; y++) {
            grid[x][y] = null; // Empty cell
        }
    }
    return grid;
}

// Select the current element
function selectElement(element) {
    currentElement = element;
}

// Clear the canvas and grid
function clearCanvas() {
    grid = createGrid(canvasWidth, canvasHeight);
    ctx.fillStyle = 'black'; // Fill background with black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Handle mouse drawing
canvas.addEventListener('mousedown', function(e) {
    canvas.addEventListener('mousemove', placeElement);
});

canvas.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', placeElement);
});

function placeElement(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = Math.floor((e.clientY - rect.top) / GRID_SIZE);

    if (elements[currentElement] && grid[x] && grid[x][y] === null) {
        grid[x][y] = {...elements[currentElement]};
        drawGrid();
    }
}

// Draw the entire grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
            if (grid[x][y]) {
                ctx.fillStyle = grid[x][y].color;
                ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }
    }
}

// Simulate the behavior of elements (flowing, falling, spreading)
function updateSimulation() {
    for (let x = 0; x < canvasWidth; x++) {
        for (let y = canvasHeight - 1; y >= 0; y--) {
            const element = grid[x][y];
            if (element) {
                // Handle flowing elements (sand, water)
                if (element.flow) {
                    if (y < canvasHeight - 1 && grid[x][y + 1] === null) {
                        grid[x][y + 1] = element;
                        grid[x][y] = null;
                    } else if (element.liquid) {
                        const flowDirection = Math.random() < 0.5 ? -1 : 1;
                        if (x + flowDirection >= 0 && x + flowDirection < canvasWidth && grid[x + flowDirection][y] === null) {
                            grid[x + flowDirection][y] = element;
                            grid[x][y] = null;
                        }
                    }
                }

                // Handle fire spreading
                if (element.spread && element.lifespan > 0) {
                    // Fire spreads randomly to nearby cells
                    const directions = [
                        { dx: 0, dy: 1 }, // Down
                        { dx: 1, dy: 0 }, // Right
                        { dx: -1, dy: 0 }, // Left
                        { dx: 0, dy: -1 }  // Up
                    ];
                    for (let dir of directions) {
                        const newX = x + dir.dx;
                        const newY = y + dir.dy;
                        if (newX >= 0 && newX < canvasWidth && newY >= 0 && newY < canvasHeight && grid[newX][newY] === null) {
                            grid[newX][newY] = {...elements['fire'], lifespan: element.lifespan - 1};
                        }
                    }
                    element.lifespan -= 1;
                    if (element.lifespan <= 0) {
                        grid[x][y] = null; // Fire extinguishes
                    }
                }
            }
        }
    }
    drawGrid();
    requestAnimationFrame(updateSimulation);
}

// Start the simulation loop
updateSimulation();
