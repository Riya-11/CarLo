const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const models = require('./models/models');
const vehicle = models.Vehicle;

// var newCar = new vehicle({
// 	make : "Hyundai",
//     model : "Verna",
//     VIN : "1234",
//     Street : "My Street",
//     City : "New York",
//     Pricing :10.2
// });
// newCar.save();
//connect to db
// var someDate = new Date();
// var numberOfDaysToAdd = 6;
// someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 

// console.log(someDate.getDate());

mongoose.connect("mongodb://localhost/carlo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.connection
  .once("open", function () {
    console.log("dB Connected");
  })
  .on("error", function (error) {
    console.log("Connection error: ", error);
  });
