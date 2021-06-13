// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creating Schema
const UserRoutesSchema = new Schema({
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

const UserRoutes = mongoose.model('userRoutes', UserRoutesSchema);

module.exports = UserRoutes;
