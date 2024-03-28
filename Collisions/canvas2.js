let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');

// Objects
let mouse = {
    x: undefined,
    y: undefined
}

let colors = [
    '#03045e',
    '#0077b6',
    '#00b4d8',
    '#90e0ef',
    '#caf0f8'
]

let particles;

// Event Listeners
addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
})

addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

// Utitlty Functions
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

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // this is to avoid sticking together 
    // if velocity x and y diff is 0 then it means both objects are at halt so no change shall be done 
    // same thing for x and y dist diff 
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        let mass1 = particle.mass;
        let mass2 = otherParticle.mass;

        let dx1 = particle.velocity.x;
        let dx2 = otherParticle.velocity.x

        let dy1 = particle.velocity.y;
        let dy2 = otherParticle.velocity.y;

        let finaldx1 = (dx1 * (mass1 - mass2) + 2 * mass2 * dx2) / (mass1 + mass2);
        let finaldy1 = (dy1 * (mass1 - mass2) + 2 * mass2 * dy2) / (mass1 + mass2);
        let finaldx2 = (dx2 * (mass2 - mass1) + 2 * mass1 * dx1) / (mass1 + mass2);
        let finaldy2 = (dy2 * (mass2 - mass1) + 2 * mass1 * dy1) / (mass1 + mass2);

        particle.velocity.x = finaldx1;
        particle.velocity.y = finaldy1;

        otherParticle.velocity.x = finaldx2;
        otherParticle.velocity.y = finaldy2;
    }
}

// Constructors
function Particle(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;
    this.velocity = {
        x: randomIntGenerator(-1, 1),
        y: randomIntGenerator(-1, 1),
    }

    this.draw = function () {
        ctx.beginPath();
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        // ctx.fillStyle = 'white'
        // https://www.tutorialspoint.com/html5/canvas_states.htm
        //! we save the default with no fill or stroke style state into a stack
        ctx.save();
        // set opacity
        ctx.globalAlpha = this.opacity;
        // change fill color
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //! restore back to the defualt state which has no fill style yet and apply stroke style to it
        ctx.restore();

        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    }

    this.update = function (particles) {
        this.draw();

        for (let i = 0; i < particles.length; i++) {
            if (this === particles[i]) continue;

            if (this.x + this.width >= particles[i].x && this.x <= particles[i].x + particles[i].width && (this.y + this.height >= particles[i].y && this.y <= particles[i].y + particles[i].height)) {
                console.log('collsions')
                resolveCollision(this, particles[i]);
            }
        }

        if (this.x + this.width > innerWidth || this.x - this.width < 0) {
            this.velocity.x = - this.velocity.x;
        }
        if (this.y + this.height > innerHeight || this.y - this.height < 0) {
            this.velocity.y = -this.velocity.y;
        }

        if (getDistance(this.x, mouse.x, this.y, mouse.y) < 100) {
            this.opacity += 0.2;
            console.log('c');
        }
        else {
            this.opacity = this.opacity > 0 ? this.opacity - 0.2 : 0;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}


// Implementation
function init() {
    particles = [];
    for (let i = 0; i < 250; i++) {
        let width = randomIntGenerator(20, 30);
        let height = randomIntGenerator(25, 30);
        let x = randomIntGenerator(width, innerWidth - width);
        let y = randomIntGenerator(height, innerHeight - height);
        let color = randomColor(colors);


        if (i !== 0) {
            for (let j = 0; j < particles.length; j++) {
                if (getDistance(x, particles[j].x, y, particles[j].y) - width - particles[j].width < 0) {
                    x = randomIntGenerator(width, innerWidth - width);
                    y = randomIntGenerator(height, innerHeight - height);
                    //restart loop
                    j = -1;
                }
            }
        }


        particles.push(new Particle(x, y, width, height, color));
    }
}

// Animation
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach(particle => {
        particle.update(particles);
    });
}

init();
animate();