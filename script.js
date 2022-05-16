let song;
let fft;
let particles = [];

function preload() {
    song = loadSound("sum-wave.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    fft = new p5.FFT();
}

function draw() {
    background(0);
    stroke(255);
    noFill();

    translate(width / 2, height / 2);

    let wave = fft.waveform();

    beginShape();
    for (let i = 0; i <= 180; i += 0.5) {
        let index = floor(map(i, 0, 180, 0, wave.length - 1))

        let r = map(wave[index], -1, 1, 150, 350);
        let x = r * sin(i);
        let y = r * cos(i);
        vertex(x, y);
    }
    endShape();
    beginShape();
    for (let i = 0; i <= 180; i += 0.5) {
        let index = floor(map(i, 0, 180, 0, wave.length - 1))

        let r = map(wave[index], -1, 1, 150, 350);
        let x = -r * sin(i);
        let y = r * cos(i);
        vertex(x, y);
    }
    endShape();

    let p = new Particle()
    particles.push(p);

    for (let i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].edges()) {
            particles[i].update();
            particles[i].show();
        } else {
            particles.splice(i, 1);
        }
    }
}

function playSound() {
    if (song.isPlaying()) {
        song.pause();
        noLoop();
    } else {
        song.play()
        loop();
    }
}

class Particle {
    constructor() {
        this.position = p5.Vector.random2D().mult(250);
        this.velocity = createVector(0, 0);
        this.accel = this.position.copy().mult(random(0.0001, 0.00001));

        this.width = random(3, 5);

        this.color = [random(1, 255), random(1, 255), random(1, 255)]
    }
    update() {
        this.velocity.add(this.accel);
        this.position.add(this.velocity);
    } 
    edges() {
        if (this.position.x < -width / 2 || this.position.x > width / 2 || this.position.y < -height / 2 || this.position.y > height / 2) {
            return true; 
        } else {
            return false;
        }
    }
    show() {
        noStroke()
        fill(this.color)
        ellipse(this.position.x, this.position.y, this.width);
    }
}