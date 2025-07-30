"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { QuizData } from "../../context/QuizContext"
import { CourseData } from "../../context/CourseContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { PlusCircle, Edit, Trash2, FileQuestion } from "lucide-react"
import Layout from "../Utils/Layout"

const AdminQuizzes = ({ user }) => {
  const navigate = useNavigate()
  const { quizzes, fetchAllQuizzes, deleteQuiz, loading } = QuizData()
  const { courses, fetchCourses } = CourseData()

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/")
    } else {
      fetchAllQuizzes()
      fetchCourses()
    }
  }, [user, navigate])

  const handleDeleteQuiz = async (quizId) => {
    const success = await deleteQuiz(quizId)
    if (success) {
      fetchAllQuizzes()
    }
  }

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Quiz Management</h1>
        </div>

        <Tabs defaultValue="quizzes" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="quizzes">All Quizzes</TabsTrigger>
            <TabsTrigger value="add">Create Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="quizzes">
            <Card>
              <CardHeader>
                <CardTitle>All Quizzes</CardTitle>
                <CardDescription>Manage your quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                {quizzes && quizzes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Questions</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quizzes.map((quiz) => (
                          <TableRow key={quiz._id}>
                            <TableCell className="font-medium">{quiz.title}</TableCell>
                            <TableCell>{quiz.course?.title || "Unknown Course"}</TableCell>
                            <TableCell>{quiz.questions?.length || 0} questions</TableCell>
                            <TableCell>{quiz.duration} minutes</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="outline" size="sm" onClick={() => navigate(`/admin/quiz/${quiz._id}`)}>
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the quiz and all associated attempts. This action
                                      cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteQuiz(quiz._id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No quizzes available yet</p>
                    <Button onClick={() => document.querySelector('[data-value="add"]').click()}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Quiz
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <QuizForm courses={courses} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

const QuizForm = ({ courses }) => {
  const navigate = useNavigate()
  const { createQuiz, loading } = QuizData()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [courseId, setCourseId] = useState("")
  const [duration, setDuration] = useState(30)
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    },
  ])

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
      courseId,
      duration: Number(duration),
      questions,
    }

    const quiz = await createQuiz(quizData)
    if (quiz) {
      navigate("/admin/quiz")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Quiz</CardTitle>
        <CardDescription>Add a new quiz for your course</CardDescription>
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
              <Select value={courseId} onValueChange={setCourseId} required>
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
            {loading ? "Creating Quiz..." : "Create Quiz"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AdminQuizzes
