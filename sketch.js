let ball;
let balls = [];
let ring;
let gravity = 0.6;
let accelerationFactor = 1.05;
let maxSpeed = 15;
let hue = 0;
let prevBallPos;
let gameOver = false;
let animationFrame = 0;
let inMenu = true;
let currentGame = null;
let music;
let bounceSound;
const maxBalls = 100;

function preload() {
  music = loadSound('music.mp3');
  bounceSound = loadSound('bounce.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  angleMode(RADIANS);
  colorMode(HSB);
  music.loop();
  background(0);
  resetSketch();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  if (inMenu) {
    drawMenu();
    return;
  }

  if (currentGame === "Game1") {
    drawGame1();
  } else if (currentGame === "Game2") {
    drawGame2();
  }
}

function drawGame1() {
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

function drawGame2() {
  gravity = 0.4;
  background(0);
  translate(width / 2, height / 2);

  ringRotation = (ringRotation + 0.02) % TWO_PI;

  noFill();
  strokeWeight(30);
  stroke(255);
  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += 0.01) {
    if (angle < ringRotation || angle > (ringRotation + ringHoleAngle) % TWO_PI) {
      let x = ring.radius * cos(angle);
      let y = ring.radius * sin(angle);
      vertex(x, y);
    }
  }
  endShape(CLOSE);

  fill(0);
  noStroke();
  arc(0, 0, ring.radius * 2, ring.radius * 2, ringRotation, ringRotation + ringHoleAngle);

  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    b.vy += gravity;
    b.vx = constrain(b.vx, -maxSpeed, maxSpeed);
    b.vy = constrain(b.vy, -maxSpeed, maxSpeed);
    b.x += b.vx;
    b.y += b.vy;

    noStroke();
    fill((hue + i * 30) % 360, 255, 255);
    circle(b.x, b.y, b.r * 2);

    let distance = sqrt(b.x * b.x + b.y * b.y);
    if (distance + b.r > ring.radius) {
      let angle = atan2(b.y, b.x);
      if (angle > ringRotation && angle < (ringRotation + ringHoleAngle) % TWO_PI) {
        b.vy += gravity;
      } else {
        bounceSound.play();
        let normX = b.x / distance;
        let normY = b.y / distance;
        let dot = b.vx * normX + b.vy * normY;
        b.vx -= 2 * dot * normX;
        b.vy -= 2 * dot * normY;
        b.vx *= accelerationFactor;
        b.vy *= accelerationFactor;
        let overlap = b.r + distance - ring.radius;
        b.x -= normX * overlap;
        b.y -= normY * overlap;
      }
    }

    if (b.y > height / 2 + b.r) {
      balls.splice(i, 1);
      i--;
      if (balls.length < maxBalls) {
        balls.push(createBall());
        balls.push(createBall());
      }
    }
  }
}

function createBall() {
  return {
    x: random(-ring.radius / 2, ring.radius / 2),
    y: random(-ring.radius / 2, ring.radius / 2),
    vx: random(-3, 3),
    vy: random(-3, 3),
    r: 5
  };
}

function resetSketch() {
  ball = {
    x: 0,
    y: 0,
    vx: random(-3, 3),
    vy: random(-3, 3),
    r: 10
  };
  balls = [
    { x: 0, y: 0, vx: random(-3, 3), vy: random(-3, 3), r: 5 }
  ];
  ring = {
    radius: 200
  };
  ringRotation = 0;
  ringHoleAngle = Math.PI / 4;
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
  text("Press 1 for Game 1", width / 2, height / 2);
  text("Press 2 for Game 2", width / 2, height / 2 + 50);
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
  if (keyCode === 49) {
    inMenu = false;
    currentGame = "Game1";
    resetSketch();
  } else if (keyCode === 50) {
    inMenu = false;
    currentGame = "Game2";
    resetSketch();
  } else if (keyCode === 32) {
    resetSketch();
  }
}
