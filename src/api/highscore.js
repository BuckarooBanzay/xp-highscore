
const app = require("../app");
const pool = require('../pool');

const getplayerattributes = require("../util/getplayerattributes");

app.get('/api/highscore', function (req, res) {

	var offset = 0;

	var attrJoinColumn = "xp";
	var orderColumn = "md.value::real";
	var sortOrder = "desc";
	
	if (req.query) {
		offset = parseInt(req.query.start) || 0;
		if (req.query.order == "asc")
			sortOrder = "asc";

		if (req.query.sort){
				if (req.query.sort == "xp"){
					//default
				} else if (req.query.sort == "digged_nodes"){
					attrJoinColumn = req.query.sort;
				} else if (req.query.sort == "crafted"){
					attrJoinColumn = req.query.sort;
				} else if (req.query.sort == "placed_nodes"){
					attrJoinColumn = req.query.sort;
				} else if (req.query.sort == "died"){
					attrJoinColumn = req.query.sort;
				} else if (req.query.sort == "punch_count"){
					attrJoinColumn = req.query.sort;
				} else if (req.query.sort == "inflicted_damage"){
					attrJoinColumn = req.query.sort;
				} else if (req.query.sort == "played_time"){
					attrJoinColumn = req.query.sort;
				} else if (req.query.sort == "online"){
					attrJoinColumn = "xp";
					orderColumn = "p.modification_date";
				} else if (req.query.sort == "joined"){
					attrJoinColumn = "xp";
					orderColumn = "p.creation_date";
				}
		}
	}

	var query = "select p.name, p.modification_date, p.creation_date, md.value from player p";
	query += " join player_metadata md on p.name = md.player";
	query += " where md.attr = $1 order by " + orderColumn + " " + sortOrder + " limit 10 offset " + offset;

	pool
	.query(query, [attrJoinColumn])
	.then(result => {

		var score = [];
		result.rows.forEach(row => score.push({
				name: row.name,
				created: row.creation_date,
				modified: row.modification_date
			}
		));

		var promises = result.rows.map(row => {
			return getplayerattributes(row.name)
			.then(attrs => {
				var entry = score.find(s => s.name == row.name);
				entry.attributes = attrs;
				return attrs;
			});
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
