// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creating Schema
const UserSchema = new Schema({
    name :{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    otp:{
        type: Number
    },
    profile_pic : {
        type: String
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;