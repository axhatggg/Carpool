import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PoolBooking = () => {
  const { user } = useAuth();

  const createPool = async () => {
    const res = await axios.post('/api/pools/create', {
      userId: user._id,
      from: 'BIT Mesra',
      to: 'Ranchi Airport',
      seatsAvailable: 3,
    });

    console.log('✅ Pool Created:', res.data);
  };

  return (
    <div>
      <h2>Book Your Pool Ride</h2>
      <button onClick={createPool}>Create Pool</button>
    </div>
  );
};

export default PoolBooking;
