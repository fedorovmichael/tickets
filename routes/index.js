var express = require('express');
var router = express.Router();
var db = require('../db/database.js');
var async = require('async');
var dateFormat = require('dateformat');

/* GET home page. */
router.get('/', function(req, res, next) {

  var resTypes = '', resShows = '', resShowsSection = '', resSubTypes = '', resCities = '';

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

    function getSubTypesFromDB(showsSectionsResult, callback)
    {
        db.getSubTypes(function(err, subTypesResult){
            if(err){
                console.log("get sub types from db error: ", err);
                callback(err, null); 
                return;
            }

            resSubTypes = subTypesResult;
            callback(null, subTypesResult);  
        });
    },

    function getCitiesFromDB(subTypesResult, callback)
    {
        db.getCities(function(err, citiesResult){
            if(err){
                console.log("get cities from db error: ", err);
                callback(err, null); 
                return;
            }

             console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
             console.log("");
             console.log("");
            console.log('cities: ', citiesResult);
            resCities = citiesResult;
            callback(null, citiesResult);  
        });
    },

    function sendResponce(citiesResult, callback){

      res.render('index', {types: resTypes, subTypes: resSubTypes,  shows: resShows, showsSections: resShowsSection, cities: resCities, dateFormat: dateFormat });
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

router.post('/getShowByFilters', function(req, res, next) {

    var strCities = null, strTypes = null, strSubTypes = null, objTypes = null;    
    var dateFrom = null, dataTo = null, searchText = null, superPrice = false, discount = false, tour = false, sortByPrice = null, sortByName = null;

    //cities
    if(req.body.cities != null)
    {
        strCities = "";
        var citiesIDs = req.body.cities.split(','); 

        for(var i = 0; i < citiesIDs.length; i++)
        {
            strCities += "'" + citiesIDs[i] + "',";
        }

        strCities = strCities.substring(0, strCities.length - 1);
        console.log(""); 
        console.log("cities ids: ", strCities);
        console.log("");
    }

    //types
    console.log("");
    console.log("types ", req.body.types);
    console.log("");
    if(req.body.types != null)
    {        
        var typesIDs = req.body.types;
        console.log("");
        console.log("array types ", typesIDs);
        console.log("types length: ", typesIDs.length);  

        console.log("");
        
        for(var i = 0; i < typesIDs.length; i++)
        {
            //console.log("subtypes: ", typesIDs[i].subTypes );
            if(typesIDs[i].subTypes == null){

                if(strTypes == null)
                {
                    strTypes = "";
                }

                strTypes += "'" + typesIDs[i].type + "',";
            }

            if(typesIDs[i].subTypes != null){

                strSubTypes = "";
                var subTypesIDs = typesIDs[i].subTypes.split(',');
                console.log("subtypes splited: ", subTypesIDs );  

                for(var s = 0; s < subTypesIDs.length; s++)
                {
                    strSubTypes += "'" + subTypesIDs[s] + "',";
                }

                console.log("subtypes substring: ", strSubTypes );
                strSubTypes = strSubTypes.substring(0, strSubTypes.length - 1);
                console.log("subtypes after substring: ", strSubTypes );
            }            
        }

        if(strTypes != null)
        {
            strTypes = strTypes.substring(0, strTypes.length - 1);
        }       

        console.log(""); 
        console.log("types ids: ", strTypes);
        console.log("");

        console.log(""); 
        console.log("subtypes ids: ", strSubTypes);
        console.log("");
    }

    //subtypes
    // console.log("");
    // console.log("subtypes ", req.body.subtypes);
    // console.log("");
    // if(req.body.subtypes != null)
    // {
    //     strSubTypes = "";
    //     var subTypesIDs = req.body.subtypes.split(',');  

    //     for(var i = 0; i< subTypesIDs.length; i++)
    //     {
    //         strSubTypes += "'" + subTypesIDs[i] + "',";
    //     }

    //     strSubTypes = strSubTypes.substring(0, strSubTypes.length - 1);
    //     console.log(""); 
    //     console.log("subtypes ids: ", strSubTypes);
    //     console.log(""); 
    // }

    console.log("start dateFrom"); 
    console.log("dateFrom ids: ", req.body.dateFrom);
    console.log(""); 

    if(req.body.dateFrom != null)
    {
        dateFrom = req.body.dateFrom;
    }

    if(req.body.dataTo != null)
    {
        dataTo = req.body.dataTo;
    }

    if(req.body.searchText != null)
    {
        searchText = req.body.searchText;
    }

    if(req.body.superPrice)
    {
        superPrice = req.body.superPrice ? "1" : "0";
    }   

    console.log("start discount"); 
    console.log("discount : ", req.body.discount);
    console.log("");
    if(req.body.discount)
    {
        discount = req.body.discount ? "1" : "0";
    } 

    if(req.body.tour)
    {
        tour = req.body.tour ? "1" : "0";
    }  

    if(req.body.sortByPrice != null)
    {
        sortByPrice = req.body.sortByPrice;
    }

    if(req.body.sortByName != null)
    {
        sortByName = req.body.sortByName;
    }

    console.log(""); 
    console.log("dateFrom ids: ", req.body.dateFrom);
    console.log(""); 
    var filter = {
        cities: strCities,
        types: strTypes,
        subtypes: strSubTypes,
        dateFrom: dateFrom,
        dataTo: dataTo,
        searchText: searchText,
        superPrice: superPrice,
        discount: discount,
        sortByPrice: sortByPrice,
        sortByName: sortByName,
        tour: tour
    };

    console.log(""); 
    console.log("filter: ", filter);
    console.log("");

    async.series([

        function getShowsByFiltersFromDB(callback)
        {
            db.getShowsByFilters(filter, function(err, showsByFilterResult){
                if(err){
                    console.log("get shows by filters from db error: ", err);
                    callback(err, null); 
                    return;
               }

               callback(null, showsByFilterResult);
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

module.exports = router;
