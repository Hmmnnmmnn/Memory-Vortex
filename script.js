// EMOJIS
const allEmojis = [
  "❤️","😍","👍","🙌",
  "⭐","🐱","🍀","🎈",
  "🌙","🍎","🎵","🐶",
  "🌻","⚽","🍕","🦋"
];

let currentLevel = "easy";
let gameEmojis = [];

let firstCard = null;
let secondCard = null;

let matched = 0;
let seconds = 0;
let lock = false;
let timer = null;


// START GAME
function startGame(level) {

  currentLevel = level;

  let pairCount;

  if (level === "easy") {
    pairCount = 4;
  } 
  else if (level === "normal") {
    pairCount = 6;
  } 
  else {
    pairCount = 8;
  }

  gameEmojis = allEmojis
    .slice(0, pairCount)
    .flatMap(emoji => [emoji, emoji]);

  document.getElementById("menu-screen")
    .classList.add("hidden");

  document.getElementById("game-screen")
    .classList.remove("hidden");

    /* makes the level title reflect the selected difficulty */
  document.getElementById("level-title").textContent =
    level.charAt(0).toUpperCase() +
    level.slice(1) + " Level";

  buildGame();
}


// BUILD GAME
function buildGame() {

  clearInterval(timer);

  seconds = 0;
  matched = 0;
  firstCard = null;
  secondCard = null;
  lock = false;

  document.getElementById("timer").textContent = "0";

  document.getElementById("match-count").textContent = "0";

  document.getElementById("message").textContent = "";

  let board = document.getElementById("board");

  board.innerHTML = "";

  let cards = [...gameEmojis];

  cards.sort(() => Math.random() - 0.5);

  cards.forEach(function(emoji) {

    let card = document.createElement("button");

    card.className = "card";
    card.type = "button";
    card.textContent = "?";

    card.dataset.emoji = emoji;

    card.setAttribute("aria-label", "Hidden card");

    card.onclick = function() {
      flipCard(card);
    };

    board.appendChild(card);

  });


  // TIMER
  timer = setInterval(function() {

    seconds++;

    document.getElementById("timer").textContent = seconds;

  }, 1000);

}


// FLIP CARD
function flipCard(card) {

  if (
    lock ||
    card.textContent !== "?" ||
    card.classList.contains("matched")
  ) {
    return;
  }

  card.textContent = card.dataset.emoji;

  card.setAttribute("aria-label", card.dataset.emoji);


  if (firstCard === null) {

    firstCard = card;

    return;

  }


  secondCard = card;

  lock = true;


  // CHECK MATCH
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {

    firstCard.classList.add("matched");

    secondCard.classList.add("matched");

    matched += 2;

    document.getElementById("match-count").textContent = matched / 2;

    firstCard = null;
    secondCard = null;

    lock = false;


    // WIN CONDITION
    if (matched === gameEmojis.length) {

      clearInterval(timer);

      document.getElementById("message").textContent =
        "🎉 You won! Completed in " + seconds + " seconds!";

    }

  } 
  else {

    // HIDE NON-MATCHING CARDS
    setTimeout(function() {

      firstCard.textContent = "?";

      secondCard.textContent = "?";

      firstCard.setAttribute("aria-label", "Hidden card");

      secondCard.setAttribute("aria-label", "Hidden card");

      firstCard = null;

      secondCard = null;

      lock = false;

    }, 800);

  }

}


// RESTART GAME
function restartGame() {

  buildGame();

}


// RETURN TO MENU
function goToMenu() {

  clearInterval(timer);

  document.getElementById("game-screen")
    .classList.add("hidden");

  document.getElementById("menu-screen")
    .classList.remove("hidden");

}
