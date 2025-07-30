"use client"

import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { QuizData } from "../../context/QuizContext"
import { CourseData } from "../../context/CourseContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileQuestion, Clock, Award, ArrowLeft, CheckCircle } from "lucide-react"
import Loading from "../../components/loading/Loading"

const CourseQuizzes = ({ user }) => {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { fetchCourseQuizzes, courseQuizzes, loading } = QuizData()
  const { fetchCourse, course } = CourseData()

  useEffect(() => {
    if (user && user.role !== "admin" && !user.subscription.includes(courseId)) {
      navigate("/")
    } else {
      fetchCourse(courseId)
      fetchCourseQuizzes(courseId)
    }
  }, [courseId, user])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(`/course/study/${courseId}`)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Course
        </Button>
        <h1 className="text-3xl font-bold">Quizzes for {course?.title || "Course"}</h1>
      </div>

      {courseQuizzes && courseQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseQuizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} courseId={courseId} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <CardContent className="pt-6">
            <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Quizzes Available</h3>
            <p className="text-muted-foreground mb-6">There are no quizzes available for this course yet.</p>
            <Button onClick={() => navigate(`/course/study/${courseId}`)}>Back to Course</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const QuizCard = ({ quiz, courseId }) => {
  const navigate = useNavigate()

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{quiz.title}</CardTitle>
          {quiz.attempted && (
            <Badge variant="secondary" className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> Completed
            </Badge>
          )}
        </div>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{quiz.duration} minutes</span>
          </div>
          {quiz.attempted && (
            <div className="flex items-center text-sm">
              <Award className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                Score: {quiz.score}/{quiz.totalPoints} ({Math.round((quiz.score / quiz.totalPoints) * 100)}%)
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {quiz.attempted ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/course/${courseId}/quiz/${quiz._id}/results`)}
          >
            View Results
          </Button>
        ) : (
          <Button className="w-full" onClick={() => navigate(`/course/${courseId}/quiz/${quiz._id}`)}>
            Start Quiz
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default CourseQuizzes
