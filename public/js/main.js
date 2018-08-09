(function(){

	var state = {
		score: [],
		start: 0,
		ranks: [],
		sort: "xp",
		order: "desc",
		busy: false
	};

	function numberWithCommas(x){
		if (x == undefined)
			return "";
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
	}

	//get ranks (already ordered ascending)
	m.request("js/ranks.json")
	.then(function(ranks){ state.ranks = ranks });

	function getRank(xp){
		var currentRank = null;

		for (var i=0; i<state.ranks.length; i++){
			var rank = state.ranks[i];

			if (rank.xp > xp)
				break;

			currentRank = rank;
		}

		return currentRank;
	}

	function getPlayerImage(player){
		var homedecor_skin = player.attributes["homedecor:player_skin"];
		if (homedecor_skin) {
			return "img/homedecor/" + homedecor_skin.split(".")[0] + "_preview.png";
		} else {
			return "img/sam.png"
		}
	}

	function update(){
		state.busy = true;
		m.request("api/highscore?start=" + state.start + "&sort=" + state.sort + "&order=" + state.order)
		.then(function(score){
			state.score = score;
			state.busy = false;
		});
	}

	function next(){
		state.start += 10;
		update();
	}

	function previous(){
		state.start = Math.max(state.start - 10, 0);
		update();
	}

	function makeSortButton(column){
		var classNameAsc = "btn ";
		var classNameDesc = "btn ";

		if (state.sort == column){
			if (state.order == "asc"){
				classNameAsc += "btn-primary";
				classNameDesc += "btn-secondary";
			} else {
				classNameDesc += "btn-primary";
				classNameAsc += "btn-secondary";
			}
		} else {
			classNameDesc += "btn-secondary";
			classNameAsc += "btn-secondary";
		}

		function asc(){
			state.sort = column;
			state.order = "asc";
			update()
		}
		function desc(){
			state.sort = column;
			state.order = "desc";
			update()
		}

		return m("div", {class: "btn-group"}, [
			m("button", {class: classNameDesc, onclick: desc}, m("i", {class: "fas fa-sort-amount-up"})),
			m("button", {class: classNameAsc, onclick: asc}, m("i", {class: "fas fa-sort-amount-down"}))
		])
	}

	var NextButton = {
		view: function(){
			var loadClass = "fas ";

			if (state.busy)
				loadClass += "fa-spinner fa-spin";
			else
				loadClass += "fa-check";

			return m("div", {class:"btn-group"}, [
				m("button", {class:"btn btn-secondary btn-lg", onclick: previous}, [
					m("i", {class:"fas fa-step-backward"}),
					" Previous"
				]),
				m("button", {class: "btn btn-secondary btn-lg"}, [
					m("i", {class: loadClass})
				]),
				m("button", {class:"btn btn-secondary btn-lg", onclick: next}, [
					"Next ",
					m("i", {class:"fas fa-step-forward"})
				])
			]);
		}
	}

	var HighscoreRows = {
		view: function(){
			var rows = [];
			var ranking = state.start + 1;

			state.score.forEach(function(player){

				var time_diff = moment(moment()).diff(player.modified);
				var last_login = moment.duration(time_diff).humanize();

				var joined_time_diff = moment(moment()).diff(player.created);
				var joined = moment.duration(joined_time_diff).humanize();

				var is_online = time_diff < 30000;
				var is_inactive = time_diff > (1000*3600*24*30); //30 days

				var state = m("span", {class: "badge badge-" + (is_online?"success":"danger")}, is_online?"Online":"Offline");
				var xp = m("span", {class: "badge badge-info"}, numberWithCommas(player.attributes.xp));
				var inactive = m("span", {class: "badge badge-secondary"}, "Inactive")

				var rank = getRank(player.attributes.xp);

				var rankCol = m("span");

				if (rank){
					var color = rank.color;
					rankCol = m("span", [
						m("img", {src:"img/xp/" + rank.icon}),
						" ",
						m("span", {"style":"color: rgb("+color.r+","+color.g+","+color.b+")"}, rank.name)
					]);
				}

				rows.push(m("tr", {"class": (is_online?"table-success":"")}, [
					m("td", m("h1", {class:"badge badge-primary"}, "" + ranking++)),
					m("td", [
						m("img", {src:getPlayerImage(player)}),
						" ",
						player.name
					]),
					m("td", xp),
					m("td", rankCol),
					m("td", numberWithCommas(player.attributes.digged_nodes)),
					m("td", numberWithCommas(player.attributes.crafted)),
					m("td", numberWithCommas(player.attributes.placed_nodes)),
					m("td", player.attributes.died),
					m("td", player.attributes.played_time ? moment.duration(+player.attributes.played_time, "seconds").humanize() : ""),
					m("td", joined),
					m("td", [last_login, " ", (is_inactive?inactive:null)]),
					m("td", state)
				]));

			});

			return m("tbody", rows);
		}
	};

	var Table = {
		view: function(){
			return m("table", {class:"table table-condensed table-striped"}, [
				m("thead", [
					m("tr", [
						m("th", "Ranking"),
						m("th", "Name"),
						m("th", ["XP ", makeSortButton("xp")]),
						m("th", "Rank"),
						m("th", ["Dig-count", makeSortButton("digged_nodes")]),
						m("th", ["Craft-count", makeSortButton("crafted")]),
						m("th", ["Build-count", makeSortButton("placed_nodes")]),
						m("th", ["Death-count", makeSortButton("died")]),
						m("th", ["Play-time", makeSortButton("played_time")]),
						m("th", ["Joined", makeSortButton("joined")]),
						m("th", ["Last login", makeSortButton("online")]),
						m("th", "Status")
					])
				]),
				m(HighscoreRows)
			]);
		}
	};

	var Page = {
		view: function(){
			return m("div", [m(NextButton), m(Table)]);
		}
	}

	m.mount(document.getElementById("app"), Page);

	update();

	setInterval(update, 2000);

})();
