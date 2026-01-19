const { Quiz, Question } = require("../models");

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("questions");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("questions");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.quizId);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizWithCapitalQuestions = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate({
      path: "questions",
      match: { keywords: "capital" },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addQuestionToQuiz = async (req, res) => {
  try {
    console.log("📝 addQuestionToQuiz called");
    console.log("Quiz ID:", req.params.quizId);
    console.log("Request Body:", req.body);

    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      console.log("❌ Quiz not found");
      return res.status(404).json({ message: "Quiz not found" });
    }

    console.log("✅ Quiz found:", quiz.title);

    // Check if questionId is provided (adding existing question)
    if (req.body.questionId) {
      console.log("🔍 Looking for question:", req.body.questionId);
      const questionExists = await Question.findById(req.body.questionId);

      if (!questionExists) {
        console.log("❌ Question not found");
        return res.status(404).json({ message: "Question not found" });
      }

      console.log("✅ Question found:", questionExists.text);

      // Check if question is already in quiz
      if (quiz.questions.includes(req.body.questionId)) {
        console.log("⚠️ Question already in quiz");
        return res.status(400).json({ message: "Question already in quiz" });
      }

      quiz.questions.push(req.body.questionId);
      await quiz.save();

      console.log("✅ Question added successfully");
      return res.status(200).json({ message: "Question added to quiz", quiz });
    }

    // If no questionId, create a new question
    console.log("📝 Creating new question from body");
    const question = new Question(req.body);
    const savedQuestion = await question.save();

    quiz.questions.push(savedQuestion._id);
    await quiz.save();

    console.log("✅ New question created and added");
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error("❌ Error in addQuestionToQuiz:", error.message);
    console.error("Error stack:", error.stack);
    res.status(400).json({ message: error.message });
  }
};

exports.addManyQuestionsToQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check if questionIds array is provided (adding existing questions)
    if (req.body.questionIds && Array.isArray(req.body.questionIds)) {
      // Verify all questions exist
      const questions = await Question.find({
        _id: { $in: req.body.questionIds },
      });

      if (questions.length !== req.body.questionIds.length) {
        return res
          .status(404)
          .json({ message: "One or more questions not found" });
      }

      // Filter out questions already in quiz
      const newQuestionIds = req.body.questionIds.filter(
        (qId) => !quiz.questions.includes(qId),
      );

      quiz.questions.push(...newQuestionIds);
      await quiz.save();

      return res.status(200).json({
        message: "Questions added to quiz",
        addedCount: newQuestionIds.length,
        quiz,
      });
    }

    // If no questionIds, create new questions
    const questions = await Question.insertMany(req.body);

    const questionIds = questions.map((q) => q._id);
    quiz.questions.push(...questionIds);

    await quiz.save();

    res.status(201).json(questions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeQuestionFromQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questionId = req.params.questionId || req.body.questionId;

    if (!questionId) {
      return res.status(400).json({ message: "Question ID is required" });
    }

    // Check if question exists in quiz
    const questionIndex = quiz.questions.indexOf(questionId);

    if (questionIndex === -1) {
      return res
        .status(404)
        .json({ message: "Question not found in this quiz" });
    }

    // Remove question from quiz
    quiz.questions.splice(questionIndex, 1);
    await quiz.save();

    res.status(200).json({
      message: "Question removed from quiz successfully",
      quiz,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
