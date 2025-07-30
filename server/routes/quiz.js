import express from "express"
import { isAdmin, isAuth } from "../middlewares/isAuth.js"
import {
  createQuiz,
  getAllQuizzes,
  getQuizDetails,
  updateQuiz,
  deleteQuiz,
  getCourseQuizzes,
  startQuiz,
  submitQuiz,
  getQuizResult,
} from "../controllers/quiz.js"

const router = express.Router()

// Admin routes
router.post("/quiz", isAuth, isAdmin, createQuiz)
router.get("/quizzes", isAuth, isAdmin, getAllQuizzes)
router.get("/quiz/:id", isAuth, isAdmin, getQuizDetails)
router.put("/quiz/:id", isAuth, isAdmin, updateQuiz)
router.delete("/quiz/:id", isAuth, isAdmin, deleteQuiz)

// Student routes
router.get("/course/:courseId/quizzes", isAuth, getCourseQuizzes)
router.post("/quiz/:quizId/start", isAuth, startQuiz)
router.post("/quiz/attempt/:attemptId/submit", isAuth, submitQuiz)
router.get("/quiz/attempt/:attemptId/result", isAuth, getQuizResult)

export default router
