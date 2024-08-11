//SANI: Main container
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d'); //SANI: canvas object

const ROWS          = 20; //SANI: continer rows
const COLS          = 10; //SANI: container columns
const BLOCK_SIZE    = 30; //SANI: falling block size
const COLORS        = ['#FF5733', '#33FF57', '#3357FF', '#F0F33F', '#F33FF0', '#33F0F3', '#F0A033'];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0)); //SANI: create a board array with the lendth of rows & cols
let currentPiece;
let currentX;
let currentY;
let score       = 0;
let gameInterval;
let isGameOver  = false;

//SANI: create an array set for all kind of falling pieces
const PIECES = [
                    [[1, 1, 1, 1]], // I
                    [[1, 1], [1, 1]], // O
                    [[0, 1, 1], [1, 1, 0]], // S
                    [[1, 1, 0], [0, 1, 1]], // Z
                    [[1, 1, 1], [0, 1, 0]], // T
                    [[1, 1, 1], [1, 0, 0]], // L
                    [[1, 1, 1], [0, 0, 1]] // J
              ];

function drawBoard() //SANI: draw complete board
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < ROWS; row++) 
    {
        for (let col = 0; col < COLS; col++) 
        {
            if (board[row][col]) 
            {
                ctx.fillStyle = COLORS[board[row][col] - 1];
                ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawPiece(piece, offsetX, offsetY) //SANI: draw pieces
{
    piece.forEach((row, y) => 
    {
        row.forEach((value, x) => 
        {
            if (value) 
            {
                ctx.fillStyle = COLORS[value - 1];
                ctx.fillRect((offsetX + x) * BLOCK_SIZE, (offsetY + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeRect((offsetX + x) * BLOCK_SIZE, (offsetY + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function collide(piece, offsetX, offsetY) //SANI: detect collision
{
    return piece.some((row, y) => 
    {
        return row.some((value, x) => 
        {
            if (value) 
            {
                const newX = offsetX + x;
                const newY = offsetY + y;

                if (newX < 0 || newX >= COLS || newY >= ROWS) 
                {
                    return true;
                }

                if (board[newY] && board[newY][newX]) 
                {
                    return true;
                }
            }
            return false;
        });
    });
}

function rotate(piece) //SANI: rotate piece
{
    const rotated = piece[0].map((_, i) => piece.map(row => row[i])).reverse();
    return rotated;
}

function dropPiece() //SANI: falling peice
{
    if (isGameOver) return;

    random_index = Math.random() * PIECES.length; //console.log(random_index); //SANI: get any random index of array
    round_down   = Math.floor(random_index);  //console.log(round_down); //SANI: round index to lowest value
    piece        = PIECES[round_down];  //console.log(piece); //SANI: get the piece dimension of that index

    currentPiece = piece;
    currentX     = Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2);
    currentY     = 0;

    if (collide(currentPiece, currentX, currentY)) 
    {
        isGameOver = true;
        clearInterval(gameInterval);
        alert('Game Over');
        return;
    }

    drawBoard();
    drawPiece(currentPiece, currentX, currentY);
}

function movePiece(dir) 
{
    if (isGameOver) return;

    const newX = dir === 'left' ? currentX - 1 : currentX + 1;
    if (!collide(currentPiece, newX, currentY)) 
    {
        currentX = newX;
        drawBoard();
        drawPiece(currentPiece, currentX, currentY);
    }
}

function drop() 
{
    if (isGameOver) return;

    if (!collide(currentPiece, currentX, currentY + 1)) 
    {
        currentY++;
    } else {
                placePiece();
                dropPiece();
           }

    drawBoard();
    drawPiece(currentPiece, currentX, currentY);
}

function placePiece() 
{
    currentPiece.forEach((row, y) => 
    {
        row.forEach((value, x) => 
        {
            if (value) 
            {
                board[y + currentY][x + currentX] = value;
            }
        });
    });

    checkLines();
}

function checkLines() 
{
    for (let row = ROWS - 1; row >= 0; row--) 
    {
        if (board[row].every(cell => cell !== 0)) 
        {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            score += 100;
            document.getElementById('score').textContent = `Score: ${score}`;
            row++;
        }
    }
}

function gameLoop() 
{
    if (!isGameOver) 
    {
        drop();
    }
}
//SANI: start game on button clicke
document.getElementById('startBtn').addEventListener('click', () =>
{
    if (gameInterval) 
    {
        clearInterval(gameInterval);
    }

    board       = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score       = 0;
    isGameOver  = false;

    document.getElementById('score').textContent = `Score: ${score}`;
    dropPiece();
    gameInterval = setInterval(gameLoop, 500);

});

document.addEventListener('keydown', (event) => 
{
    if (isGameOver) return;

    if (event.code === 'ArrowLeft') 
    {
        movePiece('left');
    } else if (event.code === 'ArrowRight') 
    {
        movePiece('right');
    } else if (event.code === 'ArrowDown') 
    {
        drop();
    } else if (event.code === 'ArrowUp') 
    {
        currentPiece = rotate(currentPiece);

        if (collide(currentPiece, currentX, currentY)) 
        {
            currentPiece = rotate(rotate(rotate(currentPiece)));
        }

        drawBoard();
        drawPiece(currentPiece, currentX, currentY);
    }
});
