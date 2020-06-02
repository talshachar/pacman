var gPacman;
var gPacmanDeg;
var underPacman = ' ';
var gGhostReviveTimeout = null;
var removedGhosts = [];

// PACMAN needs to be lowercase
var PACMAN = `<img src="img/pixel-pac-man.ico">`;

// Preloading audio
var chompSound = new Audio('sound/pacman_chomp.wav'); chompSound.volume = 0.5;
var fruitSound = new Audio('sound/pacman_eatfruit.wav'); fruitSound.volume = 0.5;

var extraPacSound = new Audio('sound/pacman_extrapac.wav'); extraPacSound.volume = 0.5;

function createPacman(board) {
  gPacman = {
    location: {
      i: 10,
      j: 7
    },
    isSuper: false
    // deg: 0
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) {
    if (eventKeyboard.code === 'Space' || eventKeyboard.code === 'Enter') init();
    return;
  }

  var nextLocation = getNextLocation(eventKeyboard);
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;
  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return;

  // --------- UPDATING GAME STATE ---------
  // Update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = underPacman;
  // Update the DOM
  renderCell(gPacman.location, underPacman);

  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // Render updated model to the DOM
  renderCell(gPacman.location, PACMAN);
  // ---------------------------------------

  // underPacman prevents superfood usage while Pacman is on Super Mode
  if (nextCell === EMPTY) underPacman = EMPTY;
  if (nextCell === FOOD) {
    updateScore(10); underPacman = EMPTY;
    chompSound.play();
  }
  if (nextCell === CHERRY) {
    updateScore(100);
    underPacman = EMPTY;
    fruitSound.play();
  }

  if (nextCell === SUPERFOOD) {
    if (!gPacman.isSuper) {
      extraPacSound.play();
      updateScore(50);
      gfirstGhostColIdx = gBoard[0].length - 6;
      superPacman();
    } else underPacman = SUPERFOOD;
  }

  // if (nextCell === GHOST) {
  if (nextCell.includes('<img src="img/pixel-ghost')) {
    if (!gPacman.isSuper) {
      renderCell(gPacman.location, GHOST);
      gameOver('lost'); // Game Over - Lost!
      return;
    } else {
      updateScore(200);
      var eatGhostSound = new Audio('sound/pacman_eatghost.wav');
      eatGhostSound.volume = 0.5;
      eatGhostSound.play()
      for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === nextLocation.i &&
          gGhosts[i].location.j === nextLocation.j) {
          // Fixing usage of elements under ghost
          if (gGhosts[i].currCellContent === FOOD) updateScore(10);
          if (gGhosts[i].currCellContent === CHERRY) updateScore(100);
          // Prevents usage/disappearance of superfood under ghosts
          if (gGhosts[i].currCellContent === SUPERFOOD) underPacman = SUPERFOOD;
          var removedGhost = gGhosts.splice(i, 1);
          reviveGhost(removedGhost[0]); // Set to 5 secs
        }
      }
    }
  }

  // Victory!
  var foods = getCellsOfGameEl(gBoard, FOOD);
  var superfoods = getCellsOfGameEl(gBoard, SUPERFOOD);
  var cherrys = getCellsOfGameEl(gBoard, CHERRY);
  if (!foods.concat(superfoods, cherrys).length) gameOver('won');
  // if (gGame.score >= 100) gameOver('won'); // Testing victory
  return;
}

function reviveGhost(removedGhost) {

  removedGhosts.push(removedGhost)
  // Setting new spawn location to removed ghost
  removedGhosts[removedGhosts.length - 1].location.i = 4;
  removedGhosts[removedGhosts.length - 1].location.j = gfirstGhostColIdx--;
  // removedGhosts[removedGhosts.length - 1].currCellContent = EMPTY; // Used for same location respawn

  // Resetting ghost color
  removedGhosts[removedGhosts.length - 1].color = removedGhosts[removedGhosts.length - 1].tempColor;

  gGhostReviveTimeout = setTimeout(function () {
    var revivedGhost = removedGhosts.splice(0, 1);
    if (gPacman.isSuper) revivedGhost[0].color = 'chase';

    // Checks if trying to respawn on ghost, if true: respawn column =- 1
    // *Won't respawn on walls if amount of ghosts <= half of the amount board columns
    while (gBoard[revivedGhost[0].location.i][revivedGhost[0].location.j].includes('<img src="img/pixel-ghost')) {
      revivedGhost[0].location.j--;
    }

    // Applying spawn cell content to underCellContent of ghost
    revivedGhost[0].currCellContent = gBoard[revivedGhost[0].location.i][revivedGhost[0].location.j];
    // Reviving
    gGhosts.push(revivedGhost[0]);
    // Updating Model & DOM
    gBoard[revivedGhost[0].location.i][revivedGhost[0].location.j] = GHOST;
    renderCell(revivedGhost[0].location, getGhostHTML(revivedGhost[0]));
  }, 5000);
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };

  switch (keyboardEvent.code) {
    case 'ArrowUp':
      gPacmanDeg = -90;
      nextLocation.i--;
      break;
    case 'ArrowDown':
      gPacmanDeg = 90;
      nextLocation.i++;
      break;
    case 'ArrowLeft':
      gPacmanDeg = 180;
      nextLocation.j--;
      break;
    case 'ArrowRight':
      gPacmanDeg = 0;
      nextLocation.j++;
      break;
    default: return null;
  }
  PACMAN = `<img style="transform: rotate(${gPacmanDeg}deg)" src="img/pixel-pac-man.ico">`;
  renderCell(gPacman.location, PACMAN)
  return nextLocation;
}

function superPacman() {
  document.querySelector('.super').innerHTML =
    '<img src="img/pixel-fruit-apple.ico" style="height: 30px; margin-bottom: 0.5em"><br />SUPER MODE!';
  gPacman.isSuper = true;
  GHOST = '<img src="img/pixel-ghost-chase.ico">';
  for (var i = 0; i < gGhosts.length; i++) {
    // gGhosts[i].color = '#00c';
    gGhosts[i].color = 'chase';
    gBoard[gGhosts[i].location.i][gGhosts[i].location.j] = GHOST;
    renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]));
  }
  setTimeout(unsuperPacman, 5000);
}

function unsuperPacman() {
  document.querySelector('.super').innerText = '';
  gPacman.isSuper = false;
  for (var i = 0; i < gGhosts.length; i++) {
    gGhosts[i].color = gGhosts[i].tempColor;
    renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]));
  }
}