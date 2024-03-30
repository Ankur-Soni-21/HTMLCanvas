const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

//--------------------------------------------------------------------------------------------------------------------------------------------

const ctx = canvas.getContext('2d');

//--------------------------------------------------------------------------------------------------------------------------------------------

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn')
const modelEl = document.querySelector('#modelEl')
const scoreHeadEl = document.querySelector('#scoreHeadEl')
const bestScoreEl = document.querySelector('#bestScoreEl')
const playBtn = document.querySelector('#playBtn')
const pauseBtn = document.querySelector('#pauseBtn')

//--------------------------------------------------------------------------------------------------------------------------------------------

playBtn.style.display = 'flex';
pauseBtn.style.display = 'none';

//--------------------------------------------------------------------------------------------------------------------------------------------

let shootSound1 = new Audio('audio_assets/shoot1.wav')
let hitDamageSound1 = new Audio('audio_assets/hitDamage1.wav')
hitDamageSound1.volume = 0.5; 

// Objects
const colors = [
    '#00ccff',
    '#00ffcc',
    '#ffff00',
    '#ff00cc',
    '#cc00ff'
]
//--------------------------------------------------------------------------------------------------------------------------------------------

let enemies = [];
//--------------------------------------------------------------------------------------------------------------------------------------------

let projectiles = [];
//--------------------------------------------------------------------------------------------------------------------------------------------

let particles = [];
//--------------------------------------------------------------------------------------------------------------------------------------------
let stars = [];


//--------------------------------------------------------------------------------------------------------------------------------------------

// Utiltiy Functions
function randIntGen(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randFloatGen(min, max) {
    return Math.random() * (max - min + 1) + min

}
//--------------------------------------------------------------------------------------------------------------------------------------------


// Classes



//--------------------------------------------------------------------------------------------------------------------------------------------

class Player {
    constructor(x, y, radius, color) {
        this.xPos = x;
        this.yPos = y;
        this.initPos = {
            xPos: x,
            yPos: y
        }
        this.radius = radius;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    update() {
        // Move the player back to its original position
        if (this.xPos !== this.initPos.xPos) {
            this.xPos += (this.initPos.xPos - this.xPos) * 0.05;
        }
        if (this.yPos !== this.initPos.yPos) {
            this.yPos += (this.initPos.yPos - this.yPos) * 0.05;
        }
        this.draw();
    }
};

//--------------------------------------------------------------------------------------------------------------------------------------------

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.FinalPos = {
            xPos: innerWidth / 2,
            yPos: innerHeight / 2
        }
        this.InitPos = {
            xPos: x,
            yPos: y
        }
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.InitPos.xPos, this.InitPos.yPos, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.draw();
        this.InitPos.xPos += this.velocity.x;
        this.InitPos.yPos += this.velocity.y;
    }
};

//--------------------------------------------------------------------------------------------------------------------------------------------

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.FinalPos = {
            xPos: innerWidth / 2,
            yPos: innerHeight / 2
        }
        this.InitPos = {
            xPos: x,
            yPos: y
        }
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        ctx.save();

        ctx.shadowBlur = 20; // Adjust the value to get the desired glow effect
        ctx.shadowColor = this.color; // Change the color to the color of your glow

        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        ctx.arc(this.InitPos.xPos, this.InitPos.yPos, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        ctx.restore();
    }
    update() {
        this.draw();
        this.velocity.x *= 0.99 // friction for slowing effect
        this.velocity.y *= 0.99 // friction for slowing effect
        this.alpha -= 0.01;
        this.InitPos.xPos += this.velocity.x;
        this.InitPos.yPos += this.velocity.y;
    }
};

//--------------------------------------------------------------------------------------------------------------------------------------------

class Projectile {
    constructor(x, y, radius, color, velocity, angle) {
        this.InitPos = {
            xPos: innerWidth / 2,
            yPos: innerHeight / 2
        }
        this.FinalPos = {
            xPos: x,
            yPos: y
        }
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.angle = angle;
    }
    draw() {
        ctx.shadowBlur = 20; // Adjust the value to get the desired glow effect
        ctx.shadowColor = this.color; // Change the color to the color of your glow

        ctx.beginPath();
        ctx.arc(this.InitPos.xPos, this.InitPos.yPos, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    }
    update() {
        this.draw();

        this.InitPos.xPos += this.velocity.x;
        this.InitPos.yPos += this.velocity.y;
        if (this.InitPos.xPos - this.radius > innerWidth || this.InitPos.xPos + this.radius < 0) {
            projectiles.splice(projectiles.indexOf(this), 1);
        }
        if (this.InitPos.yPos - this.radius > innerHeight || this.InitPos.yPos + this.radius < 0) {
            projectiles.splice(projectiles.indexOf(this), 1);
        }
    }
};
//--------------------------------------------------------------------------------------------------------------------------------------------
class Star {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.alpha = 0.1;
        this.radians = randFloatGen(0, Math.PI * 2)
        this.distFromCenter = randFloatGen(350, innerWidth);
        this.velocity = 0.04;

    }

