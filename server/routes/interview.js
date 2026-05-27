import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sessionManager } from '../services/sessionManager.js';
import { getNextQuestion, evaluateSession } from '../services/lmStudio.js';

const router = express.Router();

/**
 * POST /api/interview/start
 * Starts a new interview session
 */
router.post('/start', async (req, res) => {
  try {
    const { type, role, difficulty, numQuestions, focusAreas, llmSettings } = req.body;

    if (!type || !role || !difficulty || !numQuestions) {
      return res.status(400).json({ error: 'Missing required configuration fields' });
    }

    const sessionId = uuidv4();
    const config = {
      type,
      role,
      difficulty,
      numQuestions: parseInt(numQuestions, 10),
      focusAreas: focusAreas || [],
      llmSettings: llmSettings || null
    };

    // Create session in session storage
    sessionManager.createSession(sessionId, config);

    // Call LM Studio for the first question
    console.log(`Starting ${type} interview for "${role}" (${difficulty}). Generating first question...`);
    const firstQuestion = await getNextQuestion(config, []);

    // Register assistant's question in session
    sessionManager.addTurn(sessionId, 'assistant', firstQuestion);

    res.status(200).json({
      sessionId,
      question: firstQuestion,
      totalQuestions: config.numQuestions,
      currentQuestionIndex: 1
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/interview/respond
 * Submits user's response and gets next question
 */
router.post('/respond', async (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    if (!sessionId || answer === undefined) {
      return res.status(400).json({ error: 'Session ID and answer are required' });
    }

    const session = sessionManager.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    // Save candidate's answer
    sessionManager.addTurn(sessionId, 'user', answer);

    // Calculate current question counts
    const assistantTurns = session.turns.filter(t => t.role === 'assistant');
    const questionsAsked = assistantTurns.length;
    const maxQuestions = session.config.numQuestions;

    console.log(`Received response for question ${questionsAsked}/${maxQuestions} in session ${sessionId}`);

    if (questionsAsked >= maxQuestions) {
      // Completed! No more questions to ask
      return res.status(200).json({
        finished: true,
        message: "Thank you! That was the final question. Generating your report..."
      });
    }

    // Generate next question
    console.log(`Generating question ${questionsAsked + 1} of ${maxQuestions}...`);
    const nextQuestion = await getNextQuestion(session.config, session.turns);

    // Register question in session
    sessionManager.addTurn(sessionId, 'assistant', nextQuestion);

    res.status(200).json({
      finished: false,
      question: nextQuestion,
      currentQuestionIndex: questionsAsked + 1
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/interview/score
 * Triggers evaluation and final score generation
 */
router.post('/score', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = sessionManager.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    if (session.qaPairs.length === 0) {
      return res.status(400).json({ error: 'Cannot score an empty interview. Please answer some questions first.' });
    }

    console.log(`Evaluating interview session ${sessionId}...`);
    const evaluation = await evaluateSession(session.config, session.qaPairs);

    // Complete session with evaluation data
    sessionManager.completeSession(sessionId, evaluation);

    res.status(200).json({
      sessionId,
      evaluation
    });
  } catch (error) {
    console.error('Error scoring interview:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/interview/history
 * Returns list of all interviews
 */
router.get('/history', (req, res) => {
  try {
    const history = sessionManager.getHistory();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error retrieving history:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/interview/:id
 * Returns details of a specific interview session
 */
router.get('/:id', (req, res) => {
  try {
    const session = sessionManager.getSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    console.error('Error retrieving session details:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
