let song;
let fft;
let particles = [];

function preload() {
    song = loadSound("sum-wave.mp3");
}

// Create the canvas for the visualizer
function setup() {
    createCanvas(innerWidth, innerHeight);
    angleMode(DEGREES);
    fft = new p5.FFT();
}

// Create particles that spawn on the visualizer circle and radiate outwards to edge of screen.
// Get amplitude from fourier transform of sound and add velocity vector to position of each particle
// when a given amplitude is exceeded.
class Particle {
    constructor() {
        this.position = p5.Vector.random2D().mult(250);
        this.velocity = createVector(0, 0);
        this.accel = this.position.copy().mult(random(0.0001, 0.00001));

        this.width = random(3, 5);

        this.color = [random(1, 255), random(1, 255), random(1, 255)]
    }
    update(cond) {
        this.velocity.add(this.accel);
        this.position.add(this.velocity);
        if (cond) {
            this.position.add(this.velocity);
            this.position.add(this.velocity);
            this.position.add(this.velocity);
        }
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

// Draw circular waveform from frequency data of song. Draw particles.
function draw() {
    background(0);
    stroke(255);
    strokeWeight(2);
    noFill();

    translate(width / 2, height / 2);

    fft.analyze();
    amp = fft.getEnergy(20, 200)

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
            particles[i].update(amp > 200);
            particles[i].show();
        } else {
            particles.splice(i, 1);
        }
    }
}

window.addEventListener('resize', () => {
    setup();
})

console.log(innerWidth)

// Play or pause song when button is clicked. Pause existing waveform display when song is paused
function playSound() {
    if (song.isPlaying()) {
        song.pause();
        noLoop();
    } else {
        song.play()
        loop();
    }
}

