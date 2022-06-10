const express = require('express')
const path = require('path');
const router = express.Router()

const {Feedback} = require('../controllers/ViewRecipes')
const {SubmitFeedback} = require('../controllers/ViewRecipes')
router.get('/', Feedback)
router.post('/Submitted',SubmitFeedback)
module.exports = router
