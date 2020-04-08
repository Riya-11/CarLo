const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var user_model = require('./User');
const UserModel = user_model.User;
// require('mongoose-double')(mongoose);
// var SchemaTypes = mongoose.Schema.Types;


// const userSchema = new Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   secretToken : {
//     type:String
//   },
//   active: Boolean,
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });


const vehicleSchema = new Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
 },
  make: String,
  model: String,
  vin: String,
  street: String,
  city: String,
  availableFrom: {
    type: String,
    // default: Date.now
  },
  availableTill: {
    type: String,
    // default: Date.now
  },
  carImage:{
    data: Buffer,
    contentType: String,
  },
  pricing: Number,
  rating: Number
});

// const user = mongoose.model('User', userSchema);
const vehicle = mongoose.model('Vehicle',vehicleSchema);

module.exports = {Vehicle:vehicle };

