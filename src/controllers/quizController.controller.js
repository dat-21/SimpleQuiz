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
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = new Question(req.body);
    const savedQuestion = await question.save();

    quiz.questions.push(savedQuestion._id);
    await quiz.save();

    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addManyQuestionsToQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questions = await Question.insertMany(req.body);

    const questionIds = questions.map((q) => q._id);
    quiz.questions.push(...questionIds);

    await quiz.save();

    res.status(201).json(questions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
