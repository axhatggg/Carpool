import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch('https://carpool-1.onrender.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // Send cookies to backend
      });

      if (res.ok) {
        logout(); // Call AuthContext logout function
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className='bg-black fixed w-screen z-2 shadow-black flex justify-around items-center px-7 '>
      <h1 className='font-black text-white text-4xl mx-3 my-3'>Share<span className='text-amber-300'>Wheels</span></h1>

      <div className='flex gap-4'>
        {user ? (
          <>
            <span className="font-semibold text-white">Welcome, {user.name}!</span>
            <button className='mx-1 cursor-pointer font-semibold text-white'><Link to="/">Home</Link></button>
            <button 
              className='mx-1 cursor-pointer font-semibold text-white'
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button className='mx-1 cursor-pointer font-semibold text-white'><Link to="/register">Register</Link></button>
            <button className='mx-1 cursor-pointer font-semibold text-white'><Link to="/login">Sign In</Link></button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
