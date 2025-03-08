import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import { Header } from "@/components/Header"
import { CategoryCard } from "@/components/CategoryCard"
import { SpendingAnalysis } from "@/components/SpendingAnalysis"
import { Toaster } from "sonner"
import axios from 'axios'

const categories = [
  "Food", "Entertainment", "Tuition", "Rent", "Shopping",
  "Travel", "Healthcare", "Utilities", "Miscellaneous", "Subscriptions"
]

// Configure axios
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default function App() {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const { data } = await api.get('/api/user')
          setUserData(data)
        } else {
          setUserData({
            name: "Priyanshu",
            money: 1000,
            profileImage: ""
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUserData({
          name: "Priyanshu",
          money: 1000,
          profileImage: ""
        })
      }
    }

    fetchUserData()
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header userData={userData} />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={
              <>
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Analysis</h2>
                  <SpendingAnalysis balance={userData?.money || 3244} />
                </section>
                <section className="space-y-4 mt-8">
                  {categories.map(category => (
                    <CategoryCard key={category} category={category} />
                  ))}
                </section>
              </>
            } />
            <Route path="/category/:category" element={
              <div className="text-center mt-8 text-xl">Category details coming soon...</div>
            } />
          </Routes>
        </main>
        <Toaster position="top-center" />
      </div>
    </Router>
  )
}
