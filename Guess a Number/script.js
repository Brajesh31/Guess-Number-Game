// Global variables
const menuBtn = document.querySelector('.material-symbols-outlined');
const userInput = document.getElementById('inputNumber');
const main = document.getElementById('main');
const notificationContainer = document.createElement('div');
notificationContainer.setAttribute('id', 'answerBanner');
main.appendChild(notificationContainer);

let refNumber, randomNumber2, randomNumber3, countdown, time = 90, totalTime = time;
let rightGuess = 0, wrongGuess = 0, isNotificationShowing = false;
const timerDisplay = document.querySelector("#time");
const circle = document.getElementById("circle");
const row3 = document.querySelector('.row3');
const row4 = document.querySelector('.row4');
const startBtn = document.getElementById('startBtn');
const checkBtn = document.getElementById('checkBtn');

//=========================Toggling instructions box for smaller screen===========
menuBtn.addEventListener('click', function() {
  document.querySelectorAll('.instructions').forEach((item) => {
    item.classList.toggle('showInstructions');
  })
})
//================================Generate Number Function=====================
function generateNumbers() {
  refNumber = Math.floor(Math.random() * 100 + 1);
  do {
    randomNumber2 = Math.floor(Math.random() * 100 + 1);
    randomNumber3 = Math.floor(Math.random() * 100 + 1);
  } while (randomNumber2 === refNumber || randomNumber3 === refNumber || randomNumber3 === randomNumber2);
}
generateNumbers();


//=============================Function On Random Card=========================
function numberOnRandomCard() {
  document.querySelectorAll('.card').forEach(card => card.innerText = " ");
  const randomCard = Math.floor(Math.random() * 3 + 1);
  document.getElementById(`card${randomCard}`).innerText = refNumber;
  document.getElementById(`card${(randomCard % 3) + 1}`).innerText = randomNumber2;
  document.getElementById(`card${(randomCard + 1) % 3 + 1}`).innerText = randomNumber3;
}

// ==========================Notification Function================================
function notification(message, bgColor) {   
  if (isNotificationShowing) return;
  isNotificationShowing = true;                    
  const answerBanner = document.getElementById('answerBanner');
  answerBanner.innerText = message;
  answerBanner.style.background = bgColor;
  answerBanner.style.display = 'block';
  answerBanner.classList.add('showBanner');
  playWarningSound();
  setTimeout(() => {
    answerBanner.classList.remove('showBanner');
    answerBanner.style.display = 'none';
        generateNumbers();
        numberOnRandomCard();
        isNotificationShowing = false;
  }, 1000)
}

//===========================End result Banner function==========================
function endRusult(message, bgColor) {
  const resultDiv = document.createElement('div');
  resultDiv.setAttribute('id', 'resultBanner');
  resultDiv.style.background = bgColor;
  resultDiv.innerHTML = `<span class="close-btn">&times;</span><br><p>${message}</p>`;
  resultDiv.querySelector('.close-btn').onclick = () => {
    resultDiv.style.animation = 'fadeOut 0.5s ease-in-out';
    setTimeout(() => {
      main.removeChild(resultDiv);
      window.location.reload();
    }, 500);
  };
  main.appendChild(resultDiv);
  setTimeout(() => resultDiv.querySelector('span').click(), 5000);
}

//==========================Check Button Click Function==========================
function checkButtonClickAction() {
  if (checkBtn.disabled || isNotificationShowing) return;
  checkBtn.disabled = true;
  const userValue = parseInt(userInput.value.trim());

  if (!userInput.value.trim() || isNaN(userValue)) {
    notification('🚫Please Enter a Valid Number', 'orange');
  }
  else if (userValue === refNumber) {
    notification('✔️ Right Answer', 'lightgreen');
    rightGuess++;
  }
  else {
    notification('❌ Wrong Answer', 'lightcoral');
    wrongGuess++;
  }
  //===========Keyboard Submit Integration================
  userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      checkBtn.click();
      // checkButtonClickAction();
    }
  });
  

  heartLogic();
  userInput.value = '';
  userInput.focus();
  setTimeout(() => {
    checkBtn.disabled = false;
    isNotificationShowing = false;
  }, 1000)
}

// ======================Timer Function===============================
function startTimer() {
  clearInterval(countdown);
  timerDisplay.textContent = "1:30"; 
  circle.style.background = "conic-gradient(#ddd 0deg, #ddd 360deg)";

  countdown = setInterval(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    const percentage = ((totalTime - time) / totalTime) * 360;
    circle.style.background = `conic-gradient(#ff5722 ${percentage}deg, #ddd ${percentage}deg)`;
    if (time-- === 0) {
      clearInterval(countdown);
      endRusult(rightGuess >= 10 ? `✌️Congratulations! You Won🎯` : `You scored ${rightGuess}. Better Luck Next Time`, '#CAFFB9');
    }

  }, 1000);
}

//=======================Reset Game Function==============================

function resetGame() {              
  clearInterval(countdown);
  time = totalTime;
  rightGuess = 0;
  wrongGuess = 0;
  timerDisplay.textContent = "1:30";
  circle.style.background = "conic-gradient(#ddd 0deg, #ddd 360deg)";
  userInput.value = "";
  startBtn.disabled = false;
  checkBtn.disabled = false;
  generateNumbers();
  numberOnRandomCard();
}
//===========================Sound function===============================
function playWarningSound() {
  const audio = new Audio('/warning.wav');
  audio.play().catch(err => console.log('Audio Playback Failed:', err));
}
//==========================Heart Logic===================================
function heartLogic() {
  if (wrongGuess === 10) {
    clearInterval(countdown);
    endRusult(`Game Over! You guessed wrong 10 times.`, '#CAFFB9');
  }
}

// =======================Entry of third row =============================
function entryRow3() {
  setTimeout(() => {
    row3.classList.add('show');    
  }, 300)
}
// ======================Entry of fourth row =============================
function entryRow4() {
  row4.classList.remove('show');
  setTimeout(() => {
    row4.classList.add('show');
  }, 500)
}

// ======================Start Game Button Click Action=================== 
function buttonClickActions() {
  startTimer();
  numberOnRandomCard();
  entryRow3();
  entryRow4();
}
document.getElementById('startBtn').addEventListener('click', buttonClickActions);
document.getElementById('checkBtn').addEventListener('click', checkButtonClickAction);