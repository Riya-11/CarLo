const router = require("express").Router();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const models = require('../models/models');
const multer = require('multer');
const fs = require('fs');
Vehicles = models.Vehicle;
const credentails = require('../Credentials/credentials');


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


const NodeGeocoder = require('node-geocoder');
 
const options = {
  provider: "google",

  // Optional depending on the providers
  httpAdapter: "https", // Default
  apiKey: credentails.mapAPIKey, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);


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
          // Using callback
          const loc = await geocoder.geocode(req.body.street.toLowerCase()+" "+req.body.city.toLowerCase());
          const lat = loc[0]["latitude"];
          const lng = loc[0]["longitude"];

          console.log(lat,lng);
          /////////////

          var vehicle = new Vehicles({
          hostId: req.user._id,
          make : req.body.make.toLowerCase(),
          model : req.body.model.toLowerCase(),
          vin : req.body.vin,
          street : req.body.street.toLowerCase(),
          city : req.body.city.toLowerCase(),
          geometry: { 
            coordinates: [lng,lat]
        },
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
              geometry: { 
                "type": "Point",
                "coordinates": [lat,lng]
            },
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

