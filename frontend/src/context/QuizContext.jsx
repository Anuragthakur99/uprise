"use client"

import axios from "axios"
import { createContext, useContext, useState } from "react"
import { server } from "../main"
import toast from "react-hot-toast"

const QuizContext = createContext()

export const QuizContextProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([])
  const [quiz, setQuiz] = useState(null)
  const [courseQuizzes, setCourseQuizzes] = useState([])
  const [quizAttempt, setQuizAttempt] = useState(null)
  const [quizResult, setQuizResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // Admin: Create a new quiz
  async function createQuiz(quizData) {
    setLoading(true)
    try {
      const { data } = await axios.post(`${server}/api/quiz`, quizData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      toast.success(data.message)
      setLoading(false)
      return data.quiz
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to create quiz")
      return null
    }
  }

  // Admin: Get all quizzes
  async function fetchAllQuizzes() {
    setLoading(true)
    try {
      const { data } = await axios.get(`${server}/api/quizzes`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      setQuizzes(data.quizzes)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to fetch quizzes")
    }
  }

  // Admin: Get quiz details
  async function fetchQuizDetails(quizId) {
    setLoading(true)
    try {
      const { data } = await axios.get(`${server}/api/quiz/${quizId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      setQuiz(data.quiz)
      setLoading(false)
      return data.quiz
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to fetch quiz details")
      return null
    }
  }

  // Admin: Update a quiz
  async function updateQuiz(quizId, quizData) {
    setLoading(true)
    try {
      const { data } = await axios.put(`${server}/api/quiz/${quizId}`, quizData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      toast.success(data.message)
      setLoading(false)
      return data.quiz
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to update quiz")
      return null
    }
  }

  // Admin: Delete a quiz
  async function deleteQuiz(quizId) {
    setLoading(true)
    try {
      const { data } = await axios.delete(`${server}/api/quiz/${quizId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      toast.success(data.message)
      setLoading(false)
      return true
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to delete quiz")
      return false
    }
  }

  // Student: Get quizzes for a course
  async function fetchCourseQuizzes(courseId) {
    setLoading(true)
    try {
      const { data } = await axios.get(`${server}/api/course/${courseId}/quizzes`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      setCourseQuizzes(data.quizzes)
      setLoading(false)
      return data.quizzes
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to fetch course quizzes")
      return []
    }
  }

  // Student: Start a quiz
  async function startQuiz(quizId) {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${server}/api/quiz/${quizId}/start`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      )
      setQuizAttempt({
        attemptId: data.attempt._id,
        quiz: data.quiz,
      })
      setLoading(false)
      return {
        attemptId: data.attempt._id,
        quiz: data.quiz,
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to start quiz")
      return null
    }
  }

  // Student: Submit quiz answers
  async function submitQuizAnswers(attemptId, answers) {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${server}/api/quiz/attempt/${attemptId}/submit`,
        { answers },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      )
      setQuizResult(data.result)
      setLoading(false)
      return data.result
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to submit quiz")
      return null
    }
  }

  // Student: Get quiz result
  async function fetchQuizResult(attemptId) {
    setLoading(true)
    try {
      const { data } = await axios.get(`${server}/api/quiz/attempt/${attemptId}/result`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      setQuizResult(data)
      setLoading(false)
      return data
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to fetch quiz result")
      return null
    }
  }

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        quiz,
        courseQuizzes,
        quizAttempt,
        quizResult,
        loading,
        createQuiz,
        fetchAllQuizzes,
        fetchQuizDetails,
        updateQuiz,
        deleteQuiz,
        fetchCourseQuizzes,
        startQuiz,
        submitQuizAnswers,
        fetchQuizResult,
        setQuizAttempt,
        setQuizResult,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export const QuizData = () => useContext(QuizContext)
