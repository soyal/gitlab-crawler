var request = require("superagent"),

    config = require("../config.json"),

    parser = require("./parser"),

    $ = require("cheerio"),

    log = require("./log");

var THRESHOLD = 1000 * 60 * 60 * 24 * 60,    //两个月(毫秒)

    pattern = /\d+-\d+-\d+\s*\d+\:\d+\:\d+/;    //匹配结果2016-08-30 14:03:49


exports.get = function(url,callback){

    request.get(url)

        .set("Accept",config["Accept"])

        .set("Accept-Encoding",config["Accept-Encoding"])

        .set("Accept-Language",config["Accept-Language"])

        .set("Cache-Control",config["Cache-Control"])

        .set("Connection",config["Connection"])

        .set("Cookie",config["Cookie"])

        .set("Host",config["Host"])

        .set("Pragma",config["Pragma"])

        .set("User-Agent",config["User-Agent"])

        .end(callback);

};

exports.getAll = function(rootUrl,names,inclue) {

    var promises = [],      //promise array

        results = [];       //返回的所有结果Array<Object>

    names.forEach(function(e,i,arr){

        promises.push(new Promise(function(resolve,reject){

            request.get(rootUrl + e)

                .set("Accept",config["Accept"])

                .set("Accept-Encoding",config["Accept-Encoding"])

                .set("Accept-Language",config["Accept-Language"])

                .set("Cache-Control",config["Cache-Control"])

                .set("Connection",config["Connection"])

                .set("Cookie",config["Cookie"])

                .set("Host",config["Host"])

                .set("Pragma",config["Pragma"])

                .set("User-Agent",config["User-Agent"])

                .end(function(err,res){

                    if(err) {

                        reject(err);

                        return;

                    }

                    resolve(res);

                })

            }).then(function(res){

                results.push({
                    name : e,
                    value : getItems(res.text,".commit",".commit-row-message")
                });

            },function(err){

                log.error(err);

            })
        );

    });

    log.notice("start get data...");

    Promise.all(promises).then(function(){

        log.notice("get data complete!");

        //排序
        results.sort(function(e1,e2){

            return e2.value.length - e1.value.length;

        });

        results.forEach(function(e,i,arr){

            log.notice(`name : ${e.name},count : ${e.value.length}`);

        });

    },function(err){

        log.error(err);

    })

};

/**
 * 返回两个月(60天)以内的条目
 * @return {[Array]} [description]
 */
function getItems(){

    var commits = parser.parse.apply(null,arguments);

    var results = [];

    commits.each(function(){

        results.push($(this).text());

    })    

    var newArr = results.filter(function(e,i,arr){

        var time = pattern.exec(e)&&pattern.exec(e)[0];

        var diff = (new Date()).getTime() - (new Date(time)).getTime();

        return diff < THRESHOLD;

    })

    return newArr;
}