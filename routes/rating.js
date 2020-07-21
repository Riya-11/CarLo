const express = require('express');
const router = express.Router();
const rating = require('../models/rating');


router.get('/', async (req,res)=>{
    res.send("we are on ratings");
   
});

router.post('/',async (req,res) =>{
    
    console.log(req.data);
    const Rate=new rating({
        name:req.body.name,
        rating:req.body.rating,
        review:req.body.review
    });
        try{
        const savedrate = await Rate.save();
        res.json(savedrate);
        }catch(err){
        res.json({message:err});
        }
});

module.exports = router;