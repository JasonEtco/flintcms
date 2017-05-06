const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const path = require('path');
const compile = require('./compile');
const config = require('../../../config');

const pathToFlintLogo = path.join(__dirname, 'flintlogo.png');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  secure: process.env.MAIL_SECURE || true,
});

// Verify Nodemail setup and connection
transporter.verify((error) => {
  if (error) {
    console.log(error); // eslint-disable-line no-console
  } else {
    console.log('[Email Service] Server can send emails!'); // eslint-disable-line no-console
  }
});

/**
 * Send an email
 * @param {String} to - To whom will the email be sent
 * @param {String} template - Email template
 * @param {Object} data - Data object
 */
async function sendEmail(to, template, data) {
  const html = await compile(template, Object.assign(data, config));
  const text = htmlToText.fromString(html);

  transporter.sendMail({
    from: 'FlintCMS - Do not reply <info@flint.com>',
    to,
    subject: data.subject,
    html,
    text,
    attachments: [{
      filename: 'flintlogo.png',
      path: pathToFlintLogo,
      cid: 'flintlogo',
    }],
  }, (err) => {
    if (err) {
      console.error(err); // eslint-disable-line no-console
    }
  });
}

module.exports = sendEmail;
