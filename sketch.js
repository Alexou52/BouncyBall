let ball;
let rings = 10;
let gapAngle = Math.PI / 4;
let colors = [];

function setup() {
  createCanvas(600, 600);
  angleMode(RADIANS);
  ball = {
    x: 300,
    y: 300,
    vx: 2.5,
    vy: -1.8,
    r: 8
  };
  for (let i = 0; i < rings; i++) {
    colors.push(lerpColor(color('#FF6600'), color('#00FF00'), i / rings));
  }
}

function draw() {
  background(10);
  translate(width / 2, height / 2);
  noFill();
  strokeWeight(6);
  for (let i = 1; i <= rings; i++) {
    stroke(colors[i - 1]);
    let radius = i * 25;
    arc(0, 0, radius * 2, radius * 2, gapAngle, TWO_PI - gapAngle);
  }
  ball.x += ball.vx;
  ball.y += ball.vy;

  let px = ball.x - width / 2;
  let py = ball.y - height / 2;
  let r = sqrt(px * px + py * py);
  let angle = atan2(py, px);
  for (let i = rings; i >= 1; i--) {
    let ringRadius = i * 25;
    if (abs(r - ringRadius) < ball.r * 1.2) {
      if (angle < TWO_PI - gapAngle && angle > gapAngle) {
        let normX = px / r;
        let normY = py / r;
        let dot = ball.vx * normX + ball.vy * normY;
        ball.vx -= 2 * dot * normX;
        ball.vy -= 2 * dot * normY;
      }
    }
  }
  if (r > rings * 25 + 30 || r < 10) {
    ball.x = width / 2;
    ball.y = height / 2;
    ball.vx = random(-3, 3);
    ball.vy = random(-3, 3);
  }
  noStroke();
  fill(255);
  circle(px, py, ball.r * 2);
}
