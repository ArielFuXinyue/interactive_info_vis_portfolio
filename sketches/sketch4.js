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

  p.draw = function () {
    p.image(bgImg, 0, 0, p.width, p.height);

    const tMs = getElapsedMs();
    const { hh, mm, ss } = msToHHMMSS(tMs);

    p.noStroke();
    p.fill("lightgray");
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(p.width / 8);

    p.text(`${hh}:${mm}:${ss}`, p.width / 2, p.height / 2 - 60);
  }

  // stopwatch
  let running = false;
  let startMs = 0;
  let elapsedMs = 0;

  function getElapsedMs() {
    // If running, time = (now - start) + previously saved time
    // If paused, time = previously saved time
    return running ? (p.millis() - startMs) + elapsedMs : elapsedMs;
  }

  function msToHHMMSS(ms) {
    const total = p.floor(ms / 1000); // total seconds
    const hh = p.floor(total / 3600);
    const mm = p.floor((total % 3600) / 60);
    const ss = total % 60;
    return { hh: p.nf(hh, 2), mm: p.nf(mm, 2), ss: p.nf(ss, 2) }; 
  }

  // p.clock = function () {
  //   let h = p.hour();    // 0–23
  //   let m = p.minute(); // 0–59
  //   let s = p.second(); // 0–59

  //   // AM / PM
  //   let noon = h >= 12 ? " PM" : " AM";

  //   // convert to 12-hour format
  //   h = h % 12;
  //   if (h === 0) h = 12;

  //   // padded strings
  //   const label =
  //     h + ':' + p.nf(m, 2) + ':' + p.nf(s, 2) + noon;

  //   // draw text
  //   p.noStroke();
  //   p.fill("lightgray");
  //   p.textAlign(p.CENTER, p.CENTER);
  //   p.textStyle(p.BOLD);
  //   p.textSize(p.width / 8);

  //   p.text(label, p.width / 2, p.height / 2 - 60);
  // }

  p.windowResized = function () {  };
});