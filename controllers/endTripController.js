const router = require("express").Router();
const user_models = require('../models/User');
const models = require('../models/models');
const requireAuth = require('../middlewares/requireAuth');
const { Executive } = require("../models/models");
const { Number } = require("mongoose");
// const { parseFloat} = require('Float');
const User = user_models.User;
router.use(requireAuth);
Trips = models.Trip;
Reviews = models.Review;

router.post("/", async (req, res, next) => {
    try{
        await req.user;
        var tripId = req.body.tripId;
        var carRating = req.body.carRating;
        var hostRating = req.body.hostRating;
        var review = req.body.review;
        var custId = req.user._id;
        var returnDate = req.body.returnDate;
        var hostId, carId, hostName, carName, carAddress;

        var cust = await User.findById(custId);
        var custName = cust.firstName + " " + cust.lastName;

        await Trips.findById(tripId).then(async function(trip){
            await trip;
            hostId = trip.hostId;
            carId = trip.carId;
        });

        await Vehicles.findById(carId).then(async function(car){
            await car;
            
            car.rating = ((parseFloat(car.rating) * parseFloat(car.numTrips)) + parseFloat(carRating)) / (parseFloat(car.numTrips)+1);
            car.numTrips = parseFloat(car.numTrips) + 1;
            car.booked=false;
            carName = car.make + "-" + car.model;
            carAddress = car.street + "," + car.city;
            await car.save();
        });
        const filter = { _id:req.body.tripId };
        const update = { 
            carRating: carRating,
            hostRating: hostRating,
            returnDate: returnDate,
            ended: true
         };

        let updatedTrip = await Trips.findOneAndUpdate(filter, update, {
            new: true
          });

        var reviewInstance = new Reviews({
            tripId:tripId,
            reviewer:custId,
            review:review,
            carRating:carRating,
            hostRating:hostRating
        });
        
        reviewInstance
        .save()
        .then(result => {

            
            //Update User's rating and review
            User.findById(hostId).then(async function(host) {
                await host;
                host.hostReview.push(result._id);
                hostName = host.firstName + " " + host.lastName;

                await host.save();
            });
            console.log('Hostname---');
            console.log(hostName);
            //get executive instance
            Executive.findById(updatedTrip.execId).then(async function(exec){
                await exec;
                res.status(201).json({
                    message: "Trip Ended successfully",
                    tripDetails: {
                        ...updatedTrip['_doc'],
                        executive:exec,
                        hostName: hostName, 
                        custName: custName, 
                        carName: carName,
                        carAddress: carAddress
                    }
                  });
            });
        });

    }catch (error) {
       next(error);
    }


});

module.exports = router;
