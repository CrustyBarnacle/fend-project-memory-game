/*
 * Create a list that holds all of your cards
 */
const deck_of_cards = document.querySelector('.deck'); // Our deck of cards
const userMoves = document.querySelector('.moves'); // Move counter element

let flipped_cards = []; // Array to hold two flipped cards to compare
let moves = 0; // One move each time the user selects two cards to flip


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */ 
 
 
shuffleDeck(); // Shuffle cards, then add newly shuffledCards to page

// Start listening for clicks, test for matching pairs
deck_of_cards.addEventListener('click', event => {
    const clickTarget = event.target;

    if (isClickValid(clickTarget)) {
        flipCard(clickTarget);
        addFlippedCard(clickTarget);

        if (flipped_cards.length === 2) {
            checkForMatch();
        }
    }
});


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
        deck_of_cards.appendChild(card);
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
}


function addFlippedCard(clickTarget) {
    flipped_cards.push(clickTarget);
    console.log(flipped_cards);
}


function checkForMatch() {
    if (
        flipped_cards[0].firstElementChild.className ===
        flipped_cards[1].firstElementChild.className) {
            console.log('Cards Match!');
            flipped_cards[0].classList.toggle('match');
            flipped_cards[1].classList.toggle('match');
            flipped_cards = [];
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