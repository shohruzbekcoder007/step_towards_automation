const express = require('express')
const router = express.Router()
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const { User, validateUser } = require('./../models/user')

router.post('/', async (req, res) => {
    
    const { error } = validateUser(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt()
    req.body.password = await bcrypt.hash(req.body.password, salt)
    
    let user = new User(_.pick(req.body, ['name', "password", "status"]));
    let newuser = await user.save();
    
    return res.status(201).send(_.pick(newuser, ['_id', 'name', 'status']));
});

router.post('/login', async (req, res) => {
    
    let user = await User.findOne({ name: req.body.name });
    if (!user)
        return res.render('login', {
            message: 'Email yoki parol noto\'g\'ri'
        })

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword)
        return res.render('login', {
            message: 'Email yoki parol noto\'g\'ri'
        })

    const token = user.generateAuthToken();
    res.cookie("token", token, {
        httpOnly: true,
        // secure: true,
        // maxAge: 1000000,
        // signed: true
    })

    return res.render("main", {})

});

module.exports = router;