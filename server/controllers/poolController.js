import Pool from '../models/Pool.js';
import Driver from '../models/Driver.js';

// Get all bookings of a user
export const getUserBookings = async (req, res) => {
  try {
    const pools = await Pool.find({ passengers: req.user._id })
      .populate('createdBy')
      .populate('driverId');
      
      // console.log(res);
    res.status(200).json(pools);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};
// Create a new pool
export const createPool = async (req, res) => {
  const { from, to, seatsAvailable } = req.body;

  try {
    const newPool = new Pool({
      createdBy: req.user._id, // Rider who creates the pool
      from,
      to,
      seatsAvailable,
      passengers: [req.user._id],
      status: 'Pending',
    });

    await newPool.save();

    // Notify all drivers via socket
    global.io.emit('newPoolRequest', newPool);

    res.status(201).json(newPool);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Join an existing pool
export const joinPool = async (req, res) => {
  const { poolId } = req.params;
  
  try {
    const pool = await Pool.findById(poolId);
    console.log(pool._id);
    if (!pool) {
      return res.status(404).json({ msg: 'Pool not found' });
    }
    console.log("reached")
    console.log(req.user._id)
    if (pool.passengers.includes(req.user._id)) {
      return res.status(400).json({ msg: 'Already joined the pool' });
    }
    console.log("reached")
    if (pool.seatsAvailable === 0) {
      console.log("LAuda mera")
      return res.status(400).json({ msg: 'No seats available' });
    }
    console.log("reached")
    pool.passengers.push(req.user._id);
    pool.seatsAvailable -= 1;

    await pool.save();
    
    res.status(200).json(pool);
  } catch (err) {
    console.log("reached")
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Accept Pool (Driver)
export const acceptPool = async (req, res) => {
  const { poolId } = req.params;

  try {
    const pool = await Pool.findById(poolId);

    if (!pool) {
      return res.status(404).json({ msg: 'Pool not found' });
    }

    pool.status = 'Confirmed';
    pool.driverId = req.driver._id;

    await pool.save();
    // Notify only the pool creator (user) via socket
    const userSocketId = global.activeUsers[pool.createdBy.toString()]; 
    if (userSocketId) {
      global.io.to(userSocketId).emit('notification', {
        message: 'Your Pool Ride is Confirmed 🚀'
      });
    }

    res.status(200).json(pool);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Get all active pools
export const getAllPools = async (req, res) => {
  try {
    const pools = await Pool.find({ status: 'Pending' }).populate('createdBy').populate('passengers');
    res.status(200).json(pools);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};
