let theCanvas = document.getElementById("canvas");
theCanvas.width = window.innerWidth * 0.8;  
theCanvas.height = window.innerHeight * 0.8;  
let ctx = theCanvas.getContext("2d");

// Ajustar el fondo de la cocina para que cubra toda la pantalla sin deformarse
document.body.style.backgroundImage = "url('cocina.jpg')";
document.body.style.backgroundSize = "100% 100%";  // Se adapta al tamaño de la ventana
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundPosition = "center";

// Ajustar estilos generales
document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.height = "100vh";
document.body.style.margin = "0";
document.body.style.fontFamily = "Arial, sans-serif";

// Cambiar cursor a imagen de matamoscas
document.body.style.cursor = "url('mata.png') 25 25, auto";

// Crear div para instrucciones
let instructionsDiv = document.createElement("div");
instructionsDiv.style.position = "absolute";
instructionsDiv.style.top = "50%";
instructionsDiv.style.transform = "translateY(-50%)";
instructionsDiv.style.textAlign = "center";
instructionsDiv.style.color = "white";
instructionsDiv.style.fontSize = "30px";
instructionsDiv.style.zIndex = "10";
instructionsDiv.innerHTML = "Elimina las mayores moscas posibles antes de que se acabe el tiempo";
document.body.appendChild(instructionsDiv);

// Crear botón START
let startButton = document.createElement("button");
startButton.innerText = "START";
startButton.style.fontSize = "20px";
startButton.style.padding = "10px 20px";
startButton.style.marginTop = "20px";
startButton.style.cursor = "pointer";
document.body.appendChild(startButton);

// Variable para el puntaje
let score = 0;
const scoreFont = "30px Arial"; // Hacer el puntaje más grande

// Crear el div para el puntaje
let scoreDiv = document.createElement("div");
scoreDiv.style.position = "absolute";
scoreDiv.style.bottom = "10px";  // Pegado al fondo
scoreDiv.style.left = "50%";
scoreDiv.style.transform = "translateX(-50%)";  // Centrado horizontalmente
scoreDiv.style.font = scoreFont;
scoreDiv.style.color = "black";  // Puntaje en color negro
scoreDiv.style.zIndex = "10";  // Asegurarse de que esté por encima del canvas
scoreDiv.innerHTML = "Puntaje: " + score;
document.body.appendChild(scoreDiv);

// Cargar imagen de mosca
const flyImage = new Image();
flyImage.src = "mosca.jpg";

// Clase de Mosca
class Fly {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.dx = (Math.random() - 0.5) * 4;
        this.dy = (Math.random() - 0.5) * 4;
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

// Generar moscas dentro del nuevo tamaño
let flies = [];
function spawnFlies(count) {
    flies = [];
    for (let i = 0; i < count; i++) {
        let size = 40;
        let x = Math.random() * (theCanvas.width - size);
        let y = Math.random() * (theCanvas.height - size);
        flies.push(new Fly(x, y, size));
    }
}

// Actualizar y dibujar el juego
function updateGame() {
    ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
    
    // Dibujar todas las moscas
    flies.forEach(fly => {
        fly.update();
        fly.draw(ctx);
    });

    requestAnimationFrame(updateGame);
}

// Evento para eliminar moscas al hacer clic
theCanvas.addEventListener("click", (event) => {
    const rect = theCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Filtrar moscas que fueron golpeadas
    flies = flies.filter(fly => {
        let isHit = mouseX > fly.x && mouseX < fly.x + fly.size &&
                    mouseY > fly.y && mouseY < fly.y + fly.size;
        if (isHit) {
            score += 10;  // Aumentar puntaje al eliminar una mosca
            scoreDiv.innerHTML = "Puntaje: " + score;  // Actualizar el puntaje en el div
        }
        return !isHit;  // Si fue golpeado, se elimina
    });
});

// Redimensionar canvas cuando la ventana cambie de tamaño
window.addEventListener("resize", () => {
    theCanvas.width = window.innerWidth * 0.8;
    theCanvas.height = window.innerHeight * 0.8;
    spawnFlies(10);  // Regenerar moscas tras redimensionar
});

// Iniciar juego cuando se presiona el botón START
startButton.addEventListener("click", () => {
    instructionsDiv.style.display = "none";  // Ocultar instrucciones
    startButton.style.display = "none";      // Ocultar el botón START
    spawnFlies(10);  // Generar moscas para iniciar el juego
    updateGame();    // Iniciar la actualización del juego
});