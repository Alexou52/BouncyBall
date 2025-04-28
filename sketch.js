let ball;
let ring;
let gravity = 0.6;
let accelerationFactor = 1.05;
let maxSpeed = 15;
let hue = 0;
let prevBallPos;
let gameOver = false;
let animationFrame = 0;
let inMenu = true;
let music;
let bounceSound;

function preload() {
  music = loadSound('music.mp3');
  bounceSound = loadSound('bounce.mp3');
}

function setup() {
  createCanvas(600, 600);
  angleMode(RADIANS);
  colorMode(HSB);
  music.loop();
  background(0);
  resetSketch();
}

function draw() {
  if (inMenu) {
    drawMenu();
    return;
  }

  if (gameOver) {
    drawGoodGameAnimation();
    return;
  }

  translate(width / 2, height / 2);
  noFill();
  strokeWeight(30);
  stroke(255);
  ellipse(0, 0, ring.radius * 2);

  ball.vy += gravity;
  ball.vx = constrain(ball.vx, -maxSpeed, maxSpeed);
  ball.vy = constrain(ball.vy, -maxSpeed, maxSpeed);
  ball.x += ball.vx;
  ball.y += ball.vy;

  noStroke();
  fill(hue, 255, 255);
  if (prevBallPos) {
    line(prevBallPos.x, prevBallPos.y, ball.x, ball.y);
  }
  prevBallPos = { x: ball.x, y: ball.y };
  hue = (hue + 1) % 360;

  stroke(255);
  strokeWeight(2);
  fill(hue, 255, 255);
  circle(ball.x, ball.y, ball.r * 2);

  let distance = sqrt(ball.x * ball.x + ball.y * ball.y);
  if (distance + ball.r > ring.radius) {
    bounceSound.play();
    let normX = ball.x / distance;
    let normY = ball.y / distance;
    let dot = ball.vx * normX + ball.vy * normY;
    ball.vx -= 2 * dot * normX;
    ball.vy -= 2 * dot * normY;
    ball.vx *= accelerationFactor;
    ball.vy *= accelerationFactor;
    ball.r += 1;
    let overlap = ball.r + distance - ring.radius;
    ball.x -= normX * overlap;
    ball.y -= normY * overlap;
  }

  if (ball.r >= ring.radius) {
    gameOver = true;
    background(0);
  }
}

function resetSketch() {
  ball = {
    x: 0,
    y: 0,
    vx: random(-3, 3),
    vy: random(-3, 3),
    r: 10
  };
  ring = {
    radius: 200
  };
  background(0);
  prevBallPos = { x: ball.x, y: ball.y };
  gameOver = false;
  animationFrame = 0;
}

function drawMenu() {
  background(0);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(50);
  text("Satisfying Bouncing Ball", width / 2, height / 3);
  textSize(30);
  text("Press SPACE to Play", width / 2, height / 2);
}

function drawGoodGameAnimation() {
  background(0, 50);
  textAlign(CENTER, CENTER);
  textSize(50 + sin(animationFrame * 0.1) * 10);
  fill((hue + animationFrame) % 360, 255, 255);
  text("Good Game :)", width / 2, height / 2);
  animationFrame++;
}

function keyPressed() {
  if (keyCode === 32) {
    if (inMenu) {
      inMenu = false;
    } else {
      resetSketch();
    }
  }
}
