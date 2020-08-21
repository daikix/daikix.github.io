document.getElementById("Hellotxt").textContent = "無限テトリス";

let count = 0;
let cells;
let nowrow =0;
let nowcol =0;
let intevaltime = 500;
let clearflg;

//ブロック定義
let blocks = {
  i:{
    class:"i",
    pattern:[[1,1,1,1]]
  },
  o:{
    class:"o",
    pattern:[[1,1],[1,1]]
  },
  t:{
    class:"t",
    pattern:[[0,1,0],[1,1,1]]
  },
  s:{
    class:"s",
    pattern:[[0,1,1],[1,1,0]]
  },
  z:{
    class:"z",
    pattern:[[1,1,0],[0,1,1]]
  },
  j:{
    class:"j",
    pattern:[[1,0,0],[1,1,1]]
  },
  l:{
    class:"l",
    pattern:[[0,0,1],[1,1,1]]
  }
};


function gamestart(){
  clearflg = false;
  loadTable();
  //document.getElementById("Hellotxt").textContent = "TETORIS START!!";
  let gameloop = setInterval(function(){

    if(hasfalling()){
      fallBlock();
    } else{
      for(let col=0;col<10;col++){
        if(cells[0][col].className !== ""){
          document.getElementById("Hellotxt").textContent = "GAME OVER!!";
          let result = window.confirm('GAME OVER!!  ゲームをやり直しますか？');
          if(result){
            initialize();
            clearInterval(gameloop);
            clearflg = true;
            document.getElementById("Hellotxt").textContent = "無限テトリス";
          } else{
            open("","_self").close();
          }
        }
      }
      if(clearflg === false){
        deleterow();
        generateblock();
      }
    }
  },intevaltime);
}
//ゲーム盤読込
function loadTable(){
  let td_array = document.getElementsByTagName("td");
  let index = 0;
  cells = [];
  for(let row=0;row<20;row++){
    cells[row] = [];
    for(let col=0;col<10;col++){
      cells[row][col] = td_array[index];
      index++;
    }
  }
}

//ブロック落下
function fallBlock(){
  for(let i=0;i<10;i++){
    if(cells[19][i].blocknum === fallingBlockNum){
      fallflg = false;
      return;
    }
  }

  for (var row = 18; row >= 0; row--) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blocknum === fallingBlockNum) {
        if (cells[row + 1][col].className !== "" && cells[row + 1][col].blocknum !== fallingBlockNum){
          fallflg = false;
          return; // 一つ下のマスにブロックがいるので落とさない
        }
      }
    }
  }

  for (var row = 18; row >= 0; row--) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blocknum === fallingBlockNum) {
        cells[row + 1][col].className = cells[row][col].className;
        cells[row + 1][col].blocknum = cells[row][col].blocknum;
        cells[row][col].className = "";
        cells[row][col].blocknum = null;
      }
    }
  }
}

//落下中ブロックの有無を確認
let fallflg = false;
function hasfalling(){
  return fallflg;
}

//ランダムにブロックを生成
let fallingBlockNum = 0;
function generateblock(){
  //1.ブロックパターンからランダムにパターンを選択
  let keys = Object.keys(blocks);
  let nxtblkkey = keys[Math.floor(Math.random() * keys.length)];
  let nxtblk = blocks[nxtblkkey];
  let nxtfallblocknum = fallingBlockNum + 1;
  //2.選んだブロックを配置する
  let pattern = nxtblk.pattern;
  for(let row=0;row<pattern.length;row++){
    for(let col=0;col<pattern[row].length;col++){
      if(pattern[row][col]){
        cells[row][col+3].className = nxtblk.class;
        cells[row][col+3].blocknum = nxtfallblocknum;
      }
    }
  }
  fallflg = true;
  fallingBlockNum = nxtfallblocknum;
}

document.addEventListener("keydown", onKeyDown);
function onKeyDown(event){
  if(event.keyCode === 37){
    moveLeft();
  } else if(event.keyCode === 39){
    moveRight();
  } else if(event.keyCode === 40){
    moveDown();
  } else if(event.keyCode === 38){
    Rotate();
  }
}

