const Game = (function createGame() {
  const PLAYER_ONE = "X";
  const PLAYER_TWO = "O";
  const cells = document.querySelectorAll(".cell");

  const Gameboard = (function createGameboard() {
    const EMPTY = " ";
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

    function reset() {
      for (const row of ROWS) {
        for (const col of COLS) {
          gameboard[row][col] = EMPTY;
          const index = col + row * 3;
          cells[index].innerHTML = "";
        }
      }
    }

    function drawX(element) {
      const xImage = document.createElement("img");
      xImage.src = "./images/x-lg.svg";
      xImage.className = "x-image";

      element.appendChild(xImage);
    }

    function drawO(element) {
      const oImage = document.createElement("img");
      oImage.src = "./images/circle.svg";
      oImage.className = "o-image";

      element.appendChild(oImage);
    }

    function handleClick(element, symbol, row, column) {
      if (move(symbol, row, column)) {
        if (symbol === PLAYER_ONE) {
          drawX(element);
        } else {
          drawO(element);
        }
        return true;
      }
      return false;
    }

    return { move, checkForWinner, reset, handleClick };
  })();

  function createPlayer(name, symbol) {
    const playerSymbol = symbol;

    function getSymbol() {
      return playerSymbol;
    }

    return { name, getSymbol };
  }

  let gameOver = false;
  let winner = null;

  const playerOneElement = document.querySelector("#player-1");
  const playerTwoElement = document.querySelector("#player-2");
  const playerOne = createPlayer(playerOneElement.textContent, PLAYER_ONE);
  const playerTwo = createPlayer(playerTwoElement.textContent, PLAYER_TWO);
  const renameButton1 = document.querySelector("#rename-1");
  const nameDialog1 = document.querySelector("#name-dialog-1");
  const changeButton1 = document.querySelector("#change-1");
  const cancelButton1 = document.querySelector("#cancel-1");
  const playerOneName = document.querySelector("#player-1-name");
  const renameButton2 = document.querySelector("#rename-2");
  const nameDialog2 = document.querySelector("#name-dialog-2");
  const changeButton2 = document.querySelector("#change-2");
  const cancelButton2 = document.querySelector("#cancel-2");
  const playerTwoName = document.querySelector("#player-2-name");
  const displayText = document.querySelector(".display-text");
  const restartButton = document.querySelector("#restart-button");
  let currentPlayer = playerOne;
  displayText.textContent = `${
    currentPlayer.name
  } (${currentPlayer.getSymbol()}), it's your turn.`;

  restartButton.addEventListener("click", restart);
  renameButton1.addEventListener("click", () =>
    openNameDialog(nameDialog1, playerOneElement, playerOneName)
  );
  changeButton1.addEventListener("click", (event) =>
    updatePlayerName(
      event,
      nameDialog1,
      playerOneElement,
      playerOneName,
      playerOne
    )
  );
  cancelButton1.addEventListener("click", () =>
    closeNameDialog(nameDialog1, playerOneName)
  );
  renameButton2.addEventListener("click", () =>
    openNameDialog(nameDialog2, playerTwoElement, playerTwoName)
  );
  changeButton2.addEventListener("click", (event) =>
    updatePlayerName(
      event,
      nameDialog2,
      playerTwoElement,
      playerTwoName,
      playerTwo
    )
  );
  cancelButton2.addEventListener("click", () =>
    closeNameDialog(nameDialog2, playerTwoName)
  );

  function openNameDialog(dialog, nameDisplayElement, nameInputElement) {
    dialog.show();
    nameInputElement.value = nameDisplayElement.textContent;
  }

  function updatePlayerName(
    event,
    dialog,
    nameDisplayElement,
    nameInputElement,
    playerObject
  ) {
    event.preventDefault();
    nameDisplayElement.textContent = nameInputElement.value;
    playerObject.name = nameInputElement.value;
    dialog.close();
    updateDisplayText();
  }

  function closeNameDialog(dialog, nameInputElement) {
    nameInputElement.value = "";
    dialog.close();
  }

  for (let index = 0; index < cells.length; index++) {
    const cell = cells[index];

    cell.addEventListener("click", (event) => {
      let row = Math.floor(index / 3);
      let col = index % 3;
      let element = event.target;

      if (
        !gameOver &&
        Gameboard.handleClick(element, currentPlayer.getSymbol(), row, col)
      ) {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        updateDisplayText();
      }
    });
  }

  function updateDisplayText() {
    winner = Gameboard.checkForWinner();
    if (winner) {
      gameOver = true;
      if (winner === PLAYER_ONE) {
        displayText.textContent = `${
          playerOne.name
        } (${playerOne.getSymbol()}) Wins!`;
      } else if (winner === PLAYER_TWO) {
        displayText.textContent = `${
          playerTwo.name
        } (${playerTwo.getSymbol()}) Wins!`;
      } else {
        displayText.textContent = `It's a Tie!`;
      }
    } else {
      displayText.textContent = `${
        currentPlayer.name
      } (${currentPlayer.getSymbol()}), it's your turn.`;
    }
  }

  function restart() {
    gameOver = false;
    winner = null;
    currentPlayer = playerOne;
    Gameboard.reset();
    updateDisplayText();
  }
})();
