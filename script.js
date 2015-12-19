// TODO animation on death



//window.addEventListener('resize', resizeGame, false);
//window.addEventListener('orientationchange', resizeGame, false);
resizeGame();
var lives =3;
var onDeath = 0; //0:next level, -1: -1 live;
var n=0;
var stopped = true;
var mousePos;
var basicChanceAppearance = 400; //(0..1000)
var ChanceOfNewFields = 30;    // (0..10000)
var ChanceOfDecreaseSize = 30; //(0..10000)
var y = 0;
var x = 0;
var level = 1 ;
var playerImage = new Image();
playerImage.src = "player.png";
var exit= new Image();
exit.src = "exit.png";
var bg= new Image();
bg.src = "boloto.jpg";
var fps = 15;
var requestId;
var gameArea,canvas, context;
var cols = 5;
var rows = 5;

var bulk = "bulk";
var eat = "eat";
var plyuh = "plyuh";
var gameover = "gameover";

loadSound ();


function loadSound (){
    createjs.Sound.registerSound("bulk.mp3", bulk);
    createjs.Sound.registerSound("eat.mp3", eat);
    createjs.Sound.registerSound("plyuh.mp3", plyuh);
    createjs.Sound.registerSound("gameover.mp3", gameover);

}

function playSound (x) {
    createjs.Sound.play(x);
}
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

window.onload = start();
init();


var player = sprite({
    context: context,
    x:0,
    y:0,
    width: 20,
    height: 20,
    image: playerImage
});
var FieldRadius = Math.min(canvas.width/cols,canvas.height/rows)*0.45;
var backg_x = canvas.width/cols/2+canvas.width/cols*(cols-1)+x-10;
var backg_y = canvas.height/rows/2+y-10;
player.x =  canvas.width/cols/2-player.width/2;
player.y =  canvas.height/rows/2+canvas.height/rows*(rows-1)-player.height/2;
drawBG(0,0);
fieldsInit(fields);
drawPlayer(player.x,player.y);



function init() {
    gameArea = document.getElementById('gameArea');
    canvas = document.getElementById('canvas');
    context = canvas.getContext( '2d' );



    canvas.addEventListener('mousemove', handleMousemove, false);
    canvas.addEventListener('mousedown', handleMousedown, false);
    canvas.addEventListener('mouseup', handleMouseup, false);
    window.addEventListener('keydown', handleKeydown, false);
    window.addEventListener('keyup', handleKeyup, false);


}


function animate() {
    if (!stopped) {
        setTimeout(function() {




            //CLEAR
            context.save();
            context.rect(0, 0, canvas.width,canvas.height)
            context.fillStyle = "#e5ffe5";
            context.fill();
            context.restore();
            //DRAW

            fieldsDraw(fields);
            context.drawImage(player.image, player.x, player.y,player.width,player.height);
            context.drawImage(exit, backg_x, backg_y);


            drawText("Lives "+lives+" Level "+level,canvas.width/2,canvas.height);

            //MOVE


            //CHECK
            check();
            if (lives===0){stop()};




            requestId = requestAnimationFrame(animate);
        }, 1000 / fps);
    }
}

