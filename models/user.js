let mongoose = require('mongoose');

//User Schema
let UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
});

// module.exports = mongoose.model('User', UserSchema);

const User = mongoose.model('User', UserSchema);
module.exports.User = User;