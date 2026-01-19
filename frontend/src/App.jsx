import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import QuizManagement from "./components/QuizManagement";
import QuestionManagement from "./components/QuestionManagement";
import "./index.css";

function Home() {
  return (
    <div className="container">
      <h1>Quiz Management System</h1>
      <div className="card">
        <h2>Welcome!</h2>
        <p>This is a frontend application to test your Quiz Backend API.</p>

        <h3>Features:</h3>
        <ul style={{ marginLeft: "2rem", marginTop: "1rem" }}>
          <li>Create, Read, Update, Delete Quizzes</li>
          <li>Create, Read, Update, Delete Questions</li>
          <li>Add questions to quizzes</li>
          <li>View quiz details with populated questions</li>
        </ul>

        <h3 style={{ marginTop: "2rem" }}>API Endpoints Being Tested:</h3>
        <div
          style={{
            background: "#f9f9f9",
            padding: "1rem",
            borderRadius: "4px",
            marginTop: "1rem",
          }}
        >
          <h4>Quiz Endpoints:</h4>
          <ul
            style={{
              marginLeft: "2rem",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            <li>GET /quizzes/getAllQuiz</li>
            <li>POST /quizzes/create</li>
            <li>GET /quizzes/:quizId</li>
            <li>GET /quizzes/:quizId/populate</li>
            <li>PUT /quizzes/update/:quizId</li>
            <li>DELETE /quizzes/delete/:quizId</li>
            <li>POST /quizzes/:quizId/question</li>
            <li>POST /quizzes/:quizId/questions</li>
          </ul>

          <h4 style={{ marginTop: "1rem" }}>Question Endpoints:</h4>
          <ul
            style={{
              marginLeft: "2rem",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            <li>GET /question/getAllQuestion</li>
            <li>POST /question/create</li>
            <li>GET /question/:questionId</li>
            <li>PUT /question/:questionId</li>
            <li>DELETE /question/:questionId</li>
          </ul>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "#e3f2fd",
            borderRadius: "4px",
          }}
        >
          <h3>Getting Started:</h3>
          <ol style={{ marginLeft: "2rem" }}>
            <li>
              Make sure your backend server is running on{" "}
              <code>http://localhost:4000</code>
            </li>
            <li>
              Navigate to <strong>Questions</strong> to create some questions
              first
            </li>
            <li>
              Then go to <strong>Quizzes</strong> to create quizzes and add
              questions to them
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="nav">
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/quizzes"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Quizzes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/questions"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Questions
            </NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quizzes" element={<QuizManagement />} />
        <Route path="/questions" element={<QuestionManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
