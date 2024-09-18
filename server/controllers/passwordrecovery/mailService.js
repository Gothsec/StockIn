import nodemailer from 'nodemailer';

const sendPasswordResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
  
  const mailOptions = {
    from: 'stockin.ims@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    text: `Click this link to reset your password: ${resetUrl}`,
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
  };

  await transporter.sendMail(mailOptions);
};

export { sendPasswordResetEmail };
