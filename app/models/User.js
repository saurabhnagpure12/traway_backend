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
    otp:{
        number:{
            type: Number,
            min: [6]
        },
        expires_at:{
            type: Date
        }
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