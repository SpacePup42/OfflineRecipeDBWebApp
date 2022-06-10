const express = require('express')
const path = require('path');
const router = express.Router()

const {AllRecipes} = require('../controllers/ViewRecipes')
const {RecipeDetails} = require('../controllers/ViewRecipes')
const {EditRecipe} = require('../controllers/ViewRecipes')
const {PublishEdit} = require('../controllers/ViewRecipes')
const {NewRecipeForm} = require('../controllers/ViewRecipes')
const {CreateRecipe} = require('../controllers/ViewRecipes')

router.get('/',AllRecipes)
router.get('/New',NewRecipeForm)
router.post('/New/Create',CreateRecipe)
router.post('/Publish',PublishEdit)
router.get('/:ID/Edit',EditRecipe)
router.get('/:ID',RecipeDetails)

module.exports = router
