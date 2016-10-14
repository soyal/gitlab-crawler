
exports.notice = function(msg){

    var msgArr = Array.prototype.slice.call(arguments);

    msgArr.unshift("> [NOTICE] ");

    msgArr.push("\n");

    console.log(msgArr.join(""));

}

exports.error = function(msg){

    var msgArr = Array.prototype.slice.call(arguments);

    msgArr.unshift("> [ERROR] ");

    msgArr.push("\n");

    console.log(msgArr.join(""));

    process.exit(1);

}