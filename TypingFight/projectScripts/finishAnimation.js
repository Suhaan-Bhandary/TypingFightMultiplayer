const svgContainer = document.getElementById("svg");

const animItem = bodymovin.loadAnimation({
  wrapper: svgContainer,
  animType: "svg",
  loop: false,
  autoplay: false,
  path: "https://assets10.lottiefiles.com/packages/lf20_rovf9gzu.json",
});

//
const svgContainerChat = document.getElementById("chatSvg");
svgContainerChat.classList.add("hide");

const animItemChat = bodymovin.loadAnimation({
  wrapper: svgContainerChat,
  animType: "svg",
  loop: false,
  autoplay: false,
  path: "https://assets9.lottiefiles.com/packages/lf20_g7zx4ni5.json",
});

// To hide when finish :
animItemChat.addEventListener("complete", () => {
  svgContainerChat.classList.add("hide");
});
