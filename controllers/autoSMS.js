const { error } = require("console");
const twilio = require("twilio");

module.exports.sendSMS = (req, res, next) => {
  const accountssid = "ACede3b65a92a28e2aa069c544a4094427";
  const autToken = "83e860eb55a3d586b45911be96843fd3";

  const client = new twilio(accountssid, autToken);

  const fromNumber = "+15177934255";
  const receipentNumber = "+2349060834999";
  client.messages
    .create({
      body: "this is a test from twilio node js ",
      from: fromNumber,
      to: receipentNumber,
    })
    .then((message) => console.log("message sent succesfully"))
    .catch((error) => console.log("error sending message "));
};
module.exports.makeCall = (req, res, next) => {
  const accountSid = "ACede3b65a92a28e2aa069c544a4094427";
  const authToken = "83e860eb55a3d586b45911be96843fd3";
  const client = new twilio.Twilio(accountSid, authToken);

  const toPhoneNumber = "+2349060834999"; // Phone number to call
  const fromPhoneNumber = "+15177934255"; // Your Twilio phone number

  // Make a call
  client.calls
    .create({
      url: "http://demo.twilio.com/docs/voice.xml", // A URL for Twilio to fetch instructions (you can replace this with your own XML or TwiML)
      to: toPhoneNumber,
      from: fromPhoneNumber,
    })
    .then((call) => console.log(`Call SID: ${call.sid}`))
    .catch((error) => console.error(error));
};
