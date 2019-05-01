const Review = require('../models/Review');
const User = require('../models/User');

function ratingCheck() {
  return Review
    .getRating()
    .then(usersArr => {
      usersArr.forEach(user =>{
        let myCounter = 0;
        user.reviews.forEach(val => val ? myCounter++ : val);
        if(myCounter / user.totalCount >= 0.7){
          return User
            .findByIdAndUpdate(user.reviewee, { standing: 'good' }, { new: true });
        } else { 
          return User
            .findByIdAndUpdate(user.reviewee, { standing: 'bad' }, { new: true });
        }
      });
    });
}

module.exports = ratingCheck;
