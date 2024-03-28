let canvas = document.querySelector('canvas');
canvas.height = window.innerWidth;
canvas.width = window.innerWidth;

//context
let ctx = canvas.getContext('2d');

// Variables

let mouse = {
    x: 10,
    y: 10
}

// event listeners
addEventListener('resize', function () {
    canvas.height = window.innerWidth;
    canvas.width = window.innerWidth;

    init();
})

addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

// Constructor
function Circle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    this.update = function () {
        this.draw();
    }
}

// Utiltiy Functions 
function getDistance(x1, x2, y1, y2) {
    let circleX = x1 - x2;
    let circleY = y1 - y2;
    return Math.pow(Math.pow(circleX, 2) + Math.pow(circleY, 2), 0.5);
}

// Implementation
let circle1;
let circle2;

function init() {
    circle1 = new Circle(innerWidth / 2, innerHeight / 2, 50, 'black');
    circle2 = new Circle(20, 20, 20, 'red');
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    circle1.update();
    circle2.x = mouse.x;
    circle2.y = mouse.y;
    circle2.update();

    console.log(getDistance(circle1.x, circle2.x, circle1.y, circle2.y))

    let dist = getDistance(circle1.x, circle2.x, circle1.y, circle2.y)

    if ((dist - circle1.radius - circle2.radius) <= 0) {
        circle1.color = 'red';
    }
    else
        circle1.color = 'black';
}

init();
animate();