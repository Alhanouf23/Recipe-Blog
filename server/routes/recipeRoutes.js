const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

//app routs


router.get('/',recipeController.homepage);
router.get('/categories',recipeController.exploraCategories);
router.get('/recipe/:id',recipeController.exploraRecipe);
module.exports = router;
