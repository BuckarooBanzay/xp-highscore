(function(){

	var score = [];

	var HighscoreRows = {
		view: function(){
			var rows = [];
			var ranking = 1;

			score.forEach(function(player){

				var time_diff = moment(moment()).diff(player.modified);
				var last_login = moment.duration(time_diff).humanize();
				var is_online = time_diff < 30000;

				var state = m("span", {class: "badge badge-" + (is_online?"success":"danger")}, is_online?"Online":"Offline");

				rows.push(m("tr", [
					m("td", ranking++),
					m("td", player.name),
					m("td", player.xp),
					m("td", player.attributes.digged_nodes),
					m("td", player.attributes.crafted),
					m("td", player.attributes.placed_nodes),
					m("td", player.attributes.died),
					m("td", player.attributes.played_time ? moment.duration(+player.attributes.played_time, "seconds").humanize() : ""),
					m("td", last_login),
					state
				]));

			});

			return m("tbody", rows);
		}
	};

	var Table = m("table", {class:"table table-condensed table-striped"}, [
		m("thead", [
			m("tr", [
				m("th", "Ranking"),
				m("th", "Name"),
				m("th", "XP"),
				m("th", "Dig-count"),
				m("th", "Craft-count"),
				m("th", "Build-count"),
				m("th", "Death-count"),
				m("th", "Play-time"),
				m("th", "Last login"),
				m("th", "Status")
			])
		]),
		m(HighscoreRows)
	]);

	function update(){
		m.request("api/highscore")
		.then(function(s){
			score = s;

			m.render(document.getElementById("app"), [
				Table
			]);
		});
	}

	update();

	setInterval(update, 2000);

})();
