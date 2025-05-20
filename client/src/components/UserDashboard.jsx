import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket/Socket";
import { useAuth } from '../context/AuthContext';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./Navbar";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const userId = "user_id_from_context";
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [seats, setSeats] = useState("");
  const { notification } = useAuth();
  const [pickupTime, setPickupTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");

  const handleCreatePool = async () => {
    try {
      const res = await axios.post(
        "https://carpool-1.onrender.com/api/pools/create",
        { from, to, seatsAvailable: 4, pickupLocation, pickupTime },
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
      "https://carpool-1.onrender.com/api/pools/user/bookings",
      { withCredentials: true }
    );
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

  // Image slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const images = [
    "https://www.shutterstock.com/image-photo/black-modern-car-closeup-on-600nw-2139196215.jpg",
    "https://www.shutterstock.com/image-photo/view-young-woman-traveler-looking-600nw-1357730831.jpg",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-3 rounded-md shadow-lg">
          {notification}
        </div>
      )}

      {/* Image Slider */}
      <Slider {...sliderSettings} className="w-full h-64 mb-10">
        {images.map((img, index) => (
          <div key={index} className="w-full h-64">
            <img
              src={img}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
      </Slider>

      <div className="container mx-auto p-6">
        <h2 className="text-4xl font-bold text-teal-900 mb-8">User Dashboard</h2>

        {/* Create Pool Section */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-10">
          <h3 className="text-2xl font-semibold mb-6">Create a Pool</h3>
          <input
            className="p-3 mb-4 border w-full rounded-lg"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            className="p-3 mb-4 border w-full rounded-lg"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <input
            className="p-3 mb-4 border w-full rounded-lg"
            placeholder="PickUp Location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
          <input
            className="p-3 mb-6 border w-full rounded-lg"
            placeholder="PickUp Time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          />
          <button
            className="bg-teal-900 text-white w-full p-3 rounded-lg hover:bg-teal-700 transition-all"
            onClick={handleCreatePool}
          >
            Create Pool
          </button>
        </div>

        {/* My Bookings Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-6">My Bookings</h3>
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li
                key={booking._id}
                className={`p-4 rounded-lg shadow-sm ${
                  booking.status === "Confirmed"
                    ? "bg-green-100 border-l-4 border-green-500"
                    : "bg-yellow-100 border-l-4 border-yellow-500"
                }`}
              >
                <p className="text-lg font-semibold">
                  {booking.from} ➜ {booking.to}
                </p>
                <p className="text-sm text-gray-600">Status: {booking.status}</p>
                <p className="text-sm text-gray-600">Seats Available: {booking.seatsAvailable}</p>
                <p className="text-sm text-gray-600">Pickup Time: {booking.pickupTime}</p>
                <p className="text-sm text-gray-600">Pickup Location: {booking.pickupLocation}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserDashboard;
