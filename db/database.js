var pg = require("pg");
var appConfig = require("../config/index.js");
var async = require('async');
var db = {};

appConfig.loadConfig();

var config = {
    user: appConfig.getConfig("db", "user"),
    database: appConfig.getConfig("db", "database"),
    password: appConfig.getConfig("db", "password"),
    host: appConfig.getConfig("db", "host"),
    port: appConfig.getConfig("db", "port"),
    max: appConfig.getConfig("db", "max"),
    idleTimeoutMillis: appConfig.getConfig("db", "idleTimeoutMillis")
};

var pool = new pg.Pool(config);

db.getTypes = function(cb)
{
    try 
    {
        var queryDB = "SELECT * FROM type";
        console.log("connect to db");
        
        pool.connect(function(err, client, done){
            if(err)
            {
                console.error("connection error -> " + err);
            }
            else
            {
                console.log("success connec to db");
            }

            client.query(queryDB, function(err, result){
                done();
                if(err)
                {
                    console.error("send query error -> ", err);
                    cb(err, null);
                    return;
                }
                console.log("retrieved rows -> ", result);
                cb(null, result.rows);
            });
        });  
    } 
    catch (error) 
    {
        console.log("error get types: ", error);
    }
}

db.getShows = function(cb)
{
    try 
    {
        var queryDB = "select * from shows where top = '1' order by price_min desc";
        console.log("connect to db");
        
        pool.connect(function(err, client, done){
            if(err)
            {
                console.error("connection error -> " + err);
            }
            else
            {
                console.log("success connec to db");
            }

            client.query(queryDB, function(err, result){
                done();
                if(err)
                {
                    console.error("send query error -> ", err);
                    cb(err, null);
                    return;
                }
                console.log("retrieved rows -> ", result);
                cb(null, result.rows);
            });
        }); 
    } 
    catch (error) 
    {
        console.log("error get shows: ", error);
    }
}

db.getShowsSections = function(cb)
{
    try
    {
       var queryDB = "select show_section.show_id, type.id as type_id, type.name as type_name, type.color as color, subtype.id as subtype_id, subtype.name as subtype_name  " + 
       "from show_section " +
       "join type on show_section.type_id = type.id "+
       "join subtype on show_section.subtype_id = subtype.id;";
       getMultipleResponse(cb, queryDB);

    } 
    catch (error) {
        console.log("db.getShowsSections error: ", error);
    }
}

db.getShowsByType = function(stringIDs, cb)
{
    try 
    {
        console.log("db.getShowsByType ids: ", stringIDs)

        var where = "";

        if(stringIDs.length > 2)
        {
            where = "where t.id in (" + stringIDs + ")";
        }
        
        var queryDB = "select s.id as show_id, s.name, s.main_image, s.link, s.date_from, s.date_to, s.price_min, s.price_max, s.resource, s.superprice, s.discount, t.id as type_id, t.name as type_name, t.color " + 
        "from shows as s " +
        "join show_section as ss on s.id = ss.show_id " +
        "join type as t on ss.type_id = t.id " +
        where;

        console.log("ids : ", stringIDs.length);
        console.log("query: ", queryDB);
        getMultipleResponse(cb, queryDB);     
    }
    catch (error) 
    {
       console.log("db.getShowsByType error: ", error); 
    }
}

db.getShowByShowID = function(showID, cb)
{
    try 
    {
        console.log("db.getShowByShowID id: ", showID)

        var queryDB = "select name, announce, main_image, second_image, resource from shows where id = '" + showID + "';"
        getMultipleResponse(cb, queryDB);
    } 
    catch (error) 
    {
        console.log("db.getShowByShowID error: ", error);    
    }
}

db.getSeancesByShowID = function(showID, cb)
{
    try 
    {
        console.log("db.getSeancesByShowID show id: ", showID)

        var queryDB = "select city, date, seance_time, tickets, price_min, price_max, hall from seances where show_id = '"+ showID +"';"
        getMultipleResponse(cb, queryDB);
    } 
    catch (error) 
    {
        console.log("db.getSeancesByShowID error: ", error);    
    }
}

db.getMediaByShowID = function(showID, cb)
{
    try 
    {
        console.log("db.getMediaByShowID show id: ", showID)

        var queryDB = "select link from media where show_id = '"+ showID +"';"
        getMultipleResponse(cb, queryDB);
    } 
    catch (error) 
    {
        console.log("db.getMediaByShowID error: ", error);    
    }
}

