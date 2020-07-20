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
        user: '	carlorentalservice@gmail.com',
        pass: 'RoOt1234'
    }
});

var gen = rn.generator({
    min: 100000,
    max: 999999,
    integer: true
});

module.exports = {
    signUp: async (req,res) => {
        var { email, password, confirmPassword,firstName,lastName, cellNo } = req.body;

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
    
            const user = new User ({ email, password,firstName,lastName,cellNo, secretToken, active: false });
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
    
            res.send(
                {token:token,
                userId:user._id }
                );
        } catch (err){
            return res.status(422).send({ error:'Invalid password or email'});
        }
    },
    verify: async (req,res) => {
        const { token, email } = req.body;
        const foundUser = await User.findOne({ "email" : email });
        
        if(!foundUser){
            return res.status(422).send({ error:'Invalid user!'});
        }

        if(foundUser.secretToken != token){
            return res.status(422).send({ error:'Invalid code!!'});
        }

        foundUser.active = true;
        foundUser.secretToken = ''
        foundUser.save();

        console.log('verify',foundUser.password);

        return res.send({ message: 'Verified' });

    }
    // viewProfile: async (req,res, next) => {

    //     try{
    //         const email = req.user.email;
    //         const firstName = req.user.firstName;
    //         const lastName = req.user.lastName;
    //         const cellNo = req.user.cellNo;
        
    //         await Vehicles.find({hostId:req.user._id}).then(async function(cars) {
    //             await cars;
    //             console.log(cars);
    //             return res.send({
    //                 email:email,
    //                 firstName:firstName,
    //                 lastName:lastName,
    //                 cellNo:cellNo,
    //                 cars:cars
    //              });
    //         });
    //     }
    //         catch (error) {
    //             next(error);
    //           }
        
    // }

}