const dotenv = require('dotenv');
const preventServerSleep = require('./utils/preventServerSleep');

// Database and Dotenv config
dotenv.config();

// Importing app after env and database is configured
const app = require('./app');

const PORT = process.env['PORT'] || 8080;

app.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`);

  // Create a Job once App is started
  preventServerSleep();
});
