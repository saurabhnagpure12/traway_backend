// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creating Schema
const UserSchema = new Schema({
    name :{
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
    profile_image : {
        type: String
    },
    last_seen : {
      lat_long: [{
        type: String
      }],
      date_time: {
        type: Date,
        default: Date.now
      }
    },
    circles: [{
        type: Schema.Types.ObjectId,
        ref: 'circle'
    }],
	  ciphers: [{
        type: Schema.Types.ObjectId,
        ref: 'cipher'
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
