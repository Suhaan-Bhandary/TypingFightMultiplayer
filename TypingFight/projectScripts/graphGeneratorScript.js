// Function to record the graph data for every word typed..
function recordGraphData() {
  const currentTime = new Date();
  timeTakenToTypeAWordInSeconds = (currentTime - previousTime) / 1000;
  previousTime = currentTime;
  graphdata.push([currentWordTyping, timeTakenToTypeAWordInSeconds]);
}

// Generates the Graph when called.
function generateGraph(wpm, accuracy) {
  document.querySelector(".graphContainer").style.display = "flex";
  let lables = [];
  let data = [];

  graphdata.forEach((ele) => {
    lables.push(ele[0].join(""));

    let timePassedInMinutes = ele[1] / 60;
    let typingSpeed = ele[0].length / (5 * timePassedInMinutes);
    data.push(typingSpeed);
  });

  let playerSessionData = {
    label: `${playerName} -> Wpm : ${wpm}, Accuracy : ${accuracy}%`,
    data: data,
    backgroundColor: [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ],
    borderColor: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ],
    borderWidth: 1,
  };

  PlayerData.push(playerSessionData);

  socket.emit("playerFinished", playerName, roomName, playerSessionData);
}
