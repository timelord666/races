const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gameArea'),
      car = document.createElement('div'),
      mute = document.createElement('div'),
      diff = document.querySelector('.diff'),
      modal = document.querySelector('.modal-wrap'),
      close = document.querySelector('.close');

     
const music = new Audio('audio/Example-Kickstarts .mp3');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}      

const settings = {

    start: false,
    score: 0,
    speed: 3,
    trafic: 3

}







car.className = 'car';
mute.className = 'mute';
close.addEventListener('click', () => modal.classList.add('hide'));
diff.addEventListener('click', setDiff);
mute.addEventListener('click', musicSwitch);
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
saveLocal();



function startGame() {
    start.classList.add('hide');
    diff.className = 'hide';
    gameArea.innerHTML = '';
    document.body.appendChild(mute);
    car.style.left = '125px';
    car.style.top = 'auto';
    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.className = 'line';
        line.y = i * 100;
        line.style.top = `${line.y}px`;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * settings.trafic); i++) {
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        
        enemy.y = -100 * settings.trafic * (i + 1);
        
        enemy.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
        
        
        enemy.style.top = `${enemy.y}px`;
        let rand = Math.floor(Math.random() * 2);
        
        enemy.style.background = `transparent url('img/enemy${rand}.png ') center / cover no-repeat`;
        gameArea.appendChild(enemy);
        
        
    }
    settings.score = 0;
    settings.start = true;
    gameArea.appendChild(car);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    if (mute.className === 'mute') {
        
        music.play();
        
    }
    requestAnimationFrame(playGame);
    
}

function playGame() {

    
    
    if (settings.start === true) {

        settings.score += settings.speed;
        score.innerHTML = `SCORE<br>${settings.score}`;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && settings.x > 0) {

            settings.x -= settings.speed;
        }
        if (keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)) {

            settings.x += settings.speed;
        }
        if (keys.ArrowUp && settings.y > 0) {
    
            settings.y -= settings.speed;
        }
        if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) {

            settings.y += settings.speed;
        }
            
        car.style.left = `${settings.x}px`;
        car.style.top = `${settings.y}px`;
        requestAnimationFrame(playGame);
        
    }
}

function startRun(e) {
    e.preventDefault();
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft') {

        keys[e.key] = true;
    }
    
    
}

function stopRun(e) {
    e.preventDefault();
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        keys[e.key] = false;

    }
}


function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(line => {
        line.y += settings.speed;
        line.style.top = `${line.y}px`;
        if (line.y > document.documentElement.clientHeight) {
            line.y = -100;
        }
    })

}

function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = enemy.getBoundingClientRect();
        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            settings.start = false;
            music.pause();
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
            if (settings.score > localStorage.getItem('score')) {
                modal.classList.remove('hide');
                
            }
            saveLocal();
        }

        enemy.y += settings.speed / 2;
        enemy.style.top = `${enemy.y}px`
        if (enemy.y > document.documentElement.clientHeight) {

            enemy.y = -200 * settings.trafic;
            enemy.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
            let rand = Math.floor(Math.random() * 2);
            enemy.style.background = `transparent url('img/enemy${rand}.png ') center / cover no-repeat`;
        }
    })
}

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function musicSwitch() {
    if (mute.className === 'mute') {
        music.pause();
        mute.className = 'unMute';

    } else {
        music.play();
        mute.className = 'mute';
    }

}


function setDiff(e) {
    if (e.target.getAttribute('class') === 'light') {
        settings.trafic = 7;

    } else if (e.target.getAttribute('class') === 'medium') {
        settings.trafic = 3;
    } else {
        settings.trafic = 2;
    }

    diff.className = 'hide';
    
}

function saveLocal() {
    localStorage.setItem('score', settings.score);
}