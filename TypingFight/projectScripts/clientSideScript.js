// * Getting the socket io :
const socket = io();

// * Basic Setup :
let roomName = "";
let playerName = "";

// * Fetching the name is store in the cookie.
(function () {
  cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("name="));

  if (cookieValue) playerName = cookieValue.split("=")[1];
})();

// * initializing the elements needed :
const selectionMenuContainer = document.querySelector(
  ".selectionMenuContainer"
);
const roomTitle = document.querySelector(".roomName");
const startGameButton = document.querySelector("#startGameButton");

// * Room Manager :
const hostAGame = () => {
  // Taking input and storing it in a cookie.
  while (!playerName) playerName = prompt("Enter your name : ");
  document.cookie = `name=${playerName}`;

  roomName = playerName + "-" + playerName.length;

  // ? Important to host.
  socket.emit("hostingAGame", roomName, playerName, socket.id);

  // Clearing the selectionMenuContainer screen.
  selectionMenuContainer.style.display = "none";

  // Setting the room container.
  startGameButton.style.display = "inline-block";
  roomTitle.textContent = roomName;

  svgContainerChat.classList.remove("hide");
  animItemChat.goToAndPlay(0, true); // to play the animation.
};

const joinAGame = () => {
  while (!playerName) playerName = prompt("Enter your name : ");
  document.cookie = `name=${playerName}`;

  while (!roomName) roomName = prompt("Enter room name : ");

  // ? Important to join.
  socket.emit("joiningAGame", roomName, playerName, socket.id);
};

socket.on("roomExists", () => {
  selectionMenuContainer.style.display = "none";
  roomTitle.textContent = roomName;
  svgContainerChat.classList.remove("hide");
  setTimeout(() => {
    console.log("animation");
    animItemChat.goToAndPlay(0, true);
  }, 500); // to play the animation.)
});

socket.on("gameInProgress", () => {
  alert("Game in progress.");
  roomName = "";
});

socket.on("roomNotExists", () => {
  alert("Room not available.");
  roomName = "";
});

socket.on("playerAlreadyJoined", () =>
  alert("Player is already joined in the group.")
);

socket.on("set-room-data", (playersInRoom) => {
  let playersInRoomContainer = document.getElementById("roomNameNumber");
  playersInRoomContainer.innerHTML = "";

  let txt = document.createTextNode(
    `Players : ${Object.keys(playersInRoom).length}`
  );
  playersInRoomContainer.appendChild(txt);

  for (key in playersInRoom) {
    let temp = document.createElement("div");
    txt = document.createTextNode(`${key}`);
    temp.appendChild(txt);

    temp.addEventListener("click", (e) => {
      let conformKick = prompt(
        `write 'kick' to kick a ${e.target.innerText} [Only Host can Kick a Player]`
      );

      if (conformKick == "kick")
        socket.emit("kickPlayer", playerName, e.target.innerText, roomName);
    });

    playersInRoomContainer.appendChild(temp);
  }

  console.table(playersInRoom);
});

// * on kick
socket.on("onKick", () => {
  alert("Your are kicked by the host :( ");
  location.reload();
});

// * Chatting in the lobby.
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = document.getElementById("message").value;
  document.getElementById("message").value = "";

  if (message != "")
    socket.emit("send-chat-message", message, playerName, roomName);
});

socket.on("chat-message", (message, sender) => {
  let messagesWindow = document.querySelector(".messageArea");

  messageElement = document.createElement("div");
  messageElement.classList.add("message");

  if (sender == playerName) {
    messageElement.classList.add("outgoing");
  } else {
    if (document.getElementById("popUpControl").checked)
      showMessageInPopup(message, sender);

    messageElement.classList.add("incoming");
  }

  messageElement.innerHTML = `
          <h4>${sender == playerName ? "" : sender}</h4>
          <p>${message}</p>`;

  messagesWindow.appendChild(messageElement);
  messagesWindow.scrollTop = messagesWindow.scrollHeight;
});

const showMessageInPopup = (message, sender) => {
  console.log("popip");
  popUpChatMessageContainer = document.querySelector(".messagePopUp");

  popUpChatMessageContainer.innerHTML = `<h4>${sender.toUpperCase()} : </h4><p>${message}</p>`;

  popUpChatMessageContainer.style.right = 0;

  setTimeout(() => {
    popUpChatMessageContainer.style.right = "-350px";
    console.log(message, sender);
  }, 2500);
};

document
  .getElementById("leaveIcon")
  .addEventListener("click", () => location.reload());

socket.on("showStartButton", () => {
  document.getElementById("startGameButton").style.display = "inline-block";
});

// * Graph :
socket.on("refreshGraph", (players) => {
  document.querySelector(".graphContainer").style.display = "flex";
  let ctx = document.getElementById("myChart").getContext("2d");

  let allData = [];

  let lables = sentenceText.split(" ");

  for (const value of Object.values(players)) {
    if (Object.keys(value.playerData) != 0) {
      allData.push(value.playerData);
      console.table(value);
    }
  }

  if (chartCreated) myChart.destroy();

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: lables,
      datasets: allData,
    },
    options: {
      scales: {
        y: {
          min: 0,
        },
      },
    },
  });

  chartCreated = true;
});

async function startTheGame() {
  let temp = document.querySelector("#startGameButton");
  // To avoid multiple clicks that will trigger more startTheGame functions
  temp.disabled = true;

  await textGenerator();

  socket.emit("gameStarted", playerName, roomName, sentenceText);

  temp.disabled = false;
}

socket.on("gameStartedCondition", (text) => {
  console.log("gameStarted");

  sentenceText = text;

  const countDownElement = document.querySelector(".countDownContainer");
  const countDownElementHeading = document.querySelector(".countDown");

  countDownElement.style.display = "";

  let countdown = 5;

  selectionMenuContainer.style.display = "none";
  document.getElementById("startGameButton").style.display = "none";

  window.scrollTo(0, 0);

  countDownElementHeading.textContent = countdown;
  countDownElement.style.zIndex = "600";
  countdown -= 1;

  onRestartCondition();
  document.querySelector("#myTyping").style.display = "";
  document.querySelector("#myTyping").value = "";
  const chatRoom = document.querySelector(".chatRoom");
  chatRoom.style.position = "inherit";

  const myVar = setInterval(() => {
    countDownElementHeading.textContent = countdown;

    if (countdown === 0) {
      clearInterval(myVar);
      typingStartedCondition();
      countDownElement.style.display = "none";

      textInput.focus();
      textInput.select();
    }
    countdown -= 1;
  }, 1000);
});
