const { transporter } = require("../configs/mailer");

exports.sendEmails = async (mailOptions, res) => {
  try {
    console.log('Sending email...');
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return res.status(500).json({ error: true, message: 'Failed to send email' });
  }
};
