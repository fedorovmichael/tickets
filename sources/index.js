
var titles = require('./titles.json');

exports.getTitleByTypeName = function(typeName)
{
    if(!titles["titles"][typeName])
    {
        throw new Error("Not exitst title -> " + typeName);
    }
    
    return titles["titles"][typeName];
};

