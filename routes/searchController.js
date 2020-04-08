const router = require("express").Router();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const models = require('../models/models');
const Vehicles = models.Vehicle;

router.get("/", urlencodedParser, async (req, res, next) => {
    try {
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
        city = req.body.city.toLowerCase();

        await Vehicles.find({city:city,availableFrom:availableFrom,availableTill:availableTill}).then(async function(record) {
            await record;
            res.json(record);

        });
    } catch (error) {
      next(error);
    }
  });
module.exports = router;

