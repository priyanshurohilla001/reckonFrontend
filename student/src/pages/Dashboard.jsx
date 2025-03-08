import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>This is a protected route, only accessible when logged in.</p>
      
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default Dashboard;
