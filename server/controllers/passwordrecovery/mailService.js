import nodemailer from 'nodemailer';

const sendPasswordResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const resetUrl = `http://localhost:3000/reset-password/${token}`;
  
  const mailOptions = {
    from: 'stockin.ims@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    text: `Click this link to reset your password: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f9fc;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi,</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this change, you can ignore this email.</p>
        <p>Best regards,<br>Your Team</p>
      </div>
    `
  };
  

  await transporter.sendMail(mailOptions);
};

export { sendPasswordResetEmail };
