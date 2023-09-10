// Define canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Define ball variables
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;
const ballRadius = 10;

// Define paddle variables
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Define brick variables
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Define score and lives variables
let score = 0;
let lives = 3;

// Add event listeners for keyboard input
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Functions for handling keyboard input
function keyDownHandler(event) {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = true;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = false;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// Function for drawing ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Function for drawing paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Function for drawing bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
      }
    }
  }
}

// Game over function
function gameOver(message) {
  // Display the game over message
  ctx.font = "bold 24px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(message, canvas.width / 2 - 100, canvas.height / 2);
  // Stop the game
  clearInterval(intervalId);
  // Disable the mousemove event listener
  canvas.removeEventListener("mousemove", movePaddle);
}

// Check for game over
function checkGameOver() {
  if (lives === 0) {
    gameOver("Game Over");
  } else if (bricks.length === 0) {
    gameOver("You Won!");
  }
}

// Update game objects
function update() {
  // Move the paddle
  paddle.x += paddle.dx;
  // Keep the paddle within the canvas boundaries
  if (paddle.x < 0) {
    paddle.x = 0;
  } else if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }
  // Move the ball
  ball.x += ball.dx;
  ball.y += ball.dy;
  // Check for collisions with the paddle
  if (
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y
  ) {
    // Reverse the y direction of the ball
    ball.dy = -ball.speed;
    // Adjust the x direction of the ball based on where it hit the paddle
    let collidePoint =
      ball.x - (paddle.x + paddle.width / 2);
    collidePoint = collidePoint / (paddle.width / 2);
    let angle = collidePoint * (Math.PI / 3);
    ball.dx = ball.speed * Math.sin(angle);
  }
  // Check for collisions with the bricks
  bricks.forEach((brick, index) => {
    if (
      ball.x + ball.radius > brick.x &&
      ball.x - ball.radius < brick.x + brick.width &&
      ball.y + ball.radius > brick.y &&
      ball.y - ball.radius < brick.y + brick.height
    ) {
      // Reverse the y direction of the ball
      ball.dy = -ball.dy;
      // Remove the brick from the array
      bricks.splice(index, 1);
      // Increment the score
      score++;
    }
  });
  // Check for collisions with the walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }
  // Check for collisions with the bottom of the canvas
  if (ball.y + ball.radius > canvas.height) {
    // Decrement the lives
    lives--;
    // Reset the paddle and ball
    paddle.x = (canvas.width - paddle.width) / 2;
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
  }
}

// Draw game objects
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw the bricks
  bricks.forEach(brick => {
    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
  });
  // Draw the paddle
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}


// 벽돌 그리기
function drawBricks() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// 충돌 검사
function collisionDetection() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickRowCount*brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// 점수 그리기
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}

// 라이프 그리기
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

// 게임 실행
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  drawLives();
  collisionDetection();

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
    dy = -dy;
  } else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      lives--;
      if(!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();


