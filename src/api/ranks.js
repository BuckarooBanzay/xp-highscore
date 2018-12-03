
const app = require("../app");
const fs = require('fs');


var file = fs.readFileSync("world/ranks.json", "utf-8");
var ranks = JSON.parse(file);

app.get('/api/ranks', function (req, res) {
	res.json(ranks);
});