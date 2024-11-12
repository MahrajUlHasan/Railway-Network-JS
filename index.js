const playerName = document.querySelector('#player-name-input').value;
let selectedDifficulty = null;
let timer = 0;
let interval;
let lvl = Math.ceil(Math.random() * 5);
const oasis = 'starter_eng/pics/tiles/oasis.png';
const empty = 'starter_eng/pics/tiles/empty.png';
const rail = 'starter_eng/pics/tiles/straight_rail.png';
const b_rail = 'starter_eng/pics/tiles/bridge_rail.png';
const c_rail = 'starter_eng/pics/tiles/curve_rail.png';
const m_rail = 'starter_eng/pics/tiles/mountain_rail.png';
const mountain = 'starter_eng/pics/tiles/mountain.png';
const bridge = 'starter_eng/pics/tiles/bridge.png';
let cells = [];
let gameCompleted = false;

const easy_lvls = [
    ['e', 'm-90', 'e', 'e', 'o', 'e', 'e', 'e', 'b-0', 'o', 'b-0', 'e', 'm-180', 'e', 'e', 'e', 'e', 'e', 'o', 'e', 'e', 'e', 'm-270', 'e', 'e'],
    ['e', 'm-90', 'e', 'e', 'o', 'e', 'e', 'e', 'b-0', 'o', 'b-0', 'e', 'm-180', 'e', 'e', 'e', 'e', 'e', 'o', 'e', 'e', 'e', 'm-270', 'e', 'e'],
    ['e', 'e', 'b-90', 'e', 'e', 'e', 'e', 'e', 'e', 'b-0', 'e', 'm-180', 'b-0', 'e', 'e', 'e', 'o', 'e', 'e', 'e', 'e', 'b-90', 'e', 'e', 'm-180'],
    ['e', 'e', 'e', 'b-90', 'e', 'e', 'e', 'e', 'e', 'e', 'b-0', 'e', 'm-90', 'e', 'm-90', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'o', 'm-270', 'e'],
    ['e', 'e', 'b-90', 'e', 'e', 'e', 'm-0', 'e', 'e', 'e', 'b-0', 'e', 'e', 'm-270', 'e', 'e', 'e', 'b-0', 'o', 'e', 'e', 'm-180', 'e', 'e', 'e']
];

const hard_lvls = [
    ['e', 'm-90', 'o', 'o', 'e', 'b-90', 'e', 'b-0', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'b-0', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'm-270', 'e', 'e', 'e', 'm-270', 'e', 'm-90', 'e', 'b-90', 'e', 'o', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'b-90', 'e', 'e', 'e'],
    ['e', 'e','o', 'e', 'e', 'e', 'e','b-0', 'e','b-90', 'e', 'e','m-180', 'e', 'e', 'e','b-90', 'e', 'e', 'e','b-0','m-0', 'e', 'e', 'e', 'e', 'e', 'e', 'e','o', 'e','m-90', 'e', 'e', 'e', 'e','m-0', 'e', 'e', 'e', 'e', 'e', 'e', 'e','o', 'e', 'e', 'e', 'e']
    ,['e', 'e','b-90', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e','b-0','o', 'e','m-270', 'e','b-90', 'e', 'e','b-0', 'e', 'e', 'e', 'e','m-90', 'e', 'e', 'e','o','m-270', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e','b-0', 'e','m-180', 'e', 'e', 'e','m-270', 'e', 'e', 'e', 'e', 'e','b-90', 'e','o', 'e','b-90', 'e', 'e', 'e','m-180', 'e','m-90', 'e', 'e','b-0', 'e', 'e', 'e', 'e','m-270', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
    ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e','m-0', 'e', 'e','b-90','b-90', 'e','m-90', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e','m-0', 'e','o', 'e', 'e', 'e','m-180', 'e','b-0',, 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e']

];


function checkFormValidity() {
    const playerName = document.querySelector('#player-name-input').value;
    const startButton = document.querySelector('#start-game');
    if (playerName && selectedDifficulty) {
        startButton.removeAttribute('disabled');
    } else {
        startButton.setAttribute('disabled', true);
    }
}

function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    document.querySelectorAll('.btn-outline').forEach(btn => btn.classList.remove('btn-active'));
    document.getElementById(difficulty).classList.add('btn-active');
    document.querySelector('#selected-difficulty').innerText = difficulty;
    checkFormValidity();
}

