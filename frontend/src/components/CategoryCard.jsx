import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export function CategoryCard({ category }) {
  const navigate = useNavigate()

  return (
    <Card 
      className="cursor-pointer hover:bg-accent transition-colors"
      onClick={() => navigate(`/category/${category.toLowerCase()}`)}
    >
      <CardHeader>
        <CardTitle>{category}</CardTitle>
      </CardHeader>
    </Card>
  )
}
