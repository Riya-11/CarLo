const router = require("express").Router();

router.get("/", async (req, res, next) => {

    try{
    
    const hostId = req.query.hostId;
    await User.findById(hostId).then(async function(user){
        await user;
        await Vehicles.find({hostId:hostId}).then(async function(cars) {
            await cars;
            console.log(cars);
            return res.send({
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                cellNo:user.cellNo,
                cars:cars
             });
        });

    })
    
}
    catch (error) {
        next(error);
      }
    
});
module.exports = router;
