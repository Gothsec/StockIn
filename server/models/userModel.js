import db from '../database/db.js';

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM login WHERE email = ?';
  const result = await db.query(query, [email]);
  console.log(result);
  return result; 
};

const updateUserPassword = async (email, newPassword) => {
  const query = 'UPDATE login SET password = ? WHERE email = ?';
  await db.query(query, [newPassword, email]);
};

export {
  getUserByEmail,
  updateUserPassword,
};
