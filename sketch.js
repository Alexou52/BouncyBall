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
let rings3 = [];
let holeAngle;
let currentRingIndex = 0;

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
  } else if (currentGame === "Game3")
    drawGame3();
}

function drawGame1() {
  if (gameOver) {
    drawGoodGameAnimation();
    return;
  }

  translate(width / 2, height / 2);
  const strokeThickness = 15;
  let collisionRadius = ring.radius - strokeThickness / 2;

  noFill();
  strokeWeight(strokeThickness);
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
  if (distance + ball.r > collisionRadius) {
    bounceSound.play();
    let normX = ball.x / distance;
    let normY = ball.y / distance;
    let dot = ball.vx * normX + ball.vy * normY;
    ball.vx -= 2 * dot * normX;
    ball.vy -= 2 * dot * normY;
    ball.vx *= accelerationFactor;
    ball.vy *= accelerationFactor;
    ball.r += 1;
    let overlap = ball.r + distance - collisionRadius;
    ball.x -= normX * overlap;
    ball.y -= normY * overlap;
  }
  if (ball.r >= collisionRadius) {
    gameOver = true;
    background(0);
  }
}

function angleDansIntervalle(angle, debut, longueur) {
  let fin = (debut + longueur) % TWO_PI;
  if (debut < fin) {
    return angle >= debut && angle <= fin;
  } else {
    return angle >= debut || angle <= fin;
  }
}

function drawGame2() {
  gravity = 0.4;
  background(0);
  translate(width/2, height/2);
  ringRotation = (ringRotation + 0.02) % TWO_PI;
  strokeWeight(15);
  stroke(255);
  noFill();
  let startVis = (ringRotation + ringHoleAngle) % TWO_PI;
  let endVis   = (ringRotation + TWO_PI) % TWO_PI;
  arc(0,0, ring.radius*2, ring.radius*2, startVis, endVis);
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    b.vy += gravity;
    b.vx = constrain(b.vx, -maxSpeed, maxSpeed);
    b.vy = constrain(b.vy, -maxSpeed, maxSpeed);
    b.x += b.vx;
    b.y += b.vy;
    noStroke();
    fill((hue + i*30)%360, 255, 255);
    circle(b.x, b.y, b.r*4);
    let dist = sqrt(b.x*b.x + b.y*b.y);
    if (!b.escaped && dist + b.r > ring.radius) {
      let ang = atan2(b.y, b.x);
      if (ang < 0) ang += TWO_PI;
      if (angleDansIntervalle(ang, ringRotation, ringHoleAngle)) {
        b.escaped = true;
      } else {
        bounceSound.play();
        let nx = b.x/dist, ny = b.y/dist;
        let proj = b.vx*nx + b.vy*ny;
        b.vx -= 2*proj*nx;
        b.vy -= 2*proj*ny;
        b.vx *= accelerationFactor;
        b.vy *= accelerationFactor;
        let overlap = b.r + dist - ring.radius;
        b.x -= nx*overlap;
        b.y -= ny*overlap;
      }
    }
    if (b.escaped) {
      let sx = b.x + width/2;
      let sy = b.y + height/2;
      if (
        sx < -b.r || sx > width + b.r ||
        sy < -b.r || sy > height + b.r
      ) {
        balls.splice(i, 1);
        i--;
        if (balls.length < maxBalls) {
          balls.push(createBall());
          balls.push(createBall());
        }
      }
    }
  }
  hue = (hue + 1) % 360;
}

function createBall() {
  return {
    x: random(-ring.radius / 2, ring.radius / 2),
    y: random(-ring.radius / 2, ring.radius / 2),
    vx: random(-3, 3),
    vy: random(-3, 3),
    r: 5,
    escaped: false 
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
  rings3 = [];
  currentRingIndex = 0;
  const nbRings = 15;
  const step = 15; 
  const baseRad = 40;
  for (let i = 0; i < nbRings; i++) {
    rings3.push({
      radius: baseRad + i * step,
      rotation: 0,
      isActive: i === 0
    });
  }
  holeAngle = PI / 3;
  balls = [{ x: 0, y: 0, vx: random(-2, 2), vy: random(-2, 2), r: 8, escaped: false }];
  background(0);
  hue = 0;
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
  text("3: Ring layers", width/2, height/2 + 80);
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
  if      (key === '1') { inMenu = false; currentGame="Game1"; resetSketch(); }
  else if (key === '2') { inMenu = false; currentGame="Game2"; resetSketch(); }
  else if (key === '3') { inMenu = false; currentGame="Game3"; resetSketch(); }
  else if (key === ' ') { resetSketch(); }
}

function drawGame3() {
  if (gameOver) {
    drawGoodGameAnimation();
    return;
  }
  
  background(0);
  translate(width/2, height/2);
  
  // ⭐ Dessiner tous les rings mais seul l'actif bouge
  stroke(255);
  strokeWeight(3);
  noFill();
  
  for (let i = 0; i < rings3.length; i++) {
    let ring = rings3[i];
    
    // ⭐ Seul le ring actuel bouge
    if (i === currentRingIndex && !ring.broken) {
      ring.rotation = (ring.rotation + 0.02) % TWO_PI;
      stroke(100, 255, 255); // Couleur différente pour le ring actif
      strokeWeight(4);
    } else {
      stroke(255, 100); // Rings inactifs plus transparents
      strokeWeight(2);
    }
    
    if (!ring.broken) {
      let startVis = (ring.rotation + holeAngle) % TWO_PI;
      let endVis = (ring.rotation + TWO_PI) % TWO_PI;
      arc(0, 0, ring.radius * 2, ring.radius * 2, startVis, endVis);
    }
  }
  
  // ⭐ Physique de la balle
  let b = balls[0];
  b.vy += gravity * 0.6; // Gravité plus douce
  b.vx = constrain(b.vx, -maxSpeed, maxSpeed);
  b.vy = constrain(b.vy, -maxSpeed, maxSpeed);
  b.x += b.vx;
  b.y += b.vy;
  
  noStroke();
  fill((hue) % 360, 255, 255);
  circle(b.x, b.y, b.r * 2);
  
  // ⭐ Collision uniquement avec le ring actif
  if (currentRingIndex < rings3.length) {
    let activeRing = rings3[currentRingIndex];
    let d = sqrt(b.x * b.x + b.y * b.y);
    
    // Vérifier collision avec le ring actif
    if (abs(d - activeRing.radius) < b.r && !activeRing.broken) {
      let ang = atan2(b.y, b.x);
      if (ang < 0) ang += TWO_PI;
      
      // ⭐ Si la balle passe par le trou
      if (angleDansIntervalle(ang, activeRing.rotation, holeAngle)) {
        activeRing.broken = true;
        currentRingIndex++; // ⭐ Passer au ring suivant
        bounceSound.play();
        
        // Petit boost quand on casse un ring
        let boostFactor = 1.1;
        b.vx *= boostFactor;
        b.vy *= boostFactor;
        
      } else {
        // Rebond normal
        bounceSound.play();
        let nx = b.x / d, ny = b.y / d;
        let dot = b.vx * nx + b.vy * ny;
        b.vx -= 2 * dot * nx;
        b.vy -= 2 * dot * ny;
        b.vx *= accelerationFactor;
        b.vy *= accelerationFactor;
        
        let overlap = b.r + d - activeRing.radius;
        b.x -= nx * overlap;
        b.y -= ny * overlap;
      }
    }
  }
  
  hue = (hue + 2) % 360;
  
  // ⭐ Victoire quand tous les rings sont cassés
  if (currentRingIndex >= rings3.length) {
    gameOver = true;
  }
}