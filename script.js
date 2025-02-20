function loadBoard() {
    const letter = document.getElementById("letter");

    for (let i = 1; i < 14 * 4; i++) {
        const newLetter = letter.cloneNode();
        document.getElementById("board").appendChild(newLetter);

        if (i == 13 || i == 14 * 3 || i == 14 * 4 - 1) {
            newLetter.style.visibility = 'hidden';
        }
    }

    letter.style.visibility = 'hidden';
}

window.onload = loadBoard;