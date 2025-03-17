let theCanvas = document.getElementById("canvas");
theCanvas.width = window.innerWidth * 0.8;  
theCanvas.height = window.innerHeight * 0.8;  
let ctx = theCanvas.getContext("2d");

document.body.style.backgroundImage = "url('cocina.jpg')";
document.body.style.backgroundSize = "100% 100%";  
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundPosition = "center";
document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.height = "100vh";
document.body.style.margin = "0";
document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.cursor = "url('mata.png') 25 25, auto";

const title = document.createElement("h1");
title.innerText = "Juego Moscas";
title.style.fontSize = "28px";
title.style.fontWeight = "bold";
title.style.color = "black";
title.style.textShadow = "2px 2px 4px #FF4500";
title.style.marginBottom = "5px";
document.body.appendChild(title);

const instructionsDiv = document.createElement("div");
instructionsDiv.innerHTML = "Usa el matamoscas para eliminar las moscas.<br>¡Cada mosca eliminada suma 10 puntos!<br>¡Elimina 10 moscas para pasar al siguiente nivel!";
instructionsDiv.style.fontSize = "24px";
instructionsDiv.style.fontWeight = "bold";
instructionsDiv.style.color = "black";
instructionsDiv.style.textShadow = "2px 2px 4px #FF4500";
instructionsDiv.style.position = "absolute";
instructionsDiv.style.top = "50%";
instructionsDiv.style.left = "50%";
instructionsDiv.style.transform = "translate(-50%, -50%)";
instructionsDiv.style.textAlign = "center";
instructionsDiv.style.zIndex = "10";
document.body.appendChild(instructionsDiv);

let startButton = document.createElement("button");
startButton.innerText = "START";
startButton.style.fontSize = "20px";
startButton.style.padding = "20px 40px";
startButton.style.marginTop = "20px";
startButton.style.cursor = "pointer";
startButton.style.backgroundColor = "#FF6347";
startButton.style.color = "white";
startButton.style.fontWeight = "bold";
startButton.style.border = "5px solid #FFD700";
startButton.style.borderRadius = "15px";
startButton.style.boxShadow = "0 5px 15px rgba(255, 99, 71, 0.7)";
startButton.style.textShadow = "2px 2px 4px rgba(255, 99, 71, 0.7)";
startButton.style.transition = "all 0.3s ease-in-out";
document.body.appendChild(startButton);

let score = 0;
let level = 1;
let timeLeft = 30;
let timerInterval = null;
const scoreFont = "30px Arial";

let scoreDiv = document.createElement("div");
scoreDiv.style.position = "absolute";
scoreDiv.style.top = "10px";
scoreDiv.style.right = "10px";
scoreDiv.style.font = scoreFont;
scoreDiv.style.color = "black";
scoreDiv.style.zIndex = "10";
scoreDiv.style.textShadow = "2px 2px 4px #FF4500";
scoreDiv.innerHTML = `Puntaje: ${score} | Nivel: ${level} | Tiempo: ${timeLeft}s`;
document.body.appendChild(scoreDiv);

const flyImage = new Image();
flyImage.src = "mosca.jpg";

const hitSound = new Audio("golpe.mp3");
const gameOverSound = new Audio("gameover.mp3");

class Fly {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.dx = (Math.random() - 0.5) * speed;
        this.dy = (Math.random() - 0.5) * speed;
    }
    draw(context) {
        context.drawImage(flyImage, this.x, this.y, this.size, this.size);
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x + this.size > theCanvas.width) this.dx *= -1;
        if (this.y < 0 || this.y + this.size > theCanvas.height) this.dy *= -1;
    }
}

