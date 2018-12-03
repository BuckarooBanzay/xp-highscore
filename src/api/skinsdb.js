
const app = require("../app");
const fs = require('fs');



app.get('/api/skinsdb', function (req, res) {
	var file = fs.readFileSync("world/mod_storage/skinsdb", "utf-8");
	var skinsdb = JSON.parse(file);
	res.json(skinsdb);
});