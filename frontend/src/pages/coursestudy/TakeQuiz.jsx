"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { QuizData } from "../../context/QuizContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertCircle, Clock, ArrowLeft, ArrowRight } from "lucide-react"
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
import Loading from "../../components/loading/Loading"

const TakeQuiz = ({ user }) => {
  const navigate = useNavigate()
  const { courseId, quizId } = useParams()
  const { startQuiz, submitQuizAnswers, loading } = QuizData()

  const [quizData, setQuizData] = useState(null)
  const [attemptId, setAttemptId] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && user.role !== "admin" && !user.subscription.includes(courseId)) {
      navigate("/")
    } else {
      loadQuiz()
    }
  }, [quizId, user])

  useEffect(() => {
    let timer
    if (quizData && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && quizData) {
      handleSubmitQuiz()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, quizData])

  const loadQuiz = async () => {
    const result = await startQuiz(quizId)
    if (result) {
      setQuizData(result.quiz)
      setAttemptId(result.attemptId)
      setTimeLeft(result.quiz.duration * 60)

      // Initialize answers array
      const initialAnswers = result.quiz.questions.map((q) => ({
        questionId: q._id,
        selectedOption: null,
      }))
      setAnswers(initialAnswers)
    } else {
      navigate(`/course/${courseId}/quizzes`)
    }
  }

  const handleOptionSelect = (optionIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion].selectedOption = optionIndex
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true)

    // Filter out questions with no answers
    const answersToSubmit = answers.filter((a) => a.selectedOption !== null)

    const result = await submitQuizAnswers(attemptId, answersToSubmit)
    setIsSubmitting(false)

    if (result) {
      navigate(`/course/${courseId}/quiz/${quizId}/results?attemptId=${attemptId}`)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (loading || !quizData) {
    return <Loading />
  }

  const question = quizData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100
  const isAnswered = answers[currentQuestion]?.selectedOption !== null

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{quizData.title}</CardTitle>
            <div className="flex items-center bg-muted px-3 py-1 rounded-md">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <CardDescription>{quizData.description}</CardDescription>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Question {currentQuestion + 1} of {quizData.questions.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="text-xl font-medium">{question.question}</div>

            <RadioGroup
              value={answers[currentQuestion]?.selectedOption?.toString()}
              onValueChange={(value) => handleOptionSelect(Number.parseInt(value))}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {!isAnswered && (
              <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">Please select an answer before proceeding</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>

          <div>
            {currentQuestion === quizData.questions.length - 1 ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={!isAnswered || isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have answered {answers.filter((a) => a.selectedOption !== null).length} out of{" "}
                      {quizData.questions.length} questions. Are you sure you want to submit your quiz? You cannot
                      change your answers after submission.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmitQuiz}>Submit</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button onClick={handleNextQuestion} disabled={!isAnswered}>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default TakeQuiz
