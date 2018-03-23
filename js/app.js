/*
 * Variables
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

let ratingCounter = 0;

//container for moves
const movesContainer = document.querySelector('.moves');

// get the box with the rating
const starsContainer = document.querySelector('.stars');

//collect all stars
const stars = document.querySelectorAll('.stars > li');

// make Array from stars
let starsArray = [...stars];

// get element for restart button
const reloadButton = document.querySelector('.restart');

// get element for replay game from modal bos
const replayButton = document.querySelector('.replay');

// Get the modal
const modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
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
	// reset moves
	movesContainer.innerHTML = movesCounter;
	//eventlistener for all Cards 
	for (let i=0; i < cardsArray.length; i++){
	    cards = cardsArray[i];
	    cards.addEventListener('click', openCard);
	}
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



// init Gameboard when dom content is loaded
document.addEventListener("DOMContentLoaded", function(event) {
	displayCards();
});

function gameEnd(){
	timer.stop();
	seconds[1].innerHTML = formatTime(gameSeconds % 60);
	minutes[1].innerHTML = formatTime(parseInt(gameSeconds / 60));
	modal.style.display = "block";
	moves.innerHTML = movesCounter;
	ratingbox.innerHTML = '';
	for (let i = 0; i < ratingCounter; i++){
		let star = document.createElement('i');
		star.classList.add('fa', 'fa-star');
		ratingbox.appendChild(star);
	}
}

function checkRating(){
	console.log(movesCounter);
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

function checkMatchCounter(){
	if(matchCounter === 8){
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
		card_one.classList.remove('animated', 'flipInY');
		card_two.classList.remove('animated', 'flipInY');
		// add classes to elements 
		card_one.classList.add('match', 'animated', 'tada');
		card_two.classList.add('match', 'animated', 'tada');
		// push elements to list of matching elements
		listMatchCards.push(card_one, card_two);
		matchCounter +=1;
		// count moves
		checkMovesCounter();
	}else{
		// timeout needed 
		setTimeout(function(){
			// remove classes from elements
			card_one.classList.remove('open', 'show', 'animated', 'flipInY');
			card_two.classList.remove('open', 'show', 'animated', 'flipInY');
			card_one.addEventListener('click',openCard);
			card_two.addEventListener('click',openCard);
		}, 1000)	
		// count moves
		checkMovesCounter();
		checkRating();
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
	target.target.classList.add('open', 'show', 'animated', 'flipInY');
	//avoid double click on already open card
	target.target.removeEventListener('click', openCard);
	pushCardToOpenList(target.target);
}

// set everything back to null and start the game again.
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

// eventlistener for reload and replay butten
reloadButton.addEventListener('click', restartGame);
replayButton.addEventListener('click', restartGame);


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

function formatTime(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

// Credits to https://stackoverflow.com/questions/8126466/javascript-reset-setinterval-back-to-0
// timer object

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

