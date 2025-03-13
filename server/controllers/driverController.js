import Driver from '../models/Driver.js';

// Update Driver's Live Location
export const updateLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const driver = await Driver.findById(req.driver._id);

    driver.location = { latitude, longitude };
    await driver.save();

    // Broadcast driver's location to riders
    global.io.emit('driverLocationUpdated', {
      driverId: driver._id,
      location: driver.location,
    });

    res.status(200).json({ msg: 'Location updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};
