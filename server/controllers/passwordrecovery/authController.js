import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from './mailService.js';
import { getUserByEmail, updateUserPassword } from '../../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

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
  resetPassword,
};
