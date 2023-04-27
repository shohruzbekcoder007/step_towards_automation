const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { auth } = require('../middleware/auth')
const { super_admin } = require('../middleware/super_admin')
const { Agreement } = require('../models/agreement')
const { LogsToServers } = require('../models/logs_to_servers')
const { Computer } = require('../models/computer')

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
        const agreement_type = req.query.agreement_type || ''

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
            }).sort({_id: -1}).limit(limit).skip((page - 1)*limit).populate('agreement_type')

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
        console.log({ error: error })
        return res.render('login', {})
    }

    
});

router.get('/all-logs', [auth, super_admin], async (req, res) => {

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    try {
    
        const q_server_name = req.query.server_name
        const q_address = req.query.address
        const q_message = req.query.message

        const server_name = new RegExp(q_server_name, 'i')
        const address = new RegExp(q_address, 'i')
        const message = new RegExp(q_message, 'i')

        const search = {
            server_name: q_server_name,
            address: q_address,
            message: q_message
        }

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
        result.search = search

        return res.render('logs', {
            result: result
        })

    } catch (error) {
        console.log({ error: error })
        return res.render('login', {})
    }
})

router.get('/main', [auth, super_admin], (req, res) => {
    return res.render("main", {

    })
})

router.get('/computer', [auth, super_admin], async (req, res) => {

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    try {
        const q_computer_number = req.query.computer_number || ""
        const q_model = req.query.model || ""
        const q_ram = req.query.ram || ""
        const q_cpu = req.query.cpu || ""
        const q_memory = req.query.memory || ""
        const q_video_card = req.query.video_card || ""
        const q_window_size = req.query.window_size || ""

        const computer_number = new RegExp(q_computer_number, 'i')
        const model = new RegExp(q_model, 'i')
        const ram = new RegExp(q_ram, 'i')
        const cpu = new RegExp(q_cpu, 'i')
        const memory = new RegExp(q_memory, 'i')
        const video_card = new RegExp(q_video_card, 'i')
        const window_size = new RegExp(q_window_size, 'i')

        const search = {
            computer_number: q_computer_number,  
            model: q_model,
            ram: q_ram,
            cpu: q_cpu,
            memory: q_memory,
            video_card: q_video_card,
            window_size: q_window_size
        }

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
        result.search = search

        return res.render("computer", {
            result: result
        })
    } catch (error) {
        console.log({error: error})
        return res.render("login", {})
    }
})

module.exports = router;