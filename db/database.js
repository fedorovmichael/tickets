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
        //var queryDB = "SELECT * FROM type";
        var queryDB = "SELECT * FROM html_sources where id='type';";
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
                //console.log("retrieved rows -> ", result.rows);
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
       var queryDB ="select distinct sh.id as show_id, sh.name as name, sh.announce as announce, sh.price_min, sh.price_max, " +
        " sh.date_from, sh.date_to, sh.resource, sh.main_image, sh.top, sh.show_code, sh.main_image_name, t.id as type_id, " +
        " t.name as type_name, t.color as type_color, st.id as subtype_id, st.name as subtype_name " + 
        " from shows as sh " +
        " join show_section as ss on sh.id = ss.show_id " +
        " join type as t on t.id = ss.type_id " +
        " join subtype as st on st.id = ss.subtype_id " +
        " where top = '1' and enabled = true  and date_to > now() - interval '1 DAY' " +
        " order by price_min desc "
        
        
        console.log("connect to db");
        console.log("query get shows: ", queryDB);
        
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

        var where = " where s.enabled = true and date_to > now() - interval '1 DAY' ";

        if(stringIDs.length > 2)
        {
            where =+ " t.id in (" + stringIDs + ")";
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

db.getShowByShowID = function(showID, showCode, cb)
{
    try 
    {
        console.log("db.getShowByShowID id: ", showID);
        console.log("db.getShowByShowID show code: ", showCode);

        var queryWhere = '';

        if(showID != null && showID != '')
        {
            queryWhere = "where enabled = true and date_to > now() - interval '1 DAY' and id = '"+ showID +"'";
        }        
        else if(showCode != null && showCode != '')
        {
            queryWhere = "where enabled = true and date_to > now() - interval '1 DAY' and show_code = '"+ showCode +"'";
        }

        var queryDB = "select id, name, announce, main_image, second_image, resource, show_code, no_date from shows " + queryWhere;
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

        var queryDB = "select city, date, seance_time, tickets, price_min, price_max, hall, link, id, resource " +
        " from seances where show_code = '"+ showID +"' and resource != 'bravo' order by date asc;"
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

        var queryDB = "select id, link, type from media where show_code = '"+ showID +"';"
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
                      "where s.enabled = true and date_to > now() - interval '1 DAY' and s.name like '%"+ searchText +"%' or s.announce like '%"+ searchText +"%' or se.hall like '%" + searchText + "%';";

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
       var queryDB = "select id as subtype_id, name, type_id, link  from subtype";
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
         var queryDB = "SELECT * FROM html_sources where id='cities';";
         getMultipleResponse(cb, queryDB);

    //    var resultCities = []; 
    //    var regionQueryDB = "select distinct region from cities order by region asc";
    //    var citiesQueryDB = "select distinct c.id, c.name, c.region from cities as c join seances as s on c.name = s.city order by c.name asc";

    //    async.series([
    //        function getRegionsFromDB(callback)
    //        { 

    //             pool.connect(function(err, client, done){
    //                 if(err)
    //                 {
    //                     console.error("connection error -> " + err);
    //                 }
    //                 else
    //                 {
    //                     console.log("success connec to db");
    //                 }

    //                 client.query(regionQueryDB, function(err, result){
    //                     done();
    //                     if(err)
    //                     {
    //                         console.error("send query error -> ", err);
    //                         callback(err, null);
    //                         return;
    //                     }
    //                     //console.log("retrieved rows -> ", result);
    //                     callback(null, result.rows);
    //                 });
    //             }); 
    //        },

    //        function getCitiesFromDB(callback){
    //              pool.connect(function(err, client, done){
    //                 if(err)
    //                 {
    //                     console.error("connection error -> " + err);
    //                 }
    //                 else
    //                 {
    //                     console.log("success connec to db");
    //                 }

    //                 client.query(citiesQueryDB, function(err, result){
    //                     done();
    //                     if(err)
    //                     {
    //                         console.error("send query error -> ", err);
    //                         callback(err, null);
    //                         return;
    //                     }
    //                     //console.log("retrieved rows -> ", result);
    //                     callback(null, result.rows);
    //                 });
    //             });
    //        }
    //    ], 
    //    function(err, result){
    //        if(err)
    //        {
    //            console.log("get cities error: ", err);
    //            cb(err, null);
    //        }

    //        for(var i = 0; i < result[0].length; i++)
    //        {
    //            var regionCities = {};
    //            var arrCities = [];
    //            for(var c = 0; c < result[1].length; c++)
    //            {
    //                if(result[0][i].region == result[1][c].region)
    //                {
    //                   // console.log("added city: ",  result[1][c].name);
    //                   // console.log("");
    //                    arrCities.push(result[1][c]);
    //                }
    //            }

    //            var regionCities = {regionName: result[0][i].region, cities: arrCities };
    //            resultCities.push(regionCities);               
    //        }

    //        cb(null, resultCities);
    //    });    
    } 
    catch (error) {
        console.log("db.getCities error: ", error);
    }
}

db.getShowsByFilters = function(filters, cb)
{
    try 
    {
        var queryFiters = '', querySort = '', queryTempTable = '', queryDropTempTable = '', queryTypeSubType = '';     

        console.log(""); 
        console.log("start get data by filter: ", filters);
        console.log("");

        if(filters.types != null || filters.subtypes != null )
        {
            queryTempTable = "" +            
            " create table t_types as select show_id from show_section where type_id in ("+ filters.types +"); " +
            " create table t_subtypes as select show_id from show_section where subtype_id in ("+ filters.subtypes +"); " +            
            " create table t_shows as (select show_id from t_types union select show_id from t_subtypes); ";

            if(filters.types != null)
            {
                queryTypeSubType += filters.subtypes != null ? " and (t.id in ("+ filters.types +") " : " and t.id in ("+ filters.types +") ";
            }

            if(filters.subtypes != null)
            {
                queryTypeSubType += filters.types != null ? "or st.id in ("+ filters.subtypes +")) " : " and st.id in ("+ filters.subtypes +") ";
            }

            queryFiters += " and sh.id in (select show_id from t_shows) " + queryTypeSubType;
            queryDropTempTable = "drop table t_types; drop table t_subtypes; drop table t_shows; ";            

        }

        if(filters.cities != null)
        {
            queryFiters += " and c.id in ("+ filters.cities +")";
        }        

        if(filters.dates != null)
        {
            var datesFilter = '';

            for(var i = 0; i < filters.dates.length; i++)
            {
                if(filters.dates[i].fDate != "")
                {
                    if(filters.dates.length > 1 && i <= filters.dates.length - 1 && i > 0)
                    {                                    
                      datesFilter += " or (s.date >= '" + filters.dates[i].fDate + "'";
                    }
                    else
                    {                        
                        if(filters.dates.length > 1)
                        {
                            datesFilter += " and ((s.date >= '" + filters.dates[i].fDate + "'";
                        }                        
                        
                        else
                        {
                            if(filters.dates[i].tDate != "")
                            {                          
                              datesFilter += " and (s.date >= '" + filters.dates[i].fDate + "'";
                            }
                            else
                            {
                              datesFilter += " and s.date >= '" + filters.dates[i].fDate + "'";  
                            }
                        }
                    }
                }
                
                if(filters.dates[i].tDate != "")
                {
                  if(filters.dates[i].fDate != "")
                  {  
                    datesFilter += " and s.date <= '" + filters.dates[i].tDate + "')";
                  }
                  else
                  {
                    datesFilter += " and s.date <= '" + filters.dates[i].tDate+ "'";
                  } 
                }               
            }

            if(datesFilter.indexOf('or') != -1)
            {
                queryFiters += datesFilter + ")";
            }
            else
            {
                queryFiters += datesFilter;
            }

        }

        if(filters.searchText != null)
        {
            queryFiters += " and (LOWER(sh.name) like '%"+ filters.searchText.toLowerCase() +"%' or LOWER(sh.announce) like '%"+ filters.searchText.toLowerCase() +"%')";
        }

        if(filters.superPrice)
        {
            queryFiters += " and sh.superprice = '"+ filters.superPrice +"'";
        }

        if(filters.discount)
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

        if(filters.sortBySection != null)
        {
            querySort += " order by type_name " + filters.sortBySection;
        }

        if(filters.minPrice != null)
        {
            queryFiters += " and sh.price_min >= '" + filters.minPrice + "'";
        }

        if(filters.maxPrice != null)
        {
            queryFiters += " and sh.price_min <= '" + filters.maxPrice + "'";
        }
        
        console.log(""); 
        console.log("filter: ", queryFiters);
        console.log("sort filter: ", querySort);
        console.log("");

        if(queryFiters == "")
        {
            queryFiters += "and sh.top = '1'";
        }

        var queryDB = queryTempTable +" "+
        " select distinct sh.id as show_id, sh.name as name, sh.announce as announce, sh.price_min, sh.price_max, sh.date_from, sh.date_to, sh.resource, sh.main_image, sh.top, sh.show_code, sh.no_date, sh.main_image_name, " +
        " t.id as type_id, t.name as type_name, t.color as type_color, st.id as subtype_id, st.name as subtype_name, ss.subcategory_name " +
        "from shows as sh " +
        "join seances as s on  sh.show_code = s.show_code " +
        "join cities as c on s.city = c.name " +
        "join show_section as ss on ss.show_id = sh.id " +
        "join type as t on t.id = ss.type_id " +
        "join subtype as st on st.id = ss.subtype_id " +
        " where sh.enabled = true and date_to > now() - interval '1 DAY' " +
        queryFiters +" "+ querySort +"; "+ queryDropTempTable;

        console.log("db.getShowsByFilters", queryDB);

        getMultipleResponse(cb, queryDB);  
    }
    catch (error) 
    {
       console.log("db.getShowsByFilters error: ", error);
    }
}

db.getAgencesShows = function(cb)
{
    try
    {
       var queryDB = "select distinct sh.id as show_id, sh.name as name, sh.announce as announce, sh.price_min, sh.price_max, sh.date_from, sh.date_to, sh.resource, sh.main_image, t.name as type_name, sh.top, sh.show_code, " +
       " t.id as type_id, t.name as type_name, t.color as type_color, st.id as subtype_id, st.name as subtype_name, ss.subcategory_name " +  
       "from agences_shows as ash " +
       "join shows as sh on ash.show_name = sh.name " +
       "join show_section as ss on ss.show_id = sh.id " +
       "join type as t on t.id = ss.type_id " +
       "join subtype as st on st.id = ss.subtype_id " +
       "where ash.enabled = true and sh.enabled = true and date_to > now() - interval '1 DAY'";

       getMultipleResponse(cb, queryDB);
    } 
    catch (error) {
        console.log("db.getAgencesShows error: ", error);
    }
}

db.getRecommendShowByShowID = function(showID, cb)
{
    try 
    {
        console.log("db.getRecommendShowByShowID show id: ", showID);    

        var queryDB = "select s.name, s.show_code, s.main_image, s.no_date, main_image_name from shows as s " + 
        "join show_section as ss on s.id = ss.show_id " +
        "where ss.type_id in (select type_id from show_section where show_id = '" + showID + "') " +
        "and show_id != '" + showID + "' and s.enabled = true and date_to > now() - interval '1 DAY' " +
        "order by price_max desc " +
        "limit 5 "
        getMultipleResponse(cb, queryDB);
    } 
    catch (error) 
    {
        console.log("db.getRecommendShowByShowID error: ", error);    
    }
}

db.getPosts = function(cb)
{
    try 
    {
       console.log("getPosts connect to db");       
       var queryDB ="select * from posts where enabled = true order by pub_date desc;";     
       getMultipleResponse(cb, queryDB);      
    } 
    catch (error) 
    {
        console.log("getPosts error : ", error);
    }
}

db.getPostByID = function(postID, cb)
{
     try 
    {
       console.log("getPostByID connect to db");       
       var queryDB ="select * from posts where id='" + postID + "'";     
       getMultipleResponse(cb, queryDB);      
    } 
    catch (error) 
    {
        console.log("getPostByID error : ", error);
    }
}

db.getPostImagesByPostID = function(postID, cb){
    try 
    {
       console.log("getPostImagesByPostID connect to db");       
       var queryDB ="select * from post_media where post_id='" + postID + "'";     
       getMultipleResponse(cb, queryDB);      
    } 
    catch (error) 
    {
        console.log("getPostImagesByPostID error : ", error);
    }
}

db.addSubscription = async (subscriber) => {
    console.log("addSubscription connect to db");    
    let queryDB = "INSERT INTO subscribers(id, email, active) VALUES($1, $2, $3)";    
    let queryDBParams = [subscriber.id, subscriber.email, subscriber.active];
    let result = await getAsyncResponse(queryDB, queryDBParams);
    console.log("db.addSubscription", result);
    return result;    
} 

db.removeSubscription = async (email, active) => {
    console.log("removeSubscription email: ", email);
    console.log("removeSubscription connect to db");       
    let queryDB ="update subscribers set active = "+ active +" where email = '"+ email +"'";    
    let result = await getAsyncResponse(queryDB, null);
    return result; 
}

db.searchSubscription = async (email) => {
    console.log("db.searchSubscription email: ", email);
    console.log("db.searchSubscription connect to db");       
    let queryDB =" select * from subscribers where email = '"+ email +"'";    
    let result = await getAsyncResponse(queryDB, null);
    return result.rows;
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
            //console.log("retrieved result -> ", result);
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
            //console.log("retrieved rows -> ", result);//console.log("retrieved rows -> ", result);
             cb(null, result.rows);
        });
    });   
}

async function getAsyncResponse(queryDB, queryParams)
{
    const client = await pool.connect();
    let res;
    try {
        res = await client.query(queryDB, queryParams);
    } 
    catch (error) {
        //console.error("send query, params ->  ", queryDB, queryParams);
        console.error("send query error -> ", error);
    } 
    finally{
        client.release();
    }
    return res; 
}


module.exports = db;
