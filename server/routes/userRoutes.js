const { Router } = require('express');
const userController = require('../controllers/userController');
const { protectRoute } = require('../controllers/authController');
const upload = require('../util/multer');
const router = Router();

router.route('/:id').get(userController.getUser);

router
  .route('/upload')
  .post(
    protectRoute,
    upload.single('image'),
    userController.updateProfileImage
  );

// router
//   .route('/profileImage')
//   .router.get('/:id', userController.getUser);
// router.post(
//   '/:id',
//   upload.single('image'),
//   userController.updateProfile
// );

module.exports = router;
