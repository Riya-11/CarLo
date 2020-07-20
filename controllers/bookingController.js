const router = require("express").Router();
const user_models = require('../models/User');
const models = require('../models/models');
const requireAuth = require('../middlewares/requireAuth');
const { Vehicle } = require("../models/models");
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
        
        var hostId;
        
        await Vehicle.findById(carId).then(async function(car){
            await car;
            hostId = car.hostId;
        });
        var datetime = new Date();
        var bookingDate = datetime.toISOString().slice(0,10);

        var trip = new Trips({
              carId:carId,
              hostId:hostId,
              custId:custId,
              distance:distance,
              bookingDate: bookingDate,
              startDate:startDate,
              returnDate:returnDate,
              charge:charge
        });

        trip
        .save()
        .then(result => {
        
            //Notify host            
            User.findById(hostId).then(async function(host) {
                    await host;
                    host.notifications.push(result._id);
                    await host.save();
                });

          res.status(201).json({
            message: "Booking completed successfully",
            tripDetails: {
                tripId:result._id,
                carId:result.carId,
                hostId:result.host,
                custId:result.custId,
                distance:result.distance,
                bookingDate: result.bookingDate,
                startDate:result.startDate,
                returnDate:result.returnDate,
                charge:result.charge
            }
          });
        });
    }
        catch (error) {
            next(error);
          }


});

module.exports = router;
