import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'driver'
  const [carModel, setCarModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const apiUrl = role === 'user'
      ? 'https://carpool-1.onrender.com/api/auth/user/register'
      : 'https://carpool-1.onrender.com/api/auth/driver/register';

    const userData = {
      name,
      email,
      password,
      phone,
      ...(role === 'driver' && { carModel, licensePlate }), // Add carModel and licensePlate only for driver
    };

    try {
      const res = await axios.post(apiUrl, userData);
      alert("Registered Successfully"); // Show success message
      navigate('/'); // Redirect to login page
    } catch (err) {
      if (err.response) {
        alert(err.response.data.msg); // Show error message from backend
      } else {
        alert('Something went wrong!');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-500 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-teal-900 mb-6">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
          >
            <option value="user">User</option>
            <option value="driver">Driver</option>
          </select>

          {role === 'driver' && (
            <>
              <input
                type="text"
                placeholder="Car Model"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                required
              />
              <input
                type="text"
                placeholder="License Plate Number"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                required
              />
            </>
          )}

          <button className="bg-teal-900 text-white py-3 rounded-lg hover:bg-teal-700 transition-all">
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <a href="/" className="text-teal-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
