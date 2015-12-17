//Global Variables can be accessed from inside or outside of any function or method, 
//they are generally frowned upon but are used a lot in games.
//window.addEventListener('resize', resizeGame, false);
//window.addEventListener('orientationchange', resizeGame, false);
//resizeGame();
var count =0;
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
var jump = 'rest';
var fps = 10;

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
    context.beginPath();
    context.arc(canvas.width/cols/2 + canvas.width/cols*i , canvas.height/rows/2+ canvas.height/rows*j, size, 0, 2 * Math.PI);
    context.fillStyle="#99cc00";
    context.strokeStyle="green";
    context.fill();
    context.stroke();
 };
};

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


fieldsInit(fields);

animate();
/////////////////////////////////////////
 
function init() {
 
    canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 600;
    gameArea = document.getElementById('gameArea');
    context = canvas.getContext( '2d' );
    //fieldRadius = Math.min(canvas.width/cols,canvas.height/rows)*0.45;
    pic     = new Image();
   
       
  //$( "#container" ).append( canvas );
}
////////////////////////////////////////
 
function animate() {
    setTimeout(function() {
        requestAnimationFrame( animate );
        draw();
    }, 1000 / fps);
}
////////////////////////////////////////

function fieldsInit(fields){
    context.clearRect(0, 0, canvas.width,canvas.height);
    //var fieldRadius = Math.min(canvas.width/cols,canvas.height/rows)*0.45;
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++){
            var r = randomInteger(0, 1000);  
            if ( ((i===0) && (j===(rows-1))) || ((i===(cols-1))&& (j===0))){
                var rad = 25;
                fields[i][j].draw(i,j,rad);
                fields[i][j].size=rad;
            }
//basic amount of fields            
            else if (r<basicChanceAppearance){
                var rad = 25;
                fields[i][j].draw(i,j,rad);
                fields[i][j].size=rad;
            }
            else 
                var rad=0;
                fields[i][j].draw(i,j,rad);
                fields[i][j].size=rad;
        //console.log("fields["+i+"]["+j+"]="+fieldRadius);
        }   
    }
}


function fieldsDraw(fields){
    context.clearRect(0, 0, canvas.width,canvas.height);
    //var fieldRadius = 80;
      
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++){
            var r = randomInteger(0, 10000);  
            //console.log("before:"+fields[0][1].size);
//exit field
            if ( (i===(cols-1)) && (j===0)){
                var rad = 25;
                fields[i][j].draw(i,j,rad);
                fields[i][j].size=rad;
            }
//new field            
            else if (fields[i][j].size===0 && r<ChanceOfNewFields)  {
                var rad = 25;
                fields[i][j].draw(i,j,rad);
                fields[i][j].size=rad;
            }
//decrease size
            else if (r<ChanceOfDecreaseSize && fields[i][j].size>0) {
                var rad = fields[i][j].size-5 ;
                fields[i][j].draw(i,j,rad);
                fields[i][j].size=rad;
        }
//safe current state
            else 
                var rad = fields[i][j].size ;
                fields[i][j].draw(i,j,rad);
                fields[i][j].size=rad;
            //if (i===0&&j===2) console.log(fields[i][j]+" i:"+i+" j:"+j);
        //console.log("fields["+i+"]["+j+"]="+fields.size);
        }  
    }
}
function draw() {

document.onkeydown = function(e) {
    switch (e.keyCode) {
        
        case 37: //left
            if (player.x>=canvas.width/cols)
            x-=canvas.width/cols;
        
        //console.log();
            break;
        case 38:
            if (player.y>canvas.height/rows)
            y-=canvas.height/rows;
            //console.log(y+" "+canvas.height/rows);
            break;
        case 39:
            if (player.x<canvas.width/cols*(cols-1))
            x+=canvas.width/cols;
        //console.log("x:"+x+" ; y:"+y+"H:"+canvas.height+" ; W:"+canvas.height);
            break;
        case 40:
            if(player.y<canvas.height/rows*(rows-1))
            y+=canvas.height/rows;
        //console.log("destY:"+destY+" ; y:"+(canvas.height/rows*(rows-1))+" H:"+canvas.height+" ; W:"+canvas.height);
            break;
    }
};


player.x =  canvas.width/cols/2-player.width/2+x;
player.y =  canvas.height/rows/2+canvas.height/rows*(rows-1)-player.height/2+y;
fieldsDraw(fields);
//console.log(destX+";"+destY+"  "+"bx"+backg_x+";by "+backg_y);
context.drawImage(exit, backg_x, backg_y);
context.drawImage(player.image, player.x, player.y,player.width,player.height);
 ///
 check(player,fields);
}
//////////////////////////////////////////////////////////////////////////////
function check(player,fields){
    //check win
    if (player.x===backg_x && player.y===backg_y ){
        console.log("OK");
    //document.write("OK");
    }
     for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++){
            if (player.x === fields[i][j] && fields[i][j].size===0){
                count++;
            }
        }}
       
    //  Math.floor(player.x /canwas.weight/cols)
    //if (count != rows*cols) 
    //console.log("pX:"+player.x+" mFx: "+Math.floor(player.x/(canvas.width/cols))+" pY "+player.y+" mFy:"+Math.floor(player.y/(canvas.height/rows)) );
    var i= Math.floor(player.x/(canvas.width/cols));
    var j= Math.floor(player.y/(canvas.height/rows));
    ////document.write("GAME OVER");
    if (fields[i][j].size===0) console.log("GO");
    
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

