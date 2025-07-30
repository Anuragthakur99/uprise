import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { UserContextProvider } from "./context/UserContext.jsx"
import { CourseContextProvider } from "./context/CourseContext.jsx"
import { QuizContextProvider } from "./context/QuizContext.jsx"
import { ThemeProvider } from "./providers/theme-provider.jsx"

export const server = "http://localhost:5000"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light">
      <UserContextProvider>
        <CourseContextProvider>
          <QuizContextProvider>
            <App />
          </QuizContextProvider>
        </CourseContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
