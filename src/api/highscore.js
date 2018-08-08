
const app = require("../app");
const pool = require('../pool');

app.get('/api/highscore', function (req, res) {
	const params = req.body;

	var offset = 0;
	var sort = "xp";
	
	if (req.query) {
		if (req.query.start){
			var o = parseInt(req.query.start);
			if (o && o > 0)
				offset = o;
		}

		if (req.query.sort){
			sort = req.query.sort;
		}
	}

	var query = "select p.name, p.modification_date, p.creation_date, md.value from player p";
	query += " join player_metadata md on p.name = md.player";
	query += " where md.attr = $1 order by md.value::int desc limit 10 offset " + offset;

	pool
	.query(query, [sort])
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
			//sethome:home
			//"homedecor:player_skin"
			//const FIELDS = ["crafted", "placed_nodes", "died", "digged_nodes", "xp", "played_time"]
			var subquery = "select attr, value from player_metadata where player = $1";
			subquery += " and attr in('crafted', 'placed_nodes', 'died', 'digged_nodes', 'xp', 'played_time', 'homedecor:player_skin')";


			return pool.query(subquery, [row.name])
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
		console.error(e);
		res.status(500).end();
	});

});