db.searchShowByText = function(searchText, cb)
{
    try 
    {
        console.log("db.searchShowByText search text: ", searchText)

        var queryDB = "select s.id as show_id, s.name, s.main_image, s.link, s.date_from, s.date_to, s.price_min, s.price_max, s.resource, s.superprice, s.discount, t.id as type_id, t.name as type_name, t.color " + 
                      "from shows as s " +
                      "join show_section as ss on s.id = ss.show_id "+
                      "join type as t on ss.type_id = t.id " +
                      "join seances as se on s.id = se.show_id " + 
                      "where s.name like '%"+ searchText +"%' or s.announce like '%"+ searchText +"%' or se.hall like '%" + searchText + "%';";

        console.log("searchShowByText query: ", queryDB)

        getMultipleResponse(cb, queryDB);
    } 
    catch (error) 
    {
        console.log("db.searchShowByText error: ", error);    
    }
}

db.getSubTypes = function(cb)
{
    try
    {
       var queryDB = "select id as subtype_id, name, type_id  from subtype";
       getMultipleResponse(cb, queryDB);

    } 
    catch (error) {
        console.log("db.getSubTypes error: ", error);
    }
}

db.getCities = function(cb)
{
    try
    {
       var resultCities = []; 
       var regionQueryDB = "select distinct region from cities";
       var citiesQueryDB = "select distinct c.id, c.name, c.region from cities as c join seances as s on c.name = s.city";

       async.series([
           function getRegionsFromDB(callback)
           { 

                pool.connect(function(err, client, done){
                    if(err)
                    {
                        console.error("connection error -> " + err);
                    }
                    else
                    {
                        console.log("success connec to db");
                    }

                    client.query(regionQueryDB, function(err, result){
                        done();
                        if(err)
                        {
                            console.error("send query error -> ", err);
                            callback(err, null);
                            return;
                        }
                        //console.log("retrieved rows -> ", result);
                        callback(null, result.rows);
                    });
                }); 
           },

           function getCitiesFromDB(callback){
                 pool.connect(function(err, client, done){
                    if(err)
                    {
                        console.error("connection error -> " + err);
                    }
                    else
                    {
                        console.log("success connec to db");
                    }

                    client.query(citiesQueryDB, function(err, result){
                        done();
                        if(err)
                        {
                            console.error("send query error -> ", err);
                            callback(err, null);
                            return;
                        }
                        //console.log("retrieved rows -> ", result);
                        callback(null, result.rows);
                    });
                });
           }
       ], 
       function(err, result){
           if(err)
           {
               console.log("get cities error: ", err);
               cb(err, null);
           }

           for(var i = 0; i < result[0].length; i++)
           {
               var regionCities = {};
               var arrCities = [];
               for(var c = 0; c < result[1].length; c++)
               {
                   if(result[0][i].region == result[1][c].region)
                   {
                       console.log("added city: ",  result[1][c].name);
                       console.log("");
                       arrCities.push(result[1][c]);
                   }
               }

               var regionCities = {regionName: result[0][i].region, cities: arrCities };
               resultCities.push(regionCities);               
           }

           cb(null, resultCities);
       });    
    } 
    catch (error) {
        console.log("db.getCities error: ", error);
    }
}

