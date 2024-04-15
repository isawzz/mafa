
async function showGameMenu(gamename) {
	let users = Serverdata.users = await mGetRoute('users');//console.log('users',users);
	//for(const name in users){		console.log('',name,users[name][gamename]);	}
	mRemoveIfExists('dGameMenu');
	let dMenu = mDom('dMain', {}, { className: 'section', id: 'dGameMenu' }); 
	mDom(dMenu,{maleft:12},{ html:`<h2>game options</h2>`});
	let style = { display: 'flex', justify: 'center', w: '100%', gap: 10, matop: 6 };
	let dPlayers = mDiv(dMenu, style, 'dMenuPlayers'); //mCenterFlex(dPlayers);
	let dOptions = mDiv(dMenu, style, 'dMenuOptions'); //mCenterFlex(dOptions);
	let dButtons = mDiv(dMenu, style, 'dMenuButtons');
	DA.gamename = gamename;
	DA.gameOptions = {};
	DA.playerList = [];
	DA.allPlayers = {};
	DA.lastName = null;
	await showGamePlayers(dPlayers, users);
	await showGameOptions(dOptions, gamename);
	let astart = mButton('Start', onclickStartGame, dButtons, {}, ['button', 'input']);
	let ajoin = mButton('Open to Join', onclickOpenToJoinGame, dButtons, {}, ['button', 'input']);
	let acancel = mButton('Cancel', () => mClear(dMenu), dButtons, {}, ['button', 'input']);
	let bclear = mButton('Clear Players', onclickClearPlayers, dButtons, {}, ['button', 'input']);
}
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

	await setPlayerPlaying(item,gamename);
}
function getGamePlayerOptions(gamename){return Serverdata.config.games[gamename].ploptions;}
async function setPlayerPlaying(item, gamename) {
	let [name,da] =[item.name,item.div]; //console.log('da',da)
	addIf(DA.playerList, name);
	let bg = getUserColor(name);
	mStyle(da, { bg, fg: 'white', border: 'white' });
	let poss = getGamePlayerOptions(gamename);
	let id = 'dPlayerOptions'; 	
	let lastpl = DA.lastPlayerItem;
	DA.lastPlayerItem = item;
	let dold = mBy(id); 
	if (isdef(dold)){ await collectPlayerOptions(lastpl,gamename); dold.remove();}
	
	//if player options window is open collect

	if (nundef(poss)) return;
	let dParent = mBy('dGameMenu'); //mBy('dMain'); //mBy('dGameMenu'); //document.body;
	let rounding = 6;
	let d1 = mDom(dParent, { bg:colorLight(bg,50), border: `solid 2px ${bg}`, rounding, display: 'inline-block', hpadding:3, rounding }, { id });
	mDom(d1,{},{html:`${name}`}); //title
	d = mDom(d1, {}); mCenterFlex(d);
	mCenterCenter(d);

	for (const p in poss) {
		let key = p; //console.log('key', key)
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = key.includes('per') ? stringBefore(key, '_') + '/' + stringAfterLast(key, '_') : key;
			let fs = mRadioGroup(d, {}, `d_${key}`, legend);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, false); }

			//set radio elem with value of this player to true
			//let is_on = lookup(DA.allPlayers,[name,gamename,p]); is_on = is_on?true:false;
			let userval = lookup(DA.allPlayers,[name,gamename,p]);
			let radio;
			let chi=fs.children;
			for(const ch of chi){
				//console.log(ch);
				let id = ch.id;
				if (nundef(id)) continue;
				let radioval = stringAfterLast(id,'_');
				if (isNumber(radioval)) radioval = Number(radioval);
				//console.log('val',radioval);
				if (userval == radioval) ch.firstChild.checked = true;
			}

			measure_fieldset(fs);
		}
	}

	let r = getRectInt(da,mBy('dGameMenu')); 
	let rp = getRectInt(d1); 
	let [y,w,h]=[r.y-rp.h-4,rp.w,rp.h];
	let x=r.x-rp.w/2+r.w/2;
	if (x<0) x=r.x-22;
	if (x>window.innerWidth-w-100) x=r.x-w+r.w+14; 
	//console.log('pos',x,y,w,h);
	mIfNotRelative(dParent);
	mPos(d1,x,y); 
	mButtonX(d1, ev => collectPlayerOptions(item, gamename), 18, 3, 'dimgray');
}
async function collectPlayerOptions(item, gamename) {
	let name = item.name;
	let options = valf(item[gamename],{});
	console.log('___collect\nitem',name,options); //return;
	//if (!mExists('dPlayerOptions')) { console.log('opts', name, DA.playerOptions[name]); return; }
	let poss = Serverdata.config.games[gamename].ploptions;
	if (nundef(poss)) return options;
	for (const p in poss) {
		let fs = mBy(`d_${p}`);
		let val = get_checked_radios(fs)[0]; //console.log(p,val)
		options[p] = isNumber(val) ? Number(val) : val;
	}
	item[gamename]=options;
	let id = 'dPlayerOptions'; mRemoveIfExists(id);//mRemove(d);
	//console.log('collected',DA.playerList.map(x=>DA.allPlayers[x]));
	//options with org user options compare 
	let uold = Serverdata.users[item.name];
	let unew = {}; 
	for(const k in item){
		if (['div','isSelected'].includes(k)) continue;
		unew[k]=jsCopy(item[k]);
	}
	//console.log('item',item)
	for(const k in unew[gamename]){
		if (lookup(uold,[gamename,k]) != unew[gamename][k]){
			console.log(`${k} CHANGED!!!!`,lookup(uold,[gamename,k]),unew[gamename][k])
			await postUserChange(unew);
			console.log('server opts',name,Serverdata.users[name][gamename]);
			return;
		}
	}
}


















function setPlayerNotPlaying(da, name, gamename) {
	removeInPlace(DA.playerList, name);
	mRemove('dPlayerOptions');
	mStyle(da, { bg: 'transparent', fg: 'black', border: `transparent` });
}
function mExists(d) { return isdef(toElem(d)); }


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





