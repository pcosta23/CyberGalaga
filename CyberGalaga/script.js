// ----------------- CONFIGURAÇÃO DO CANVAS -----------------
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// ----------------- IMAGENS -----------------
const background = new Image();
background.src = "img/background.png";

const playerImg = new Image();
playerImg.src = "img/player.png";

const bulletImg = new Image();
bulletImg.src = "img/bullet.png";

const virus1 = new Image();
virus1.src = "img/virus1.png";

const virus2 = new Image();
virus2.src = "img/virus2.png";

const virus3 = new Image();
virus3.src = "img/virus3.png";

const bossImg = new Image();
bossImg.src = "img/boss.png";

// ----------------- VARIÁVEIS -----------------
let keys = {};
let bullets = [];
let enemies = [];
let boss = { x: 600, y: 100, width: 100, height: 100, alive: false, speed: 2, hp: 10 };
let score = 0;
let gameOver = false;
let backgroundY = 0;

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 80,
  width: 50,
  height: 50,
  speed: 5,
  alive: true
};

// ----------------- EVENTOS DE TECLADO -----------------
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") shootBullet();
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// ----------------- FUNÇÕES DE TIROS -----------------
function shootBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20,
    speed: 7,
    img: bulletImg
  });
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;

    // Remove se sair da tela
    if (bullets[i].y + bullets[i].height < 0) {
      bullets.splice(i, 1);
      continue;
    }

    // Colisão com inimigos
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (isColliding(bullets[i], enemies[j])) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score += 10;
        break;
      }
    }

    // Colisão com chefão
    if (boss.alive && isColliding(bullets[i], boss)) {
      bullets.splice(i, 1);
      boss.hp -= 1;
      if (boss.hp <= 0) {
        boss.alive = false;
        score += 50;
      }
      break;
    }
  }
}

function drawBullets() {
  bullets.forEach((b) => {
    if (b.img.complete) {
      ctx.drawImage(b.img, b.x, b.y, b.width, b.height);
    } else {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(b.x, b.y, b.width, b.height);
    }
  });
}

// ----------------- INIMIGOS -----------------
function createEnemies() {
  if (enemies.length === 0 && !boss.alive) {
    for (let i = 0; i < 5; i++) {
      enemies.push({
        x: 50 + i * 140,
        y: 50,
        width: 50,
        height: 50,
        img: [virus1, virus2, virus3][i % 3],
        speed: 2
      });
    }
  }
}

function updateEnemies() {
  enemies.forEach((e) => {
    e.y += e.speed;
    if (e.y + e.height > canvas.height || e.y < 0) e.speed *= -1;

    if (isColliding(player, e)) {
      player.alive = false;
      gameOver = true;
    }
  });
}

function drawEnemies() {
  enemies.forEach((e) => ctx.drawImage(e.img, e.x, e.y, e.width, e.height));
}

// ----------------- CHEFÃO -----------------
function drawBoss() {
  if (boss.alive) ctx.drawImage(bossImg, boss.x, boss.y, boss.width, boss.height);
}

function moveBoss() {
  if (!boss.alive) return;
  boss.y += boss.speed;
  if (boss.y + boss.height > canvas.height || boss.y < 0) boss.speed *= -1;

  if (isColliding(player, boss)) {
    player.alive = false;
    gameOver = true;
  }
}

function checkBossTrigger() {
  if (enemies.length === 0 && !boss.alive) {
    boss.alive = true;
    boss.x = canvas.width / 2 - boss.width / 2;
    boss.y = 50;
    boss.hp = 10;
  }
}

// ----------------- PLAYER -----------------
function movePlayer() {
  if (!player.alive) return;
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y + player.height < canvas.height) player.y += player.speed;
}

// ----------------- FUNÇÕES AUXILIARES -----------------
function scrollBackground() {
  backgroundY += 2;
  if (backgroundY >= canvas.height) backgroundY = 0;
  ctx.drawImage(background, 0, backgroundY - canvas.height, canvas.width, canvas.height);
  ctx.drawImage(background, 0, backgroundY, canvas.width, canvas.height);
}

function isColliding(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "16px 'Press Start 2P'";
  ctx.fillText("SCORE: " + score, 10, 30);
}

function drawGameOver() {
  ctx.fillStyle = "red";
  ctx.font = "32px 'Press Start 2P'";
  ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
}

// ----------------- LOOP PRINCIPAL -----------------
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  scrollBackground();
  movePlayer();
  updateBullets();
  createEnemies();
  updateEnemies();
  moveBoss();
  checkBossTrigger();

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  drawBullets();
  drawEnemies();
  drawBoss();
  drawScore();

  if (gameOver) {
    drawGameOver();
  } else {
    requestAnimationFrame(gameLoop);
  }
}

// ----------------- INICIAR JOGO -----------------
gameLoop();
