const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendmail, emailverified } = require("../util/sendmail");

const handleErrors = (err) => {
  // console.log("handleErrors", err);

  let errors = { email: "", password: "" };
  //incoreet email
  if (err.message === "incorrect Email") {
    errors.email = "email not registered ";
  }
  //incoreet password
  if (err.message === "incorrect Password") {
    errors.password = "password is incorrect ";
  }
  //duplivcate error code
  if (err.code === 11000) {
    errors.email = "that email is already registerd";
    return errors;
  }
  //validat
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
      console.log("888888", properties);
    });
    // console.log(err);
  }
  return errors;
};
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "net ninja secret", { expiresIn: maxAge });
};
module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  verifycode = Math.floor(Math.random() * 90000) + 10000;
  req.body.code = verifycode;
  req.body.verified = false;
  try {
    const user = await User.create(req.body);
    const token = createToken(user._id);
    const sendCode = await sendmail(verifycode, email);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({
      user: user._id,
      token,
      message: "Registration Succesfull Proceed to verify your Email",
    });
  } catch (err) {
    const errors = handleErrors(err);
    console.log("arinze", err);
    res.status(400).json({ errors });
  }
  // adesinak4@gmail.com
};
module.exports.verifyEmail = async (req, res) => {
  const { code } = req.body;
  console.log(code);
  const checkCode = await User.findOne({
    code: code,
  });
  if (!checkCode) {
    console.log("checkCode", checkCode);

    return res.status(401).json({
      message: "Incorrct code",
    });
  }
  console.log("checkCode id", checkCode._id);

  // const verifyEmail = User.updateOne(
  await User.updateOne(
    { code: code },
    { $set: { verified: true, code: undefined } },
    (err, result) => {
      if (err) {
        console.log("err", err);
        // return res.status(200).json({
        //   message: "erro verifying Email",
        // });
      } else {
        console.log("success", result);
        const sendverifiedmail = emailverified(checkCode.email);
        return res.status(200).json({
          message: "Email veriefied",
        });
      }
    }
  );
  // if (verifyEmail) {

  // }
  // return res.status(200).json({
  //   message: "erro verifying Email",
  // });
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    if (user) {
      return res
        .status(200)
        .json({ user: user._id, message: "Login  Succesfull" });
    }
    return res.status(200).json({ message: "incorrect Email/password" });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
module.exports.logout_get = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = createToken(user._id);
    return res.status(200).json({ token: token, message: "Login  Succesfull" });
  }
  return res.status(401).json({ message: "incorrect email/password" });
};
