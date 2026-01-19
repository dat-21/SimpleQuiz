// GET /quizzes
// GET /quizzes/:quizId
// POST /quizzes
// PUT /quizzes/:quizId
// DELETE /quizzes/:quizId
const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quizController.controller");

/**
 * CRUD Quiz
 */
router.get("/getAllQuiz", quizController.getAllQuizzes);
router.post("/create", quizController.createQuiz);

// Advanced - Must be before /:quizId to avoid route conflicts
// Assignment Requirement #3: Filter questions by keyword "capital"
router.get("/:quizId/populate", quizController.getQuizWithCapitalQuestions);
router.post("/:quizId/question", quizController.addQuestionToQuiz);
router.post("/:quizId/questions", quizController.addManyQuestionsToQuiz);
router.delete(
  "/:quizId/question/:questionId",
  quizController.removeQuestionFromQuiz,
);

// Basic CRUD - Must be after specific routes
router.get("/:quizId", quizController.getQuizById);
router.put("/update/:quizId", quizController.updateQuiz);
router.delete("/delete/:quizId", quizController.deleteQuiz);

module.exports = router;
