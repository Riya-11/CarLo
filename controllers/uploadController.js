const router = require("express").Router();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const models = require('../models/models');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./uploads/');
  },

  filename: function(req,file,cb){
    cb(null,new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req,file,cb) => {
  //reject a file

  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null,true);
  }
  else{
    cb(new Error('Invalid file type'),false);

  }
  
}
const upload = multer({
  storage:storage,
  limits:{
    fileSize: 1024*1024*5
},
  fileFilter: fileFilter
});
Vehicles = models.Vehicle;

const requireAuth = require('../middlewares/requireAuth');
router.use(requireAuth);


router.post("/", upload.single('carImage'), async (req, res, next) => {
      try {
          await req.user;
          console.log(req.file);
          availableFrom = req.body.from;
          availableTill = req.body.to;

          var datetime = new Date();
          default_date = datetime.toISOString().slice(0,10);
          if (!req.body.from){
            availableFrom = default_date;
          }

          if(!req.body.to){
            
            availableTill = availableFrom;
          }
          
          var vehicle = new Vehicles({
          hostId: req.user._id,
          make : req.body.make.toLowerCase(),
          model : req.body.model.toLowerCase(),
          vin : req.body.vin,
          street : req.body.street.toLowerCase(),
          city : req.body.city.toLowerCase(),
          availableFrom : availableFrom,
          availableTill : availableTill,
          carImage: req.file.path,
          pricing : req.body.pricing
          });
        
        
        vehicle
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "Uploaded car successfully",
            uploadedCar: {
              _id: result._id,
              hostId: result.hostId,
              make : result.make,
              model : result.model,
              VIN : result.VIN,
              Street : result.Street,
              City : result.City,
              availableFrom : result.availableFrom,
              availableTill : result.availableTill,
              carImage: result.carImage,
              Pricing : result.pricing,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" + result._id
                }
            }
          });
        })


          } catch (error) {
        next(error);
      }
    });

module.exports = router;

