let board=[
  [null,null,null],
  [null,null,null],
  [null,null,null]
];
let player=['X','O'];
let rowNumber=3;
let colNumber=3;
let h;
let w;
let currentMove='X';
let otherMove='O';
let isClear=true;
let emptySpaces;
let scores= {
  X: 10,
  O: -10,
  tie: 0,
  null:0
};
let savedBoards=new Array();
let currentBoard=-1;


function setup() {
let canvas=createCanvas(600,600);
canvas.parent('canvasContainer');
}
saveBoard();
function draw() {
  background(23);
  w=600/colNumber;
  h=600/rowNumber;
  stroke(190);
  strokeWeight(4);
  for(let i=1;i<colNumber;i++){
      line(w*i,0,w*i,height);
    for(let j=1;j<rowNumber;j++){
        line(0,h*j,width,h*j);
    }
  }
  strokeWeight(15);
  for(let j=0; j<colNumber;j++){
  for(let i=0; i<rowNumber;i++){
    let x=w*j+w/2;
    let y=h*i+h/2;
    let xr=Math.min(h,w)/3;
    let spot=board[i][j];
    if(spot==player[1]){
      stroke('rgb(69, 111, 116)');
      noFill();
      ellipse(x,y,Math.min(h,w)/1.5);
    }
    else if (spot==player[0]) {
      stroke('rgb(235, 89, 55)');
      line(x - xr, y - xr, x + xr, y + xr);
      line(x + xr, y - xr, x - xr, y + xr);
    }

  }
}
if (checkWin(true)!==null) {
  strokeWeight(100);
  line(0,0,width,0);
  textSize(36);
  textAlign(CENTER, CORNER);

  if (checkWin(true)==0) {
    fill(190);
    noStroke();
    text('Tie', width/2, 35);
  }
  else if (checkWin()==-10&&currentMove=='X') {
    fill('rgb(0, 48, 90)');
    noStroke();
    text('O Won', width/2, 35);
  }
  else{
    fill('rgb(235, 89, 55)');
    noStroke();
    text('X Won', width/2, 35);
  }
}
}

