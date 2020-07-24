const router = require("express").Router();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const models = require('../models/models');
const Vehicles = models.Vehicle;
const user_model = require('../models/User');
const Users = user_model.User;
const {compareDates} = require('../helpers/dateCompareHelper');
const requireAuth = require('../middlewares/requireAuth');
router.use(requireAuth);

router.get("/", urlencodedParser, async (req, res, next) => {
    try {

      console.log(req.user);
      var availableFrom = req.query.from;
      var availableTill = req.query.to;
      if (!availableFrom || !availableTill){
          res.send('INVALID REQUEST - Please enter both availableFrom and availableTill');
      }
      var filter;
      var city = req.query.city.toLowerCase();
      result = []
      if(!req.query.seatingCapacity){
        filter = {city:city,booked:false}
      }
      else{
        filter = {city:city,seatingCapacity:req.query.seatingCapacity,booked:false}
      }      
        
        await Vehicles.find(filter).then(async function(records) {
            await records;
              for(i=0;i<records.length;i++){
                console.log(JSON.stringify(records[i].hostId) === JSON.stringify(req.user._id));
                if (JSON.stringify(records[i].hostId) === JSON.stringify(req.user._id)){continue}
                a = compareDates(availableFrom,records[i].availableFrom);
                b = compareDates(records[i].availableTill,availableTill);
                
                if(a && b){
                  var temp = {};
                  const current_user = await Users.findById(records[i].hostId);
                  temp["firstName"] = current_user.firstName;
                  temp["lastName"] = current_user.lastName ;
                  temp["cellNo"] = current_user.cellNo;
                  result.push({...records[i]["_doc"], ...temp});
                }

              }
            
              console.log(result)

            res.json(result);

        });
    } catch (error) {
      next(error);
    }
  });
module.exports = router;