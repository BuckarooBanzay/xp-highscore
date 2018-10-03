
const app = require("../app");
const pool = require('../pool');

const getplayerattributes = require("../util/getplayerattributes");

app.get('/api/playerinfo', function (req, res) {
	const params = req.body;


	if (req.query && req.query.name){

		var query = "select p.name, p.modification_date, p.creation_date from player p";
		query += " where p.name = $1::text";

		pool
		.query(query, [req.query.name])
		.then(result => {
			if (!result.rows)
				res.stats(404).end;

			const row = result.rows[0];

			const player = {
				name: row.name,
				created: row.creation_date,
				modified: row.modification_date
			};

			getplayerattributes(req.query.name)
			.then(attrs => {
				player.attributes = attrs;
				res.json(player);
			});
		});

	} else {
		res.status(200).end();
	}
});