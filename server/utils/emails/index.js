const nodemailer = require('nodemailer');
const chalk = require('chalk');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  secure: process.env.MAIL_SECURE || true,
});

function verifyNodemailer() {
  return new Promise((resolve, reject) => {
    transporter.verify((error) => {
      if (error) {
        switch (error.code) {
          case 'ECONNECTION':
            reject(`${chalk.red('[Email Service]')} Connection could not be established, you may be offline.`);
            break;
          default:
            reject(error);
        }
      }
      resolve(`${chalk.grey('[Email Service]')} Server can send emails!`);
    });
  });
}

exports.verifyNodemailer = verifyNodemailer;

exports.transporter = transporter;
