const express = require('express');
const router = express.Router();
const rating = require('../models/rating');


router.get('/', async (req,res)=>{
    res.send("we are on ratings");
   
});

router.post('/',async (req,res) =>{
    
    console.log(req.data);
});

module.exports = router;