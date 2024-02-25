let img; // Existing image variable
let heartImg; // Variable for the new image
let dotSize = 5; // Adjust this value to change the size of the dots
let dots = []; // Array to store dot objects
let mass = 1.3; // Mass of the dots
let springConstant = 0.08; // Springiness control
let dampingCoefficient = 0.25; // Damping control
let mouseInteractionRadius = 60; // Radius for mouse interaction

function preload() {
  img = loadImage('stevengaby2.png'); // Existing image
  heartImg = loadImage('heart.png'); // Load the new image
}

function setup() {
  createCanvas(img.width, img.height);
  img.loadPixels();

  let skip = 3.5 // Adjust to reduce the number of dots
  for (let x = 0; x < img.width; x += skip) {
    for (let y = 0; y < img.height; y += skip) {
      let index = (floor(x) + floor(y) * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      // let a = img.pixels[index + 3]; // Alpha channel not needed for this comparison
      let pixelColor = color(r, g, b);

      // Make a dot for any pixel that is not white or nearly white
      // Adjust the threshold as needed, here it's set to exclude very light pixels
      if (!(r > 250 && g > 250 && b > 250)) {
        dots.push(new Dot(x, y, pixelColor));
      }
    }
  }
}


function draw() {
  background(255);
  
  // Display the heart image
  image(heartImg, 0, 0, width, height); // Adjust size as needed

  for (let dot of dots) {
    dot.update();
    dot.display();
  }
}

function mouseMoved() {
  dots.forEach(dot => {
    if (dist(dot.x, dot.y, mouseX, mouseY) < mouseInteractionRadius) {
      dot.interact(mouseX, mouseY);
    }
  });
}

function mouseClicked() {
  dots.forEach(dot => dot.returnToOrigin());
}

class Dot {
  constructor(x, y, pixelColor) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.pixelColor = pixelColor; // Store the pixel color
    this.opacity = 255; // New attribute for opacity
    this.targetX = x;
    this.targetY = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.returningToOrigin = false;
  }

  update() {
    let forceX = (this.targetX - this.x) * springConstant;
    let forceY = (this.targetY - this.y) * springConstant;
    let dampingForceX = -this.velocityX * dampingCoefficient;
    let dampingForceY = -this.velocityY * dampingCoefficient;
    let accelerationX = (forceX + dampingForceX) / mass;
    let accelerationY = (forceY + dampingForceY) / mass;
    this.velocityX += accelerationX;
    this.velocityY += accelerationY;
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  display() {
    // Extract RGB components of the pixelColor
    let r = red(this.pixelColor);
    let g = green(this.pixelColor);
    let b = blue(this.pixelColor);
    // Apply the current opacity
    fill(r, g, b, this.opacity);
    noStroke();
    ellipse(this.x, this.y, dotSize, dotSize);
  }
  

  interact(mx, my) {
    if (dist(this.x, this.y, mx, my) < mouseInteractionRadius) {
      this.targetX = random(width);
      this.targetY = random(height);
      this.returningToOrigin = false;
      this.opacity = 100; // Set opacity to 50%
    }
  }  

  returnToOrigin() {
    this.targetX = this.originalX;
    this.targetY = this.originalY;
    this.returningToOrigin = true;
    this.opacity = 255; // Reset opacity to 100%
  }
}
