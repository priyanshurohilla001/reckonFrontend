import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4">
      <h1 className="text-3xl font-bold">Welcome to Our App</h1>
      
      <div className="flex gap-2">
        <Button onClick={() => navigate('/login')}>Login</Button>
        <Button onClick={() => navigate('/register')}>Register</Button>
      </div>
      
      {isAuthenticated && (
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      )}
    </div>
  );
}

export default Home;
