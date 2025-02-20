let isSettingLetter = false;
/** @type {HTMLCanvasElement} */
let selectedLetter = null;
/** @type {HTMLCanvasElement} */
let infobox;

function loadBoard() {
    const letter = document.getElementById("letter");

    infobox = document.getElementById("infobox");

    infobox.innerText = '';

    letter.firstElementChild.innerText = '';

    for (let i = 1; i < 14 * 4; i++) {
        const newLetter = letter.cloneNode(true);
        document.getElementById("board").appendChild(newLetter);

        setupLetter(newLetter);

        if (i == 13 || i == 14 * 3 || i == 14 * 4 - 1) {
            newLetter.style.visibility = 'hidden';
        }
    }

    letter.style.visibility = 'hidden';
    setupLetter(letter);
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
    letter.onclick = function() {
        startSettingLetter(letter);
    }

    letter.classList.add("blank-letter");
}

function onKeyPress(event) {
    console.log(event.key)

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

window.onload = loadBoard;

document.onkeydown = onKeyPress;