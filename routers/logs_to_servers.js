const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { LogsToServers, validateLogsToServers } = require('./../models/logs_to_servers')
const { auth } = require('../middleware/auth')
const { super_admin } = require('../middleware/super_admin')

router.post('/', [auth, super_admin], async (req, res) => {
    
    const { error } = validateLogsToServers(_.pick(req.body, ['server_name', 'address', 'message']));

    if(error)
        return res.status(400).send(error.details[0].message);
    
    let agreement = new LogsToServers(_.pick(req.body, ['server_name', 'address', 'message']));
    let newagreement = await agreement.save();
    
    return res.status(201).send(_.pick(newagreement, ['server_name', 'address', 'message']));
});

router.delete('/remove', [auth, super_admin], async (req, res) => {

    const { _id } = _.pick(req.body, ['_id'])
    
    let agreement = await LogsToServers.findByIdAndRemove(_id);
    if (!agreement)
        return res.status(400).send('Agreement\'s information is not remove');

    return res.send(agreement);
});

router.get('/all-logs', [auth, super_admin], async (req,res) => {

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    try {
    
        const q_server_name = req.query.server_name
        const q_address = req.query.address
        const q_message = req.query.message

        const server_name = new RegExp(q_server_name, 'i')
        const address = new RegExp(q_address, 'i')
        const message = new RegExp(q_message, 'i')

        const logs = await LogsToServers.find({ 
            server_name: server_name,  
            address: address,
            message: message,
        }).sort({_id: -1}).limit(limit).skip((page - 1)*limit)

        const count = await LogsToServers.countDocuments({
            server_name: server_name,  
            address: address,
            message: message,
        })

        const totalPages = Math.ceil(count / limit)
        let result = {}
        result.logs = logs
        result.page = page
        result.totalPages = totalPages

        return res.send(result)

    } catch (error) {
        return res.send({ error: error })
    }

})

module.exports = router;