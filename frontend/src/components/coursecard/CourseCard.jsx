"use client"

import { server } from "../../main"
import { UserData } from "../../context/UserContext"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import axios from "axios"
import { CourseData } from "../../context/CourseContext"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight, Trash2, Clock, IndianRupee, User, LogIn } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const CourseCard = ({ course }) => {
  const navigate = useNavigate()
  const { user, isAuth } = UserData()
  const { fetchCourses } = CourseData()

  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/api/course/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      toast.success(data.message)
      fetchCourses()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
          />
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-md text-xs font-medium">
            {course.category}
          </div>
        </div>
        <CardContent className="p-5 flex-grow">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{course.title}</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>Instructor: {course.createdBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Duration: {course.duration} weeks</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span>Price: ₹{course.price}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0 flex flex-col gap-3 mt-auto">
          {isAuth ? (
            <>
              {user && user.role !== "admin" ? (
                <>
                  {user.subscription.includes(course._id) ? (
                    <Button className="w-full" onClick={() => navigate(`/course/study/${course._id}`)}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Study Now
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => navigate(`/course/${course._id}`)}>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Get Started
                    </Button>
                  )}
                </>
              ) : (
                <Button className="w-full" onClick={() => navigate(`/course/study/${course._id}`)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Study Now
                </Button>
              )}
            </>
          ) : (
            <Button className="w-full" onClick={() => navigate("/login")}>
              <LogIn className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          )}

          {user && user.role === "admin" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Course
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the course and remove it from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteHandler(course._id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default CourseCard
