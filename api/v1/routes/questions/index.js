
const express = require("express");
const Authorization = require('../../../helpers/authorization.js')
const router = express.Router();
const QuestionsController = require('../../controllers/questions/index.js')


router.get('/getQuestions' , Authorization.authorize , QuestionsController.getAllQuestions)
router.get('/getUserAnswers/:user_id' , Authorization.authorize , QuestionsController.getUserAnswers);
router.post('/recordAnswers' , Authorization.authorize , QuestionsController.recordAnswers);

module.exports = router;
