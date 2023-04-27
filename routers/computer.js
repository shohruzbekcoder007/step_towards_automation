const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { Computer, validateComputer } = require('./../models/computer')
const { auth } = require('../middleware/auth')
const { super_admin } = require('../middleware/super_admin')

router.post('/', [auth, super_admin],  async (req, res) => {

    const { error } = validateComputer(req.body);

    if(error)
        return res.status(400).send(error.details[0].ram);
    
    let computer = new Computer(_.pick(req.body, ['computer_number','model','ram','cpu','memory','video_card','window_size']));
    let newcomputer = await computer.save();
    
    return res.status(201).send(_.pick(newcomputer, ['computer_number','model','ram','cpu','memory','video_card','window_size']));
})

router.get('/computers', [auth, super_admin], async (req, res) => {

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    try {
        const q_computer_number = req.query.computer_number
        const q_model = req.query.model
        const q_ram = req.query.ram
        const q_cpu = req.query.cpu
        const q_memory = req.query.memory
        const q_video_card = req.query.video_card
        const q_window_size = req.query.window_size

        const computer_number = new RegExp(q_computer_number, 'i')
        const model = new RegExp(q_model, 'i')
        const ram = new RegExp(q_ram, 'i')
        const cpu = new RegExp(q_cpu, 'i')
        const memory = new RegExp(q_memory, 'i')
        const video_card = new RegExp(q_video_card, 'i')
        const window_size = new RegExp(q_window_size, 'i')

        const computers = await Computer.find({ 
            computer_number: computer_number,  
            model: model,
            ram: ram,
            cpu,
            memory,
            video_card,
            window_size
        }).sort({_id: -1}).limit(limit).skip((page - 1)*limit)

        const count = await Computer.countDocuments({
            computer_number: computer_number,  
            model: model,
            ram: ram,
            cpu,
            memory,
            video_card,
            window_size
        })

        const totalPages = Math.ceil(count / limit)
        let result = {}
        result.computers = computers
        result.page = page
        result.totalPages = totalPages

        return res.send(result)
    } catch (error) {
        return res.send({error: error})
    }
})

router.get('/one', [auth, super_admin], async (req, res) => {

    const _id = req.query.id;

    try {
        let computer = await Computer.find({_id: _id})
        return res.send(computer)
    } catch (error) {
        return res.send({})
    }
})

router.delete('/remove', [auth, super_admin], async (req, res) => {

    const { _id } = _.pick(req.body, ['_id'])
    
    let agreement = await Computer.findByIdAndRemove(_id);
    if (!agreement)
        return res.status(400).send('Computer\'s information is not remove');

    return res.send(agreement);
});

module.exports = router;