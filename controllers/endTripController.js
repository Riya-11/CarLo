const router = require("express").Router();
const user_models = require('../models/User');
const models = require('../models/models');
const requireAuth = require('../middlewares/requireAuth');
const { Executive } = require("../models/models");
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
        var hostId, carId, hostName;

        var cust = await User.findById(custId);
        var custName = cust.firstName + " " + cust.lastName;

        await Trips.findById(tripId).then(async function(trip){
            await trip;
            hostId = trip.hostId;
            carId = trip.carId;
        });

        const carfilter = { _id:carId };
        const carupdate = { 
            booked:false
         };

        let updatedCar = await Vehicles.findOneAndUpdate(carfilter, carupdate, {
            new: true
          });
        var carName = updatedCar.make + "-" + updatedCar.model;
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

            //get executive instance
            Executive.findById(updatedTrip.execId).then(async function(exec){
                await exec;
                res.status(201).json({
                    message: "Trip Ended successfully",
                    tripDetails: {
                        tripId:updatedTrip._id,
                        carId:updatedTrip.carId,
                        hostId:updatedTrip.host,
                        custId:updatedTrip.custId,
                        executive:exec,
                        distance:updatedTrip.distance,
                        bookingDate: updatedTrip.bookingDate,
                        startDate:updatedTrip.startDate,
                        returnDate:updatedTrip.returnDate,
                        hostRating:updatedTrip.hostRating,
                        carRating:updatedTrip.carRating,
                        custAddress: updatedTrip.custAddress,
                        ended:updatedTrip.ended,
                        charge:updatedTrip.charge,
                        hostName: hostName, 
                        custName: custName, 
                        carName: carName
                    }
                  });
            });
        });

    }catch (error) {
       next(error);
    }


});

module.exports = router;
