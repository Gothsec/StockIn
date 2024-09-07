import db from '../database/db.js';
import jwt from 'jsonwebtoken';

export function login(req, res) {
  const {email, password} = req.body;
  
  const consult = 'SELECT * FROM login WHERE email = ? AND password = ?';

  try {
    db.query(consult, [email, password], (err, result) =>{
      if(err){
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      if(result.length > 0){
        const token = jwt.sign({email}, "Stack", {
          expiresIn: '12h'
        });
        res.send({token});

      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    })
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error', error: e.message });
  }

}