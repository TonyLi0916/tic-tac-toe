// GameBoard factory function
function GameBoard(initialBoard = ["", "", "", "", "", "", "", "", ""]) {
    const gameBoard = [...initialBoard];

    const getBoard = () => [...gameBoard];

    const markBoard = (index, mark) => {
        if (gameBoard[index] === "") {
            gameBoard[index] = mark;
            return true;
        }
        return false;
    };

    const reset = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = "";
        }
    };

    return { getBoard, markBoard, reset };
};

// Player factory function
function Player(name, mark) {
    let score = 0;

    const getScore = () => score;
    const incrementScore = () => ++score;
    const resetScore = () => {
        score = 0;
    };
    return { name, mark, resetScore, getScore, incrementScore };
};

// GameController factory function
function GameController(gameBoard, player1, player2) {
    let currentPlayer = player1;
    let isGameOver = false;
    let turnCount = 0;
    let winner = null;
    let isTie = false;

    const getCurrentPlayer = () => currentPlayer;

    const getIsTie = () => isTie;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
        const boardState = gameBoard.getBoard();
        const winCombo = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let combo of winCombo) {
            const [first, second, third] = combo;
            const mark = boardState[first];

            if (mark && mark === boardState[second] && mark === boardState[third]) {
                return currentPlayer;
            }
        }
        return null;
    };

    const playTurn = (index) => {
        if (isGameOver) return false;
        if (gameBoard.markBoard(index, currentPlayer.mark)) {
            turnCount++;
            winner = checkWinner();
            if (winner) {
                isGameOver = true;
                currentPlayer.incrementScore();
            } else if (turnCount === 9) {
                isTie = true;
                isGameOver = true;
            } else {
                switchPlayer();
            }
            return true;
        }
        return false;
    };

    const resetGame = () => {
        gameBoard.reset();
        currentPlayer = player1;
        turnCount = 0;
        isGameOver = false;
        isTie = false;
        winner = null;
    };

    return { getCurrentPlayer, getIsTie, checkWinner, playTurn, resetGame, switchPlayer };
};

function DisplayController(gameBoard, gameController) {
    const boardElement = document.querySelector("#gameboard");
    const cells = boardElement.querySelectorAll(".cell");
    const reset = document.querySelector("#resetBtn");

    const renderBoard = () => {
        const boardState = gameBoard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = boardState[index];
        });
    };

    const cellClicks = () => {
        cells.forEach((cell) => {
            cell.addEventListener("click", () => {
                const index = Number(cell.dataset.index);
                if (gameController.playTurn(index)) {
                    renderBoard();

                    const winner = gameController.checkWinner();
                    if (winner) {
                        setTimeout(() => {
                            alert(`${winner.name} wins!`)
                            updateScoreboard();
                        }, 10);
                    }
                    else if (gameController.getIsTie()) {
                        setTimeout(() => alert("It's a tie!"), 10);
                    }
                }

            });
        });
    }

    reset.addEventListener("click", () => {
        gameController.resetGame();
        renderBoard();
    });



    return { renderBoard, cellClicks };
}

let board;
let player1;
let player2;
let gameController;
let display;

const startBtn = document.querySelector("#startBtn");
const resetScr = document.querySelector("#resetScore");
const player1Input = document.querySelector("#player1Name");
const player2Input = document.querySelector("#player2Name");

const player1ScoreDisplay = document.querySelector("#player1Score");
const player2ScoreDisplay = document.querySelector("#player2Score");

startBtn.addEventListener("click", () => {
    const name1 = player1Input.value.trim() || "Player 1";
    const name2 = player2Input.value.trim() || "Player 2";

    board = GameBoard();
    player1 = Player(name1, "X");
    player2 = Player(name2, "O");
    gameController = GameController(board, player1, player2);
    display = DisplayController(board, gameController);

    display.renderBoard();
    display.cellClicks();
    updateScoreboard();
});

function updateScoreboard() {
    player1ScoreDisplay.textContent = `${player1.name}: ${player1.getScore()}`;
    player2ScoreDisplay.textContent = `${player2.name}: ${player2.getScore()}`;
}

resetScr.addEventListener("click", () => {
    player1.resetScore();
    player2.resetScore();
    updateScoreboard();
});




