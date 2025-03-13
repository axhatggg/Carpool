import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Driver from '../models/Driver.js';

// Register Driver
export const registerDriver = async (req, res) => {
  const { name, email, password, phone, carModel, licensePlate } = req.body;

  try {
    if (!name || !email || !password || !phone || !carModel || !licensePlate) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDriver = new Driver({
      name,
      email,
      password: hashedPassword,
      phone,
      carModel,
      licensePlate,
    });

    await newDriver.save();

    const token = jwt.sign({ id: newDriver._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({ token, driver: newDriver });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Login Driver
export const loginDriver = async (req, res) => {
  const { email, password } = req.body;

  try {
    let driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    let user=driver;
  //   driver = {
  //     _id: driver._id,
  //     name: driver.name,
  //     email: driver.email,
  //     phone: driver.phone,
  // }

  return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
      message: `Welcome back ${driver.name}`,
      user,
      token,
      success: true
  })
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};


