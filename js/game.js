'use strict';
var WALL = '';
const FOOD = '.';
const SUPERFOOD = '<img src="img/pixel-fruit-apple.ico">';
const EMPTY = ' ';
const CHERRY = '<img src="img/pixel-fruit-cherry.ico">';

var gBoard;
var gGame = {
  score: 0,
  isOn: false
};
var gCherryInterval;

// Preloading audio
var beginningTune = new Audio('sound/pacman_beginning.wav'); beginningTune.volume = 0.5;

function init() {
  beginningTune.play();
  document.querySelector('.gameover-modal').style.display = 'none';
  document.querySelector('.super').innerText = '';
  gBoard = buildBoard();
  gfirstGhostColIdx = gBoard[0].length - 6;
  createPacman(gBoard);
  createGhosts(gBoard);

  printMat(gBoard, '.board-container');
  // console.table(gBoard);
  gGame.score = 0;
  gGame.isOn = true;
  gCherryInterval = setInterval(function () { addCherry(gBoard) }, 15000)
}

function addCherry(board) {
  var emptyCells = getCellsOfGameEl(gBoard, EMPTY);
  if (!emptyCells.length) return;
  var randIdx = getRandomIntInclusive(0, emptyCells.length - 1)
  var randEmptyCell = emptyCells[randIdx];
  board[randEmptyCell.i][randEmptyCell.j] = CHERRY;
  renderCell(randEmptyCell, CHERRY)
}

function buildBoard() {
  var size = 14; // This board layout works only with size > 11
  var board = [];
  for (var i = 0; i < size; i++) {
    board.push([]);
    for (var j = 0; j < size; j++) {
      board[i][j] = FOOD;
      if (i === 1 || i === size - 2) {
        if (j === 1 || j === size - 2)
          board[i][j] = SUPERFOOD;
      }

      if (i === 0 || i === size - 1 ||
        j === 0 || j === size - 1 ||
        (i === 5 && j > 4 && j < size - 4) || (i === 4 && j === size - 5)) {
        board[i][j] = WALL;
      }
    }
  }
  return board;
}

function updateScore(value) {
  // Update both the model and the dom for the score
  gGame.score += value;
  document.querySelector('header p span').innerText = gGame.score;
}

function gameOver(strWonOrLost) {
  if (strWonOrLost === 'lost') {
    var deathSound = new Audio('sound/pacman_death.wav');
    deathSound.volume = 0.5;
    deathSound.play();
    document.querySelector('.gameover-modal span').innerText = 'GAME OVER!';
    document.querySelector('.gameover-modal').style.color = '#d21';
  } else {
    var intermissionSound = new Audio('sound/pacman_intermission.wav');
    intermissionSound.volume = 0.5;
    intermissionSound.play();
    document.querySelector('.gameover-modal span').innerText = 'VICTORY!';
    document.querySelector('.gameover-modal').style.color = '#ed0';
  }
  document.querySelector('.gameover-modal').style.display = 'initial';
  gGame.isOn = false;
  gfirstGhostColIdx = gBoard[0].length - 6;;
  
  clearInterval(gIntervalGhosts);
  gIntervalGhosts = null;
  
  clearInterval(gCherryInterval);
  gCherryInterval = null
  
  clearTimeout(gGhostReviveTimeout);
  gGhostReviveTimeout = null;
  // Fixing multiple timeouts of gGhostReviveTimeout
  for (var i = 1; i < 99999; i++) {
    window.clearInterval(i);
  }
}