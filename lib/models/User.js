const mongoose = require('mongoose');
const { hash, compare } = require('../utils/hash');
const { untokenize, tokenize } = require('../utils/token');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
  },
  location: {
    address:{
      type: String,
      required: true
    },
    zip:{
      type: Number,
      required: true
    }
  },
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  }

},
{
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
      delete ret.__v; 
    }
  }
});

userSchema.virtual('password').set(function(password) {
  this._tempPassword = password;
});

userSchema.pre('save', function(next) {
  hash(this._tempPassword)
    .then(hashedPassword => {
      this.passwordHash = hashedPassword;
      next();
    });
});

userSchema.methods.compare = function(password) {
  return compare(password, this.passwordHash);
};

userSchema.methods.authToken = function() {
  return tokenize(this.toJSON());
};

userSchema.statics.findByToken = function(token) {
  return Promise.resolve(untokenize(token));
};

module.exports = mongoose.model('User', userSchema);
