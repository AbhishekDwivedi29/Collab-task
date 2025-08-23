const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createTask,
  moveTask,
  addComment
} = require('../controllers/taskController');

router.post('/', auth, createTask);
router.put('/move', auth, moveTask);
router.post('/:taskId/comments', auth, addComment);

module.exports = router;