var crawler = require("./lib/crawler"),

    parser = require("./lib/parser"),

    $ = require("cheerio"),

    log = require("./lib/log");


crawler.get("https://git.zhubajie.la/fe/fis-common/tree/master/widget/ui/components",

        function(err,res){

            if(err) {

                throw new Error(err);

            }

            log.notice("get response, status : ",res.statusCode);

            if(res.statusCode >= 200 && res.statusCode <= 304) {

                var projects = parser.parse(res.text,".tree-item-file-name",".str-truncated");

                log.notice(`find projects : ${projects.length}`);

                var names = [];

                projects.each(function(){

                    names.push($(this).html());

                });

                crawler.getAll("https://git.zhubajie.la/fe/fis-common/commits/master/widget/ui/components/",
                    names
                );

            }

        });