const dotenv = require('dotenv');

// Database and Dotenv config
dotenv.config();

// Importing app after env and database is configured
const app = require('./app');

const PORT = process.env['PORT'] || 8080;

app.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`);
});
