async function onclickOpenToJoinGame() {
	let options = collectOptions();
	let players = collectPlayers(options);
	console.log('onclickOpenToJoinGame: players', players)
	let t = createOpenTable(DA.gamename, players, options);
	let res = await mPostRoute('postTable', t);
}
async function onclickJoinTable(id) {
	//console.log(getUname(),'clicked join',id);
	let table = Serverdata.tables.find(x => x.id == id);
	let me = getUname();
	assertion(table.status == 'open', 'too late to join! game has already started!')
	assertion(!table.playerNames.includes(me), `${me} already joined!!!`);
	table.players[me] = createGamePlayer(me, table.game);
	console.log('created', jsCopy(table.players[me]));
	table.playerNames.push(me);
	let res = await mPostRoute('postTable', { id, players: table.players, playerNames: table.playerNames });
	console.log('table', table.players)
	console.log('res', res);
}
function collectPlayers(options) {
	let players = {};
	if (isList(DA.playerList)) {
		for (const name of DA.playerList) {
			players[name] = DA.allPlayers[name];
		}
	}
	return players;
}
function createGamePlayer(name, gamename, opts={}) {
	let pl = jsCopy(Serverdata.users[name]);

	let plopts = valf(pl[gamename],{});	delete pl[gamename];

	copyKeys(opts,plopts);

	let defopts = Serverdata.config.games[gamename].ploptions;
	for (const k in defopts) {
		let val = plopts[k];
		if (nundef(val)) {
			let vals = defopts[k].split(',').map(x => x.trim());
			val = arrLast(vals);
			if (isNumeric(val)) val = Number(val);
			plopts[k] = val;
		}
	}
	copyKeys(plopts, pl);
	return pl;
}
function createOpenTable(gamename, players, options) {
	let me = getUname();
	let playerNames = [me];
	assertion(me in players, "createOpenTable without owner!!!!!")

	for (const name in players) {
		addIf(playerNames, name);
	}
	//console.log('players',players)

	let pdict = {};
	for (const name of playerNames) {
		let o = pdict[name] = {};
		let pl = players[name];
		for (const k in pl) {
			if (k == gamename) { addKeys(pl[gamename], o); }
			else if (!['div', 'isSelected'].includes(k)) o[k] = pl[k];
		}
		pdict[name] = o;
	}

	assertion(playerNames[0] == me, `_addTable: owner should be ${me} and first in ${playerNames.join(',')}`);
	console.log('pdict', pdict)

	let t = {
		status: 'open',
		id: generateTableId(),
		fen: null,
		game: gamename,
		owner: playerNames[0],
		friendly: generateTableName(),
		players: pdict,
		playerNames: playerNames,
		options
	};
	return t;

}















