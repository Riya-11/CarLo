const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var user_model = require('./User');
const UserModel = user_model.User;
var SchemaTypes = mongoose.Schema.Types;

const vehicleSchema = new Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
 },
  make: String,
  model: String,
  vin: String,
  seatingCapacity: Number,
  street: String,
  city: String,
  geometry: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: []
  },
  availableFrom: {
    type: String,
  },
  availableTill: {
    type: String,
  },
  carImage:{
    type:String
  },
  pricing: Number,
  rating: Number,
  booked:{
    type:Boolean,
    default:false
  }
});
vehicleSchema.index({ "loc": "2dsphere" });

const tripSchema = new Schema({
  carId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Vehicle'
  },
  hostId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  custId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  execId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Executive'
  },
  distance:Number,
  bookingDate: String,
  startDate:String,
  returnDate:String,
  custAddress:String,
  hostRating:Number,
  carRating:Number,
  ended:{
    type:Boolean,
    default: false
  },
  charge:Number

});

const reviewSchema = new Schema({

  tripId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Trip'
  },
  reviewer:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  review:String,
  carRating:Number,
  hostRating: Number
});

const executiveSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  street:{
    type: String,
    required:true
  },
  city:{
    type: String,
    required:true
  },
  cellNo:{
    type:Number,
    required:true
  }
});

const vehicle = mongoose.model('Vehicle',vehicleSchema);
const trip = mongoose.model('Trip',tripSchema);
const review = mongoose.model('Review',reviewSchema);
const executive = mongoose.model('Executive',executiveSchema);
module.exports = {Vehicle:vehicle,Trip:trip,Review:review,Executive:executive};
