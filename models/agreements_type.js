const Joi = require('joi');
const mongoose = require('mongoose');

const AgreementsTypeSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    }
});

const AgreementsType = mongoose.model('agreements_types', AgreementsTypeSchema);

function validateAgreementsType(question) {
  const schema = Joi.object({
    name: Joi.string().required()
  });

  return schema.validate(question);
}

exports.AgreementsType = AgreementsType;
exports.validateAgreementsType = validateAgreementsType;

