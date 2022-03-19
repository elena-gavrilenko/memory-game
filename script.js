console.log(
  `самопроверка 60

  Вёрстка +10
  -реализован интерфейс игры +5
  -в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5
  Логика игры. Карточки, по которым кликнул игрок, переворачиваются согласно правилам игры +10
  Игра завершается, когда открыты все карточки +10
  По окончанию игры выводится её результат - количество ходов, которые понадобились для завершения игры +10
  Результаты последних 10 игр сохраняются в local storage. Есть таблица рекордов, в которой сохраняются результаты предыдущих 10 игр +10
  По клику на карточку – она переворачивается плавно, если пара не совпадает – обе карточки так же плавно переварачиваются рубашкой вверх +10`
);

const cards = document.querySelectorAll(".main__card");
const score = document.querySelector(".gameover__score");
const audio = document.querySelector("audio");
const over = document.querySelector(".gameover");
const resultsEl = document.querySelector(".gameover__results");
const button = document.querySelector(".gameover__button");
const src1 = "./assets/sound/click.mp3";
const src3 = "./assets/sound/zvon.mp3";
const src2 = "./assets/sound/open.mp3";

let hasTurnCard = false;
let isPlay = false;
let lock = false;
let firstCard, secondCard;
let arr = [];
let counter = 0;

function soundClick(src) {
  var audio = new Audio();
  audio.src = src;
  audio.autoplay = true;
}

function turnCard(event) {
  if (lock) return;
  const target = event.target.parentElement;
  target.classList.add("main__card_turn");
  if (!hasTurnCard) {
    hasTurnCard = true;
    firstCard = target;
  } else {
    hasTurnCard = false;
    secondCard = target;
    checkEquality();
  }
}

function turnOff() {
  firstCard.removeEventListener("click", turnCard);
  secondCard.removeEventListener("click", turnCard);
  soundClick(src2);
  arr.push(firstCard);
  arr.push(secondCard);
}

function deleteTurn() {
  lock = true;
  setTimeout(() => {
    firstCard.classList.remove("main__card_turn");
    secondCard.classList.remove("main__card_turn");
    resetLock();
  }, 1000);
}

function resetLock() {
  hasTurnCard = lock = false;
  firstCard = secondCard = null;
}

function checkEquality() {
  if (firstCard.dataset.character == secondCard.dataset.character) {
    turnOff();
  } else {
    deleteTurn();
  }
}

function getTime(timeStamp) {
  const date = new Date(timeStamp);
  return (
    ("0" + date.getDate()).slice(-2) +
    "." +
    ("0" + date.getMonth()).slice(-2) +
    "." +
    date.getFullYear() +
    "/" +
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2)
  );
}

function gameOver() {
  const valueFromLocalStorage = localStorage.getItem("result");
  let results = valueFromLocalStorage ? JSON.parse(valueFromLocalStorage) : [];

  resultsEl.innerHTML = "";
  results.forEach(({ counter, timeStamp }) => {
    resultsEl.insertAdjacentHTML(
      "afterbegin",
      `<li>${getTime(timeStamp)} - ${counter}</li>`
    );
  });
  score.innerHTML = `Score: ${counter}`;

  over.classList.add("gameover_visible");

  cards.forEach((elem) => {
    elem.classList.remove("main__card_turn");
    const reorder = Math.floor(Math.random() * cards.length);
    elem.style.order = reorder;
  });

  if (results.length === 10) {
    results.shift();
  }
  results.push({ timeStamp: new Date().getTime(), counter });
  localStorage.setItem("result", JSON.stringify(results));

  counter = 0;
  arr = [];
}

cards.forEach((cardEl) => {
  cardEl.addEventListener("click", (event) => {
    soundClick(src1);
    turnCard(event);
    counter += 1;
    if (arr.length == cards.length) {
      soundClick(src3);
      setTimeout(gameOver, 2000);
    }
  });
  const reorder = Math.floor(Math.random() * cards.length);
  cardEl.style.order = reorder;
});

button.addEventListener("click", () => {
  over.classList.remove("gameover_visible");
});
