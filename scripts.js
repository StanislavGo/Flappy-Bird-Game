let canvas = document.getElementById("game-zone");
let context = canvas.getContext("2d");

let player = new Image();
let background = new Image();
let grass = new Image();
let topPipe = new Image();
let bottomPipe = new Image();

player.src = "img/bird.png";
background.src = "img/bg-photo.png";
grass.src = "img/grass.png";
topPipe.src = "img/top-pipe.png";
bottomPipe.src = "img/bottom-pipe.png";

let gap = 100;

let posPlayerX = 10;
let posPlayerY = 140;
let grav = 1.5;
let finalscore = 0;


// CREATE BLOCK

const pipe = [];

pipe[0] = {
    x : canvas.width,
    y : 0
};

let gameIsStarted = true;
let gotEnoughScore = false; 

// SOUNDS

let fly = new Audio();
let s_audio = new Audio();
fly.src = "audio/fly.mp3";
s_audio.src = "audio/score.mp3";


function playerUp() {
    if (gameIsStarted == true && gotEnoughScore == false) {
        posPlayerY -= 25;
        fly.play();
    }
}

document.addEventListener("keydown", playerUp);

function stopGame() {
    gameIsStarted = false;
    document.querySelector(".finalBlock").style.display = "block";
    addInfoInLocalStorage();
}

function playerWon() {
    document.querySelector('.ifPlayerGotEnoughScore').style.display = "block";
    gotEnoughScore = true;
    addInfoInLocalStorage();
}

function addInfoInLocalStorage() {
    const resultConst = {
        result: finalscore
    };

    let results = JSON.parse(localStorage.getItem('result')) || [];
    results.push(resultConst);

    localStorage.setItem('result', JSON.stringify(results));
}

let fixProblem = 1;

function addElementsOnScreen() {
    context.drawImage(background, 0, 0);

    for (let i = 0; i < pipe.length; i++) {
        if (gotEnoughScore == false) {
            if (gameIsStarted == true) {
                context.drawImage(topPipe, pipe[i].x, pipe[i].y);
                context.drawImage(bottomPipe, pipe[i].x, pipe[i].y + topPipe.height + gap);
        
                pipe[i].x--;    
            }
    
            if (pipe[i].x == 100) {
                pipe.push({
                    x : canvas.width,
                    y : Math.floor(Math.random() * topPipe.height) - topPipe.height
                });
            }
    
            if (posPlayerX + player.width >= pipe[i].x 
                && posPlayerX <= pipe[i].x + topPipe.width 
                && (posPlayerY <= pipe[i].y + topPipe.height 
                || posPlayerY + player.height >= pipe[i].y + topPipe.height +
                    gap) || posPlayerY + player.height >= canvas.height - grass.height) {
                        if (fixProblem == 1) {
                            stopGame();
                            fixProblem = 2;
                            console.log(1);
                        }
            }
            if(pipe[i].x == 5) {
                finalscore++;
                s_audio.play();
                document.querySelector('.finalScore').innerText = finalscore;
            }    
        }
        if (finalscore == 10 && fixProblem == 1) {
            playerWon();
            fixProblem = 2;
            console.log(1);
        }
    }
    context.fillStyle = "#000";
    context.font = "22px Verdana";
    context.fillText("Score: " + finalscore, 10, 25);

    context.drawImage(grass, 0, canvas.height - grass.height);
    context.drawImage(player, posPlayerX, posPlayerY);
    posPlayerY += grav;
    requestAnimationFrame(addElementsOnScreen);
}

bottomPipe.onload = addElementsOnScreen;