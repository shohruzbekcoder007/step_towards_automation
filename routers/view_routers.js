const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { auth } = require('../middleware/auth')
const { super_admin } = require('../middleware/super_admin')
const { Agreement } = require('../models/agreement')

router.get('/agreements-type', [auth, super_admin], async (req, res) => {
    return res.render('agreements_type', {})
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

        const search = {
            organization_name: q_organization_name,
            tel_number: q_tel_number,
            description: q_description,
            contract_number: q_contract_number,
            agreement_type
        }

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
            }).sort({_id: -1}).limit(limit).skip((page - 1)*limit).populate('agreement_type')

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
        result.search = search

        return res.render('agreements', {
            result: result
        })

    } catch (error) {
        return res.render('login', {})
    }

    
});

module.exports = router;