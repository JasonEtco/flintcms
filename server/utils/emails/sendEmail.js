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
});

async function sendEmail(to, template, data) {
  const html = await compile(template, data);
  const text = htmlToText.fromString(html);

  transporter.sendMail({
    from: 'Do Not Reply <info@flint.com>',
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
