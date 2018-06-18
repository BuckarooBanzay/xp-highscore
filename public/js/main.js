(function(){

	var Table = m("table", [
		m("tr", [
			m("th", "Name"),
			m("th", "XP")
		])
	]);

	m.request("api/highscore")
	.then(function(score){

		m.render(document.getElementById("app"), [
			Table
		]);
	});


})();
