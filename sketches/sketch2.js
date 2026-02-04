// Instance-mode sketch for tab 2
//  HWK #4. A
registerSketch('sk2', function (p) {
  p.setup = function () {
    p.createCanvas(800, 500);
  };

  let bgImg;
  let ballImg;
  let racketImg;
  p.preload = function () {
    bgImg = p.loadImage("images/tennis-court-background.avif");
    ballImg = p.loadImage("images/tennis_ball_cartoon.png");
    racketImg = p.loadImage("images/upright_tennis_racket.png");
  };

  p.draw = function () {
    p.image(bgImg, 0, 0, p.width, p.height);
    p.fill(100, 150, 240);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});


//  HWK #4. A