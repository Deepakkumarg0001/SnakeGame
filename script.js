// Game constants and variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');

let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Game loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

// Check for collisions
function isCollide(snake) {
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // Wall collision
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

// Generate new food position ensuring it doesn't overlap with the snake
function getNewFoodPosition() {
    let newFood;
    while (true) {
        newFood = { x: Math.floor(2 + Math.random() * 15), y: Math.floor(2 + Math.random() * 15) };
        if (!snakeArr.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            break;
        }
    }
    return newFood;
}

// Game engine
function gameEngine() {
    // Check collision
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        alert("Game Over. Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        inputDir = { x: 0, y: 0 };
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
        musicSound.play();
    }

    // If snake eats food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        
        if (score > Hiscoreval) {
            Hiscoreval = score;
            localStorage.setItem("Hiscore", JSON.stringify(Hiscoreval));
            HiscoreBox.innerHTML = "Hiscore: " + Hiscoreval;
        }
        
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = getNewFoodPosition();
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Display the snake and food
    board.innerHTML = "";

    // Draw snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    // Draw food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
let Hiscore = localStorage.getItem("Hiscore");
let Hiscoreval = Hiscore ? JSON.parse(Hiscore) : 0;
HiscoreBox.innerHTML = "Hiscore: " + Hiscoreval;

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    musicSound.play();
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y === 0) inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (inputDir.y === 0) inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (inputDir.x === 0) inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (inputDir.x === 0) inputDir = { x: 1, y: 0 };
            break;
    }
});