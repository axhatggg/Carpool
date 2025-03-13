import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import DriverDashboard from './components/DriverDashboard';
import UserHomePage from './pages/UserHomePage';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/user/dashboard" element={<ProtectedRoute element={<UserDashboard />} allowedRoles={['user']} />} />
          <Route path="/user/home" element={<ProtectedRoute element={<UserHomePage />} allowedRoles={['user']} />} />
          <Route path="/driver/:driverId" element={<ProtectedRoute element={<DriverDashboard />} allowedRoles={['driver']} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
