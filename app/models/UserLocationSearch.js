// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creating Schema

const UserLocationSearchSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    recent_search_locations: [
        {
          type: String,
        }
    ],
    created_at:{
        type: Date,
        default: Date.now
    }
});

const UserSearchedLoactions = mongoose.model('searchlocations', UserLocationSearchSchema);

module.exports = UserSearchedLoactions;
