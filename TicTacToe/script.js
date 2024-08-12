let currentPlayer = "X"; //SANI: Set mark for default player
let board         = ["", "", "", "", "", "", "", "", ""]; //SANI: Draw an empty board

//SANI: When clicking on any box. trigger this function
function makeMove(index) 
{
    if (board[index] === "") //SANI: if selected indexed value is empty
    {
        board[index] = currentPlayer;  //SANI: fill index value with X
        document.getElementById("board").children[index].innerText = currentPlayer; //SANI: show X mark on web page as well

        if (checkWin()) //SANI: check if user is win
        {
            alert(currentPlayer + " wins!");
            resetBoard(); //SANI: refresh the board
            return;
        }

        if (checkDraw())  //SANI: check if game is draw
        {
            alert("It's a draw!");
            resetBoard(); //SANI:  refresh the board
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X"; //SANI: if current player was X then it should be O now
    }
}

function checkWin() //SANI: check whether user has won or not
{
	//SANI: make an array of all winning combinations
    const winningCombinations = [
						     		[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
						  		];

    //SANI: loop through all combinations
    for (const comb of winningCombinations) 
    {
        const [a, b, c] = comb;

        if (board[a] && board[a] === board[b] && board[a] === board[c])  //SANI: check if these combination have same value
        {
            return true; //SANI: yes, all value in combination are same
        }
    }
    return false;
}

function checkDraw() //SANI: check if all combinations do not have any winning combination
{
    return board.every(boardCell);  //SANI: check all index value with given cimbination
}


let boardCell = (cell) => { return cell !== "" };

function resetBoard()  //SANI: refresh the board.
{
    board = ["", "", "", "", "", "", "", "", ""];

    document.querySelectorAll(".cell").forEach(cell => cell.innerText = "");  //SANI: null all values shown on web page.

    currentPlayer = "X";
}
