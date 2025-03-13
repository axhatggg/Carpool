import express from 'express';
import { authenticateUser, authenticateDriver } from '../middleware/authMiddleware.js';
import { createPool, joinPool, acceptPool, getAllPools,getUserBookings } from '../controllers/poolController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/create', authenticateUser, createPool);
router.post('/join/:poolId', protect, joinPool);
router.post('/accept/:poolId', authenticateDriver, acceptPool);
router.get('/all', getAllPools);
router.get('/user/bookings', authenticateUser, getUserBookings);
export default router;
