var express = require('express');
var router = express.Router();
var db = require('../db/database.js');
var db_comments = require('../db/database_comments.js');
var sm_comments = require('../xml/sm_comments.js');
var async = require('async');
var dateFormat = require('dateformat');
var appConfig = require("../config/index.js");
var device = require('express-device');
var uuid = require('node-uuid');

router.use(device.capture());
device.enableDeviceHelpers(router);

/* GET home page. */
router.get('/', function(req, res, next) {
    var content = "Самая большая афиша в Израиле. Куда сходить: расписания концертов, выставок, спектаклей, гастролей, израильских театров, балета, оперы, цирка, клубных событий и развлечений для детей";
    var title = "Афиша 2017 - купить билет на концерт, театр онлайн в Израиле - BILETY.CO.IL";
    appConfig.loadConfig();
    var linkhref = appConfig.getConfig("urls", "base_url") + "/he-il"
    var headParams = { content: content, linkhref: linkhref, linklang: "he-il", title: title };
    loadDefaulPage(req, res, next, headParams);
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
    
    getShowByShowIdOrShowCode(req, res, next, 'json');

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

    getShowsByFilter(req, res, next, null);
});

router.get('/event/:id', function(req, res, next){   

    //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++ device property: ", req.device.type);

    var bot = req.query._escaped_fragment_;

    if(bot == undefined && req.device.type != "bot")
    {
        appConfig.loadConfig();
        var baseUrl = appConfig.getConfig("urls", "base_url");
       
        var showCode = req.params.id;
        res.redirect(baseUrl + "/?show=" + showCode);
        //getShowByShowIdOrShowCode(req, res, next, 'page');       
    }
    else
    {
        getShowByShowIdOrShowCode(req, res, next, 'page'); 
    }    
    
});

router.get('/he-il', function(req,res, next){
    appConfig.loadConfig();
    var content = "BILETY.CO.IL – агрегатор билетов на спектакли, концерты и другие культурные мероприятия в Израиле,כרטיסים,תאטרון,הופעות";
    var title = "BILETY.CO.IL – израильская афиша.";
    var headParams = { content: content, linkhref: appConfig.getConfig("urls", "base_url"), linklang: "ru-il", title: title};
    loadDefaulPage(req, res, next, headParams);
    //res.redirect(appConfig.getConfig("urls", "base_url"));
});

//comments++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.post('/createComment', function(req, res, next){
    var comment = req.body, dateComment = dateFormat(new Date(), "isoDateTime");//dateFormat(new Date(), "yyyy-mm-dd HH:MM");
    comment.id = uuid.v1();
    comment.avatar = "/images/comment-avatar.jpg";
    comment.publish_date = dateComment;
    //comment.host = "creator";
    comment.status = "inprogress";

    //res.json({data: true});

    async.series([
        function createCommentInDB(callback){
            db_comments.createComment(comment, function(err, resultCreateComment){
                 if(err){
                    console.log("create comment in db error: ", err);
                    callback(err, null); 
                    return;
               }

               callback(null, resultCreateComment);
            });
        },

        function addCommentToSM(callback){
            sm_comments.updateSiteMap(comment.showCode, function(err, resultAddCommentToSM){
                 if(err){
                    console.log("add comment in sitemap error: ", err);
                    callback(err, null); 
                    return;
               }

               callback(null, resultAddCommentToSM);
            });
        }

    ],
    function(err, result){
        if(err){
            res.json({error: err});
        }
        else{
            res.json({success: result[0]});
        }        
    });    
});

router.get('/comment/:id', function(req, res, next){
    var showCode = req.params.id;
    async.series([
        function getCommentByShowCodeFromDB(callback){
            db_comments.getCommentsByShowCode(showCode, function(err, resultGetCommentsByShowCode){
                if(err){
                    console.log("get comments by show code from db error: ", err);
                    callback(err, null); 
                    return;
                }

                callback(null, resultGetCommentsByShowCode);
            });
        }
    ], 
    function(err, result){
        var arrComments = result[0], con = '', content = '', showName = 'Комментарии не доступны';
        
        if(arrComments.length > 0){
            if(arrComments[0].announce.length > 160){
                con = arrComments[0].announce.substring(0, 160);
                content = con.substring(0, con.lastIndexOf(' '));
            }
            else{
                content = arrComments[0].announce;
            }
            
            showName = "Комментарий к " + arrComments[0].show_name;
        }
                
        res.render('comment', { comments: arrComments, title: showName, content: content });
    });
});