function nextlevel(onDeath){
    if (onDeath===0){
        n++;
        cols++;
        rows++;
        level+=1;
        basicChanceAppearance -=n*15;
        ChanceOfNewFields -=n;
        ChanceOfDecreaseSize +=n;
    }



    y= 0;
    x= 0;
    fps = 15;

    fields = new Array(cols);
    for (var i = 0; i < cols; i++){
        fields[i]= new Array(rows);
        for (var j = 0; j < rows; j++){
            fields[i][j]= new Field();

        }}
    FieldRadius = Math.min(canvas.width/cols,canvas.height/rows)*0.45;
    player.x =  canvas.width/cols/2-player.width/2;
    player.y =  canvas.height/rows/2+canvas.height/rows*(rows-1)-player.height/2;
    backg_x = canvas.width/cols/2+canvas.width/cols*(cols-1)+x-10;
    backg_y = canvas.height/rows/2+y-10;

    fieldsInit(fields);
    drawPlayer(player.x,player.y);
    start();
}
function fieldsInit(fields){
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++){
            var r = randomInteger(0, 1000);
            if ( ((i===0) && (j===(rows-1))) || ((i===(cols-1))&& (j===0))){
                fields[i][j].draw(i,j,FieldRadius);
            }
            else if (r<basicChanceAppearance){
                fields[i][j].draw(i,j,FieldRadius);
            }
            else
                fields[i][j].draw(i,j,0);
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
//exit field
            if ( (i===(cols-1)) && (j===0)){
                fields[i][j].draw(i,j,FieldRadius);
            }
//new field
            else if (fields[i][j].size===0 && r<ChanceOfNewFields)  {
                fields[i][j].draw(i,j,FieldRadius);
            }
//decrease size
            else if (r<ChanceOfDecreaseSize && fields[i][j].size>0) {
                if (fields[i][j].size<FieldRadius*0.2 ){
                    var rad =0;
                    playSound ("bulk");
                }
                else {
                    var rad = fields[i][j].size - FieldRadius * 0.2;
                }
                fields[i][j].draw(i,j,rad);
            }
            else
                fields[i][j].draw(i,j,fields[i][j].size);
            context.fill();
            context.stroke();
        }
    }
}

function drawBG(x,y){
    context.save();
    playerImage.onload = function () {
        context.drawImage(bg,x,y);
    };
    context.restore();


}
function drawPlayer(x,y){
    context.save();
    playerImage.onload = function () {
        context.drawImage(player.image,x,y,player.width,player.height);
    };
    context.restore();

}
function check(){
    //check win
    if (Math.floor(player.x)===Math.floor(backg_x) && Math.floor(player.y)===Math.floor(backg_y) ){
        playSound (eat);
        drawText("Congratulations!",canvas.width/2,canvas.height/2);

        alert("click for next level");
        onDeath = 0;
        nextlevel(onDeath);
    }


    var a= Math.floor(player.x/(canvas.width/cols));
    var b= Math.floor(player.y/(canvas.height/rows));
    if (fields[a][b].size===0 && lives===1) {
        playSound(gameover);
        drawText("Game Over",canvas.width/2,canvas.height/2);
        stop();
    }
    else  if (fields[a][b].size===0 && lives!==1){
        playSound(plyuh);
        lives--;
        onDeath = -1;
        drawText("-1 live",canvas.width/2,canvas.height/2);
        nextlevel(onDeath);

    }



}
function start() {
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

function handleMousemove(evt) {
    mousePos = getMousePos(canvas, evt);
}

function handleMousedown(evt) {
    var ma= Math.floor(mousePos.x/(canvas.width/cols));
    var mb= Math.floor(mousePos.y/(canvas.height/rows));
    var pa= Math.floor(player.x/(canvas.width/cols));
    var pb= Math.floor(player.y/(canvas.height/rows));
    if (ma-pa===-1 && mb===pb && (player.x>=canvas.width/cols) ) {
        player.x-=canvas.width/cols;
    }
    else if (ma-pa===1 && mb===pb && (player.x<canvas.width/cols*(cols-1)) ) {
        player.x+=canvas.width/cols;
    }
    else if (mb-pb===-1 && ma===pa && (player.y>canvas.height/rows) ) {
        player.y-=canvas.height/rows;
    }
    else if (mb-pb===1 && ma===pa && (player.y<canvas.height/rows*(rows-1)) ) {
        player.y+=canvas.height/rows;
    }
}

function handleMouseup(evt) {
    incrementAngle = 0;
}

function getMousePos(canvas, evt) {
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
                break;
            case 39://right
                if (player.x<canvas.width/cols*(cols-1))
                    player.x+=canvas.width/cols;
                break;
            case 38: //up
                if (player.y>canvas.height/rows)
                    player.y-=canvas.height/rows;
                break;
            case 40://down
                if(player.y<canvas.height/rows*(rows-1))
                    player.y+=canvas.height/rows;
                break;
        }
    }
}
function handleKeyup(evt) {
    incrementX = 0;
}

function drawText(text,x,y){
    context.save();
    context.translate(x, y);

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
