import db from '../database/db.js';
import jwt from 'jsonwebtoken';

export function login(req, res) {
  const {email, password} = req.body;
  
  const consult = 'SELECT * FROM login WHERE email = ? AND password = ?';

  try {
    db.query(consult, [email, password], (err, result) =>{
      if(err){
        res.send(err);
      }

      if(result.length > 0){
        const token = jwt.sign({email}, "Stack", {
          expiresIn: '12h'
        });
        res.send({token});

      } else {
        res.send({message: 'wrong user'});
      }
    })
  } catch (e) {

  }

}