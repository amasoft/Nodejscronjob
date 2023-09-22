const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter  valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter a pasword"],
    minlength: [6, "minimum password is 6 characters"],
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  code: {
    type: String,
    required: true,
  },
});
//fire a function befor
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
//static method tologin user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect Password");
  }
  throw Error("incorrect Email");
};
const User = mongoose.model("user", userSchema);
module.exports = User;
