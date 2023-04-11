const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { Agreement, validateAgreement } = require('./../models/agreement')
const { auth } = require('../middleware/auth')
const { super_admin } = require('../middleware/super_admin')

router.post('/', [auth, super_admin], async (req, res) => {
    
    const { error } = validateAgreement(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);
    
    let agreement = new Agreement(_.pick(req.body, ['organization_name', 'tel_number', 'description', 'contract_number', 'contract_date', 'agreement_type']));
    let newagreement = await agreement.save();
    
    return res.status(201).send(_.pick(newagreement, ['organization_name', 'tel_number', 'description', 'contract_number', 'contract_date', 'agreement_type']));
});

router.get('/agreements', [auth, super_admin], async (req, res) => {

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    try {
        
        const q_organization_name = req.query.organization_name || ''
        const q_tel_number = req.query.tel_number || ''
        const q_description = req.query.description || ''
        const q_contract_number = req.query.contract_number || ''

        const organization_name = new RegExp(q_organization_name, 'i')
        const tel_number = new RegExp(q_tel_number, 'i')
        const description = new RegExp(q_description, 'i')
        const contract_number = new RegExp(q_contract_number, 'i')
        const agreement_type = req.query.agreement_type || null

        let agreements = []
        let count = 0
        if(agreement_type){

            agreements = await Agreement.find({ 
                organization_name: organization_name,  
                tel_number: tel_number,
                description: description,
                contract_number: contract_number,
                agreement_type: agreement_type
            }).sort({_id: -1}).limit(limit).skip((page - 1)*limit)

            count = await Agreement.countDocuments({
                organization_name: organization_name,  
                tel_number: tel_number,
                description: description,
                contract_number: contract_number,
                agreement_type: agreement_type,
            })

        } else {

            agreements = await Agreement.find({
                organization_name: organization_name,
                tel_number: tel_number,
                description: description,
                contract_number: contract_number
            }).sort({_id: -1}).limit(limit).skip((page - 1)*limit)

            count = await Agreement.countDocuments({
                organization_name: organization_name,
                tel_number: tel_number,
                description: description,
                contract_number: contract_number
            })

        }
        
        const totalPages = Math.ceil(count / limit)
        let result = {}
        result.agreements = agreements
        result.page = page
        result.totalPages = totalPages

        return res.send(result)

    } catch (error) {
        return res.send([])
    }

});

module.exports = router;