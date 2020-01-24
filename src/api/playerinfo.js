
const app = require("../app");
const pool = require('../pool');

const getplayerattributes = require("../util/getplayerattributes");

app.get('/api/playerinfo', function (req, res) {
	if (req.query && req.query.name){

		var query = "select p.name, p.modification_date, p.creation_date from player p";
		query += " where p.name = $1::text";

		pool
		.query(query, [req.query.name])
		.then(result => {
			if (result.rows.length == 0){
				res.status(404).end();
				return;
			}

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
