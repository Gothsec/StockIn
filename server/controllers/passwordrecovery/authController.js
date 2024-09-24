import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from './mailService.js';
import { getUserByEmail, updateUserPassword } from '../../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'Email not found' });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  await sendPasswordResetEmail(email, token);

  return res.json({ message: 'Password reset link has been sent to your email.' });
};

const showResetPasswordForm = (req, res) => {
  const { token } = req.params;

  res.send(`
    <html>
      <head>
        <title>Reset Password</title>
      </head>
      <body>
        <h2>Reset your password</h2>
        <form action="/reset-password" method="POST">
          <input type="hidden" name="token" value="${token}" />
          <label for="newPassword">New Password:</label>
          <input type="password" name="newPassword" id="newPassword" required />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  let email;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    email = decoded.email;
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  await updateUserPassword(email, newPassword);

  return res.json({ message: 'Password has been reset successfully' });
};

export {
  requestPasswordReset,
  showResetPasswordForm,
  resetPassword,
};
