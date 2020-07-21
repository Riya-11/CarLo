const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const models = require('./models/models');
const vehicle = models.Vehicle;


// var exec = models.Executive({
//   name:"Exec1",
//   street:"Kamla Nagar",
//   city:"agra",
//   cellNo:"8744220011"
// });

// exec.save();

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
