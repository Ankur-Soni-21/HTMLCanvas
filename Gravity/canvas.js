let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
})

window.addEventListener('click', function () {
    // console.log('h');
    init();
});

let colors = [
    '#03045e',
    '#0077b6',
    '#00b4d8',
    '#90e0ef',
    '#caf0f8'
]

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}


let g = 1;
let fric = 0.95;

function Ball(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.dy = dy;
    this.dx = dx;
    this.g = g;
    this.fric = fric;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    this.update = function () {
        if (this.x + this.radius + this.dx > innerWidth || this.x - this.radius <= 0) {
            this.dx = -this.dx;
            // this.dx = this.dx * fric;
        }

        if (this.y + this.radius + this.dy > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
            //friction
            this.dy = this.dy * fric;
        }
        else {
            // implementing gravity
            this.dy += this.g;
        }



        this.x += this.dx;
        this.y += this.dy
        // console.log(this.dx)
        // console.log(this.x)
        this.draw();
    }
}

let ballArray;

function init() {
    ballArray = [];
    for (let i = 0; i < 100; i++) {
        let radius = randomIntFromRange(8, 20);
        let x = randomIntFromRange(radius, innerWidth - radius)
        let y = randomIntFromRange(radius, innerHeight - radius);
        let dx = randomIntFromRange(-2, 2)
        let dy = randomIntFromRange(-2, 2)
        let color = randomColor(colors);
        ballArray.push(new Ball(x, y, dx, dy, radius, color));
        // console.log(ballArray);
    }
}
init();

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < ballArray.length; i++) {
        ballArray[i].update();
    }
}
animate();