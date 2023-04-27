const Joi = require('joi');
const mongoose = require('mongoose');

const LogsToServersSchema = new mongoose.Schema({
    server_name: { 
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const LogsToServers = mongoose.model('logs_to_servers', LogsToServersSchema);

function validateLogsToServers(question) {
  const schema = Joi.object({
    server_name: Joi.string().min(3).required(),
    address: Joi.string().min(3).required(),
    message: Joi.string().min(3).required()
  });

  return schema.validate(question);
}

exports.LogsToServers = LogsToServers;
exports.validateLogsToServers = validateLogsToServers;