function bestMove() {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  swapScores();
  for (let i = 0; i < rowNumber; i++) {
    for (let j = 0; j < colNumber; j++) {
      // Is the spot available?
      if (board[i][j] == null) {
        board[i][j] = currentMove;
        let score = minimax(board, 1,-Infinity,Infinity, false);
        board[i][j] = null;
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  console.timeEnd();
  board[move.i][move.j] = currentMove;
  saveBoard();
  currentMove = [otherMove, otherMove = currentMove][0];
  swapScores();
}

function saveBoard(){
  savedBoards.push([]);
  for(let i=0;i<rowNumber;i++){
    savedBoards[savedBoards.length-1].push([...board[i]]);
  }
  currentBoard++;
}
function swapScores(){
  if (currentMove=='X') {
    scores = {
      X: 10,
      O: -10,
      tie: 0
    };
  }
  else {
    scores = {
      X: -10,
      O: 10,
      tie: 0
    };
  }
}
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
}else {
  window.alert("cannot undo");
}
}
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

function minimax(position, depth, alpha, beta, maximizingPlayer){

  let spaces=emptyS();
  console.log(spaces+depth);
  if (spaces+depth>7) {
    let state=checkState();
    if (depth>3) {
      console.log('YES');
      return state/depth;
    }
  }
  let result = checkWin();
  if (result !== null) {
    checkWin();
    return result/depth;
  }

  if (maximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < rowNumber; i++) {
      let broken=false;
      for (let j = 0; j < colNumber; j++) {
        // Is the spot available?
        if (board[i][j] == null) {
          board[i][j] = currentMove;
          let score = minimax(board, depth + 1, alpha, beta, false);
          board[i][j] = null;
          bestScore = max(score, bestScore);
          alpha = max(alpha, score);
            if (beta <= alpha){
                break;
            }
        }
      }
      if (broken) {
        break;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < rowNumber; i++) {
      let broken=false;
      for (let j = 0; j < colNumber; j++) {
        // Is the spot available?
        if (board[i][j] == null) {
          board[i][j] = otherMove;
          let score = minimax(board, depth + 1, alpha, beta, true);
          board[i][j] = null;
          bestScore = min(score, bestScore);
          beta = min(beta, score);
            if (beta <= alpha){
              broken=true;
                break;
            }
        }
      }
      if (broken) {
        break;
      }
    }
    return bestScore;
  }
  }


function mouseClicked(evt) {
  let x=evt.offsetX;
  let y=evt.offsetY;
  for(let i=1;i<=colNumber;i++){
    for(let j=1;j<=rowNumber;j++){
      if(x>w*(i-1)&&x<w*i&&y>h*(j-1)&&y<h*j&&evt.target.id=='defaultCanvas0'){
        if (checkWin()==null) {
        if (currentBoard<savedBoards.length-1) {
          savedBoards.splice(currentBoard+1,savedBoards.length-1-currentBoard);
        }
          board[j-1][i-1]=currentMove;
          saveBoard();
          currentMove = [otherMove, otherMove = currentMove][0];
          swapScores();
          isClear=false;
      }
      else {
        clearBoard();
      }
    }
    }
  }
}
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
function addCol(){
  colNumber++;
for (var i = 0; i < rowNumber; i++) {
  board[i].push(null);
}
savedBoards= new Array();
currentBoard=-1;
saveBoard();
}
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
function checkHorizontal(){
  let bigScore=0;
  for(let i=0;i<rowNumber;i++){
    let score=0;
    let elem;
    for(let j=0;j<colNumber;j++){
      if (elem==undefined) {
        if (board[i][j]!=null) {
          elem=board[i][j];
          score+=scores[elem];
        }
      }
      else {
        if(elem!=board[i][j]&&board[i][j]!=null){
          score=0;
          break;
        }
        else if (elem==board[i][j]) {
          score+=scores[elem];
        }
      }
    }
    bigScore+=score/colNumber;
  }
  return bigScore;
}
function checkVertical(){
  let bigScore=0;
  for(let j=0;j<colNumber;j++){
    let score=0;
    let elem;
    for(let i=0;i<rowNumber;i++){
      if (elem==undefined) {
        if (board[i][j]!=null) {
          elem=board[i][j];
          score+=scores[elem];
        }
      }
      else {
        if(elem!=board[i][j]&&board[i][j]!=null){
          score=0;
          break;
        }
        else if (elem==board[i][j]) {
          score+=scores[elem];
        }
      }
    }
    bigScore+=score/colNumber;
  }
  return bigScore;
}
function checkDiag(){
  let bigScore=0;
  for(let j=0;j<Math.abs(colNumber-rowNumber)+1;j++){
    let score=0;
    let elem;
    if (colNumber<rowNumber) {
    for(let i=0;i<colNumber;i++){
      if (elem==undefined) {
        if (board[i+j][i]!=null) {
          elem=board[i+j][i];
          score+=scores[elem];
        }
      }
      else {
        if(elem!=board[i+j][i]&&board[i+j][i]!=null){
          score=0;
          break;
        }
        else if (elem==board[i+j][i]) {
          score+=scores[elem];
        }
      }
    }
    bigScore+=score/colNumber;
  }
  else
  {
    for(let i=0;i<rowNumber;i++){
      if (elem==undefined) {
        if (board[i][i+j]!=null) {
          elem=board[i][i+j];
          score+=scores[elem];
        }
      }
      else {
        if(elem!=board[i][i+j]&&board[i][i+j]!=null){
          score=0;
          break;
        }
        else if (elem==board[i][i+j]) {
          score+=scores[elem];
        }
      }
    }
    bigScore+=score/rowNumber;
  }
}
  return bigScore;
}
function checkDiag2(){
  let bigScore=0;
  for(let j=0;j<Math.abs(colNumber-rowNumber)+1;j++){
    let score=0;
    let elem;
    if (colNumber<rowNumber) {
    for(let i=colNumber-1;i>-1;i--){
      if (elem==undefined) {
        if (board[colNumber-1-i+j][i]!=null) {
          elem=board[colNumber-1-i+j][i];
          score+=scores[elem];
        }
      }
      else {
        if(elem!=board[colNumber-1-i+j][i]&&board[colNumber-1-i+j][i]!=null){
          score=0;
          break;
        }
        else if (elem==board[colNumber-1-i+j][i]) {
          score+=scores[elem];
        }
      }
    }
    bigScore+=score/colNumber;
  }
  else
  {
    for(let i=rowNumber-1;i>-1;i--){
      if (elem==undefined) {
        if (board[i][rowNumber-1-i+j]!=null) {
          elem=board[i][rowNumber-1-i+j];
          score+=scores[elem];
        }
      }
      else {
        if(elem!=board[i][rowNumber-1-i+j]&&board[i][rowNumber-1-i+j]!=null){
          score=0;
          break;
        }
        else if (elem==board[i][rowNumber-1-i+j]) {
          score+=scores[elem];
        }
      }
    }
    bigScore+=score/rowNumber;
  }
}
  return bigScore;
}
function checkState(){
  return checkHorizontal()+checkVertical()+checkDiag()+checkDiag2();
}
function checkH(){
  let horizontal;
  for(let i=0;i<rowNumber;i++){
    horizontal=true
    for(let j=0;j<colNumber;j++){
      if(board[i][0]!=board[i][j]||board[i][0]==null){
        horizontal=false;
      }
    }
    if (horizontal) {
      line(0,h*i+h/2,width,h*i+h/2);
      return scores[board[i][0]];
    }
  }
}

function checkV(){
  let vertical;
    for(let j=0;j<colNumber;j++){
      vertical=true
      for(let i=0;i<rowNumber;i++){
        if(board[0][j]!=board[i][j]||board[0][j]==null){
          vertical=false;
        }
      }
      if (vertical) {
        line(w*j+w/2,0,w*j+w/2,height);
        return scores[board[0][j]];
      }
    }
}

function checkD1(){
  let diagonal;
  for(let j=0;j<Math.abs(colNumber-rowNumber)+1;j++){
    diagonal=true;
    if (colNumber<rowNumber) {
      for(let i=0;i<colNumber;i++){
        if(board[j][0]!=board[i+j][i]||board[j][0]==null){
          diagonal=false;
        }
      }
      if(diagonal){
        line(0,j*h,width,(colNumber+j)*h);
        return scores[board[j][0]];
      }
    }
    else {
      for(let i=0;i<rowNumber;i++){
        if(board[0][j]!=board[i][i+j]||board[0][j]==null){
          diagonal=false;
        }
      }
      if(diagonal){
        line(w*j,0,(rowNumber+j)*w,height);
        return scores[board[0][j]];
      }
    }
  }
}
function checkD2(){
  for(let j=0;j<Math.abs(colNumber-rowNumber)+1;j++){
    diagonal=true;
    if (colNumber<rowNumber) {
      for(let i=colNumber-1;i>-1;i--){
        if(board[j][colNumber-1]!=board[colNumber-1-i+j][i]||board[j][colNumber-1]==null){
          diagonal=false;
        }
      }
      if(diagonal){
        line(0,(colNumber+j)*h,width,h*j);
        return scores[board[j][colNumber-1]];
      }
    }
    else {
      for(let i=rowNumber-1;i>-1;i--){
        if(board[rowNumber-1][j]!=board[i][rowNumber-1-i+j]||board[rowNumber-1][j]==null){
          diagonal=false;
        }
      }
      if(diagonal){
        line(w*j,height,(rowNumber+j)*w,0 );
        return scores[board[rowNumber-1][j]];
      }
    }
  }
}
function checkLeft(){
  let empty=true;
  for(let i=0;i<rowNumber;i++){
    if(board[i][0]!=null){
      empty=false;
      break;
    }
  }
  return empty;
}
function checkRight(){
  let empty=true;
  for(let i=0;i<rowNumber;i++){
    if(board[i][colNumber-1]!=null){
      empty=false;
      break;
    }
  }
  return empty;
}
function checkTop(){
  let empty=true;
  for(let i=0;i<colNumber;i++){
    if(board[0][i]!=null){
      empty=false;
      break;
    }
  }
  return empty;
}
function checkBottom(){
  let empty=true;
  for(let i=0;i<colNumber;i++){
    if(board[rowNumber-1][i]!=null){
      empty=false;
      break;
    }
  }
  return empty;
}
function checkWin(){
  stroke('rgba(211, 203, 189,0.3)');
  strokeWeight(20);

if ((checkLeft()||checkRight())&&(checkBottom()||checkTop())) {
  return null;
}
if (checkH()) {
  return checkH();
}
if (checkV()) {
  return checkV();
}
  //diagonal
if (checkD1()) {
    return checkD1();
  }
  //second diagonal
if (checkD2()) {
    return checkD2();
  }

  for (let i = 0; i < rowNumber; i++) {
    for (let j = 0; j < colNumber; j++) {
      // Is the spot available?
      if (board[i][j] == null) {
        return null;
      }
    }
  }
  return 0;
}
function emptyS(){
  emptySpaces=0;
  for (let i = 0; i < rowNumber; i++) {
    for (let j = 0; j < colNumber; j++) {
      if (board[i][j] == null) {
      emptySpaces++;
      }
    }
  }
  return emptySpaces;
}
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
