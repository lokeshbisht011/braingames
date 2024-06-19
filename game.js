import { resetGame, drawGrid, drawPlayer } from './render.js';

let gridSize, rows, cols, canvasWidth, canvasHeight, playerX, playerY, grid, path, visited;

export function initGame(canvas, ctx) {
    gridSize = 40;
    rows = 7;
    cols = 7;
    canvasWidth = gridSize * cols;
    canvasHeight = gridSize * rows;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    playerX = 0;
    playerY = 0;
    grid = [];
    path = [];
    visited = [];
    visited.push({ x: 0, y: 0 });

    // Initialize grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let x = col * gridSize;
            let y = row * gridSize;
            grid.push({ x, y, color: 'white' });
        }
    }

    // Generate random path
    ensurePathToBottomRight(ctx);

    // Initial draw
    drawGrid(canvas, ctx, grid, gridSize);
    drawPlayer(ctx, playerX, playerY, gridSize);

    // Keydown event listener
    document.addEventListener('keydown', (event) => handleKeyDown(event, canvas, ctx));
}

function handleKeyDown(e, canvas, ctx) {

    switch (e.key) {
        case 'ArrowUp':
            if (playerY > 0) playerY -= gridSize;
            break;
        case 'ArrowDown':
            if (playerY < canvasHeight - gridSize) playerY += gridSize;
            break;
        case 'ArrowLeft':
            if (playerX > 0) playerX -= gridSize;
            break;
        case 'ArrowRight':
            if (playerX < canvasWidth - gridSize) playerX += gridSize;
            break;
        case 's':
            playerX = 0;
            playerY = 0;
            break;
        case 'r':
            playerX = 0;
            playerY = 0;
            visited = [];
            visited.push({ x: 0, y: 0 });
            ensurePathToBottomRight(ctx);
            break;
    }

    visited.push({ x: playerX, y: playerY });

    if (playerX === canvasWidth - gridSize && playerY === canvasHeight - gridSize) {
        alert('Congratulations! You reached the bottom right corner.');
        playerX = 0;
        playerY = 0;
        visited = [];
        visited.push({ x: 0, y: 0 });
        ensurePathToBottomRight(ctx);
    } else if (grid[playerY / gridSize * cols + playerX / gridSize].color === 'white' && path.every(({ x, y }) => x !== playerX || y !== playerY)) {
        if (confirm('Game Over! Do you want to reset the game?')) {
            playerX = 0;
            playerY = 0;
            visited = [];
            visited.push({ x: 0, y: 0 });
            ensurePathToBottomRight(ctx);
        }
    }

    if (playerX === 0 && playerY === 0) {
        path.forEach(({ x, y }) => {
            grid[y / gridSize * cols + x / gridSize].color = 'yellow';
        });
    } else {
        grid.forEach(cell => {
            if (cell.color === 'yellow') {
                cell.color = 'white';
            }
        });
        visited.forEach(({ x, y }) => {
            const cellIndex = (y / gridSize) * cols + (x / gridSize);
            if (grid[cellIndex]) {
                grid[cellIndex].color = 'yellow';
            }
        });
    }

    drawGrid(canvas, ctx, grid, gridSize);
    drawPlayer(ctx, playerX, playerY, gridSize);
}

function ensurePathToBottomRight(ctx) {
    let reachedEnd = false;
    while (!reachedEnd) {
        reachedEnd = generateRandomPath(ctx);
    }
}

let difficulty = 1;

function generateRandomPath(ctx) {
    let x = 0;
    let y = 0;

    // Reset grid colors
    grid.forEach(cell => cell.color = 'white');
    path = [];

    ctx.fillStyle = 'yellow';
    ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);

    grid[y / gridSize * cols + x / gridSize].color = 'yellow'; // Mark the starting point as visited
    path.push({ x, y });

    var maxYellowCells = Math.floor((rows * cols) / (2 * difficulty)); // Maximum number of yellow cells based on difficulty

    while (x < canvasWidth - gridSize || y < canvasHeight - gridSize) {
        let possibleDirections = [];

        // Check each direction (0: up, 1: right, 2: down, 3: left)
        if (y >= gridSize && checkNeighbors(x, y - gridSize, 'up')) {
            possibleDirections.push(0); // Up
        }
        if (x <= canvasWidth - gridSize * 2 && checkNeighbors(x + gridSize, y, 'right')) {
            possibleDirections.push(1); // Right
        }
        if (y <= canvasHeight - gridSize * 2 && checkNeighbors(x, y + gridSize, 'down')) {
            possibleDirections.push(2); // Down
        }
        if (x >= gridSize && checkNeighbors(x - gridSize, y, 'left')) {
            possibleDirections.push(3); // Left
        }

        if (possibleDirections.length > 0) {
            // Randomly select a direction
            let direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];

            // Move in the chosen direction
            switch (direction) {
                case 0: // Up
                    y -= gridSize;
                    break;
                case 1: // Right
                    x += gridSize;
                    break;
                case 2: // Down
                    y += gridSize;
                    break;
                case 3: // Left
                    x -= gridSize;
                    break;
            }

            // Mark the current square as visited
            grid[y / gridSize * cols + x / gridSize].color = 'yellow';
            path.push({ x, y });

            ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);

            // Stop if we have reached the bottom right corner
            if (x === canvasWidth - gridSize && y === canvasHeight - gridSize) {
                return true;
            }

            if (path.length >= maxYellowCells) {
                break;
            }
        } else {
            // If no valid direction, break the loop
            break;
        }
    }
    return false;
}

function checkNeighbors(nx, ny, direction) {
    const neighbors = [];

    // Only add neighbors that are within grid boundaries
    if (nx - gridSize >= 0 && direction !== 'right') {
        neighbors.push({ nx: nx - gridSize, ny }); // left
    }
    if (nx + gridSize < canvasWidth && direction !== 'left') {
        neighbors.push({ nx: nx + gridSize, ny }); // right
    }
    if (ny - gridSize >= 0 && direction !== 'down') {
        neighbors.push({ nx, ny: ny - gridSize }); // up
    }
    if (ny + gridSize < canvasHeight && direction !== 'up') {
        neighbors.push({ nx, ny: ny + gridSize }); // down
    }

    // Check that all neighbors are not 'yellow'
    return neighbors.every(({ nx, ny }) => {
        return grid[ny / gridSize * cols + nx / gridSize].color !== 'yellow';
    });
}
