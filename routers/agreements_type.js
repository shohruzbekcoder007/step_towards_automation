const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { AgreementsType, validateAgreementsType } = require('./../models/agreements_type')

router.post('/', async (req, res) => {
    
    const { error } = validateAgreementsType(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);
    
    let agreement = new AgreementsType(_.pick(req.body, ['name']));
    let newagreement = await agreement.save();
    
    return res.status(201).send(_.pick(newagreement, ['_id', 'name']));
});

router.get('/types', async (req, res) => {
    try {

        const agreement_types = await AgreementsType.find({});
        res.send(agreement_types);

    } catch (error) {
        res.send(error.message)
    }
});

router.get('/type-one', async (req, res) => {
    try {
        const { _id } = req.body;
        const agreement_type = await AgreementsType.findOne({_id: _id});
        res.send(agreement_type);

    } catch (error) {
        res.send(error.message)
    }
});

router.put('/update', async (req, res) => {
    try {

        const { _id } = _.pick(req.body, ['_id'])

        let agreement = await AgreementsType.findByIdAndUpdate(_id, _.pick(req.body, ['name']));
        if (!agreement)
            return res.status(400).send('User\'s information is not update');

        return res.send(_.pick(agreement, ['_id', 'email', 'name', 'isAdmin']));

    } catch (error) {
        return res.status(400).send(error.message)
    }
});

router.delete('/remove', async (req, res) => {

    const { _id } = _.pick(req.body, ['_id'])
    
    let agreement = await AgreementsType.findByIdAndRemove(_id);
    if (!agreement)
        return res.status(400).send('Agreement\'s information is not remove');

    return res.send(_.pick(agreement, ['_id','name']));
});

module.exports = router;