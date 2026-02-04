// Example 2
registerSketch('sk3', function (p) {
  p.setup = function () {
    // p.createCanvas(p.windowWidth, p.windowHeight);
    p.createCanvas(800, 500);
  };

  // adding a tennis court background image
  let bgImg;
  let ballImg;
  p.preload = function () {
    bgImg = p.loadImage("images/tennis-court-background.avif");
    ballImg = p.loadImage("images/tennis_ball.webp");
  };

  p.draw = function () {
    p.image(bgImg, 0, 0, p.width, p.height);
    p.clock();
    
    p.sliderSeconds();
    p.sliderMinutes();
    p.sliderHours();
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
    p.fill("lightgray");
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(p.width / 8);

    p.text(label, p.width / 2, p.height / 2 - 60);
  }

  p.sliderSeconds = function() {
    let s = p.second();
    let progress = s / 59.0; // 0..1

    // locate below the time
    let y = p.height / 2 + 40;

    // bar length inproportion to the canvas
    let left = p.width * 0.2;
    let right = p.width * 0.8;
    let barWidth = right - left; 

    // label
    p.fill(230);
    p.textSize(12);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("SEC", left - 10, y);

    // bar thickness and rounding
    let trackH = 10;
    let radius = trackH / 2;

    // draw the bar
    p.noStroke();
    p.fill(255, 255, 255, 160);
    p.rect(left, y - trackH / 2, barWidth, trackH, radius);

    // filled bar portion
    let x = p.lerp(left, right, progress);
    p.fill(255, 255, 255, 200);
    p.rect(left, y - trackH / 2, x - left, trackH, radius);

    // tennis ball
    let ballSize = 40;
    p.imageMode(p.CENTER);
    p.image(ballImg, x, y, ballSize, ballSize);
    p.imageMode(p.CORNER);
  }

  p.sliderMinutes = function() {
    let m = p.minute();
    let s = p.second();

    // smooth minute progress
    let progress = (m + s / 60.0) / 59.0;

    // place below the seconds bar
    let y = p.height / 2 + 85;

    let left = p.width * 0.2;
    let right = p.width * 0.8;
    let barWidth = right - left;

    // label
    p.fill(180, 220, 180);
    p.textSize(12);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("MIN", left - 10, y);

    let trackH = 18;
    let radius = trackH / 2;

    // track
    p.noStroke();
    p.fill(255, 255, 255, 140);
    p.rect(left, y - trackH / 2, barWidth, trackH, radius);

    // fill
    let x = p.lerp(left, right, progress);
    p.fill(180, 220, 180, 230);
    p.rect(left, y - trackH / 2, x - left, trackH, radius);

    // ball (slightly smaller than seconds)
    let ballSize = 40;
    p.imageMode(p.CENTER);
    p.image(ballImg, x, y, ballSize, ballSize);
    p.imageMode(p.CORNER);
  }

  p.sliderHours = function () {
    let hIndex = p.hour() % 12; // 0..11
    let m = p.minute();

    // smooth hour progress 
    let progress = (hIndex + m / 60.0) / 12.0; // 0.. <1

    // place below the minutes bar
    let y = p.height / 2 + 130;

    let left = p.width * 0.2;
    let right = p.width * 0.8;
    let barWidth = right - left;

    // label
    p.fill(100, 220, 120);
    p.textSize(12);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("HR", left - 10, y);

    let trackH = 28;
    let radius = trackH / 2;

    // track
    p.noStroke();
    p.fill(255, 255, 255, 120);
    p.rect(left, y - trackH / 2, barWidth, trackH, radius);

    // fill
    let x = p.lerp(left, right, progress);
    p.fill(100, 220, 120, 230);
    p.rect(left, y - trackH / 2, x - left, trackH, radius);

    // ball (smallest)
    let ballSize = 40;
    p.imageMode(p.CENTER);
    p.image(ballImg, x, y, ballSize, ballSize);
    p.imageMode(p.CORNER);
  };

  p.windowResized = function () {  };
});

