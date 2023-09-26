const mongoose = require('mongoose');

const { PORT, DB_URL } = require('./config/config');
const app = require('./app');

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.error('Error:', err);
  });

app.listen(PORT, (err) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log(`App listening on ${PORT}`);
  }
});
