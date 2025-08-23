const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {  createBoard,inviteUserToBoard,  getMyBoards,  getBoardMembers} = require('../controllers/boardController');



router.post('/', auth, createBoard);
router.post('/:boardId/invite', auth, inviteUserToBoard);
router.get('/', auth, getMyBoards);
router.get("/:boardId/members",auth,getBoardMembers)

module.exports = router;