/**
* @description Variables
*/
// get deck holder element
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

// variable for rating counter
let ratingCounter = 0;

//container for counted moves
const movesContainer = document.querySelector('.moves');

// container for rating stars
const starsContainer = document.querySelector('.stars');

// collect all stars
const stars = document.querySelectorAll('.stars > li');

// make Array from stars
let starsArray = [...stars];

// get element for restart button
const reloadButton = document.querySelector('.restart');

// get element for replay game from modal bos
const replayButton = document.querySelector('.replay');

// Get the modal
const modal = document.getElementById('myModal');

// Get the element that closes the modal
const close = document.querySelector(".close");

// get span moves element in modal box
const moves = document.querySelector('.movesbox');

// game seconds
let gameSeconds = 0;

// get minutes and seconds in timer
let minutes = document.querySelectorAll('.minutes');
let seconds = document.querySelectorAll('.seconds');

// get ratingbox element in modal box
const ratingbox = document.querySelector('.ratingbox');

// start and end time variables
let startTime, endTime, timer;


//https://gist.github.com/evu/9739512

function isTouchDevice(){
		return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
}
/**
 * @description: Display the cards on the page
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

/**
 * @description: Creation of card board
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const displayCards = function(){
	// schuffel the card array
	let cardList = shuffle(cardsArray);

	// delete the innerHTML of the deck
	deck.innerHTML = '';

	// iterate through card array and remove all classes
	//then appennd the shuffled cards into deck container
	for (i=0; i< cardList.length; i++){
		cardList[i].classList.remove('open', 'show', 'match', 'animated', 'tada');
		deck.appendChild(cardList[i]);
	}
	// set Moves to 0
	movesContainer.innerHTML = movesCounter;

	//eventlistener for all Cards 
	for (let i=0; i < cardsArray.length; i++){
	  cards = cardsArray[i];
	  if (isTouchDevice()){
    	cards.addEventListener("touchstart", openCard);
  	}else{
    	cards.addEventListener('click', openCard);
  	}
	}

	// eventlistener for reload and replay button
  if (isTouchDevice()){
		reloadButton.addEventListener('touchstart', restartGame);
		replayButton.addEventListener('touchstart', restartGame);
	}else{
		reloadButton.addEventListener('click', restartGame);
		replayButton.addEventListener('click', restartGame);
	}
}


/*
 * set up the event listener for a card. If a card is clicked: - done - displayCards Function
 *  - display the card's symbol (put this functionality in another function that you call from this one) - done - openCard function
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) - done - openCard function
 *  - if the list already has another card, check to see if the two cards match - done checkMatch function
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one) - done checkMatch function
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one) - done checkMatch function
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one) - done checkMovesCounter
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one) - done checkMatch counter
 */


/**
* @description Game End Function
* check the amout of moves and hide stars in rating
* start the game timer on first call
*/

function gameEnd(){
	// stop the timer
	timer.stop();

	// fill the modal with the actual timer values
	seconds[1].innerHTML = formatTime(gameSeconds % 60);
	minutes[1].innerHTML = formatTime(parseInt(gameSeconds / 60));

	// fill the modal with amout of moves
	moves.innerHTML = movesCounter;

	// clear the ratingbox
	ratingbox.innerHTML = '';

	// fill the rating box depending on the ratingCounter
	for (let i = 0; i < ratingCounter; i++){
		let star = document.createElement('i');
		star.classList.add('fa', 'fa-star');
		ratingbox.appendChild(star);
	}

	// open the modal
	modal.style.display = "block";
}


/**
* @description Rating Function
* check the amout of moves and hide stars in rating
* start the game timer on first call
*/

function checkRating(){
	if(movesCounter >= 35){
		starsArray[0].classList.add('disabled');
		starsArray[1].classList.add('disabled');
		starsArray[2].classList.add('disabled');	
		ratingCounter = 0;
	}
	if(movesCounter >= 24 && movesCounter <=35){
		starsArray[0].classList.add('disabled');
		starsArray[1].classList.add('disabled');
		ratingCounter = 1;
	}
	if(movesCounter <= 24 && movesCounter >= 15){
		starsArray[0].classList.add('disabled');
		ratingCounter = 2;
	}
	if(movesCounter >= 8 && movesCounter <= 15){
		ratingCounter = 3;
	}
	if(movesCounter === 1){
		timer = new Timer(function() {
			++gameSeconds;
			seconds[0].innerHTML = formatTime(gameSeconds % 60);
			minutes[0].innerHTML = formatTime(parseInt(gameSeconds / 60));
		}, 1000);
	}
}