    draw() {
        // Set the glow effect
        ctx.save();

        ctx.shadowBlur = 40; // Adjust the value to get the desired glow effect
        ctx.shadowColor = this.color; // Change the color to the color of your glow

        // Draw your player
        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color; // Change the color to the color of your player
        ctx.fill();
        ctx.closePath();

        // Reset the glow effect
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.restore();

    }
    update() {
        this.radians += this.velocity / 75;
        this.x = innerWidth / 2 + Math.cos(this.radians) * this.distFromCenter;
        this.y = innerHeight / 2 + Math.sin(this.radians) * this.distFromCenter;
        this.draw();
    }
}

// Implementation

let player = new Player(innerWidth / 2, innerHeight / 2, 20, 'white');
let animationId;
let pauseAnimation = false;
let score = 0;

// LOCAL STORAGE
let scoreList = JSON.parse(localStorage.getItem('scoreList')) || [];
let bestScore = JSON.parse(localStorage.getItem('bestScore')) || 0;
bestScoreEl.innerHTML = bestScore;

// INITIALISZTION FUNCTION
function init() {
    enemies = [];
    projectiles = [];
    particles = [];
    stars = [];
    player = new Player(innerWidth / 2, innerHeight / 2, 20, 'white');
    score = 0;
    scoreEl.innerHTML = score;
    scoreHeadEl.innerHTML = score;
}

// INTERVAL ID
let spawnInterval;
let spawnTime = 2000;

// SPAWN ALGORITHM

function spawnEnemies() {
    clearInterval(spawnInterval);
    spawnInterval = setInterval(spawn, spawnTime);
}

function spawn() {
    let x = undefined;
    let y = undefined;
    const radius = randIntGen(15, 35);
    if (Math.random() > 0.5) {
        x = Math.random() > 0.5 ? -radius : innerWidth + radius;
        y = Math.random() * innerHeight;
    } else {
        x = Math.random() * innerWidth;
        y = Math.random() > 0.5 ? -radius : innerHeight + radius;
    }
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.atan2(innerHeight / 2 - y, innerWidth / 2 - x);
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    enemies.push(new Enemy(x, y, radius, color, velocity));

    // console.log('Spawn IT')
    spawnTime = Math.max(500, spawnTime * 0.995);
    clearInterval(spawnInterval);
    spawnInterval = setInterval(spawn, spawnTime)
}

function spawnStars() {
    for (let i = 0; i < 200; i++) {
        let radius = randFloatGen(0, 2);
        let x = randFloatGen(radius, innerWidth - radius);
        let y = randFloatGen(radius, innerHeight - radius);
        let color = colors[Math.floor(Math.random() * colors.length)];
        stars.push(new Star(x, y, radius, color));
    }
}


