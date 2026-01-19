// GET /question
// GET /question/:questionId
// POST /question
// PUT /question/:questionId
// DELETE /question/:questionId
const express = require("express");
const router = express.Router();

const questionController = require("../controllers/questionController.controller");

/**
 * CRUD Question
 */
router.get("/getAllQuestion", questionController.getAllQuestions);
router.post("/create", questionController.createQuestion);
router.put("/:questionId", questionController.updateQuestion);
router.delete("/:questionId", questionController.deleteQuestion);
router.get("/:questionId", questionController.getQuestionById);

module.exports = router;
