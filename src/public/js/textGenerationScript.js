// A bag of sentence to use when the api is down or the internet is down.
const offlineSentences = [
  'A parent may kill its children if the task assigned to them is no longer needed.',
  'Writing cryptic code is deep joy in the soul of a programmer.',
  "A coder is a person who transforms cola & pizza to code 'Refresh button' of the windows desktop is not some magical tool which keeps your computer healthy.",
  'The programmers are the main source of income for eye doctors.',
  'If any programmer orders three beers with his fingers, he normally only gets two.',
  'Programmers love to code day and night.',
  'Sleeping with a problem can actually solve it.',
  'When you format your hard drive, the files are not deleted.',
  '1 Mbps and 1 MBps internet connection don’t mean the same thing.',
  'A programmer is similar to a game of golf.',
  'The point is not getting the ball in the hole but how many strokes it takes',
  'A programmer is not a PC repairman.',
];

// Feedback text for the typing game.
const typingSpeedCompare = {
  0: 'If this is your starting then the end will be bright after few practice',

  10: 'At this speed, your typing speed is way below average, and you should focus on proper typing technique (explained below).',

  20: 'At this speed, your typing speed is way below average, and you should focus on proper typing technique (explained below).',

  30: 'At this speed, your typing speed is way below average, and you should focus on proper typing technique (explained below).',

  40: 'At 41 , you are now an average typist. You still have significant room for improvement.',

  50: 'Congratulations! You’re above average.',

  60: 'This is the speed required for most high-end typing jobs. You can now be a professional typist!',

  70: 'You are way above average! You would qualify for any typing job assuming your typing accuracy is high enough.',

  80: 'You’re a catch! Any employer looking for a typist would love to have you.',

  90: 'At this typing speed, you’re probably a gamer, coder, or genius. Either way, you’re doing great!',

  100: 'You are in the top 1% of typists! Congratulations!',
};

// Function genterates text based on the condition.
async function textGenerator() {
  let randomIndex = Math.floor(Math.random() * offlineSentences.length); // generating a random number for choosing a text.
  sentenceText = '';

  // Grabbing the text from api.
  if (window.navigator.onLine) {
    sentenceText = await getRandomTextThroughApi();
  }

  // Checking if the text is valid.
  if (sentenceText === undefined || sentenceText.length === 0) {
    sentenceText = offlineSentences[randomIndex];
  } else {
    // making the text easier to type.
    sentenceText = sentenceText.replace(
      /[`~@#$%^&*()_|+\-?;:<>\n\t\r\{\}\[\]\\\/]/gi,
      '',
    );
  }
}

// Return the a string from the api.
function getRandomTextThroughApi() {
  let randomCategory = ['career', 'dev', 'food', 'history', 'science'][
    (9 * Math.random()) << 0
  ];
  //  << refers to shifting one means it takes floor.

  const apiUrl = `https://api.chucknorris.io/jokes/random?category=${randomCategory}`;

  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);

  return fetch(apiUrl, {
    signal: controller.signal,
  })
    .then((response) => response.json())
    .then((data) => {
      return data.value;
    })
    .catch((err) => {
      console.error(err.message);
    });
}
