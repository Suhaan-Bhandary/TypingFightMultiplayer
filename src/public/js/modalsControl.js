const nameModal = document.getElementById('NameModal');
const roomModal = document.getElementById('RoomModal');
const errorModal = document.getElementById('ErrorModal');

function isUserNameValid(username) {
  /* 
      Usernames can only have: 
      - Letters (a-z) 
      - Numbers (0-9)
      - Underscores (_)
    */
  const res = /^[A-Za-z0-9_]+$/.exec(username);
  const valid = !!res;
  return valid;
}

// Name Modal Logic
const openNameModal = () => {
  nameModal.classList.add('active');
};

const closeNameModal = () => {
  nameModal.classList.remove('active');
};

document.getElementById('nameModalSaveButton').onclick = () => {
  const nameModalInput = document.getElementById('nameModalInput');

  // Check if the name is valid or not
  if (!isUserNameValid(nameModalInput.value)) {
    document.getElementById('nameModalErrorMessage').textContent =
      'Username can only contain letters, numbers, and underscores.';
    return;
  }

  playerName = nameModalInput.value;
  document.cookie = `name=${playerName}`;

  closeNameModal();
};

document.getElementById('nameModalCloseButton').onclick = closeNameModal;

// Room Modal Logic
const openRoomModal = () => {
  roomModal.classList.add('active');
};

const closeRoomModal = () => {
  roomModal.classList.remove('active');
};

document.getElementById('roomModalSaveButton').onclick = () => {
  const roomModalInput = document.getElementById('roomModalInput');

  // Set the value
  roomName = roomModalInput.value;

  closeRoomModal();
  joinAGame();
};

document.getElementById('roomModalCloseButton').onclick = closeRoomModal;

// Error Modal Logic
const openErrorModal = (message) => {
  const title = document.getElementById('error-modal-message');
  title.textContent = message;
  errorModal.classList.add('active');
};

const closeErrorModal = () => {
  errorModal.classList.remove('active');
};

document.getElementById('errorModalCloseButton').onclick = closeErrorModal;
