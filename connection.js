const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

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
