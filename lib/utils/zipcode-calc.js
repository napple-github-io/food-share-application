const request = require('superagent');

const API_KEY = process.env.ZIPCODE_API_KEY;

// return a list of zipcodes in radius
const getZipcodesByRadius = (zipcode, radius = 50) => {
  return request
    .get(`https://www.zipcodeapi.com/rest/${API_KEY}/radius.json/${zipcode}/${radius}/mile`)
    .then(res => res.body)
    .then(body => body.zip_codes.map(zipcodeInfo => zipcodeInfo.zip_code));
};

module.exports = {
  getZipcodesByRadius
};
