const Joi = require('joi');
const mongoose = require('mongoose');

const AgreementSchema = new mongoose.Schema({
    organization_name: { 
        type: String,
        required: true
    },
    tel_number: { 
        type: String,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    contract_number: { 
        type: String,
        required: true
    },
    contract_date: { 
        type: Date,
        default: new Date()
    },
    agreement_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agreements_types",
        required: true
    }
});

const Agreement = mongoose.model('agreements', AgreementSchema);

function validateAgreement(question) {
  const schema = Joi.object({
    organization_name: Joi.string().min(3).required(),
    tel_number: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    contract_number: Joi.string().min(3).required(),
    agreement_type: Joi.string().min(3).required(),
  });

  return schema.validate(question);
}

exports.Agreement = Agreement;
exports.validateAgreement = validateAgreement;

