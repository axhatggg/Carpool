import { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../socket/Socket';

const DriverDashboard = () => {
  const [pools, setPools] = useState([]);

  const fetchPools = async () => {
    const res = await axios.get('https://carpool-1.onrender.com/api/pools/all', { withCredentials: true });
    setPools(res.data);
  };

  const acceptPool = async (poolId) => {
    console.log(poolId)
    await axios.post(`https://carpool-1.onrender.com/api/pools/accept/${poolId}`, {}, { withCredentials: true });
    fetchPools();
  };

  useEffect(() => {
    fetchPools();

    socket.on('newPoolRequest', (newPool) => {
      setPools((prevPools) => [...prevPools, newPool]);
    });

    return () => socket.off('newPoolRequest');
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6">Active Pool Requests</h2>
      <ul>
        {pools.map((pool) => (
          <li key={pool._id} className="p-4 mb-4 border bg-gray-100">
            {pool.from} ➜ {pool.to} | Seats: {pool.seatsAvailable}
            <button
              className="ml-4 bg-green-500 text-white p-2 rounded"
              onClick={() => acceptPool(pool._id)}
            >
              Accept
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverDashboard;
