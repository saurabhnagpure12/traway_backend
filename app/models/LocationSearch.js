// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creating Schema

const LocationSearchSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'user'
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

const LocationSearch = mongoose.model('searchlocation', LocationSearchSchema);

module.exports = LocationSearch;