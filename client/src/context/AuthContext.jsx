import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { connectSocket } from '../socket/Socket';
import socket from '../socket/Socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);


  const login = (userData, token, userRole) => {
    setUser(userData);
    setRole(userRole);
    Cookies.set('token', token);
    Cookies.set('role', userRole);

    connectSocket(userData._id);
    socket.on('notification', (data) => {
      setNotification(data.message);
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    });
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    Cookies.remove('token');
    Cookies.remove('role');
    socket.disconnect();
  };

  const isAuthenticated = () => {
    const token = Cookies.get('token');
    return token ? true : false;
  };

  useEffect(() => {
    const token = Cookies.get('token');
    const userRole = Cookies.get('role');
    if (token && userRole) {
      setRole(userRole);
    }

    

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated, loading, notification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
