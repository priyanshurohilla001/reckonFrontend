import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import { Header } from "@/components/Header"
import { CategoryCard } from "@/components/CategoryCard"

const categories = [
  "Food", "Entertainment", "Tuition", "Rent", "Shopping",
  "Travel", "Healthcare", "Utilities", "Miscellaneous", "Subscriptions"
]

export default function App() {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const data = {
      name: "Priyanshu",
      age: 25,
      gender: "Male",
      course: "Computer Science",
      email: "2023kucp1065@iiitkota.ac.in",
      PhoneNum: "7015170512",
      Password: "password123",
      college: {
      name: "IIIT KOTA",
      id: "12345"
      },
      Tags: ["student", "developer"],
      money: 1000
    }
    setUserData(data);
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header userData={userData} />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Analysis</h2>
                  <p className="text-muted-foreground">Graphs coming soon...</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {categories.map(category => (
                    <CategoryCard key={category} category={category} />
                  ))}
                </div>
              </>
            } />
            <Route path="/category/:category" element={
              <div>Category details coming soon...</div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}


