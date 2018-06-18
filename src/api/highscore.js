
const app = require("../app");
const pool = require('../pool');

app.get('/api/highscore', function (req, res) {
	const params = req.body;

	var query = "select p.name, p.modification_date, p.creation_date, md.value from player p join player_metadata md on p.name = md.player where md.attr = 'xp' order by md.value::int desc limit 10"

	pool
	.query(query)
	.then(result => {

		var score = [];
		result.rows.forEach(row => score.push({
				name: row.name,
				xp: +row.value,
				created: row.creation_date,
				modified: row.modification_date
			}
		));

		var promises = result.rows.map(row => {
			return pool.query("select attr, value from player_metadata where player = $1", [row.name])
			.then(result => {
				var res = {};
				result.rows.forEach(row => res[row.attr] = row.value);
				res.name = row.name;

				var entry = score.find(s => s.name == row.name);
				entry.attributes = res;
				return res;
			})
			.catch(e => console.error(e));
		});

		return Promise.all(promises)
		.then(result => score)
		.catch(e => console.error(e));
	})
	.then(result => res.json(result))
	.catch(e => {
		consoler.error(e);
		res.status(500).end();
	});

});
