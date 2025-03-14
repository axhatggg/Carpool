import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'driver'

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`http://localhost:8000/api/auth/${role}/login`, { email, password }, { withCredentials: true });
      // console.log("idhar")
      const { token, user } = res.data;
      // console.log("idhar")
      login(user, token, role);
      navigate(role === 'user' ? `/` : `/driver/${user._id}`);
    } catch (err) {
      if (err.response) {
        // Handle the status code and show the message from API
        console.log(err.response)
        alert(err.response.data.msg); // Backend message
      } else {
        // Network error or other issues
        alert('Something went wrong. Try again!');
      }
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-teal-500 to-blue-600">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back 🚀</h2>

        <div className="flex justify-center mb-6">
          <button 
            className={`px-6 py-2 rounded-l-full text-sm font-semibold ${role === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setRole('user')}
          >
            User
          </button>
          <button 
            className={`px-6 py-2 rounded-r-full text-sm font-semibold ${role === 'driver' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setRole('driver')}
          >
            Driver
          </button>
        </div>

        <input
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-6 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-gray-600 text-sm text-center mt-5">
          Don't have an account? <span className="text-teal-500 cursor-pointer hover:underline"><Link to="/register">Register</Link></span>
        </p>
      </div>
    </div>
  );
};

export default Login;
