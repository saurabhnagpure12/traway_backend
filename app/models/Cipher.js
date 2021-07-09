// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creating Schema
const CipherSchema = new Schema({
    cipher_code:{
        type: String,
        required:true
    },
	lat_long : [
		{
			type: String
		}
	],
    place_details:{
        type: String,
        required:true
    },
    place_area:{
        type: String,
        required:true
    },
    place_state:{
        type: String,
        required:true
    },
    place_city:{
        type: String,
        required:true
    },
    place_pincode:{
        type: String,
        required:true
    },
    place_category:{
        type: String,
        required:true
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date
    }
});

const Cipher = mongoose.model('ciphers', CipherSchema);
module.exports = Cipher;
