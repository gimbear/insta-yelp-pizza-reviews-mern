const { Router } = require('express');
const pizzaController = require('../controllers/pizzaController');
const { protectRoute } = require('../controllers/authController');
const { getProfileId } = require('../controllers/authController');
const upload = require('../util/multer');
const router = Router();

router.route('/').get(pizzaController.getPizzas);

router
  .route('/post')
  .post(
    protectRoute,
    upload.array('image'),
    pizzaController.addPizza
  );

router
  .route('/:id')
  .get(pizzaController.getPizzaById)
  .delete(protectRoute, pizzaController.deletePizza)
  .put(upload.array('image'), pizzaController.updatePizza);
// router
//   .route('/')
//   .get(protectRoute, postController.getPosts)
//   .post(protectRoute, postController.addPost);

// router
//   .route('/postwithimage')
//   .post(
//     protectRoute,
//     upload.single('image'),
//     postController.addPostWithImage
//   );

// router
//   .route('/:id')
//   .get(postController.getPostById)
//   .delete(protectRoute, postController.deletePost);

// router
//   .route('/upload')
//   .post(
//     protectRoute,
//     upload.single('image'),
//     postController.uploadImage
//   );

module.exports = router;
