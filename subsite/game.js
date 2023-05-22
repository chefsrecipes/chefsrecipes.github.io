// Initialize the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Bird object
const bird = {
  x: 50,
  y: canvas.height / 2,
  width: 50,
  height: 50,
  velocity: 0,
  gravity: 0.5,
  jumpHeight: 8,

  // Function to draw the bird
  draw: function () {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },

  // Function to update the bird's position
  update: function () {
    this.velocity += this.gravity;
    this.y += this.velocity;
  },

  // Function to make the bird jump
  jump: function () {
    this.velocity = -this.jumpHeight;
  },
};

// Pipe object
class Pipe {
  constructor() {
    this.space = 150;
    this.width = 80;
    this.x = canvas.width;
    this.y = Math.floor(Math.random() * (canvas.height - this.space));
    this.passed = false;
  }

  // Function to draw the pipe
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, 0, this.width, this.y);
    ctx.fillRect(
      this.x,
      this.y + this.space,
      this.width,
      canvas.height - this.y - this.space
    );
  }

  // Function to update the pipe's position
  update() {
    this.x -= 2;
  }
}

// Array to store the pipes
const pipes = [];

// Game variables
let frames = 0;
let gameOverFlag = false;
let score = 0;

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOverFlag) {
    // Update and draw the bird
    bird.update();
    bird.draw();

    // Create new pipe every 150 frames
    if (frames % 150 === 0) {
      pipes.push(new Pipe());
    }

    // Update and draw each pipe
    pipes.forEach((pipe) => {
      pipe.update();
      pipe.draw();

      // Check for collision
      if (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipe.space)
      ) {
        gameOver(score); // Pass the score as an argument
      }

      // Check if bird passes through the pipe
      if (bird.x > pipe.x + pipe.width && !pipe.passed) {
        pipe.passed = true;
        score++;
      }

      // Remove pipes that have gone offscreen
      if (pipe.x + pipe.width < 0) {
        pipes.shift();
      }
    });

    // Draw the score
    ctx.fillStyle = "black";
    ctx.font = "bold 30px Arial";
    ctx.fillText(`Score: ${score}`, 10, 50);
  } else {
    // Display game over message
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);

    // Display score and play again message
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width / 2 - 50, canvas.height / 2 + 40);
    ctx.fillText("Press Space to Play Again", canvas.width / 2 - 130, canvas.height / 2 + 70);

    // Reset the score
    score = 0;
  }

  // Increase frame count
  frames++;

  // Call the game loop again
  requestAnimationFrame(gameLoop);
}

// Game over function
function gameOver(score) {
  // Set the game over flag
  gameOverFlag = true;

  // Display game over message
  ctx.fillStyle = "red";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);

  // Display score and play again message
  ctx.fillStyle = "black";
  ctx.font = "bold 20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 50, canvas.height / 2 + 40);
  ctx.fillText("Press Space to Play Again", canvas.width / 2 - 130, canvas.height / 2 + 70);

  // Reset the score
  score = 0;
}

// Event listener for spacebar keydown event
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    if (!gameOverFlag) {
      bird.jump();
    } else {
      // Reset the game if space bar is pressed after game over
      pipes.length = 0;
      bird.y = canvas.height / 2;
      bird.velocity = 0;
      frames = 0;
      gameOverFlag = false; // Reset the game over flag
    }
  }
});

// Start the game loop
gameLoop();
