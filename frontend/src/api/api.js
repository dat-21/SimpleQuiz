import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Quiz API
export const quizAPI = {
  // Get all quizzes
  getAllQuizzes: () => api.get("/quizzes/getAllQuiz"),

  // Get quiz by ID
  getQuizById: (quizId) => api.get(`/quizzes/${quizId}`),

  // Get quiz with populated questions (all questions)
  getQuizWithQuestions: (quizId) => api.get(`/quizzes/${quizId}`),

  // Get quiz with only "capital" keyword questions (Assignment requirement #3)
  getQuizWithCapitalQuestions: (quizId) =>
    api.get(`/quizzes/${quizId}/populate`),

  // Create new quiz
  createQuiz: (data) => api.post("/quizzes/create", data),

  // Update quiz
  updateQuiz: (quizId, data) => api.put(`/quizzes/update/${quizId}`, data),

  // Delete quiz
  deleteQuiz: (quizId) => api.delete(`/quizzes/delete/${quizId}`),

  // Add question to quiz
  addQuestionToQuiz: (quizId, questionId) =>
    api.post(`/quizzes/${quizId}/question`, { questionId }),

  // Add many questions to quiz
  addManyQuestionsToQuiz: (quizId, questionIds) =>
    api.post(`/quizzes/${quizId}/questions`, { questionIds }),

  // Remove question from quiz
  removeQuestionFromQuiz: (quizId, questionId) =>
    api.delete(`/quizzes/${quizId}/question/${questionId}`),
};

// Question API
export const questionAPI = {
  // Get all questions
  getAllQuestions: () => api.get("/question/getAllQuestion"),

  // Get question by ID
  getQuestionById: (questionId) => api.get(`/question/${questionId}`),

  // Create new question
  createQuestion: (data) => api.post("/question/create", data),

  // Update question
  updateQuestion: (questionId, data) =>
    api.put(`/question/${questionId}`, data),

  // Delete question
  deleteQuestion: (questionId) => api.delete(`/question/${questionId}`),
};

export default api;
