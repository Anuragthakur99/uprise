import TryCatch from "../middlewares/TryCatch.js"
import { Quiz } from "../models/Quiz.js"
import { QuizAttempt } from "../models/QuizAttempt.js"
import { User } from "../models/User.js"
import { Courses } from "../models/Courses.js"

// Admin: Create a new quiz
export const createQuiz = TryCatch(async (req, res) => {
  const { title, description, courseId, questions, duration } = req.body

  // Validate course exists
  const course = await Courses.findById(courseId)
  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    })
  }

  // Create the quiz
  const quiz = await Quiz.create({
    title,
    description,
    course: courseId,
    questions,
    duration: duration || 30,
    createdBy: req.user._id,
  })

  res.status(201).json({
    message: "Quiz created successfully",
    quiz,
  })
})

// Admin: Get all quizzes
export const getAllQuizzes = TryCatch(async (req, res) => {
  const quizzes = await Quiz.find().populate("course", "title")

  res.json({
    quizzes,
  })
})

// Admin: Get a specific quiz with all details
export const getQuizDetails = TryCatch(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate("course", "title")

  if (!quiz) {
    return res.status(404).json({
      message: "Quiz not found",
    })
  }

  res.json({
    quiz,
  })
})

// Admin: Update a quiz
export const updateQuiz = TryCatch(async (req, res) => {
  const { title, description, questions, duration } = req.body

  const quiz = await Quiz.findById(req.params.id)

  if (!quiz) {
    return res.status(404).json({
      message: "Quiz not found",
    })
  }

  if (title) quiz.title = title
  if (description) quiz.description = description
  if (questions) quiz.questions = questions
  if (duration) quiz.duration = duration

  await quiz.save()

  res.json({
    message: "Quiz updated successfully",
    quiz,
  })
})

// Admin: Delete a quiz
export const deleteQuiz = TryCatch(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id)

  if (!quiz) {
    return res.status(404).json({
      message: "Quiz not found",
    })
  }

  // Delete all attempts for this quiz
  await QuizAttempt.deleteMany({ quiz: req.params.id })

  // Delete the quiz
  await quiz.deleteOne()

  res.json({
    message: "Quiz deleted successfully",
  })
})

// Student: Get available quizzes for a course
export const getCourseQuizzes = TryCatch(async (req, res) => {
  const { courseId } = req.params

  // Check if user has access to this course
  const user = await User.findById(req.user._id)

  if (user.role !== "admin" && !user.subscription.includes(courseId)) {
    return res.status(403).json({
      message: "You are not subscribed to this course",
    })
  }

  // Get quizzes for this course
  const quizzes = await Quiz.find({ course: courseId }).select("title description duration createdAt")

  // Get user's attempts for these quizzes
  const quizIds = quizzes.map((quiz) => quiz._id)
  const attempts = await QuizAttempt.find({
    user: req.user._id,
    quiz: { $in: quizIds },
    completed: true,
  }).select("quiz score totalPoints")

  // Map attempts to quizzes
  const quizzesWithAttempts = quizzes.map((quiz) => {
    const attempt = attempts.find((a) => a.quiz.toString() === quiz._id.toString())
    return {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      createdAt: quiz.createdAt,
      attempted: !!attempt,
      score: attempt ? attempt.score : null,
      totalPoints: attempt ? attempt.totalPoints : null,
    }
  })

  res.json({
    quizzes: quizzesWithAttempts,
  })
})

