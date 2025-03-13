import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket/Socket";
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const userId = "user_id_from_context";
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [seats, setSeats] = useState("");
  const { notification } = useAuth();


  const handleCreatePool = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/pools/create",
        { from, to, seatsAvailable: seats },
        { withCredentials: true }
      );

      // Emit socket event to drivers for new pool request
      socket.emit("newPoolRequest", res.data);

      alert("Pool Created Successfully");
      fetchBookings(); // To update the bookings after pool creation
    } catch (err) {
      console.error(err);
      alert("Error creating pool");
    }
  };

  const fetchBookings = async () => {
    const res = await axios.get(
      "http://localhost:8000/api/pools/user/bookings",
      { withCredentials: true }
    );
    console.log(res);
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();

    // Listen to socket for pool confirmation
    socket.on("poolConfirmed", (updatedPool) => {
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === updatedPool._id ? updatedPool : booking
        )
      );
    });

    return () => socket.off("poolConfirmed");
  }, []);

  return (
    <div className="container mx-auto p-6">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-3 rounded-md shadow-lg">
          {notification}
        </div>
      )}
      <h2 className="text-3xl mb-6">User Dashboard</h2>

      {/* Create Pool Section */}
      <div className="mb-10">
        <h3 className="text-2xl mb-4">Create a Pool</h3>
        <input
          className="p-2 mb-4 border w-full"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          className="p-2 mb-4 border w-full"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          className="p-2 mb-4 border w-full"
          placeholder="Seats Available"
          type="number"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleCreatePool}
        >
          Create Pool
        </button>
      </div>
      <div className="container mx-auto p-6">
        <h2 className="text-3xl mb-6">My Bookings</h2>
        <ul>
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className={`p-4 mb-4 border ${
                booking.status === "Confirmed"
                  ? "bg-green-200"
                  : "bg-yellow-200"
              }`}
            >
              {booking.from} ➜ {booking.to} | Status: {booking.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
