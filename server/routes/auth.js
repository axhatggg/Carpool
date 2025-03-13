import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { registerDriver, loginDriver } from '../controllers/driverAuthController.js';
import { logout } from '../controllers/authController.js';

const router = express.Router();

// User Auth Routes
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);

// Driver Auth Routes
router.post('/driver/register', registerDriver);
router.post('/driver/login', loginDriver);

router.post('/logout',logout);
export default router;
