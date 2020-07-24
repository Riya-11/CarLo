const { Vehicle, Trip, Executive } = require("../models/models");
const router = require("express").Router();
const requireAuth = require('../middlewares/requireAuth');
const user_models = require('../models/User');
const User = user_models.User;

router.use(requireAuth);
router.get("/", async (req, res, next) => {

    try{
        const userId = req.user._id;
        var notifications = [];   
        var pastTrips = [];
        var activeTrips = [];
        var custName;

        await User.findById(userId).then(async function(user){
            await user;
            for(i=0;i<user.notifications.length;i++){
                var notif = await Trip.findById(user.notifications[i]);
                var host = await User.findById(notif.hostId);
                hostName = host.firstName + " " + host.lastName;
                var cust = await User.findById(notif.custId); 
                custName = cust.firstName + " " + cust.lastName;
                var car = await Vehicle.findById(notif.carId);
                var carName = car.make + "-" + car.model;
                var carAddress = car.street + "," + car.city;
                var exec = await Executive.findById(notif.execId);
                if(exec){
                    execName = exec.name;
                    execCell = exec.cellNo;
                    notifications.push({ ...notif['_doc'], hostName: hostName, custName: custName, carName: carName, carAddress: carAddress, execName: execName, execCell: execCell });
                }

                else{
                    notifications.push({ ...notif['_doc'], hostName: hostName, custName: custName, carName: carName, carAddress: carAddress});
                }
            }    
        });

        await Trip.find({custId:userId}).then(async function(trips){
            var datetime = new Date();
            const today = datetime.toISOString().slice(0,10);
            
            for(i=0;i<trips.length;i++){

                var host = await User.findById(trips[i].hostId);
                hostName = host.firstName + " " + host.lastName;
                var car = await Vehicle.findById(trips[i].carId);
                var carName = car.make + "-" + car.model;
                var carAddress = car.street + "," + car.city;

                var exec = await Executive.findById(trips[i].execId);
                var temp;

                if(exec){
                    execName = exec.name;
                    execCell = exec.cellNo;
                    temp = { ...trips[i]['_doc'], hostName: hostName, custName: custName, carName: carName, carAddress: carAddress, execName: execName, execCell: execCell };
                }
                else{
                    temp = { ...trips[i]['_doc'], hostName: hostName, custName: custName, carName: carName, carAddress: carAddress};
                }
                if(trips[i].ended){
                    pastTrips.push(temp);
                }
                else{
                    activeTrips.push(temp);
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