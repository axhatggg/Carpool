import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token from header

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

      req.user = await User.findById(decoded.id).select('-password'); // Attach user to request object

      next(); // Proceed to next middleware
    } catch (error) {
      console.error('Unauthorized access:', error);
      return res.status(401).json({ msg: 'Unauthorized, Invalid Token' });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, Unauthorized' });
  }
};
