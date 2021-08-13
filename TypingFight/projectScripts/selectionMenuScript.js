const hostButton = document.getElementById("hostButton");
const joinButton = document.getElementById("joinButton");

hostButton.addEventListener("click", () => hostAGame());

joinButton.addEventListener("click", () => joinAGame());

const svgContainerTyping = document.getElementById("typingSvg");

const animItemTyping = bodymovin.loadAnimation({
  wrapper: svgContainerTyping,
  animType: "svg",
  loop: true,
  autoplay: true,
  path: "https://assets7.lottiefiles.com/packages/lf20_bXRG9q.json",
});