// ANIMATE FUNCTION
function animate() {
    // gameOver = false;
    if (pauseAnimation) {
        return;
    }

    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0,0,0,0.1)'
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    player.update();

    // Stars Background
    stars.forEach(star => {
        star.update();
        // console.log(star);
    });



    //Collision Particles
    particles.forEach(particle => {
        particle.update();
        if (particle.alpha <= 0) {
            particles.splice(particles.indexOf(particle), 1);
        }
    })

    projectiles.forEach(projectile => {
        projectile.update();
    });

    // console.log(projectiles.length);
    enemies.forEach(enemy => {
        enemy.update();
        // Player Collision Check
        //! FORMAULA FOR DISTANCE BETWEEN TWO POINTS : ( (X1-X2) ^ 2 - (Y1-Y2) ^ 2) ^ (1/2)
        const dist = Math.pow(Math.pow(enemy.InitPos.xPos - player.xPos, 2) + Math.pow(enemy.InitPos.yPos - player.yPos, 2), 0.5);
        if (dist - enemy.radius - player.radius < 2) {
            // gameOver = true;
            cancelAnimationFrame(animationId);
            clearInterval(spawnInterval);
            // init();
            modelEl.style.display = 'flex';
            scoreHeadEl.innerHTML = score;
            playBtn.style.display = 'flex';
            pauseBtn.style.display = 'none';
            scoreList.push(score);
            while (scoreList.length > 5) {
                const removedScore = scoreList.shift();
            }
            localStorage.setItem('scoreList', JSON.stringify(scoreList));
            bestScore = Math.max(Math.max(...scoreList), bestScore);
            bestScoreEl.innerHTML = bestScore;
            localStorage.setItem('bestScore', JSON.stringify(bestScore));
        }

        // Projectile Collision Check
        projectiles.forEach(projectile => {
            //! FORMAULA FOR DISTANCE BETWEEN TWO POINTS : ( (X1-X2) ^ 2 - (Y1-Y2) ^ 2) ^ (1/2)
            const dist = Math.pow(Math.pow(enemy.InitPos.xPos - projectile.InitPos.xPos, 2) + Math.pow(enemy.InitPos.yPos - projectile.InitPos.yPos, 2), 0.5);
            // console.log(dist - enemy.radius - projectile.radius);


            if (dist - enemy.radius - projectile.radius < 1) {
                // push effect for enemies
                const recoilDistance = 10;
                enemy.InitPos.xPos += recoilDistance * Math.cos(projectile.angle)
                enemy.InitPos.yPos += recoilDistance * Math.sin(projectile.angle)

                // audio effect for hit
                hitDamageSound1.currentTime = 0;
                hitDamageSound1.play();

                // create explosions
                for (let i = 0; i < enemy.radius * 3; i++) {
                    particles.push(new Particle(
                        projectile.InitPos.xPos, projectile.InitPos.yPos,
                        randIntGen(0, 2), enemy.color,
                        {
                            x: randIntGen(-0.5, 0.5) * Math.random() * 3,
                            y: randIntGen(-0.5, 0.5) * Math.random() * 3
                        }
                    ))
                }
                // console.log('hit')
                if (enemy.radius - 15 > 15) {
                    score += 100;
                    scoreEl.innerHTML = score;
                    gsap.to(enemy, {
                        radius: enemy.radius - 15
                    })
                    setTimeout(() => {
                        projectiles.splice(projectiles.indexOf(projectile), 1)

                    }, 0);
                } else {
                    score += 250;
                    scoreEl.innerHTML = score;
                    setTimeout(() => {
                        projectiles.splice(projectiles.indexOf(projectile), 1)
                        enemies.splice(enemies.indexOf(enemy), 1)
                    }, 0);
                }
            }
        });
    })
}

// Event Listeners

// PROJECTILE PATH 
addEventListener('click', function (event) {

    // Creating Projectiles
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
    const projectile = new Projectile(event.clientX, event.clientY, 5, 'white',
        {
            x: Math.cos(angle) * 4,
            y: Math.sin(angle) * 4
        },
        angle
    );
    projectiles.push(projectile);
    if (!pauseAnimation && playBtn.style.display == 'none') {
        // playing audio
        shootSound1.currentTime = 0;
        shootSound1.play();
    }
    // recoil
    const recoilDistance = 5;
    player.xPos -= recoilDistance * Math.cos(angle)
    player.yPos -= recoilDistance * Math.sin(angle)

})

// RESIZE WINDOW
addEventListener('resize', function () {
    canvas.width = this.innerWidth;
    canvas.height = this.innerHeight;
    init();
    spawnStars();
})

// PAUSE/PLAY 
addEventListener('keypress', function (event) {
    console.log(pauseAnimation);
    if (event.code == "Space") {
        if (pauseAnimation) {
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'flex';
            pauseAnimation = false;
            requestAnimationFrame(animate);
            spawnEnemies();
        }
        else {
            if (modelEl.style.display == 'flex') {
                playBtn.style.display = 'flex'
                pauseBtn.style.display = 'none'
                pauseAnimation = false;
            }
            else {
                playBtn.style.display = 'flex';
                pauseBtn.style.display = 'none';
                pauseAnimation = true;
                clearInterval(spawnInterval);
            }
        }
    }
})

// STARTGAME BTN
startGameBtn.addEventListener('click', () => {
    init();
    animate();
    spawnTime = 2000;
    spawnEnemies();
    spawnStars();
    modelEl.style.display = "none";
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
})

setInterval(() => {
    console.log(scoreList);
    console.log(bestScore);
    console.log(enemies);
    console.log(spawnTime);
    console.log(stars.length)
}, 1000);   