"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { QuizData } from "../../context/QuizContext"
import { CourseData } from "../../context/CourseContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, ArrowLeft } from "lucide-react"
import Layout from "../Utils/Layout"
import Loading from "../../components/loading/Loading"

const EditQuiz = ({ user }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { fetchQuizDetails, updateQuiz, loading } = QuizData()
  const { courses, fetchCourses } = CourseData()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [courseId, setCourseId] = useState("")
  const [duration, setDuration] = useState(30)
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/")
    } else {
      fetchCourses()
      loadQuiz()
    }
  }, [user, navigate, id])

  const loadQuiz = async () => {
    setIsLoading(true)
    const quiz = await fetchQuizDetails(id)
    if (quiz) {
      setTitle(quiz.title)
      setDescription(quiz.description)
      setCourseId(quiz.course._id || quiz.course)
      setDuration(quiz.duration)
      setQuestions(quiz.questions)
    } else {
      navigate("/admin/quiz")
    }
    setIsLoading(false)
  }

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
      },
    ])
  }

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions)
  }

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!title || !description || !courseId || questions.length === 0) {
      return alert("Please fill all required fields")
    }

    // Validate questions
    for (const q of questions) {
      if (!q.question || q.options.some((opt) => !opt)) {
        return alert("Please fill all question fields and options")
      }
    }

    const quizData = {
      title,
      description,
      duration: Number(duration),
      questions,
    }

    const quiz = await updateQuiz(id, quizData)
    if (quiz) {
      navigate("/admin/quiz")
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/admin/quiz")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Quiz</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Quiz</CardTitle>
            <CardDescription>Update quiz details and questions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter quiz title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select value={courseId} onValueChange={setCourseId} required disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Course cannot be changed after creation</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter quiz description"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min={1}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Questions</h3>
                  <Button type="button" variant="outline" onClick={handleAddQuestion}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Question
                  </Button>
                </div>

                {questions.map((question, qIndex) => (
                  <Card key={qIndex} className="p-4 relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      disabled={questions.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor={`question-${qIndex}`}>Question {qIndex + 1}</Label>
                        <Input
                          id={`question-${qIndex}`}
                          value={question.question}
                          onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                          placeholder="Enter question"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Options</Label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2">
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                            <Button
                              type="button"
                              variant={question.correctAnswer === oIndex ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleQuestionChange(qIndex, "correctAnswer", oIndex)}
                            >
                              {question.correctAnswer === oIndex ? "Correct" : "Mark Correct"}
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`points-${qIndex}`}>Points</Label>
                        <Input
                          id={`points-${qIndex}`}
                          type="number"
                          value={question.points}
                          onChange={(e) => handleQuestionChange(qIndex, "points", Number(e.target.value))}
                          min={1}
                          required
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating Quiz..." : "Update Quiz"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default EditQuiz
