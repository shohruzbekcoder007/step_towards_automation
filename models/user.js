const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  status: {
    type: Number,
    enum: [1,2],
    default: 2
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, status: this.status }, "q1y1npar0l", 
  // {expiresIn: '300s'}
  );
  return token;
}

const User = mongoose.model('users', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
    status: Joi.number().required()
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;