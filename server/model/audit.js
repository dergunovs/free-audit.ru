const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  introtext: {
    type: String,
  },
  conclusion: {
    type: String,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  date_created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Audit", auditSchema);
