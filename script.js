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
        for(let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = "";
        }
    };

    return{ gameBoard, getBoard, markBoard, reset };
};

// Player factory function
function Player(name, mark) {
     let score = 0;

     const getScore = () => score;
     const incrementScore = () => ++score;

    return{ name, mark, getScore, incrementScore};
};

// GameController factory function
function GameController(gameBoard, player1, player2) {
    let currentPlayer = player1;
    let isGameOver = false;
    let turnCount = 0;
    let winner = null;
    let isTie = null;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const getCurrentPlayer = () => currentPlayer;

    const checkWinner = () => {
        const boardState = gameBoard.getBoard();
        const winCombo = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for(let combo of winCombo) {
            const [first, second, third] = combo;
            const mark = boardState[first];

            if (mark && mark === boardState[second] && mark === boardState[third]){
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
            }
            if (turnCount === 9) isTie = true;      
            switchPlayer();
            return true;
        }
        return false;
    };

    const resetGame = () => {
        gameBoard.reset();
        currentPlayer = player1;
        turnCount = 0;
        isGameOver = false;
        winner = null;
    };

    return { getCurrentPlayer, checkWinner, playTurn, resetGame, switchPlayer };
};

const board = GameBoard();
const player1 = Player("Alice", "X");
const player2 = Player("Bob", "O");
const game = GameController(board, player1, player2);