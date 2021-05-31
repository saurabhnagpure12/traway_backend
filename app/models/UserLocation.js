// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creating Schema
const UserLocationSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    full_address:{
        type: String,
        required: true
    },
    short_code:{
        type: String,
        required: true
    },
    lat_long:{
        x:{
            type: String
        },
        y:{
            type: String
        }
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date
    }
});

const UserLocation = mongoose.model('userLocations', UserLocationSchema);

module.exports = UserLocation;