const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Vous pouvez utiliser d'autres services comme Yahoo, Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Utilisez un mot de passe d'application pour des raisons de sécurité
  }
});

module.exports = { transporter };
