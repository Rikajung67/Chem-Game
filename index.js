const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let matchedPairs = 0; // Track the number of matched pairs

document.querySelector(".score").textContent = score;

fetch("data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  
  this.classList.add("flipped");
  const flipSound = document.getElementById("flipSound");
  flipSound.play();
  
  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
    matchedPairs++;
    
    if (matchedPairs === cards.length / 2) {
      if (score <= 15) {
        setTimeout(() => {
          alert("เก่งมาก");
          window.location.href = "https://chem-map.vercel.app/"; // Redirect to a new page
        }, 500);
        const winSound = document.getElementById("winSound");
        winSound.play();
      } else {
        setTimeout(() => {
          alert("เก่งมาก แต่คราวหน้าต้องน้อยกว่า 15 ครั้งนะถึงจะผ่านด่าน");
          restart();  // Automatically restart the game after the alert is closed
        }, 500);
        const overSound = document.getElementById("overSound");
        if (overSound) {
          overSound.play();
        } else {
          console.error("Over sound element not found");
        }
      }
    }
  } else {
    unflipCards();
  }
}


function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  matchedPairs = 0; // Reset the matched pairs count
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}
