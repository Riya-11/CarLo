const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {
        type:String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    secretToken:{
        type:String
    },
    active:{
        type:Boolean
    },

    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        required:true
    },
     cellNo:{
        type:Number,
        unique:true,
        required: true
    },
    hostRating:{
        type:Number
    },
    custRating:{
        type:Number
    }
});


// userSchema.pre('save', function(next){
//     const user = this;
//     if(!user.isModified){
//         return next();
//     }

//     // console.log(user);
//     bcrypt.genSalt(10, (err, salt) => {
//         if(err){
//             return next(err);
//         }

//         bcrypt.hash(user.password, salt, (err, hash) => {
//             if(err) {
//                 return next(err);
//             }

//             user.password = hash;
//             next();
            
//         })
//     });
// });


userSchema.methods.comparePassword = function(candidatePassword){
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if(err){
                return reject(err);
            }
            console.log(isMatch);
            console.log(user.password);
            console.log(candidatePassword);
            if(!isMatch) {
                console.log('hey');
                return reject(false);
            }

            resolve(true);
        });
    });

}


const User = mongoose.model('User', userSchema);

module.exports = { User };


module.exports.hashPassword = async function(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error("Hashing failed", error);
    }
};



