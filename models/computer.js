const Joi = require('joi');
const mongoose = require('mongoose');

const ComputerSchema = new mongoose.Schema({
    computer_number: { 
        type: String,
        required: true,
    },
    model: {
        type: String,
        default: ''
    },
    ram: {
        type: String,
        default: ''
    },
    cpu: {
        type: String,
        default: ''
    },
    memory: {
        type: String,
        default: ''
    },
    video_card: {
        type: String,
        default: ''
    },
    window_size: {
        type: String,
        default: ''
    }
});

const Computer = mongoose.model('computers', ComputerSchema);

function validateComputer(question) {
  const schema = Joi.object({
    computer_number: Joi.string().min(3).required(),
    model: Joi.string(),
    ram: Joi.string(),
    cpu: Joi.string(),
    memory: Joi.string(),
    video_card: Joi.string(),
    window_size: Joi.string(),
  });

  return schema.validate(question);
}

exports.Computer = Computer;
exports.validateComputer = validateComputer;