function startGame() {

    document.querySelector('#menu').classList.add('hidden');
    document.querySelector('#game-screen').classList.remove('hidden');
    const playerName = document.querySelector('#player-name-input').value;
    document.querySelector('#player-name').innerText = playerName;
    const difficulty_lvl = selectedDifficulty == '5x5' ? 'easy' : 'hard'
    const identifier = selectedDifficulty == '5x5' ? 'e' : 'd'
    const selectedBackground = `starter_eng/pics/levels/${difficulty_lvl}/level_${identifier}${lvl}.png`;
    document.querySelector('#grid').style.backgroundImage = `url(${selectedBackground})`;

    createGameGrid(selectedDifficulty === '5x5' ? 5 : 7);

    timer = 0;
    document.querySelector('#elapsed-time').innerText = '0:00';
    interval = setInterval(() => {
        timer++;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        document.querySelector('#elapsed-time').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function createGameGrid(size) {
    const grid = document.querySelector('#grid');
    grid.innerHTML = '';
    const cellSize = 100 / size;
    grid.style.gridTemplateColumns = `repeat(${size}, ${cellSize}%)`;
    grid.style.gridTemplateRows = `repeat(${size}, ${cellSize}%)`;
    let j = 0;

    let dif_lvl = selectedDifficulty == '5x5' ? easy_lvls : hard_lvls;
    let i = 0;
    dif_lvl[lvl - 1].forEach((s) => {
        let type = s.split('-')[0];
        let orient = parseInt(s.split('-')[1], 10);
        let newcell;
        switch (type) {
            case 'o':
                newcell = new Oasis(grid, i);
                break;
            case 'm':
                newcell = new Mountain(grid, i, orient);
                break;
            case 'b':
                newcell = new Bridge(grid, i, orient);
                break;
            case 'e':
                newcell = new Empty(grid, i, orient);
                break;
        }
        cells[i] = newcell;
        i++;
    })


}

function showRules() {
    document.querySelector('#menu').classList.add('hidden');
    document.querySelector('#rules').classList.remove('hidden');
    document.querySelector('#leaderboard').classList.add('hidden')
}

function hideRules() {
    document.querySelector('#rules').classList.add('hidden');
    document.querySelector('#menu').classList.remove('hidden');
    document.querySelector('#leaderboard').classList.remove('hidden')
}

function backToMenu() {
    clearInterval(interval);
    document.querySelector('#game-screen').classList.add('hidden');
    document.querySelector('#menu').classList.remove('hidden');
    document.querySelector('#leaderboard').classList.remove('hidden')
}

function validCell(cell, gridSize) {
    let isValid = true;
    if (cell instanceof Oasis) { return true; }
    if (cell.currentIndex === 0) { return false; }
    if (cell.opening.length === 0) { return true; }
    let c = 0;
    for (let i = 0; i < 4; i++) {
        if (cell.isConnected(i, gridSize)) { c++; }
    }
    return c === 2;
}


function checkCompletion() {
    let i = 0;
    let completion = true;
    cells.forEach(cell => {
        completion = completion && validCell(cell, (selectedDifficulty == '5x5' ? 5 : 7));
        console.log(validCell(cell, (selectedDifficulty == '5x5' ? 5 : 7)));
        i++;
    });
    i = 0;
    gameCompleted = completion;
    console.log(gameCompleted);

    if (gameCompleted) {
        clearInterval(interval);
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        const timeTaken = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        alert(`Congratulations, ${playerName}! You completed the railway in ${minutes}:${seconds < 10 ? '0' : ''}${seconds}.`);


        storeScore(timeTaken, selectedDifficulty);
        updateLeaderboard();
        backToMenu();
    }
}

function storeScore(time, difficulty) {
    const playerName = document.querySelector('#player-name-input').value;
    let leaderboardData = getLeaderboardData();
    leaderboardData.push({
        name: playerName,
        time: time,
        difficulty: difficulty
    });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
}

function getLeaderboardData() {
    let leaderboardData = localStorage.getItem('leaderboard');
    return leaderboardData ? JSON.parse(leaderboardData) : [];
}

function updateLeaderboard() {
    const leaderboardElement = document.querySelector('#leaderboard tbody');
    leaderboardElement.innerHTML = '';
    const leaderboardData = getLeaderboardData();

    leaderboardData.sort((a, b) => a.time.localeCompare(b.time) || a.time - b.time);
    const top10Entries = leaderboardData.slice(0, 10);

    top10Entries.forEach((entry, index) => {
        const row = leaderboardElement.insertRow();
        const rankCell = row.insertCell();
        const nameCell = row.insertCell();
        const timeCell = row.insertCell();
        const difficultyCell = row.insertCell();

        rankCell.textContent = index + 1;
        nameCell.textContent = entry.name;
        timeCell.textContent = entry.time;
        difficultyCell.textContent = entry.difficulty;
    });
}




class Cell {
    constructor(container, id) {
        this.currentImage;
        this.images = [];
        this.opening = [];
        this.id = id;
        this.orientation = 0;
        this.container = container;
        this.currentIndex = 0;


        this.d = document.createElement('div');
        this.d.classList.add('w-full', 'h-full', 'border', 'border-gray-300', 'game-cell', 'visible');

        this.d.setAttribute('id', `${id}`);
        this.d.addEventListener('click', this.changeImage.bind(this));
        this.d.addEventListener('contextmenu', this.removeImage.bind(this));


        this.container.appendChild(this.d);
    }

    changeImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
        this.currentImage = this.images[this.currentIndex];

    }

    removeImage(event) {
        event.preventDefault();
        this.currentIndex = 0;
        this.updateImage();
    }

    updateImage() {
        this.d.innerText = '';
        if (this.currentIndex !== -1) {
            const img = document.createElement('img');
            img.src = this.images[this.currentIndex];
            img.classList.add(`rotate-${this.orientation}`);
            this.d.appendChild(img);
        }
    }

    updateOpening() {
        if (this.opening.length === 0) return;

        for (let i = 0; i < this.opening.length; i++) {
            this.opening[i] = (this.opening[i] + this.orientation / 90) % 4;
        }
    }


    isConnected(direction, size) {

        if (!this.opening.includes(direction)) { return false; }
        let neighbourID;
        switch (direction) {
            case 0:
                neighbourID = this.id - size;
                break;
            case 1:
                neighbourID = this.id + 1;
                break;
            case 2:
                neighbourID = this.id + size;
                break;
            case 3:
                neighbourID = this.id - 1;
                break;
        }
        if (neighbourID < 0 || neighbourID > size * size) { return false; }
        let neighbour = cells[neighbourID];
        if (neighbour.currentIndex === 0) { return false; }
        return neighbour.opening.includes((direction + 2) % 4);
    }

}



class Mountain extends Cell {
    constructor(container, id, orientation) {
        super(container, id);
        this.opening = [1, 2];
        this.orientation = orientation;
        this.images = [mountain, m_rail];
        this.currentImage = this.images[0];
        this.updateImage();
        this.updateOpening();
    }

}

class Bridge extends Cell {
    constructor(container, id, orientation) {
        super(container, id);
        this.opening = [0, 2];
        this.orientation = orientation;
        this.images = [bridge, b_rail];
        this.currentImage = this.images[0];
        this.updateImage();
        this.updateOpening();
    }
}
class Oasis extends Cell {
    constructor(container, id) {
        super(container, id);
        this.opening = [];
        this.images = [oasis];
        this.currentImage = this.images[0];
        const img = document.createElement('img');
        img.src = this.images[this.currentIndex];
        this.d.appendChild(img);

    }
    updateImage() { }
}
class Empty extends Cell {
    constructor(container, id) {
        super(container, id);
        this.opening = [];
        this.images = [empty, rail, rail, c_rail, c_rail, c_rail, c_rail];
        this.currentImage = this.images[0];
        this.updateImage();
    }
    changeImage() {
        let cycle = [0, 0, 90, 0, 90, 180, 270]
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.orientation = cycle[this.currentIndex];
        this.updateImage();
        this.updateOpening();
        console.log(this.opening);
    }
    updateOpening() {

        switch (this.currentIndex) {
            case 0:
                this.opening = [];
                break;
            case 1:
                this.opening = [0, 2];
                break;
            case 2:
                this.opening = [1, 3];
                break;
            case 3:
                this.opening = [1, 2];
                break;
            case 4:
                this.opening = [2, 3];
                break;
            case 5:
                this.opening = [3, 0];
                break;
            case 6:
                this.opening = [0, 1];
                break;
        }
    }

}