let gameOverDiv = document.createElement("div");
gameOverDiv.style.position = "absolute";
gameOverDiv.style.top = "50%";
gameOverDiv.style.left = "50%";
gameOverDiv.style.transform = "translate(-50%, -50%)";
gameOverDiv.style.fontSize = "24px";
gameOverDiv.style.padding = "20px 40px";
gameOverDiv.style.backgroundColor = "#FF6347";
gameOverDiv.style.color = "white";
gameOverDiv.style.fontWeight = "bold";
gameOverDiv.style.border = "5px solid #FFD700";
gameOverDiv.style.borderRadius = "15px";
gameOverDiv.style.boxShadow = "0 5px 15px rgba(255, 99, 71, 0.7)";
gameOverDiv.style.textShadow = "2px 2px 4px rgba(255, 99, 71, 0.7)";
gameOverDiv.style.textAlign = "center";
gameOverDiv.style.zIndex = "20";
gameOverDiv.style.display = "none";
document.body.appendChild(gameOverDiv);

function showGameOver() {
    gameOverSound.play();
    backgroundMusic.pause(); //Pausa la música de fondo
    backgroundMusic.currentTime = 0; //Reinicia la música de fondo

    flySound.pause();
    flySound.currentTime = 0;

    gameOverDiv.innerHTML = `¡Tiempo agotado!<br>Fin del juego.<br>Puntaje final: ${score}<br>`;
    
    let restartButton = document.createElement("button");
    restartButton.innerText = "REINICIAR";
    restartButton.style.fontSize = "20px";
    restartButton.style.padding = "20px 40px";
    restartButton.style.marginTop = "20px";
    restartButton.style.cursor = "pointer";
    restartButton.style.backgroundColor = "#FF6347";
    restartButton.style.color = "white";
    restartButton.style.fontWeight = "bold";
    restartButton.style.border = "5px solid #FFD700";
    restartButton.style.borderRadius = "15px";
    restartButton.style.boxShadow = "0 5px 15px rgba(255, 99, 71, 0.7)";
    restartButton.style.textShadow = "2px 2px 4px rgba(255, 99, 71, 0.7)";
    restartButton.style.transition = "all 0.3s ease-in-out";

    restartButton.addEventListener("click", () => {
        score = 0;
        level = 1;
        gameOverDiv.style.display = "none";
        backgroundMusic.play(); //Reanuda la música de fondo
        spawnFlies();
    });

    gameOverDiv.appendChild(restartButton);
    gameOverDiv.style.display = "block";
}

let flies = [];

const flySound = new Audio("sonidomosca.mp3");
flySound.loop = true;
flySound.volume = 0.6;
function spawnFlies() {
    flies = [];
    for (let i = 0; i < 10; i++) {
        let size = Math.max(40 - (level - 1) * 5, 20);
        let speed = 2 + (level - 1);
        let x = Math.random() * (theCanvas.width - size);
        let y = Math.random() * (theCanvas.height - size);
        flies.push(new Fly(x, y, size, speed));
    }

    flySound.currentTime = 0;
    flySound.play();

    timeLeft = 30;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        scoreDiv.innerHTML = `Puntaje: ${score} | Nivel: ${level} | Tiempo: ${timeLeft}s`;
        if (timeLeft <= 0) {
            showGameOver();
        }
    }, 1000);
    updateGame();
}

theCanvas.addEventListener("click", (event) => {
    const rect = theCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    flies = flies.filter(fly => {
        let isHit = mouseX > fly.x && mouseX < fly.x + fly.size &&
                    mouseY > fly.y && mouseY < fly.y + fly.size;
        if (isHit) {
            hitSound.currentTime = 0;
            hitSound.play();
            score += 10;
            scoreDiv.innerHTML = `Puntaje: ${score} | Nivel: ${level} | Tiempo: ${timeLeft}s`;
        }
        return !isHit;
    });

    if (flies.length === 0) {
        level++;
        spawnFlies();
    }
});

function updateGame() {
    ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
    flies.forEach(fly => {
        fly.update();
        fly.draw(ctx);
    });
    requestAnimationFrame(updateGame);
}

const backgroundMusic = new Audio("sonidofondo.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

startButton.addEventListener("click", () => {
    instructionsDiv.style.display = "none";
    startButton.style.display = "none";
    backgroundMusic.play(); //Inicia la música de fondo
    spawnFlies();
});