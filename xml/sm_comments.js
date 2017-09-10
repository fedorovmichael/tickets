var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var appConfig = require("../config/index.js");
var dateFormat = require('dateformat');
var sm = {};

appConfig.loadConfig();

sm.updateSiteMap = function(showCode, callback){

    var site_map_path = appConfig.getConfig("urls", "site_map_path") + '/sitemap.xml';

    if (!fs.existsSync(site_map_path)) {
        var err = "updateSiteMap -> file not exists by path: " + site_map_path;
        callback(err, null);
        return;
    }

    xmlFileToJs(site_map_path, function (err, obj) {
    
        if (err)
        { 
            console.log("xmlFileToJs error: ", err);
            throw (err);
        }

        var arrSatemap = ''; 
        var jsonSMData = '';
        var baseUrl = appConfig.getConfig("urls", "base_url");       

        if(obj != null && obj.urlset != null && obj.urlset.url != null)
        {
            arrSatemap = obj.urlset.url;
            var url = baseUrl + "/comment/"+ showCode;            
            var index = -1, existsLoc = false;            

            for(var i=0; i < arrSatemap.length; i++)
            {
                var loc = arrSatemap[i].loc.toString();
                index = arrSatemap.findIndex(x => x.loc.toString() === url);      
                jsonSMData += '{"loc":"' + loc + '", "lastmod":"' + dateFormat(new Date(), "isoUtcDateTime") + '", "priority": "0.5", "changefreq": "hourly"},';           
                
                if(index != -1){
                    existsLoc = true;
                }
            }

            if(!existsLoc){
               jsonSMData += '{"loc":"' + url + '", "lastmod":"' + dateFormat(new Date(), "isoUtcDateTime") + '", "priority": "0.5", "changefreq": "hourly"},';
            }                    
        }

        jsonSMData = jsonSMData.substring(0, jsonSMData.length - 1);

        var jsonFullSM = '{"urlset": { "$":{ "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9" }, "url":['+ jsonSMData +'] }}';

       // console.log("json +++++++++++++++++++++++++++++++++++++++++++++");
       // console.log(jsonFullSM);

        var objSM = JSON.parse(jsonFullSM);

        jsToXmlFile(site_map_path, objSM, function (err) {
            if (err){ console.log("jsToXmlFile error: ", err); callback(err, null);}
            else{ callback(null, true); }
        });  
    });
}

function xmlFileToJs(filepath, cb) {    
    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
        if (err)
        {
            console.log("xmlFileToJs error: ", err);
            throw (err);
        }         
        xml2js.parseString(xmlStr, {}, cb);
    });    
}

function jsToXmlFile(filepath, obj, cb) {    
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.writeFile(filepath, xml, cb);
}


module.exports = sm;