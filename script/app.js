const $game = document.querySelector('.game');
const $cover = document.querySelector('.cover');
const $resetBtn = document.querySelector('.reset-btn');
const $statusGame = document.querySelector('.status-game');
const $clicks = $statusGame.children[0].children[0];
const $time = $statusGame.children[1].children[0];

$clicks.textContent = 0;
$time.textContent = '00:00:00';

const gameTime = () => {
  let startTime = new Date();
  return setInterval(() => {
    let timer = new Date(Date.now() - startTime);
    let hours = `0${timer.getUTCHours()}`.slice(-2);
    let minutes = `0${timer.getMinutes()}`.slice(-2);
    let seconds = `0${timer.getSeconds()}`.slice(-2);
    $time.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
};

const scrambled = (array) => {
  let index = array.length;
  let temp;
  let randomIndex;

  while (index > 0) {
    randomIndex = Math.floor(Math.random() * index);
    index--;

    temp = array[index];
    array[index] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
};

let firstCard = '';
let countToCompare = 0;
let countTotal = 0;
let saveTimer;
const $listCards = [];

document.addEventListener('click', (e) => {
  if (e.target.matches('.front') && countToCompare < 2) {
    let currentCard = e.target;
    $clicks.textContent++;
    countToCompare++;
    currentCard.parentElement.classList.add('show');

    if (firstCard === '') return (firstCard = currentCard);

    if (
      currentCard.previousElementSibling.getAttribute('src') !==
      firstCard.previousElementSibling.getAttribute('src')
    ) {
      setTimeout(() => {
        currentCard.parentElement.classList.remove('show');
        firstCard.parentElement.classList.remove('show');
        firstCard = '';
        countToCompare = 0;
      }, 1300);
    } else {
      firstCard = '';
      countToCompare = 0;
      countTotal += 2;
    }

    if (countTotal === 16) {
      setTimeout(() => {
        clearInterval(saveTimer);
        if ($cover.querySelector('.result')) {
          $cover.removeChild($cover.children[0]);
        }
        $cover.insertAdjacentHTML(
          'afterbegin',
          `
        <div class="result">
          <h3>You Win!</h3>
          <p>Total Clicks: <span>${$clicks.textContent}</span></p>
          <p>Time elapsed: <span>${$time.textContent}</span></p>
        </div>
              `
        );
        $clicks.textContent = 0;
        $time.textContent = '00:00:00';
        $cover.children[1].textContent = 'Play Again';
        $cover.style.transform = 'translateY(0%)';
        $resetBtn.style.display = 'none';
      }, 700);
    }
  }

  if (e.target.matches('.start-btn')) {
    $cover.style.transform = 'translateY(-100%)';
    saveTimer = gameTime();
    $game.querySelectorAll('.card').forEach((card) => {
      card.children[0].classList.remove('show');
      $listCards.push($game.removeChild(card));
    });
    scrambled($listCards).forEach((card) => {
      $game.appendChild(card);
    });
    countTotal = 0;
    $resetBtn.style.display = 'block';
  }

  if (e.target.matches('.reset-btn')) {
    clearInterval(saveTimer);
    $clicks.textContent = 0;
    $time.textContent = '00:00:00';
    $game.querySelectorAll('.card').forEach((card) => {
      card.children[0].classList.remove('show');
      $listCards.push($game.removeChild(card));
    });
    scrambled($listCards).forEach((card) => $game.appendChild(card));
    saveTimer = gameTime();
    countTotal = 0;
  }
});
