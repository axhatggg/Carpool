import { useAuth } from '../context/AuthContext';

const Notification = () => {
  const { notification } = useAuth();

  return (
    notification && (
      <div style={{ background: 'green', color: 'white', padding: '10px' }}>
        {notification}
      </div>
    )
  );
};

export default Notification;
