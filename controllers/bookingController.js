const router = require("express").Router();
const user_models = require('../models/User');
const models = require('../models/models');
const requireAuth = require('../middlewares/requireAuth');
const { Vehicle, Executive } = require("../models/models");
const User = user_models.User;
router.use(requireAuth);
Trips = models.Trip;

router.post("/", async (req, res, next) => {
    try{

        await req.user;
        var custId = req.user._id;
        var distance = req.body.distance;
        var startDate = req.body.startDate;
        var returnDate = req.body.returnDate;
        var carId = req.body.carId;
        var charge = req.body.charge;
        var deliveryReqd = req.body.delivery;
        var hostId,city,custName,hostName,carName,carAddress;
        
        await Vehicle.findById(carId).then(async function(car){
            await car;
            hostId = car.hostId;
            city = car.city;
            car.booked = true;
            carName = car.make + "-" + car.model; 
            carAddress = car.street + "," + car.city;
            await car.save();

        });
        var datetime = new Date();
        var bookingDate = datetime.toISOString().slice(0,10);
        var deliveryExecutive;
        var newTrip = {
            carId:carId,
            hostId:hostId,
            custId:custId,
            distance:distance,
            bookingDate: bookingDate,
            startDate:startDate,
            returnDate:returnDate,
            charge:charge
      };


        if(deliveryReqd){
            deliveryExecutive = await Executive.findOne({city:city});    
            if(deliveryExecutive){
                console.log(deliveryExecutive);
                newTrip = {...newTrip,execId:deliveryExecutive._id,custAddress:req.body.custAddress};
            }      
        }

        var trip = new Trips(newTrip);
        result = await trip.save();
        
            //Notify host            
            await User.findById(hostId).then(async function(host) {
                    await host;
                    console.log("Host-------");
                    console.log(host);
                    hostName = host.firstName + " " + host.lastName;
                    host.notifications.push(result._id);
                    await host.save();
                });
            
            //Notify customer
            await User.findById(req.user._id).then(async function(cust){
                await cust;
                console.log("Cust-------");
                console.log(cust);
                custName = cust.firstName + " " + cust.lastName;
                cust.notifications.push(result._id);
                await cust.save();
            });
            console.log(custName);
            console.log(hostName);
          res.status(201).json({
            message: "Booking completed successfully",
            tripDetails: {
                ...result['_doc'],
                executive:deliveryExecutive,
                hostName: hostName,
                custName: custName,
                carName: carName,
                carAddress: carAddress
            }
          });
    }
        catch (error) {
            next(error);
          }


});

module.exports = router;