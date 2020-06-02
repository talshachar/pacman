
function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
  // var colors = ['blue', 'orange', 'pink', 'red'];
  // return colors[getRandomIntInclusive(0, 3)];

}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell' + i + '-' + j;
      // ------- Walls -------
      if (i === 0 || i === mat.length - 1) {
        if (j > 0 && j < mat[0].length - 1) className = 'wall-horizontal cell cell' + i + '-' + j;
      }
      if (j === 0 || j === mat[0].length - 1) {
        if (i > 0 && i < mat.length - 1) className = 'wall-vertical cell cell' + i + '-' + j;
      }

      if (i === 0 && j == 0) className = 'wall-tl-corner cell cell' + i + '-' + j;
      if (i === 0 && j == mat[0].length -1) className = 'wall-tr-corner cell cell' + i + '-' + j;
      if (i === mat.length -1 && j === 0) className = 'wall-bl-corner cell cell' + i + '-' + j;
      if (i === mat.length -1 && j == mat[0].length -1) className = 'wall-br-corner cell cell' + i + '-' + j;
      
      // if (j === 3 && i > 4 && i < SIZE - 2)
      // if (i === 5 && j > 4 && j < size - 4) || (i === 4 && j === size - 5))
      if (j === 5 && i === 5) className = 'wall-c cell cell' + i + '-' + j;
      if (j > 5 && j < mat.length -5 && i == 5) className = 'wall-horizontal cell cell' + i + '-' + j;
      if (j === mat.length -5 && i === 5) className = 'wall-br-corner cell cell' + i + '-' + j;
      if (j === mat.length -5 && i === 4) className = 'wall-n cell cell' + i + '-' + j;
      // ---------------------
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getCellsOfGameEl(board, gameEl) {
  var elCells = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var location = { 'i': i, 'j': j }
      if (board[i][j] === gameEl) elCells.push(location);
    }
  }
  return elCells;
}

