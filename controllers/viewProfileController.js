const { Review, Trip } = require("../models/models");
const user_models = require("../models/User");
const User = user_models.User;
const router = require("express").Router();

router.get("/", async (req, res, next) => {

    try{
    
    const hostId = req.query.hostId;
    await User.findById(hostId).then(async function(user){
        await user;
        var ratings = [];
        var notifications = [];

        console.log(user.hostReview);

        for(i=0;i<user.hostReview.length;i++){
            var review = await Review.findById(user.hostReview[i]);
            if(review){
                console.log(review);
                reviewerName = await User.findById(review.reviewer);
                ratings.push({...review['_doc'],reviewerName:reviewerName.firstName + " " + reviewerName.lastName});
            }
            
        }

        
        for(i=0;i<user.notifications.length;i++){
            var notif = await Trip.findById(user.notifications[i]);
            if(notif){
                notifications.push(notif);
            }
        }
               

        await Vehicles.find({hostId:hostId}).then(async function(cars) {
            await cars;
            console.log(cars);
            return res.send({
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                cellNo:user.cellNo,
                cars:cars,
                rating:ratings,
                notifications:notifications
             });
        });

    })
    
}
    catch (error) {
        next(error);
      }
    
});
module.exports = router;
