const { Trip } = require("../models/models");
const router = require("express").Router();
const requireAuth = require('../middlewares/requireAuth');
const user_models = require('../models/User');
const User = user_models.User;
const { compareDatesV2} = require('../helpers/dateCompareHelper');


router.use(requireAuth);
router.get("/", async (req, res, next) => {

    try{
        const userId = req.user._id;
        var notifications = [];   
        var pastTrips = [];
        var activeTrips = []; 
        await User.findById(userId).then(async function(user){
            await user;
            
            for(i=0;i<user.notifications.length;i++){
                var notif = await Trip.findById(user.notifications[i]);
                notifications.push(notif)
            }    
        });

        await Trip.find({custId:userId}).then(async function(trips){
            var datetime = new Date();
            const today = datetime.toISOString().slice(0,10);
            for(i=0;i<trips.length;i++){
                if (compareDatesV2(today,trips[i].returnDate)){
                    pastTrips.push(trips[i]);
                }
                else{
                    activeTrips.push(trips[i]);
                }
            }
        });

        res.status(201).json({
            notifications:notifications,
            pastTrips:pastTrips,
            activeTrips:activeTrips            
          });
    }
    catch (error) {
        next(error);
      }
    
});

module.exports = router;