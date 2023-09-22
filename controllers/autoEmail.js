const emaiTask = require("../models/emailModels");
const { autoEmail } = require("../util/sendmail");
const { sendmail, emailverified } = require("../util/sendmail");
module.exports.addUsersToDb = async (req, res) => {
  // const { email, name, DOB } = req.body;
  const data = [
    {
      name: "Amadi patrick",
      email: "amadifaraday@gmail.com",
      DOB: "11/07/1996",
    },
    {
      name: "Amadi patrick",
      email: "amadimarcelino@gmail.com",
      DOB: "12/07/1995",
    },
  ];

  try {
    // const user = await emaiTask.create(req.body);
    const user = await emaiTask.create(data);

    console.log("Notification", "Users Added");
    // res.status(201).json({
    //   user: user._id,
    //   message: "Users Added to db succesfully",
    // });
  } catch (err) {
    console.log("arine", err);
  }
};

module.exports.deleteAll = async (req, res) => {
  try {
    const result = await emaiTask.deleteMany({});

    console.log("Notification", "Users deleted");
    // res.status(201).json({
    //   message: "Users deleted succesfully",
    // });
  } catch (err) {
    console.log("arine", err);
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await emaiTask
      .find({})
      .select("-created_at -updatedAt -_id -__v");
    users.map((user, index) => {
      console.log("user" + index, user.email);
      const result = autoEmail("", user.email);
    });
    // const objj = JSON.parse({ users });
    res.status(201).json({
      user: users,
      message: "Users fetched",
    });
  } catch (err) {
    console.log("arine", err);
    res.status(400).json({ err });
  }
};
module.exports.automateEmail = async (req, res) => {
  console.log("welcome to auto email");
  // res.json({
  //   message: " welcome to auto email",
  // });
  //arrays of emails
  const emailsto = [
    "amadiarinzechukwu@gmail.com",
    "amadimarcelino5401@gmail.com",
    "amadimarcelino@gmail.com",
  ];

  emailsto.forEach((val, index, option) => {
    console.log("data>>>", val + " index" + index + " val " + option);
    const result = sendmail("", val);
  });
  //send email to two receips
  //response
  res.json({
    message: " Email was sent succefully",
  });
};
