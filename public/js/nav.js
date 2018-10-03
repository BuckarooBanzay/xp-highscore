
(function(){

	var state = {
	};

	function NavLinks(){
		return m("ul", {class:"navbar-nav"}, [
			m("a", {class:"nav-link", href:"#!/highscore"}, "Highscore"),
			m("a", {class:"nav-link", href:"#!/search"}, "Search")
		]);
	}

	function NavBarContent(){
		return [
			m("a", {class:"navbar-brand", href:"#"}, "Pandorabox Highscore"),
			m("div", {class:"navbar-collapse"}, NavLinks())
		];
	}

	m.mount(document.getElementById("nav"), {
		view: function(vnode){
			return m("nav", {class:"navbar navbar-dark bg-dark fixed-top navbar-expand-lg"}, NavBarContent());
		}
	});


})();

