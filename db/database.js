var pg = require("pg");
var appConfig = require("../config/index.js");
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
        var queryDB = "select * from shows where top = '1'";
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

        var queryDB = "select s.id as show_id, s.name, s.main_image, s.link, s.date_from, s.date_to, s.price_min, s.price_max, s.resource, s.superprice, s.discount, t.id as type_id, t.name as type_name, t.color " + 
        "from shows as s " +
        "join show_section as ss on s.id = ss.show_id " +
        "join type as t on ss.type_id = t.id " +
        "where t.id in (" + stringIDs + ")";

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
            console.log("retrieved rows -> ", result);
             cb(null, result.rows);
        });
    });   
}

module.exports = db;
