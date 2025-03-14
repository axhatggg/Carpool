import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/logout', {
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
    <div className='bg-slate-200 shadow-black shadow-lg flex justify-between items-center px-7 '>
      <h1 className='font-black text-4xl mx-3 my-3'>Car<span className='text-teal-900'>Pool</span></h1>

      <div className='flex gap-4'>
        {user ? (
          <>
            <span className="font-semibold text-teal-900">Welcome, {user.name}!</span>
            <button className='mx-1 cursor-pointer font-semibold'><Link to="/">Home</Link></button>
            <button 
              className='mx-1 cursor-pointer font-semibold text-red-600'
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button className='mx-1 cursor-pointer font-semibold'><Link to="/register">Register</Link></button>
            <button className='mx-1 cursor-pointer font-semibold'><Link to="/login">Sign In</Link></button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
