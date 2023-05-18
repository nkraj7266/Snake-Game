const foodSound = new Audio("sounds/bite.mp3");
const gameOverSound = new Audio("sounds/gameOver.mp3");
const turnSound = new Audio("sounds/turn.mp3");

let inputDir = { x: 0, y: 0 };
let speed = 7;
let lastPaintTime = 0;

let a = 2;
let b = 28;

let snakeArr = [{ x: 15, y: 16 }];
let food = {};
randomFoodGenerator();

let score = 0;
let highscoreval;

//---execution starts here
function main(ctime) {
	//--recursively calling main for iteratively running the code
	window.requestAnimationFrame(main);
	if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
		return;
	}
	lastPaintTime = ctime;
	//---calling the executable function
	gameEngine();
}

//---function to generate random food location
function randomFoodGenerator() {
	food = {
		x: Math.round(a + (b - a) * Math.random()),
		y: Math.round(a + (b - a) * Math.random()),
	};
}

//---logic for collison of snake
function isCollided(snake) {
	for (let i = 1; i < snakeArr.length; i++) {
		if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
			return true;
		}
	}
	if (
		snake[0].x >= 30 ||
		snake[0].x <= 0 ||
		snake[0].y >= 30 ||
		snake[0].y <= 0
	) {
		return true;
	}
	return false;
}

function gameEngine() {
	//---if snake collides
	if (isCollided(snakeArr)) {
		//reset score to 0
		gameOverSound.play();
		score = 0;
		document.getElementById("score").innerHTML = "00";

		inputDir = { x: 0, y: 0 };
		alert("Game Over, Press Enter !!!");
		snakeArr = [{ x: 15, y: 16 }];
		randomFoodGenerator();
	}

	//---if snake eats the food
	if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
		foodSound.play();

		snakeArr.unshift({
			x: snakeArr[0].x + inputDir.x,
			y: snakeArr[0].y + inputDir.y,
		});
		randomFoodGenerator();

		score++;
		if (score > highscoreval) {
			highscoreval = score;
			localStorage.setItem("hiscore", JSON.stringify(highscoreval));
			if (highscoreval < 10) {
				document.getElementById("highscore").innerHTML =
					"0" + highscoreval;
			} else {
				document.getElementById("highscore").innerHTML = highscoreval;
			}
		}
		if (score < 10) {
			document.getElementById("score").innerHTML = "0" + score;
		} else document.getElementById("score").innerHTML = score;
	}

	//---movement of snake
	for (let i = snakeArr.length - 2; i >= 0; i--) {
		snakeArr[i + 1] = { ...snakeArr[i] };
	}

	snakeArr[0].x += inputDir.x;
	snakeArr[0].y += inputDir.y;

	//---creating snake and its body
	field.innerHTML = "";
	snakeArr.forEach((e, index) => {
		snakeElement = document.createElement("div");
		snakeElement.style.gridRowStart = e.y;
		snakeElement.style.gridColumnStart = e.x;
		if (index === 0) {
			snakeElement.classList.add("head");
		} else snakeElement.classList.add("snake");
		field.appendChild(snakeElement);
	});

	//---creating snakes food
	foodElement = document.createElement("div");
	foodElement.style.gridRowStart = food.y;
	foodElement.style.gridColumnStart = food.x;
	foodElement.classList.add("food");
	field.appendChild(foodElement);
}

let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
	highscoreval = 0;
	localStorage.setItem("hiscore", JSON.stringify(highscoreval));
} else {
	highscoreval = JSON.parse(hiscore);
	document.getElementById("highscore").innerHTML = hiscore;
}

//---initialize the main function
window.requestAnimationFrame(main);

//---defining function of arrow keys
window.addEventListener("keydown", (e) => {
	inputDir = { x: 0, y: 1 };
	turnSound.play();
	switch (e.key) {
		case "ArrowRight":
			inputDir.x = 1;
			inputDir.y = 0;
			break;

		case "ArrowLeft":
			inputDir.x = -1;
			inputDir.y = 0;
			break;

		case "ArrowUp":
			inputDir.x = 0;
			inputDir.y = -1;
			break;

		case "ArrowDown":
			inputDir.x = 0;
			inputDir.y = 1;
			break;

		default:
			break;
	}
});
