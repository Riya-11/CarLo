const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const models = require('../models/User');
User = models.User;
// const User = mongoose.model('User');
const nodemailer = require('nodemailer');
const rn = require("random-number");
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: { 
        user: 'projectrasoise@gmail.com',
        pass: 'R00t1234'
    }
});

var gen = rn.generator({
    min: 100000,
    max: 999999,
    integer: true
});


module.exports = {
    signUp: async (req,res) => {
        var { email, password, confirmPassword } = req.body;

        const user = await User.findOne({ email });
        if(user){
            return res.status(422).send({ error: 'Email already exists'});
        }
    
        try{
            const secretToken = gen();

            const html = `Hi there,
            Thank you for registering!!
            
            Your verification code is ${secretToken}
            Have a pleasant day.`
    
            const mailOptions = {
                from: 'projectrasoise@gmail.com',
                to: email,
                subject: 'Please verify your email',
                text: html
              };
        
              await transporter.sendMail(mailOptions, function(error, info){
                if(error) {
                    console.log(error);
                    // return res.status(422).send({ error: 'Something wrong with email!!'});
                } else {
                  console.log('Email sent' + info.response);
                }
            });

            // const password = bcrypt.genSalt(10, (err, salt) => {
        
            //     bcrypt.hash(user.password, salt, (err, hash) => {
        
            //         user.password = hash;
            //         next();
                    
            //     })
            // });
            password = await models.hashPassword(password);
    
            const user = new User ({ email, password, secretToken, active: false });
            console.log('user',user);

            await user.save();

    
            const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    
            res.send({ token });
        } catch (err) {
            console.log(err);
            return res.status(422).send({ error: 'Something went wrong!!'});
        }
    },
    signIn: async(req,res) => {
        const { email, password } = req.body;
        // console.log(password);
        // console.log(email);

        if(!email || !password) {
            return res.status(422).send({ error: 'Must provide email and password'});
        }
    
        const user = await User.findOne({ email });
        if(!user){
            return res.status(422).send({error:'Invalid email or password'});
        }

        // console.log(user.password);
        if(user.active == false){
            return res.status(422).send({verify: 'Verify your email first'});
        }
    
        try{
            await user.comparePassword(password);
            const token = jwt.sign({ userId : user._id }, 'MY_SECRET_KEY' );
    
            res.send({ token });
        } catch (err){
            return res.status(422).send({ error:'Invalid password or email'});
        }
    },
    verify: async (req,res) => {
        const { token, email } = req.body;
        const foundUser = await User.findOne({ "email" : email });
        
        if(foundUser.secretToken != token){
            return res.status(422).send({ error:'Invalid code!!'});
        }

        foundUser.active = true;
        foundUser.secretToken = ''
        foundUser.save();

        console.log('verify',foundUser.password);

        return res.send({ message: 'Verified' });

    }
}