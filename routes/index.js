var express = require('express');
var router = express.Router();
var db = require('../db/database.js');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {

  var resTypes = '', resShows = '', resShowsSection = '';

  async.waterfall([
    function getTypesFromDB(callback)
    {
        db.getTypes(function(err, typesResult){
            if(err){
                console.log("get types from db error: ", err);
                callback(err, null); 
                return;
            }

            resTypes = typesResult;
            callback(null, typesResult);  
        });
    },

    function getShowsFromDB(typesResult, callback)
    {
        db.getShows(function(err, showsResult){
            if(err){
                console.log("get shows from db error: ", err);
                callback(err, null); 
                return;
            }

            resShows = showsResult;
            callback(null, showsResult);  
        });
    },

    function getShowsSectionsFromDB(showsResult, callback)
    {
        db.getShowsSections(function(err, showsSectionsResult){
            if(err){
                console.log("get shows sections from db error: ", err);
                callback(err, null); 
                return;
            }

            resShowsSection = showsSectionsResult;
            callback(null, showsSectionsResult);  
        });
    },

    function sendResponce(showsSectionsResult, callback){

      res.render('index', {types: resTypes, shows: resShows, showsSections: resShowsSection });
      callback(null, null);
    }

  ], function(err, result){
      if(err){
        console.log('start parse error: ', err)
      }
  })
  
});

router.post('/getShowsByType', function(req, res, next) {

    var ids = req.body.ids.split(',');
    console.log("type ids: ", ids);

    var idsStr = '';
    for(var i=0; i< ids.length; i++)
    {
        idsStr += "'" + ids[i] + "',";
    }

    idsStr = idsStr.substring(0, idsStr.length - 1);

    async.series([
        function getShowsByTypeFromDB(callback)
        {
            db.getShowsByType(idsStr, function(err, showsByTypeResult){
                if(err){
                    console.log("get shows by type from db error: ", err);
                    callback(err, null); 
                    return;
               }

               callback(null, showsByTypeResult);
            })            
        },
        function getShowSectionFromDB(callback)
        {
           db.getShowsSections(function(err, showsSectionsResult){
                if(err){
                    console.log("get shows sections from db error: ", err);
                    callback(err, null); 
                    return;
                }
               
                callback(null, showsSectionsResult);  
            });
        }
    ], 
    function(err, result){
        var resShows = result[0], resShowsSection = result[1];
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        // console.log("");
        // console.log("result shows from db:  ", resShows );
        // console.log("result section from db:  ", resShowsSection );
        // console.log("");
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        res.json({shows: resShows, showsSections: resShowsSection});
    });    
});

router.post('/getShowByID', function(req, res, next) {
    
    var showID = req.body.id;

    async.series([
       function getShowsByShowIDFromDB(callback)
        {
            db.getShowByShowID(showID, function(err, showsByIDResult){
                if(err){
                    console.log("get show by id from db error: ", err);
                    callback(err, null); 
                    return;
               }

               callback(null, showsByIDResult);
            })            
        },

       function getSeancesByShowIDFromDB(callback)
        {
            db.getSeancesByShowID(showID, function(err, seancesByShowIDResult){
                if(err){
                    console.log("get seances by show id from db error: ", err);
                    callback(err, null); 
                    return;
               }

               callback(null, seancesByShowIDResult);
            })            
        },

        function getMediaByShowIDFromDB(callback)
        {
            db.getMediaByShowID(showID, function(err, mediaByShowIDResult){
                if(err){
                    console.log("get media by show id from db error: ", err);
                    callback(err, null); 
                    return;
               }

               callback(null, mediaByShowIDResult);
            })            
        },
    ],
    function(err, result){
        var resShow = result[0], resShowSeances = result[1], resShowMedia = result[2];
        res.json({show: resShow, showSeances: resShowSeances, showMedia: resShowMedia});  
    });

});


router.post('/getSearchShowByText', function(req, res, next) {

    var searchText = req.body.text;

    async.series([
       function getShowsBySearchTextFromDB(callback)
        {
            db.searchShowByText(searchText, function(err, showsBySearchTextResult){
                if(err){
                    console.log("get shows by search text from db error: ", err);
                    callback(err, null); 
                    return;
               }

               callback(null, showsBySearchTextResult);
            })            
        },
        function getShowSectionFromDB(callback)
        {
           db.getShowsSections(function(err, showsSectionsResult){
                if(err){
                    console.log("get shows sections from db error: ", err);
                    callback(err, null); 
                    return;
                }
               
                callback(null, showsSectionsResult);  
            });
        }
    ], 
    function(err, result)
    {
        var resShows = result[0], resShowsSection = result[1];
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        // console.log("");
        // console.log("result shows from db:  ", resShows );
        // console.log("result section from db:  ", resShowsSection );
        // console.log("");
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        res.json({shows: resShows, showsSections: resShowsSection});
    });

});

module.exports = router;
