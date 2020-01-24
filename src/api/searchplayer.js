
const app = require("../app");
const pool = require('../pool');

app.get('/api/searchplayer', function (req, res) {
	if (req.query && req.query.name){

		var query = "select p.name, p.modification_date, p.creation_date, md.value as xp from player p";
		query += " join player_metadata md on p.name = md.player";
		query += " where p.name like $1::text and md.attr = 'xp' limit 50";

		pool
		.query(query, ["%" + req.query.name + "%"])
		.then(result => {
			res.json(result.rows);
		});

	} else {
		res.status(200).end();
	}
});
