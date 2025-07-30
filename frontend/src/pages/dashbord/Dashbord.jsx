"use client"
import { useEffect } from "react"
import { CourseData } from "../../context/CourseContext"
import CourseCard from "../../components/coursecard/CourseCard"
import { motion } from "framer-motion"
import { BookOpen, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const Dashbord = ({ user }) => {
  const { mycourse, fetchMyCourse } = CourseData()
  const navigate = useNavigate()

  useEffect(() => {
    fetchMyCourse()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Learning Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your progress and continue learning</p>
          </div>
          <Button onClick={() => navigate("/courses")} className="mt-4 md:mt-0">
            <BookOpen className="mr-2 h-4 w-4" />
            Browse More Courses
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Enrolled Courses</CardTitle>
              <CardDescription>Total courses you're taking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mycourse?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">In Progress</CardTitle>
              <CardDescription>Courses you're currently studying</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mycourse?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed</CardTitle>
              <CardDescription>Courses you've finished</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Your overall course completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">10%</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <GraduationCap className="mr-2 h-5 w-5" />
          My Enrolled Courses
        </h2>

        {mycourse && mycourse.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mycourse.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CardContent className="pt-6">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Courses Enrolled Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your learning journey by enrolling in your first course.
              </p>
              <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

export default Dashbord
