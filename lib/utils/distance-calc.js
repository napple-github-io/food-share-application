
const request = require('superagent');

function getDistanceByAddress(origLocation, destLocation) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origLocation.address}&destinations=${destLocation.address}&key=AIzaSyCn4CbIaeP7Hp0FLzIhJLvKHfh_xJ4kDIM`;
  return request
    .get(url)
    .then(result => result.rows[0].elements[0].distance.text);
}
function getDistanceByZip(origLocation, destLocation) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origLocation.zip}&destinations=${destLocation.zip}&key=AIzaSyCn4CbIaeP7Hp0FLzIhJLvKHfh_xJ4kDIM`;
  return request
    .get(url)
    .then(result => result.rows[0].elements[0].distance.text);
}

module.exports = { getDistanceByAddress, getDistanceByZip };
