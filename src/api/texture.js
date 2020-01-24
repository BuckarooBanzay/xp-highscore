const app = require("../app");
const fs = require('fs');

const file_map = {};
var texture_count = 0;

//https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      var filename = file;
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
	if (filename[0] === "."){
            next();

        } else if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });

        } else {
		if (file.match(".*png") || file.match(".*jpg$")){
			file_map[filename] = file;
			texture_count++;
			results.push(file);
		}
		next();
        }
      });
    })();
  });
};

walk("world/worldmods", (err) => {
	if (err) console.log(err);
	console.log("Indexed " + texture_count + " textures");
});

app.get('/api/texture/:name', function (req, res) {
	var fullname = file_map[req.params.name];
	if (fullname === undefined)
		return res.status(404).end();

	fs.readFile(fullname, (err, buffer) => {
		if (err){
			console.log(err);
			res.status(500).end();
		} else {
			var contentType = "application/binary";
			if (fullname.match(".*png$")) contentType = "image/png";
			else if (fullname.match(".*jpg$")) contentType = "image/jpg";

			res.header("Content-Type", contentType).send(buffer);
		}
	});
});