router.get('/?/?', function(req, res, next){ ///concert/poprock

    console.log("");
    console.log("=========================================== route path /?/?");
    console.log("");
    var content = "Самая большая афиша в Израиле. Куда сходить: расписания концертов, выставок, спектаклей, гастролей, израильских театров, балета, оперы, цирка, клубных событий и развлечений для детей";
    var title = "Афиша 2017 - купить билет на концерт, театр онлайн в Израиле - BILETY.CO.IL";
    appConfig.loadConfig();
    var linkhref = appConfig.getConfig("urls", "base_url") + "/he-il"
    var headParams = { content: content, linkhref: linkhref, linklang: "he-il", title: title };
    loadDefaulPage(req, res, next, headParams);
});

//general methods+++++++++++++++++++++++++++++++++++++++++++++++++++++
function getShowByShowIdOrShowCode(req, res, next, resType)
{
     var showID = '', showCode = '';

     if(resType == 'json')
     {
         showID = req.body.id; 
         showCode = req.body.showCode;
     }
     else if(resType == 'page')
     {
         showCode = req.params.id
     }

    try
    {    
        async.series([
            function getShowsByShowIDFromDB(callback)
            {
                db.getShowByShowID(showID, showCode, function(err, showsByIDResult){
                    if(err){
                        console.log("get show by id from db error: ", err);
                        callback(err, null); 
                        return;
                }
                
                if((showID == undefined || showID == '') && showCode != "")
                {
                    if(showsByIDResult[0] != undefined && showsByIDResult.length > 0){
                        showID = showsByIDResult[0].id;
                    }
                    else
                    {
                        var content = "Самая большая афиша в Израиле. Куда сходить: расписания концертов, выставок, спектаклей, гастролей, израильских театров, балета, оперы, цирка, клубных событий и развлечений для детей";
                        var headParams = { content: content };
                        loadDefaulPage(req, res, next, headParams);
                        return;
                    }
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

            function getCommentsByShowCodeFromDB(callback)
            {               
                db_comments.getCommentsByShowCode(showCode, function(err, resultGetCommentsByShowCode){
                    if(err){
                        console.log("get comments by show code from db error: ", err);
                        callback(err, null); 
                        return;
                    }

                    callback(null, resultGetCommentsByShowCode);
                });
            }
        ],        
        function(err, result){

            var resShow = result[0], 
                resShowSeances = result[1],
                resShowMedia = result[2],
                resComments = result[3],
                headParams = {title: resShow[0].name}, 
                arrCommentsObjects = [];

            // for(var i=0; i< resComments.length; i++){
            //     var comm = resComments[i], commentsObject = {}; 
            //     if(comm.host == 'creator'){
            //         comm.answerers = [];
            //         commentsObject[comm.id] = comm;                    
            //     }
            //     else if(comm.host == 'answerer'){
            //         //!dicItemsByCategoryID.hasOwnProperty(arrCategories[index].id)
            //     }

            //     arrCommentsObjects.push({commentsObject});
            // }
            
            if(resType == 'json'){
                res.json({show: resShow, showSeances: resShowSeances, showMedia: resShowMedia, comments: resComments});
            }
            else if(resType == 'page'){                   
                res.render('edit_show_page', { show: resShow, showSeances: resShowSeances, showMedia: resShowMedia, headParams: headParams, content: resShow[0].announce, comments: resComments }); 
            }                
        });
    }
    catch(e)
    {
        console.log("getShowByShowIdOrShowCode -> error: ", e);
    }
}

function loadDefaulPage(req, res, next, headParams)
{
    var resTypes = '', resShows = '', resShowsSection = '', resSubTypes = '', resCities = '', resAgencesShows = '';
    
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
    
                //  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                //  console.log("");
                //  console.log("");
                // console.log('cities: ', citiesResult);
                resCities = citiesResult;
                callback(null, citiesResult);  
            });
        },
    
        function getAgencesShowsFromDB(citiesResult, callback)
        {
           db.getAgencesShows(function(err, agencesShowsResult){
                if(err){
                    console.log("get agences shows from db error: ", err);
                    callback(err, null); 
                    return;
                }
    
                // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                // console.log("");
                // console.log("");
                // console.log('agences shows: ', agencesShowsResult);
                resAgencesShows = agencesShowsResult;
                callback(null, agencesShowsResult);  
            });
        },
    
        function sendResponce(agencesShowsResult, callback){
          
          for(var i = 0; i < resAgencesShows.length; i++)
          {
            //   console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            //   console.log("");
            //   console.log("");
            //   console.log('index of: ', resShows.findIndex(x => x.show_id === resAgencesShows[i].show_id));
    
              var index = resShows.findIndex(x => x.show_id === resAgencesShows[i].show_id);          
    
              if(index > 0)
              {             
                 resShows.splice(index, 1);
                 resShows.splice(0,0, resAgencesShows[i]);
              }          
          }    
          
          callback(null, null);
        }
    
      ], function(err, result){
          if(err){
            console.log('start parse error: ', err)
          }

          res.render('index', {types: resTypes, subTypes: resSubTypes, shows: resShows, showsSections: resShowsSection, cities: resCities, dateFormat: dateFormat, content: headParams.content, title: headParams.title });
      })
}

