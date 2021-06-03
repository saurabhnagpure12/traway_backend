// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creating Schema
const CircleSchema = new Schema({
    circle_name:{
        type: String,
        required:true
    },
    members:[{
        user_id:{
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    }],
    created_at:{
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date
    }
});

const Circle = mongoose.model('circles', CircleSchema);
module.exports = Circle;