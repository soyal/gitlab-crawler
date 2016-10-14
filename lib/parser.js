var $ = require("cheerio");

exports.parse = function(root,selector){

    var results = $(selector,root);

    var args = Array.prototype.slice.call(arguments,2);

    for(var i = 0, len = args.length; i < len; i++){

        results = results.find(args[i]);

    }

    return results;

}