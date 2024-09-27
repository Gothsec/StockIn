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
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          function validateForm() {
            const password = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password.length < 8) {
              alert('La contraseña debe tener al menos 8 caracteres.');
              return false;
            }
            
            if (password !== confirmPassword) {
              alert('Las contraseñas no coinciden.');
              return false;
            }

            return true;
          }
        </script>
      </head>
      <body class="bg-gray-100 flex items-center justify-center h-screen">
        <div class="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
          <h2 class="text-2xl font-semibold mb-4">Reset your password</h2>
          <form action="/reset-password" method="POST" class="space-y-4" onsubmit="return validateForm()">
            <input type="hidden" name="token" value="${token}" />
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password:</label>
              <input type="password" name="newPassword" id="newPassword" required minlength="8" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
            </div>
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password:</label>
              <input type="password" name="confirmPassword" id="confirmPassword" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Submit</button>
          </form>
        </div>
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

  return res.send(` <html>
    <head>
      <title>Password Reset Successful</title>
      <style>
        /* Estilos CSS */
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f3f4f6;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
  
        .container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          text-align: center;
        }
  
        h2 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #333333;
        }
  
        p {
          color: #666666;
          margin-bottom: 20px;
          font-size: 16px;
        }
  
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #3490dc;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
  
        .button:hover {
          background-color: #2779bd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset Successfully</h2>
        <p>Your password has been updated.</p>
      </div>
    </body>
  </html>
  `);
};

export {
  requestPasswordReset,
  showResetPasswordForm,
  resetPassword,
};
