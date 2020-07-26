const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  audit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Audit",
    required: true
  },
  url: {
    type: String,
    required: true
  },
  email: {
    type: String
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
