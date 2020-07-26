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
      introtext: { type: String, required: true },
      recomendation: { type: String, required: true }
    }
  ],
  date_created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Question", questionSchema);
