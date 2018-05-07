//GameDataController.js
'use strict';
var mongoose = require('mongoose');
var TeamInfo = mongoose.model('TeamInfo');
var GameSchedule = mongoose.model('GameSchedule');

//Remember the method processRequest used in Router.js. Its time to define and export it.

exports.processRequest = function(req, res) {
if (req.body.result.action == "schedule") {
    getTeamSchedule(req,res)
  }
  else if (req.body.result.action == "tell.about")
  {
      getTeamInfo(req,res)
  }
};

/*
In the above function, three conditions have been handled.
- Request for previous game schedule (eg. “When was the last game of Kings”).
- Request for next game schedule (eg. “When is the next game of Kings”).
- Request having two teams as parameters (eg. “When is the next game between Kings and Heat”).

To keep it simple for the tutorial purpose, I have written the logic for the first case only. A hard coded response has been
set for the remaining two.
Feel free to write your logic for them.

*/

////////////
function getTeamInfo(req,res)
{
let teamToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.team ? req.body.result.parameters.team : 'Unknown';
TeamInfo.findOne({name:teamToSearch},function(err,teamExists)
      {
        if (err)
        {
          return res.json({
              speech: 'Something went wrong!',
              displayText: 'Something went wrong!',
              source: 'team info'
          });
        }
if (teamExists)
        {
          return res.json({
                speech: teamExists.description,
                displayText: teamExists.description,
                source: 'team info'
            });
        }
        else {
          return res.json({
                speech: 'Currently I am not having information about this team',
                displayText: 'Currently I am not having information about this team',
                source: 'team info'
            });
        }
      });
}


////////////
function getTeamSchedule(req,res)
{
let parameters = req.body.result.parameters;
    if (parameters.team1 == "")
    {
      let game_occurence = parameters.game_occurence;
      let team = parameters.team;
      if (game_occurence == "previous")
      {
        //previous game
        GameSchedule.find({opponent:team},function(err,games)
        {
          if (err)
          {
            return res.json({
                speech: 'Something went wrong!',
                displayText: 'Something went wrong!',
                source: 'game schedule'
            });
          }
          if (games)
          {
            var requiredGame;
            for (var i=0; i < games.length; i++)
            {
                var game = games[i];
var convertedCurrentDate = new Date();
                var convertedGameDate = new Date(game.date);
if (convertedGameDate > convertedCurrentDate)
                {
                  if(games.length > 1)
                  {
                    requiredGame = games[i-1];
var winningStatement = "";
                    if (requiredGame.isWinner)
                    {
                        winningStatement = "Kings won this match by "+requiredGame.score;
                    }
                    else {
                      winningStatement = "Kings lost this match by "+requiredGame.score;
                    }
                    return res.json({
                        speech: 'Last game between Kings and '+parameters.team+' was played on '+requiredGame.date+' .'+winningStatement,
                        displayText: 'Last game between Kings and '+parameters.team+' was played on '+requiredGame.date+' .'+winningStatement,
                        source: 'game schedule'
                    });
                    break;
                  }
                  else {
                    return res.json({
                        speech: 'Cant find any previous game played between Kings and '+parameters.team,
                        displayText: 'Cant find any previous game played between Kings and '+parameters.team,
                        source: 'game schedule'
                    });
                  }
                }
            }
}
});
      }
      else {
        return res.json({
            speech: 'Next game schedules will be available soon',
            displayText: 'Next game schedules will be available soon',
            source: 'game schedule'
        });
      }
    }
    else {
      return res.json({
          speech: 'Cant handle the queries with two teams now. I will update myself',
          displayText: 'Cant handle the queries with two teams now. I will update myself',
          source: 'game schedule'
      });
    }
  }


