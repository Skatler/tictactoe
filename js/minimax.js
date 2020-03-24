
//minimax algorithm
function minimax(position, depth, alpha, beta, maximizingPlayer){
  let spaces=emptyS();
  //heuristic scoring
  if (spaces+depth>7) {
    let state=checkState();
    if (depth>3) {
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
  }
   else {
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
//Horizontal heuristic scoring
function checkHorizontal(){
  let bigScore=0;

  for(let i=0;i<rowNumber;i++){
    let score=0;
    let elem;
    //get score for each row
    for(let j=0;j<colNumber;j++){
      //get first element (X/O)
      if (elem==undefined) {
        if (board[i][j]!=null) {
          elem=board[i][j];
          score+=scores[elem];
        }
      }
      //compare other elements with first
      else {
        //if both X & O is present, return 0 (can't win)
        if(elem!=board[i][j]&&board[i][j]!=null){
          score=0;
          break;
        }
        else if (elem==board[i][j]) {
          score+=scores[elem];
        }
      }
    }
    //add to total score
    bigScore+=score/colNumber;
  }
  return bigScore;
}
//Vertical heuristic scoring
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
//Diagonal heuristic scoring
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
//Second Diagonal heuristic scoring
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

//total heuristic scoring
function checkState(){
  return checkHorizontal()+checkVertical()+checkDiag()+checkDiag2();
}

//check for winner Horizontally
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

//check for winner Vertically
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

//check for winner Diagonally
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

//check for winner Diagonally
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

//check if first collumn is empty
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

//check if last collumn is empty
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

//check if first row is empty
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

//check if last row is empty
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

//check for winner
function checkWin(){
  stroke('rgba(211, 203, 189,0.3)');
  strokeWeight(20);

  //if one of the side collumns and one of the top/bottom rows are empty there can't be a winner
  if ((checkLeft()||checkRight())&&(checkBottom()||checkTop())) {
    return null;
  }
  //check Horizontally
  if (checkH()) {
    return checkH();
  }
  //check Vertically
  if (checkV()) {
    return checkV();
  }
  //check Diagonally
  if (checkD1()) {
      return checkD1();
  }
  //check Diagonally
  if (checkD2()) {
      return checkD2();
  }
  //if there is no winner and there is at least one empty square, the game is not over
  if (emptyS()!==0) {
    return null;
  }
  //if there is no winner and there are no free squares, it's a tie
  return 0;
}

//count empty squares
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
