const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  audit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Audit"
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questions"
    }
  ],
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  date_created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Result", resultSchema);