function moveLeft(){
  //左壁にぶつかった際の処理
  for(let row=19;row>=0;row--){
    if(cells[row][0].blocknum === fallingBlockNum){
      return;
    }
  }
  //左側に既にブロックがある場合の処理
  for(let row=19;row>=0;row--){
    for(let col=0;col<10;col++){
      if(cells[row][col].blocknum === fallingBlockNum){
        if(cells[row][col-1].className !== "" && cells[row][col-1].blocknum !== fallingBlockNum){
          return;
        }
      }
    }
  }
  //左にシフト
  for(let row=0;row<20;row++){
    for(let col=0;col<10;col++){
      if(cells[row][col].blocknum === fallingBlockNum){
        cells[row][col-1].className = cells[row][col].className;
        cells[row][col-1].blocknum = cells[row][col].blocknum;
        cells[row][col].className = "";
        cells[row][col].blocknum = null;
      }
    }
  }
}

function moveRight(){
  //右壁にぶつかった際の処理
  for(let i=19;i>=0;i--){
    if(cells[i][9].blocknum === fallingBlockNum){
      return;
    }
  }
  //右側に既にブロックがある場合の処理
  for(let row=19;row>=0;row--){
    for(let col=9;col>=0;col--){
      if(cells[row][col].blocknum === fallingBlockNum){
        if(cells[row][col+1].className !== "" && cells[row][col+1].blocknum !== fallingBlockNum){
          return;
        }
      }
    }
  }
  //右にシフト
  for(let row=0;row<20;row++){
    for(let col=9;col>=0;col--){
      if(cells[row][col].blocknum === fallingBlockNum){
        cells[row][col+1].className = cells[row][col].className;
        cells[row][col+1].blocknum = cells[row][col].blocknum;
        cells[row][col].className = "";
        cells[row][col].blocknum = null;
      }
    }
  }
}
//下に落とす
function moveDown(){
  fallBlock();
}
//回転
function Rotate(){
  let currow;
  let curcol;
  outloop:
    for(let row=19;row>=0;row--){
      for(let col=0;col<10;col++){
        if(cells[row][col].blocknum === fallingBlockNum){
          currow = row;
          curcol = col;
          break outloop;
        }
      }
    }

    switch (cells[currow][curcol].className){
      case "i":
        //curcolが9の時は棒が縦状態で右端にいるときのみ
        if(curcol == 9){
          cells[currow-3][curcol-3].className = cells[currow][curcol].className;
          cells[currow-3][curcol-3].blocknum = cells[currow][curcol].blocknum;
          cells[currow][curcol].className = "";
          cells[currow][curcol].blocknum = null;
          cells[currow-3][curcol-2].className = cells[currow-1][curcol].className;
          cells[currow-3][curcol-2].blocknum = cells[currow-1][curcol].blocknum;
          cells[currow-1][curcol].className = "";
          cells[currow-1][curcol].blocknum = null;
          cells[currow-3][curcol-1].className = cells[currow-2][curcol].className;
          cells[currow-3][curcol-1].blocknum = cells[currow-2][curcol].blocknum;
          cells[currow-2][curcol].className = "";
          cells[currow-2][curcol].blocknum = null;
        } else{
            //横棒状態の時
            if(cells[currow][curcol+1].blocknum === fallingBlockNum){
              //回転時天井に当たる
              switch (currow-3) {
                case -3:
                  cells[1][curcol+1].className = cells[currow][curcol].className;
                  cells[1][curcol+1].blocknum = cells[currow][curcol].blocknum;
                  cells[currow][curcol].className = "";
                  cells[currow][curcol].blocknum = null;
                  cells[2][curcol+1].className = cells[currow][curcol+2].className;
                  cells[2][curcol+1].blocknum = cells[currow][curcol+2].blocknum;
                  cells[currow][curcol+2].className = "";
                  cells[currow][curcol+2].blocknum = null;
                  cells[3][curcol+1].className = cells[currow][curcol+3].className;
                  cells[3][curcol+1].blocknum = cells[currow][curcol+3].blocknum;
                  cells[currow][curcol+3].className = "";
                  cells[currow][curcol+3].blocknum = null;
                  break;
                case -2:
                  cells[0][curcol+1].className = cells[currow][curcol].className;
                  cells[0][curcol+1].blocknum = cells[currow][curcol].blocknum;
                  cells[currow][curcol].className = "";
                  cells[currow][curcol].blocknum = null;
                  cells[2][curcol+1].className = cells[currow][curcol+2].className;
                  cells[2][curcol+1].blocknum = cells[currow][curcol+2].blocknum;
                  cells[currow][curcol+2].className = "";
                  cells[currow][curcol+2].blocknum = null;
                  cells[3][curcol+1].className = cells[currow][curcol+3].className;
                  cells[3][curcol+1].blocknum = cells[currow][curcol+3].blocknum;
                  cells[currow][curcol+3].className = "";
                  cells[currow][curcol+3].blocknum = null;
                  break;
                case -1:
                  cells[0][curcol+1].className = cells[currow][curcol].className;
                  cells[0][curcol+1].blocknum = cells[currow][curcol].blocknum;
                  cells[currow][curcol].className = "";
                  cells[currow][curcol].blocknum = null;
                  cells[1][curcol+1].className = cells[currow][curcol+2].className;
                  cells[1][curcol+1].blocknum = cells[currow][curcol+2].blocknum;
                  cells[currow][curcol+2].className = "";
                  cells[currow][curcol+2].blocknum = null;
                  cells[3][curcol+1].className = cells[currow][curcol+3].className;
                  cells[3][curcol+1].blocknum = cells[currow][curcol+3].blocknum;
                  cells[currow][curcol+3].className = "";
                  cells[currow][curcol+3].blocknum = null;
                  break;
                default:
                //通常回転
                  cells[currow-3][curcol+1].className = cells[currow][curcol].className;
                  cells[currow-3][curcol+1].blocknum = cells[currow][curcol].blocknum;
                  cells[currow][curcol].className = "";
                  cells[currow][curcol].blocknum = null;
                  cells[currow-2][curcol+1].className = cells[currow][curcol+2].className;
                  cells[currow-2][curcol+1].blocknum = cells[currow][curcol+2].blocknum;
                  cells[currow][curcol+2].className = "";
                  cells[currow][curcol+2].blocknum = null;
                  cells[currow-1][curcol+1].className = cells[currow][curcol+3].className;
                  cells[currow-1][curcol+1].blocknum = cells[currow][curcol+3].blocknum;
                  cells[currow][curcol+3].className = "";
                  cells[currow][curcol+3].blocknum = null;
                  break;
             }

            }
            //縦棒状態のとき
            else {
              switch (curcol) {
                //左端にいる
                case 0:
                  cells[currow-3][curcol+3].className = cells[currow][curcol].className;
                  cells[currow-3][curcol+3].blocknum = cells[currow][curcol].blocknum;
                  cells[currow][curcol].className = "";
                  cells[currow][curcol].blocknum = null;
                  cells[currow-3][curcol+2].className = cells[currow-1][curcol].className;
                  cells[currow-3][curcol+2].blocknum = cells[currow-1][curcol].blocknum;
                  cells[currow-1][curcol].className = "";
                  cells[currow-1][curcol].blocknum = null;
                  cells[currow-3][curcol+1].className = cells[currow-2][curcol].className;
                  cells[currow-3][curcol+1].blocknum = cells[currow-2][curcol].blocknum;
                  cells[currow-2][curcol].className = "";
                  cells[currow-2][curcol].blocknum = null;
                  break;
                //右端から1つ左にいる
                case 8:
                  cells[currow-2][curcol-2].className = cells[currow][curcol].className;
                  cells[currow-2][curcol-2].blocknum = cells[currow][curcol].blocknum;
                  cells[currow][curcol].className = "";
                  cells[currow][curcol].blocknum = null;
                  cells[currow-2][curcol-1].className = cells[currow-1][curcol].className;
                  cells[currow-2][curcol-1].blocknum = cells[currow-1][curcol].blocknum;
                  cells[currow-1][curcol].className = "";
                  cells[currow-1][curcol].blocknum = null;
                  cells[currow-2][curcol+1].className = cells[currow-3][curcol].className;
                  cells[currow-2][curcol+1].blocknum = cells[currow-3][curcol].blocknum;
                  cells[currow-3][curcol].className = "";
                  cells[currow-3][curcol].blocknum = null;
                  break;
                default:
                  cells[currow-2][curcol-1].className = cells[currow][curcol].className;
                  cells[currow-2][curcol-1].blocknum = cells[currow][curcol].blocknum;
                  cells[currow][curcol].className = "";
                  cells[currow][curcol].blocknum = null;
                  cells[currow-2][curcol+1].className = cells[currow-1][curcol].className;
                  cells[currow-2][curcol+1].blocknum = cells[currow-1][curcol].blocknum;
                  cells[currow-1][curcol].className = "";
                  cells[currow-1][curcol].blocknum = null;
                  cells[currow-2][curcol+2].className = cells[currow-3][curcol].className;
                  cells[currow-2][curcol+2].blocknum = cells[currow-3][curcol].blocknum;
                  cells[currow-3][curcol].className = "";
                  cells[currow-3][curcol].blocknum = null;
            }
          }
        }
        break;
      case "t":
        // ■
        //■■■
        if(cells[currow-1][curcol].className == ""){
          cells[currow+1][curcol+1].className = cells[currow][curcol].className;
          cells[currow+1][curcol+1].blocknum = cells[currow][curcol].blocknum;
          cells[currow][curcol].className = "";
          cells[currow][curcol].blocknum = null;
        }
        //■■■
        // ■
        else if(cells[currow-2][curcol].className == ""){
          cells[currow-2][curcol].className = cells[currow-1][curcol+1].className;
          cells[currow-2][curcol].blocknum = cells[currow-1][curcol+1].blocknum;
          cells[currow-1][curcol+1].className = "";
          cells[currow-1][curcol+1].blocknum = null;
        } else{
          switch (curcol) {
            //■
            //■■
            //■
            //左端にいる場合
            case 0:
              cells[currow][curcol+1].className = cells[currow][curcol].className;
              cells[currow][curcol+1].blocknum = cells[currow][curcol].blocknum;
              cells[currow][curcol].className = "";
              cells[currow][curcol].blocknum = null;
              cells[currow-1][curcol+2].className = cells[currow-2][curcol].className;
              cells[currow-1][curcol+2].blocknum = cells[currow-2][curcol].blocknum;
              cells[currow-2][curcol].className = "";
              cells[currow-2][curcol].blocknum = null;
              break;
            // ■
            //■■
            // ■
            //右端にいる場合
            case 9:
              cells[currow-1][curcol-2].className = cells[currow][curcol].className;
              cells[currow-1][curcol-2].blocknum = cells[currow][curcol].blocknum;
              cells[currow][curcol].className = "";
              cells[currow][curcol].blocknum = null;
              cells[currow][curcol-1].className = cells[currow-2][curcol].className;
              cells[currow][curcol-1].blocknum = cells[currow-2][curcol].blocknum;
              cells[currow-2][curcol].className = "";
              cells[currow-2][curcol].blocknum = null;
              break;
            default:
              //■
              //■■
              //■
              if(cells[currow-1][curcol+1].className !== ""){
                cells[currow-1][curcol-1].className = cells[currow-2][curcol].className;
                cells[currow-1][curcol-1].blocknum = cells[currow-2][curcol].blocknum;
                cells[currow-2][curcol].className = "";
                cells[currow-2][curcol].blocknum = null;
              }
              // ■
              //■■
              // ■
              else{
                cells[currow-1][curcol+1].className = cells[currow][curcol].className;
                cells[currow-1][curcol+1].blocknum = cells[currow][curcol].blocknum;
                cells[currow][curcol].className = "";
                cells[currow][curcol].blocknum = null;
              }

          }
        }
        break;
      case "s":
        // ■■
        //■■
        if(cells[currow-1][curcol].blocknum !== fallingBlockNum){
          cells[currow][curcol+2].className = cells[currow][curcol].className;
          cells[currow][curcol+2].blocknum = cells[currow][curcol].blocknum;
          cells[currow][curcol].className = "";
          cells[currow][curcol].blocknum = null;
          cells[currow+1][curcol+2].className = cells[currow-1][curcol+2].className;
          cells[currow+1][curcol+2].blocknum = cells[currow-1][curcol+2].blocknum;
          cells[currow-1][curcol+2].className = "";
          cells[currow-1][curcol+2].blocknum = null;
        }else{
          //■
          //■■
          // ■
          //右端にいる場合
          if(curcol == 9){
            cells[currow][curcol-1].className = cells[currow][curcol].className;
            cells[currow][curcol-1].blocknum = cells[currow][curcol].blocknum;
            cells[currow][curcol].className = "";
            cells[currow][curcol].blocknum = null;
            cells[currow][curcol-2].className = cells[currow-2][curcol-1].className;
            cells[currow][curcol-2].blocknum = cells[currow-2][curcol-1].blocknum;
            cells[currow-2][curcol-1].className = "";
            cells[currow-2][curcol-1].blocknum = null;
          }
          //それ以外の場所にいる
          else{
            cells[currow][curcol-1].className = cells[currow-1][curcol-1].className;
            cells[currow][curcol-1].blocknum = cells[currow-1][curcol-1].blocknum;
            cells[currow-1][curcol-1].className = "";
            cells[currow-1][curcol-1].blocknum = null;
            cells[currow-1][curcol+1].className = cells[currow-2][curcol-1].className;
            cells[currow-1][curcol+1].blocknum = cells[currow-2][curcol-1].blocknum;
            cells[currow-2][curcol-1].className = "";
            cells[currow-2][curcol-1].blocknum = null;
          }
        }
        break;
      case "z":
        //■■
        // ■■
        if(cells[currow][curcol+1].blocknum == fallingBlockNum){
          cells[currow-1][curcol+1].className = cells[currow-1][curcol].className;
          cells[currow-1][curcol+1].blocknum = cells[currow-1][curcol].blocknum;
          cells[currow-1][curcol].className = "";
          cells[currow-1][curcol].blocknum = null;
          cells[currow+1][curcol].className = cells[currow-1][curcol-1].className;
          cells[currow+1][curcol].blocknum = cells[currow-1][curcol-1].blocknum;
          cells[currow-1][curcol-1].className = "";
          cells[currow-1][curcol-1].blocknum = null;
        }else{
          // ■
          //■■
          //■
          //左端にいる場合
          if(curcol == 0){
            cells[currow][curcol+1].className = cells[currow][curcol].className;
            cells[currow][curcol+1].blocknum = cells[currow][curcol].blocknum;
            cells[currow][curcol].className = "";
            cells[currow][curcol].blocknum = null;
            cells[currow][curcol+2].className = cells[currow-2][curcol+1].className;
            cells[currow][curcol+2].blocknum = cells[currow-2][curcol+1].blocknum;
            cells[currow-2][curcol+1].className = "";
            cells[currow-2][curcol+1].blocknum = null;
          }
          //それ以外の場所にいる
          else{
            cells[currow][curcol+1].className = cells[currow-1][curcol+1].className;
            cells[currow][curcol+1].blocknum = cells[currow-1][curcol+1].blocknum;
            cells[currow-1][curcol+1].className = "";
            cells[currow-1][curcol+1].blocknum = null;
            cells[currow-1][curcol-1].className = cells[currow-2][curcol+1].className;
            cells[currow-1][curcol-1].blocknum = cells[currow-2][curcol+1].blocknum;
            cells[currow-2][curcol+1].className = "";
            cells[currow-2][curcol+1].blocknum = null;
          }
        }
        break;
      case "j":
        if(cells[currow-1][curcol].className === ""){
          // ■
          // ■
          //■■
          if(curcol === 8){
            cells[currow][curcol-1].className = cells[currow-1][curcol+1].className;
            cells[currow][curcol-1].blocknum = cells[currow-1][curcol+1].blocknum;
            cells[currow-1][curcol+1].className = "";
            cells[currow-1][curcol+1].blocknum = null;
            cells[currow-1][curcol-1].className = cells[currow-2][curcol+1].className;
            cells[currow-1][curcol-1].blocknum = cells[currow-2][curcol+1].blocknum;
            cells[currow-2][curcol+1].className = "";
            cells[currow-2][curcol+1].blocknum = null;
          }
          else{
            cells[currow-1][curcol].className = cells[currow-1][curcol+1].className;
            cells[currow-1][curcol].blocknum = cells[currow-1][curcol+1].blocknum;
            cells[currow-1][curcol+1].className = "";
            cells[currow-1][curcol+1].blocknum = null;
            cells[currow][curcol+2].className = cells[currow-2][curcol+1].className;
            cells[currow][curcol+2].blocknum = cells[currow-2][curcol+1].blocknum;
            cells[currow-2][curcol+1].className = "";
            cells[currow-2][curcol+1].blocknum = null;
          }

        }else{
          //■■■
          //  ■
          //右端にいる場合
          if(curcol === 9){
            cells[currow+1][curcol].className = cells[currow-1][curcol-1].className;
            cells[currow+1][curcol].blocknum = cells[currow-1][curcol-1].blocknum;
            cells[currow-1][curcol-1].className = "";
            cells[currow-1][curcol-1].blocknum = null;
            cells[currow+1][curcol-1].className = cells[currow-1][curcol-2].className;
            cells[currow+1][curcol-1].blocknum = cells[currow-1][curcol-2].blocknum;
            cells[currow-1][curcol-2].className = "";
            cells[currow-1][curcol-2].blocknum = null;
          }
          //それ以外の場所にいる
          else if(curcol !== 9 && cells[currow][curcol+1].className !== ""){
            cells[currow-1][curcol+1].className = cells[currow][curcol+1].className;
            cells[currow-1][curcol+1].blocknum = cells[currow][curcol+1].blocknum;
            cells[currow][curcol+1].className = "";
            cells[currow][curcol+1].blocknum = null;
            cells[currow+1][curcol].className = cells[currow][curcol+2].className;
            cells[currow+1][curcol].blocknum = cells[currow][curcol+2].blocknum;
            cells[currow][curcol+2].className = "";
            cells[currow][curcol+2].blocknum = null;
          }
          //■■■
          //  ■
          //右端以外の場所にいる場合
          else if(curcol !== 9 && cells[currow-2][curcol].className === ""){
            cells[currow-2][curcol].className = cells[currow-1][curcol-1].className;
            cells[currow-2][curcol].blocknum = cells[currow-1][curcol-1].blocknum;
            cells[currow-1][curcol-1].className = "";
            cells[currow-1][curcol-1].blocknum = null;
            cells[currow][curcol-1].className = cells[currow-1][curcol-2].className;
            cells[currow][curcol-1].blocknum = cells[currow-1][curcol-2].blocknum;
            cells[currow-1][curcol-2].className = "";
            cells[currow-1][curcol-2].blocknum = null;
          }else{
            //■■
            //■
            //■
            //右端にいる場合
            if(curcol === 8){
              cells[currow-1][curcol+1].className = cells[currow][curcol].className;
              cells[currow-1][curcol+1].blocknum = cells[currow][curcol].blocknum;
              cells[currow][curcol].className = "";
              cells[currow][curcol].blocknum = null;
              cells[currow-2][curcol-1].className = cells[currow-1][curcol].className;
              cells[currow-2][curcol-1].blocknum = cells[currow-1][curcol].blocknum;
              cells[currow-1][curcol].className = "";
              cells[currow-1][curcol].blocknum = null;
            }else{
              cells[currow-2][curcol+2].className = cells[currow][curcol].className;
              cells[currow-2][curcol+2].blocknum = cells[currow][curcol].blocknum;
              cells[currow][curcol].className = "";
              cells[currow][curcol].blocknum = null;
              cells[currow-1][curcol+2].className = cells[currow-1][curcol].className;
              cells[currow-1][curcol+2].blocknum = cells[currow-1][curcol].blocknum;
              cells[currow-1][curcol].className = "";
              cells[currow-1][curcol].blocknum = null;
            }
          }
        }
        break;
      case "l":
      　//■■
        // ■
        // ■
        //右端にいる
        if(curcol == 9){
          cells[currow-1][curcol-1].className = cells[currow][curcol].className;
          cells[currow-1][curcol-1].blocknum = cells[currow][curcol].blocknum;
          cells[currow][curcol].className = "";
          cells[currow][curcol].blocknum = null;
          cells[currow-1][curcol-2].className = cells[currow-2][curcol-1].className;
          cells[currow-1][curcol-2].blocknum = cells[currow-2][curcol-1].blocknum;
          cells[currow-2][curcol-1].className = "";
          cells[currow-2][curcol-1].blocknum = null;
        }
        //  ■
        //■■■
        else if(cells[currow][curcol+1].blocknum == fallingBlockNum && cells[currow-1][curcol].blocknum !== fallingBlockNum){
          cells[currow+1][curcol+1].className = cells[currow][curcol].className;
          cells[currow+1][curcol+1].blocknum = cells[currow][curcol].blocknum;
          cells[currow][curcol].className = "";
          cells[currow][curcol].blocknum = null;
          cells[currow-1][curcol+1].className = cells[currow-1][curcol+2].className;
          cells[currow-1][curcol+1].blocknum = cells[currow-1][curcol+2].blocknum;
          cells[currow-1][curcol+2].className = "";
          cells[currow-1][curcol+2].blocknum = null;
          cells[currow+1][curcol+2].className = cells[currow][curcol+2].className;
          cells[currow+1][curcol+2].blocknum = cells[currow][curcol+2].blocknum;
          cells[currow][curcol+2].className = "";
          cells[currow][curcol+2].blocknum = null;
        }
        //■■■
        //■
        else if((currow == 1) || (currow !== 1 && cells[currow-2][curcol].blocknum !== fallingBlockNum)){
          cells[currow][curcol+1].className = cells[currow][curcol].className;
          cells[currow][curcol+1].blocknum = cells[currow][curcol].blocknum;
          cells[currow][curcol].className = "";
          cells[currow][curcol].blocknum = null;
          cells[currow+1][curcol+1].className = cells[currow-1][curcol+2].className;
          cells[currow+1][curcol+1].blocknum = cells[currow-1][curcol+2].blocknum;
          cells[currow-1][curcol+2].className = "";
          cells[currow-1][curcol+2].blocknum = null;
        }
        //■
        //■
        //■■
        //左端にいる
        else if(curcol == 0){
          cells[currow-2][curcol+1].className = cells[currow][curcol].className;
          cells[currow-2][curcol+1].blocknum = cells[currow][curcol].blocknum;
          cells[currow][curcol].className = "";
          cells[currow][curcol].blocknum = null;
          cells[currow-2][curcol+2].className = cells[currow][curcol+1].className;
          cells[currow-2][curcol+2].blocknum = cells[currow][curcol+1].blocknum;
          cells[currow][curcol+1].className = "";
          cells[currow][curcol+1].blocknum = null;
        }
        //■
        //■
        //■■
        //左端以外の場所
        else if(cells[currow][curcol+1].blocknum == fallingBlockNum){
          cells[currow-2][curcol+1].className = cells[currow][curcol].className;
          cells[currow-2][curcol+1].blocknum = cells[currow][curcol].blocknum;
          cells[currow][curcol].className = "";
          cells[currow][curcol].blocknum = null;
          cells[currow-1][curcol-1].className = cells[currow-1][curcol].className;
          cells[currow-1][curcol-1].blocknum = cells[currow-1][curcol].blocknum;
          cells[currow-1][curcol].className = "";
          cells[currow-1][curcol].blocknum = null;
          cells[currow-2][curcol-1].className = cells[currow][curcol+1].className;
          cells[currow-2][curcol-1].blocknum = cells[currow][curcol+1].blocknum;
          cells[currow][curcol+1].className = "";
          cells[currow][curcol+1].blocknum = null;
        }
          //■■
          // ■
          // ■
          //右端以外にいる
          else{
          cells[currow-1][curcol+1].className = cells[currow][curcol].className;
          cells[currow-1][curcol+1].blocknum = cells[currow][curcol].blocknum;
          cells[currow][curcol].className = "";
          cells[currow][curcol].blocknum = null;
          cells[currow-1][curcol-1].className = cells[currow-2][curcol-1].className;
          cells[currow-1][curcol-1].blocknum = cells[currow-2][curcol-1].blocknum;
          cells[currow-2][curcol-1].className = "";
          cells[currow-2][curcol-1].blocknum = null;
          cells[currow-2][curcol+1].className = cells[currow-2][curcol].className;
          cells[currow-2][curcol+1].blocknum = cells[currow-2][curcol].blocknum;
          cells[currow-2][curcol].className = "";
          cells[currow-2][curcol].blocknum = null;
        }

        break;
    }
}
//揃った行を消す
function deleterow(){
  let deletflg;
  for(let row=19;row>=0;row--){
    deletflg = true;
    for(let col=0;col<10;col++){
      if(cells[row][col].className === ""){
        deletflg =false;
      }
    }
    if(deletflg){
      for(let i=row;i>=0;i--){
        for(let j=0;j<10;j++){
          cells[i][j].className = cells[i-1][j].className;
          cells[i][j].blocknum = cells[i-1][j].blocknum;
        }
      }

    }

  }
}

//盤面を初期化する
function initialize(){
  for(let row=19;row>=0;row--){
    for(let col=0;col<10;col++){
      cells[row][col].className = "";
      cells[row][col].blocknum = null;
    }
  }
}

//モード選択
function Modeselect(mode){
  switch (mode) {
    case 0:
      intevaltime = 500;
      break;
    case 1:
      intevaltime = 200;
      break;
    case 2:
      intevaltime = 100;
      break;
    default:
      intevaltime = 500;

  }
}
