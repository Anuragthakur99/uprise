"use client"

import { useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { QuizData } from "../../context/QuizContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, ArrowLeft, Award, Clock } from "lucide-react"
import Loading from "../../components/loading/Loading"

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const QuizResults = ({ user }) => {
  const navigate = useNavigate()
  const { courseId, quizId } = useParams()
  const query = useQuery()
  const attemptId = query.get("attemptId")

  const { fetchQuizResult, quizResult, loading } = QuizData()

  useEffect(() => {
    if (user && user.role !== "admin" && !user.subscription.includes(courseId)) {
      navigate("/")
    } else if (attemptId) {
      fetchQuizResult(attemptId)
    } else {
      navigate(`/course/${courseId}/quizzes`)
    }
  }, [attemptId, user])

  if (loading || !quizResult) {
    return <Loading />
  }

  const { quizTitle, score, totalPoints, percentage, completedAt, detailedResults } = quizResult

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(`/course/${courseId}/quizzes`)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Quizzes
        </Button>
        <h1 className="text-3xl font-bold">Quiz Results</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{quizTitle}</CardTitle>
          <CardDescription>Completed on {new Date(completedAt).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <ScoreCard
              icon={<Award className="h-6 w-6 text-primary" />}
              title="Your Score"
              value={`${score}/${totalPoints}`}
            />
            <ScoreCard
              icon={<CheckCircle className="h-6 w-6 text-green-500" />}
              title="Percentage"
              value={`${percentage}%`}
            />
            <ScoreCard
              icon={<Clock className="h-6 w-6 text-primary" />}
              title="Status"
              value={percentage >= 70 ? "Passed" : "Failed"}
              valueClassName={percentage >= 70 ? "text-green-500" : "text-red-500"}
            />
          </div>

          <Separator className="my-6" />

          <h3 className="text-lg font-semibold mb-4">Detailed Results</h3>

          <div className="space-y-6">
            {detailedResults.map((result, index) => (
              <Card key={index} className={result.isCorrect ? "border-green-200" : "border-red-200"}>
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {result.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium mb-2">
                        {index + 1}. {result.question}
                      </p>
                      <div className="space-y-1 ml-2">
                        {result.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded ${
                              optIndex === result.selectedOption && optIndex === result.correctOption
                                ? "bg-green-100 dark:bg-green-900/20"
                                : optIndex === result.selectedOption
                                  ? "bg-red-100 dark:bg-red-900/20"
                                  : optIndex === result.correctOption
                                    ? "bg-green-50 dark:bg-green-900/10"
                                    : ""
                            }`}
                          >
                            {option}
                            {optIndex === result.selectedOption && " (Your answer)"}
                            {optIndex === result.correctOption && " (Correct answer)"}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Points: {result.isCorrect ? result.points : 0}/{result.points}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate(`/course/${courseId}/quizzes`)} className="w-full">
            Back to Quizzes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

const ScoreCard = ({ icon, title, value, valueClassName = "" }) => (
  <div className="bg-muted/50 rounded-lg p-4 text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
  </div>
)

export default QuizResults
