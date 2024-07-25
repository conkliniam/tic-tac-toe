const Gameboard = (function createGameboard() {
  const EMPTY = " ";
  const PLAYER_ONE = "X";
  const PLAYER_TWO = "O";
  const TIE = "TIE";
  const ROWS = [0, 1, 2];
  const COLS = [0, 1, 2];

  const gameboard = [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
  ];

  function checkForWinner() {
    if (
      checkRows(PLAYER_ONE) ||
      checkColumns(PLAYER_ONE) ||
      checkDiagonals(PLAYER_ONE)
    ) {
      return PLAYER_ONE;
    }

    if (
      checkRows(PLAYER_TWO) ||
      checkColumns(PLAYER_TWO) ||
      checkDiagonals(PLAYER_TWO)
    ) {
      return PLAYER_TWO;
    }

    if (noEmptyCells()) {
      return TIE;
    }

    return false;
  }

  function noEmptyCells() {
    return gameboard.every((row) => row.every((cell) => cell !== EMPTY));
  }

  function checkRows(symbol) {
    for (const row of ROWS) {
      if (gameboard[row].every((val) => val === symbol)) {
        return true;
      }
    }

    return false;
  }

  function checkColumns(symbol) {
    for (const col of COLS) {
      if (gameboard.every((row) => row[col] === symbol)) {
        return true;
      }
    }
    return false;
  }

  function checkDiagonals(symbol) {
    return (
      (gameboard[0][0] === symbol &&
        gameboard[1][1] === symbol &&
        gameboard[2][2] === symbol) ||
      (gameboard[0][2] === symbol &&
        gameboard[1][1] === symbol &&
        gameboard[2][0] === symbol)
    );
  }

  function move(symbol, row, column) {
    if (isValidMove(symbol, row, column)) {
      gameboard[row][column] = symbol;
      return true;
    }

    return false;
  }

  function isValidMove(symbol, row, column) {
    return (
      ROWS.includes(row) &&
      COLS.includes(column) &&
      gameboard[row][column] === EMPTY &&
      (symbol === PLAYER_ONE || symbol === PLAYER_TWO)
    );
  }

  function show() {
    console.table(gameboard);
  }

  function reset() {
    for (const row of ROWS) {
      for (const col of COLS) {
        gameboard[row][col] = EMPTY;
      }
    }
  }

  return { show, move, checkForWinner, reset };
})();

function createPlayer(name, symbol) {
  const playerSymbol = symbol;

  function move() {
    let row;
    let col;
    console.log(`${name}, it is your turn!`);
    do {
      [row, col] = prompt(`Enter a move in the format: row column`)
        .split(" ")
        .map((val) => +val);
    } while (!Gameboard.move(playerSymbol, row, col));

    Gameboard.show();
  }

  function hasSymbol(symbol) {
    return playerSymbol === symbol;
  }
  return { name, move, hasSymbol };
}

const Game = (function createGame() {
  let gameOver;
  let winner;

  function play() {
    gameOver = false;
    winner = null;

    const playerOne = createPlayer(prompt("What is player one's name?"), "X");
    const playerTwo = createPlayer(prompt("What is player two's name?"), "O");
    Gameboard.reset();
    Gameboard.show();

    while (!gameOver) {
      playerOne.move();

      winner = Gameboard.checkForWinner();

      if (winner) {
        gameOver = true;
        break;
      }

      playerTwo.move();

      winner = Gameboard.checkForWinner();
      if (winner) {
        gameOver = true;
      }
    }

    if (playerOne.hasSymbol(winner)) {
      console.log(`${playerOne.name} Wins!`);
    } else if (playerTwo.hasSymbol(winner)) {
      console.log(`${playerTwo.name} Wins!`);
    } else {
      console.log("It's a tie!");
    }
  }

  return { play };
})();