// Student: Start a quiz attempt
export const startQuiz = TryCatch(async (req, res) => {
  const { quizId } = req.params

  // Get the quiz
  const quiz = await Quiz.findById(quizId)

  if (!quiz) {
    return res.status(404).json({
      message: "Quiz not found",
    })
  }

  // Check if user has access to this course
  const user = await User.findById(req.user._id)

  if (user.role !== "admin" && !user.subscription.includes(quiz.course.toString())) {
    return res.status(403).json({
      message: "You are not subscribed to this course",
    })
  }

  // Check if user already has a completed attempt
  const existingCompletedAttempt = await QuizAttempt.findOne({
    user: req.user._id,
    quiz: quizId,
    completed: true,
  })

  if (existingCompletedAttempt) {
    return res.status(400).json({
      message: "You have already completed this quiz",
      attempt: existingCompletedAttempt,
    })
  }

  // Check if user has an ongoing attempt
  const existingAttempt = await QuizAttempt.findOne({
    user: req.user._id,
    quiz: quizId,
    completed: false,
  })

  if (existingAttempt) {
    // Return the existing attempt
    return res.json({
      message: "Continuing existing attempt",
      attempt: existingAttempt,
    })
  }

  // Calculate total points
  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)

  // Create a new attempt
  const attempt = await QuizAttempt.create({
    quiz: quizId,
    user: req.user._id,
    answers: [],
    totalPoints,
  })

  // Return quiz questions without correct answers
  const quizQuestions = quiz.questions.map((q) => ({
    _id: q._id,
    question: q.question,
    options: q.options,
    points: q.points || 1,
  }))

  res.status(201).json({
    message: "Quiz started",
    attempt: {
      _id: attempt._id,
      startedAt: attempt.startedAt,
    },
    quiz: {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      questions: quizQuestions,
    },
  })
})

// Student: Submit quiz answers
export const submitQuiz = TryCatch(async (req, res) => {
  const { attemptId } = req.params
  const { answers } = req.body

  // Find the attempt
  const attempt = await QuizAttempt.findById(attemptId)

  if (!attempt) {
    return res.status(404).json({
      message: "Attempt not found",
    })
  }

  // Verify this attempt belongs to the user
  if (attempt.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "This attempt does not belong to you",
    })
  }

  // Check if the attempt is already completed
  if (attempt.completed) {
    return res.status(400).json({
      message: "This attempt is already completed",
    })
  }

  // Get the quiz
  const quiz = await Quiz.findById(attempt.quiz)

  if (!quiz) {
    return res.status(404).json({
      message: "Quiz not found",
    })
  }

  // Process answers
  const processedAnswers = []
  let score = 0

  for (const answer of answers) {
    const question = quiz.questions.id(answer.questionId)

    if (!question) {
      continue // Skip if question not found
    }

    const isCorrect = answer.selectedOption === question.correctAnswer

    processedAnswers.push({
      questionId: answer.questionId,
      selectedOption: answer.selectedOption,
      isCorrect,
    })

    if (isCorrect) {
      score += question.points || 1
    }
  }

  // Update the attempt
  attempt.answers = processedAnswers
  attempt.score = score
  attempt.completed = true
  attempt.completedAt = new Date()

  await attempt.save()

  res.json({
    message: "Quiz submitted successfully",
    result: {
      score,
      totalPoints: attempt.totalPoints,
      percentage: Math.round((score / attempt.totalPoints) * 100),
      completedAt: attempt.completedAt,
    },
  })
})

// Student: Get quiz result
export const getQuizResult = TryCatch(async (req, res) => {
  const { attemptId } = req.params

  // Find the attempt with populated quiz
  const attempt = await QuizAttempt.findById(attemptId).populate({
    path: "quiz",
    select: "title questions",
  })

  if (!attempt) {
    return res.status(404).json({
      message: "Attempt not found",
    })
  }

  // Verify this attempt belongs to the user
  if (attempt.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "This attempt does not belong to you",
    })
  }

  // Check if the attempt is completed
  if (!attempt.completed) {
    return res.status(400).json({
      message: "This attempt is not completed yet",
    })
  }

  // Prepare detailed results
  const detailedResults = attempt.answers.map((answer) => {
    const question = attempt.quiz.questions.id(answer.questionId)
    return {
      question: question.question,
      options: question.options,
      selectedOption: answer.selectedOption,
      correctOption: question.correctAnswer,
      isCorrect: answer.isCorrect,
      points: question.points || 1,
    }
  })

  res.json({
    quizTitle: attempt.quiz.title,
    score: attempt.score,
    totalPoints: attempt.totalPoints,
    percentage: Math.round((attempt.score / attempt.totalPoints) * 100),
    completedAt: attempt.completedAt,
    detailedResults,
  })
})
