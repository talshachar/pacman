var GHOST;

var gIntervalGhosts;
var gGhosts;
var gfirstGhostColIdx;

function createGhost(board, color) {
    // var randColor = getRandomColor();
    var ghost = {
        location: {
            i: 4,
            j: gfirstGhostColIdx--
        },
        currCellContent: FOOD,
        color: color,
        tempColor: color,
    };
    GHOST = `<img src="img/pixel-ghost-${ghost.color}.ico">`;
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
}

function createGhosts(board) {
    gGhosts = [];

    // empty the gGhosts array, create some ghosts
    createGhost(board, 'blue')
    createGhost(board, 'orange')
    createGhost(board, 'pink')
    //  and run the interval to move them
    gIntervalGhosts = setInterval(moveGhosts, 750)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];

        // Create the moveDiff
        var moveDiff = getMoveDiff();
        var nextLocation =
        {
            i: ghost.location.i + moveDiff.i,
            j: ghost.location.j + moveDiff.j
        }
        // console.log('ghost.location', ghost.location, 'nextLocation', nextLocation, 'moveDiff', moveDiff)
        var nextCel = gBoard[nextLocation.i][nextLocation.j]
        // if WALL - give up
        if (nextCel === WALL) {
            i--;
            continue;
        }
        // if GHOST - give up
        // if (nextCel === GHOST) return;
        if (nextCel.includes('<img src="img/pixel-ghost')) {
            i--;
            continue;
        }
        // if PACMAN - gameOver or give up (SUPERFOOD)
        if (nextCel === PACMAN) {
            if (!gPacman.isSuper) gameOver('lost');
            else {
                i--;
                continue;
            }
        }

        // set back what we stepped on: update Model, DOM
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
        renderCell(ghost.location, ghost.currCellContent)

        // move the ghost
        ghost.location = nextLocation

        // keep the contnet of the cell we are going to
        ghost.currCellContent = gBoard[nextLocation.i][nextLocation.j]

        // move the ghost and update model and dom
        gBoard[ghost.location.i][ghost.location.j] = GHOST
        renderCell(ghost.location, getGhostHTML(ghost))
    }
}
function getMoveDiff() {
    var randNum = getRandomIntInclusive(0, 100)
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
    // var iRandNum = Math.round(Math.random() * 2 - 1);
    // var jRandNum = Math.round(Math.random() * 2 - 1);
    // return { i: iRandNum, j: jRandNum }
}


function getGhostHTML(ghost) {
    GHOST = `<img src="img/pixel-ghost-${ghost.color}.ico">`;
    return `<span>${GHOST}</span>`
    // return `<span style="color: ${ghost.color};">${GHOST}</span>`
}