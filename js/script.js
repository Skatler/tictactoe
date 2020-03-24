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
  //draw grid
  for(let i=1;i<colNumber;i++){
      line(w*i,0,w*i,height);
    for(let j=1;j<rowNumber;j++){
        line(0,h*j,width,h*j);
    }
  }
  strokeWeight(15);
  //draw X & O
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
  //game over text
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
//calculate best move for current player and make it
function bestMove() {
  let bestScore = -Infinity;
  let move;
  swapScores();
  for (let i = 0; i < rowNumber; i++) {
    for (let j = 0; j < colNumber; j++) {
      if (board[i][j] == null) {
        //if spot is free try the spot
        board[i][j] = currentMove;
        let score = minimax(board, 1,-Infinity,Infinity, false);
        board[i][j] = null;
        //if current spot is better than last best spot -> best spot is current spot
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
//make move at clicked location
function mouseClicked(evt) {
  //get click coordinates
  let x=evt.offsetX;
  let y=evt.offsetY;
  for(let i=1;i<=colNumber;i++){
    for(let j=1;j<=rowNumber;j++){
      //find clicked square
      if(x>w*(i-1)&&x<w*i&&y>h*(j-1)&&y<h*j&&evt.target.id=='defaultCanvas0'){
        if (checkWin()==null) {
          if (currentBoard<savedBoards.length-1) {//if is not first in timeline -> become first in timeline
            savedBoards.splice(currentBoard+1,savedBoards.length-1-currentBoard);
          }
          board[j-1][i-1]=currentMove;
          saveBoard();
          currentMove = [otherMove, otherMove = currentMove][0];
          swapScores();
          isClear=false;
        }
        else { //if game is over restart
          clearBoard();
        }
      }
    }
  }
}
