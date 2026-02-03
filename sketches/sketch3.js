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
    p.createCanvas(p.windowWidth, p.windowHeight);
    // clockFont = p.loadFont("digital-7.ttf");
  };

  // adding a tennis court background image
  let bgImg;
  p.preload = function () {
    bgImg = p.loadImage("images/tennis-court-background.avif");
  };

  // change clock font
  

  p.draw = function () {
    p.image(bgImg, 0, 0, p.width, p.height);
    p.clock();
  }

  

  p.clock = function () {
    let hr = p.hour();
    let mn = p.minute();
    let sc = p.second();

    p.fill("white");
    // p.textFont(clockFont);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(p.width / 8);
    let noon = hr >= 12 ? " PM" : " AM"
    if (mn < 10)
      mn = "0" + mn
    hr %= 12
    p.text(hr + ":" + mn + ":" + sc + noon, p.width / 2, p.height / 2);

  }

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});

