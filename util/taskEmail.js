const { verify } = require("crypto");
var nodemailer = require("nodemailer");

const emailTask = async (email, subject, taskHeader, taskMessage) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amadifaraday@gmail.com",
      pass: "foympeqrkqmkukac",
    },
  });

  var verifedemailopt = {
    from: "amadifaraday@gmail.com",
    to: `${email}`,
    subject: `${subject}`,
    // text: "you have a new request for backend task ",
    html: `<h4>${taskMessage} </h4>` + `<p>${taskMessage} </p>`,
  };

  const sendMail = transporter.sendMail(
    verifedemailopt,
    function (error, info) {
      if (error) {
        console.log(error);
        return {
          error,
          message: "email not sent",
        };
      } else {
        console.log("Email sent: " + info.response);
        return true;
      }
    }
  );
};

module.exports = {
  emailTask,
};
