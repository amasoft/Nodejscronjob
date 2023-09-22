const mongoose = require("mongoose");
const { isEmail } = require("validator");
const emailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please enter an email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "please enter  valid email"],
    },
    name: {
      type: String,
      required: [true, "please full name"],
    },
    DOB: {
      type: Date,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

const emailTask = mongoose.model("automails", emailSchema);
module.exports = emailTask;
