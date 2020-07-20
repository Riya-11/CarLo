const router = require("express").Router();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const models = require('../models/models');
const Vehicles = models.Vehicle;
const user_model = require('../models/User');
const Users = user_model.User;

//returns true if date1 occurs later than date2
function compareDates(date1, date2){

  console.log('Inside func..'+date1+" "+date2);
  y1 = date1.slice(0,4);
  y2 = date2.slice(0,4);
  console.log(y1,y2);
  if(y1>y2){return true;}
  if(y1<y2){return false;}

  m1 = date1.slice(5,7);
  m2 = date2.slice(5,7);
  console.log(m1,m2);
  if(m1>m2){return true;}
  if(m1<m2){return false;}

  d1 = date1.slice(8,10);
  d2 = date2.slice(8,10);
  console.log(d1,d2);
  if(d1>=d2){return true;}
  if(d1<d2){return false;}
}


router.get("/", urlencodedParser, async (req, res, next) => {
    try {
      var availableFrom = req.query.from;
      var availableTill = req.query.to;
      if (!availableFrom || !availableTill){
          res.send('INVALID REQUEST - Please enter both availableFrom and availableTill');
      }
      console.log(availableFrom+availableTill)
      
        var city = req.query.city.toLowerCase();
        result = []
        await Vehicles.find({city:city}).then(async function(records) {
            await records;
            console.log('debug');
            console.log(availableTill);

              for(i=0;i<records.length;i++){
                a = compareDates(availableFrom,records[i].availableFrom);
                b = compareDates(records[i].availableTill,availableTill);
                
                // console.log(a+b);
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