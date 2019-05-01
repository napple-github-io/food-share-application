require('dotenv').config();
const request = require('superagent');

function getDistanceByAddress(origLocation, destLocation) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origLocation.address}&destinations=${destLocation.address}&key=${process.env.API_KEY}`;
  return request
    .get(url)
    .then(res => res.body)
    .then(result => result.rows[0].elements[0].distance.text)
    .then(dist => {
      const calc = parseInt(dist.replace(/,/g, ''), 10);
      console.log(calc);
      return calc;
    });
}
function getDistanceByZip(origLocation, destLocation) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origLocation.zip}&destinations=${destLocation.zip}&key=${process.env.API_KEY}`;
  return request
    .get(url)
    .then(result => result.rows[0].elements[0].distance.text)
    .then(dist => {
      const calc = parseInt(dist.replace(/,/g, ''), 10);
      console.log(calc);
      return calc;
    });
}

module.exports = { getDistanceByAddress, getDistanceByZip };


// getDistanceByAddress(
//   { address: 'seattle, wa' }, { address: 'portland, or' }
// );
