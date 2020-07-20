const router = require("express").Router();
const user_models = require('../models/User');

const requireAuth = require('../middlewares/requireAuth');
const Users = user_models.User;
router.use(requireAuth);

router.post("/", async (req, res, next) => {
    await req.user;
    try{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const cellNo = req.body.cellNo;
    
    const current_user = await Users.findById(req.user._id);
    current_user.firstName = firstName;
    current_user.lastName = lastName;
    current_user.cellNo= cellNo;
    
    await current_user.save();

    res.status(200).json({status:"ok"})
    
}
    catch (error) {
        next(error);
      }
    
});

module.exports = router;
