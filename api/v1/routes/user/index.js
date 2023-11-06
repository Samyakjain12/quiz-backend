
  const express = require("express");
  const Authorization = require('../../../helpers/authorization.js')
  const router = express.Router();
  const UserController = require('../../controllers/user/index.js')
  
  
  router.post('/addUser',Authorization.authorize , UserController.addUser);
  router.post('/signIn',Authorization.authorize , UserController.signIn);
  router.get('/authenticateUser/:user_id' , Authorization.authorize , UserController.authenticateUser)
  module.exports = router;
  