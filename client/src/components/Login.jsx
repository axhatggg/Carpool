import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      const { token, user } = res.data;

      login(user, token, role);
      navigate(role === 'user' ? `/user/home` : `/driver/${user._id}`);
    } catch (err) {
      console.error('Login Error:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Login</h2>
      <select className="mb-4 p-2" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="driver">Driver</option>
      </select>
      <input className="border p-2 mb-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 mb-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white p-2" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
