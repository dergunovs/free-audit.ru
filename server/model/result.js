const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  audit: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "Audit", required: true },
    questions: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        answer_picked: { type: mongoose.Schema.Types.ObjectId },
        comment: { type: String }
      }
    ]
  },
  url: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Result", resultSchema);
