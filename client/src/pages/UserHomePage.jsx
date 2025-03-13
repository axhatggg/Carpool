import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserHomePage = () => {
  const { userId } = useParams();
  const [userBookings, setUserBookings] = useState([]);

  const fetchUserBookings = async () => {
    const res = await axios.get(`/api/pools/user/${userId}`);
    setUserBookings(res.data);
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl mb-6">My Pool Bookings</h2>
      <ul>
        {userBookings.map((booking) => (
          <li
            key={booking._id}
            className={`p-4 mb-4 border ${
              booking.status === 'Confirmed' ? 'bg-green-200' : 'bg-yellow-200'
            }`}
          >
            {booking.from} ➜ {booking.to} | Status: {booking.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserHomePage;
