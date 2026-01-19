import React, { useState, useEffect } from "react";
import { questionAPI, quizAPI } from "../api/api";

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [formData, setFormData] = useState({
    text: "",
    options: ["", ""],
    correctAnswerIndex: 0,
    keywords: [],
  });

  useEffect(() => {
    fetchQuestions();
    fetchQuizzes();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionAPI.getAllQuestions();
      setQuestions(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch questions: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getAllQuizzes();
      setQuizzes(response.data);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  };

  const getQuizzesContainingQuestion = (questionId) => {
    return quizzes.filter(
      (quiz) => quiz.questions && quiz.questions.includes(questionId),
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const handleKeywordsChange = (e) => {
    const value = e.target.value;
    // Split by comma and trim whitespace
    const keywordsArray = value
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);
    setFormData((prev) => ({
      ...prev,
      keywords: keywordsArray,
    }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        options: newOptions,
        correctAnswerIndex:
          prev.correctAnswerIndex >= index && prev.correctAnswerIndex > 0
            ? prev.correctAnswerIndex - 1
            : prev.correctAnswerIndex,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingQuestion) {
        await questionAPI.updateQuestion(editingQuestion._id, formData);
        setSuccess("Question updated successfully!");
      } else {
        await questionAPI.createQuestion(formData);
        setSuccess("Question created successfully!");
      }

      resetForm();
      fetchQuestions();
      fetchQuizzes();
    } catch (err) {
      setError(
        "Failed to save question: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      options: question.options,
      correctAnswerIndex: question.correctAnswerIndex || 0,
      keywords: question.keywords || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (questionId) => {
    const quizzesWithQuestion = getQuizzesContainingQuestion(questionId);

    let confirmMessage = "Are you sure you want to delete this question?";
    if (quizzesWithQuestion.length > 0) {
      confirmMessage = `⚠️ This question is used in ${quizzesWithQuestion.length} quiz(es): ${quizzesWithQuestion.map((q) => q.title).join(", ")}.\n\nDeleting it will remove it from these quizzes. Continue?`;
    }

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setLoading(true);
    try {
      await questionAPI.deleteQuestion(questionId);
      setSuccess("Question deleted successfully!");
      fetchQuestions();
      fetchQuizzes();
    } catch (err) {
      setError("Failed to delete question: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      text: "",
      options: ["", ""],
      correctAnswerIndex: 0,
      keywords: [],
    });
    setEditingQuestion(null);
    setShowForm(false);
  };

  return (
    <div className="container">
      <h1>Question Management</h1>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Question"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <div className="form-group">
              <label>Question Text *</label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                required
                placeholder="Enter question text"
              />
            </div>

            <div className="form-group">
              <label>Options (minimum 2) *</label>
              {formData.options.map((option, index) => (
                <div key={index} className="option-item">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addOption}
                style={{ marginTop: "0.5rem" }}
              >
                Add Option
              </button>
            </div>

            <div className="form-group">
              <label>Correct Answer Index *</label>
              <select
                name="correctAnswerIndex"
                value={formData.correctAnswerIndex}
                onChange={handleInputChange}
                required
              >
                {formData.options.map((_, index) => (
                  <option key={index} value={index}>
                    Option {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Keywords (optional - separate with commas)</label>
              <input
                type="text"
                value={formData.keywords.join(", ")}
                onChange={handleKeywordsChange}
                placeholder="e.g. capital, geography, history"
              />
              <small
                style={{
                  color: "#666",
                  fontSize: "12px",
                  display: "block",
                  marginTop: "0.25rem",
                }}
              >
                💡 Add "capital" keyword to make this question appear in
                filtered view
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingQuestion
                  ? "Update Question"
                  : "Create Question"}
            </button>

            {editingQuestion && (
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
        <h2>Questions List</h2>
        {loading && <div className="loading">Loading...</div>}

        {!loading && questions.length === 0 && (
          <p>No questions found. Create your first question!</p>
        )}

        {questions.map((question) => (
          <div
            key={question._id}
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
                <h3>{question.text}</h3>
                <ul style={{ marginTop: "0.5rem" }}>
                  {question.options?.map((option, index) => (
                    <li
                      key={index}
                      className={
                        index === question.correctAnswerIndex ? "correct" : ""
                      }
                      style={{ marginBottom: "0.25rem" }}
                    >
                      {option} {index === question.correctAnswerIndex && "✓"}
                    </li>
                  ))}
                </ul>

                {/* Show keywords */}
                {question.keywords && question.keywords.length > 0 && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    <strong>🏷️ Keywords:</strong>{" "}
                    {question.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        style={{
                          background:
                            keyword === "capital" ? "#4caf50" : "#e0e0e0",
                          color: keyword === "capital" ? "white" : "#333",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          marginRight: "4px",
                          display: "inline-block",
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}

                {/* Show which quizzes contain this question */}
                {(() => {
                  const containingQuizzes = getQuizzesContainingQuestion(
                    question._id,
                  );
                  return containingQuizzes.length > 0 ? (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.5rem",
                        background: "#e8f5e9",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                    >
                      <strong>📋 Used in quizzes:</strong>{" "}
                      {containingQuizzes.map((quiz) => quiz.title).join(", ")}
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.5rem",
                        background: "#fff3cd",
                        borderRadius: "4px",
                        fontSize: "13px",
                        color: "#856404",
                      }}
                    >
                      ⚠️ Not used in any quiz yet
                    </div>
                  );
                })()}
              </div>
              <div className="list-item-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(question)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(question._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionManagement;
