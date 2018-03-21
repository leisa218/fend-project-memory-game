/*
 * Create a list that holds all of your cards
 */
// container for cards 
const deck = document.querySelector('.deck ');

// get all cards
let cards = document.querySelectorAll('.card');

// create array from cards
let cardsArray = [...cards];

// list of open cards
let listOpenCards = [];

// list of matching cards
let listMatchCards = [];

// variabe for matches
let matchCounter = 0;

// variable for moves
let movesCounter = 0;

//container for moves
const movesContainer = document.querySelector('.moves');

//container for stars
const starsContainer = document.querySelectorAll('.stars > li');

// make Array from stars
let starsArray = [...starsContainer];

// get element for restart button
const reloadButton = document.querySelector('.restart');


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

const displayCards = function(){
	const sT = performance.now();
	// schuffel the card array
	let cardList = shuffle(cardsArray);
	// delete the innerHTML of the deck
	deck.innerHTML = '';
	// iterate through card array and remove all classes
	//then appennd the shuffled cards into deck container
	for (i=0; i< cardList.length; i++){
		cardList[i].classList.remove('open', 'show', 'match');
		deck.appendChild(cardList[i]);
	}
	// disable stars
	movesContainer.innerHTML = movesCounter;
	for(i=0; i< starsArray.length; i++){
		starsArray[i].classList.add('disabled');
	}
	const eT = performance.now();
	console.log(eT);
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// helper
displayCards();

function gameEnd(){
		// message game end and score
		alert('Game End');
}

function checkRating(){
	//console.log(movesCounter+ 'inside check rating function');
	if(movesCounter >= 24 ){
		starsArray[0].classList.remove('disabled');
	}
	if(movesCounter <= 24 && movesCounter >= 15){
		starsArray[0].classList.remove('disabled');
		starsArray[1].classList.remove('disabled');
	}
	if(movesCounter >= 8 && movesCounter <= 15){
		starsArray[0].classList.remove('disabled');
		starsArray[1].classList.remove('disabled');
		starsArray[2].classList.remove('disabled');
	}
}

function checkMatchCounter(){
	if(matchCounter === 8){
		checkRating();
		setTimeout(function(){
			gameEnd();
		}, 1000)
	}
}

function checkMovesCounter(){
	movesCounter +=1;
	movesContainer.innerHTML = movesCounter;
	checkMatchCounter();
}

function checkMatch(){
	// get content form open list elemenets
	let card_one = listOpenCards[0];
	let card_two = listOpenCards[1];
	let card_one_symbol = card_one.innerHTML;
	let card_two_symbol = card_two.innerHTML;
	// check if symbol of elements match
	if(card_one_symbol === card_two_symbol){
		// add classes to elements 
		card_one.classList.add('match');
		card_two.classList.add('match');
		// push elements to list of matching elements
		listMatchCards.push(card_one, card_two);
		matchCounter +=1;
		// count moves
		checkMovesCounter();
	}else{
		// timeout needed 
		setTimeout(function(){
			// remove classes from elements
			card_one.classList.remove('open', 'show');
			card_two.classList.remove('open', 'show');
		}, 1000)	
		// count moves
		checkMovesCounter();
	}	
	// empty list
	listOpenCards = [];
}

function checkOpenList(){
	if(listOpenCards.length === 2){
			checkMatch();
	}
}

function pushCardToOpenList(e){
	listOpenCards.push(e);
	checkOpenList();
}
//Open Card Functinon
function openCard(target){
	target.target.classList.add('open', 'show');
	pushCardToOpenList(target.target);
}

//eventlistener for all Cards 
for (let i=0; i <cardsArray.length; i++){
    cards = cardsArray[i];
    cards.addEventListener('click', openCard);
}

// set everything back to null and start the game again.
function restartGame(){
	listMatchCards = [];
	listOpenCards = [];
	movesCounter = 0;
	matchCounter = 0;
	displayCards();
}


// eventlistener for reload butten
reloadButton.addEventListener('click', restartGame);

