// // Instance-mode sketch for tab 4
// registerSketch('sk4', function (p) {
//   p.setup = function () {
//     p.createCanvas(p.windowWidth, p.windowHeight);
//   };
//   p.draw = function () {
//     p.background(200, 240, 200);
//     p.fill(30, 120, 40);
//     p.textSize(32);
//     p.textAlign(p.CENTER, p.CENTER);
//     p.text('HWK #4. C', p.width / 2, p.height / 2);
//   };
//   p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
// });

//  HWK #4. C
registerSketch('sk4', function (p) {
  p.setup = function () {
    // p.createCanvas(p.windowWidth, p.windowHeight);
    p.createCanvas(800, 500);
  };

  // adding a tennis court background image
  let bgImg;
  let ballImg;
  p.preload = function () {
    bgImg = p.loadImage("images/tennis-court-background.avif");
    // ballImg = p.loadImage("images/tennis_ball_cartoon.png");
  };

  // buttons
  let btnW = 140;
  let btnH = 40;
  let btnY = 300;

  p.draw = function () {
    p.image(bgImg, 0, 0, p.width, p.height);

    const tMs = p.getElapsedMs();
    const { hh, mm, ss } = p.msToHHMMSS(tMs);

    p.noStroke();
    p.fill("lightgray");
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(p.width / 8);

    p.text(`${hh}:${mm}:${ss}`, p.width / 2, p.height / 2 - 60);

    // buttons
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(18);
    p.noStroke();

    // Start/Pause button
    let startX = p.width / 2 - btnW - 23;
    let resetX = p.width / 2 + 23;

    // button backgrounds
    p.fill(255, 255, 255, 180);
    p.rect(startX, btnY, btnW, btnH, 12);
    p.rect(resetX, btnY, btnW, btnH, 12);

    // button labels
    p.fill(50);
    let startLabel = "Start";
    p.text(startLabel, startX + btnW / 2, btnY + btnH / 2);
    p.text("Reset", resetX + btnW / 2, btnY + btnH / 2);
  }

  // stopwatch
  let running = false;
  let startMs = 0;
  let elapsedMs = 0;

  p.getElapsedMs = function() {
    // If running, time = (now - start) + previously saved time
    // If paused, time = previously saved time
    return running ? (p.millis() - startMs) + elapsedMs : elapsedMs;
  }

  p.msToHHMMSS = function(ms) {
    const total = p.floor(ms / 1000); // total seconds
    const hh = p.floor(total / 3600);
    const mm = p.floor((total % 3600) / 60);
    const ss = total % 60;
    return { hh: p.nf(hh, 2), mm: p.nf(mm, 2), ss: p.nf(ss, 2) }; 
  }

  p.startStopwatch = function () {
    if (!running) {
      running = true;
      startMs = p.millis();
    }
  }

  p.resetStopwatch = function() {
    running = false;
    startMs = p.millis();
    elapsedMs = 0;
  }

  p.keyPressed = function() {
    if (p.key === ' ') {
      p.startStopwatch();
    }
    if (p.key === 'r' || p.key === 'R') {
      p.resetStopwatch();
    }
  };

  p.mousePressed = function() {
    let startX = p.width / 2 - btnW - 23;
    let resetX = p.width / 2 + 23;

    // Start/Pause hitbox
    if (p.mouseX >= startX && p.mouseX <= startX + btnW &&
        p.mouseY >= btnY && p.mouseY <= btnY + btnH) {
      p.startStopwatch();
      return;
    }

    // Reset hitbox
    if (p.mouseX >= resetX && p.mouseX <= resetX + btnW &&
        p.mouseY >= btnY && p.mouseY <= btnY + btnH) {
      p.resetStopwatch();
      return;
    }
  }

  

  p.windowResized = function () {  };
});