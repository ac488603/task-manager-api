const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);


const sendmsg = (to, from, subject, text) => {
  sgMail.send({
    to,
    from,
    subject,
    text
  })
}

module.exports = {sendmsg}; 