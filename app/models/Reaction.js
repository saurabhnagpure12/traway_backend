// Dependencies
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Creating Schema
const ReactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  message: {
    type: String,
    required: true,
  },
  reaction_type: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Reaction = mongoose.model("reactions", ReactionSchema);
module.exports = Reaction;
