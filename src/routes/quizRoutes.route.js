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
router.get("/:quizId", quizController.getQuizById);
router.put("/update/:quizId", quizController.updateQuiz);
router.delete("/delete/:quizId", quizController.deleteQuiz);

// Advanced
router.get("/:quizId/populate", quizController.getQuizWithCapitalQuestions);
router.post("/:quizId/question", quizController.addQuestionToQuiz);
router.post("/:quizId/questions", quizController.addManyQuestionsToQuiz);

module.exports = router;
