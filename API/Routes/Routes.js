//Routes.js
'use strict';
var express = require('express');
module.exports = function(app) {
  var gameDataController = require('../Controllers/GameDataController');
var apiRoutes =  express.Router();
app.get('/',function(req,res){
    res.send('We are happy to see you using Chat Bot Webhook');
  });
// registerUser Route
  app.route('/')
    .post(gameDataController.processRequest);
};

exports.processRequest = function(req, res) {
if (req.body.result.action == "schedule") {
    getTeamSchedule(req,res)
  }
  else if (req.body.result.action == "tell.about")
  {
      getTeamInfo(req,res)
  }
};
