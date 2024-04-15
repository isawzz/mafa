
async function showGamePlayers(dParent, users) {
	let me = getUname();
	mStyle(dParent, { wrap: true })
	for (const name in users) {
		let d = mDom(dParent, { align: 'center', padding: 2, cursor: 'pointer', border: `transparent` });
		d.setAttribute('username', name)
		let img = showUserImage(name, d, 40); //for(const i of range(3))showUserImage(name,d,40);
		let label = mDom(d, { matop: -4, fz: 12, hline: 12 }, { html: name });
		let item = jsCopy(users[name]);
		item.div = d;
		item.isSelected = false;
		DA.allPlayers[name] = item;
		d.onclick = onclickGameMenuPlayer;
	}
	await clickOnPlayer(me);
}
async function onclickGameMenuPlayer(ev) {
	let name = evToAttr(ev, 'username'); //console.log('name',name); return;
	let shift = ev.shiftKey;
	await showGameMenuPlayerDialog(name, shift);
}
async function showGameMenuPlayerDialog(name, shift = false) {
	let item = DA.allPlayers[name];
	let gamename = DA.gamename;
	let da = iDiv(item);

	setPlayerPlaying(item,gamename);
}
function setPlayerPlaying(item, gamename) {
	let [name,da] =[item.name,item.div];
	addIf(DA.playerList, name);
	let dParent = mBy('dGameMenu'); //mBy('dMain'); //mBy('dGameMenu'); //document.body;
	let id = 'dPlayerOptions'; mRemoveIfExists(id);
	let bg = getUserColor(name);
	let rounding = 6;
	let d = mDom(dParent, { display: 'inline-block', padding:4, bg, rounding }, { id });
	mDom(d,{},{html:`${name} ${gamename}`}); //title

	//hier brauch ich noch die options!!!!

	mStyle(da, { bg, fg: 'white', border: 'white' });
	let r = getRectInt(da,mBy('dGameMenu')); 
	let rp = getRectInt(d); 
	let [x,y,w,h]=[r.x-rp.w/2+r.w/2,r.y-rp.h-4,rp.w,rp.h];
	console.log('pos',x,y,w,h);
	mIfNotRelative(dParent);
	// let mark=mDom(dParent,{w,h,bg:'red'});
	mPos(d,x,y); //r.x,r.y);
	//mIfNotRelative(dParent); mPos(d, r.x - rp.w / 2, -58); // r.y - rp.h)
	//mButtonX(dOptions, ev => collectPlayerOptions(dOptions, name, gamename), 18, 1, 'dimgray');

	return;

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
			console.log('fs', fs)
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
			measure_fieldset(fs);
		}
	}
}


















function setPlayerNotPlaying(da, name, gamename) {
	removeInPlace(DA.playerList, name);
	mRemove('dPlayerOptions');
	mStyle(da, { bg: 'transparent', fg: 'black', border: `transparent` });
}
function mExists(d) { return isdef(toElem(d)); }

async function collectPlayerOptions(d, name, gamename) {
	if (!mExists('dPlayerOptions')) { console.log('opts', name, DA.playerOptions[name]); return; }
	let poss = Serverdata.config.games[gamename].ploptions;
	let options = {};
	if (nundef(poss)) return options;
	for (const p in poss) {
		let fs = mBy(`d_${p}`);
		let val = get_checked_radios(fs)[0];
		options[p] = isNumber(val) ? Number(val) : val;
	}
	lookupSetOverride(DA.playerOptions, [name], options);
	mRemove(d);
	return options;
}

async function onclickClearPlayers() {
	assertion(false, 'onclickClearPlayers NOT IMPLEMENTED!')
	let me = getUname();
	for (const name in DA.allPlayers) {
		let item = DA.allPlayers[name];
		if (item.isSelected && me != name) {
			style_not_playing(item, '', DA.playerList);
		}
	}
	assertion(!isEmpty(DA.playerList), "uname removed from playerList!!!!!!!!!!!!!!!")
	DA.lastName = DA.playerList[0].name; // DA.allPlayers.find(x=>x.uname == DA.playerList[0]);

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





