
const app = require("../app");
const pool = require('../pool');

app.get('/api/highscore', function (req, res) {
	const params = req.body;

	var query = "select p.name, md.value from player p join player_metadata md on p.name = md.player where md.attr = 'xp' order by md.value::int desc limit 10"

	pool
	.query(query)
	.then(result => {
		res.json(result.rows);
	})
	.catch(e => {
		res.status(500).end()
	});

});
