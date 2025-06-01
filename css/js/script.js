const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 500;

const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const bgMusic = document.getElementById('bgMusic');

// गेम स्टेट
let score = 0;
let gameRunning = true;
const ball = {
  x: canvas.width / 2,
  y: 50,
  radius: 15,
  color: '#FF5252',
  speed: 5,
  dx: 0,
};

const platforms = [];
for (let i = 0; i < 5; i++) {
  platforms.push({
    x: Math.random() * (canvas.width - 100),
    y: canvas.height - 100 * i,
    width: 100,
    height: 15,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    passed: false,
    powerup: Math.random() < 0.3, // 30% पॉवरअप
  });
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // बॉल ड्रॉ
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();

  ball.x += ball.dx;
  ball.y += ball.speed;

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }

  platforms.forEach(platform => {
    ctx.fillStyle = platform.powerup ? '#FFD700' : platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    if (
      ball.y + ball.radius > platform.y &&
      ball.y - ball.radius < platform.y + platform.height &&
      ball.x > platform.x &&
      ball.x < platform.x + platform.width
    ) {
      if (!platform.passed) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        platform.passed = true;

        if (platform.powerup) {
          ball.speed = -ball.speed * 1.2; // स्पीड बढ़ाओ
        } else {
          ball.speed = -ball.speed;
        }
        ball.dx = (Math.random() - 0.5) * 10;
      }
    }

    platform.y += 2;
    if (platform.y > canvas.height) {
      platform.y = 0;
      platform.x = Math.random() * (canvas.width - 100);
      platform.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
      platform.passed = false;
      platform.powerup = Math.random() < 0.3;
    }
  });

  if (ball.y - ball.radius > canvas.height) {
    gameOver();
  }

  requestAnimationFrame(gameLoop);
}

function gameOver() {
  gameRunning = false;
  gameOverElement.style.display = 'block';
}

function restartGame() {
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
  ball.y = 50;
  ball.dx = 0;
  gameRunning = true;
  gameOverElement.style.display = 'none';
  platforms.forEach((platform, i) => {
    platform.y = canvas.height - 100 * i;
    platform.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    platform.passed = false;
    platform.powerup = Math.random() < 0.3;
  });
  gameLoop();
}

// इवेंट्स
canvas.addEventListener('mousemove', (e) => {
  if (gameRunning) {
    const rect = canvas.getBoundingClientRect();
    ball.x = e.clientX - rect.left;
  }
});

canvas.addEventListener('click', () => {
  if (!gameRunning) restartGame();
});

// म्यूज़िक चालू करो
bgMusic.play().catch(() => {
  // AutoPlay issue mobile पर
});

// Start Game
gameLoop();
