const hostButton = document.getElementById('hostButton');
const joinButton = document.getElementById('joinButton');

hostButton.addEventListener('click', () => {
  if (!playerName) {
    openNameModal();
  } else {
    hostAGame();
  }
});

joinButton.addEventListener('click', () => {
  if (!playerName) {
    openNameModal();
    return;
  }

  if (!roomName) {
    openRoomModal();
    return;
  }
});

const svgContainerTyping = document.getElementById('typingSvg');

const animItemTyping = bodymovin.loadAnimation({
  wrapper: svgContainerTyping,
  animType: 'svg',
  loop: true,
  autoplay: true,
  path: 'https://assets7.lottiefiles.com/packages/lf20_bXRG9q.json',
});
