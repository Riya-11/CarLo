
require('./models/User');
require('./models/models');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const requireAuth = require('./middlewares/requireAuth');
var connection = require("./connection");


// mongoose.connect("mongodb://localhost/track", {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true 
// });
const app = express();

//Middlewares
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads/'));

//Routes
app.use('', require('./routes/authRoutes'));
app.use('/search', require('./controllers/searchController.js'));
app.use('/upload',require('./controllers/uploadController.js'));
app.use('/profile/view',require('./controllers/viewProfileController.js'));
app.use('/profile/edit',require('./controllers/editProfileController.js'));
app.use('/book',require('./controllers/bookingController.js'));
app.use('/endTrip',require('./controllers/endTripController.js'));

// app.use('/executive',require('./routes/executive'));

app.get('/', requireAuth, (req,res) => {
    res.send(`Your email ${req.user.email}`);
});

//Start server
const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening at ${port}`);