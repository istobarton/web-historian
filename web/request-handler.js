var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs')
var querystring = require('querystring')
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.method === 'GET') {
    if(req.url === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
        if(err) throw err;
        res.end(data);
        //console.log(data);
      });
    } else {
      var requestedUrl = req.url.slice(1);
      archive.isUrlArchived(requestedUrl, function(found) {
        if(found === true) {
          fs.readFile(archive.paths.archivedSites + '/' + requestedUrl, function(err, data) {
            res.end(data);
          })
        } else {
          res.writeHead(404);
          res.end();
        }
      })
    }
  } else if(req.method === 'POST'){
    console.log(req._events);
    console.log(req.url);
    var str = "";
    req.on('data', function(chunk) {
      str += chunk;
    })
    req.on('end', function() {
      archive.addUrlToList(str.slice(4), function(){
        res.writeHead(302);
        fs.readFile(archive.paths.siteAssets + '/loading.html', function(err, data) {
          if(err) throw err;
          res.end(data);
          //console.log(data);
        });
      })
    })
  }
};
