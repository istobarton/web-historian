var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  var urls;

  //add to urls Array
  fs.readFile(exports.paths.list, function(err, data){
    // data === "example1.com'\n'example2.com"
    urls = data.toString().split("\n");
    callback(urls);
  })

  return urls;
};

exports.isUrlInList = function(url, callback){
  fs.readFile(exports.paths.list, function(err, data) {
    var urls = data.toString().split("\n");
    for(var i = 0; i < urls.length; i++) {
      if(urls[i] === url) {
        callback(true);
        return true;
      }
    }
    callback(false);
    return false;
  })
};

exports.addUrlToList = function(url, callback) {
  if(exports.isUrlInList(url, function() {})) {
    callback();
    return;
  } else {
    fs.appendFile(exports.paths.list, url + '\n', function(err) {
      if (err) throw err;
      callback();
    });
  }
};

exports.isUrlArchived = function(url, callback) {
  fs.readFile(exports.paths.archivedSites + '/' + url, function(err,data) {
    if(err) {
      callback(false);
    } else {
      callback(true);
    }
  });

};

exports.downloadUrls = function(urlsArray) {
  urlsArray.forEach(function(url){
    http.get("http://" + url, function(res) {
      var str = "";
      res.on('data', function(chunk) {
        str += chunk;
      })
      res.on('end', function() {
        fs.writeFile(exports.paths.archivedSites + "/" + url, str, function(err){
          if (err) throw err;
        })
      })
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  })
};










