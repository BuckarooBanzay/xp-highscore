
const app = require("../app");
const pool = require('../pool');

module.exports = function(name){
	var subquery = "select attr, value from player_metadata where player = $1";
	subquery += " and attr in('crafted', 'placed_nodes', 'died', 'digged_nodes', 'xp', 'played_time', 'punch_count', 'inflicted_damage', 'homedecor:player_skin')";


	return pool.query(subquery, [name])
	.then(result => {
		var res = {};
		result.rows.forEach(row => res[row.attr] = row.value);
		res.name = name;

		return res;
	})
	.catch(e => console.error(e));
}