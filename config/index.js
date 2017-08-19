
var config;

exports.loadConfig = function()
{
    config = require('./config.json');
};

exports.getConfig = function(type, name)
{
    if(!config[type][name])
    {
        throw new Error("Not exitst configuration -> " + name);
    }

    return config[type][name];
};

