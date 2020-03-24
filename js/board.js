//clear the board and empty timeline
function clearBoard(){
  for (let i = 0; i < rowNumber; i++) {
    for (let j = 0; j < colNumber; j++) {
      board[i][j]=null;
    }
  }
  if (currentMove=='O') {
    currentMove = [otherMove, otherMove = currentMove][0];
  }
  isClear=true;
  savedBoards= new Array();
  currentBoard=-1;
  saveBoard();
}
//add a row to the board and empty timeline
function addRow(){
board.push([]);
for (var i = 0; i < colNumber; i++) {
  board[rowNumber].push(null);
}
  rowNumber++;
  savedBoards= new Array();
  currentBoard=-1;
  saveBoard();
}
//add a collumn to the board and empty timeline
function addCol(){
  colNumber++;
for (var i = 0; i < rowNumber; i++) {
  board[i].push(null);
}
savedBoards= new Array();
currentBoard=-1;
saveBoard();
}

//delete a row from the board and empty timeline
function delRow(){
  if (rowNumber==3) {
    return;
  }
  rowNumber--;
  board.pop();
  savedBoards= new Array();
  currentBoard=-1;
  saveBoard();
}
//delete a collumn from the board and empty timeline
function delCol(){
  if (colNumber==3) {
    return;
  }
  for (var i = 0; i < rowNumber; i++) {
    board[i].pop();
  }
  colNumber--;
  savedBoards= new Array();
  currentBoard=-1;
  saveBoard();
}
//go forward in timeline or make next move
function nextBoard(){
  if (currentBoard<savedBoards.length-1) {
      currentBoard++;
    for (let i = 0; i < rowNumber; i++) {
      for (let j = 0; j < colNumber; j++) {
        board[i][j]=savedBoards[currentBoard][i][j];
      }
    }
    currentMove = [otherMove, otherMove = currentMove][0];
      swapScores();
  }
  else{ if (isClear) {
    board[floor(random(rowNumber))][floor(random(colNumber))]='X';
    saveBoard();
    currentMove = [otherMove, otherMove = currentMove][0];
    isClear=false;
  }
  else if (checkWin()==null) {
    console.time();
      bestMove();
  }
  else {
      clearBoard();
  }
}
}
//go to previous board in timeline
function undoBoard(){
  if (currentBoard!=0) {
    currentBoard--;
    for (let i = 0; i < rowNumber; i++) {
      for (let j = 0; j < colNumber; j++) {
        board[i][j]=savedBoards[currentBoard][i][j];
      }
    }
  swapScores();
  currentMove = [otherMove, otherMove = currentMove][0];
  }
  else {
  window.alert("cannot undo");
  }
}
//save board to timeline
function saveBoard(){
  savedBoards.push([]);
  for(let i=0;i<rowNumber;i++){
    savedBoards[savedBoards.length-1].push([...board[i]]);
  }
  currentBoard++;
}
