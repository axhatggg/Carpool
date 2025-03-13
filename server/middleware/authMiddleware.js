import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Driver from '../models/Driver.js';

// Middleware for User Authentication
export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware for Driver Authentication
export const authenticateDriver = async (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token)
  if (!token) {
    console.log("no token")
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let d=await Driver.findById(decoded.id).select('-password');
    if(!d)
      res.status(401).json({ msg: 'nayi mila driver' });
    else
    {req.driver = d;
    

    next();}
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
