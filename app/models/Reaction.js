// Dependencies
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Creating Schema
const ReactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  suggestion: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  report_bug: {
    type: String, // TODO: to be checked
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Reaction = mongoose.model("reactions", ReactionSchema);
module.exports = Reaction;
