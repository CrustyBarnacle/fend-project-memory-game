/*
 * Create a list that holds all of your cards
 */
const deck_of_cards = document.querySelector('.deck'); // Our deck of cards
const userMoves = document.querySelector('.moves'); // Move counter element
const TOTAL_PAIRS = 8;

let flipped_cards = []; // Array to hold two flipped cards to compare
let moves = 0; // Track moves used and time spent
let matched = 0; // Number of matched pairs
let time = 0;
let clockOff = true; // Clock (timer/display) is not started (still at 0:00)
let clockId;
let score_stars = 3; // Starting number of stars

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


shuffleDeck(); // Shuffle cards, then add newly shuffledCards to page
userMoves.innerHTML = moves; // Moves shown set to zero

// Start listening for clicks, test for matching pairs
deck_of_cards.addEventListener('click', event => {
    const clickTarget = event.target;

    if (isClickValid(clickTarget)) {
        flipCard(clickTarget); // Also adds to flipped_cards
        if (clockOff) {
          startClock(); // Also sets clockOff = false;
        }

        if (flipped_cards.length === 2) {
            checkForMatch();
            addMove();
            updateScore(); // Hide, "remove", stars at 10 and 18 moves.
        }

        if (matched === TOTAL_PAIRS) {
            gameOver();
        }
    }
});


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function shuffleDeck() {
    // We need to create an Array from the nodelist returned by querySelectorAll
    const cards = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cards);

    for (card of shuffledCards) {
        deck_of_cards.appendChild(card); // Add cards to page
    }
}


function isClickValid(clickTarget){
    return (
        clickTarget.classList.contains('card') &&
        !clickTarget.classList.contains('match') &&
        flipped_cards.length < 2 &&
        !flipped_cards.includes(clickTarget)
    );
}


function flipCard(clickTarget) {
    clickTarget.classList.toggle('open');
    clickTarget.classList.toggle('show');
    flipped_cards.push(clickTarget); // Replaces addFlippedCard function and call.
}


function checkForMatch() {
    if (
        flipped_cards[0].firstElementChild.className ===
        flipped_cards[1].firstElementChild.className) {
            console.log('Cards Match!');
            flipped_cards[0].classList.toggle('match');
            flipped_cards[1].classList.toggle('match');
            flipped_cards = [];
            matched++;
    }

    else {
        console.log('Not a match :-(');
        setTimeout(() => {
            flipCard(flipped_cards[0]);
            flipCard(flipped_cards[1]);
            flipped_cards = [];
        }, 1000);

    }
}


function addMove() {
    moves++;
    userMoves.innerHTML = moves;
}


function updateScore() {
    const stars = document.querySelectorAll('.stars li');
    if (moves == 14 || moves == 22) {
        score_stars--;
        for (star of stars) {
          if (!star.classList.contains('hide')) {
            star.classList.add('hide');
            break;
          }
        }
    }
}

// Clock/timer functions
function startClock() {
    clockOff = false;
    clockId = setInterval(() => {
      time++;
      displayTime();
    }, 1000);
}


function displayTime() {
    const timer = document.querySelector('.timer');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (seconds < 10) {
        timer.innerHTML = `${minutes}:0${seconds}`;
    } else {
        timer.innerHTML = `${minutes}:${seconds}`;
    }
}


function stopClock() {
    clearInterval(clockId);
}

// Modal functions
function toggleModal() { // Update to use https://sweetalert2.github.io/ ?
    const modal = document.querySelector('.modal_background');
    modal.classList.toggle('hide');
}


function writeModalStats() {
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.timer').innerHTML;
    const movesStat = document.querySelector('.modal_moves');
    const starsStat = document.querySelector('.modal_stars');

    timeStat.innerHTML = `Time | ${clockTime}`;
    movesStat.innerHTML = `Move | ${moves}`;
    starsStat.innerHTML = `Stars | ${score_stars}`;
}


// Modal event listeners
document.querySelector('.modal_cancel').addEventListener('click', () => {
    toggleModal();
});
document.querySelector('.modal_replay').addEventListener('click', () => {
    replayGame();
});
document.querySelector('.restart').addEventListener('click', () => {
    resetGame();
});


// Reset the Game. Reset timer, moves, stars, and shuffles the deck.
function resetGame() {
    matched = 0;
    resetTimer();
    resetMoves();
    resetStars();
    resetCards();
    shuffleDeck();
}

function replayGame() {
    resetGame();
    toggleModal();
}


function resetTimer() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}


function resetMoves () {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}


function resetStars() {
    score_stars = 0;
    const stars = document.querySelectorAll('.stars li');
    for (star of stars) {
        star.classList.remove('hide');
    }
}


function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (card of cards) {
        card.className = 'card';
    }
}

// Game Over - All pairs matched
function gameOver() {
    stopClock();
    writeModalStats();
    toggleModal();
}
