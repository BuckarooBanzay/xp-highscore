(function(){

	var state = {
		busy: false
	};


	highscore.routes["/search"] = {
		view: function(){
			return m("div", [m("div")]);
		}
	};

})();
