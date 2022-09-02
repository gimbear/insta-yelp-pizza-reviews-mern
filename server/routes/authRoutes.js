const { Router } = require('express');
const authController = require('../controllers/authController');
const router = Router();

//Auth endpoints
router.post('/signup', authController.signupPOST);
router.post('/login', authController.loginPOST);
router.get('/logout', authController.logoutGET);

router.get('/protected', authController.protectedGET);

module.exports = router;