function getShowsByFilter(req, res, next, headParams)
{
    var strCities = null, strTypes = null, strSubTypes = null, objTypes = null;    
    var dateFrom = null, dataTo = null, arrDates = [], searchText = null, superPrice = false,
        discount = false, tour = false, sortByPrice = null, sortByName = null, sortByDate = null, 
        sortBySection = null, minPrice = null, maxPrice = null;

    //cities
    if(req.body.cities != null)
    {
        //console.log("cities: ", req.body.cities);        
        var arrObjRegion = JSON.parse(req.body.cities);

        strCities = "";

        for(var i = 0; i < arrObjRegion.length; i++)
        {
            var arrCities = arrObjRegion[i].cities;

            for(var c = 0; c < arrCities.length; c++)
            {
              strCities +=  "'" + arrCities[c] + "',"; 
            }          
        }

        if(strCities != "")
        {
            strCities = strCities.substring(0, strCities.length - 1);
        }
        else
        {
            strCities = null;
        }
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
    console.log("start min price"); 
    console.log("min price : ", req.body.minPrice);
    console.log("");
    if(req.body.minPrice != null)
    {
        minPrice = req.body.minPrice;
    }
    console.log("start max price"); 
    console.log("max price : ", req.body.maxPrice);
    console.log("");
    if(req.body.maxPrice != null)
    {
        maxPrice = req.body.maxPrice;
    }  

    if(req.body.sortByPrice != null)
    {
        sortByPrice = req.body.sortByPrice;
    }

    if(req.body.sortByName != null)
    {
        sortByName = req.body.sortByName;
    }
    
    if(req.body.dates != null)
    {
        arrDates = JSON.parse(req.body.dates);
    }
    else
    {
        arrDates = null;
    }

    if(req.body.sortByDate != null)
    {
        sortByDate = req.body.sortByDate;
    }

    if(req.body.sortBySection != null)
    {
        sortBySection = req.body.sortBySection;
    }
    

    var filter = {
        cities: strCities,
        types: strTypes,
        subtypes: strSubTypes,        
        searchText: searchText,
        superPrice: superPrice,
        discount: discount,
        sortByPrice: sortByPrice,
        sortByName: sortByName,
        sortByDate: sortByDate,
        sortBySection: sortBySection,
        tour: tour,
        dates: arrDates,
        minPrice: minPrice,
        maxPrice: maxPrice
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
        },

        function getAgencesShowsFromDB(callback)
        {
           db.getAgencesShows(function(err, agencesShowsResult){
                if(err){
                    console.log("get agences shows from db error: ", err);
                    callback(err, null); 
                    return;
                }

                // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                // console.log("");
                // console.log("");
                // console.log('agences shows: ', agencesShowsResult);
                
                callback(null, agencesShowsResult);  
            });
        }
    ], 
    function(err, result){
        
        var resShows = result[0], resShowsSection = result[1], agencesShows = result[2];

        for(var i = 0; i < agencesShows.length; i++)
        {
            var index = resShows.findIndex(x => x.show_id === agencesShows[i].show_id);          

            if(index > 0)
            {             
                resShows.splice(index, 1);
                resShows.splice(0,0, agencesShows[i]);
            }            
        }

        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        // console.log("");
        // console.log("result shows from db:  ", resShows );
        // console.log("result section from db:  ", resShowsSection );
        // console.log("");
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        if (req.method == "POST"){
            res.json({shows: resShows, showsSections: resShowsSection});
        }
        else{
            res.render('partials/shows_main', {shows: resShows, showsSections: resShowsSection, dateFormat: dateFormat});//, content: headParams.content, title: headParams.title });
        }

    });
}

module.exports = router;
