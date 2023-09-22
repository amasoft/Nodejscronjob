const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/alluRoutes");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const nodeCron = require("node-cron");
const { addUsersToDb } = require("./controllers/autoEmail");
const automail = require("./controllers/autoEmail");
const autosms = require("./controllers/autoSMS");
// middleware
dotenv.config();
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// view engine
app.set("view engine", "ejs");

app.use(authRoutes);
// database connection
const dbURI =
  "mongodb+srv://jwt:v2Z6Njhu4g85nPpP@cluster0.bjerbjj.mongodb.net/node-auth";
const PORT = process.env.PORT || 5001;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) =>
    app.listen(PORT, function () {
      // console.log(result);
      console.log("connection succesful");
      //task 1
      // const sendreminder = nodeCron.schedule("* * * * *", () => {
      //   console.log("welcome to call cron job  " + new Date());
      //   // autosms.makeCall();
      // });
      const sendemailreminder = nodeCron.schedule(" * * * *", () => {
        console.log("welcome to message cron job  " + new Date());
        autosms.sendSMS();
      });

      // const addcelebratjob = nodeCron.schedule("*/2 * * * *", () => {
      //   console.log("welcome to cron job  " + new Date());
      //   automail.addUsersToDb();
      // });
      // const deletecelebratjob = nodeCron.schedule("*/3 * * * *", () => {
      //   console.log("welcome to delete cron job  " + new Date());
      //   automail.deleteAll();
      // });
      // const job = nodeCron.schedule("*/1 * * * *", automail.addUsersToDb);
    })
  )
  .catch((err) => console.log(err));

// routes
// app.get("/", (req, res) => res.render("home"));
// app.get("/smoothies", (req, res) => res.render("smoothies"));
// app.get("/set-cookie", (req, res) => {
//   // res.setHeader('Set-Cookie','newUser=true')
//   res.cookie("newUser", false);
//   res.cookie("isEmployer", true, {
//     maxAge: 1000 * 60 * 60 * 24,
//     httpOnly: true,
//   });
//   res.send("you got the session");
// });
// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies);
//   res.json(cookies);
// });
