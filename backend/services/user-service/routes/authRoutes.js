const express = require('express');
const router = express.Router();
const { register, login ,getUser ,addBoardToUser} = require('../controllers/authcontroller');
const auth = require('../middleware/internalAuth').default;



router.post('/register', register);
router.post('/login', login);
router.get('/getUser', auth, getUser);
router.post("/add-board",auth ,addBoardToUser)

module.exports = router;