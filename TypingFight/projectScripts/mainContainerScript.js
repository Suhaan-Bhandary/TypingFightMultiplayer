// Grabbing all the required elements.
const sentence = document.querySelector(".sentence");
const wrongCounter = document.querySelector(".wrongCounter");
const textInput = document.querySelector("#myTyping");
const endDisplay = document.querySelector(".endDisplay");
const againButton = document.querySelector("#again");

// Variables used :
let sentenceText = "";

// All this are changed when we restart the game.
let backSpacesRequired = 0, // To keep track of the wrong letters typed.
  index = 0,
  wrongCount = 0,
  letterCount = 0,
  currentWordTyping = [], // To keep track of the word we are typing.
  typingStarted = false,
  errorFreeFlag = true;

// Time tracking variables :
let startTime, previousTime, endTime;

// Graph Variables :
let PlayerData,
  graphdata,
  chartCreated = false;

// The initialStructure is async as we will wait for the api to respond and then store it in the variable.
(function initialStructure() {
  // Waiting for the onRestart function to End.
  onRestartCondition();

  // Initializing the event listener for key events.
  textInput.addEventListener("keydown", (e) => {
    // if (!typingStarted) typingStartedCondition(); // Condtion to check if Typing is Started.

    // Function to check if the key pressed is right or wrong and perform further actions.
    checkKeyCondition(e);

    // Checking if the word ended and also all the previous words are correctly typed.
    if (e.key == " " && backSpacesRequired === 0) {
      recordGraphData(); // Records the data for every word in the graph.

      // Reseting the textInput and also the current word.
      textInput.value = "";
      currentWordTyping = [];
    }

    refreshWindow();
  });

  refreshWindow();
})();

function onRestartCondition() {
  // We check the type of function we have to use.
  PlayerData = [];
  graphdata = [];

  index = 0;
  wrongCount = 0;
  letterCount = 0;
  backSpacesRequired = 0;
  currentWordTyping = [];
  typingStarted = false;
  errorFreeFlag = true;

  // Changing the Html and css of the elements
  endDisplay.style.display = "none";
  sentence.innerHTML = `<h1>${sentenceText}</h1>`;
  textInput.style.display = "block";
  textInput.value = "";

  refreshWindow();
}

// Function to refresh Window when called.
function refreshWindow() {
  wrongCounter.innerHTML = `<p>Extra key-strokes : ${wrongCount} </p>`;

  // To make the right corrected word green and wrong red and not typed word gray.
  if (backSpacesRequired == 0) {
    rightText = sentenceText.slice(0, letterCount);

    if (letterCount == sentenceText.length) {
      currentText = "";
    } else {
      currentText = sentenceText[letterCount];
    }

    remainingText = sentenceText.slice(letterCount + backSpacesRequired + 1);
    sentence.innerHTML = `<h1><span id="right" >${rightText}</span><span id="currentText" >${currentText}</span><span id="remaining" >${remainingText}</span></h1>`;
  } else {
    rightText = sentenceText.slice(0, letterCount);

    wrongText = sentenceText.slice(
      letterCount,
      letterCount + backSpacesRequired
    );
    remainingText = sentenceText.slice(letterCount + backSpacesRequired);
    sentence.innerHTML = `<h1><span id="right" >${rightText}</span><span id="wrong" >${wrongText}</span><span id="remaining" >${remainingText}</span></h1>`;
  }
}

// Function to handel the case when typing is started.
function typingStartedCondition() {
  startTime = new Date();
  previousTime = startTime;

  console.log("Started typing");
  typingStarted = true;

  // const chatRoom = document.querySelector(".chatRoom");
  // chatRoom.style.position = "inherit";
}

// Function to check the key entered and take action accordingly.
function checkKeyCondition(e) {
  if (e.key === sentenceText[index]) {
    currentWordTyping.push(e.key);
    correctKeyConditionHandle();
    return;
  }
  wrongKeyConditionHandle(e);
}

// Function to handel,if the key is correct.
function correctKeyConditionHandle() {
  // checking if any letter was wrong typed before it.
  if (errorFreeFlag) {
    // If this is the last character.
    if (index === sentenceText.length - 1) {
      endCondition();
    } else {
      index = index + 1;
    }

    letterCount = letterCount + 1;
  } else {
    wrongCount = wrongCount + 1;
    backSpacesRequired = backSpacesRequired + 1;
  }
}

// Function to handel,if the key is wrong.
function wrongKeyConditionHandle(e) {
  letterTyped = e.key;

  if (letterTyped == "Backspace") {
    currentWordTyping.pop();
    backScpaceConditionHandle();

    if (e.ctrlKey) deleteWholeWord();
  } else if (
    letterTyped == "Control" ||
    letterTyped == "Shift" ||
    letterTyped == "CapsLock" ||
    letterTyped == "Enter" ||
    letterTyped == "Tab"
  ) {
    return;
  } else {
    regularWrongConditionHandle();
    currentWordTyping.push(letterTyped);
  }
}

// Condition on pressing the backSpace key.
function backScpaceConditionHandle() {
  // errorFreeFlag tells us that the typing is error free.
  if (errorFreeFlag) {
    if (index != 0) index = index - 1;
    if (letterCount != 0) letterCount--;
    wrongCount++;
  } else {
    backSpacesRequired--;
    if (backSpacesRequired == 0) {
      errorFreeFlag = true;
    }
  }
}

// Delets the whole word when called.
function deleteWholeWord() {
  let wordLengthToDelete =
    currentWordTyping.length - currentWordTyping.lastIndexOf(" ");

  let newWord = currentWordTyping
    .slice(0, currentWordTyping.length - wordLengthToDelete + 1)
    .join("");

  letterCount = letterCount - (currentWordTyping.length - backSpacesRequired);
  index = letterCount;

  if (wordLengthToDelete > backSpacesRequired) {
    backSpacesRequired = 0;
    errorFreeFlag = true;
  } else {
    backSpacesRequired = backSpacesRequired - wordLengthToDelete + 1;
    errorFreeFlag = false;
  }

  currentWordTyping = newWord.split("");
}

// Function handel the state if the function is called.
function regularWrongConditionHandle() {
  backSpacesRequired++;
  wrongCount++;
  errorFreeFlag = false;
}

// Function to handel the case when typing is started.
function endCondition() {
  console.log("hi every one");
  endTime = new Date();

  // Recording the last word and then generation the graphdata using the graphdata variable.
  recordGraphData();

  let timePassedInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
  let timePassedInMinutes = timePassedInSeconds / 60;

  let typingSpeed = letterCount / (5 * timePassedInMinutes);
  let rawSpeed = (letterCount + wrongCount) / (5 * timePassedInMinutes);
  let accuracy = 100 - (wrongCount / (letterCount + wrongCount)) * 100;

  endDisplay.style.display = "block"; // Displaying the endDisplay.
  textInput.style.display = "none"; // Hiding the text input.

  animItem.goToAndPlay(0, true); // to play the animation.

  endDisplay.innerHTML = `
    <h1> Wpm : ${typingSpeed.toFixed(0)} </h1>
    <h1> Raw Speed : ${rawSpeed.toFixed(0)} </h1>
    <h1> Acurracy : ${accuracy.toFixed(2)}% </h1>
    <p>${typingSpeedCompare[Math.floor(typingSpeed / 10) * 10]}</p>
    `;

  window.scrollTo(0, document.querySelector(".graphContainer").scrollHeight);
  generateGraph(typingSpeed.toFixed(0), accuracy.toFixed(2));
}
