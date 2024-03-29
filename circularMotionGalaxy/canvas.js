let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');

// Objects
let mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

let colors = [
    '#03045e',
    '#0077b6',
    '#00b4d8',
    '#90e0ef',
    '#caf0f8'
]

// Evvent Listeneers
addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
})
let mouseDown = false;

addEventListener('mousedown', function () {
    mouseDown = true;
})

addEventListener('mouseup', function () {
    mouseDown = false;
})



// Utility Functions

function randomIntGenerator(min, max) {
    return (Math.random() * (max - min) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function getDistance(x1, x2, y1, y2) {
    let X = x1 - x2;
    let Y = y1 - y2;

    return Math.pow((Math.pow(X, 2) + Math.pow(Y, 2)), 0.5);
}
// Constructors

class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        // randomizing radian will spown the particles at diff positions in the circle
        this.radians = randomIntGenerator(0, Math.PI * 2);
        this.velocity = 0.04;
        this.distFromCenter = randomIntGenerator(30, 550);
    }


    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.draw();
        // this increase the radian by slight amoaunt every frame
        this.radians += this.velocity / 100;

        // x is used to procide the inital position beacuse this.x will keep changing
        // cos will a value between -1 and 1 making an oscilating motion
        this.x = innerWidth / 2 + Math.cos(this.radians) * this.distFromCenter;
        // similarly sin will also give val between -1 and 1 but it will different from cos
        // If we use cos agian it won't create a circular motion
        this.y = innerHeight / 2 + Math.sin(this.radians) * this.distFromCenter;

    }
}

// Implementation
let particles = [];

function init() {
    particles = [];
    for (let i = 0; i < 300; i++) {
        let x = innerWidth / 2;
        let y = innerHeight / 2;
        let radius = randomIntGenerator(1, 2);
        let color = randomColor(colors);

        particles.push(new Particle(x, y, radius, color));
    }
}

let alpha = 1;

// Animate
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = `rgba(0,0,0,${alpha})`
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    if (mouseDown && alpha >= 0.01) {
        alpha -= 0.01;
        console.log(alpha)
    } else if (!mouseDown && alpha <= 1) {
        alpha += 0.01;
    }
}
init();
animate();