const mongoose = require("mongoose");
const questionShema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 2;
        },
        message: "A question must have at least 2 options",
      },
      keywords: {
        type: [String],
        default: [],
      },
      correctAnswerIndex: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Question", questionShema);
