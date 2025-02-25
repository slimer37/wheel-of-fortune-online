let isSettingLetter = false;
/** @type {HTMLCanvasElement} */
let selectedLetter = null;
/** @type {HTMLCanvasElement} */
let infobox;

let controlsPanel;

let letterList = [];
let slotElements = [];

let savedPuzzles = {};

const dingSfx = new Audio('assets/ding.wav');
const buzzerSfx = new Audio('assets/buzzer.mp3');
const dingLength = 1.2 * 1000;
const revealTimeAfterDing = 1.5 * 1000;

function setupBoard() {
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
}

function createSaveSlots() {

    function setupSlot(slot, index) {
        slotElements.push(slot);
        
        slot.firstElementChild.innerHTML = `${index + 1}:`;
        slot.children[1].addEventListener('click', () => saveBoard(index));
        slot.children[2].addEventListener('click', () => loadBoard(index));
    }

    const saveContainer = document.getElementById('save-container');
    const templateSlot = saveContainer.firstElementChild;

    setupSlot(templateSlot, 0);

    for (let i = 1; i < 10; i++) {
        const newSlot = templateSlot.cloneNode(true);
        saveContainer.appendChild(newSlot);
        
        setupSlot(newSlot, i);
    }
}

function saveBoard(key) {
    let anyFilled = false;

    savedPuzzles[key] = letterList.map(letter => {
        const char = letter.firstElementChild.innerText;

        if (char == '') return ' ';

        anyFilled = true;

        return char;
    });

    if (anyFilled) {
        slotElements[key].classList.add('filled-slot');
    } else {
        slotElements[key].classList.remove('filled-slot');
    }
}

function loadBoard(key) {
    savedPuzzles[key].forEach((letter, i) => {
        assignLetter(letterList[i], letter);
    });
}

function toggleMute() {
    if (dingSfx.muted) {
        dingSfx.muted = false;
        buzzerSfx.muted = false;
    } else {
        dingSfx.muted = true;
        buzzerSfx.muted = true;
    }
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
    letter.addEventListener('click', () => {
        startSettingLetter(letter);
    });

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

function assignLetter(letterElement, char) {
    letterElement.firstElementChild.innerText = char;

    if (char == ' ') {
        letterElement.classList.add("blank-letter");
    } else {
        letterElement.classList.remove("blank-letter");
    }
}

function onKeyPress(event) {
    if (event.ctrlKey) return;

    console.log(event.key)

    if (event.key == "`") {
        if (controlsPanel.style.visibility == 'visible') {
            controlsPanel.style.visibility = 'hidden';
        } else {
            controlsPanel.style.visibility = 'visible';
        }
        return;
    }

    if (isSettingLetter && (event.key === "Escape" || event.key === "Enter")) {
        stopSettingLetter();
    }

    if (event.key.length > 1) return;

    if (isSettingLetter && selectedLetter != null) {
        assignLetter(selectedLetter, event.key.toUpperCase());

        if (letterList.indexOf(selectedLetter) < letterList.length - 1) {
            let next = letterList[letterList.indexOf(selectedLetter) + 1];
            startSettingLetter(next);
        } else {
            stopSettingLetter();
        }
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
        if (!letter.classList.contains('blank-letter') && /[A-Z]/.test(letter.firstElementChild.innerText)) {
            letter.firstElementChild.style.color = 'white';
        }
    });
}

function revealSolution() {
    letterList.forEach(letter => letter.firstElementChild.style.removeProperty('color'));
}

function resetBoard() {
    letterList.forEach(letter => {
        letter.firstElementChild.innerText = '';
        letter.classList.add("blank-letter");
        revealLetter(letter);
    });
}

window.onload = function() {
    createSaveSlots();
    setupBoard();

    document.getElementById('loading-screen').style.display = 'none';
};

document.onkeydown = onKeyPress;