import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, fetchUserProfile, profileLoading } = useAuth();

  useEffect(() => {
    // Refresh user profile when dashboard loads
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-6 p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {profileLoading ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </CardContent>
        </Card>
      ) : user ? (
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Hello, {user.name}! 👋</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div>
                <span className="font-semibold">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-semibold">Phone:</span> {user.phoneNumber}
              </div>
              {user.college && (
                <div>
                  <span className="font-semibold">College:</span> {user.college}
                </div>
              )}
              {user.course && (
                <div>
                  <span className="font-semibold">Course:</span> {user.course}
                </div>
              )}
              {user.age && (
                <div>
                  <span className="font-semibold">Age:</span> {user.age}
                </div>
              )}
              {user.gender && (
                <div>
                  <span className="font-semibold">Gender:</span> {user.gender}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-red-500">Failed to load user profile</p>
      )}
      
      <Button onClick={handleLogout} variant="destructive">Logout</Button>
    </div>
  );
}

export default Dashboard;
