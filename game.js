let canvas;
let context;
let i=0;
let t=0;
let colorvalue=0;
let position=0;
let rowvalue=0;// stores rowvalue of token
let model={
board:[],
next:0,//0 means blue token 1 means red
}
function verticalcheck (entry,match)
{
  if(model.board[entry]==undefined)
  {
    return(0);
  }
  else if(match==3)//3 matches means player wins
  {
    return(1);
  }
  else if(entry<35)
  {
    if(model.board[entry]==model.board[entry+7])
    {
      match=match+1;
      return(verticalcheck(entry+7,match));
    }
    else
    {
      return(0);
    }

  }
  else
  {
    return (0);
  }
}
function horizontalcheck(entry,matchleft,matchright,row,direction)
{
  if(model.board[entry]==undefined)
  {
      return(0);
  }
  else if((5-(Math.floor(entry/7))!=row))//if all tokens are not in same row return false
  {
      return(0);
  }
  else if(matchright==3||matchleft==3)
  {
      return(1);
  }

  else 
  {
    if(model.board[entry]==model.board[entry+1]&&direction==1)//checking right direction for matches
    {
      matchright=matchright+1;
      return(horizontalcheck(entry+1,matchleft,matchright,row,direction));
    }
    else if(model.board[entry]==model.board[entry-1])//after checking right direction we check left
    {
      direction=0;
      matchleft=matchleft+1;
      return(horizontalcheck(entry-1,matchleft,matchright,row,direction));
    }
    else
    {
        return(0);
    }
    
  }
}

function positivediagnolcheck(entry,matchup,matchdown,direction)//check matches along positive slope diagnol
{
  if(model.board[entry]==undefined)
  {
      return(0);
  }
  else if(entry<3||entry==7||entry==8||entry==14||entry==27||entry==33||entry==34||entry>38)//values that can't be part of postivie diagnol
  {
      return(0);
  }
  else if(matchup==3||matchdown==3)
  {
      return(1);
  }
  
  else
  {
    if(model.board[entry]==model.board[entry-6]&&direction==1)//checking up positive diagnol matches
    {
      matchup=matchup+1;
      return(positivediagnolcheck(entry-6,matchup,matchdown,direction));
    }
    else if(model.board[entry]==model.board[entry+6])//checking down positive diagnol matches
    {
      direction=0;
      matchdown=matchdown+1;
      return(positivediagnolcheck(entry+6,matchup,matchdown,direction));
    }
    else
    {
      return(0);
    }
  }

}
function negativediagnolcheck(entry,matchup,matchdown,direction)//checks matches along negative slope diagnol
{
  if(model.board[entry]==undefined)
  {
      return(0);
  }
  else if(entry==4||entry==5||entry==6||entry==12||entry==13||entry==20||entry==21||entry==28||entry==29||entry==35||entry==36||entry==37)//values can't be part of negative diganol
  {
      return(0);
  }
  else if(matchup==3||matchdown==3)
  {
      return(1);
  }
  else
  {
    if(model.board[entry]==model.board[entry-8]&&direction==1)//checking up negative diagnol matches
    {
      matchup=matchup+1;
      return(negativediagnolcheck(entry-8,matchup,matchdown,direction));
    }
    else if(model.board[entry]==model.board[entry+8])
    {
      direction=0;
      matchdown=matchdown+1;
      return(negativediagnolcheck(entry+8,matchup,matchdown,direction));
    }
    else
    {
      return(0);
    }
  }
}



function drawtoken(locationx, locationy,colorvalue)//helper function to draw tokens
{
  // Taken from https://www.html5canvastutorials.com/tutorials/html5-canvas-circles/
  let canvas = document.getElementById('myCanvas');
  let context = canvas.getContext('2d');
  context.beginPath();
  context.arc(locationx,locationy,50,0,2*Math.PI,false);
  if(colorvalue==0)
  { 
    context.fillStyle = 'blue';

  }
  if (colorvalue==1)
  {
    context.fillStyle='red';
  }
  
  context.fill();
  context.lineWidth=5;
  context.strokeStyle='#003300';
  context.stroke();
}


function tick() {
  window.requestAnimationFrame(splat);
}

function splat(n) {
  let d = n - t;
  t = n;
  context.clearRect(0,0,canvas.width,canvas.height)


  // Taken from https://www.html5canvastutorials.com/tutorials/html5-canvas-lines/
  for(let i = 0;i < 6;i++) {
    context.beginPath();
    context.moveTo(0, 100 + i * 100);
    context.lineTo(700, 100 + i * 100);
    context.strokeStyle = '#000000';
    context.lineWidth = 5;
    context.stroke();
    context.beginPath();
    context.moveTo(100 + i * 100, 0);
    context.lineTo(100 + i * 100, 600);
    context.strokeStyle = '#000000';
    context.lineWidth = 5;
    context.stroke();

  }


   for(let i=0; i<=6; i++){
    for(let j=0; j<=5;j++){
        let me = model.board[(i+(j*7))];
        if(me!=undefined)
        {
          drawtoken((i*100)+50,(j*100)+50,me);
        }
  
        }
      }
tick();
}



document.addEventListener("DOMContentLoaded", () => { 
  canvas = document.querySelector("#myCanvas");
  console.log("Got here");
  context = canvas.getContext("2d");
  console.log(context);
  splat();
})

function roundMe(x){ return Math.ceil((x/100)-1) }

document.addEventListener("click", e => {
  const [i,j] = [e.x,e.y].map(roundMe);
  if (i < 0 || i > 6) return;
  if (j < 0 || j > 5) return;
  const cols=i;
  let rows=0 ;// variable to help keep track of which spots have been filled
  //loop will check if bottom row is filled first than move on to other rows
  do{
    if(model.board[cols+(35-(rows*7))]==undefined)
    {
      model.board[cols+(35-(rows*7))]=model.next;
      position=(cols+(35-(rows*7)));//record position of token
      rowvalue=rows;//stores rowvalue of token
      rows=6;
    }
    else
    {
      rows=rows+1;

    }
  }while(rows<6);

  //Checks to see who won
  if(verticalcheck(position,0)==1||horizontalcheck(position,0,0,rowvalue,1)==1||positivediagnolcheck(position,0,0,1)==1||negativediagnolcheck(position,0,0,1)==1)
  {
    if(model.board[position]==0)
    {
      alert("Blue Wins");
    }
    if(model.board[position]==1)
    {
      alert("Red Wins");
    }
    
  }
  

  if (model.next == 0) {
    model.next = 1;
  } else if (model.next == 1) {
    model.next = 0;
  }

  
  
})