db.getShowsByFilters = function(filters, cb)
{
    try 
    {
        var queryFiters = '', querySort = '', queryTempTable = '', queryDropTempTable = '';     

        console.log(""); 
        console.log("start get data by filter: ", filters);
        console.log("");

        if(filters.types != null || filters.subtypes != null )
        {
            queryTempTable = "" +            
            " create table t_types as select show_id from show_section where type_id in ("+ filters.types +"); " +
            " create table t_subtypes as select show_id from show_section where subtype_id in ("+ filters.subtypes +"); " +            
            " create table t_shows as (select show_id from t_types union select show_id from t_subtypes); ";

            queryFiters += " and sh.id in (select show_id from t_shows)";
            queryDropTempTable = "drop table t_types; drop table t_subtypes; drop table t_shows; ";            

        }

        if(filters.cities != null)
        {
            queryFiters += " and c.id in ("+ filters.cities +")";
        }

        // console.log("filters.types", filters.types);
        // if(filters.types != null)
        // {
        //     queryFiters += " and t.id in ("+ filters.types +")";
        //     console.log("queryFiters types: ", queryFiters);
        // }

        // if(filters.subtypes != null)
        // {
        //     queryFiters += " and st.id in ("+ filters.subtypes +")";
        // }

        if(filters.dateFrom != null)
        {
            queryFiters += " and sh.date_from >= '"+filters.dateFrom +"'";
        }

        if(filters.dataTo != null)
        {
            queryFiters += " and sh.date_to <= '"+ filters.dataTo +"'";
        }

        if(filters.dates != null)
        {
            for(var i = 0; i < filters.dates.length; i++)
            {
                if(filters.dates.length > 1 && i <= filters.dates.length - 1 && i > 0)
                {
                   queryFiters += " or (sh.date_from >= '" + filters.dates[i].fDate + "'";
                }
                else
                {
                    queryFiters += " and (sh.date_from >= '" + filters.dates[i].fDate + "'";
                }
                
                queryFiters += " and sh.date_to <= '" + filters.dates[i].tDate + "')";                
            }
        }

        if(filters.searchText != null)
        {
            queryFiters += " and LOWER(sh.name) like '%"+ filters.searchText.toLowerCase() +"%' or LOWER(sh.announce) like '%"+ filters.searchText.toLowerCase() +"%'";
        }

        if(filters.superPrice && !filters.discount)
        {
            queryFiters += " and sh.superprice = '"+ filters.superPrice +"'";
        }

        if(filters.discount && !filters.superPrice)
        {
            queryFiters += " and sh.discount = '"+ filters.discount +"'";
        }

        if(filters.tour)
        {
            queryFiters += " and sh.tour = '"+ filters.tour +"'";
        }

        if(filters.sortByPrice != null)
        {
            querySort += " order by sh.price_min "+ filters.sortByPrice;
        }

        if(filters.sortByName != null)
        {
            querySort += " order by sh.name " + filters.sortByName;
        }

        if(filters.sortByDate != null)
        {
            querySort += " order by sh.date_from " + filters.sortByDate;
        }
        
        console.log(""); 
        console.log("filter: ", queryFiters);
        console.log("sort filter: ", querySort);
        console.log("");

        // var queryDB = "select sh.id as show_id, sh.name as name, sh.announce as announce, sh.price_min, sh.price_max, sh.date_from, sh.date_to, sh.resource, sh.main_image from shows as sh "+
        // "join seances as s on  sh.id = s.show_id "+
        // "join cities as c on s.city = c.name "+
        // "join show_section as ss on sh.id = ss.show_id "+
        // "join type as t on ss.type_id = t.id "+
        // "join subtype as st on ss.subtype_id = st.id "+
        // "where sh.id != '0' " +
        // queryFiters +" "+ querySort;

        //var queryDB = "select * from getshowbyfilter("+ filters.types +", "+ filters.subtypes +", "+ filters.cities +", "+ filters.dateFrom +", "+ filters.dataTo +", "+ filters.searchText +", "+ filters.superPrice +", "+ filters.discount +", "+ filters.tour +", 'date_from', 'asc')";

        var queryDB = queryTempTable +" "+
        " select distinct sh.id as show_id, sh.name as name, sh.announce as announce, sh.price_min, sh.price_max, sh.date_from, sh.date_to, sh.resource, sh.main_image from shows as sh " +
        "join seances as s on  sh.id = s.show_id " +
        "join cities as c on s.city = c.name " +
        " where sh.id != '0' " +
        queryFiters +" "+ querySort +"; "+ queryDropTempTable;

        console.log("db.getShowsByFilters", queryDB);
        getMultipleResponse(cb, queryDB);  
    }
    catch (error) 
    {
       console.log("db.getShowsByFilters error: ", error);
    }
}

function getSingleResponse(res, queryDB)
{
   pool.connect(function(err, client, done){
        if(err)
        {
            console.error("connection error -> " + err);
        }
        else
        {
            console.log("success connec to db");
        }

        client.query(queryDB, function(err, result){
            done();
            if(err)
            {
                console.error("send query error -> ", err);
            }
            console.log("retrieved result -> ", result);
            res.json({data: result});
        });
    }); 
}

function getMultipleResponse(cb, queryDB)
{
   pool.connect(function(err, client, done){
        if(err)
        {
            console.error("connection error -> " + err);
        }
        else
        {
            console.log("success connec to db");
        }

        client.query(queryDB, function(err, result){
            done();
            if(err)
            {
                console.error("send query error -> ", err);
                cb(err, null);
                return;
            }
            //console.log("retrieved rows -> ", result);
             cb(null, result.rows);
        });
    });   
}

module.exports = db;
