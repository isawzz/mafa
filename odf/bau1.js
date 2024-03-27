
function a_game() {
	function setup(table) {
		let fen = {};
		fen.players = {};
		for (const pl of table.players) {
			fen.players[pl.name] = pl;
		}
		fen.turn = jsCopy(table.playerNames); // alle zugleich dran
		return fen;
	}
	function checkGameover(table) { return false; }
	function present(table, name) { a_game_present(table, name); } //if (nundef(name)) name = U.name; showMessage(`BINGO!!! ${table.friendly} view ${name}`); } 
	return { setup, checkGameover, present };
}
function a_game_present(table, name) {

	//was soll passieren?
	//erstmal clear page I guess
	mClear('dMain');
	let d = mDom('dMain', { margin: 10, bg: '#00000080' }); mCenterCenterFlex(d)
	mDom(d, { fz: 100, fg: 'white' }, { html: `we are playing ${getGameFriendly(table.game)}!!!!` })

}


















