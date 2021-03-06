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

db.createComment = function(comment, cb){

    try 
    {
        console.log("");
        console.log("db.createComment comments parameters: ");
        console.log(comment);
        console.log("");
        
        var commQueryDB = "insert into comments(id,text,avatar,publish_date,name,host,email,status,show_code, parent_id) values" +
                    "('"+ comment.id +"', '"+ comment.text +"','"+ comment.avatar +"','"+ comment.publish_date +"'," +
                    "'"+ comment.name +"', '"+ comment.host +"', '"+ comment.email +"', '"+ comment.status +"', '"+ comment.showCode +"', '"+ comment.parentID +"');";

        console.log("create comment queryDB: ", commQueryDB);
        getMultipleResponse(cb, commQueryDB);
    } 
    catch (error) 
    {
        console.log("db.createComment error: ", error);    
    }
}

db.getCommentsByShowCode = function(showCode, cb){

    try 
    {
        console.log("db.getCommentsByShowCode show code: ", showCode);      
        var queryDB = "select sh.name as show_name, sh.announce, com.* from comments as com " +
        " join shows as sh on com.show_code = sh.show_code " +
        " where com.show_code = '" + showCode + "' and com.status = 'show'";        
        console.log("comments query: ", queryDB);
        getMultipleResponse(cb, queryDB);
    } 
    catch (error) 
    {
        console.log("db.getCommentsByShowCode error: ", error);    
    }
}

db.getCommentsCount = function(cb){    
        try 
        {            
            var queryDB = "select show_code, count(show_code) from comments where status = 'show' group by show_code";        
            console.log("getCommentsCount comments query: ", queryDB);
            getMultipleResponse(cb, queryDB);
        } 
        catch (error) 
        {
            console.log("db.getCommentsCount error: ", error);    
        }
    }

function getSingleResponse(cb, queryDB)
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
            console.log("retrieved result -> ", result);
            cb(null, result);
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