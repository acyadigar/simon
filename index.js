const colors = ["green", "red", "yellow", "cyan"];
let colorPath = [];
let userClickPath = [];
let level = 0;

document.addEventListener("keydown", newSection);
const html = document.querySelector("html");
const score = document.querySelector(".score");
const scoreboard = document.querySelector(".highscore");
const buttons = document.querySelectorAll(".button");
const startInfo = document.querySelector(".startInfo");

const nextLevel = new Audio("sounds/animated.mp3");
const theEnd = new Audio("sounds/the-end.mp3");
const correct = new Audio('sounds/correct-answer.mp3')

const currentDate = new Date();

if (window.localStorage.highestScore) {
  scoreboard.textContent = window.localStorage.getItem("highestScore");
}

// last played
function getTimeDiff() {
  if (!window.localStorage.lastPlayed) {
    window.localStorage.setItem("lastPlayed", currentDate);
  } else {
    const lastPlayed = window.localStorage.getItem("lastPlayed");
    const lastPlayedDate = new Date(lastPlayed);
    const minDiff = diff_minutes(currentDate, lastPlayedDate);
    document.querySelector(".last").textContent = `${minDiff}min ago`;
      if(minDiff > 60){
        const hourDiff = diff_hours(currentDate, lastPlayedDate)
        document.querySelector('.last').textContent = `${hourDiff}hour ago`
      }
  }
}
getTimeDiff();

// New level pattern
function newSection() {
  window.localStorage.setItem("lastPlayed", currentDate);
  buttons.forEach((button) => button.addEventListener("click", answer));
  document.removeEventListener("keydown", newSection);
  const random = Math.round(Math.random() * 3);
  const randomColor = colors[random];
  const randomSelectedColor = document.querySelector(`.${randomColor}`);

  userClickPath = [];
  startInfo.textContent = "";

  animateColor(randomSelectedColor);
  nextLevel.play()
  level++;
  score.textContent = level;

  colorPath.push(randomColor);
  document.querySelector(".last").textContent = "playing...";
}

// player's clicks
function answer() {
  const color = this.classList[1];
  animateColor(this);
  userClickPath.push(color);
  answerChecking(userClickPath.length - 1);
}

async function answerChecking(last) {
  if (userClickPath[last] == colorPath[last]) {
    if (userClickPath.length == colorPath.length) {
      correct.play()
      correct.currentTime = 0
      
      await correctAnswer();
    }
  } else {
    wrongAnswer();
    score.textContent = level;
  }
}

function animateColor(randomSelectedColor) {
  randomSelectedColor.classList.add("selectedButton");
  randomSelectedColor.addEventListener('transitionend', transitionend)
}

function transitionend(){
    this.classList.remove('selectedButton')
}

function correctAnswer() {
  return new Promise((resolve) => {
    setTimeout(function () {
      newSection();

      resolve();
    }, 1000);
  });
}

function wrongAnswer() {
  if (level > window.localStorage.getItem("highestScore")) {
    window.localStorage.setItem("highestScore", level);
  }
  level = 0;
  colorPath = [];
  scoreboard.textContent = window.localStorage.getItem("highestScore");

  document.addEventListener("keydown", newSection);
  buttons.forEach((button) => button.removeEventListener("click", answer));

  html.classList.add("wrongAnswer");
  theEnd.play()

  setTimeout(function () {
    html.classList.remove("wrongAnswer");
    startInfo.textContent = "Press any key to start!";
    getTimeDiff();
  }, 1000);
}

function diff_minutes(date1, date2) {
  let diff = (date2.getTime() - date1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

function diff_hours(date1, date2){
    const diff = (date2.getTime() - date1.getTime()) / 36e5
    return Math.abs(Math.round(diff))
}

if (window.innerWidth <= 900){
  startInfo.addEventListener('click', newSection)
}