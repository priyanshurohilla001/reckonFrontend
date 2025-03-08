import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import axios from 'axios';
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { useAuth } from '../contexts/AuthContext';

const categories = [
  "Food", "Entertainment", "Tuition", "Rent", "Shopping",
  "Travel", "Healthcare", "Utilities", "Miscellaneous", "Subscriptions"
];

// Configure axios
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          setUserData({
            name: user.name,
            money: user.money || 1000,
            profileImage: user.profileImage || ""
          });
        } else {
          setUserData({
            name: "Guest",
            money: 1000,
            profileImage: ""
          });
        }
      } catch (error) {
        console.error("Error setting user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header userData={userData} onLogout={() => {
        logout();
        navigate('/');
      }} />
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Analysis</h2>
          <p className="text-muted-foreground">Graphs coming soon...</p>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          {categories.map(category => (
            <CategoryCard key={category} category={category} />
          ))}
        </section>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}

export default Dashboard;
