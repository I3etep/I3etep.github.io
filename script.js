
  //Global Variables can be accessed from inside or outside of any function or method, 
//they are generally frowned upon but are used a lot in games.
//window.addEventListener('resize', resizeGame, false);
//window.addEventListener('orientationchange', resizeGame, false);
//resizeGame();
var rad;
var stopped = true;
var count =0;
var mousePos;
var basicChanceAppearance = 200;
var ChanceOfNewFields = 50;
var ChanceOfDecreaseSize =200;
var y= 0;
var x= 0;
var level ;
var status = -1; // -1: stopped  , 0 In play    
var playerImage = new Image(); 
playerImage.src = "player.png";
var exit= new Image();
exit.src = "exit.png";
var fps = 15;
var requestId;
var gameArea,canvas, context;
var cols = 5;
var rows = 5;


function sprite (options) {
				
    var that = {};
					
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;

    return that;
}


function  Field() {
this.size = null;
this.draw = function(i,j,size){
    this.size = size;
    context.beginPath();
    context.arc(canvas.width/cols/2 + canvas.width/cols*i , canvas.height/rows/2+ canvas.height/rows*j, size, 0, 2 * Math.PI);
    context.fillStyle="#99cc00";
    context.strokeStyle="green";
  };
}

var fields = new Array(cols);
for (var i = 0; i < cols; i++){
        fields[i]= new Array(rows);
    for (var j = 0; j < rows; j++){
        fields[i][j]= new Field();
        //console.log(fields[i][j].size);
    }}
/////////////////////////////////////////
 
init();


var player = sprite({
    context: context,
    x:0,
    y:0,
    width: 20,
    height: 20,
    image: playerImage
});

var backg_x = canvas.width/cols/2+canvas.width/cols*(cols-1)+x-10;
var backg_y = canvas.height/rows/2+y-10;
player.x =  canvas.width/cols/2-player.width/2;
player.y =  canvas.height/rows/2+canvas.height/rows*(rows-1)-player.height/2;

fieldsInit(fields);
drawPlayer(player.x,player.y);
    
    

function init() {
    gameArea = document.getElementById('gameArea');
    canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 600;
    context = canvas.getContext( '2d' );
    
    
    canvas.addEventListener('mousemove', handleMousemove, false);
    canvas.addEventListener('mousedown', handleMousedown, false);
    canvas.addEventListener('mouseup', handleMouseup, false);
    window.addEventListener('keydown', handleKeydown, false);
    window.addEventListener('keyup', handleKeyup, false);
    //requestId = requestAnimationFrame(animate); 

}
////////////////////////////////////////
 
function animate() {
   if (!stopped) {
    setTimeout(function() {
        //CLEAR
        context.clearRect(0, 0, canvas.width,canvas.height);
        
        //DRAW
        fieldsDraw(fields);
        context.drawImage(player.image, player.x, player.y,player.width,player.height);
        context.drawImage(exit, backg_x, backg_y);
        //drawPlayer(x,y);
       //drawPlayer(player.x,player,y);
        //MOVE
        //console.log(player.x+";"+player.y+";"+x+";"+y);
        //drawPlayer(x,y);
        //player.x =  canvas.width/cols/2-player.width/2+x;
        //player.y =  canvas.height/rows/2+canvas.height/rows*(rows-1)-player.height/2+y;
        
        //CHECK
        check(player,fields);
        
        /*
        if(mousePos !== undefined) {
        player.x = mousePos.x;
        player.y = mousePos.y;
        console.log(mousePos.x);
     }
     */
      
      
        
        requestId = requestAnimationFrame(animate);
    }, 1000 / fps);
}
}
////////////////////////////////////////

function fieldsInit(fields){
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++){
            var r = randomInteger(0, 1000);  
            if ( ((i===0) && (j===(rows-1))) || ((i===(cols-1))&& (j===0))){
                rad = 25;
                fields[i][j].draw(i,j,rad);
            }
            else if (r<basicChanceAppearance){
                rad = 25;
                fields[i][j].draw(i,j,rad);
            }
            else 
                rad=0;
                fields[i][j].draw(i,j,rad);
        //console.log("fields["+i+"]["+j+"]="+fields[i][j].size);
         context.fill();
         context.stroke(); 
        }   
    }
    context.drawImage(player.image,50, 56,20,20);
}

function fieldsDraw(fields){
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++){
            var r = randomInteger(0, 10000);  
            //console.log("before:"+fields[0][1].size);
//exit field
            if ( (i===(cols-1)) && (j===0)){
                rad = 25;
                fields[i][j].draw(i,j,rad);
            }
//new field            
            else if (fields[i][j].size===0 && r<ChanceOfNewFields)  {
                rad = 25;
                fields[i][j].draw(i,j,rad);
            }
//decrease size
            else if (r<ChanceOfDecreaseSize && fields[i][j].size>0) {
                rad = fields[i][j].size-5 ;
                fields[i][j].draw(i,j,rad);
        }
//safe current state
            else 
                rad = fields[i][j].size ;
                fields[i][j].draw(i,j,rad);
                //console.log("fields["+i+"]["+j+"]="+fields.size);
         context.fill();
         context.stroke(); 
        }  
    }
}
function draw() {
player.x =  canvas.width/cols/2-player.width/2+x;
player.y =  canvas.height/rows/2+canvas.height/rows*(rows-1)-player.height/2+y;
//console.log(destX+";"+destY+"  "+"bx"+backg_x+";by "+backg_y);
context.drawImage(exit, backg_x, backg_y);
context.drawImage(player.image, player.x, player.y,player.width,player.height);
 ///
check(player,fields);
}
//////////////////////////////////////////////////////////////////////////////

