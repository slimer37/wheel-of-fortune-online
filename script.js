let isSettingLetter = false;
/** @type {HTMLCanvasElement} */
let selectedLetter = null;
/** @type {HTMLCanvasElement} */
let infobox;

let controlsPanel;

let letterList = [];

const dingSfx = new Audio('assets/ding.wav');
const buzzerSfx = new Audio('assets/buzzer.mp3');
const dingLength = 1.2 * 1000;
const revealTimeAfterDing = 1.5 * 1000;

function loadBoard() {
    const letter = document.getElementById("letter");

    infobox = document.getElementById("infobox");

    infobox.innerText = '';

    controlsPanel = document.getElementById("controls");

    controlsPanel.style.visibility = 'visible';

    letter.firstElementChild.innerText = '';

    for (let i = 1; i < 14 * 4; i++) {
        const newLetter = letter.cloneNode(true);
        document.getElementById("board").appendChild(newLetter);

        setupLetter(newLetter);

        if (i == 13 || i == 14 * 3 || i == 14 * 4 - 1) {
            newLetter.style.visibility = 'hidden';
        } else {
            letterList.push(newLetter);
        }
    }

    letter.style.visibility = 'hidden';
    setupLetter(letter);

    document.getElementById('loading-screen').style.display = 'none';
}

function startSettingLetter(target) {
    if (selectedLetter != null) {
        selectedLetter.classList.remove("selected-letter");
    }

    isSettingLetter = true;
    selectedLetter = target;
    target.classList.add("selected-letter");

    infobox.innerText = 'Entering letter';
}

function setupLetter(letter) {
    letter.onclick = function () {
        startSettingLetter(letter);
    }

    letter.classList.add("blank-letter");
}

function blueLetter(letter) {
    letter.style.backgroundColor = 'blue';
    letter.firstElementChild.style.color = 'blue';

    dingSfx.currentTime = 0;
    dingSfx.play();
}

function revealLetter(letter) {
    letter.style.removeProperty('background-color');
    letter.firstElementChild.style.removeProperty('color');
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function revealMatchingLetters(targetLetter) {
    let i = 0;
    let foundAny = false;
    
    let shuffledLetters = shuffle(letterList.slice());

    shuffledLetters.forEach(letter => {
        if (letter.firstElementChild.innerText === targetLetter && letter.firstElementChild.style.color == 'white') {
            window.setTimeout(() => blueLetter(letter), i * dingLength);
            window.setTimeout(() => revealLetter(letter), i * dingLength + revealTimeAfterDing);
            i++;
            foundAny = true;
        }
    });

    if (!foundAny) {
        buzzerSfx.currentTime = 0;
        buzzerSfx.play();
    }

    infobox.innerText = `Revealing ${i} ${targetLetter}'s...`;

    window.setTimeout(() => infobox.innerText = '', (i - 1) * dingLength + revealTimeAfterDing);
}

function onKeyPress(event) {
    console.log(event.key)

    if (event.key == "`") {
        if (controlsPanel.style.visibility == 'visible') {
            controlsPanel.style.visibility = 'hidden';
        } else {
            controlsPanel.style.visibility = 'visible';
        }
        return;
    }

    if (isSettingLetter && (event.key === "Escape" || event.key === "Backspace")) {
        stopSettingLetter();
    }

    if (event.key.length > 1 || !/[a-zA-Z0-9- ]/.test(event.key)) return;

    if (isSettingLetter && selectedLetter != null) {
        selectedLetter.firstElementChild.innerText = event.key.toUpperCase();

        if (event.key == ' ') {
            selectedLetter.classList.add("blank-letter");
        } else {
            selectedLetter.classList.remove("blank-letter");
        }

        stopSettingLetter();
    } else if (!isSettingLetter) {
        revealMatchingLetters(event.key.toUpperCase());
    }
}

function stopSettingLetter() {
    if (selectedLetter != null) {
        selectedLetter.classList.remove("selected-letter");
    }

    selectedLetter = null;
    isSettingLetter = false;

    infobox.innerText = '';
}

function hideSolution() {
    letterList.forEach(letter => {
        if (!letter.classList.contains('blank-letter')) {
            letter.firstElementChild.style.color = 'white';
        }
    });
}

function revealSolution() {
    letterList.forEach(letter => letter.firstElementChild.style.removeProperty('color'));
}

window.onload = loadBoard;

document.onkeydown = onKeyPress;