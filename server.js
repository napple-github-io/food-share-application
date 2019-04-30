require('dotenv').config(); 
require('./lib/utils/connect')();
const app = require('./lib/app');
const archive = require('./lib/utils/archive');
const PORT = process.env.PORT || 8889;

app.listen(PORT, () => {
  setInterval(() => {
    archive();
  }, (1000 * 60 * 60));
  // eslint-disable-next-line no-console
  console.log(`LISTENING on ${PORT}`);
});
