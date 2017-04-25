const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const compile = require('./compile');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  secure: process.env.MAIL_SECURE,
});

// Verify Nodemail setup and connection
transporter.verify((error) => {
  if (error) {
    console.log(error); // eslint-disable-line no-console
  } else {
    console.log('[Email Service] Server can send emails!'); // eslint-disable-line no-console
  }
});

async function sendEmail(to, template, data) {
  const html = await compile(template, data);
  const text = htmlToText.fromString(html);

  transporter.sendMail({
    from: 'FlintCMS - Do not reply <info@flint.com>',
    to,
    subject: data.subject,
    html,
    text,
  }, (err) => {
    if (err) {
      console.error(err); // eslint-disable-line no-console
    }
  });
}

module.exports = sendEmail;
