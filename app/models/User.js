// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creating Schema
const UserSchema = new Schema({
    username :{
        type: String
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
    circle: [{
        type: Schema.Types.ObjectId,
        ref: 'circle'
    }],
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
