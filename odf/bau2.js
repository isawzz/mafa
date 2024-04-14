
async function showGameMenuPlayerDialog(name, shift = false) {
	let item = DA.allPlayers.find(x => x.name == name);
	let gamename = DA.gamename;
	let da = iDiv(item);

	let state = DA.playerlist.includes(name)? isdef(mBy('dPlayerOptions'))?'yesOpen':'yesClosed':'no';
	console.log('...state',state);
	if (state == 'yesClosed') setPlayerNotPlaying(da, name, gamename);
	else if (state == 'no') setPlayerPlaying(da,name,gamename);
	else collectPlayerOptions('dPlayerOptions',name,gamename);
}
function setPlayerNotPlaying(da, name, gamename){
	removeInPlace(DA.playerlist,name);
	mRemove('dPlayerOptions');
	mStyle(da,{bg:'transparent',fg:'black',border: `transparent`});
}
function setPlayerPlaying(da, name, gamename) {
	addIf(DA.playerlist,name);
	let dParent = mBy('dGameMenu'); //document.body;
	let id = 'dPlayerOptions'; mRemove(id); // if (isdef(mBy(id))) mBy(id).remove();
	let bg = getUserColor(name);
	let rounding = 6;
	let d = mDom(dParent, { bg, rounding }, { id });
	mStyle(d, { display: 'inline-block' });

	let dOptions = mDom(d, { bg: '#ffffffd0', border: `solid 2px ${bg}`, rounding }); mCenterFlex(dOptions);

	let poss = Serverdata.config.games[gamename].ploptions;
	if (nundef(poss)) return;
	for (const p in poss) {
		let key = p; console.log('key', key)
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = key.includes('per') ? stringBefore(key, '_') + '/' + stringAfterLast(key, '_') : key;
			//console.log('legend',legend)
			let fs = mRadioGroup(dOptions, {}, `d_${key}`, legend);
			console.log('fs',fs)
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
			measure_fieldset(fs);
		}
	}
	mStyle(da, { bg,fg:'white',border:'white' })
	let r = getRect(da); console.log(r)
	let rp = getRect(dOptions);
	mIfNotRelative(dParent); mPos(d, r.x - rp.w / 2, -58)
	mButtonX(dOptions,ev=>collectPlayerOptions(dOptions,name,gamename),18,1,'dimgray');
}
function mExists(d){return isdef(toElem(d));}
async function collectPlayerOptions(d,name,gamename){
	if (!mExists('dPlayerOptions')) {console.log('opts',name,DA.playerOptions[name]);return;}
	let poss = Serverdata.config.games[gamename].ploptions;
	let options = {};
	if (nundef(poss)) return options;
	for (const p in poss) {
		let fs = mBy(`d_${p}`);
		let val = get_checked_radios(fs)[0];
		options[p] = isNumber(val) ? Number(val) : val;
	}
	lookupSetOverride(DA.playerOptions,[name],options);
	mRemove(d);
	return options;
}
async function showGamePlayers(dParent, gamename) {
	let users = await mGetRoute('users');
	//console.log('users',users);

	let d = mDom(dParent, { display: 'flex', gap: 6, wrap: true })
	DA.playerlist = [];
	DA.allPlayers = [];
	DA.lastName = null;
	DA.playerOptions = {};
	let me = getUname();
	for (const name in users) {
		let d1 = mDom(d, { cursor: 'pointer',border: `transparent` });
		d1.setAttribute('username', name)
		let img = showUserImage(name, d1, 40); //for(const i of range(3))showUserImage(name,d,40);
		let label = mDom(d1, { matop: -4, fz: 12, hline: 12 }, { html: name });

		let item = { name, div: d1, state: 0, strategy: '', isSelected: false };
		//console.log('rect',getRect(d1))
		DA.allPlayers.push(item);
		d1.onclick = onclickGameMenuPlayer;
		// if (name == me) { toggle_select(item, funcs, gamename, DA.playerlist); DA.lastName = name; }
		// else d1.onclick = onclickGameMenuPlayer;

	}
	//let myItem = DA.allPlayers.find(x=>x.name == me);
	await clickOnPlayer(me);
}


function getPlaymode(idOrTable) {
	if (isDict(idOrTable)) {
		let table = idOrTable;
		return isdef(table.fen) ? table.fen.players[getUname()].playmode : 'no fen';
	} else if (Clientdata.table) {
		return Clientdata.table.id == idOrTable ? Clientdata.table.fen.players[getUname()].playmode : 'wrong table';
	} else return 'NO table!';
}
async function showTable(table) {
	DA.counter += 1;
	//console.log('___showTable', DA.counter, getUname(), getPlaymode(table)); //name, table.friendly, table.playerNames.includes(name));//console.log('Clientdata',Clientdata);

	if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); } //console.log('id',id); }
	// else {console.log(table.fen.players[getUname()].playmode)}

	let me = getUname();

	if (!table) { showMessage('table deleted!'); return await showTables(); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table; //console.log('___showTable'); //,me); //table.fen.players[me]);
	//console.log('table.status',table.status,table); return;

	clearEvents();
	showTitle(`${table.friendly}`);
	let func = DA.funcs[table.game];
	await func.present(table);
	mRise('dMain');

	//console.log('table',table.fen); //return;

	if (table.status == 'over') return showGameover(table);

	if (!table.fen.turn.includes(me)) return;

	//console.log('...proceeding with move')
	let mode = table.fen.players[me].playmode;
	if (mode == 'bot') return await func.botMove(table, me);
	else if (mode == 'hybrid') return await func.hybridMove(table, me);
	else if (mode == 'human') return await func.activate(table);

}





