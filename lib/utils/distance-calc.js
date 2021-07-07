// only need to configure dotenv once in server.js and tests
const request = require('superagent');

function getDistanceByAddress(origLocation, destLocation) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origLocation.address}&destinations=${destLocation.address}&key=${process.env.API_KEY}`;
  return request
    .get(url)
    .then(res => res.body)
    .then(result => result.rows[0].elements[0].distance.text)
    .then(dist => {
      const calc = parseInt(dist.replace(/,/g, ''), 10);
      return calc;
    });
}
function getDistanceByZip(originZip, destAddress) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${originZip}&destinations=${destAddress}&key=${process.env.API_KEY}`;
  return request
    .get(url)
    .then(res => res.body)
    .then(result => result.rows[0].elements[0].distance.text)
    .then(dist => {
      const calc = parseInt(dist.replace(/,/g, ''), 10);
      return calc;
    });
}

function getListingMap(centerAddress, addresses) {
  const url = `https://maps.googleapis.com/maps/api/staticmap?center=${centerAddress}&markers=color:red|${centerAddress}&markers=color:blue|${addresses}&size=400x400&key=${process.env.API_KEY}`;
  return url;
}

module.exports = { getDistanceByAddress, getDistanceByZip, getListingMap };
