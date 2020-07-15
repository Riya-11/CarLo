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

function compareDates(date1, date2){
  y1 = date1.slice(0,4);
  y2 = date2.slice(0,4);

  if(y1>y2){return true;}
  if(y1<y2){return false;}

  m1 = date1.slice(5,7);
  m2 = date2.slice(5,7);

  if(m1>m2){return true;}
  if(m1<m2){return false;}

  d1 = date1.slice(8,10);
  d2 = date2.slice(8,10);

  if(d1>=d2){return true;}
  if(d1<d2){return false;}
}

// var someDate = new Date();
// var numberOfDaysToAdd = 30;
// someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 
// console.log(someDate)
// console.log(compareDates('2020-03-01','2020-03-29'));

//connect to db

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
