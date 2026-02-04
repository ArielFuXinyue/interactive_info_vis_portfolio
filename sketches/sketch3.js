// Instance-mode sketch for tab 3
// registerSketch('sk3', function (p) {
//   p.setup = function () {
//     p.createCanvas(p.windowWidth, p.windowHeight);
//   };
//   p.draw = function () {
//     p.background(240, 200, 200);
//     p.fill(180, 60, 60);
//     p.textSize(32);
//     p.textAlign(p.CENTER, p.CENTER);
//     p.text('HWK #4. B', p.width / 2, p.height / 2);
//   };
//   p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };


// });

// Example 2
registerSketch('sk3', function (p) {
  p.setup = function () {
    // p.createCanvas(p.windowWidth, p.windowHeight);
    p.createCanvas(800, 500);
    // clockFont = p.loadFont("digital-7.ttf");
  };

  // adding a tennis court background image
  let bgImg;
  p.preload = function () {
    bgImg = p.loadImage("images/tennis-court-background.avif");
  };

  

  p.draw = function () {
    p.image(bgImg, 0, 0, p.width, p.height);
    p.clock();
  }

  

  p.clock = function () {
    let h = p.hour();    // 0–23
    let m = p.minute(); // 0–59
    let s = p.second(); // 0–59

    // AM / PM
    let noon = h >= 12 ? " PM" : " AM";

    // convert to 12-hour format
    h = h % 12;
    if (h === 0) h = 12;

    // padded strings
    const label =
      h + ':' + p.nf(m, 2) + ':' + p.nf(s, 2) + noon;

    // draw text
    p.noStroke();
    p.fill("white");
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(p.width / 8);

    p.text(label, p.width / 2, p.height / 2 - 60);
  }

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});

