const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  introtext: {
    type: String,
    required: true
  },
  level: {
    type: String
  },
  answers: [
    {
      name: { type: String, required: true },
      recomendation: { type: String, required: true }
    }
  ],
  answer_picked: {
    type: mongoose.Schema.Types.ObjectId
  },
  comment: {
    type: String
  },
  feature: {
    type: String
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Question", questionSchema);
