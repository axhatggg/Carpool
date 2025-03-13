import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const UserHomePage = () => {
  const [pools, setPools] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPools = async () => {
    try {
      let res = await axios.get('http://localhost:8000/api/pools/all');
      setPools(res.data);
    } catch (error) {
      console.error('Error fetching pools:', error);
    }
  };

  const handleJoinPool = async (poolId) => {
    try {
      const token = Cookies.get('token');
      const res = await axios.post(
        `http://localhost:8000/api/pools/join/${poolId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        }
      );
  
      alert('Successfully joined the pool!');
      fetchPools(); // Refresh the pool list
    } catch (err) {
      // This will correctly show the error message sent from the backend
      // console.error('Error joining pool:', err.response.data.msg); 
      alert(err.response.data.msg); // Show alert to the user
    }
  };
  

  useEffect(() => {
    fetchPools();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold mb-6">Available Pools 🚗</h1>

      {/* Button to navigate to User Dashboard */}
      <button 
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => navigate('/user/dashboard')}
      >
        Go to Dashboard
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool) => (
          <div key={pool._id} className="bg-white p-5 rounded-md shadow-md">
            <h2 className="text-xl font-semibold">From: {pool.from} ➡️ To: {pool.to}</h2>
            <p>Created By: {pool.createdBy.name}</p>
            <p>Seats Available: {pool.seatsAvailable}</p>
            <p>Status: {pool.status}</p>

            <button 
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={() => handleJoinPool(pool._id)}
            >
              Join Pool
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHomePage;
