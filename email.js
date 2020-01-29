const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);


const sendWelcomemsg = (to, name) => {
  sgMail.send({
    to,
    from : "test@example.com",
    subject : "Welcome",
    text: `Hello ${name}! Welcome to TSkMan.`
  })
}

const sendCanelationMessage = (to, name) => {
  sgMail.send({
    to,
    from: "test@example.com",
    subject: "What Why!?",
    text : `${name}, we are coming for you ...`
  })
}

module.exports = {sendWelcomemsg, sendCanelationMessage}; 