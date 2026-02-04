// Instance-mode sketch for tab 2
//  HWK #4. A
registerSketch('sk2', function (p) {
  p.setup = function () {
    p.createCanvas(800, 500);
    p.angleMode(p.DEGREES); 
  };

  // let bgImg;
  let ballImg;
  let racketImg;
  p.preload = function () {
    // bgImg = p.loadImage("images/tennis-court-background.avif");
    ballImg = p.loadImage("images/tennis_ball_cartoon.png");
    racketImg = p.loadImage("images/upright_tennis_racket.png");
  };

  p.draw = function () {
    // p.image(bgImg, 0, 0, p.width, p.height);
    p.background(100, 180, 250);
    p.clockFace();
  };

  p.clockFace = function () {
    p.push();
    p.translate(p.width / 2, p.height / 2);

    const R = p.min(p.width, p.height) * 0.45;   // outer radius
    p.noStroke();
    p.fill(58, 80, 105, 220);
    p.ellipse(0, 0, R * 2 + 20, R * 2 + 20);

    p.fill(81,132,183, 180);
    p.ellipse(0, 0, R * 2, R * 2);

    // Tick markers around perimeter of clock
    p.push();
    p.stroke(200); 
    p.strokeWeight(3);
    for (let ticks = 0; ticks < 60; ticks += 1) {
      p.point(0, -R * 0.8);
      p.rotate(6);
    }
    p.pop();

    p.pop();
  }


  p.windowResized = function () { };
});

