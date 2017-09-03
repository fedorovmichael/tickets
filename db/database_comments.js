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

        var queryDB = "insert into comments(id,text,avatar,publish_date,name,host,email,status,show_id) values" +
                    "('"+ comment.id +"', '"+ comment.text +"','"+ comment.avatar +"','"+ comment.publish_date +"'," +
                    "'"+ comment.name +"', '"+ comment.host +"', '"+ comment.email +"', '"+ comment.status +"', '"+ comment.showID +"')";

        console.log("create comment queryDB: ", queryDB);
        getMultipleResponse(cb, queryDB);
    } 
    catch (error) 
    {
        console.log("db.createComment error: ", error);    
    }
}

db.getCommentsByShowID = function(showID, cb){

    try 
    {
        console.log("db.getCommentsByShowID show id: ", showID);      
        var queryDB = "select * from comments where show_id = '" + showID + "'";
        getMultipleResponse(cb, queryDB);
    } 
    catch (error) 
    {
        console.log("db.getCommentsByShowID error: ", error);    
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