/**
* @description check amount of matching cards and end the game
*/

function checkMatchCounter(){

	// check amout of matching pairs
	if(matchCounter === 8){
		setTimeout(function(){

			// call the game end
			gameEnd();

		}, 1000)
	}
}

/**
* @description count moves and check if Game is finished
* increment movesCounter
* check status of game
*/

function checkMovesCounter(){

	//increment moves
	movesCounter +=1;

	// display the amout of moves
	movesContainer.innerHTML = movesCounter;

	// check if all matching pairs are open
	checkMatchCounter();
}


/**
* @description Function check if cards match
* increment match- and movesCounter
* push matching cards to seperate list
* empty the list of open cards
*/
function checkMatch(){
	// store each card in a variable
	let card_one = listOpenCards[0];
	let card_two = listOpenCards[1];

	// get the symbol of the card
	let card_one_symbol = card_one.innerHTML;
	let card_two_symbol = card_two.innerHTML;

	// check if symbol of elements match
	if(card_one_symbol === card_two_symbol){

		// remove animation classes
		card_one.classList.remove('animated', 'flipInY');
		card_two.classList.remove('animated', 'flipInY');

		// add annimation classes to elements 
		card_one.classList.add('match', 'animated', 'tada');
		card_two.classList.add('match', 'animated', 'tada');

		// push elements to list of matching elements
		listMatchCards.push(card_one, card_two);

		// increment matchCounter
		matchCounter +=1;

		// increment movesCounter
		checkMovesCounter();
	}else{
		// if cards not match reset everything
		// timeout needed 
		setTimeout(function(){
			// remove classes from elements
			card_one.classList.remove('open', 'show', 'animated', 'flipInY');
			card_two.classList.remove('open', 'show', 'animated', 'flipInY');

			// add eventlistener again
		  if (isTouchDevice()){
				card_one.addEventListener('touchstart',openCard);
				card_two.addEventListener('touchstart',openCard);
	  	}else{
	    	card_one.addEventListener('click',openCard);
				card_two.addEventListener('click',openCard);
	  	}
		}, 1000)	

		// call movesCounter function
		checkMovesCounter();

		// call check Rating function
		checkRating();
	}

	// empty list of open cards
	listOpenCards = [];
}



/**
* @description Open Card Function
* set classes and cal openCardList and calls check match function
*/

function openCard(target){
	// add classes to show the card and animate it
	target.target.classList.add('open', 'show', 'animated', 'flipInY');

	//avoid double click on already open card
	target.target.removeEventListener('click', openCard);

	// push the cards to a list with open cards
	listOpenCards.push(target.target);

	// check if 2 cards are in list
	if(listOpenCards.length === 2){
			checkMatch();
	}
}

/**
* @description Reset function
* reset all variables and classes
*/

function restartGame(){
	modal.style.display = "none";
	listMatchCards = [];
	listOpenCards = [];
	starsArray[0].classList.remove('disabled');
	starsArray[1].classList.remove('disabled');
	starsArray[2].classList.remove('disabled');	
	movesCounter = 0;
	matchCounter = 0;
	gameSeconds = 0;
	timer.stop();
	displayCards();
}

// When the user clicks on <span> (x), close the modal
close.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/**
* @description add missing 0 in timer output
* Credit to https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
*/
function formatTime(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

/**
* @description timer object
* Credits to https://stackoverflow.com/questions/8126466/javascript-reset-setinterval-back-to-0
*/

function Timer(fn, t) {
  var timerObj = setInterval(fn, t);

  this.stop = function() {
    if (timerObj) {
    	clearInterval(timerObj);
    	timerObj = null;
    }
    return this;
  }

  // start timer using current settings (if it's not already running)
  this.start = function() {
    if (!timerObj) {
      this.stop();
      timerObj = setInterval(fn, t);
    }
    return this;
  }

  // start with new interval, stop current interval
  this.reset = function(newT) {
    t = newT;
     return this.stop().start();
  }
}

// init Gameboard when dom content is loaded
document.addEventListener("DOMContentLoaded", function(event) {
	displayCards();
});

