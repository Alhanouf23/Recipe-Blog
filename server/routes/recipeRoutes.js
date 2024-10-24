const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authController = require('../controllers/authController');
const Category = require('../models/Category'); // Import the Category model
const Recipe = require('../models/Recipe'); // Import the Recipe model

/**
 * App Routes 
*/
router.get('/', (req, res) => {
    res.redirect('/signup'); // Redirect the user to the signup page
});

router.get('/signup', (req, res) => {
    res.render('signUp'); // Render the user signup page
});

router.post('/signup', authController.register); // Handle user signup data

router.get('/login', (req, res) => {
    res.render('login'); // Render the login page
});

router.post('/login', authController.login); // Handle login

router.get('/dashboard', authController.isLoggedIn, async (req, res) => {
    try {
        const categories = await Category.find({}); // Fetch all categories from the database
        const latestRecipes = await Recipe.find({}).sort({_id: -1}).limit(5); // Fetch the latest 5 recipes
        const thaiRecipes = await Recipe.find({ 'category': 'Thai' }).limit(5); // Thai recipes
        const americanRecipes = await Recipe.find({ 'category': 'American' }).limit(5); // American recipes
        const chineseRecipes = await Recipe.find({ 'category': 'Chinese' }).limit(5); // Chinese recipes

        const food = { latest: latestRecipes, thai: thaiRecipes, american: americanRecipes, chinese: chineseRecipes }; // Build the food object

        res.render('index', { categories, food }); // Pass categories and recipes to the view
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error'); // Handle errors
    }
});

router.get('/recipe/:id', recipeController.exploreRecipe);
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);

// Route to get the edit recipe page
router.get('/recipe/edit/:id', authController.isLoggedIn, async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).render('error', { message: 'Recipe not found' });
        }

        res.render('edit-recipe', { recipe }); // Render the edit recipe page
    } catch (error) {
        console.error('Error fetching recipe for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update recipe
router.put('/recipe/:id', authController.isLoggedIn, async (req, res) => {
    try {
        const { name, description, ingredients, category } = req.body;

        // Ensure ingredients is an array
        const ingredientArray = ingredients.split(',').map(ingredient => ingredient.trim());

        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, {
            name,
            description,
            ingredients: ingredientArray,
            category
        }, { new: true });

        if (!updatedRecipe) {
            return res.status(404).send('Recipe not found');
        }

        res.redirect('/dashboard'); // Redirect to dashboard after successful update
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete recipe
router.delete('/recipe/:id', authController.isLoggedIn, async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.status(200).send('Recipe deleted successfully');
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
