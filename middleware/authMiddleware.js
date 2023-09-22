const jwt = require("jsonwebtoken");
const { decode } = require("punycode");
const User = require("../models/User");
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  //check json web token is exit and verifed
  if (token) {
    jwt.verify(token, "net ninja secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log("decode token", decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};
//check user
const checkUser = (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "net ninja secret", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        console.log(err.message);
        next();
      } else {
        console.log("decode token", decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
  }
};
const UserExist = async (req, res, next) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    return res.status(200).json({
      message: "user Already exist",
    });
  }
  next();
};
module.exports = {
  requireAuth,
  checkUser,
  UserExist,
};
