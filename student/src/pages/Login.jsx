import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    // This is just a placeholder. In a real app, you'd validate credentials
    login();
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4">
      <h1 className="text-2xl font-bold">Login</h1>
      
      <div className="flex flex-col gap-4 w-80">
        {/* Login form would go here */}
        <Button onClick={handleLogin}>Log In</Button>
        <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    </div>
  );
}

export default Login;
