import React, { useState, useEffect } from "react";
import { quizAPI, questionAPI } from "../api/api";

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizDetails, setQuizDetails] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    fetchQuizzes();
    fetchQuestions();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizAPI.getAllQuizzes();
      setQuizzes(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch quizzes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await questionAPI.getAllQuestions();
      setQuestions(response.data);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    }
  };

  const fetchQuizDetails = async (quizId) => {
    setLoading(true);
    try {
      const response = await quizAPI.getQuizWithQuestions(quizId);
      setQuizDetails(response.data);
      setSelectedQuiz(quizId);
      setError(null);
    } catch (err) {
      setError("Failed to fetch quiz details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingQuiz) {
        await quizAPI.updateQuiz(editingQuiz._id, formData);
        setSuccess("Quiz updated successfully!");
      } else {
        const response = await quizAPI.createQuiz(formData);
        setSuccess("Quiz created successfully!");

        // If questions are selected, add them to the quiz
        if (selectedQuestions.length > 0) {
          await quizAPI.addManyQuestionsToQuiz(
            response.data._id,
            selectedQuestions,
          );
        }
      }

      resetForm();
      fetchQuizzes();
    } catch (err) {
      setError(
        "Failed to save quiz: " + (err.response?.data?.message || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    setLoading(true);
    try {
      await quizAPI.deleteQuiz(quizId);
      setSuccess("Quiz deleted successfully!");
      fetchQuizzes();
      if (selectedQuiz === quizId) {
        setSelectedQuiz(null);
        setQuizDetails(null);
      }
    } catch (err) {
      setError("Failed to delete quiz: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveQuestionFromQuiz = async (quizId, questionId) => {
    if (!window.confirm("Remove this question from quiz?")) {
      return;
    }

    setLoading(true);
    try {
      await quizAPI.removeQuestionFromQuiz(quizId, questionId);

      setSuccess("Question removed from quiz!");
      fetchQuizzes();
      if (quizDetails && quizDetails._id === quizId) {
        fetchQuizDetails(quizId);
      }
    } catch (err) {
      setError("Failed to remove question: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestionToQuiz = async (quizId, questionId) => {
    setLoading(true);
    try {
      await quizAPI.addQuestionToQuiz(quizId, questionId);
      setSuccess("Question added to quiz!");
      fetchQuizDetails(quizId);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError("Failed to add question: " + errorMsg);

      // Nếu câu hỏi đã tồn tại, tự động refresh để cập nhật UI
      if (errorMsg.includes("already in quiz")) {
        fetchQuizDetails(quizId);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
    });
    setEditingQuiz(null);
    setShowForm(false);
    setSelectedQuestions([]);
  };

  return (
    <div className="container">
      <h1>Quiz Management</h1>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Quiz"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <div className="form-group">
              <label>Quiz Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter quiz title"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter quiz description (optional)"
              />
            </div>

            {!editingQuiz && questions.length > 0 && (
              <div className="form-group">
                <label>Select Questions (optional)</label>
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    padding: "0.5rem",
                    borderRadius: "4px",
                  }}
                >
                  {questions.map((question) => (
                    <div key={question._id} style={{ marginBottom: "0.5rem" }}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedQuestions.includes(question._id)}
                          onChange={() => toggleQuestionSelection(question._id)}
                          style={{ marginRight: "0.5rem" }}
                        />
                        <span>{question.text}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingQuiz
                  ? "Update Quiz"
                  : "Create Quiz"}
            </button>

            {editingQuiz && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
                style={{ marginLeft: "0.5rem" }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        )}
      </div>

      <div className="card">
        <h2>Quizzes List</h2>
        {loading && <div className="loading">Loading...</div>}

        {!loading && quizzes.length === 0 && (
          <p>No quizzes found. Create your first quiz!</p>
        )}

        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="list-item"
            style={{ flexDirection: "column", alignItems: "stretch" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3>{quiz.title}</h3>
                <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                  {quiz.description}
                </p>
                <div
                  style={{
                    background: "#e3f2fd",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    display: "inline-block",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  📝 {quiz.questions?.length || 0} questions
                </div>
              </div>
              <div className="list-item-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => fetchQuizDetails(quiz._id)}
                >
                  {selectedQuiz === quiz._id
                    ? "Hide Details"
                    : "Manage Questions"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(quiz)}
                >
                  Edit Info
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(quiz._id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {quiz.questions && quiz.questions.length > 0 && (
              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e0e0e0",
                }}
              >
                <small style={{ color: "#666", fontWeight: "bold" }}>
                  Questions in this quiz:
                </small>
                <div style={{ marginTop: "0.5rem" }}>
                  {quiz.questions.slice(0, 3).map((qId, index) => {
                    const question = questions.find((q) => q._id === qId);
                    return question ? (
                      <div
                        key={qId}
                        style={{
                          fontSize: "14px",
                          padding: "0.25rem 0",
                          color: "#555",
                        }}
                      >
                        {index + 1}. {question.text}
                      </div>
                    ) : null;
                  })}
                  {quiz.questions.length > 3 && (
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#888",
                        fontStyle: "italic",
                      }}
                    >
                      ... and {quiz.questions.length - 3} more questions
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {quizDetails && (
        <div className="card quiz-details">
          <h2>Quiz Details: {quizDetails.title}</h2>
          <p>
            <strong>Description:</strong> {quizDetails.description || "N/A"}
          </p>

          <div style={{ marginTop: "1rem" }}>
            <h3>
              Questions in this Quiz ({quizDetails.questions?.length || 0}):
            </h3>

            {quizDetails.questions?.length === 0 ? (
              <p
                style={{
                  padding: "1rem",
                  background: "#fff3cd",
                  borderRadius: "4px",
                  color: "#856404",
                }}
              >
                ⚠️ No questions added yet. Add questions below to make this quiz
                functional.
              </p>
            ) : (
              <div className="question-list">
                {quizDetails.questions?.map((question, index) => (
                  <div
                    key={question._id}
                    className="question-item"
                    style={{ position: "relative" }}
                  >
                    <button
                      onClick={() =>
                        handleRemoveQuestionFromQuiz(
                          quizDetails._id,
                          question._id,
                        )
                      }
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        background: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.25rem 0.5rem",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                      title="Remove from quiz"
                    >
                      ✕ Remove
                    </button>
                    <h4>
                      Question {index + 1}: {question.text}
                    </h4>
                    <ul>
                      {question.options?.map((option, optIndex) => (
                        <li
                          key={optIndex}
                          className={
                            optIndex === question.correctAnswerIndex
                              ? "correct"
                              : ""
                          }
                        >
                          {option}{" "}
                          {optIndex === question.correctAnswerIndex &&
                            "✓ (Correct)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1rem",
              borderTop: "2px solid #e0e0e0",
            }}
          >
            <h3>➕ Add More Questions to Quiz:</h3>
            {questions.filter(
              (q) => !quizDetails.questions?.find((qq) => qq._id === q._id),
            ).length === 0 ? (
              <p
                style={{
                  padding: "1rem",
                  background: "#d4edda",
                  borderRadius: "4px",
                  color: "#155724",
                }}
              >
                ✅ All available questions are already in this quiz!
              </p>
            ) : (
              <div>
                <p style={{ color: "#666", marginBottom: "1rem" }}>
                  Select questions below to add them to "{quizDetails.title}"
                </p>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {questions
                    .filter(
                      (q) =>
                        !quizDetails.questions?.find((qq) => qq._id === q._id),
                    )
                    .map((question) => (
                      <div
                        key={question._id}
                        style={{
                          padding: "1rem",
                          marginBottom: "0.5rem",
                          background: "#f9f9f9",
                          borderRadius: "4px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: "bold",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {question.text}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {question.options?.length || 0} options
                          </div>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            handleAddQuestionToQuiz(
                              quizDetails._id,
                              question._id,
                            )
                          }
                          style={{ marginLeft: "1rem" }}
                        >
                          ➕ Add
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => {
              setSelectedQuiz(null);
              setQuizDetails(null);
            }}
            style={{ marginTop: "1rem" }}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
