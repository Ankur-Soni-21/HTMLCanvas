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

addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
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

function Particle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    // randomizing radian will spown the particles at diff positions in the circle
    this.radians = randomIntGenerator(0, Math.PI * 2);
    this.velocity = 0.04;
    this.distFromCenter = randomIntGenerator(75, 150);
    this.lastMouse = {
        x: x,
        y: y
    }


    this.draw = function (lastPoint) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.radius;
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.closePath();
    }

    this.update = function () {
        //drag effect from mouse
        //! what's happeing ? 
        //! for eg if my mouse moves from 0,0 to 100,100.
        //! then the diff in last and curr position is 100 in both axis, which is a big amount
        //! this leads to not so smooth drag effect since the center of rotation is changing by a big amount
        //! so instead of that we multiply this amount with 0.05 , i.e center will only mover 5px
        //! for every 100px moved leading to a smoother effect
        this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05

        const lastPoint = {
            x: this.x,
            y: this.y
        }
        // this increase the radian by slight amoaunt every frame
        this.radians += this.velocity;

        // x is used to procide the inital position beacuse this.x will keep changing
        // cos will a value between -1 and 1 making an oscilating motion
        this.x = this.lastMouse.x + Math.cos(this.radians) * this.distFromCenter;
        // similarly sin will also give val between -1 and 1 but it will different from cos
        // If we use cos agian it won't create a circular motion
        this.y = this.lastMouse.y + Math.sin(this.radians) * this.distFromCenter;
        this.draw(lastPoint);

    }
}

// Implementation
let particles = [];

function init() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        let x = innerWidth / 2;
        let y = innerHeight / 2;
        let radius = randomIntGenerator(2, 7);
        let color = randomColor(colors);

        particles.push(new Particle(x, y, radius, color));
    }
}

// Animate
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(255,255,255,0.09)'
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
}
init();
animate();