export function drawGrid(canvas, ctx, grid, gridSize) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach(cell => {
        ctx.strokeStyle = 'black';
        ctx.strokeRect(cell.x, cell.y, gridSize, gridSize);
        ctx.fillStyle = cell.color;
        ctx.fillRect(cell.x + 1, cell.y + 1, gridSize - 2, gridSize - 2);
    });
}

export function drawPlayer(ctx, playerX, playerY, gridSize) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX + 1, playerY + 1, gridSize - 2, gridSize - 2);
}

export function resetGame(canvas,ctx, playerX, playerY, grid, gridSize, gameOver) {
    
}
