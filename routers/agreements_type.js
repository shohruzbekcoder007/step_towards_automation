const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { AgreementsType, validateAgreementsType } = require('./../models/agreements_type')
const { auth } = require('../middleware/auth')
const { super_admin } = require('../middleware/super_admin')

router.post('/', [auth, super_admin], async (req, res) => {
    
    const { error } = validateAgreementsType(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);
    
    let agreement = new AgreementsType(_.pick(req.body, ['name']));
    let newagreement = await agreement.save();
    
    return res.status(201).send(_.pick(newagreement, ['_id', 'name']));
});

router.get('/types', [auth, super_admin], async (req, res) => {
    try {

        const agreement_types = await AgreementsType.find({});
        res.send(agreement_types);

    } catch (error) {
        res.send(error.message)
    }
});

router.get('/type-one', [auth, super_admin], async (req, res) => {
    try {
        const { id } = req.query;
        const agreement_type = await AgreementsType.findOne({_id: id});
        res.send(agreement_type);

    } catch (error) {
        res.send(error.message)
    }
});

router.put('/update', [auth, super_admin], async (req, res) => {
    try {

        const { _id } = _.pick(req.body, ['_id'])

        let agreement = await AgreementsType.findByIdAndUpdate(_id, _.pick(req.body, ['name']), {new: true});
        if (!agreement)
            return res.status(400).send('User\'s information is not update');

        return res.send(_.pick(agreement, ['_id', 'email', 'name', 'isAdmin']));

    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.delete('/remove', [auth, super_admin], async (req, res) => {

    const { _id } = _.pick(req.body, ['_id'])
    
    let agreement = await AgreementsType.findByIdAndRemove(_id);
    if (!agreement)
        return res.status(400).send('Agreement\'s information is not remove');

    return res.send(_.pick(agreement, ['_id','name']));
});

module.exports = router;