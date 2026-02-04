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
  let hourhandImg;
  p.preload = function () {
    // bgImg = p.loadImage("images/tennis-court-background.avif");
    ballImg = p.loadImage("images/tennis_ball_cartoon.png");
    racketImg = p.loadImage("images/upright_tennis_racket.png");
    hourhandImg = p.loadImage("images/hour_hand.png");
  };

  p.draw = function () {
    // p.image(bgImg, 0, 0, p.width, p.height);
    p.background(100, 180, 250);
    p.clock();
  };

  p.clock = function () {
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

    let h = p.hour();
    let m = p.minute();
    let s = p.second();

    // second hand
    p.push();
    p.stroke(225);
    p.strokeWeight(1);
    p.rotate(p.map(s, 0, 60, 0, 360));
    p.line(0, 0, 0, -R * 0.8);
    p.pop();

    // minute hand
    p.push();
    p.rotate(p.map(m, 0, 60, 0, 360));
    p.imageMode(p.CENTER);

    // scale factor (try 0.35–0.6)
    let scale = (R * 0.8) / racketImg.height;
    p.scale(scale);

    // after scaling, use image’s real pixel size
    p.image(racketImg, 0, -racketImg.height * 0.4, racketImg.width, racketImg.height);

    p.imageMode(p.CORNER);
    p.pop();

    // hour hand
    p.push();
    p.rotate(p.map(h % 12, 0, 12, 0, 360));
    p.imageMode(p.CENTER);
    let scaleHour = (R * 0.6) / hourhandImg.height;
    p.scale(scaleHour);
    p.image(hourhandImg, 0, -hourhandImg.height * 0.4, hourhandImg.width, hourhandImg.height);
    p.imageMode(p.CORNER);
    p.pop();

    p.pop();
  }


  p.windowResized = function () { };
});

