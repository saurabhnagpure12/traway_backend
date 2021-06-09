// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creating Schema
const UserLocationSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    start:{
        lat:{
            type: String,
            required: true
        },
        long: {
            type: String,
            required: true
        },
    },
    end:{
        lat:{
            type: String,
            required: true
        },
        long: {
            type: String,
            required: true
        },
    },
    created_at:{
        type: Date,
        default: Date.now
    }
});

const UserLocation = mongoose.model('userLocations', UserLocationSchema);

module.exports = UserLocation;