const { transporter } = require('.');
const htmlToText = require('html-to-text');
const path = require('path');
const compile = require('./compile');

const pathToFlintLogo = path.join(__dirname, 'flintlogo.png');

/**
 * Send an email
 * @param {String} to - To whom will the email be sent
 * @param {String} template - Email template
 * @param {Object} data - Data object
 */
async function sendEmail(to, template, data) {
  if (process.env.NODE_ENV === 'test') return;
  const html = await compile(template, data);
  const text = htmlToText.fromString(html);

  transporter.sendMail({
    from: 'FlintCMS - Do not reply <info@flintcms.co>',
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
