import express from 'express';
import { authenticateDriver } from '../middleware/authMiddleware.js';
import { updateLocation } from '../controllers/driverController.js';

const router = express.Router();

router.post('/update-location', authenticateDriver, updateLocation);

export default router;