function drawPlayer(x,y){
//player.x =  canvas.width/cols/2-player.width/2+x;
//player.y =  canvas.height/rows/2+canvas.height/rows*(rows-1)-player.height/2+y;

//context.drawImage(exit, backg_x, backg_y);
//context.drawImage(player.image, player.x, player.y,player.width,player.height);
 ///
//check(player,fields);
    
context.save();
playerImage.onload = function () {
    context.drawImage(player.image,x,y,player.width,player.height);
};
context.restore();
    
}
function check(player,fields){
    //check win
    if (player.x===backg_x && player.y===backg_y ){
        drawText("You Win!");
    //document.write("OK");
    }
    
       
     var a= Math.floor(player.x/(canvas.width/cols));
     var b= Math.floor(player.y/(canvas.height/rows));
    
    if (fields[a][b].size===0) drawText("Game Over");
    
}
function start() {
 // Start the animation loop, targets 60 frames/s
 requestId = requestAnimationFrame(animate);
 stopped = false;
}

function stop() {
   if (requestId) {
      cancelAnimationFrame(requestId);
   }
   stopped = true;
}

function resizeGame() {
    var gameArea = document.getElementById('gameArea');
    var widthToHeight = 4 / 3;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight; 
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }
     
    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
     
    var canvas = document.getElementById('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
}
 
function randomInteger(min, max) {
  var rand = min + Math.random() * (max - min);
  rand = Math.round(rand);
  return rand;
}


function writeMessage(canvas, message) {
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
    context.restore();
}
function handleMousemove(evt) {
  // The mousePos will be taken into account in the animationLoop
  mousePos = getMousePos(canvas, evt);
}

function handleMousedown(evt) {
    var ma= Math.floor(mousePos.x/(canvas.width/cols));
    var mb= Math.floor(mousePos.y/(canvas.height/rows));
    var pa= Math.floor(player.x/(canvas.width/cols));
    var pb= Math.floor(player.y/(canvas.height/rows));
    //console.log("p="+pa+";m="+ma);
    if (ma-pa===-1 && mb===pb && (player.x>=canvas.width/cols) ) {
        player.x-=canvas.width/cols;
    }
    else if (ma-pa===1 && mb===pb && (player.x<canvas.width/cols*(cols-1)) ) { 
        player.x+=canvas.width/cols;
    }
    else if (mb-pb===-1 && ma===pa && (player.y>canvas.height/rows) ) {
        player.y-=canvas.height/rows;
    }
    else if (mb-pb===1 && ma===pa && (player.y<canvas.height/rows*(rows-1)) ) player.y+=canvas.height/rows;
    
  
}

function handleMouseup(evt) {
  incrementAngle = 0;
}

function getMousePos(canvas, evt) {
 // necessary to take into account CSS boudaries
 var rect = canvas.getBoundingClientRect();
 return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
 };
}

function handleKeydown(e) {
    if (!stopped){
        switch (e.keyCode) {
        
        case 37: //left
            if (player.x>=canvas.width/cols)
            player.x-=canvas.width/cols;
        //console.log("X="+player.x+"; Y="+player.y+" bX="+backg_x+"; bY="+backg_y);
            break;
        case 39://right
            if (player.x<canvas.width/cols*(cols-1))
            player.x+=canvas.width/cols;
        //console.log("X="+player.x+"; Y="+player.y+" bX="+backg_x+"; bY="+backg_y);
            break;
        case 38: //up
        if (player.y>canvas.height/rows)
        player.y-=canvas.height/rows;
      //console.log("X="+player.x+"; Y="+player.y+" bX="+backg_x+"; bY="+backg_y);
        break;
        case 40://down
            if(player.y<canvas.height/rows*(rows-1))
            player.y+=canvas.height/rows;
        //console.log("X="+player.x+"; Y="+player.y+" bX="+backg_x+"; bY="+backg_y);
            break;
        }
    }
 }
 function handleKeyup(evt) {
    incrementX = 0;
 }
 
 
function drawText(text){
  context.save();
  context.translate(canvas.width/2, canvas.height/2);
 
  context.font = "bold 60px Verdana";
    
// Create gradient
var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop("0", "#99FF66");
gradient.addColorStop("0.5", "#66CC00");
gradient.addColorStop("1.0", "#66CC33");
// Fill with gradient
context.fillStyle = gradient;
context.textAlign="center"; 
context.fillText(text, 0, 0);
context.restore();    
}