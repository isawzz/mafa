//#region set
async function showGamePlayers(dParent, gamename) {
	let users = await mGetRoute('users');
	//console.log('users',users);

	let d = mDom(dParent, { display: 'flex', gap: 6, wrap: true })
	DA.playerlist = [];
	DA.allPlayers = [];
	DA.lastName = null;
	let params = [gamename, DA.playerlist];
	let funcs = [style_not_playing, style_playing_as_human, style_playing_as_bot];

	let me = getUname();
	for (const name in users) {
		let d1 = mDom(d, { cursor: 'pointer' });
		d1.setAttribute('username', name)
		let img = showUserImage(name, d1, 40); //for(const i of range(3))showUserImage(name,d,40);
		let label = mDom(d1, { matop: -4, fz: 12, hline: 12 }, { html: name });

		let item = { name, div: d1, state: 0, strategy: '', isSelected: false };
		DA.allPlayers.push(item);
		if (name == me) { toggle_select(item, funcs, gamename, DA.playerlist); DA.lastName = name; }
		else d1.onclick = ev => {
			if (ev.shiftKey) {
				console.log('shift!!!')
				let list = DA.allPlayers;
				if (nundef(DA.lastName)) DA.lastName = list[0].name;
				console.log(DA.lastName, list)
				let x1 = list.find(x => x.name == DA.lastName);
				let i1 = list.indexOf(x1);
				let x2 = list.find(x => x.name == item.name);
				let i2 = list.indexOf(x2);
				if (i1 == i2) return;
				if (i1 > i2) [i1, i2] = [i2, i1];
				assertion(i1 < i2, "NOT IN CORRECT ORDER!!!!!")
				for (let i = i1; i <= i2; i++) {
					let xitem = DA.allPlayers[i];
					if (xitem.isSelected) continue;
					style_playing_as_human(xitem, gamename, DA.playerlist);
				}
				DA.lastName = item.uname;
			} else {
				toggle_select(item, funcs, gamename, DA.playerlist);
				if (item.isSelected) DA.lastName = item.name;
			}
		}

	}
}
async function setBotMove(table) {
	await setHybridMove(table); 
	// T.sets = setFindAllSets(T.items);
	// setShowButtons();
	// mShield(dOpenTable, { bg: '#00000010' });
	// //setActivateBot();
}
async function setHybridMove(table) {
	T.sets = setFindAllSets(T.items);
	setShowButtons();
	setActivateCards();

	await mSleep(2000);
	if (isEmpty(T.sets)) if (!DA.INTERRUPT) setOnclickNoSet(); 
	else {
		let list = rChoose(T.sets);
		if (!DA.INTERRUPT) setOnclickCard(list[0]);
		await mSleep(2000);
		if (!DA.INTERRUPT) setOnclickCard(list[1]);
		await mSleep(2000);
		if (!DA.INTERRUPT) setOnclickCard(list[2]);

	}



	console.log('DONE!')

	//setActivateBot();
	//mShield(dOpenTable, { bg: '#00000010' });
	//setActivateBot();
}
async function setActivateBot(){
	console.log('setActivateBot')
	T.dTimer = mDom(dOpenTable);

	// if (isEmpty(T.sets)) setOnclickNoSet(); 
	// else {
	// 	let list = rChoose(T.sets);
	// 	setClickNext(list);
	// }
}
function setClickNext() {
	if (isEmpty(T.list)) { console.log('list empty!'); return; }
	let el = T.list.shift();
	setOnclickCard(el, T.items);
	if (!isEmpty(T.list)) createCountdownG(T.dTimer, {}, 1000, setClickNext);
}
async function _setStepComplete(table, o) {
	console.log('___ stepComplete')
	table.step = o.step;
	let pl = table.fen.players[o.name];
	pl.score++;
	Clientdata.table = table;
	console.log('player scores', table.playerNames.map(x => table.fen.players[x].score));
	let [step, fen] = [table.step, table.fen];
	if (getUname() == o.name) await mPostRoute('postTable', { step, fen });

}
//#endregion

//#region app.js
app.post('/mergeTable', (req, res) => {
	let id = req.body.id;
	console.log('::merge',++StepCounter); //Object.keys(req.body),req.body.status)
	let table = lookup(Session, ['tables', id]);
	table = deepmergeOverride(table,req.body); //deepMergeOverrideLists(table,req.body);
	//console.log('!!!',table.status)
	saveTable(id, table);
	// let msg = `table merged: ${table.friendly} merged`;
	// //console.log(msg)
	// let turn = table.fen.turn;
	//io.emit('table', { msg, id, turn, isNew: false }) DAS WAR DER FEHLER!!!!!!!!!!!!!!!!!!!
	emitToPlayers(table.playerNames, 'table', table);
	res.json(table);
});
io.on('connection', (client) => {
	clients[client.id] = client;
	client.on('userChange', x => handle_userChange(x, client.id));
	client.on('disconnect', x => handle_disconnect(x, client.id)); // ()=>handle_disconnect(socket.id));
	//handle_connect(client.id);
	//client.emit('message','hello')
	//client.on('login', x => handle_login(x, client.id));
	client.on('message', handle_message);
	//client.on('move', handle_move);
	client.on('update', handle_update);
});
function handle_connect(id) { console.log('::connected', id); io.emit('message', 'someone logged in!'); }
function handle_message(x) { console.log('::message', arguments); io.emit('message', x); }
function handle_update(x) { console.log('::update', x); io.emit('update', x); }
function _handle_move(x) {
	console.log('::move', arguments);
	//console.log('Session tables',Session.tables)
	let table = lookup(Session, ['tables', x.id]);
	//console.log('table',table);
	//wie kann ich temp move zu table saven?
	let fen = table.fen;
	let turn = fen.turn;
	console.log('turn', turn)
	let name = x.name;
	let move = x.move;

	//simplest:
	if (!turn.includes(name)) { console.log('!!!move mismatch', name, move); return; }
	lookupSetOverride(fen, ['moves', name], move);
	removeInPlace(fen.turn, name)
	//save new fen when all players moved? or after each and every move?
	emitToPlayers(table.playerNames, 'move', x);
	//io.emit('turnUpdate',fen.turn);
}

//#endregion

//#region april 12 2024
function createCountdownG(dParent, styles = {}, ms = 3000, callback = null) {
	//_removeCountdownG();
	setTimeout(()=>{
		dParent.innerHTML = timeConversion(Math.max(ms, 0), 'msh');
		if (callback) callback();
	},ms)
	// if (isEmpty(styles)) styles = { display: 'inline', fz: 40, fg: 'white', bg: 'gray' }; //{ w: 80, maleft: 10, fg: 'red', weight: 'bold' };
	// let dCountdown = mDom(dParent, styles, { id: 'dCountdown' });
	// let cd = DA.countdown = new SimpleTimer(dCountdown, 1000, null, ms, callback);
	// cd.start();
	// return cd;
}
function setActivateBot(){
	console.log('setActivateBot')
	T.dTimer = mDom(dOpenTable);
	if (isEmpty(T.sets)) createCountdownG(T.dTimer, {}, 1000, setOnclickNoSet());
	else {
		T.list = rChoose(T.sets);
		createCountdownG(T.dTimer, {}, 1000, setClickNext);
	}
}
function createCountdownG(dParent, styles = {}, ms = 3000, callback = null) {
	//_removeCountdownG();
	if (isEmpty(styles)) styles = { display: 'inline', fz: 40, fg: 'white', bg: 'gray' }; //{ w: 80, maleft: 10, fg: 'red', weight: 'bold' };
	let dCountdown = mDom(dParent, styles, { id: 'dCountdown' });
	let cd = DA.countdown = new SimpleTimer(dCountdown, 1000, null, ms, callback);
	cd.start();
	return cd;
}
function removeCountdownG() {}; // if (isdef(DA.countdown)) { DA.countdown.clear(); DA.countdown.elem.remove(); DA.countdown = null; } }
async function rest(item, items) {
	//console.log('click')
	toggleItemSelection(item);
	let n = items.length;
	//console.log(n);
	let selitems = items.filter(x => x.isSelected);
	let m = selitems.length;
	//console.log(selitems,m);
	//console.log(`${m} out of ${n} items selected!`);
	if (m > 0) { //TESTING!!!
		//check if this is a set!
		//console.log('selected',selitems);
		let move = selitems.map(x => x.key);
		let table = Clientdata.table;
		let fen = table.fen;
		let pl = fen.players[getUname()];
		pl.score++;
		await sendMoveComplete(fen);
		//send move!
	}
}
function statusMessage(msg, top=600) {
	let d=mBy('ribbon');if (isdef(d)) d.remove();
	let bg = `linear-gradient(270deg, #fffffd, #00000080)`
  d = mDom(dTitle,{bg,mabottom:10,align:'center',padding:10,fz:40,w100:true},{html:msg, id:'ribbon'}); 
  // d = mDom('dTitle',{align:'center',padding:10,fz:40,w100:true},{classes:'slow_gradient_blink', html:msg, id:'ribbon'}); 
  // let def_styles = { padding: 20, align: 'center', position: 'absolute', fg: 'contrast', fz: 24, w: '100vw' };
  // copyKeys(styles, def_styles);
  // let dContent = mDiv(d, def_styles, null, msg);
  // return dContent;
}
async function _prelims() {
  if (nundef(M.superdi)) {
    Serverdata = await mGetRoute('session'); //session ist: users,config,
    Info = await mGetYaml('../assets/info.yaml');
    await loadCollections();
    loadPlayerColors();
    showNavbar();
    sockInit();
    dTitle = mDom('dTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
    await switchToUser(localStorage.getItem('username'));  //danach ist U IMMER gesetzt!!!!
    await switchToMenu('home')
  }
}
//#endregion

//#region deepMerge 2
function cloneIfNecessary(value, optionsArgument) {
  var clone = optionsArgument && optionsArgument.clone === true
  return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}
function deepmerge(target, source, optionsArgument) {
  var array = Array.isArray(source);
  var options = optionsArgument || { arrayMerge: defaultArrayMerge }
  var arrayMerge = options.arrayMerge || defaultArrayMerge
  if (array) {
    return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
  } else {
    return mergeObject(target, source, optionsArgument)
  }
}
function defaultArrayMerge(target, source, optionsArgument) {
  var destination = target.slice()
  source.forEach(function (e, i) {
    if (typeof destination[i] === 'undefined') {
      destination[i] = cloneIfNecessary(e, optionsArgument)
    } else if (isMergeableObject(e)) {
      destination[i] = deepmerge(target[i], e, optionsArgument)
    } else if (target.indexOf(e) === -1) {
      destination.push(cloneIfNecessary(e, optionsArgument))
    }
  })
  return destination
}
function emptyTarget(val) {
  return Array.isArray(val) ? [] : {}
}
function isMergeableObject(val) {
  var nonNullObject = val && typeof val === 'object'
  return nonNullObject
    && Object.prototype.toString.call(val) !== '[object RegExp]'
    && Object.prototype.toString.call(val) !== '[object Date]'
}
function mergeCombine(base, drueber) { return _deepMerge(base, drueber); }
function _deepMerge(target, source, optionsArgument) {
  var array = Array.isArray(source);
  var options = optionsArgument || { arrayMerge: _defaultArrayMerge }
  var arrayMerge = options.arrayMerge || _defaultArrayMerge
  if (array) {
    return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : _cloneIfNecessary(source, optionsArgument)
  } else {
    return _mergeObject(target, source, optionsArgument)
  }
}
function _cloneIfNecessary(value, optionsArgument) {
  var clone = optionsArgument && optionsArgument.clone === true
  return (clone && _isMergeableObject(value)) ? deepmerge(_emptyTarget(value), value, optionsArgument) : value
}
function _defaultArrayMerge(target, source, optionsArgument) {
  var destination = target.slice()
  source.forEach(function (e, i) {
    if (typeof destination[i] === 'undefined') {
      destination[i] = _cloneIfNecessary(e, optionsArgument)
    } else if (_isMergeableObject(e)) {
      destination[i] = deepmerge(target[i], e, optionsArgument)
    } else if (target.indexOf(e) === -1) {
      destination.push(_cloneIfNecessary(e, optionsArgument))
    }
  })
  return destination
}
function _emptyTarget(val) {
  return Array.isArray(val) ? [] : {}
}
function _isMergeableObject(val) {
  var nonNullObject = val && typeof val === 'object'
  return nonNullObject
    && Object.prototype.toString.call(val) !== '[object RegExp]'
    && Object.prototype.toString.call(val) !== '[object Date]'
}
function _mergeObject(target, source, optionsArgument) {
  var destination = {}
  if (_isMergeableObject(target)) {
    Object.keys(target).forEach(function (key) {
      destination[key] = _cloneIfNecessary(target[key], optionsArgument)
    })
  }
  Object.keys(source).forEach(function (key) {
    if (!_isMergeableObject(source[key]) || !target[key]) {
      destination[key] = _cloneIfNecessary(source[key], optionsArgument)
    } else {
      destination[key] = _deepMerge(target[key], source[key], optionsArgument)
    }
  })
  return destination;
}

//#endregion

//#region deepMerge 1
function getKey(item) { return item.key || item.id || item.name; }
function mergeArrays(target, source) {
	const merged = Array.from(target);
	const keyMap = {};

	target.forEach((item, index) => {
		const itemKey = getKey(item);
		if (itemKey) keyMap[itemKey] = index;
	});

	source.forEach((item) => {
		const itemKey = getKey(item);
		if (itemKey && keyMap[itemKey] !== undefined) {
			merged[keyMap[itemKey]] = deepMerge(target[keyMap[itemKey]], item);
		} else {
			merged.push(item);
		}
	});

	return merged;
}
function deepMerge(target, source) {
	if (Array.isArray(target) && Array.isArray(source)) {
		return mergeArrays(target, source);
	} else if (isObject(target) && isObject(source)) {
		const output = Object.assign({}, target);
		Object.keys(source).forEach(key => {
			if (isObject(source[key]) || Array.isArray(source[key])) {
				if (!(key in target)) {
					Object.assign(output, { [key]: source[key] });
				} else {
					output[key] = deepMerge(target[key], source[key]);
				}
			} else {
				Object.assign(output, { [key]: source[key] });
			}
		});
		return output;
	}
	return source;
}
function deepMergeConcatLists(target, source) {
	if (Array.isArray(target) && Array.isArray(source)) {
		// Concatenating arrays
		return [...target, ...source];
	} else if (isObject(target) && isObject(source)) {
		const output = Object.assign({}, target);
		Object.keys(source).forEach(key => {
			if (isObject(source[key])) {
				if (!(key in target)) {
					Object.assign(output, { [key]: source[key] });
				} else {
					output[key] = deepMergeConcatLists(target[key], source[key]);
				}
			} else if (Array.isArray(source[key])) {
				// Merge arrays
				output[key] = target[key] ? deepMergeConcatLists(target[key], source[key]) : source[key];
			} else {
				Object.assign(output, { [key]: source[key] });
			}
		});
		return output;
	}
	// Return source if neither an object nor an array
	return source;
}
function deepMergeIndex(target, source) {
	// Check if the arguments are objects
	if (typeof target !== 'object' || typeof source !== 'object') {
		throw new Error('Both arguments must be objects');
	}

	// Iterate through the source object
	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			// Check if the key exists in the target object
			if (target.hasOwnProperty(key)) {
				// If both values are objects, recursively merge them
				if (typeof target[key] === 'object' && typeof source[key] === 'object') {
					target[key] = deepMergeIndex(target[key], source[key]);
				} else {
					// Otherwise, overwrite the value in the target object
					target[key] = source[key];
				}
			} else {
				// If the key does not exist in the target object, add it
				target[key] = source[key];
			}
		}
	}

	return target;
}
function deepMergeOverrideLists(target,source) {
	let output = Object.assign({}, source);
	if (isObject(source) && isObject(target)) {
		Object.keys(target).forEach(key => {
			if (isObject(target[key])) {
				if (!(key in source))
					Object.assign(output, { [key]: target[key] });
				else
					output[key] = deepMergeOverrideLists(source[key], target[key]);
			} else {
				Object.assign(output, { [key]: target[key] });
			}
		});
	}
	return output;
}
//#endregion

//#region April 10 2024
async function showTable(id) {
	//console.log('showTable', getUname()); //name, table.friendly, table.playerNames.includes(name));
	//console.log('Clientdata',Clientdata);
	let table = await mGetRoute('table', { id }); 
	let me = getUname();

	if (!table) { showMessage('table deleted!'); return await showTables(); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table; console.log('___showTable'); //,me); //table.fen.players[me]);
	
	clearTable();
	//await waitForUnlocked();
	//setLock();

	//natTitle();
	showTitle(`${table.friendly} ${me}`);

	let func=DA.funcs[table.game];
	await func.present(table); // await natPresent(fen, plname);
	mRise('dMain');

	//if this table contains robots, kann hier einen robot move ausloesen!
	//versuch das mal!!!
	//robotMove(me);

	if (!table.fen.turn.includes(me)) { return; }

	if (table.fen.players[me].playmode == 'bot') await func.robotMove(table,me); 
	else await func.activate(table);

	//resetLock();
	// DA.mc=0; if (TESTING && DA.mc++<2) await func.robotMove(table,me); else await func.activate(table);
}
async function setOnclickNoSet(){
	mShield(dOpenTable, { bg: '#00000000' }); //disable ui
	let [me, table] = [getUname(), Clientdata.table];
	let [fen, pl] = [table.fen, table.fen.players[me]];

	//if yes, increase score, remove items, add 3 new items
	if (isEmpty(T.sets)){
		//add 1 cards!
		let newCards = deckDeal(fen.deck,1);//get 3 more cards from deck
		if (!isEmpty(newCards))	fen.cards.push(newCards[0]);
		pl.score++;
	}else{
		pl.score--;
	}

	let name = getUname(); 
	let id = table.id;
	let friendly = table.friendly;
	let step = table.step;
	let turn = fen.turn;
	let res = await mPostRoute('moveComplete',{id,friendly,name,fen,step,turn});
	console.log('res',res)
}

function setClickNext(){
	if (isEmpty(T.list)) {console.log('list empty!');return;}

	let el=T.list.shift();
	setOnclickCard(el,T.items);
	if (!isEmpty(T.list)) createCountdownG(T.dTimer,{},4000,setClickNext);

	// if (isEmpty(list)) {setRemoveTimer();return;}


	// TO.main = setTimeout(()=>{
	// 	let item = list.shift();
	// 	setOnclickCard(item,T.items);
	// 	//setClickNext(list);
	// },5000);



	// let item = rChoose(T.items);
  // let name = getUname(); 
	// console.log(name,'click',item.key)
	// //if (name == 'felix') await mSleep(10);
	// await mSleep(rChoose([0,10,20,30,40]));
	// let fen=table.fen;
	// let pl=fen.players[name];
	// pl.score++;
	// // await sendMoveComplete(fen);
  // let id = table.id;
	// let friendly = table.friendly;
	// let step = table.step;
	// let turn = fen.turn;
	// //console.log('___ sendMoveComplete',step,name); //type,move,turn)
	// let res = await mPostRoute('moveComplete',{id,friendly,name,fen,step,turn});
	// console.log('res',res)
}
async function setOnclickCard(item, items) {
	console.log('click', item.key)
	toggleItemSelection(item);
	let selitems = items.filter(x => x.isSelected);
	let keys = selitems.map(x => x.key);
	let m = selitems.length;
	if (m == 3 || TESTING && m == 3) {
		mShield(dOpenTable, { bg: '#00000000' }); //disable ui
		let me = getUname();
		let table = Clientdata.table;
		let fen = table.fen;
		let pl = fen.players[me];
		let isSet = checkIfSet(keys); console.log('isSet',isSet); //check if set condition is met
		//if yes, increase score, remove items, add 3 new items
		if (isSet || TESTING) {
			let n = Math.max(0,fen.cards.length - 12);//##
			let need = 3 - n;
			let newCards = deckDeal(fen.deck, need);//## get 3 more cards from deck
			for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, keys[i], newCards[i]); else removeInPlace(fen.cards, keys[i])
			pl.score++;
		} else {
			pl.score--;
		}

		// let name = getUname();
		// let id = table.id;
		// let friendly = table.friendly;
		// let step = table.step;
		// let turn = fen.turn;
		//console.log('___ sendMoveComplete',step,name); //type,move,turn)
		// let res = await mPostRoute('moveComplete',{id,friendly,name,fen,step,turn});
		let res = await mPostRoute('mergeTable', table);

		console.log('res', res)
	}
	else if (m >= 1) disableButton(T.bHint); else enableButton(T.bHint);
}
function deepMergeOverrideLists(onew,oold) {
	let output = Object.assign({}, oold);
	if (isObject(oold) && isObject(onew)) {
		Object.keys(onew).forEach(key => {
			if (isObject(onew[key])) {
				if (!(key in oold))
					Object.assign(output, { [key]: onew[key] });
				else
					output[key] = deepMergeOverrideLists(oold[key], onew[key]);
			} else {
				Object.assign(output, { [key]: onew[key] });
			}
		});
	}
	return output;
}
function deepMergeOverrideLists(target,source) {
	let output = Object.assign({}, source);
	if (isObject(source) && isObject(target)) {
		Object.keys(target).forEach(key => {
			if (isObject(target[key])) {
				if (!(key in source))
					Object.assign(output, { [key]: target[key] });
				else
					output[key] = deepMergeOverrideLists(source[key], target[key]);
			} else {
				Object.assign(output, { [key]: target[key] });
			}
		});
	}
	return output;
}
function isObject(item) {  return (item && typeof item === 'object' && !Array.isArray(item));}

function deepMerge(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
function deepMerge(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    // Concatenating arrays
    return [...target, ...source];
  } else if (isObject(target) && isObject(source)) {
    const output = Object.assign({}, target);
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else if (Array.isArray(source[key])) {
        // Merge arrays
        output[key] = target[key] ? deepMerge(target[key], source[key]) : source[key];
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
    return output;
  }
  // Return source if neither an object nor an array
  return source;
}
async function setOnclickCard(item,items){
	console.log('click',item.key)
	toggleItemSelection(item);
	let selitems=items.filter(x=>x.isSelected);
	let keys=selitems.map(x=>x.key);
	let m = selitems.length;
	let me = getUname();
	let table = Clientdata.table;
	let fen=table.fen;

	//console.log('click',item.key,m)
	if (m == 3 || TESTING && m==3){
		//disable ui
		mShield(T.dBoard,{bg:'#00000000'});
		
		//check if set condition is met
		let isSet = checkIfSet(keys);
		console.log('isSet',isSet);

		//if yes, increase score, remove items, add 3 new items
		if (isSet || TESTING){
			let keys=selitems.map(x=>x.key);
			let n=fen.cards.length-12;//##
			let need=3-n;
			let newCards = deckDeal(fen.deck,need);//## get 3 more cards from deck
			for(let i=0;i<3;i++) if (i<need) arrReplace1(fen.cards,keys[i],newCards[i]); else removeInPlace(fen.cards,keys[i])
			fen.players[me].score++;
			
		}else{
			fen.players[me].score--;
		}

		let name = getUname(); 
		let id = table.id;
		let friendly = table.friendly;
		let step = table.step;
		let turn = fen.turn;
		//console.log('___ sendMoveComplete',step,name); //type,move,turn)
		let res = await mPostRoute('moveComplete',{id,friendly,name,fen,step,turn});

		console.log('res',res)
	}
	else if (m>=1) disableButton(T.bHint); else enableButton(T.bHint);
}
function mStyle(elem, styles={}, unit = 'px') {
	//remove: rest,wrest,hrest,whrest
  elem = toElem(elem);

	let style={};

  //if (isdef(styles.whrest)) { delete styles.whrest; styles.w = styles.h = 'rest'; } else if (isdef(styles.wh100)) { styles.w = styles.h = '100%'; delete styles.wh100; }
  if (isdef(styles.w100)) styles.w = '100%'; else if (isdef(styles.wrest)) styles.w = 'rest';
  if (isdef(styles.h100)) styles.h = '100%'; else if (isdef(styles.hrest)) styles.h = 'rest';
  let dParent = elem.parentNode;
  if (isdef(dParent)) {
    //console.log('dParent',dParent)
    let pad = dParent && isdef(dParent.style.padding) ? parseInt(dParent.style.padding) : 0;
    let rp = getRect(dParent);
    let r = getRect(elem, dParent);
    if (styles.w == 'rest') {
      let left = r.l;
      let w = rp.w;
      let wrest = w - left - pad;
      styles.w = wrest;
    }
    if (styles.h == 'rest') {
      let r1 = getRect(dParent.lastChild, dParent);
      let hrest = rp.h - (r1.y) - pad;
      styles.h = hrest;
    }
  }
  let bg, fg;
  if (isdef(styles.bg) || isdef(styles.fg)) {
    [bg, fg] = colorsFromBFA(styles.bg, styles.fg, styles.alpha);
  }
  if (isdef(styles.vpadding) || isdef(styles.hpadding)) {
    styles.padding = valf(styles.vpadding, 0) + unit + ' ' + valf(styles.hpadding, 0) + unit;
  }
  if (isdef(styles.vmargin) || isdef(styles.hmargin)) {
    styles.margin = valf(styles.vmargin, 0) + unit + ' ' + valf(styles.hmargin, 0) + unit;
    //console.log('margin should be',styles.margin)
  }
  if (isdef(styles.upperRounding) || isdef(styles.lowerRounding)) {
    let rtop = '' + valf(styles.upperRounding, 0) + unit;
    let rbot = '' + valf(styles.lowerRounding, 0) + unit;
    styles['border-radius'] = rtop + ' ' + rtop + ' ' + rbot + ' ' + rbot;
  }
  if (isdef(styles.box)) styles['box-sizing'] = 'border-box';
  if (isdef(styles.round)) { elem.style.setProperty('border-radius', '50%'); }
  for (const k in styles) {
    if (['round','box'].includes(k)) continue;
    let val = styles[k];
    let key = k;
    if (isdef(STYLE_PARAMS[k])) key = STYLE_PARAMS[k];
    else if (k == 'font' && !isString(val)) {
      let fz = f.size; if (isNumber(fz)) fz = '' + fz + 'px';
      let ff = f.family;
      let fv = f.variant;
      let fw = isdef(f.bold) ? 'bold' : isdef(f.light) ? 'light' : f.weight;
      let fs = isdef(f.italic) ? 'italic' : f.style;
      if (nundef(fz) || nundef(ff)) return null;
      let s = fz + ' ' + ff;
      if (isdef(fw)) s = fw + ' ' + s;
      if (isdef(fv)) s = fv + ' ' + s;
      if (isdef(fs)) s = fs + ' ' + s;
      elem.style.setProperty(k, s);
      continue;
    } else if (k.includes('class')) {
      mClass(elem, styles[k]);
    } else if (k == 'border') {
      if (isNumber(val)) val = `solid ${val}px ${isdef(styles.fg) ? styles.fg : '#ffffff80'}`;
      if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
    } else if (k == 'ajcenter') {
      elem.style.setProperty('justify-content', 'center');
      elem.style.setProperty('align-items', 'center');
    } else if (k == 'layout') {
      if (val[0] == 'f') {
        val = val.slice(1);
        elem.style.setProperty('display', 'flex');
        elem.style.setProperty('flex-wrap', 'wrap');
        let hor, vert;
        if (val.length == 1) hor = vert = 'center';
        else {
          let di = { c: 'center', s: 'start', e: 'end' };
          hor = di[val[1]];
          vert = di[val[2]];
        }
        let justStyle = val[0] == 'v' ? vert : hor;
        let alignStyle = val[0] == 'v' ? hor : vert;
        elem.style.setProperty('justify-content', justStyle);
        elem.style.setProperty('align-items', alignStyle);
        switch (val[0]) {
          case 'v': elem.style.setProperty('flex-direction', 'column'); break;
          case 'h': elem.style.setProperty('flex-direction', 'row'); break;
        }
      } else if (val[0] == 'g') {
        val = val.slice(1);
        elem.style.setProperty('display', 'grid');
        let n = allNumbers(val);
        let cols = n[0];
        let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
        elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
        elem.style.setProperty('place-content', 'center');
      }
    } else if (k == 'layflex') {
      elem.style.setProperty('display', 'flex');
      elem.style.setProperty('flex', '0 1 auto');
      elem.style.setProperty('flex-wrap', 'wrap');
      if (val == 'v') { elem.style.setProperty('writing-mode', 'vertical-lr'); }
    } else if (k == 'laygrid') {
      elem.style.setProperty('display', 'grid');
      let n = allNumbers(val);
      let cols = n[0];
      let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
      elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
      elem.style.setProperty('place-content', 'center');
    }
    if (key == 'font-weight') { elem.style.setProperty(key, val); continue; }
    else if (key == 'background-color') elem.style.background = bg;
    else if (key == 'color') elem.style.color = fg;
    else if (key == 'opacity') elem.style.opacity = val;
    else if (key == 'wrap') { if (val == 'hard') elem.setAttribute('wrap', 'hard'); else elem.style.flexWrap = 'wrap'; }
    else if (k.startsWith('dir')) {
      isCol = val[0] == 'c';
      elem.style.setProperty('flex-direction', 'column');
    } else if (key == 'flex') {
      if (isNumber(val)) val = '' + val + ' 1 0%';
      elem.style.setProperty(key, makeUnitString(val, unit));
    } else {
      elem.style.setProperty(key, makeUnitString(val, unit));
    }
  }
}
async function setRobotMove(table){
	let me=getUname();
	let item = rChoose(Clientdata.items);
	let move = [item.key];
	await sendMyMove(move,'r1');
}

async function setOnclickCard(item,items){
	//console.log('click')
	toggleItemSelection(item);
	let n=items.length;
	//console.log(n);
	let selitems=items.filter(x=>x.isSelected);
	let m = selitems.length;
	//console.log(selitems,m);
	//console.log(`${m} out of ${n} items selected!`);
	if (m > 0){ //TESTING!!!
		//check if this is a set!
		//console.log('selected',selitems);
		let move = selitems.map(x=>x.key);
		let table=Clientdata.curTable;
		let fen=table.fen;
		let pl=fen.players[getUname()];
		pl.score++;
		await sendMoveComplete(fen);
		//send move!

	}

}
async function sendMyMove(move,type) {
  let name = getUname(); 
	let table = Clientdata.curTable;
  let id = table.id;
	let friendly = table.friendly;
	let step = table.step;
	let turn = table.fen.turn;
	//console.log('___ sendMyMove',step,name); //type,move,turn)
	let res = await mPostRoute('move',{id,friendly,name,move,type,step,turn});
	//console.log('result',res)
  // sockPostMove(table, me, o);
}
async function onsockReceiveMove(o){
	let [e,mlist]=[o.event,o.moves];
	//console.log('___ onsockReceiveMove',e.step,e.name,e.ts,mlist); //return;
	let [id,friendly,name,move,type,step,turn,ts]=[e.id,e.friendly,e.name,e.move,e.type,e.step,e.turn,e.ts];
	let table = Clientdata.curTable;
	if (!table || table.id != id) {console.log(`not playing at table ${id}`); return;}

	let func = DA.funcs[table.game];
	//console.log('...process',type,turn,friendly);
	//somebody moved but fen has not changed

	//checkIfStepComplete
	// if (type == 'r1'){

	// 	table.step=step;
	// 	//stepComplete
	// 	//console.log('game',table.game)
	// 	func.stepComplete(table,o)
	// }

}
async function sendMoveComplete(fen) {
  let name = getUname(); 
	let table = Clientdata.curTable;
  let id = table.id;
	let friendly = table.friendly;
	let step = table.step;
	let turn = fen.turn;
	//console.log('___ sendMoveComplete',step,name); //type,move,turn)
	let res = await mPostRoute('moveComplete',{id,friendly,name,fen,step,turn});
	//console.log('result',res)
  // sockPostMove(table, me, o);
}
async function onsockTable(x) {
  console.log('::SOCK table:'); //, 'new',x,'old', Clientdata.curTable);
  let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];

  if (Clientdata.curMenu != 'play') return; //wenn ich nicht in menu play bin mach garnichts

  //not in turn and no spacific table open: showTables
  let me=getUname();
  let isSameTableOpen = lookup(Clientdata,['curTable','id']) == id;

  if (isSameTableOpen || isNew && turn.includes(me) && !Clientdata.curTable) return await showTable(id); 

  if (!Clientdata.curTable) return await showTables(); 
}
async function onsockReceiveMoveComplete(o){
	console.log('onsockReceiveMoveComplete',o);
}
function sockInit() {
  let server = getServerurl();
  Socket = io(server);
  // Socket.on('deleteTable', onsockDeleteTable); //x => console.log('::SOCK table:', x));
  Socket.on('disconnect', x => console.log('::SOCK disconnect:', x));
  Socket.on('event', onsockEvent);
  Socket.on('message', showChatMessage);
  Socket.on('table', onsockTable); //x => console.log('::SOCK table:', x));
  Socket.on('tables', onsockTables); //x => console.log('::SOCK table:', x));
  Socket.on('move', onsockReceiveMove); //onsockMove); //x => console.log('::SOCK move:', x));
  //Socket.on('moveComplete', onsockReceiveMoveComplete); //onsockMove); //x => console.log('::SOCK move:', x));
  //Socket.on('newTable', onsockNewTable); //x => console.log('::SOCK table:', x));
  Socket.on('superdi', onsockSuperdi);
  //Socket.on('turnUpdate', onsockTurnUpdate); //x => console.log('::SOCK table:', x));
  // Socket.on('userChange', x => console.log('::SOCK userChange:', x));
  // Socket.on('update', x => console.log('::SOCK update:', x));
}
function _onsockTurnUpdate(turn) {
  //console.log('::SOCK turn:', turn);
  Clientdata.curTable.fen.turn = turn;
  //instructionUpdate();
  //hourglassUpdate();
  //tabtitleUpdate();
}
function _sockPostMove(id, name, move) {
  assertion(false,'sockPostMove shouldnt be called!!!')
  //Socket.emit('move', { id, name, move });
}
async function _onsockDeleteTable(x) {
  //console.log('x',x)
  Serverdata.tables = x.tables;
  //console.log('::SOCK deleteTable:', tables);
  let [me, table, menu] = [getUname(), Clientdata.curTable, Clientdata.curMenu]; 
  //console.log('SOCK deleteTable', me, menu, table);
  showTables()
}
async function _onsockMove(x) {
  //console.log('::SOCK move:', x);
}
async function sendMyMove(move,type) {
  let name = getUname(); 
	let table = Clientdata.table;
  let id = table.id;
	let friendly = table.friendly;
	let step = table.step;
	let turn = table.fen.turn;
	console.log('___ sendMyMove',step,name); //type,move,turn)
	let res = await mPostRoute('move',{id,friendly,name,move,type,step,turn});
	//console.log('result',res)
  // sockPostMove(table, me, o);
}
function onsockReceiveMove(o){
	//integrate move according to type and complete step if complete
	let [event,moves]=[o.event,o.moves];
	o=event;
	console.log('___ onsockReceiveMove',o.step,o.name,o.ts,moves); //return;
	let [id,friendly,name,move,type,step,turn,ts]=[o.id,o.friendly,o.name,o.move,o.type,o.step,o.turn,o.ts];
	let table = Clientdata.table;
	if (!table || table.id != id) {console.log(`not playing at table ${id}`); return;}

	let func = DA.funcs[table.game];
	console.log('...process',type,turn,friendly);
	//somebody moved but fen has not changed

	//checkIfStepComplete
	// if (type == 'r1'){

	// 	table.step=step;
	// 	//stepComplete
	// 	//console.log('game',table.game)
	// 	func.stepComplete(table,o)
	// }

}

function uiTypePlayerStats(fen, me, dParent, layout, innerStyles = {}) {
  let dOuter = mDom(dParent);
  if (layout == 'rowflex') mStyle(dOuter,{display:'flex',justify:'center'});
  else if (layout == 'col') mStyle(dOuter,{display:'flex',dir:'column'});
  //addKeys({ bg:'blue', display: 'flex' }, outerStyles);
  //let dOuter=mDom(dParent,outerStyles);//mCenterCenterFlex(dOuter);
  // mStyle(dParent, outerStyles);
  //console.log('outerStyles',outerStyles)
  let styles = jsCopy(innerStyles);
  addKeys({ rounding: 10, bg: '#00000050', margin: 4, padding: 4, patop: 12, box: true, 'border-style': 'solid', 'border-width': 6 }, styles);
  let show_first = me;
  let order = arrCycle(fen.plorder, fen.plorder.indexOf(show_first));
  let items = {};
  for (const name of order) {
    let pl = fen.players[name];
    //let imgPath = `../assets/img/users/${pl.icon}.jpg`;
    styles['border-color'] = name == me?colorLighter(pl.color):pl.color;
    let d = mDom(dOuter, styles, { id: name2id(name) })
    //let picstyle = { w: 50, h: 50, box: true };
    // let ucolor = pl.color;
    // if (pl.playmode == 'bot') {
    //   copyKeys({ rounding: 0, border: `double 6px ${ucolor}` }, picstyle);
    // } else {
    //   copyKeys({ rounding: '50%', border: `solid 2px white` }, picstyle);
    // }
    let img = showUserImage(name, d, 40);
    //let img = mImage(imgPath, d, picstyle, 'img_person');
    items[name] = { div: d, name: name };
  }
  return items;
}
async function onsockTable(x) {
  console.log('::SOCK table:', x, Clientdata);
  let [msg, id, turn] = [x.msg, x.id, x.turn];

  if (Clientdata.curMenu != 'play') return; //wenn ich nicht in menu play bin mach garnichts

  //not in turn and no spacific table open: showTables
  let me=getUname()
  let isSameTableOpen = lookup(Clientdata,['table','id']) == id;

  if (isSameTableOpen || turn.includes(me) && !Clientdata.table) return await switchToTable(id);

  if (CLientdata.table) return await showTables()
  if (!turn.includes(me) && !Clientdata.table) await showTables();

  //

  //ich bin jetzt der client. 
  //wenn ich in menu play ohne specific table bin, mach showTables
  //wenn ich in play mit specific table bin mach showTable falls die id stimmt



  // let table = x.table;
  // //let tables = x.tables;
  // //Serverdata.tables = tables;
  // console.log('::SOCK table:', table,Clientdata);
  // //return;
  // if (Clientdata.curMenu == 'play'){
  //   if (table.status == 'started' && table.fen.turn.includes(Clientdata.curUser)) await showTable(table,Clientdata.curUser);
  //   else await showTables();
  // }
}

function mist(){
	let [w,h]=[100,70];
	let d = mDom('dMain',{w,h,bg:'random'},{className:'card1'});
	let d1=mDom(d,{w,h},{class:'card-content'});
	// let grid=mGrid(3,4,d,{bg:'yellow'});
	let fill = 'url(#striped-green)';

	let html=`<div class="card1 fill-green"><div class="card-content"><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg></div></div>`;

	let el = mCreateFrom(html);//'<svg viewbox="-2 -2 54 104">' + makeSVG("path", {d:"M25 0 L50 50 L25 100 L0 50 Z",fill}) + '</svg>');
	mAppend(d1,el)

}
function mist(){
	for(const i of range(12)){
		let el=mDom(grid); //,{w:100,h:70});

		const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg1.setAttribute('width', w);
	



		let svg=mDom(el,{},{tag:'svg',width, height,xmlns:"http://www.w3.org/2000/svg"});
		mDom(svg,{},{tag:'rect',fill,width,height})


	}

}
function setDrawCard(dParent,card){
	const paths = {
		diamond: {
			d: "M25 0 L50 50 L25 100 L0 50 Z"
		},
		squiggle: {
			d: "M38.4,63.4c0,16.1,11,19.9,10.6,28.3c-0.5,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z"
		},
		oval: {
			d: "M25,99.5C14.2,99.5,5.5,90.8,5.5,80V20C5.5,9.2,14.2,0.5,25,0.5S44.5,9.2,44.5,20v60 C44.5,90.8,35.8,99.5,25,99.5z"
		}
	}
	const colors = {		red: '#e74c3c',		green: '#27ae60',		purple: '#8e44ad'	};
	const makeSVG = function(tag, attrs) {
		var el= "<" + tag;
		for (var k in attrs)
			el += " " + k + "=\"" + attrs[k] + "\"";
		return el + "/>";
	}
	
  let shapes = '';
	console.log('card',card);

	let [color,shape,number,fill]=card.split('_');
	fill='solid'
	number=Number(number);
  var attr = paths[shape];
  if(fill=="striped"){
    attr.fill = 'url(#striped-'+color+')';
  } else if(fill=="open"){
    attr.fill = 'none';
  } else if(fill=="solid"){
    attr.fill = colors[color];
  }
  for(var i=0;i<number;i++){
    shapes += '<svg viewbox="-2 -2 54 104">' + makeSVG("path", attr) + '</svg>';
		break;
  }
	let html = '<div class="card1 fill-red"><div class="card-content">' + shapes + '</div>'+ '</div>';

	html=`<div class="card1 fill-${color} fadeIn"><div class="card-content"><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg></div></div>`
	html=`<div class="card1 fill-${color} fadeIn"><div class="card-content"><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg></div></div>`
	console.log(html);
	let d=mCreateFrom(html)
	mStyle(dParent,{margin:10,padding:10,bg:'black'})
	mAppend(dParent,d);
	// mAppend(dParent,mDom(null,{w:100,h:100,bg:'red'}));
	// return;
	//let d=mDom(dParent,{},{className:'card fill-'+color, html:'<div class="card-content">' + shapes + '</div>'});
	//let d1=mDom(d,{},{className:'card-content'})
  // var dcard = $("<div />", {
  //   class: 'card fill-'+color,
  //   html: '<div class="card-content">' + shapes + '</div>'
  // }).data("color", color)
  //   .data("shape", shape)
  //   .data("number", number)
  //   .data("fill", fill);
	// console.log(dcard)
	// dParent.append(dcard[0])
  return d;
}
function setDrawCard(dParent, card) {
	const paths = {
		diamond: "M25 0 L50 50 L25 100 L0 50 Z",
		squiggle: "M38.4,63.4c0,16.1,11,19.9,10.6,28.3c-0.5,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
		oval: "M25,99.5C14.2,99.5,5.5,90.8,5.5,80V20C5.5,9.2,14.2,0.5,25,0.5S44.5,9.2,44.5,20v60 C44.5,90.8,35.8,99.5,25,99.5z"
	}
	const colors = { red: '#e74c3c', green: '#27ae60', purple: '#8e44ad' };
}
function rest(){
	const makeSVG = function (tag, attrs) {
		var el = "<" + tag;
		for (var k in attrs)
			el += " " + k + "=\"" + attrs[k] + "\"";
		return el + "/>";
	}

	let shapes = '';
	console.log('card', card);

	let [color, shape, number, fill] = card.split('_');
	fill = 'solid'
	number = Number(number);
	var attr = paths[shape];
	if (fill == "striped") {
		attr.fill = 'url(#striped-' + color + ')';
	} else if (fill == "open") {
		attr.fill = 'none';
	} else if (fill == "solid") {
		attr.fill = colors[color];
	}
	for (var i = 0; i < number; i++) {
		shapes += '<svg viewbox="-2 -2 54 104">' + makeSVG("path", attr) + '</svg>';
		break;
	}
	let html = '<div class="card1 fill-red"><div class="card-content">' + shapes + '</div>' + '</div>';

	html = `<div class="card1 fill-${color} fadeIn"><div class="card-content"><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg></div></div>`
	html = `<div class="card1 fill-${color} fadeIn"><div class="card-content"><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg></div></div>`
	console.log(html);
	let d = mCreateFrom(html)
	mStyle(dParent, { margin: 10, padding: 10, bg: 'black' })
	mAppend(dParent, d);
	// mAppend(dParent,mDom(null,{w:100,h:100,bg:'red'}));
	// return;
	//let d=mDom(dParent,{},{className:'card fill-'+color, html:'<div class="card-content">' + shapes + '</div>'});
	//let d1=mDom(d,{},{className:'card-content'})
	// var dcard = $("<div />", {
	//   class: 'card fill-'+color,
	//   html: '<div class="card-content">' + shapes + '</div>'
	// }).data("color", color)
	//   .data("shape", shape)
	//   .data("number", number)
	//   .data("fill", fill);
	// console.log(dcard)
	// dParent.append(dcard[0])
	return d;
}
let x={
	oval: "M25,95C14.2,95,5.5,85.2,5.5,80V20C5.5,13.2,14.2,5.2,25,5.2S44.5,13.2,44.5,20v60 C44.5,85.2,35.8,95,25,95z",
	squiggle: "M38.4,63.4c2,16.1,11,19.9,10.6,28.3c1,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",

}
function drawCard(card, dParent, sz = 100) {
	//card eg purple_squiggle_2_open	
	const paths = {
		diamond: "M25 0 L50 50 L25 100 L0 50 Z",
		// squiggle: "M38.4,63.4c0,16.1,11,19.9,10.6,28.3c-0.5,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
		squiggle: "M38.4,63.4c2,16.1,11,19.9,10.6,28.3c1,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
		// oval: "M25,99.5C14.2,99.5,5.5,90.8,5.5,80V20C5.5,9.2,14.2,0.5,25,0.5S44.5,9.2,44.5,20v60 C44.5,90.8,35.8,99.5,25,99.5z"
		// oval: "M25,95C14.2,95,5.5,90.8,5.5,80V20C5.5,9.2,14.2,5,25,5S44.5,9.2,44.5,20v60 C44.5,90.8,35.8,95,25,95z"
		// oval: "M25,95C20,95,5.5,90.8,5.5,80V20C5.5,9.2,20,5,25,5S44.5,9.2,44.5,20v60 C44.5,90.8,35.8,95,25,95z"
		// oval: "M25,95C25,95,5.5,90.8,5.5,80V20C5.5,9.2,25,5,25,5S44.5,9.2,44.5,20v60 C44.5,90.8,35.8,95,25,95z"
		oval: "M25,95C14.2,95,5.5,85.2,5.5,80V20C5.5,13.2,14.2,5.2,25,5.2S44.5,13.2,44.5,20v60 C44.5,85.2,35.8,95,25,95z"
	}
	const colors = { red: '#e74c3c', green: '#27ae60', purple: '#8e44ad' };

	let [color, shape, num, fill] = card.split('_');
	var attr = {
		d: paths[shape], //"M25 0 L50 50 L25 100 L0 50 Z",
		fill: fill=='striped'?`url(#striped-${color})`:fill=='solid'?colors[color]:'none',
		stroke: colors[color]
	};

	// let shape = '<svg viewbox="-2 -2 54 104">' + makeSVG("path", attr) + '</svg>';
	// let n = rChoose([1, 2, 3]);

	let h = sz, w = sz / .65;
	let ws = w / 4;
	let hs = 2 * ws;
	//let [ws,hs]=[w/4,h*.9];
	// let d0=mDom('dMain',{display:'flex',valign:'center',gap:10,justify:'center',w,h,bg:'white',rounding:10});//,{className:['card1','fill-green']});
	let d0 = mDom(dParent, { display: 'flex', w, h, bg: 'white', rounding: 10 });//,{className:['card1','fill-green']});
	mStyle(d0, { justify: 'center', 'align-items': 'center', gap: 6 })

	// let shape = '<svg viewbox="0 0 50 100">' + makeSVG("path", attr) + '</svg>';
	let shapeSvg = `<svg viewbox="-2 -2 54 104">` + makeSVG("path", attr) + '</svg>';

	for (const i of range(num)) {
		let d1 = mDom(d0, { h: hs, w: ws }, { html: shapeSvg });
	}
	//console.log('rect', getRect(d0))
}
function drawCard(sz=100){
  var attr = {
    d: "M25 0 L50 50 L25 100 L0 50 Z",
		fill: 'url(#striped-green)',
		stroke: 'green'
  };

	// let shape = '<svg viewbox="-2 -2 54 104">' + makeSVG("path", attr) + '</svg>';
	let n=rChoose([1,2,3]);

	let h=sz,w=sz/.65;
	let ws=w/4;
	let hs=2*ws;
	//let [ws,hs]=[w/4,h*.9];
	// let d0=mDom('dMain',{display:'flex',valign:'center',gap:10,justify:'center',w,h,bg:'white',rounding:10});//,{className:['card1','fill-green']});
	let d0=mDom('dMain',{display:'flex',w,h,bg:'white',rounding:10});//,{className:['card1','fill-green']});

	//,valign:'center',gap:10,justify:'center'
	mStyle(d0,{justify:'center','align-items':'center',gap:6})

	// let shape = '<svg viewbox="0 0 50 100">' + makeSVG("path", attr) + '</svg>';
	let shape = `<svg viewbox="0 0 50 100">` + makeSVG("path", attr) + '</svg>';

	for(const i of range(n)){
		let d1=mDom(d0,{h:hs,w:ws},{html:shape});
	}
	console.log('rect',getRect(d0))
}

function drawCard0(h=100){
  var attr = {
    d: "M25 0 L50 50 L25 100 L0 50 Z",
		fill: 'url(#striped-green)',
		stroke: 'green'
  };
	// let shape = '<svg viewbox="-2 -2 54 104">' + makeSVG("path", attr) + '</svg>';
	let n=3;
	let shape = '<svg viewbox="-8 -8 50 100">' + makeSVG("path", attr) + '</svg>';
	let shapes='';
	for(const i of range(n)){shapes += shape;}
	//shape+shape; //+shape;

	//let w=h*(n==1?1.6;

	//let [w,h]=[100,24,100]; //2.13411458333
	//let d0=mDom('dMain',{w:h*1.6,bg:'white',vpadding:14,hpadding:15,box:true,rounding:10});//,{className:['card1','fill-green']});
	let d0=mDom('dMain',{w:150,bg:'white',rounding:10});//,{className:['card1','fill-green']});
	let d1=mDom(d0,{display:'flex'});//,{className:'card-content'});

	d1.innerHTML=shapes;

	console.log('rect',getRect(d0))
}
function onsockNewTable(x) {
  let table = x.table;
  //let tables = x.tables;
  //Serverdata.tables = tables;
  console.log('::SOCK new table:', table);
  showTables();
}
function rest(ckey) {

	let styles = { fg: color, h: sm, fz: sm, hline: sm, weight: 'bold' };
	for (const pos of ['tl', 'tr']) {
		let d1 = mDiv(d, styles, null, num);
		mPlace(d1, pos, 2, 2);
	}
	for (const pos of ['bl', 'br']) {
		let d1 = mDiv(d, styles, null, num);
		d1.style.transform = 'rotate(180deg)';
		mPlace(d1, pos, 2, 2);
	}
	let dbig = mDiv(d, { matop: (h - lg) / 2, family: 'algerian', fg: color, fz: lg, h: lg, w: w, hline: lg, align: 'center' }, null, num);
	//mPlace(dbig, 'cc');

	// mSize(ui, info.w, info.h);
	let res = {};
	copyKeys(info, res);
	copyKeys({ w: info.w, h: info.h, faceUp: true, div: d }, res);
	if (isdef(ov)) res.ov = ov;

	return res;
}
function rest(ckey) {
	let info = {};
	let color = stringAfter(ckey, '_');
	let num = stringBefore(ckey, '_');

	info.key = ckey;
	info.cardtype = 'num';
	let [r, s] = [info.rank, info.suit] = [Number(num), color];
	info.val = r; // Number(num);
	info.color = backcolor;
	let sz = info.sz = info.h = h;
	w = info.w = valf(w, sz * .7);

	//sorting index by rank and suit
	// if (!isList(Z.fen.ranks)) Z.fen.ranks = calcNumRanks(get_keys(Z.fen.players).length * Z.fen.handsize, 2, Z.fen.colors.length);
	// //console.log('ranks',Z.fen.ranks);
	// let ranks = valf(lookup(Z, ['fen', 'ranks']), range(100)); //Z.fen.ranks;
	// info.irank = ranks.indexOf(r);
	// info.isuit = valf(lookup(Z, ['fen', 'colors']), get_nc_color_array()).indexOf(s); //range(100));'SHCD'.indexOf(s);
	// info.isort = info.isuit * ranks.length + info.irank;

	//card face
	//let card = cBlank(dTable, { h: sz, w:w, border: 'silver' });
	//let dcard = mDiv(dTable,{h:h,w:w,rounding:4,bg:'white',border:'silver'});
	//console.log('________w',w)

	let d = mDom(null, { h: h, w: w, rounding: 4, bg: 'white', border: 'silver' }, { className: 'card' });
	//console.log('ui',d)

	//let d = iDiv(ui, { margin: 10 });
	let [sm, lg] = [sz / 8, sz / 4]

	let styles = { fg: color, h: sm, fz: sm, hline: sm, weight: 'bold' };
	for (const pos of ['tl', 'tr']) {
		let d1 = mDiv(d, styles, null, num);
		mPlace(d1, pos, 2, 2);
	}
	for (const pos of ['bl', 'br']) {
		let d1 = mDiv(d, styles, null, num);
		d1.style.transform = 'rotate(180deg)';
		mPlace(d1, pos, 2, 2);
	}
	let dbig = mDiv(d, { matop: (h - lg) / 2, family: 'algerian', fg: color, fz: lg, h: lg, w: w, hline: lg, align: 'center' }, null, num);
	//mPlace(dbig, 'cc');

	// mSize(ui, info.w, info.h);
	let res = {};
	copyKeys(info, res);
	copyKeys({ w: info.w, h: info.h, faceUp: true, div: d }, res);
	if (isdef(ov)) res.ov = ov;

	return res;
}


//#endregion

//#region app.js 
app.post('/testMerge', (req, res) => {
	let id = req.body.id;
	let odata = req.body.override;
	let mdata = req.body.merge;
	let newtable = req.body;

	let table = lookup(Session, ['tables', id]);
	let isNew = !table;
	if (isNew) table = newtable; else copyKeys(newtable, table);
	let isStarted = table.status == 'started';

	saveTable(id, table);
	let msg = `table posted: ${table.friendly} new:${isNew} status:${table.status}`;
	console.log(msg)
	let turn = isStarted ? table.fen.turn : [];
	io.emit('table', { msg, id, turn, isNew })
	res.json(msg);
});
app.post('/move', (req, res) => {
	let o = req.body;
	let [id, friendly, name, move, type, step, turn] = [o.id, o.friendly, o.name, o.move, o.type, o.step, o.turn];
	let ts = o.ts = new Date().getTime();
	console.log('=>move', step, name, ts);
	let table = Session.tables[id];

	if (step < table.step) { console.log('ignore', step, name); return res.json('ignore'); }
	lookupAddToList(Moves, [id], o);

	//1. alle players auf dieser table sollen den move erhalten
	console.log('players', table.playerNames)
	emitToPlayers(table.playerNames, 'move', { event: o, moves: Moves[id]}); //.slice(-2) });
	res.json(o); //return; //`move ${name} ${step} ${ts}`); return;

	//type can be r1=race only 1 per player, 
	// let m=lookup(Moves,[id,step,name]);

	// if (nundef(Moves[id])) Moves[id]=[];
	// if (nundef(Moves[id][step])) Moves[id].push({});
	// if (nundef(Moves[id][step][name])) Moves[id][step][name]={move,type,turn,ts};

	// if (type == 'race1'){
	// 	o.step++;
	// }

	// io.emit('move',o);
	// let msg=`move ${friendly} ${step} ${name} [${turn.join(',')}]`;
	// //console.log(msg);
	// res.json(msg);

});

function _handle_login(x, id) {
	console.log('::login:', x, id);
	byClient[id] = x;
	byUsername[x] = id;
	io.emit('message', `${x} logged in!`);
}

app.post('/postTable', (req, res) => {
	let id = req.body.id;
	let newtable = req.body;

	let isNew = nundef(Session.tables[id]);
	let isStarted = newtable.status == 'started';

	saveTable(id,newtable);
	//io.emit('tables',{tables:getTablesInfo(),table:newtable,isNew,isStarted});
	// if (isNew && !isStarted) io.emit('tables',getTablesInfo());
	// else if (isNew) 


	//let table = valf(Session.tables[id],{}); 
	//for(const k in req.body){		table[k]=req.body[k];	}
	// console.log('<== post newTable',id); //return;
	//saveTable(id,table);
	// io.emit('table',{table:table});
	// if (isdef(fen)) emitToPlayers(table.playerNames,'table',{tables:getTablesInfo(),table:table});
	// else io.emit('table',{tables:getTablesInfo(),table:table});
	let msg=`table posted: ${newtable.friendly} new:${isNew} status:${newtable.status}`;
	console.log(msg)
	io.emit('table',{msg,id})
	res.json(msg);
});
app.post('/postTable', (req, res) => {
	let id = req.body.id;
	let table = valf(Session.tables[id],{}); 
	for(const k in req.body){
		table[k]=req.body[k];
	}
	// console.log('<== post newTable',id); //return;
	saveTable(id,table);
	io.emit('table',{table:table});
	// if (isdef(fen)) emitToPlayers(table.playerNames,'table',{tables:getTablesInfo(),table:table});
	// else io.emit('table',{tables:getTablesInfo(),table:table});
	res.json(table);
});
app.post('/postTable', (req, res) => {
	let id = req.body.id;
	let table = valf(Session.tables[id],{}); 
	for(const k in req.body){
		table[k]=req.body[k];
	}
	// console.log('<== post newTable',id); //return;
	saveTable(id,table);
	//let fen = req.body.fen;
	io.emit('table',{table:table});
	// if (isdef(fen)) emitToPlayers(table.playerNames,'table',{tables:getTablesInfo(),table:table});
	// else io.emit('table',{tables:getTablesInfo(),table:table});
	res.json(table);
});
app.post('/postNewTable', (req, res) => {
	let id = req.body.id;
	let fen = req.body.fen;
	console.log('<== post newTable',id); //return;
	saveTable(id,req.body);
	//if (isdef(fen)) emitToPlayers(fen.playerNames,'newTable',{table:req.body});
	// if (isdef(fen)) emitToPlayers(fen.playerNames,'newTable',{tables:getTablesInfo(),table:req.body});
	// else io.emit('newTable',{tables:getTablesInfo(),table:req.body});
	io.emit('newTable',{table:req.body});
	res.json(`table ${id} posted successfully!`);
});

//#endregion

//#region 27.3.24
function handle_move(x){ 
	console.log('::move', arguments);  
	//console.log('Session tables',Session.tables)
	let table = lookup(Session,['tables',x.id]);
	//console.log('table',table);
	//wie kann ich temp move zu table saven?
	let fen = table.fen;
	let turn = fen.turn;
	console.log('turn',turn)
	let name = x.name;
	let move = x.move;

	//simplest:
	if (!turn.includes(name)) {console.log('!!!move mismatch',name,move);return;}
	lookupSetOverride(fen,['moves',name],move);
	removeInPlace(fen.turn,name)
	//save new fen when all players moved? or after each and every move?

	//broadcast fen
	io.emit('turnUpdate',fen.turn);


	// if (turn.includes(name)) {
	// 	lookupSet(table,['moves',name],x.move);
	// 	console.log('moves so far',table.moves);
	// }
	// //sobald alle slots gefuellt sind, setze fen.moves und broadcast
	// //jetzt kann jeder integrieren und updaten
	// let donelist = Object.keys(table.moves);
	// if (donelist.length == turn.length){
	// 	donelist.map(x=>fen.players[x].lastmove=)
	// }

}
async function _switchToMenu(menu) {
  console.log('====>switchToMenu', menu)
  Clientdata.lastMenu = menu;
  await mOnclick(menu);
}
async function _showTables() {
  Clientdata.table = null;
  Serverdata.tables = tables = await mGetRoute('tables');
  console.log('tables', tables);
  tables.map(x => x.prior = x.turn.includes(U.name) ? 1 : x.players.includes(U.name) ? 2 : 3);
  sortBy(tables, 'prior');
  
  let dParent=mBy('dTableList');
  if (isdef(dParent)) {mClear(dParent);}
  else dParent = mDom('dMain', {}, { className: 'section',id:'dTableList' });

  if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }
  tables.map(x => x.game_friendly = capitalize(x.game));
  mText(`<h2>game tables</h2>`, dParent, { maleft: 12 })
  let t = mDataTable(tables, dParent, null, ['friendly', 'game_friendly', 'players'], 'tables', false);
  mTableCommandify(t.rowitems, {
    0: (item, val) => hFunc(val, 'onclickTable', item.o.id, item.id),
  });
  let d = iDiv(t);
  for (const ri of t.rowitems) {
    let r = iDiv(ri);
    //console.log('ri',ri)
    if (ri.o.prior == 1) mDom(r, {}, { tag: 'td', html: get_waiting_html(24) }); //'my turn!'});
    let h = hFunc('delete', 'deleteTable', ri.o.id);
    c = mAppend(r, mCreate('td'));
    c.innerHTML = h;
  }
}
async function _openToJoinGame() {
	let gamename = DA.gamename;
	// let options = collect_game_specific_options(gamename);
	//console.log(Serverdata,DA)
	let poss = Serverdata.config.games[gamename].options;
	if (nundef(poss)) return;
	let options = {};
	for (const p in poss) {
		let fs = mBy(`d_${p}`);
		let val = get_checked_radios(fs)[0];
		options[p] = isNumber(val) ? Number(val) : val;
	}
	let players = DA.playerlist ? DA.playerlist.map(x => ({ name: x.uname, playmode: x.playmode, strategy: valf(x.strategy, options.strategy, 'random') })) : create_random_players(options.nplayers);
	console.log('DA', DA);
	console.log(gamename, players, options);

}
function _showUserImage(uname,d,sz){
	let u=Serverdata.users[uname];
	showim1(u.key,d,{h:sz,w:sz,round:true,border:`${u.color} 2px solid`});
}
function toggle_select(item, selected, selstyle = 'selected') {
  let ui = iDiv(item);
  item.isSelected = !item.isSelected;
  if (item.isSelected) {
    mStyleOrClass(ui, selstyle);
  } else if (isString(selstyle)) {
    mClassRemove(ui, selstyle);
  } else if (isdef(item.style)) {
    mStyle(ui, item.style);
  } else {
    mStyleUndo(ui, selstyle);
  }
  if (isdef(selected)) {
    if (isList(selected)) {
      if (item.isSelected) {
        console.assert(!selected.includes(item), 'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
        selected.push(item);
      } else {
        console.assert(selected.includes(item), 'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
        removeInPlace(selected, item);
      }
    } else {
      mStyle(iDiv(selected), selected.style);
      selected.isSelected = false;
    }
  }
  return item.isSelected ? item : null;
}

function userToM(o){
	let m={};
	for(const k in o){
		if (k=='icon') m.img=`../assets/img/users/${o[k]}.jpg`;
		else m[k]=o[k];
	}
	return m;
}
function _uiTypeCheckList(lst,dParent,styles={},opts={}){
	let d = mDom(dParent,{overy:'auto'}); //hier drin kommt die liste!
	lst.forEach((text, index) => {
		let dcheck=mDom(d,{},{tag:'input',type:'checkbox',name:text,value:text,id:`ch_${index}`});
		let dlabel=mDom(d,{},{tag:'label',for:dcheck.id,html:text});
		mNewline(d,0);
	});
	let r=getRect(d); //console.log('r',r); //soviel braucht die liste
	let rp=getRect(dParent); console.log('rp',rp);
	let hParent = rp.h;
	if (hParent == 0) hParent = mGetStyle(dParent,'max-height');
	console.log('hParent',hParent);
	let p=mGetStyle(dParent,'pabottom'); console.log('pb',p,mGetStyle(dParent,'padding'))
	let h=hParent-r.y; //-p;
	mStyle(d,{hmax:h});//,pabottom:10,box:true});
	return d;
	//check all the boxes that are set for this element

	//mButton('done',)
}
function uiGadgetTypeCheckListInput(form, content, styles, opts) {


	//was soll der content sein? wo soll der content berechnet werden?
	// addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
	let dOuter = mDom(form, styles)
	// let d=mDom(form,{bg:'white'})
	let dParent = mDom(dOuter, { pabottom: 10, box: true }); //,bg:'blue',fg:'contrast'});

	// console.log('content', content)
	// let lst = content.map(x => x.name);
	// console.log('lst', lst)

	let ui = uiTypeCheckListInput(content, dParent, styles, opts);
	
	//let [chlist, inp] = [ui.chlist, ui.inp];
	//console.log('ui',ui);




	//console.log('ui', ui)

	//onclick: () => form.setAttribute('proceed', 'yes')

	// mButton('done', () => {
	// 	let cur=extractWords(inp.value);
	// 	let checked = getCheckedNames(ui);
	// 	for(const c of checked) addIf(cur,c);
	// }, dOuter, { classes: 'input', margin: 10 }); //da muss noch ein button dazu

	return () => extractWords(ui.inp.value,' ');

	//muss eine evalfunc returnen!!!
}
function mergeInputAndChecklist(inp, chlist) {
	let cur = extractWords(inp.value);
	let checked = getCheckedNames(chlist);
	for (const c of checked) addIf(cur, c);
	cur.sort();
	inp.value = cur.join(', ');
}

function _uiTypeCheckListInput(lst, dParent, styles = {}, opts = {}) {

	let inp = mDom(dParent, styles, { className: 'input', tag: 'input', type: 'text' });


	// let chlist = uiTypeCheckList(lst, dParent, styles, opts);
	let d = mDom(dParent,{overy:'auto'}); //hier drin kommt die liste!
	//console.log('lst',lst)
	lst.forEach((o, index) => {
		let [text,value]=[o.name,o.value];
		let dcheck=mDom(d,{},{tag:'input',type:'checkbox',name:text,value:text,id:`ch_${index}`,checked:value});
		//dcheck.checked = value;
		let dlabel=mDom(d,{},{tag:'label',for:dcheck.id,html:text});
		mNewline(d,0);
	});
	let r=getRect(d); //console.log('r',r); //soviel braucht die liste
	let rp=getRect(dParent); //console.log('rp',rp);
	let hParent = rp.h;
	if (hParent == 0) hParent = mGetStyle(dParent,'max-height');
	//console.log('hParent',hParent);
	let p=mGetStyle(dParent,'pabottom'); //console.log('pb',p,mGetStyle(dParent,'padding'))
	let h=hParent-r.y; //-p;
	mStyle(d,{hmax:h});//,pabottom:10,box:true});
	let chlist= d;


	
	inp.value = getCheckedNames(chlist).join(', ');
	mStyle(inp, { w100: true })
	let chks = arrChildren(chlist);
	for (const chk of chks) {
		chk.addEventListener('click', () => mergeInputAndChecklist(inp, chlist));
	}
	return { inp, chlist };
}
function uiTypeCheckListInput(lst, dParent, styles = {}, opts = {}) {

	let inp = mDom(dParent, styles, { className: 'input', tag: 'input', type: 'text' });


	// let chlist = uiTypeCheckList(lst, dParent, styles, opts);
	let d = mDom(dParent,{overy:'auto'}); //hier drin kommt die liste!
	//console.log('lst',lst)
	lst.forEach((o, index) => {
		let [text,value]=[o.name,o.value];
		let dcheck=mDom(d,{},{tag:'input',type:'checkbox',name:text,value:text,id:`ch_${index}`,checked:value});
		//dcheck.checked = value;
		let dlabel=mDom(d,{},{tag:'label',for:dcheck.id,html:text});
		mNewline(d,0);
	});
	let r=getRect(d); //console.log('r',r); //soviel braucht die liste
	let rp=getRect(dParent); //console.log('rp',rp);
	let hParent = rp.h;
	if (hParent == 0) hParent = mGetStyle(dParent,'max-height');
	//console.log('hParent',hParent);
	let p=mGetStyle(dParent,'pabottom'); //console.log('pb',p,mGetStyle(dParent,'padding'))
	let h=hParent-r.y; //-p;
	mStyle(d,{hmax:h});//,pabottom:10,box:true});
	let chlist= d;


	
	inp.value = getCheckedNames(chlist).join(', ');
	mStyle(inp, { w100: true })
	let chks = arrChildren(chlist);
	for (const chk of chks) {
		chk.addEventListener('click', () => mergeInputAndChecklist(inp, chlist));
	}
	return { inp, chlist };
}
function arrMinMax(arr, func) {
  if (nundef(func)) func = x => x;
  else if (isString(func)) func = x=>x[func];
  let min = func(arr[0]), max = func(arr[0]), imin = 0, imax = 0;
  for (let i = 1, len = arr.length; i < len; i++) {
    let v = func(arr[i]);
    if (v < min) {
      min = v; imin = i;
    } else if (v > max) {
      max = v; imax = i;
    }
  }
  return { min: min, imin: imin, max: max, imax: imax, elmin: arr[imin], elmax: arr[imax] };
}
function uiTypeCheckListInput(lst, dParent, styles = {}, opts = {}) {
	let inp = mDom(dParent, styles, { className: 'input', tag: 'input', type: 'text' });
	let chlist = uiTypeCheckList(lst, dParent, styles, opts);
	inp.value = getCheckedNames(chlist).join(', ');
	mStyle(inp, { w100: true })
	let chks = arrChildren(chlist);
	for (const chk of chks) {
		chk.addEventListener('click', () => mergeInputAndChecklist(inp, chlist));
	}
	return { inp, chlist };
}
function mergeInputAndChecklist(inp, chlist) {
	let cur = extractWords(inp.value);
	let checked = getCheckedNames(chlist);
	for (const c of checked) addIf(cur, c);
	cur.sort();
	inp.value = cur.join(', ');
}
function uiGadgetTypeCheckListInput(form, content, styles, opts) {


	//was soll der content sein? wo soll der content berechnet werden?
	// addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	addKeys({ w: 600, bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
	let dOuter = mDom(form, styles)
	// let d=mDom(form,{bg:'white'})
	let dParent = mDom(dOuter, { hmax: 510, wmax: 200, pabottom: 10, box: true }); //,bg:'blue',fg:'contrast'});

	// console.log('content', content)
	// let lst = content.map(x => x.name);
	// console.log('lst', lst)

	let ui = uiTypeCheckListInput(content, dParent, styles, opts);
	let [chlist, inp] = [ui.chlist, ui.inp];
	//console.log('ui',ui);




	//console.log('ui', ui)

	//onclick: () => form.setAttribute('proceed', 'yes')

	// mButton('done', () => {
	// 	let cur=extractWords(inp.value);
	// 	let checked = getCheckedNames(ui);
	// 	for(const c of checked) addIf(cur,c);
	// }, dOuter, { classes: 'input', margin: 10 }); //da muss noch ein button dazu

	return () => extractWords(inp.value);

	//muss eine evalfunc returnen!!!
}
async function onclickCatListDone(ui){
	//let ui=ev.target.parentNode;
	let checks=Array.from(ui.getElementsByTagName('input'));
	//console.log('checkboxes',checks,checks[0]);
	// DA.x = checks[0];
	let cats=[];
	for(const ch of checks) {
		if (ch.checked) cats.push(ch.name);
	}
	//console.log('cats',cats);

	ui.setAttribute('proceed',cats.join('@'));

}
async function _mGather(dAnchor, styles = {}, opts = {}) {
	return new Promise((resolve, _) => {
		let [content, type, align] = [valf(opts.content, 'name'), valf(opts.type, 'text'), valf(opts.align, 'bl')];

		let d = document.body;
		let dialog = mDom(d, { bg: '#00000040', box: true, w: '100vw', h: '100vh' }, { tag: 'dialog' });

		let rect = dAnchor.getBoundingClientRect();

		let [v, h] = [align[0], align[1]];
		let vPos = v == 'b' ? { top: rect.bottom } : v == 'c' ? { top: rect.top } : { bottom: rect.top };
		let hPos = h == 'l' ? { left: rect.left } : v == 'c' ? { left: rect.left } : { right: window.innerWidth - rect.right };

		let formStyles = { position: 'absolute' };
		addKeys(vPos, formStyles);
		addKeys(hPos, formStyles); //,top:rect.bottom,right:}; //,bg:'red'}; //,w:100,h:100};
		let form = mDom(dialog, formStyles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
		dialog.addEventListener('click', ev => {if (isPointOutsideOf(form,ev.clientX,ev.clientY)){ resolve(null); dialog.remove(); }});
		dialog.addEventListener('keydown', ev => { if (ev.key === 'Escape') { dialog.remove(); resolve(null); } });

		let evalFunc = type == 'multi' ? uiGadgetTypeMulti(form, content, styles, opts) :
			type == 'text' ? uiGadgetTypeText(form, content, styles, opts) :
				type == 'yesno' ? uiGadgetTypeYesNo(form, content, styles, opts) :
				type == 'select' ? uiGadgetTypeSelect(form, content, styles, opts) :
					uiGadgetTypeText(form, content, styles, opts);

		console.log('evalFunc',evalFunc)
		dialog.showModal();
		form.onsubmit = (ev) => { ev.preventDefault(); resolve(evalFunc()); dialog.remove(); };
	});
}
function collInitCollection(name, coll) {
	console.log('name',name,'coll',coll.name,coll.index,coll.pageIndex);
	if (nundef(coll.index) || isdef(coll.name) && coll.name!=name) {coll.index = 0; coll.pageIndex = 1; coll.name = name; }
	
	let list = [];
	if (name == 'all' || isEmpty(name)) {
		list = Object.keys(M.superdi);
	} else if (isdef(M.byCollection[name])) {
		list = M.byCollection[name];
	} else list = []; //return;
	if (coll == UI.collPrimary) localStorage.setItem('collection', name)
	let dMenu = coll.dMenu;
	mClear(dMenu);
	let d = mDom(dMenu); mFlexV(d);
	mDom(d, { fz: 24, weight: 'bold' }, { html: 'Collection:' });
	let colls = M.collections;
	// mDom(dMenu, {}, { html: '' });

	let dlColl = mDatalist(d, colls, { placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value, coll);
	//dlColl.inpElem.onlostfocus = ev => ev.target.value=coll.name;
	dlColl.inpElem.value = name;
	coll.masterKeys = list; 
	let cats = collectCats(list);
	cats.sort();
	d = mDom(dMenu); mFlexV(d);
	let wLabel = coll.cols < 6 ? 117 : 'auto';
	mDom(d, { fz: 24, weight: 'bold', w: wLabel, align: 'right' }, { edit:true, html: 'Filter:' });
	// mDom(d, {  }, { html: '<h2>Filter:</h2>' });
	let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>" });
	dlCat.inpElem.oninput = collFilterImages;

	//let wButtons=coll.w<650?'100%':'auto'; // mDom(dMenu,{h:1,w100:true})
	d = mDom(dMenu, { gap: 10, align: 'right' });
	if (coll.cols < 6) mStyle(d, { w100: true }); //?true:false
	if (coll == UI.collSecondary) mButton('done', onclickCollDone, d, { w: 70, margin: 0, maleft: 10 }, 'input');
	mButton('prev', onclickCollPrev, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bPrev');
	mButton('next', onclickCollNext, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bNext');
	coll.keys = list;
	
	collClearSelections();
	showImageBatch(coll);
	//showDiv(dMenu); return;
}
async function onclickAddCategories() {
	let selist = UI.selectedImages; console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let catlist = M.categories.map(x => ({ name: x, value: false }));

	// let arrs=keys.map(x=>M.superdi[x].cats); 
	// let inter = intersectionOfArrays(arrs);	console.log('inter',inter);
	// for(const c of catlist){c.val=inter.includes(c.name);	}

	let cats = await mGather(iDiv(UI.addCategory), {}, { content: catlist, type: 'checklist' });
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(cats)) { console.log('nothing added'); collClearSelections(); return; }
	console.log('add cats:', cats);

	let di = {}, changed = false;
	for (const kc of selist) {
		let key = stringBefore(kc, '@');
		let o = M.superdi[key];
		for (const cat of cats) {
			if (o.cats.includes(cat)) continue;
			changed = true;
			o.cats.push(cat);
			di[key] = o;
		}
	}


	if (!changed) { console.log('nothing added'); collClearSelections(); return; }
	console.log('items changed:',Object.keys(di));

	let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: [] });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();
	UI.selectedImages = [];



}
async function onclickAddCategories() {
	let selist = UI.selectedImages; console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let catlist = M.categories.map(x => ({ name: x, value: false }));

	// let arrs=keys.map(x=>M.superdi[x].cats); 
	// let inter = intersectionOfArrays(arrs);	console.log('inter',inter);
	// for(const c of catlist){c.val=inter.includes(c.name);	}

	let cats = await mGather(iDiv(UI.addCategory), {}, { content: catlist, type: 'checklist' });
	cats = cats.split('@');
	cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(cats)) { console.log('nothing added'); collClearSelections(); return; }
	console.log('add cats:', cats);
	return;

	let di = {}, changed = false;
	for (const kc of selist) {
		let key = stringBefore(kc, '@');
		let o = M.superdi[key];
		for (const cat of cats) {
			if (o.cats.includes(cat)) continue;
			changed = true;
			o.cats.push(cat);
			di[key] = o;
		}
	}


	if (!changed) { console.log('nothing added'); collClearSelections(); return; }

	let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: [] });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();
	//collClearSelections();
	UI.selectedImages = [];



}
async function onclickEditCategories() {
	let selist = UI.selectedImages; console.log('selist', selist)
	let keys = selist.map(x => stringBefore(x, '@'));
	let catlist = M.categories.map(x => ({ name: x }));
	let arrs = keys.map(x => M.superdi[x].cats);
	let inter = intersectionOfArrays(arrs); console.log('inter', inter);
	for (const c of catlist) { c.val = inter.includes(c.name); }

	let cats = await mGather(iDiv(UI.editCategories), {}, { content: catlist, type: 'checklist' });
	cats = cats.split('@');
	console.log('user selected', cats, typeof cats);

	//jetzt muss ich nur noch all die selected zu diesen cats setzen

}
async function hallo() {
	return;
	let cat = await mGather(iDiv(UI.editCategories), {}, { content: M.categories, type: 'select' });
	console.log('selected cat', cat); return;
	//console.log('addCategpory', selist);
	let di = {};
	for (const k of selist) {
		let o = collKeyCollnameFromSelkey(k);
		let key = o.key;
		await collDeleteOrRemove(key, collname, di, deletedKeys[collname]);
	}
	let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: [] });
	console.log('postUpdateSuperdi', k, res)
	await loadAssets();
	collPostReload();
	UI.selectedImages = [];
}

function uiGadgetTypeText(form, content, styles = {}, opts = {}) {
	//type text: hier kommen jetzt verschiedene options acc to type!

	let inp = mDom(form, styles, { className: 'input', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	//let inputStyles = {w:100,margin:0}; 
	// let inp = mDom(form, inputStyles, { className: 'input', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	//let inputStyles = { bg: 'white', align: 'center', vpadding: 3, hpadding: 6, matop: 2 }; // outline: 'none', w: 130, margin:0 }
	// let inp = mDom(form, inputStyles, { className: 'reset', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return () => inp.value;
}
async function mGather(dAnchor, styles = {}, opts = {}) {
	return new Promise((resolve, _) => {
		let [content, type, align] = [valf(opts.content, 'name'), valf(opts.type, 'text'), valf(opts.align, 'bl')];

		let d = document.body;
		let dialog = mDom(d, { bg: '#00000040', box: true, w: '100vw', h: '100vh' }, { tag: 'dialog' });

		let rect = dAnchor.getBoundingClientRect();//getRect(dAnchor);

		let [v, h] = [align[0], align[1]];
		let vPos = v == 'b' ? { top: rect.bottom } : v == 'c' ? { top: rect.top } : { bottom: rect.top };
		let hPos = h == 'l' ? { left: rect.left } : v == 'c' ? { left: rect.left } : { right: window.innerWidth - rect.right };

		let formStyles = { position: 'absolute' };
		addKeys(vPos, formStyles);
		addKeys(hPos, formStyles); //,top:rect.bottom,right:}; //,bg:'red'}; //,w:100,h:100};
		let form = mDom(dialog, formStyles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
		dialog.addEventListener('click', ev => {if (isPointOutsideOf(form,ev.clientX,ev.clientY)){ resolve(null); dialog.remove(); }});
		// 	const [r,x, y] = [form.getBoundingClientRect(),ev.clientX, ev.clientY];
		// 	if (x < r.left || x > r.right || y < r.top || y > r.bottom) { resolve(null); dialog.remove(); }
		// });
		dialog.addEventListener('keydown', ev => { if (ev.key === 'Escape') { dialog.remove(); resolve(null); } });

		let evalFunc = type == 'multi' ? uiGadgetTypeMulti(form, content, styles, opts) :
			type == 'text' ? uiGadgetTypeText(form, content, styles, opts) :
				type == 'yesno' ? uiGadgetTypeYesNo(form, content, styles, opts) :
					uiGadgetTypeText(form, content, styles, opts);

		// if (isdef(opts.cancel)) {
		// 	//add a cancel button to the dialog!
		// 	mDom(form,{w:70},{className:'input',onclick:})
		// }

		dialog.showModal();
		form.onsubmit = (ev) => { ev.preventDefault(); resolve(evalFunc()); dialog.remove(); };
	});
}

async function collDelete(collname) {
	if (collLocked(collname) || !collExists(collname)) return;
	let keys = M.byCollection[collname];
	console.log('_________delete collection', keys)
	collPreReload(collname);
	let di={},deletedKeys=[]; //,needToRenameImgDir=false,newdir=null;
	for (const k of keys) {
		let item = M.superdi[k];
		console.log('item', item)
		let colls = item.colls;
		console.log('colls',colls)
		assertion(colls.includes(collname),`item ${k} from coll ${collname} does not have ${collname} in colls!!!!!!`)
		if (colls.length == 1) {
			console.log('deleting',k,'!!!!!!!!!!!!');
			deletedKeys.push(k);
		}else if (isdef(item.img) && item.img.includes(`/${collname}/`)){
			removeInPlace(item.colls,collname);
			//move this img to other collname, create it if it does not exist!!!

			let olddir = collname;
			let newdir=item.colls[0];
			let filename = stringBeforeLast(item.img,'/');
			//item.img=`../assets/img/${newdir}/`
			item.img = item.img.replace(olddir,newdir);

			let resp = await mPostRoute('moveImage',{olddir,newdir,filename});
			console.log('moveImage:',resp)
			// needToRenameImgDir={oldname:collname,newname:newpath};

			//bei einem key den ich nicht delete! muss ich colls aendern!
			//console.log('item',item);
			// removeInPlace(item.colls,collname);
			di[k]=item;
		}else{
			//this pic cannot be deleted! also: the key cannot be deleted!!!
			//bei einem key den ich nicht delete! muss ich colls aendern!
			//console.log('item',item);
			removeInPlace(item.colls,collname);
			di[k]=item;
			//res = await mPostRoute('postUpdateItem', { key: k, item:item });
		}
	}

	let res = await mPostRoute('postUpdateSuperdi',{di,deletedKeys,collname});
	console.log('postUpdateSuperdi',res)
	await loadAssets();

	collPostReload(); //	delete M.byCollection[collname];


}

function mDatalist(dParent, list, opts = {}) {

	var mylist = list;
	var opts = opts;
	addKeys({ alpha: true, filter: 'contains' }, opts);
	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, { w: 180, maleft: 4 }, { tag: 'input', className: 'input', placeholder: valf(opts.placeholder, '') });
	mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
	var elem = d;
	var inp = elem.firstChild;
	var datalist = elem.lastChild;
	for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }
	inp.setAttribute('list', optid);
	if (opts.onupdate) {
		inp.addEventListener('keyup', opts.onupdate);
	} else if (isdef(opts.edit)) {
		console.log('sssssssssssssssssssssssss')
		//nothing
		inp.onmousedown = () => inp.value = '';
		//NOOO!! datalist.onlostfocus = ()=>console.log('LOST FOCUS!@!!') NEIN GEHT SO NICHT!!!
		// inp.onblur = () => {
		// 	const isValueSelected = !isEmpty(inp.value); //list.includes(inp.value);
		// 	if (!isValueSelected) {
		// 		inp.value = inp.getAttribute('prev_value'); // Restore the previous value if no selection is made
		// 	}
		// }
		// inp.onmousedown = () => { if (!isEmpty(inp.value)) inp.setAttribute('prev_value', inp.value); inp.value = ''; }
	} else {
		inp.onblur = () => {
			const isValueSelected = list.includes(inp.value);
			if (!isValueSelected) {
				inp.value = inp.getAttribute('prev_value'); // Restore the previous value if no selection is made
			}
		}
		inp.onmousedown = () => { inp.setAttribute('prev_value', inp.value); inp.value = ''; }
		//NOOO!! datalist.onlostfocus = ()=>console.log('LOST FOCUS!@!!') NEIN GEHT SO NICHT!!!
	}

	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
	}
}
async function mGather_1_W(dAnchor, styles = {}, opts = {}) {
	let [content, type, align] = [valf(opts.content, 'name'), valf(opts.type, 'text'), valf(opts.align, 'bl')];

	let d = document.body;
	let dialog = mDom(d, { bg: '#00000040', box: true, w: '100vw', h: '100vh' }, { tag: 'dialog' });

	let rect = dAnchor.getBoundingClientRect();//getRect(dAnchor);

	let [v, h] = [align[0], align[1]];
	let vPos = v == 'b' ? { top: rect.bottom } : v == 'c' ? { top: rect.top } : { bottom: rect.top };
	let hPos = h == 'l' ? { left: rect.left } : v == 'c' ? { left: rect.left } : { right: window.innerWidth - rect.right };

	let formStyles = { position: 'absolute' };
	addKeys(vPos, formStyles);
	addKeys(hPos, formStyles); //,top:rect.bottom,right:}; //,bg:'red'}; //,w:100,h:100};
	let form = mDom(dialog, formStyles, { autocomplete: 'off', tag: 'form', method: 'dialog' });

	let evalFunc = type == 'text' ? uiGadgetTypeText(form, content, styles, opts) :
		type == 'yesno' ? uiGadgetTypeYesNo(form, content, styles, opts) :
			uiGadgetTypeText(form, content, styles, opts);

	// if (isdef(opts.cancel)) {
	// 	//add a cancel button to the dialog!
	// 	mDom(form,{w:70},{className:'input',onclick:})
	// }

	return new Promise((resolve, _) => {
		dialog.showModal();
		form.onsubmit = (ev) => { ev.preventDefault(); resolve(evalFunc()); dialog.remove(); };
	});
}
async function mGather(dAnchor, styles = {}, opts = { label: 'name' }) {
	//open a 1 text gadget that anchors to UI.newCollection command div
	let d = dAnchor;
	let rect = getRect(d);
	let gadget = mGadget(opts.label, { padding: 0, maleft: 8, right: 0, top: rect.b });//, { placeholder: `<enter name>` });
	//console.log(gadget)
	let result = await mPrompt(gadget);
	return result;
}
async function onclickUser() {
	//let gadget = UI.gadgetUsername;
	//let uname = await mPrompt(gadget);
	//console.log('username is',uname)
	//console.log('onclickUser')
	let uname = await mGather(iDiv(UI.user),{},{content:'username',align:'br',placeholder:' <username> '});

	//console.log('username is',uname)
	await switchToUser(uname);
}
async function mist() {
	return;
	let [wd, hd] = [mGetStyle(dialog, 'w'), mGetStyle(dialog, 'h')]

	let rect = dAnchor.getBoundingClientRect();//getRect(dAnchor);
	console.log('dAnchor', dAnchor, rect);
	let rReal = window.innerWidth - rect.right; //(rect.left+rect.width);
	console.log('right', rReal)

	// return;
	// console.log('dia',wd,window.innerWidth,rect.r,window.innerWidth-rect.r)

	//zeichne ein div direct unter dAnchor

	addKeys({ position: 'fixed', display: 'inline-block', padding: 0, margin: 0, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	let d1 = mDom(form, { position: 'fixed', top: rect.b, left: rect.l, w: rect.w, h: rect.h, bg: 'red' }); //,padding:mGetStyle(dAnchor,'padding')}); 
	return new Promise((resolve, reject) => {
		dialog.showModal();
		form.onsubmit = (ev) => {
			ev.preventDefault(); // Prevent the default form submission
			// resolve(getResult111()); //inp.value);
			// cleanup111(); //inp.value = '';
			resolve(getResult111()); //inp.value);
			//inp.value = '';
			//dialog.close();
			dialog.remove();
		};
	});

}
async function rest() {

	console.log('rect', rect)

	//console.log('s',window.innerWidth-rect.r)
	//use opts.align fuer [tcb] [lcr]
	addKeys({ align: 'bl' }, opts);

	switch (opts.align[0]) {
		case 't': addKeys({ bottom: rect.t }, styles); break;
		case 'b': addKeys({ top: rect.b }, styles); break;
		default: addKeys({ top: rect.t }, styles); break;
	}
	switch (opts.align[1]) {
		case 'l': addKeys({ left: rect.l }, styles); break;
		case 'r': addKeys({ right: window.innerWidth - rect.r }, styles); break;
		default: addKeys({ left: rect.l }, styles); break;
	}

	console.log('styles', styles)
	//addKeys({ right: 0, top: rect.b }, styles);
	let [content, type] = [valf(opts.content, 'name'), valf(opts.type, 'text')];

	// let gadget = mGadget(content, { padding:0, maleft:8, left: rect.l, top: rect.b });//, { placeholder: `<enter name>` });
	//let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog' });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 0, margin: 0, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });

	//type text: hier kommen jetzt verschiedene options acc to type!
	let inp = mDom(form, { outline: 'none', w: 130, margin: 0 }, { className: 'input', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });

	let getResult111 = () => inp.value;
	//let cleanup111= ()=>inp.value='';


	return new Promise((resolve, reject) => {
		dialog.showModal();
		form.onsubmit = (ev) => {
			ev.preventDefault(); // Prevent the default form submission
			// resolve(getResult111()); //inp.value);
			// cleanup111(); //inp.value = '';
			resolve(getResult111()); //inp.value);
			//inp.value = '';
			//dialog.close();
			dialog.remove();
		};
	});


}

async function mGather(dAnchor, styles = {}, opts = {}) { 
	let [content, type] = [valf(opts.content, 'name'), valf(opts.type, 'text')]; 

	let d = document.body;
	let dialog = mDom(d,{bg:'#ff000040',box:true,w:'100vw',h:'100vh'},{tag:'dialog'});

	let rect = dAnchor.getBoundingClientRect();//getRect(dAnchor);

	let [v,h]=[opts.align[0],opts.align[1]];
	let vPos=v=='b'?{top:rect.bottom}:v=='c'?{top:rect.top}:{bottom:rect.top};
	let hPos=h=='l'?{left:rect.left}:v=='c'?{left:rect.left}:{right:window.innerWidth-rect.right};

	let formStyles = {position:'absolute'};
	addKeys(vPos,formStyles);
	addKeys(hPos,formStyles); //,top:rect.bottom,right:}; //,bg:'red'}; //,w:100,h:100};
	let form = mDom(dialog,formStyles,{ autocomplete: 'off', tag: 'form', method: 'dialog' });

	//type text: hier kommen jetzt verschiedene options acc to type!
	let inputStyles = {bg:'white',align:'center',vpadding:3,hpadding:6,matop:2}; // outline: 'none', w: 130, margin:0 }
	let inp = mDom(form, inputStyles, { className:'reset', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	let getResult111 = () => inp.value;

	return new Promise((resolve, reject) => {
		dialog.showModal();
		form.onsubmit = (ev) => {
			ev.preventDefault(); // Prevent the default form submission
			// resolve(getResult111()); //inp.value);
			// cleanup111(); //inp.value = '';
			resolve(getResult111()); //inp.value);
			//inp.value = '';
			//dialog.close();
			dialog.remove();
		};
	});

	// dialog.showModal();
	// inp.focus();
}
//#endregion

//#region gadgets mprompt WORKS!
function mGadget(name, styles = {}, opts = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${name}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { name, dialog, form, inp }
}
function mGadgetList(namelist, styles = {}, opts = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });

	let inputs = {};
	for (const name of namelist) {
		let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${name}>`) });
		inputs[name] = inp;
	}
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { namelist, dialog, form, inputs }
}
function mGadget1(name, styles = {}, opts = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${name}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { name, dialog, form, inp }
}
function mGadgetYesNo(question, styles = {}, opts = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${question}` });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	//let form = mDom(dialog);
	let dq=mDom(form,{},{html:question});
	let bYes = mDom(form,{},{html:'Yes',tag:'button',onclick:()=>form.setAttribute('proceed','yes')})
	let bNo = mDom(form,{maleft:10},{html:'No',tag:'button',onclick:()=>form.setAttribute('proceed','no')})
	// let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: question, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${question}>`) });
	// mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { name: question, dialog, form, bYes, bNo }
}

async function mGather1(dAnchor,label='name'){
	//open a 1 text gadget that anchors to UI.newCollection command div
	let d=dAnchor;
	let rect=getRect(d);
	let gadget = mGadget(label, { padding:0, maleft:8, left: rect.l, top: rect.b });//, { placeholder: `<enter name>` });
	//console.log(gadget)
	let result = await mPrompt(gadget);
	return result;
}
async function mGatherYesNo(dAnchor,label){
	//open a 1 text gadget that anchors to UI.newCollection command div
	let d=dAnchor;
	let rect=getRect(d);
	let gadget = mGadgetYesNo(label, { bg:'white',padding:10, maleft:8, left: rect.l, top: rect.b });//, { placeholder: `<enter name>` });
	//console.log(gadget)
	let result = await mPPP(gadget);
	return result;
}
async function mPromptGadgetFor(cell, placeholderName, onCancel) {
	let rect = getRect(cell); //,document.body);
	console.log('rect', rect)
	let gadget = mGadget(placeholderName, { padding: 0, position: 'absolute', left: rect.l, top: rect.t + rect.h });
	console.log('gadget', gadget);

	if (isdef(onCancel)) {
		let dia = gadget.dialog;
		mButton('Cancel', onCancel, dia);
		dia.oncancel = onCancel;
	}
	let res = await mPrompt(gadget);
	return res;

}

async function mPrompt(gadget) {
	return new Promise((resolve, reject) => {
		//console.log('form', gadget.form);
		gadget.dialog.showModal();
		//gadget.inp.focus();
		gadget.form.onsubmit = (event) => {
			event.preventDefault(); // Prevent the default form submission
			resolve(gadget.inp.value);
			gadget.inp.value = '';
			gadget.dialog.close();
		};
	});
}
async function mPPP(gadget) {
	return new Promise((resolve, reject) => {
		//console.log('form', gadget.form);
		gadget.dialog.showModal();
		gadget.bNo.focus();
		//gadget.inp.focus();
		gadget.form.onsubmit = (event) => {
			event.preventDefault(); // Prevent the default form submission
			let data=gadget.form.getAttribute('proceed'); //new FormData(gadget.form);
			//console.log('data',data)
			resolve(data=='yes');
			//if (data) resolve(); else reject()
			//gadget.inp.value = '';
			gadget.dialog.close();
		};
	});
}


//#endregion
//#region collection zeug!
function confirmYesNo(question) {
  const result = prompt(question + "\n\n(Yes/No)");

  if (result !== null) {
    const trimmedResult = result.trim().toLowerCase();
    return trimmedResult === "yes";
  } else {
    return null; // If the user cancels the prompt
  }
}

async function onclickNewCollection(name) {

	//

	if (nundef(name)) name = await mPrompt(UI.gadgetNewCollection);
	UI.collSecondary.name = name;
	collOpenPrimary(4, 4);
	collOpenSecondary(4, 3);
}
async function onclickDeleteCollection(name) {
	
	if (nundef(name)) name = await mPrompt(UI.gadgetDeleteCollection);
	await collDelete(name);
}
async function onclickRenameCollection(name) {
	
	if (nundef(name)) name = await mPrompt(UI.gadgetRenameCollection);
	await collRename(name);
}
function collSidebar() {

	mStyle('dLeft', { wmin: 100 });
	let d = mDom('dLeft', { margin: 10, matop: 100 }); //,fg:getThemeFg()});

	//let c1=mDom(d,{padding:4},{html:'new collection',className:'nav-link'})
	let c1 = UI.newCollection = mCommand(d, 'newCollection', 'New / Edit');
	UI.gadgetNewCollection = mGadget('newCollection', { left: 16, top: 160 }, { placeholder: `<enter name>` });

	mDom(d, { h: 1 })

	let c2 = UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection');
	UI.gadgetDeleteCollection = mGadget('deleteCollection', { left: 16, top: 190 }, { placeholder: `<enter name>` });

	mDom(d, { h: 1 })

	let c3 = UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection');
	UI.gadgetDeleteCollection = mGadget('deleteCollection', { left: 16, top: 190 }, { placeholder: `<enter name>` });
}
async function rest(url,dDrop){


	let dParent = mPopup('Editor',document.body);//,{bg:'blue'},'dCollEditPopup');
	return;
	let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 300];
	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	mIfNotRelative(d);
	mStyle(img, { h: sz });
	mAppend(d, img);
	let [w0, h0] = [img.width, img.height];

	let dc = mDom(d, { position: 'absolute', left: (w0 - sz) / 2, top: (h0 - sz) / 2, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;

	mDom(dParent, { w: 1, h: 1 })
	mButton('restart', () => imgReset(img, dc, sz, w0, h0), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('squish', () => imgSquish(img, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('expand', () => imgExpand(img, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });

	//hier koennt ich inputs fuer name of image und cats machen!
	mDom(dParent,{h:1});
	let dinp=mDom(dParent,{padding:10,align:'right',display:'inline-block'})

	mDom(dinp,{display:'inline-block'},{html:'Name: '});
	let inpFriendly = mDom(dinp, { outline: 'none', w: 130 }, { className: 'input', name: 'friendly', tag: 'input', type: 'text', placeholder: `<enter name>` });

	mDom(dinp,{h:1});

	mDom(dinp,{display:'inline-block'},{html:'Categories: '})
	let inpCats = mDom(dinp, { outline: 'none', w: 130 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });


	mButton('ok', () => collFinishEditing(img, dc, wOrig, hOrig, cell, inpFriendly,inpCats,coll), dParent, { fz: 30, padding: 10, maleft: 10 });
	//mButton('cancel', collCancelEditing, dParent, { fz: 30, padding: 10, maleft: 10 });


}
async function restOnDropShowImage(evDrop, evReader) {
	//console.log('evReader',evReader); return;
	let [url, dropTarget, dDrop, item] = [evReader.target.result, evDrop.target, evToAttrElem(evDrop, 'allowDrop').elem, UI.draggedItem];

	console.log(dropTarget, dDrop, item); //return;
	UI.draggedItem = null;

	let coll = UI.collSecondary;

	if (isdef(item)) {
		//user dragged from an item on the page
		assertion(isdef(item.key), 'NO KEY!!!!!');
		await collAddItem(coll, item.key, item);

		let cell = collFindEmptyCell(coll);//find an empty cell to put the picture in!
		let img = await collShowImageInCell(cell, url);// console.log('cell img loaded!!!!') //show in cell


		// let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
		// console.log('free cell', cell);
		// if (isdef(cell)) {
		// 	mStyle(cell, { opacity: 1 });
		// 	mClass(cell, 'magnifiable')
		// 	console.log('item', item)
		// 	showImageInBatch(item.key, cell);
		// }
	} else {
		let cell = collFindEmptyCell(coll);//find an empty cell to put the picture in!

		let img = await collShowImageInCell(cell, url);// console.log('cell img loaded!!!!')
		//add an edit button to image
		mButton('edit', async => { imgEditor1(url); }, cell, { position: 'absolute' });
		return;

		let friendly = await mPromptGadgetFor(cell, 'name', () => clearCell(cell)); console.log('the name is', friendly);
		if (isEmpty(friendly)) return; // {mClear(cell);mStyle(cell,{opacity:0}); return;}

		let cats = await mPromptGadgetFor(cell, 'categories', () => clearCell(cell)); cats = extractWords(cats); assertion(isList(cats), `cats not a list!!!!!!! ${cats}`); console.log('the categories are', cats);
		if (isEmpty(friendly)) return; // {mClear(cell);mStyle(cell,{opacity:0}); return;}

		let filename = (isdef(M.superdi[friendly]) ? 'i' + get_timestamp() : friendly) + '.png'; console.log('filename', filename);

		let dataUrl = await cropOrExpandImageAndGetDataUrl(url);
		let o = { image: dataUrl, coll: coll.name, path: filename };
		// let resp = await mPostRoute('postImage', o);	console.log('resp', resp); //sollte path enthalten!

		//jetzt hab ich das complete item und kann es zu coll adden!
		let key = stringBefore(filename, '.');
		let imgPath = `../assets/img/${coll.name}/${filename}`;
		let item = { friendly: friendly, img: imgPath, cats: cats, colls: [coll.name] };
		// resp = await collAddItem(coll,key,item);

		console.log('!!!would save image to', filename, 'and add item', item, 'to m.yaml');
	}
}
async function droppedItemOnColl(item, coll) {
	//user dragged from an item on the page
	assertion(isdef(item.key), 'NO KEY!!!!!');
	await collAddItem(coll, item.key, item);
	//reloadCollection with the new item in it!
	collOpenSecondary(4,3);
	showImageBatch(coll,-1); //await onclickPrev();
	//show in cell
	// let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
	// let cell = collFindEmptyCell(coll);//find an empty cell to put the picture in!
	// console.log('free cell', cell);
	// if (isdef(cell)) {
	// 	mStyle(cell, { opacity: 1 });
	// 	mClass(cell, 'magnifiable')
	// 	console.log('item', item)
	// 	showImageInBatch(item.key, cell);
	// }

}

async function _2cropOrExpandImageAndGetDataUrl(imageSrc) {
  return new Promise((resolve, reject) => {
    // Create an image object
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
    img.onload = () => {
      // Canvas setup
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;

      // Determine scaling needed to "cover" 300x300
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Calculate the center position
      const dx = (canvas.width - scaledWidth) / 2;
      const dy = (canvas.height - scaledHeight) / 2;

      // Draw the image centered and covering
      ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);

      // Get the data URL of the canvas
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    };
    img.onerror = (error) => reject(error);

    // Set the source of the image
    img.src = imageSrc;
  });
}
function hahaha(){
	let w = canvas.width = mGetStyle(dc,'w');
	let h = canvas.height = mGetStyle(dc,'h');
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0,0,w,h); //mGetStyle(dc,'left'), mGetStyle(dc,'top'), w,h);
	
	// store dataUrl
	const dataUrl = canvas.toDataURL();
	
	// resize to cell size, dialogs, then send
	//now remove image and reload from dataUrl with 128x128
	let d=dc.parentNode;
	mClear(d);
	mAppend(d,canvas);
	//img = await imgAsync(d,{w:128,h:128},{src:dataUrl});

}
async function imgAbstractAsync(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			resolve(img);
		};
		img.onerror = (error) => {
			reject(error);
		};
		img.src = src;
	});
}

async function muell_imgBlob(binaryData) {
	return new Promise((resolve, reject) => {
		var blob = new Blob([binaryData], { type: 'image/jpeg' }); // Create a blob object
		var url = URL.createObjectURL(blob); // Create a temporary URL for the blob
		var img = new Image(); // Create an image element
		img.onload = () => {
			URL.revokeObjectURL(url); // Revoke the URL after the image is loaded
			resolve([img,img.width,img.height]);
		};
		img.onerror = (error) => {
			reject(error);
		};
		img.src = url;
	});
}

function adjustCropper(img,dc,sz){
	let [w,h]=[img.width,img.height];	console.log('sz',w,h,)
	let [cx,cy,radx,rady,rad]=[w/2,h/2,sz/2,sz/2,sz/2];
	mStyle(dc,{left:cx-radx,top:cy-rady,w:sz,h:sz});

}
function adjustCropperBy(dc,x,y,dx,dy){ //},wImg,hImg,wIdeal,hIdeal){
	// let [w,h]=[img.width,img.height];	console.log('sz',w,h,)
	// let [cx,cy,radx,rady,rad]=[w/2,h/2,sz/2,sz/2,sz/2];
	console.log('dx',dx,'dy',dy)
	//let [x,y]=[mGetStyle(dc,'left'),mGetStyle(dc,'top')]


	mStyle(dc,{left:x+dx,top:y+dy}); //,w:sz,h:sz});

}
function imgExpand(img,dc,sz){	img.width += 20; 	adjustCropper(img,dc,sz);}
function imgSquish(img,dc,sz){	img.width -= 20; 	adjustCropper(img,dc,sz);}
function startPanning(ev){
	console.log('_________startPanning!')
	const panData={};
	function panStart(ev){
		evNoBubble(ev);
		assertion(nundef(panData.panning),panData)
		let dc=panData.dCrop=ev.target;
		panData.cropStartSize = {w:mGetStyle(dc,'w'),h:mGetStyle(dc,'h')}
		panData.elParent=panData.dCrop.parentNode;
		panData.img=panData.elParent.querySelector('img, canvas');//console.log('img',panData.img);
		panData.panning = true;
		panData.counter = 0;
		panData.mouseStart=getMouseCoordinatesRelativeToElement(ev,panData.elParent);
		panData.posStart={x:mGetStyle(dc,'left'),y:mGetStyle(dc,'top')};
		addEventListener('mouseup',panEnd);
		panData.elParent.addEventListener('mousemove',panMove);
		console.log('panStart!',panData.mouseStart); 
	}
	function panMove(ev){
		evNoBubble(ev);
		if (!panData.panning || ++panData.counter%3) return;
		panData.mouse=getMouseCoordinatesRelativeToElement(ev,panData.elParent);
		let [x,y]=[panData.posStart.x,panData.posStart.y];
		let [dx,dy]=[panData.mouse.x-panData.mouseStart.x,panData.mouse.y-panData.mouseStart.y];
		[dx,dy]=[Math.round(dx/10)*10,Math.round(dy/10)*10];
		//calc min distance to any img border!

		adjustCropperBy(panData.dCrop,x,y,dx,dy,panData.img.width,panData.img.height,panData.cropStartSize.w,panData.cropStartSize.h);
		console.log(panData.mouse);
	}
	function panEnd(ev){
		//evNoBubble(ev);
		assertion(panData.panning == true);
		let d=evToClass(ev,'imgWrapper');
		if (d == panData.elParent){
			evNoBubble(ev);
			panData.mouse=getMouseCoordinatesRelativeToElement(ev,panData.elParent);
			console.log('SUCCESS!',panData.mouse)
		}
		removeEventListener('mouseup',panEnd);
		panData.elParent.removeEventListener('mousemove',panMove);
		panData.panning = false;
		console.log('* THE END *',panData)
	}
	panStart(ev);
}

function startPanning(ev){
	console.log('_________startPanning!')
	const panData={};
	function panStart(ev){
		evNoBubble(ev);
		console.log('panStart!'); 
		if (nundef(panData.panning)){
			panData.panning = true;
			
			let dCrop=ev.target;
			let elParent=dCrop.parentNode;
			mClass(dCrop,'no_events')
			let c=getMouseCoordinatesRelativeToElement(ev,elParent);
			console.log('start panning',c)
			panData.panning=true;
			panData.elParent=elParent;
			panData.dCrop=dCrop;
			panData.mouseStart=c;
			elParent.addEventListener('mousemove',panMove);
			elParent.addEventListener('mouseup',panEnd);
			window.addEventListener('mouseup',panRestore);
		}
	}
	function panRestore(ev){
		panData.panning=false;
		panData.elParent.removeEventListener('mousemove',panMove);
		panData.elParent.removeEventListener('mouseup',panEnd);
		window.removeEventListener('mouseup',panRestore);
	}
	function panMove(ev){
		ev.preventDefault();console.log('.');return;
		if (panData.panning){
			let elParent=evToClass(ev,'imgWrapper'); 
			let c = getMouseCoordinatesRelativeToElement(ev,elParent);
			console.log('...panning',c)
		}
	}
	function panEnd(){
		ev.preventDefault();console.log('!UP!'); panRestore(ev);return;
		if (panData.panning){
			let elParent=evToClass(ev,'imgWrapper'); console.log('d',elParent)
			let dCrop=elParent.lastChild;
			mClassRemove(dCrop,'no_events')
			let c=UI.mouseEnd = getMouseCoordinatesRelativeToElement(ev,elParent);
			console.log('end panning',c)
			panData.panning=false;
		}

	}
	panStart(ev);
}

//#endregion
//#region ai cropImageTo300Center


//WORKS!!!!
async function _2cropOrExpandImageAndGetDataUrl(imageSrc) {
  return new Promise((resolve, reject) => {
    // Create an image object
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
    img.onload = () => {
      // Canvas setup
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;

      // Determine scaling needed to "cover" 300x300
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Calculate the center position
      const dx = (canvas.width - scaledWidth) / 2;
      const dy = (canvas.height - scaledHeight) / 2;

      // Draw the image centered and covering
      ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);

      // Get the data URL of the canvas
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    };
    img.onerror = (error) => reject(error);

    // Set the source of the image
    img.src = imageSrc;
  });
}

// Example usage
async function _2processImage() {
  try {
    const dataUrl = await cropOrExpandImageAndGetDataUrl('path/to/your/image.jpg');
    console.log(dataUrl);
    // Use the data URL, e.g., set it as the src for an image element
    document.querySelector('img#result').src = dataUrl;
  } catch (error) {
    console.error('Failed to process the image:', error);
  }
}

//___________________________________________________


async function _1cropImageAndGetDataUrl(imageSrc) {
  return new Promise((resolve, reject) => {
    // Create an image object
    const img = new Image();
    // CORS permission when loading an image from a different origin
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Create a canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to the target size
      canvas.width = 300;
      canvas.height = 300;
      
      // Calculate source coordinates
      const startX = Math.max(0, (img.width - 300) / 2);
      const startY = Math.max(0, (img.height - 300) / 2);
      
      // Draw the image cropped and centered
      ctx.drawImage(img, startX, startY, 300, 300, 0, 0, 300, 300);
      
      // Get the data URL of the canvas
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    };
    img.onerror = (error) => reject(error);
    
    // Set the source of the image to the provided imageSrc
    img.src = imageSrc;
  });
}

// Example usage
async function _1processImage() {
  try {
    const dataUrl = await cropImageAndGetDataUrl('path/to/your/image.jpg');
    console.log(dataUrl);
    // You can now use the data URL, e.g., set it as the src for an image element
    document.querySelector('img#result').src = dataUrl;
  } catch (error) {
    console.error('Failed to process the image:', error);
  }
}

// Call the function
//processImage();

//#endregion
//#region ai version fuer magnify but still fit on page:
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('mouseenter', function(e) {
    // Only apply the effect if the Ctrl key is held down
    if (!e.ctrlKey) return;
    
    const magnificationScale = 2; // Adjust the scale factor as needed

    // Calculate the magnified dimensions
    const magnifiedWidth = img.offsetWidth * magnificationScale;
    const magnifiedHeight = img.offsetHeight * magnificationScale;

    // Get the image's position relative to the viewport
    const rect = img.getBoundingClientRect();

    // Check if the magnified image will fit in the viewport
    const fitsHorizontally = (window.innerWidth - (rect.left + rect.width / 2) * (magnificationScale - 1)) > magnifiedWidth / 2 && (rect.left + rect.width / 2) * (magnificationScale - 1) > magnifiedWidth / 2;
    const fitsVertically = (window.innerHeight - (rect.top + rect.height / 2) * (magnificationScale - 1)) > magnifiedHeight / 2 && (rect.top + rect.height / 2) * (magnificationScale - 1) > magnifiedHeight / 2;

    // Apply the magnification
    if (fitsHorizontally && fitsVertically) {
      img.style.transform = `scale(${magnificationScale})`;
      img.style.transformOrigin = 'center';
    } else {
      // Adjust transform-origin to ensure the full image is visible
      let originX = 'center';
      let originY = 'center';

      if (rect.left < 0) {
        originX = 'left';
      } else if (rect.right > window.innerWidth) {
        originX = 'right';
      }

      if (rect.top < 0) {
        originY = 'top';
      } else if (rect.bottom > window.innerHeight) {
        originY = 'bottom';
      }

      img.style.transform = `scale(${magnificationScale})`;
      img.style.transformOrigin = `${originX} ${originY}`;
    }
  });

  img.addEventListener('mouseleave', function() {
    img.style.transform = 'scale(1)';
    img.style.transformOrigin = 'center';
  });

  img.addEventListener('mousemove', function(e) {
    if (!e.ctrlKey) {
      img.style.transform = 'scale(1)';
    }
  });
});
//#endregion
//#region magnify WORKS!!!!
function setMagnifyOnHoverControl(hoverElem, magnifyElem, scale) {}
function removeMagnifyOnHoverControl(hoverElem, magnifyElem, scale) {}
function keyUpHandler(ev) {
	if (ev.key == 'Control') {
		console.log('control key release!')
		IsControlKeyDown = false;
		mMagnifyOff();
	}
	// if (ev.key == 'Alt' && isdef(Socket)) { Socket.emit('hide', { username: Username }); }
	// if (ev.code == 'Escape' && isVisible('dAux')) { console.log('hiding dAux!'); hide('dAux'); }
	// if (keyCode == 112) { show('dHelpWindow'); }
}
function keyDownHandler(ev) {
	if (IsControlKeyDown && MAGNIFIER_IMAGE) return;
	if (!MAGNIFIER_IMAGE && ev.key == 'Control') {
		console.log('control key down!!')
		IsControlKeyDown = true;
		let hoveredElements = document.querySelectorAll(":hover");
		let cand = Array.from(hoveredElements).find(x=>mHasClass(x,'magnifiable'));
		console.log('magnifiable',cand);
		if (isdef(cand)) mMagnify(cand);

		// let hoveredImages = Array.from(hoveredElements).filter(el => el.tagName === 'IMG');
		// if (isEmpty(hoveredImages)) return;
		// let elem=hoveredImages[0].parentNode;
		// console.log('elem',elem)
		// mMagnify(elem)
		// console.log('elements under mouse', hoveredImages);
	}
	// if (ev.key == 'Alt' && isdef(Socket)) { Socket.emit('show', { username: Username }); }
}
function mMagnify(elem) { elem.classList.add(`magnify4`); MAGNIFIER_IMAGE = elem; }
function mMagnifyOff() { if (MAGNIFIER_IMAGE){MAGNIFIER_IMAGE.classList.remove(`magnify4`); MAGNIFIER_IMAGE = null; }}
//#endregion
//#region key handlers, mouse enter exit perle handlerrs
function onEnterPerle(perle) {
	if (IsControlKeyDown) {
		//if (MAGNIFIER_IMAGE) iMagnifyCancel();
		iMagnify(perle);
	}
}
function onExitPerle() { if (IsControlKeyDown) iMagnifyCancel(); }
function keyUpHandler(ev) {
	//ev.preventDefault();
	//var keyCode = ev.keyCode || ev.which;
	//console.log('keyCode',keyCode,'ev.key',ev.key);
	if (ev.key == 'Control') {
		IsControlKeyDown = false;
		iMagnifyCancel();
	}
	if (ev.key == 'Alt' && isdef(Socket)) { Socket.emit('hide', { username: Username }); }

	if (ev.code == 'Escape' && isVisible('dAux')) {
		console.log('hiding dAux!')
		hide('dAux');
	}
	//else if (keyCode == 112) { show('dHelpWindow'); }
}
function keyDownHandler(ev) {

	if (IsControlKeyDown && MAGNIFIER_IMAGE) return;
	if (!MAGNIFIER_IMAGE && ev.key == 'Control') {
		IsControlKeyDown = true;
		let elements = document.querySelectorAll(":hover");
		//console.log('elements under mouse',elements);
		//check if perle is under mouse!
		for (const el of elements) {
			let id = el.id;
			if (isdef(id) && isdef(Items[id]) && Items[id].type == 'perle') {
				iMagnify(Items[id]); return;
			}

		}
	}
	if (ev.key == 'Alt' && isdef(Socket)) { Socket.emit('show', { username: Username }); }

}

//#endregion
//#region MAGNIFY
var MAGNIFIER_IMAGE;
function iMagnifyX(ui, item, pos) {
	let path = item.path;
	if (isdef(MAGNIFIER_IMAGE) && MAGNIFIER_IMAGE.src == path) {
		console.log('schon offen!!!')
		return;
	}else if (isdef(MAGNIFIER_IMAGE)) mCancelMagnify();

	let imgSize = 514,fontSize=24;
	let [w,h,fz]=[imgSize,imgSize+fontSize+10,fontSize];
	let dPresent=MAGNIFIER_IMAGE = mDiv(document.body, { bg:HeaderColor, position: 'absolute',left:0,top:0,w:w,h:h });
	let d=dPresent; //mDiv(dPresent);
	let dText = mText(item.text,d,{color:'white',fz:fz});
	let dImage = mDiv(d,{rounding:'50%',w:w,h:w});
	mCenterCenterFlex(dImage);
	let img1 = mImg(path, dImage,{});

	//let dPresent = mDiv(document.body, { bg:HeaderColor, rounding:'50%', position: 'absolute',left:0,top:0,w:512,h:512 });
	//mContainer(dPresent);
	// let img1 = mImg(path, dPresent,{});
	mCenterCenterFlex(dPresent);

	// let img1 = MAGNIFIER_IMAGE = mImg(path, document.body, { position: 'absolute',left:0,top:0 });

}
function mMagnify(img, item) {
	let path = item.path;
	if (isdef(MAGNIFIER_IMAGE) && MAGNIFIER_IMAGE.src == path) {
		console.log('schon offen!!!')
		return;
	}else if (isdef(MAGNIFIER_IMAGE)) mCancelMagnify();

	let imgSize = 514,fontSize=24;
	let [w,h,fz]=[imgSize,imgSize+fontSize+10,fontSize];
	let dPresent=MAGNIFIER_IMAGE = mDiv(document.body, { bg:HeaderColor, position: 'absolute',left:0,top:0,w:w,h:h });
	let d=dPresent; //mDiv(dPresent);
	d.style.zIndex=100000;
	let dText = mText(item.text,d,{color:'white',fz:fz});
	let dImage = mDiv(d,{rounding:'50%',w:w,h:w});
	mCenterCenterFlex(dImage);
	let img1 = mImg(path, dImage,{});

	//let dPresent = mDiv(document.body, { bg:HeaderColor, rounding:'50%', position: 'absolute',left:0,top:0,w:512,h:512 });
	//mContainer(dPresent);
	// let img1 = mImg(path, dPresent,{});
	mCenterCenterFlex(dPresent);

	// let img1 = MAGNIFIER_IMAGE = mImg(path, document.body, { position: 'absolute',left:0,top:0 });

}
function mCancelMagnify(img, path) {
	if (isdef(MAGNIFIER_IMAGE)) {MAGNIFIER_IMAGE.remove(); MAGNIFIER_IMAGE=null;}
}
function iMagnify(perle){mMagnify(null,perle);}
function iMagnifyCancel(){mCancelMagnify();}
		//magnify on hover
		//magnify richtung oben links
		// ui.onmouseenter = ev => {
		// 	if (ev.ctrlKey) {
		// 		mStyleX(ui, {
		// 			'transform': `scale(2)`,
		// 			'transform-origin': 'bottom right',
		// 		});
		// 		mStyleX(ui.children[1], { fg: 'black', bg: 'white', align: 'center' });
		// 	}
		// };
		// ui.onmouseleave = ev => {
		// 	mRemoveStyle(ui, ['transform', 'transform-origin']);
		// 	mStyleX(ui.children[1], { fg: 'white', bg: 'transparent', });
		// };

//#endregion
//#region collections orig
async function onclickCollections() {
  showTitle('Collection:');
  dMenu = mDom(dTitle, { h: '100%' }); mFlexV(dMenu); mStyle(dMenu, { gap: 14 });
  let d1 = mDiv('dMain'); mFlex(d1);
  //showSidebar(d1);
  M.rows = 5; M.cols = 7;
  M.grid = mGrid(M.rows, M.cols, d1, { 'align-self': 'start' });
  M.cells = [];
  let bg = mGetStyle('dNav', 'bg');
  for (let i = 0; i < M.rows * M.cols; i++) {
    let d = mDom(M.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    M.cells.push(d);
  }
  initCollection(valf(localStorage.getItem('collection'), 'animals'));
}
function initCollection(name) {
  let list = [];
  if (name == 'all' || isEmpty(name)) {
    list = Object.keys(M.superdi);
  } else if (isdef(M.byCollection[name])) {
    list = M.byCollection[name];
  } else return;
  localStorage.setItem('collection', name)
  mClear(dMenu);
  let dParent = dMenu;
  let colls = M.collections;
  mDom(dParent, {}, { html: '' });
  let dlColl = mDatalist(dParent, colls, { onupdate: collectionAddEmpty });
  dlColl.inpElem.oninput = ev => initCollection(ev.target.value);
  dlColl.inpElem.value = name;
  initFilter(list);
  mButton('prev', onclickPrev, dMenu, { w: 70, margin: 0 }, 'input');
  mButton('next', onclickNext, dMenu, { w: 70, margin: 0 }, 'input');
  M.keys = list;
  M.index = 0;
  showImageBatch();
}
function initFilter(list) {
  M.masterKeys = list;
  let cats = collectCats(list);
  cats.sort();
  mDom(dMenu, {}, { html: 'Filter:' });
  let dlCat = mDatalist(dMenu, cats, { edit: false });
  dlCat.inpElem.oninput = filterImages;
}
function mDatalist(dParent, list, opts = {}) {
  var mylist = list;
  var opts = opts;
  addKeys({ alpha: true, filter: 'contains' }, opts);
  let d = mDiv(toElem(dParent));
  let optid = getUID('dl');
  mDom(d, { w: 200 }, { tag: 'input', className: 'input', placeholder: "<enter value>" });
  mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
  var elem = d;
  var inp = elem.firstChild;
  var datalist = elem.lastChild;
  for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }
  inp.setAttribute('list', optid);
  if (opts.onupdate) inp.addEventListener('keyup', opts.onupdate);
  inp.onmousedown = () => inp.value = ''
  return {
    list: mylist,
    elem: elem,
    inpElem: inp,
    listElem: datalist,
    opts: opts,
  }
}

//#endregion
//#region toggle WORKS
function toggleAdd(key, sym, dParent, styles) {
  addKeys({ fz: 20, rounding: '50%', padding: 5, fg: rColor() }, styles);
  let info = valfHtml(sym);
  let b;
  if (info) {
    let stButton = copyKeys({ overflow: 'hidden', box: true, family: info.family, cursor: 'pointer' }, styles);
    b = mDom(dParent, stButton, { id: getButtonId(key), html: info.html, className: 'hop1' });
  } else {
    b = mButton(sym, 'dToolbar')
  }
  b.onclick = toggleClick;
  let d = mBy(getDivId(key));
  if (nundef(DA.toggle)) DA.toggle = {};
  let t = DA.toggle[key] = { key: key, button: b, div: d, state: 0, states: [...arguments].slice(4) };
  toggleShow(t);
  return t;
}
function toggleClick(ev) {
  let t = toggleGet(ev);
  let i = t.state = (t.state + 1) % t.states.length;
  toggleShow(t);
}
function toggleGet(ev) { let key = getIdKey(evToId(ev)); let toggle = DA.toggle[key]; return toggle; }
function toggleShow(t, state) {
  if (nundef(state)) state = t.states[t.state];
  let d = iDiv(t); mStyle(d, state);
  let percent = 100 * t.state / (t.states.length - 1);
  mStyle(t.button, { bg: colorMix('lime', 'red', percent) });
}
//#endregion

//#region odf
async function ondropImage(evDrop, evReader) {
  //console.log('evReader',evReader); return;
  let [url, dropTarget, dDrop, item] = [evReader.target.result, evDrop.target, evToAttrElem(evDrop, 'allowDrop').elem, UI.draggedItem];

  console.log(dropTarget, dDrop, item); //return;
  UI.draggedItem = null;

  let coll = UI.collSecondary;

  if (isdef(item)) {
    //user dragged from an item on the page
    assertion(isdef(item.key),'NO KEY!!!!!');
    await collAddItem(coll,item.key, item);
    //show in cell
    let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
    console.log('free cell', cell);
    if (isdef(cell)) {
      mStyle(cell, { opacity: 1 });
      mClass(cell, 'magnifiable')
      console.log('item', item)
      showImageInBatch(item.key, cell);
    }
  } else {
    let cell = collFindEmptyCell(coll);//find an empty cell to put the picture in!

    let img = await collShowImageInCell(cell,url);// console.log('cell img loaded!!!!')

    let friendly = await mPromptGadgetFor(cell,'name'); console.log('the name is',friendly)

    let cats = await mPromptGadgetFor(cell,'categories'); cats = extractWords(cats); console.log('the categories are',cats);

    let filename = (isdef(M.superdi[friendly])?'i'+get_timestamp() : friendly) + '.png'; console.log('filename',filename);

		let dataUrl = await cropOrExpandImageAndGetDataUrl(url);
		let o = { image: dataUrl, coll:coll.name, path:filename };
		let resp = await mPostRoute('postImage', o);	console.log('resp', resp); //sollte path enthalten!

    //jetzt hab ich das complete item und kann es zu coll adden!
    let key = stringBefore(filename,'.');
    let imgPath = `../assets/img/${coll.name}/${filename}`;
    let item = {friendly:friendly,img:imgPath,cats:cats,colls:[coll.name]};
    resp = await collAddItem(coll,key,item);

    // let res = await postImage(imgHidden,'../odf/test.png'); console.log('res',res);

    // let imgHidden = mDom(document.body, { w: 300, h: 300, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: url, width:300, height:300 });
    // imgHidden.onload = async () => {
		// 	let res = await postImage(imgHidden,'../odf/test.png'); console.log('res',res)

		// 	return;



    //   let dataUrl = imgToDataUrl(imgHidden);
    //   let o = { image: dataUrl, coll:coll.name, path:filename };
    //   let resp = await mPostRoute('postImage', o);
    //   console.log('resp', resp); //sollte path enthalten!

		// 	//jetzt hab ich das complete item und kann es zu coll adden!
		// 	let key = stringBefore(filename,'.');
		// 	let imgPath = `../assets/img/${coll.name}/${filename}`;
		// 	let item = {friendly:friendly,img:imgPath,cats:cats,colls:[coll.name]};
		// 	resp = await collAddItem(coll,key,item);


    //   //   //==>jetzt muss ich nach cats, friendly,... fragen!
    //   //   //open a Gadget to ask for friendly and a list of cats to pick cats from or enter new cats
    //   //   console.log('opening dialog!!!');
    //   //   let path = `../assets/img/${coll.name}/${unique}.png`;
    //   //   let cats=[];
    //   //   console.log('new item:',unique,coll.name,path,friendly,cats);
    //   //   item = {key:unique,friendly:friendly,cats:[],colls:[coll.name],img:path}
    //   //   await collAddItem(coll,unique,item)
    //   //   //add the name (showImageInBatch!)


    // }
  }
}

async function ondropImage(evDrop, evReader) {
  //console.log('evReader',evReader); return;
  let [url, dropTarget, dDrop, item] = [evReader.target.result, evDrop.target, evToAttrElem(evDrop, 'allowDrop').elem, UI.draggedItem];

  console.log(dropTarget, dDrop, item); //return;
  UI.draggedItem = null;

  let coll = UI.collSecondary;

  if (isdef(item)) {
    //user dragged from an item on the page
    collAddItem(coll, item);
    //show in cell
    let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
    console.log('free cell', cell);
    if (isdef(cell)) {
      mStyle(cell, { opacity: 1 });
      mClass(cell, 'magnifiable')
      console.log('item', item)
      showImageInBatch(item.key, cell);
    }
  } else {
    // presentImageCropper(url); return;
    let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
    console.log('free cell', cell);
    if (isdef(cell)) {
      mStyle(cell, { opacity: 1 });
      mClass(cell, 'magnifiable')
      let img = mDom(document.body, { w: 300, h: 300, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: url });
      // let img = mDom(cell, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: url });
      //let img = UI.img = mDom(dParent, {}, { tag: 'img', src: url, });
      img.onload = async () => {
        console.log('image loaded');
        let dataUrl = imgToDataUrl(img);
        let unique = getUID('test');
        let o = { image: dataUrl, unique: unique, coll: coll.name, path: unique + '.png' };
        let resp = await mPostRoute('postImage', o);
        console.log('resp', resp); //sollte path enthalten!
        let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
        console.log('free cell', cell);
        if (isdef(cell)) {
          mStyle(cell, { opacity: 1 });
          mClass(cell, 'magnifiable')
          let imgSmall = mDom(cell, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: url });
        }
            // img.onload = null;
        // UI.img_orig = new Image(img.offsetWidth, img.offsetHeight);
        // UI.url = url;
        // let tool = UI.cropper = mCropResizePan(dParent, img);
        // addToolX(tool, dTool)
        // mDom(dButtons, { w: 120 }, { tag: 'button', html: 'Upload', onclick: onclickUpload, className: 'input' })
        // mButton('Restart', () => ondropPreviewImage(url), dButtons, { w: 120, maleft: 12 }, 'input');
      }
    }
    return;

    return;



    //resize
    //hier muss ich ein superdi item generaten!
    //brauch eigentlich ein prompt! mit multiple zeug drin!
    //item name (=friendly)=>wird auch fuer key verwendet!
    //cats: ideally aus liste auswaehlbar multiple!
    //hier muss ich ein image uploaden! aber wohin??? halt in y/img oder in assets/img/<collname>???
    item = {}
  }


}
async function onclickCollections() {

  let dPanes = mDom('dMain'); mFlex(dPanes);
  let dSecondary = mDom(dPanes, { wmin: 0, w: 0 }, { id: 'collSecondary', className: 'translow' }); //mFlexWrap(dPlus);
  let dPrimary = mDom(dPanes, {}, { id: 'collPrimary' }); //mFlexWrap(d1);

  collSidebar();

  UI.collPrimary = { div: dPrimary, name: valf(localStorage.getItem('collection'), 'animals') }; //{name:'amanda'};
  UI.collSecondary = { div: dSecondary, name: null };
  collOpenPrimary(5, 6);
}
function collOpenPrimary(rows, cols) { collPresent(UI.collPrimary, rows, cols); UI.collSecondary.isOpen = true; }
function collOpenSecondary(rows, cols) { 
  let d = iDiv(UI.collSecondary); 
  mStyle(d, { w: 'auto', wmin: 450 }); 
  collPresent(UI.collSecondary, rows, cols); 
  UI.collSecondary.isOpen = true; 
  mButtonX(d,30);
}
function collClosePrimary() { let d = iDiv(UI.collPrimary); mClear(d); UI.collPrimary.isOpen = false; }
function collCloseSecondary() { 
  let d = iDiv(UI.collSecondary); 
  mClear(d); 
  mStyle(d, { w: 0, wmin: 0 }); 
  UI.collSecondary.isOpen = false; 
}
async function onclickNewCollection() { 
  let name = await mPrompt()
  collOpenPrimary(6, 4); 
  collOpenSecondary(6, 3); 
}
function collSidebar() {

  mStyle('dLeft', { wmin: 100 });
  let d = mDom('dLeft', { margin: 10, matop: 100 }); //,fg:getThemeFg()});

  //let c1=mDom(d,{padding:4},{html:'new collection',className:'nav-link'})
  let c1 = UI.newCollection = mCommand(d, 'newCollection', 'New Collection');
  //console.log(c2,window[`onclickNewCollection`])
  return;

  //let nav = mMenu(d);
  //let [d, l, m, r] = mLMR(dParent); return { dParent, elem: d, l, m, r, key, cur: null };
  let commands = {};
  commands.newCollection = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, clearMain);
  commands.colors = menuCommand(nav.l, 'nav', 'colors', null, showColors, clearMain);
  commands.collections = menuCommand(nav.l, 'nav', 'collections', null, onclickCollections, collClear);
  commands.play = menuCommand(nav.l, 'nav', 'play', null, showTables, clearMain);
  commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, clearMain);
  nav.commands = commands;
  // console.log(commands)
  return nav;

  //let t1=toggleAdd('left','arrow_down_long',iDiv(UI.nav).l,{hpadding:9,vpadding:5},{w:0,wmin:0},{wmin:100});

  //mStyle('dLeft',{w:100})
  // let collMenu = mDom('dLeft');
  // let c1=mDom(collMenu,{},{html:'new collection'})
}


function collectionAddEmpty(ev) {
  if (ev.key != 'Enter') return;
  console.log('onupdate', ev.target, ev.target.value);
  let val = ev.target.value;
  addIf(M.collections, val);
  M.collections.sort()
  M.byCollection[val] = [];
  collInitCollection(val);
}

async function onclickCollections() {
	let coll = UI.coll = {};
	let dMenu = coll.dMenu = mDom('dTitle', { maleft: 100 }, { className: 'title' });
	mFlexV(dMenu); mStyle(dMenu, { gap: 14 });

	collSidebar();

	let dPanes = mDom('dMain'); mFlex(dPanes);
	let dPlus = mDom(dPanes,{},{className:'translow'}); mFlexWrap(dPlus);
	let d1 = mDom(dPanes); mFlexWrap(d1);

	let dInstruction = mDom(d1,{align:'center',fg:getThemeFg()},{html:'* press Control key when hovering to magnify image! *'})

	//coll = uiTypeCollection(5,6,)
	coll.rows = 5; coll.cols = 6;
	coll.grid = mGrid(coll.rows, coll.cols, d1, { 'align-self': 'start' });
	coll.cells = [];
	let bg = mGetStyle('dNav', 'bg');
	for (let i = 0; i < coll.rows * coll.cols; i++) {
		let d = mDom(coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		coll.cells.push(d);
	}
	mStyle(dInstruction,{w:mGetStyle(coll.grid,'w')});
	
	collInitCollection('animals',coll); //valf(localStorage.getItem('collection'), 'animals'),coll);
}
function collInitCollection(name,coll) {
	let list = [];
	if (name == 'all' || isEmpty(name)) {
		list = Object.keys(M.superdi);
	} else if (isdef(M.byCollection[name])) {
		list = M.byCollection[name];
	} else return;
	localStorage.setItem('collection', name)
	let dMenu = coll.dMenu;
	mClear(dMenu);
	mDom(dMenu, { maleft: 10, maright: -20 }, { html: '<h1>Collection:</h1>' });
	let dParent = dMenu;
	let colls = M.collections;
	mDom(dParent, {}, { html: '' });
	let dlColl = mDatalist(dParent, colls, { onupdate: collectionAddEmpty, placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value);
	dlColl.inpElem.value = name;

	coll.masterKeys = list;
	let cats = collectCats(list);
	cats.sort();
	mDom(dMenu, { maright: -6 }, { html: '<h1>Filter:</h1>' });
	let dlCat = mDatalist(dMenu, cats, { edit: false, placeholder: "<enter value>" });
	dlCat.inpElem.oninput = collFilterImages;

	mButton('prev', onclickPrev, dMenu, { w: 70, margin: 0 }, 'input');
	mButton('next', onclickNext, dMenu, { w: 70, margin: 0 }, 'input');
	coll.keys = list;
	coll.index = 0;
	showImageBatch();
}




function collInitCollection(name,coll) {
	let list = [];
	if (name == 'all' || isEmpty(name)) {
		list = Object.keys(M.superdi);
	} else if (isdef(M.byCollection[name])) {
		list = M.byCollection[name];
	} else return;
	localStorage.setItem('collection', name)
	let dMenu = coll.dMenu;
	mClear(dMenu);
	mDom(dMenu, { maleft: 10, maright: -20 }, { html: '<h1>Collection:</h1>' });
	let dParent = dMenu;
	let colls = M.collections;
	mDom(dParent, {}, { html: '' });
	let dlColl = mDatalist(dParent, colls, { onupdate: collectionAddEmpty, placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value);
	dlColl.inpElem.value = name;

	UI.coll.masterKeys = list;
	let cats = collectCats(list);
	cats.sort();
	mDom(dMenu, { maright: -6 }, { html: '<h1>Filter:</h1>' });
	let dlCat = mDatalist(dMenu, cats, { edit: false, placeholder: "<enter value>" });
	dlCat.inpElem.oninput = collFilterImages;

	mButton('prev', onclickPrev, dMenu, { w: 70, margin: 0 }, 'input');
	mButton('next', onclickNext, dMenu, { w: 70, margin: 0 }, 'input');
	UI.coll.keys = list;
	UI.coll.index = 0;
	showImageBatch();
}
async function onclickCollections() {
	dMenu = mDom('dTitle', { maleft: 100 }, { className: 'title' });
	mFlexV(dMenu); mStyle(dMenu, { gap: 14 });

	collSidebar();
	UI.coll = {};

	let dPanes = mDiv('dMain'); mFlex(dPanes);
	let dPlus = mDiv(dPanes); mFlexWrap(dPlus);
	let d1 = mDiv(dPanes); mFlexWrap(d1);

	let dInstruction = mDom(d1,{align:'center',fg:getThemeFg()},{html:'* press Control key when hovering to magnify image! *'})

	//UI.coll = uiTypeCollection(5,6,)
	UI.coll.rows = 5; UI.coll.cols = 6;
	UI.coll.grid = mGrid(UI.coll.rows, UI.coll.cols, d1, { 'align-self': 'start' });
	UI.coll.cells = [];
	let bg = mGetStyle('dNav', 'bg');
	for (let i = 0; i < UI.coll.rows * UI.coll.cols; i++) {
		let d = mDom(UI.coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		UI.coll.cells.push(d);
	}
	mStyle(dInstruction,{w:mGetStyle(UI.coll.grid,'w')});
	
	collInitCollection(valf(localStorage.getItem('collection'), 'animals'));
}

function mDatalist(dParent, list, opts = {}) {
  var mylist = list;
  var opts = opts; addKeys({ alpha: true, filter: 'contains' }, opts);
  let elem = mDiv(toElem(dParent));
  let optid = getUID('dl');
  var inp = mDom(elem, { w: 200 }, { tag: 'input', className: 'input',  });
  var datalist = mDom(elem, {}, { tag: 'datalist', id: optid, className: 'datalist' });
  for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }
  inp.setAttribute('list', optid);
  if (opts.edit){ //onupdate) {
		inp.placeholder = "<enter value>";
		inp.addEventListener('keyup', opts.onupdate); 
	}	else {
		inp.addEventListener('keydown', function(e) {
			if (!['ArrowDown', 'ArrowUp', 'Backspace', 'Delete'].includes(e.code)) {
					e.preventDefault();
			}
		});
		inp.placeholder = '<select from list>'
		inp.onmousedown = () => inp.value = ''

		//inp.setAttribute('readonly',true)
	}
  return {
    list: mylist,
    elem: elem,
    inpElem: inp,
    listElem: datalist,
    opts: opts,
  }
}


async function collInit() {
  dMenu = mDom('dTitle',{maleft:100},{className:'title'});
	mFlexV(dMenu); mStyle(dMenu, { gap: 14 });

	collSidebar();

  let d1 = mDiv('dMain'); mFlex(d1);
  M.rows = 5; M.cols = 6;
  M.grid = mGrid(M.rows, M.cols, d1, { 'align-self': 'start' });
  M.cells = [];
  let bg = mGetStyle('dNav', 'bg');
  for (let i = 0; i < M.rows * M.cols; i++) {
    let d = mDom(M.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    M.cells.push(d);
  }
  collInitCollection('amanda'); //valf(localStorage.getItem('collection'), 'animals'));
}
function collInitCollection(name) {
  let list = [];
  if (name == 'all' || isEmpty(name)) {
    list = Object.keys(M.superdi);
  } else if (isdef(M.byCollection[name])) {
    list = M.byCollection[name];
  } else return;
  localStorage.setItem('collection', name)
  mClear(dMenu);
  mDom(dMenu, {maleft:10,maright:-20}, { html: '<h1>Collection:</h1>' });
  let dParent = dMenu;
  let colls = M.collections;
  mDom(dParent, {}, { html: '' });
  let dlColl = mDatalist(dParent, colls, {edit: false} );//, { onupdate: collectionAddEmpty });
  dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value);
  dlColl.inpElem.value = name;
  collInitFilter(list);
  mButton('prev', onclickPrev, dMenu, { w: 70, margin: 0 }, 'input');
  mButton('next', onclickNext, dMenu, { w: 70, margin: 0 }, 'input');
  M.keys = list;
  M.index = 0;
  showImageBatch();
}
function collInitFilter(list) {
  M.masterKeys = list;
  let cats = collectCats(list);
  cats.sort();
  // mDom(dMenu, {}, { html: 'Filter:' });
  mDom(dMenu, {maright:-6}, { html: '<h1>Filter:</h1>' });
  let dlCat = mDatalist(dMenu, cats, { edit: true });
  dlCat.inpElem.oninput = filterImages;
}
function mDatalist(dParent, list, opts = {}) {
  var mylist = list;
  var opts = opts;
  addKeys({ alpha: true, filter: 'contains' }, opts);
  let d = mDiv(toElem(dParent));
  let optid = getUID('dl');
  mDom(d, { w: 200 }, { tag: 'input', className: 'input', placeholder: "<enter value>" });
  mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
  var elem = d;
  var inp = elem.firstChild;
  var datalist = elem.lastChild;
  for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }
  inp.setAttribute('list', optid);
  if (opts.onupdate) inp.addEventListener('keyup', opts.onupdate);
  inp.onmousedown = () => inp.value = ''
  return {
    list: mylist,
    elem: elem,
    inpElem: inp,
    listElem: datalist,
    opts: opts,
  }
}
function collClear(){closeLeftSidebar();clearMain();}
function collSidebar(){

  mStyle('dLeft',{wmin:100});
  let d=mDom('dLeft',{margin:10}); //,fg:getThemeFg()});

  let c1=mDom(d,{padding:4},{html:'new collection',className:'nav-link activeLink'})

  //let t1=toggleAdd('left','arrow_down_long',iDiv(UI.nav).l,{hpadding:9,vpadding:5},{w:0,wmin:0},{wmin:100});

  //mStyle('dLeft',{w:100})
  // let collMenu = mDom('dLeft');
  // let c1=mDom(collMenu,{},{html:'new collection'})
}
function closeLeftSidebar(){
  mClear('dLeft');mStyle('dLeft',{w:0,wmin:0})
}
async function collInit() {
  dMenu = mDom('dTitle',{maleft:100},{className:'title'});
	mFlexV(dMenu); mStyle(dMenu, { gap: 14 });

	collSidebar();

  let d1 = mDiv('dMain'); mFlex(d1);
  M.rows = 5; M.cols = 7;
  M.grid = mGrid(M.rows, M.cols, d1, { 'align-self': 'start' });
  M.cells = [];
  let bg = mGetStyle('dNav', 'bg');
  for (let i = 0; i < M.rows * M.cols; i++) {
    let d = mDom(M.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    M.cells.push(d);
  }
  collInitCollection('amanda'); //valf(localStorage.getItem('collection'), 'animals'));
}
function collInitCollection(name) {
  let list = [];
  if (name == 'all' || isEmpty(name)) {
    list = Object.keys(M.superdi);
  } else if (isdef(M.byCollection[name])) {
    list = M.byCollection[name];
  } else return;
  localStorage.setItem('collection', name)
  mClear(dMenu);
  mDom(dMenu, {maleft:10,maright:-20}, { html: '<h1>Collection:</h1>' });
  let dParent = dMenu;
  let colls = M.collections;
  mDom(dParent, {}, { html: '' });
  let dlColl = mDatalist(dParent, colls, { onupdate: collectionAddEmpty });
  dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value);
  dlColl.inpElem.value = name;
  collInitFilter(list);
  mButton('prev', onclickPrev, dMenu, { w: 70, margin: 0 }, 'input');
  mButton('next', onclickNext, dMenu, { w: 70, margin: 0 }, 'input');
  M.keys = list;
  M.index = 0;
  showImageBatch();
}
function collInitFilter(list) {
  M.masterKeys = list;
  let cats = collectCats(list);
  cats.sort();
  // mDom(dMenu, {}, { html: 'Filter:' });
  mDom(dMenu, {maright:-6}, { html: '<h1>Filter:</h1>' });
  let dlCat = mDatalist(dMenu, cats, { edit: false });
  dlCat.inpElem.oninput = filterImages;
}
function initFilter(list) {
  M.masterKeys = list;
  let cats = collectCats(list);
  cats.sort();
  mDom(dMenu, {}, { html: 'Filter:' });
  let dlCat = mDatalist(dMenu, cats, { edit: false });
  dlCat.inpElem.oninput = filterImages;
}
function initCollection(name) {
  let list = [];
  if (name == 'all' || isEmpty(name)) {
    list = Object.keys(M.superdi);
  } else if (isdef(M.byCollection[name])) {
    list = M.byCollection[name];
  } else return;
  localStorage.setItem('collection', name)
  mClear(dMenu);
  mDom(dMenu, {maright:-20}, { html: '<h1>Collection:</h1>' });
  let dParent = dMenu;
  let colls = M.collections;
  mDom(dParent, {}, { html: '' });
  let dlColl = mDatalist(dParent, colls, { onupdate: collectionAddEmpty });
  dlColl.inpElem.oninput = ev => initCollection(ev.target.value);
  dlColl.inpElem.value = name;
  initFilter(list);
  mButton('prev', onclickPrev, dMenu, { w: 70, margin: 0 }, 'input');
  mButton('next', onclickNext, dMenu, { w: 70, margin: 0 }, 'input');
  M.keys = list;
  M.index = 0;
  showImageBatch();
}
async function onclickCollections() {
  showTitle('Collection:');
  dMenu = mDom(dTitle, { h: '100%' }); mFlexV(dMenu); mStyle(dMenu, { gap: 14 });
  let d1 = mDiv('dMain'); mFlex(d1);
  M.rows = 5; M.cols = 7;
  M.grid = mGrid(M.rows, M.cols, d1, { 'align-self': 'start' });
  M.cells = [];
  let bg = mGetStyle('dNav', 'bg');
  for (let i = 0; i < M.rows * M.cols; i++) {
    let d = mDom(M.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    M.cells.push(d);
  }
  initCollection(valf(localStorage.getItem('collection'), 'animals'));
}
async function onclickColors() {
  showTitle('Set Color Theme');
  let d = mDom('dMain', { hpadding: 20, display: 'flex', gap: '2px 4px', wrap: true });
  let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
  list = M.playerColors.concat(grays);
  //let i = 0;
  let sz=30;
  //let w = Math.min(50, (window.innerWidth - 150) / 15);
  for (const c of list) {
    let dc = mDom(d, { w: sz, h: sz, bg: c, fg: idealTextColor(c) });
    dc.onclick = onclickColor;
    mStyle(dc, { cursor: 'pointer' });
    //i++; if (i % 15 == 0) mDom(d, { w: '100%', h: 0 });
  }
}
async function switchToUser(uname) {
  if (!isEmpty(uname)) uname = normalizeString(uname);
  if (isEmpty(uname)) uname = 'guest';
  sockPostUserChange(U ? U.name : '', uname); //das ist nur fuer die client id!
  U = await getUser(uname);
  Clientdata.lastUser = uname;
  localStorage.setItem('username', uname);

	// showUser(uname);
	iDiv(UI.user).innerHTML = uname;
  setColors(U.color)
	// let dUser = iDiv(UI.user);
  // mClear(dUser);
  // mStyle(dUser, { display: 'flex', gap: 12, valign: 'center' })
  // let d;
  // d = mDom(dUser, { cursor: 'pointer', padding: '.5rem 1rem', rounding: '50%' }, { html: U.name, className: 'activeLink' });
  // setColors(U.color)
  // d.onclick = onclickUser;

	let cur = UI.nav.cur;//Clientdata.lastMenu;
  if (uname == 'guest'){await switchToMenu(UI.nav,'home');menuDisable(UI.nav,'plan'); }
  else {
    menuEnable(UI.nav,'plan');
    let t=Clientdata.table;
    if (cur == 'play' && isdef(t) && t.fen.playerNames.includes(uname)) await showTable(t,uname);
    else await switchToMenu(UI.nav,valf(cur,'home'));
  }
}
function menuCommand(dParent, menuKey, key, html, open,close) {
	let cmd=mCommand(dParent,key,html,open,close);
	let a=iDiv(cmd);
	a.setAttribute('key',`${menuKey}_${key}`);
	a.onclick = onclickMenu;
	cmd.menuKey = menuKey;
	// if (nundef(html)) html = capitalize(key);
	// if (nundef(open)) open = window[`onclick${html}`];
	// if (nundef(close)) close=()=>{console.log('close',key)}
	// let d = mDom(dParent, { display: 'inline-block' }, { key: key });
	// let a = mDom(d, {}, { key: `${menuKey}_${key}`, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: menuOpen })

	return cmd; // {dParent,elem:d,div:a,menu:menuKey,key,open,close};
}

function commandRemove(key){}
function commandEnable(key){}
function commandDisable(key){}
function commandActivate(key){

}
function commandClose(key){
	
}
function commandCloseAll(){}

function menuAdd(dParent, key, html, handler) {
	if (nundef(html)) html = capitalize(key);
	if (nundef(handler)) handler = window[`onclick${html}`];
	let d = mDom(dParent, { display: 'inline-block' }, { key: key });
	let a = mDom(d, {}, { tag: 'a', href: '#', html: html, className: 'nav-link', onclick: handler })
}
function menuRemove(key){}
function menuEnable(key){}
function menuDisable(key){}
function menuActivate(key){

}
function menuCloseCurrent(key){}
async function _mPrompt(dParent = 'dUser', placeholder = '<username>', cond = isAlphanumeric) {
  return new Promise((resolve, reject) => {
    mClear(dParent)
    let d = mInput(dParent, { w: 100 }, 'inpPrompt', placeholder, 'input', 1);
    d.focus();
    d.onkeyup = ev => {
      if (ev.key == 'Enter') {
        let val = ev.target.value;
        ev.target.remove();
        if (cond(val)) {
          resolve(val.toLowerCase().trim());
        } else {
          console.log('not a valid input => null');
          resolve(null);
        }
      } else if (ev.key == 'Escape') {
        resolve(null);
      }
    };
  });
}
function _mModalInput(name,styles={}){
  let d=document.body;
  let dialog = mDom(d, {w100:true}, { className:'reset', tag: 'dialog', id: `modal_${name}` });
  //addKeys({ position: 'fixed', top: 40, left: 0, display: 'inline-block', padding: 12, box: true },styles)
  addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true },styles)
  let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
  let inp = mDom(form, { outline: 'none' }, { name: name, tag: 'input', type: 'text', placeholder: `<${name}>` });
  mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
  async function prompt(){
    return new Promise((resolve, reject) => {
      console.log('form', form);
      dialog.showModal();
      form.onsubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission
        resolve(inp.value);
        dialog.remove(); //close();
      };
    });
  }
  return prompt;
}
function mNavbar(dParent, styles, pageTitle, titles, funcNames) {
  let ui = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
  mClass(dParent, 'nav');
  let stflex = { gap: 10, display: 'flex', 'align-items': 'center' };
  let [dl, dr] = [mDom(ui, stflex), mDom(ui, stflex)];
  function activate(ev) {
    close();
    let links = document.getElementsByClassName('nav-link');
    let inner = isDict(ev) ? ev.target.innerHTML:ev;
    let el = Array.from(links).find(x => x.innerHTML == inner);
    if (el) mClass(el, 'activeLink');
  }
  function close() {
    closeApps();
    let links = document.getElementsByClassName('nav-link');
    for (const el of links) { mClassRemove(el, 'activeLink'); }
  }
  function disable() {
    let links = Array.from(document.getElementsByClassName('nav-link'));
    for (const w of arguments) {
      let el = Array.from(links).find(x => x.innerHTML == w);
      if (isdef(el)) mClass(el, 'disabled');
    }
  }
  function enable() {
    let links = document.getElementsByClassName('nav-link');
    for (const w of arguments) {
      let el = Array.from(links).find(x => x.innerHTML == w);
      if (isdef(el)) mClassRemove(el, 'disabled');
    }
  }
  return { activate, close, disable, enable, ui, dleft: dl, dright: dr };
}
function showNavbar() {
	let nav = UI.nav = mMenu('dNav');
	let commands = {};
	commands.home = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, clearMain);
	commands.colors = menuCommand(nav.l, 'nav', 'colors', null, onclickColors, clearMain);
	commands.collections = menuCommand(nav.l, 'nav', 'collections', null, onclickCollections, clearMain);
	commands.play = menuCommand(nav.l, 'nav', 'play', null, showTables, clearMain);
	commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, clearMain);
	nav.commands = commands;
	// console.log(commands)
	UI.user = mCommand(nav.r, 'user', null, onclickUser);
}
function __showNavbar() {
  let titles = ['add', 'collections', 'NATIONS', 'plan', 'play', 'colors'];
  let funcNames = titles.map(x => `onclick${capitalize(x)}`);
  let nav = UI.nav = mNavbar('dNav');
  let [dl, dr] = [nav.dleft, nav.dright];
  let title = mDom(dl, { fz: 20, cursor:'pointer' }, { onclick:onclickHome, html: 'COMBU', classes: 'title' });
  let d2 = mDom(dl);
  for (let i = 0; i < titles.length; i++) {
    let d3 = mDom(d2, { display: 'inline-block' }, { html: `<a class="nav-link" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>` })
  }
  dUser = mDom(dr, {}, { id: 'dUser' });
  let t2 = toggleAdd('right', 'arrow_down_long', dr, { hpadding: 9, vpadding: 5 }, { w: 0 }, { w: 300 });
}

async function onclickUser() {
  // let uname = await mPrompt(iDiv(UI.user));
	// let gadget = mModalInput('username',{right:0,top:40});
	// let uname = await gadget();
	// console.log('username is',uname)
	let gadget = UI.gadget; //mModalInput('username',{right:0,top:50});
	let uname = await mPrompt(gadget);
	console.log('username is',uname)
  await switchToUser(uname);
}

// create a dialog element with an input inside
function createDialog() {
  // create a dialog element
  let dialog = document.createElement("dialog");
  // set some style attributes
  dialog.style.width = "300px";
  dialog.style.height = "200px";
  dialog.style.border = "solid black 2px";
  dialog.style.backgroundColor = "white";
  // create an input element
  let input = document.createElement("input");
  // set some style attributes
  input.style.width = "80%";
  input.style.margin = "20px";
  input.style.padding = "10px";
  input.style.border = "solid gray 1px";
  // append the input to the dialog
  dialog.appendChild(input);
  // return the dialog element
  return dialog;
}

// open the dialog as a modal dialog in the top left corner of the parent div
function openDialog(parent) {

	// let dialog = createDialog();
  let dialog = document.createElement("dialog");

	parent.appendChild(dialog);

	// position the dialog in the top left corner of the parent
  dialog.style.position = "absolute";
  dialog.style.top = "0";
  dialog.style.left = "0";
  // show the dialog as a modal
  dialog.showModal();
}


async function mModal(placeholder='') {
  return new Promise((resolve, reject) => {
		let m=mDom(document.body,{},{tag:'modal'});
		let inp = mInput(m, { w: 100 }, 'inpPrompt', placeholder, 'input', 1);
    inp.focus();
    inp.onkeyup = ev => {
      if (ev.key == 'Enter' || ev.key == 'Escape') {
        let val = ev.target.value;
				resolve(val);
      }
    };
		m.showModal();
  });
}
async function test0() {
	//keep it simple!
	await prelimsFast();

	//showNavbar(); return;

	//jetzt kommt die UI dran!
	//modular waer besser: menuAdd,menuRemove, menuEnable,menuDisable,menuActivate,menuClose
	//eine menubar hat 3 bereiche: r,m,l
	// nav:  dNav, 'dNav', 
	//nav koennte sein {div:mBy('dNav'), }
	//let titles = ['add', 'collections', 'NATIONS', 'plan', 'play', 'colors'];
	// ['home','calendar','colors','play','coll','collNew','collDelete','collMove','collCopy','collRemoveCat','collAddCat','collView']
	// UI.commands = {
	// 	home: {},
	// 	colors: {},
	// 	collections: {},
	// 	play: {},
	// };
	// UI.menus = {
	// 	nav: { div: 'dNav',  },
	// 	collections: {}
	// }
	let commandlist = ['home', 'colors', 'collections', 'play', 'user'];
	let commands = {};
	let [l,m,r] = mMenuLMR('dNav');

	commands.home = mCommand(l, 'home', 'HOME', showDashboard, clearMain);
	commands.colors = mCommand(m, 'colors', null, onclickColors, clearMain);
	commands.home = mCommand(m, 'collections', null, onclickCollections, clearMain);
	commands.home = mCommand(m, 'play', null, showTables, clearMain);
	commands.home = mCommand(r, 'user', null, onclickUser);
	

	//each command needs open,close



	//showNavbar();
}
//#endregion odf start

//#region app postUserChange

app.post('/postUserChange', (req, res) => {
	console.log('<== post userChange')
	let x=req.body;
	let oldname = x.oldname;
	let newname = x.newname;
	if (isdef(ClientIdByUsername[newname])) {
		//kann nicht mit selben namen in 2 verschiedenen
	}
	let id = ClientIdByUsername[oldname];

	console.log(':::SOCK user change:', x, id);
	UsernameByClientId[id] = x.newname;
	ClientIdByUsername[x.newname] = id;
	let old = ClientIdByUsername[x.oldname];
	if (old == id) delete ClientIdByUsername[x.oldname];
	io.emit('userChange', `${id} is now ${x.newname}`);
	let name = req.body.name;
	let data = req.body;
	if (nundef(data.icon)) data.icon = fs.existsSync(path.join(assetsDirectory,`img/users/${name}.jpg`))?name:'unknown_user';

	//console.log('data', data)
	let fname = path.join(dbDirectory, 'users.yaml');
	lookupSetOverride(Session, ['users', name], data);
	let y = yaml.dump(Session.users);
	fs.writeFileSync(fname, y, 'utf8');
	res.json(data);
});
//#endregion

//#region nations
function selectAddItems(items, callback = null, instruction = null, min = 0, max = 100, prevent_autoselect = false) {
  let [A,fen] = [Z.A,Z.fen];
  select_clear_previous_level();
  A.level++; A.items = items; A.callback = callback; A.selected = []; A.minselected = min; A.maxselected = max;
  //console.log('A.level', A.level)
  //show_stage();
  let dInstruction = mBy('dSelections0');
  mClass(dInstruction, 'instruction');
  mCenterCenterFlex(dInstruction);
  mStyle(dInstruction,{'align-content':'center','justify-content':'center'})
  dInstruction.innerHTML = (isMyTurn(fen) ? `${get_waiting_html()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` : `${Z.uplayer}`) + "&nbsp;" + instruction;
  if (too_many_string_items(A)) { mLinebreak(dInstruction, 4); }
  let has_submit_items = false;
  let buttonstyle = { maleft: 25, vmargin: 2, rounding: 6, padding: '4px 12px 5px 12px', border: '0px solid transparent', outline: 'none' }
  for (const item of A.items) {
    let type = item.itemtype = is_card(item) ? 'card' : isdef(M.superdi[item.key])? 'sym': isdef(item.o) ? 'container' : isdef(item.src)? 'img':'string';
    if (isdef(item.submit_on_click)) { has_submit_items = true; }
    let id = item.id = lookup(item, ['o', 'id']) ? item.o.id : getUID(); A.di[id] = item;
    if (type == 'string') {
      let handler = ev => select_last(item, isdef(item.submit_on_click) ? callback : select_toggle, ev);
      item.div = mButton(item.a, handler, dInstruction, buttonstyle, null, id);
    } else if (type == 'sym'){
      //let d=mDom(dInstruction,{h:'100%'});mCenterCenterFlex(d)
      //item.div = showImage(item.key,dInstruction,{sz:30,fg:'grey'});
      let el = null;
      let o=item.o,d1=dInstruction;
      //mDom(dInstruction,{hmargin:8}),
      let fz=30,fg='grey';
      if (isdef(o.img)) {
        el = mDom(d1, { h: fz, hmargin:8,'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` });
      }
      else if (isdef(o.text)) el = mDom(d1, { hmargin:8,fz: fz, hline: fz, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
      else if (isdef(o.fa6)) el = mDom(d1, { hmargin:8,fz: fz-2, hline: fz, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
      else if (isdef(o.fa)) el = mDom(d1, { hmargin:8,fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
      else if (isdef(o.ga)) el = mDom(d1, { hmargin:8,fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
      mStyle(el,{cursor:'pointer'})
      el.onclick = ev => select_last(item, select_toggle, ev);
      el.id = id;
          //console.log('src',item.src)
      //item.div = mDom(dInstruction,{h:30},{tag:'img',src:item.src,id:id}); //item.a, handler, dInstruction, buttonstyle, null, id);
    } else if (type == 'img'){
      console.log('src',item.src)
      item.div = mDom(dInstruction,{h:30},{tag:'img',src:item.src,id:id}); //item.a, handler, dInstruction, buttonstyle, null, id);
    } else {
      let ui = item.div = iDiv(item.o);
      ui.onclick = ev => select_last(item, select_toggle, ev);
      ui.id = id;
    }
  }
  let show_submit_button = !has_submit_items && (A.minselected != A.maxselected || !A.autosubmit);
  if (show_submit_button) { mButton('submit', callback, dInstruction, buttonstyle, 'selectable_button', 'bSubmit'); }
  let show_restart_button = A.level > 1;
  if (show_restart_button) { mButton('restart', onclick_reload, dInstruction, buttonstyle, 'selectable_button', 'bReload'); }
  let dParent = window[`dActions${A.level}`];
  for (const item of A.items) { ari_make_selectable(item, dParent, dInstruction); }
  assertion(A.items.length >= min, 'less options than min selection!!!!', A.items.length, 'min is', min);
  if (A.items.length == min && !is_ai_player() && !prevent_autoselect) {
    for (const item of A.items) { A.selected.push(item.index); ari_make_selected(item); }
    if (A.autosubmit) {
      loader_on();
      setTimeout(() => { if (callback) callback(); loader_off(); }, 800);
    }
  } else if (is_ai_player()) {
    ai_move();
  } else if (TESTING && isdef(DA.test)) {
    if (DA.test.iter >= DA.auto_moves.length) {
      if (isdef(DA.test.end)) DA.test.end();
      activate_ui();
      return;
    }
    let selection = DA.auto_moves[DA.test.iter++];
    if (selection) {
      deactivate_ui();
      let numbers = [];
      for (const el of selection) {
        if (el == 'last') {
          numbers.push(A.items.length - 1);
        } else if (el == 'random') {
          numbers.push(rNumber(0, A.items.length - 1));
        } else if (isString(el)) {
          let commands = A.items.map(x => x.key);
          let idx = commands.indexOf(el);
          numbers.push(idx);
        } else numbers.push(el);
      }
      selection = numbers;
      A.selected = selection;
      if (selection.length == 1) A.command = A.items[A.selected[0]].key;
      A.last_selected = A.items[A.selected[0]];
      select_highlight();
      setTimeout(() => {
        if (A.callback) A.callback();
      }, 1000);
    } else { activate_ui(); }
  } else { activate_ui(); }
}
function select_clear_previous_level() {
  let A = Z.A;
  if (!isEmpty(A.items)) {
    console.assert(A.level >= 1, 'have items but level is ' + A.level);
    A.ll.push({ items: A.items, selected: A.selected });
    let dsel = mBy(`dSelections1`);
    mStyle(dsel, { display: 'flex', 'align-items': 'center', padding: 10, box: true, gap: 10 });
    for (const item of A.items) {
      ari_make_unselectable(item);
      if (A.keep_selection) continue;
      ari_make_unselected(item);
      if (!A.selected.includes(item.index)) continue;
      if (item.itemtype == 'card') {
        let d = iDiv(item);
        let card = item.o;
        let mini = mDiv(dsel, { bg: 'yellow', fg: 'black', hpadding: 2, border: '1px solid black' }, null, card.friendly);
      } else if (item.itemtype == 'container') {
        let list = item.o.list;
        let cards = list.map(x => ari_get_card(x, 30, 30 * .7));
        let cont2 = ui_make_hand_container(cards, dsel, { bg: 'transparent' });
        ui_add_cards_to_hand_container(cont2, cards, list);
      } else if (item.itemtype == 'string') {
        let db = mDiv(dsel, { bg: 'yellow', fg: 'black', border: 'black', hpadding: 4 }, item.id, item.a);
      }
    }
  }
}
function mistStats(){
	if (plname == herald) {
		//console.log('d', d, d.children[0]); let img = d.children[0];
		mSym('tied-scroll', d, { fg: 'gold', fz: 24, padding: 4 }, 'TR');
	}
	if (exp_church(Z.options)) {
		if (isdef(pl.tithes)) {
			player_stat_count('cross', pl.tithes.val, d);

		}
	}
	let dCoin = player_stat_count('coin', pl.coins, d);
	item.dCoin = dCoin.firstChild;
	item.dAmount = dCoin.children[1];

	let list = pl.hand.concat(pl.stall);
	let list_luxury = list.filter(x => x[2] == 'l');
	player_stat_count('pinching hand', list.length, d);
	let d1 = player_stat_count('hand-holding-usd', list_luxury.length, d);
	mStyle(d1.firstChild, { fg: 'gold', fz: 20 })

	if (!isEmpty(fen.players[plname].stall) && fen.stage >= 5 && fen.stage <= 6) {
		player_stat_count('shinto shrine', !fen.actionsCompleted.includes(plname) || fen.stage < 6 ? calc_stall_value(fen, plname) : '_', d);
	}
	player_stat_count('star', plname == U.name || isdef(fen.winners) ? ari_calc_real_vps(fen, plname) : ari_calc_fictive_vps(fen, plname), d);

	if (fen.turn.includes(plname)) {
		show_hourglass(plname, d, 30, { left: -3, top: 0 }); //'calc( 50% - 36px )' });
	}
}
async function onclickNATIONS() {

	if (nundef(M.natCards)) M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');

	//showTitle('NATIONS!!!');
	M.civs = ['america', 'arabia', 'china', 'egypt', 'ethiopia', 'greece', 'india', 'japan', 'korea', 'mali', 'mongolia', 'persia', 'poland', 'portugal', 'rome', 'venice', 'vikings'];

	let player = M.player = { civ: rChoose(M.civs) };

	//brauche events in ages,progress in ages
	M.ages = { 1: { events: [], progress: [] }, 2: { events: [], progress: [] }, 3: { events: [], progress: [] }, 4: { events: [], progress: [] } };
	for (const k in M.natCards) {
		let c = M.natCards[k];
		if (c.age == 0) continue;
		let age = c.age == 0 ? 1 : c.age;
		if (c.Type == 'event') M.ages[age].events.push(k); else M.ages[age].progress.push(k);
	}
	//set age=1
	M.age = 1;
	M.events = M.ages[M.age].events;
	M.progress = M.ages[M.age].progress;
	arrShuffle(M.progress);
	arrShuffle(M.events);

	//cardgrid
	let d1 = mDiv('dMain'); mFlex(d1);
	M.rows = 3; M.cols = 7;
	let bg = mGetStyle('dNav', 'bg');
	let h = 180;

	let dcost = M.costGrid = mGrid(M.rows, 1, d1, { 'align-self': 'start' });
	for (let cost = 3; cost >= 1; cost--) {
		let d2 = mDom(dcost, { display: 'flex', 'justify-content': 'center', 'flex-flow': 'column', box: true, margin: 2, h: h, overflow: 'hidden' }, {});

		for (let i = 0; i < cost; i++) mDom(d2, { h: 40 }, { tag: 'img', src: `../assets/games/nations/templates/gold.png` });
	}
	// mDom(dcost, { bg: 'pink', fg:'contrast', box: true, margin: 2, h: h,w:20, overflow: 'hidden' },{html:2});
	// mDom(dcost, { bg: 'pink', fg:'contrast', box: true, margin: 2, h: h,w:20, overflow: 'hidden' },{html:1});

	M.grid = mGrid(M.rows, M.cols, d1, { 'align-self': 'start' });
	M.cells = [];
	for (let i = 0; i < M.rows * M.cols; i++) {
		let d = mDom(M.grid, { box: true, margin: 2, h: h, overflow: 'hidden' });
		mCenterCenterFlex(d);
		M.cells.push(d);
	}
	let n = M.rows * M.cols;
	M.market = [];
	for (let i = 0; i < n; i++) {
		let k = M.progress.shift();
		M.market.push(k);
		let card = M.natCards[k];
		let img = mDom(M.cells[i], { h: h, w: 115 }, { tag: 'img', src: `../assets/games/nations/cards/${k}.png` });
		img.setAttribute('key', k)
		img.onclick = buyProgressCard;
	}

	mDom('dMain', { h: 20 })

	let dciv = mDom('dMain', { w: 800, h: 420, maleft: 52, bg: 'red', position: 'relative' });
	let iciv = await loadImageAsync(`../assets/games/nations/civs/civ_${player.civ}.png`, mDom(dciv, { position: 'absolute' }, { tag: 'img' }));

	//add spots to civ
	M.civCells = [];
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 7; j++) {
			let r = getCivSpot(player.civ, i, j);
			let [dx,dy,dw,dh]=[10,10,15,20]
			let d = mDom(dciv, { box: true, w: r.w+dw, h: r.h+dh, left: r.x-dx, top: r.y-dy, position: 'absolute', overflow: 'hidden' });
			mCenterCenterFlex(d);
			M.civCells.push(d);
			d.onclick = () => selectCivSpot(d);
		}
	}

	return;
	//console.log('iciv',iciv)
	let invgrid = mDom(dciv, { position: 'absolute', w: 800, h: 420 });
	let g1 = mGrid(2, 7, invgrid, { 'align-self': 'start' });
	M.civCells = [];
	for (let i = 0; i < 14; i++) {
		let d = mDom(g1, { box: true, h: 170, w: 800 / 7, bg: rColor(.5), overflow: 'hidden' });
		mCenterCenterFlex(d);
		M.civCells.push(d);
		d.onclick = () => selectCivSpot(d);
	}


}
function buyProgressCard(ev) {
	let o = evToAttr(ev, 'key');
	//console.log('player buys',o.val);
	o.elem.remove();
	let spot = M.selectedCivSpot
	if (isdef(spot)) {
		spot.innerHTML = '';
		let [w,h]=[mGetStyle(spot,'w'),mGetStyle(spot,'h')];
		mAppend(spot, o.elem);
		mStyle(o.elem, { h: h,w:w });
		//o.elem.setAttribute('pointer-events', 'none');
		o.elem.onclick = () => selectCivSpot(spot)
		mClassRemove(M.selectedCivSpot,'shadow');
		M.selectedCivSpot = null;
	}
}
function selectCivSpot(d) {
	if (isdef(M.selectedCivSpot)) mClassRemove(M.selectedCivSpot,'shadow');
	M.selectedCivSpot = d;
	mClass(d,'shadow')
	//console.log('civ spot is',M.selectedCivSpot)
}function mist(){

	let [restlist, _] = findPoints(ctx, 0, w, 0, h, cgoal, 5);

	console.log('restlist',restlist);return;

	let num = 201;
	let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
	let res = [];

	while (num > 100 && i < colors.length) {
		let color = colors[i++];
		let o = nextBar(ctx, restlist, color);
		restlist = o.rest;
		num = o.line.length;
		//console.log('y',o.val,'num',num,'restlist',o.rest.length);
		res.push(o)
	}
	console.log('result',res);
	let diff = 243;

	let cand = res.filter(o=>o.val>=40 && o.val<=500); // res[0].val<40?res.slice(1):res;
	let [kleinere, groessere] = findMidlines(cand,diff); //res.slice(1,res.length-2), diff); //erste und letzte weg!

	let topmost, bottommost;
	for (const l3 of res) {
		let distleft = kleinere.val - l3.val; //Math.abs(kleinere.val - l3.val);
		let distright = l3.val-groessere.val;
		//console.log(l3.val, l3.color, distleft, distright)
		if (isWithinDelta(distleft, diffleft, 2)) {
			//console.log('found left', l3.color); 
			topmost = l3;
		}
		if (isWithinDelta(distright, diffright, 2)) {
			//console.log('found right', l3.color); 
			bottommost = l3;
		}
	}
	let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.val, nundef(bottommost) ? w : bottommost.val]
	//let lyellow = res[0];
	//let lblue = res.find(l => l.color == 'blue');
	//console.log('unterer abstand', Math.abs(lyellow.val - lblue.val));
	return [ytop, kleinere.val, groessere.val, ybottom, topmost, kleinere, groessere, bottommost];
	//24 ist der untere abstand!

}
function getLine(ctx, list, val) {
	let res = list.filter(p => isWithinDelta(p.y, val, 2) && (isLightBeforeV(ctx, p.x, p.y) || isLightAfterV(ctx, p.x, p.y)));
	//console.log('val', vfreq); console.log('line', res.length);

	//sort line by x value
	let ls=sortBy(res,'x');

	//console.log(ls)

	//look for lingest stretch of consecutive x values -> this is the real line!
	let segments = [],seg=[];
	let i=-1;
	while(++i<ls.length-1){
		let p1=ls[i],p2=ls[i+1];
		if (p2.x>p1.x+1) {
			seg.push(p1);segments.push(seg);seg=[];
		}else {
			seg.push(p1);
			if (p2.x==p1.x) i++;
		}
	}
	segments.push(seg)

	//find longest segment
	//console.log('segments',segments);
	let len=0,best=null;
	for(const s of segments){if (s.length>len){len=s.length;best=s}}

	return best;
}
function findDarkBars(ctx, w, h, cgoal, diffleft, diffright) {
	let [restlist, _] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
	let num = 201;
	let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
	let res = [];

	while (num > 200 && i < colors.length) {
		let color = colors[i++];
		let o = nextBar(ctx, restlist, color);
		restlist = o.rest;
		num = o.line.length;
		//console.log('y',o.val,'num',num,'restlist',o.rest.length);
		res.push(o)
	}
	//console.log('result',res);
	let diff = 243;
	let [kleinere, groessere] = findMidlines(res, diff);

	let topmost, bottommost;
	for (const l3 of res) {
		let distleft = Math.abs(kleinere.val - l3.val);
		let distright = Math.abs(groessere.val - l3.val);
		console.log(l3.val, l3.color, distleft, distright)
		if (isWithinDelta(Math.abs(kleinere.val - l3.val), diffleft, 2)) {
			//console.log('found left', l3.color); 
			topmost = l3;
		}
		if (isWithinDelta(Math.abs(groessere.val - l3.val), diffright, 2)) {
			//console.log('found right', l3.color); 
			bottommost = l3;
		}
	}
	let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.val, nundef(bottommost) ? w : bottommost.val]
	//let lyellow = res[0];
	//let lblue = res.find(l => l.color == 'blue');
	//console.log('unterer abstand', Math.abs(lyellow.val - lblue.val));
	return [ytop, kleinere.val, groessere.val, ybottom, topmost, kleinere, groessere, bottommost];
	//24 ist der untere abstand!

}
function findDarkLines(ctx, w, h, cgoal) {
	let [_, restlist] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
	let y, num = 201;
	let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
	let res = [];

	while (num > 200 && i < colors.length) {
		let color = colors[i++];
		let o = nextLine(ctx, restlist, color);
		restlist = o.rest;
		num = o.line.length;
		//console.log('y',o.val,'num',num,'restlist',o.rest.length);
		res.push(o)
	}
	//console.log('result',res);
	let diff = 261, diff2 = 24;
	let [kleinere, groessere] = findMidlines(res, diff);

	let topmost, bottommost;
	for (const l3 of res) {
		if (isWithinDelta(Math.abs(kleinere.val - l3.val), diff2, 2)) {
			//console.log('found oberstes', l3.color); 
			topmost = l3;
		}
		if (isWithinDelta(Math.abs(groessere.val - l3.val), diff2, 2)) {
			//console.log('found unterstes', l3.color); 
			bottommost = l3;
		}
	}
	let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.val, nundef(bottommost) ? h : bottommost.val]
	// let lyellow = res[0];
	// let lblue = res.find(l => l.color == 'blue');
	// console.log('unterer abstand', Math.abs(lyellow.val - lblue.val));
	return [ytop, kleinere.val, groessere.val, ybottom, topmost, kleinere, groessere, bottommost];
	//24 ist der untere abstand!

}
function findDarkBars(ctx, w, h, cgoal) {
	let [restlist, _] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
	let num = 201;
	let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
	let res = [];

	while (num > 200 && i < colors.length) {
		let color = colors[i++];
		let o = nextBar(ctx, restlist, color);
		restlist = o.rest;
		num = o.line.length;
		//console.log('y',o.vfreq,'num',num,'restlist',o.rest.length);
		res.push(o)
	}
	//console.log('result',res);
	let diff = 243, diff2 = 24;
	let [kleinere, groessere] = findMidlines(res, diff);

	let topmost, bottommost;
	for (const l3 of res) {
		if (isWithinDelta(Math.abs(kleinere.vfreq - l3.vfreq), diff2, 2)) {
			console.log('found oberstes', l3.color); topmost = l3;
		}
		if (isWithinDelta(Math.abs(groessere.vfreq - l3.vfreq), diff2, 2)) {
			console.log('found unterstes', l3.color); bottommost = l3;
		}
	}
	let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.vfreq, nundef(bottommost) ? h : bottommost.vfreq]
	let lyellow = res[0];
	let lblue = res.find(l => l.color == 'blue');
	console.log('unterer abstand', Math.abs(lyellow.vfreq - lblue.vfreq));
	return [ytop, kleinere.vfreq, groessere.vfreq, ybottom];
	//24 ist der untere abstand!

}
function findDarkLines(ctx, w, h, cgoal) {
	let [_, restlist] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
	let y, num = 201;
	let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
	let res = [];

	while (num > 200 && i < colors.length) {
		let color = colors[i++];
		let o = nextLine(ctx, restlist, color);
		restlist = o.rest;
		num = o.line.length;
		//console.log('y',o.vfreq,'num',num,'restlist',o.rest.length);
		res.push(o)
	}
	//console.log('result',res);
	let diff = 261, diff2 = 24;
	let [kleinere, groessere] = findMidlines(res, diff);

	let topmost, bottommost;
	for (const l3 of res) {
		if (isWithinDelta(Math.abs(kleinere.vfreq - l3.vfreq), diff2, 2)) {
			console.log('found oberstes', l3.color); topmost = l3;
		}
		if (isWithinDelta(Math.abs(groessere.vfreq - l3.vfreq), diff2, 2)) {
			console.log('found unterstes', l3.color); bottommost = l3;
		}
	}
	let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.vfreq, nundef(bottommost) ? h : bottommost.vfreq]
	let lyellow = res[0];
	let lblue = res.find(l => l.color == 'blue');
	console.log('unterer abstand', Math.abs(lyellow.vfreq - lblue.vfreq));
	return [ytop, kleinere.vfreq, groessere.vfreq, ybottom];
	//24 ist der untere abstand!

}
function findMidlines(res, diff) {
	let mid1, mid2;
	for (const l1 of res) {
		for (const l2 of res) {
			if (isWithinDelta(Math.abs(l1.vfreq - l2.vfreq), diff, 2)) {
				console.log('found!', diff, l1.color, l2.color);
				mid1 = l1; mid2 = l2;
			} //else if (isWithinDelta(Math.abs(l1.vfreq - l2.vfreq), diff2, 2)) { console.log('found!', diff2, l1.color, l2.color); }
		}
		if (isdef(mid1)) break;
	}
	let kleinere = mid1.vfreq < mid2.vfreq ? mid1 : mid2;
	let groessere = mid1 == kleinere ? mid2 : mid1;
	return [kleinere, groessere];
}
function getBar(ctx, list, val) {
	let res = list.filter(p => isWithinDelta(p.x, val, 2) && (isLightBefore(ctx, p.x, p.y) || isLightAfter(ctx, p.x, p.y)));
	//console.log('val', vfreq); console.log('line', res.length);
	return res;
}
function getLine(ctx, list, val) {
	let res = list.filter(p => isWithinDelta(p.y, val, 2) && (isLightBeforeV(ctx, p.x, p.y) || isLightAfterV(ctx, p.x, p.y)));
	//console.log('val', vfreq); console.log('line', res.length);
	return res;
}
function nextBar(ctx, rest, color) {
	list = rest;
	let val = findMostFrequentVal(list, 'x');
	rest = list.filter(p => !isWithinDelta(p.x, val, 2));
	let line = getBar(ctx, list, val); 
	line.map(p => drawPix(ctx, p.x, p.y, color));
	return { vfreq: val, line, rest, color };
}
function nextLine(ctx, rest, color) {
	list = rest;
	let val = findMostFrequentVal(list, 'y');
	rest = list.filter(p => !isWithinDelta(p.y, val, 2));
	let line = getLine(ctx, list, val); 
	line.map(p => drawPix(ctx, p.x, p.y, color));
	return { vfreq: val, line, rest, color };
}
function mist() {
	vfreq = findMostFrequentVal(listno, 'y');
	listno = list.filter(x => !isWithinDelta(x.y, vfreq, 2));
	listyes = list.filter(x => isWithinDelta(x.y, vfreq, 2));
	listyes.map(p => drawPix(ctx, p.x, p.y, 'orange'));

	vfreq = findMostFrequentVal(listno, 'y');
	listno = list.filter(x => !isWithinDelta(x.y, vfreq, 2));
	listyes = list.filter(x => isWithinDelta(x.y, vfreq, 2));
	listyes.map(p => drawPix(ctx, p.x, p.y, 'red'));

	return list.filter(o => o.y == vfreq);
}
function _findDarkLines(ctx, w, h, cgoal) {
	let [_, list] = findPoints(ctx, 0, w, 0, h, cgoal, 20);

	let vfreq = findMostFrequentVal(list, 'y');
	let restlist = list.filter(x => !isWithinDelta(x.y, vfreq, 2));
	console.log('val', vfreq); console.log('restlist', restlist.length)
	let linelist = getLine(ctx, list, vfreq); // list.filter(x=>isWithinDelta(x.y,vfreq,2) && (isLightBeforeV(ctx,x.x,x.y) || isLightAfterV(ctx,x.x,x.y)));
	linelist.map(p => drawPix(ctx, p.x, p.y, 'yellow'));

	list = restlist;
	vfreq = findMostFrequentVal(restlist, 'y');
	restlist = list.filter(x => !isWithinDelta(x.y, vfreq, 2));
	console.log('val', vfreq); console.log('restlist', restlist.length)
	linelist = getLine(ctx, list, vfreq);
	linelist.map(p => drawPix(ctx, p.x, p.y, 'orange'));

	list = restlist;
	vfreq = findMostFrequentVal(restlist, 'y');
	restlist = list.filter(x => !isWithinDelta(x.y, vfreq, 2));
	console.log('val', vfreq); console.log('restlist', restlist.length)
	linelist = getLine(ctx, list, vfreq);
	linelist.map(p => drawPix(ctx, p.x, p.y, 'red'));

	list = restlist;
	vfreq = findMostFrequentVal(restlist, 'y');
	restlist = list.filter(x => !isWithinDelta(x.y, vfreq, 2));
	console.log('val', vfreq); console.log('restlist', restlist.length)
	linelist = getLine(ctx, list, vfreq);
	linelist.map(p => drawPix(ctx, p.x, p.y, 'purple'));

	list = restlist;
	vfreq = findMostFrequentVal(restlist, 'y');
	restlist = list.filter(x => !isWithinDelta(x.y, vfreq, 2));
	console.log('val', vfreq); console.log('restlist', restlist.length)
	linelist = getLine(ctx, list, vfreq);
	linelist.map(p => drawPix(ctx, p.x, p.y, 'blue'));

	list = restlist;
	vfreq = findMostFrequentVal(restlist, 'y');
	restlist = list.filter(x => !isWithinDelta(x.y, vfreq, 2));
	console.log('val', vfreq); console.log('restlist', restlist.length)
	linelist = getLine(ctx, list, vfreq);
	linelist.map(p => drawPix(ctx, p.x, p.y, 'green'));

}

function calcBoundingBox(ctx,w,h,type){
	let [cgoal,clight,lighting]=type=='event'?['#6C4F64','#E7BB97',false]:['#59544E','#DBCEBE',true];
	// let [ex, ey] = findPoints(ctx, w * .15, w * .9, h * .05, h * .9, cgoal);

	// let resy = findEdgesApart(ey, 0, 261, 'y');
	// let resx = findEdgesApart(ex, 243, 0, 'x');
	// //ok now I did detect an edge finally!!!!

	// // let [restx,resty]=[ex.filter(o=>!resx.includes(o)),ey.filter(o=>!resy.includes(o))];
	// // restx.map(p => drawPix(ctx, p.x, p.y, 'blue'));
	// // resty.map(p => drawPix(ctx, p.x, p.y, 'yellow'));

	// resy.map(p => drawPix(ctx, p.x, p.y, 'red'));
	// resx.map(p => drawPix(ctx, p.x, p.y, 'green'));

	//mach corrections!
	let toplight = findRectSample(ctx, 20, w, 0, 0, clight, 4); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('top edge missing', toplight);
	let bottomlight = findRectSample(ctx, 20, w, h - 5, h - 5, clight, 4, true); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('bottom edge missing', bottomlight);
	let leftlight = findRectSample(ctx, 0, 0, 10, h, clight, 4); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('left edge missing', leftlight);
	let rightlight = findRectSample(ctx, w-5, w-5, 20, h-5, clight, 4, true); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('right edge missing', rightlight);

	let rect={};

	let top, bottom;
	if (toplight) {
		rect.top=0;
		console.log('top:', 0)
		//if top edge is missing then bottom edge will be higher up!
		bottom = findBottomEdge(ctx, w, h - 10, cgoal, h-5, lighting); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.bottom=bottom[0].y; 
		console.log('bottom', bottom[0].y, bottom.length)
	} else if (bottomlight) {
		rect.bottom=h;
		top = findTopEdge(ctx, w, h, cgoal, 5, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('top', top[0].y, top.length)
		rect.top=top[0].y;
		console.log('bottom', h);
	} else {
		top = findTopEdge(ctx, w, h, cgoal, 0, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		bottom = findBottomEdge(ctx, w, h, cgoal, h, lighting); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.top=top[0].y;
		rect.bottom=bottom[0].y; 
		console.log('top', top[0].y, top.length)
		console.log('bottom', bottom[0].y, bottom.length)
	}

	let left,right;
	if (leftlight) {
		rect.left=0;
		console.log('left:', 0)
		//if top edge is missing then bottom edge will be higher up!
		right = findRightEdge(ctx, w-10, h, cgoal, w-10, lighting); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('right', right[0].x, right.length)
		rect.right=right[0].x; 
	} else if (rightlight) {
		left = findLeftEdge(ctx, w, h, cgoal, 10, lighting); left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('left', left[0].x, left.length)
		rect.left=left[0].x; 
		console.log('right', w);
		rect.right=w; 
	} else {
		left = findLeftEdge(ctx, w, h, cgoal, 0, lighting); left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		right = findRightEdge(ctx, w, h, cgoal,w,lighting); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('left', left[0].x, left.length)
		console.log('right', right[0].x, right.length)
		rect.left=left[0].x; 
		rect.right=right[0].x; 
	}

	// left = findLeftEdge(ctx, w, h, cgoal); left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	// right = findRightEdge(ctx, w, h, cgoal); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	// console.log('left', left.length)
	// console.log('right', right.length)

	rect.x=rect.left;rect.y=rect.top;rect.w=rect.right-rect.left;rect.h=rect.bottom-rect.top;

	return rect; // [resx, resy];

}
async function natEdgeDetectTitle(k, src, border, idx) {

	let path = `../assets/games/nations/cards/${src}`;
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height]; console.log('w', w, 'h', h);

	//only consider images in landscape form
	if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.drawImage(img, 0, 0, w, h);
	//img.remove();

	let cgoal = '#544744';
	let [ex, ey] = findPoints(ctx, w * .15, w * .9, h * .05, h * .9, '#544744');

	let resy = findEdgesApart(ey, 0, 261, 'y');
	let resx = findEdgesApart(ex, 243, 0, 'x');
	//ok now I did detect an edge finally!!!!

	// let [restx,resty]=[ex.filter(o=>!resx.includes(o)),ey.filter(o=>!resy.includes(o))];
	// restx.map(p => drawPix(ctx, p.x, p.y, 'blue'));
	// resty.map(p => drawPix(ctx, p.x, p.y, 'yellow'));

	resy.map(p => drawPix(ctx, p.x, p.y, 'red'));
	resx.map(p => drawPix(ctx, p.x, p.y, 'green'));

	//mach corrections!
	let toplight = findRectSample(ctx, 20, w, 0, 0, '#DBCEBE', 4); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('top edge missing', toplight);
	let bottomlight = findRectSample(ctx, 20, w, h - 5, h - 5, '#DBCEBE', 4, true); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('bottom edge missing', bottomlight);
	let leftlight = findRectSample(ctx, 0, 0, 10, h, '#DBCEBE', 4); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('left edge missing', leftlight);
	let rightlight = findRectSample(ctx, w-5, w-5, 10, h, '#DBCEBE', 4, true); //1top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	console.log('bottom edge missing', rightlight);

	let top, bottom;
	if (toplight) {
		console.log('top:', 0)
		//if top edge is missing then bottom edge will be higher up!
		bottom = findBottomEdge(ctx, w, h - 10, '#59544E'); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('bottom', bottom[0].y, bottom.length)
	} else if (bottomlight) {
		top = findTopEdge(ctx, w, h, '#59544E', 5); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('top', top[0].y, top.length)
		console.log('bottom', 0);
	} else {
		top = findTopEdge(ctx, w, h, '#59544E'); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		bottom = findBottomEdge(ctx, w, h, '#59544E'); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('top', top[0].y, top.length)
		console.log('bottom', bottom[0].y, bottom.length)
	}

	let left,right;
	if (leftlight) {
		console.log('left:', 0)
		//if top edge is missing then bottom edge will be higher up!
		right = findRightEdge(ctx, w-10, h, '#59544E'); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('right', right[0].x, right.length)
	} else if (rightlight) {
		left = findLeftEdge(ctx, w, h, '#59544E', 5); left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('left', left[0].x, left.length)
		console.log('right', 0);
	} else {
		left = findLeftEdge(ctx, w, h, '#59544E'); left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		right = findRightEdge(ctx, w, h, '#59544E'); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		console.log('left', left[0].x, left.length)
		console.log('right', right[0].x, right.length)
	}

	// left = findLeftEdge(ctx, w, h, '#59544E'); left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	// right = findRightEdge(ctx, w, h, '#59544E'); right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
	// console.log('left', left.length)
	// console.log('right', right.length)

	return [resx, resy];

}

function rest(){
	resy = sortBy(resy, 'y');
	//let ys=resy.map(o=>o.y); console.log('ys',ys);
	resy.map(o => o.nei = findPointAtDistance(o, 0, 261, resy));
	resy = resy.filter(x => x.nei);
	resy.map(p => drawPix(ctx, p.x, p.y, 'red'));


	// Example usage:
	const points = resy;

	const result = findMostFrequentY(points);
	console.log(result);




	resx = sortBy(resx, 'x');
	//let xs=resx.map(o=>o.x); console.log('xs',xs);
	resx.map(o => o.nei = findPointAtDistance(o, 243, 0, resx));
	resx = resx.filter(x => x.nei);
	resx.map(p => drawPix(ctx, p.x, p.y, 'blue'));



	return [resx, resy];


}
function findMostFrequentY(points) {
	if (!Array.isArray(points) || points.length === 0) {
		return null; // Return null for invalid input
	}

	let frequencyMap = new Map();

	// Count frequencies of y values
	for (let i = 0; i < points.length; i++) {
		const y = points[i].y;
		frequencyMap.set(y, (frequencyMap.get(y) || 0) + 1);
	}

	// Find the y value with the maximum frequency
	let mostFrequentY;
	let maxFrequency = 0;

	for (let [y, frequency] of frequencyMap) {
		if (frequency > maxFrequency) {
			mostFrequentY = y;
			maxFrequency = frequency;
		}
	}

	// Return the most frequent y value
	return mostFrequentY;
}

function __findMostFrequentY(points) {
	if (!Array.isArray(points) || points.length === 0) {
		return null; // Return null for invalid input
	}

	// Sort points by x-coordinate
	points.sort((a, b) => a.x - b.x);

	let currentX = points[0].x;
	let consecutiveXValues = [currentX];
	let frequencyMap = new Map();

	// Count frequencies of y values for consecutive x values
	for (let i = 0; i < points.length; i++) {
		if (points[i].x === currentX) {
			consecutiveXValues.push(points[i].x);
			const y = points[i].y;
			frequencyMap.set(y, (frequencyMap.get(y) || 0) + 1);
		} else {
			// If x value changes, find the most frequent y for the previous consecutive x values
			currentX = points[i].x;
			consecutiveXValues = [currentX];
			frequencyMap.clear();
			frequencyMap.set(points[i].y, 1);
		}
	}

	// Find the y value with the maximum frequency
	let mostFrequentY;
	let maxFrequency = 0;

	for (let [y, frequency] of frequencyMap) {
		if (frequency > maxFrequency) {
			mostFrequentY = y;
			maxFrequency = frequency;
		}
	}

	// Return the result as an object
	return {
		mostFrequentY: mostFrequentY,
		consecutiveXValues: consecutiveXValues
	};
}
//#endregion

//#region async (awaitable event: img unload)
async function loadImageAsync(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = url;
  });
}
//#endregion

//#region calendar (combu)
function uiTypeEvent(dParent,o,styles={}){
	Items[o.id]=o;

	// let styles1 = jsCopy(styles);
	// let ui=mDom(dParent,styles1); //,{html:rWord()});
	// styles1.h=styles.h+14

	let ui=mDom(dParent,styles,{id:o.id}); //,{html:rWord()});
	mFlexLR(ui);
	mStyle(ui,{'align-items': 'center','align-content':'center'})
	//console.log('styles',styles)

	//addKeys({weight:'normal',box:true},styles);  //addKeys({ wmax: '90%', box: true }, styles);

	let opts={ onEnter: onEventEdited, onclick: onclickExistingEvent, value: o.text };
	addKeys({ tag: 'input', classes: 'plain' }, opts);
	//console.log('parentWidth',dParent.style.width,mGetStyle(dParent,'w'))
	let [wtotal,wbutton]=[mGetStyle(dParent,'w'),20];
  let inp = mDom(ui, {matop:2,maleft:2,box:true,w:wtotal-wbutton}, opts);
	//console.log('styles',styles)
	//console.log('opts',opts)
  //x.focus();
  inp.addEventListener('keyup', ev => {
    if (ev.key == 'Enter') {
      mDummyFocus();
      if (isdef(opts.onEnter)) opts.onEnter(ev)
    }
  });

	let dr = mDom(ui, {box:true,w:wbutton,fg:'gray'});//,bg:'blue'});
	mStyle(dr,{fz:styles.fz+5,family:'pictoFa',box:true,cursor:'pointer',className:'hop1'});//matop:2,border:'red',bg:'blue',fg:'white'});
	let sym = M.superdi.pen_square;
	dr.innerHTML=String.fromCharCode('0x' + sym.fa); //'A'
	dr.onclick=ev=>evNoBubble(ev);


	return ui;
}
function restrestrest(){

  let ui = mDom(dParent, styles, { id: o.id });

  //mFlexLR(ui);
  //mStyle(ui, { 'align-items': 'center', 'align-content': 'center' });
  //mStyle(ui, { box:true, display: 'flex', 'justify-content': 'space-between' });

  //let inp = mDom(ui, { display:'inline',bg:'blue',box: true, w: wtotal - wbutton }, { value: o.text, tag: 'input', classes: 'plain' });
  let inp = mDom(ui, { outline:'none',border:0,'box-shadow': 'none',display:'inline',w: wtotal - wbutton }, { value: o.text, tag: 'input' });
  inp.onclick = ev => evNoBubble(ev)
  inp.addEventListener('keyup', ev => { if (ev.key == 'Enter') { mDummyFocus(); onEventEdited(o.id, inp.value); } });

  console.log('h',h)
  let but = mDom(ui, { display:'inline',bg:'red',box: true, w: wbutton, fg: 'gray' });
  mStyle(but, { fz: h,h:h,hline:h, family: 'pictoFa', box: true, cursor: 'pointer', className: 'hop1' });
  let sym = M.superdi.pen_square;
  but.innerHTML = String.fromCharCode('0x' + sym.fa);
  but.onclick = ev => { evNoBubble(ev); onclickExistingEvent(ev); }
  return ui;
}

function restUiTypeEvent(){

	let ui = mDom(dParent,{ w: '100%',paright:2, box:true });
	//109x88
	
	let [dl, dr] = mColFlex(ui, [12,1]);

	let inp = addEditable(dl, { w:'100%' }, { id: o.id, onEnter: onEventEdited, onclick: onclickExistingEvent, value: o.text });
  // let bx = mDom(dr, { w: '100%', h: '100%', cursor: 'pointer',halign:'center',valign:'center' }, { className: 'hop1' });
  // bx.onclick = ev => { evNoBubble(ev); onclickExistingEvent(ev) };

	// let d1=mDom(ui,{w:22,h:20,bg:'silver',border:'dimgray',rounding:'50%',align:'center'});
	//let sz=27;
	//let sym = showImage('pen_square', dr, {fg:'white',bg:'green',padding:0, w:sz,h:sz,className:'hop1'});

	mStyle(dr,{matop:2,border:'red',family:'pictoFa',box:true, w:20,h:21,bg:'blue',fg:'white'});
	let sym = M.superdi('pen_square');
	dr.innerHTML=String.fromCharCode('0x' + sym.fa); //'A'

	//<div style="font-size: 21.6px; line-height: 21.6px; font-family: pictoFa; background: rgba(0, 0, 0, 0); color: rgb(255, 255, 255); display: inline; cursor: pointer;"></div>
	

	return ui;
}
function uiTypeEvent(dParent,o){
	if (nundef(DA.calendar)) return;
	let cal=DA.calendar;
	let dt = new Date(Number(o.day));
	if (dt.getMonth() != cal.info.month || dt.getFullYear() != cal.info.year) return null;
	let dDay = cal.getDayDiv(dt); 
	Items[o.id]=o;

	let ui = mDom(dDay,{ w: '100%' });
	let inp = addEditable(ui, { w: '100%' }, { id: o.id, onEnter: onEventEdited, onclick: onclickExistingEvent, value: o.text });


	return ui;
}

function setEvent(id, o) {
  Items[id] = lookupSetOverride(U.data, ['events', id], o);
  mBy(id).value = stringBefore(o.text, '\n');
  return o;
}
async function updateEvent(id, o) {
  let result = await simpleUpload('event', o);
  setEvent(id, o);
  console.log('result', result);
}
async function onEventEdited(ev) {
  let id = evToId(ev);
  let o = Items[id];
  let inp = mBy(id);
  if (inp.value) {
    o.text = inp.value;
    console.log('text',o.text);
    await updateEvent(id, o);
  }
}
function showEventOpen(ev) {

	let id = evToId(ev);
	let e = getEvent(id);
	//console.log('event found',e);

	let popup = openPopup(ev);
	


	// if (e && mBy('dOpenEvent')) mBy('dOpenEvent').remove();
	// console.log('ev',ev)
	// let [x,y]=[ev.clientX,ev.clientY];
	// let d = mDom('dExtra',{wmin:300,hmin:300,position:'absolute',left:250,bg:'white',hpadding:20},{id:'dOpenEvent'});

	mNode(e, popup)

}

function evToEventObject(ev) {
  let inp = ev.target;
  let o = U.events[inp.id]; //Config.events[firstNumber(inp.id)];
  return o;
}

function onclickDay(ev) {
	//id kann ja nur die day id sein!!!!
	let tsDay = evToId(ev); //ev.target.getAttribute('date'); //evToTargetAttribute(ev,'date'); //ts for this day
	let tsCreated = Date.now()
	let id = generateEventId(tsDay, tsCreated);
	let o = { id: id, created: tsCreated, day: tsDay, from: null, to: null, title: '', text: '', user: Clientdata.userid, subscribers: [] };

	Serverdata.config.events[id] = o;
	// console.log(id,o);

	let d1 = addEditable(ev.target, { w: '100%' }, { id: id, onEnter: onEventEdited });
	//console.log(d1);

	//trag dieses event ein!
	//soll ich das event hier eintragen oder erst wenn es einen content hat?
}
async function onEventEdited(ev) {
	let id = evToId(ev);
	let o = Serverdata.config.events[id];
	let inp = mBy(id);
	if (inp.value) {
		//console.log('send value',inp.value,'to server')
		o.text = inp.value;
		await serverUpdate('event',o)
	}

	//console.log('event',id,o,inp)
	//ich moecht das event mit await an den node js server schicken,
	//dort saven mit der id oder einer neuen id

}

function saveEvent(o) {
  let inp = o.div.lastChild;
  //delete o.div;
  console.log('o', o);
  mStyle(inp, {
    fz: 10, cursor: 'pointer',
    padding: 3, bg: '#58bae4', fg: 'white', rounding: 5, hmax: 55,
    overflow: 'hidden'
  });
  inp.setAttribute('readonly', true);
  inp.onclick = ev => editEvent(ev, o)



  // if (DA.sessionType != 'live') {
  // }else{
  //   Config.events.push(o);
  //   localStorage.setItem('events', JSON.stringify(Config.events));
  // }
}
//******** */
function _detectSessionType() {

  //console.log('window.location', window.location.href);
  let loc = window.location.href;
  DA.sessionType = loc.includes('telecave') ? 'telecave' : loc.includes('8080') ? 'php' : 'live';
}
function getCorrectMonth(s, val) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let n = firstNumber(s);
  if (n >= 1 && n <= 12) return [n - 1, months[n - 1]];
  s = s.substring(0, 3).toLowerCase();
  for (const m of months) {
    let m1 = m.substring(0, 3).toLowerCase();
    if (s == m1) return [months.indexOf(m), m];
  }
  return val;
}
function getQuerystring(key) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == key) {
      return pair[1];
    }
  }
  return null;
}
function getUIDRelativeTo(arr) {
  let max = isEmpty(arr) ? 0 : arrMax(arr, x => x.id);
  //console.log('max',max,typeof max)
  return Number(max) + 1;
}
function handleAddEvent(obj) {
  //erst hier hat das event ein id!
  //dieses id muss jetzt id von seinem input object sein
  //inp ist lastChild vom children[0] vom dDays
  //diese children[0] koennt ich nennen: d_[month]_[day]
  Config.events.push(obj.event);
  //console.log('event',obj)
  localStorage.setItem('events', JSON.stringify(Config.events));
  //console.log('storage:',JSON.parse(localStorage.getItem('events')));

  //modify event input
  //woher bekomm ich das input?












  //downloadAsYaml(Config.events,'events'); //testing

}
function handleLogin(o) {
  if (o.status == 'loggedin') {
    //console.log('o',o)
    showSuccessMessage('login successful!');
    showLoggedin(o);
    startLoggedIn(o);
  } else if (o.status == 'wrong_pwd') {
    showError('wrong password!!!');
  } else if (o.status == 'not_registered') {
    showError(`user ${o.id} not registered!!!`);
    showPopupRegister();
  }
}
function handleLogout(o) {
  //console.log('handleLogout',o)
  showLogin();
}
function handleRegister(o) {
  //console.log('got register result!!!',o)
  if (o.status == 'registered') {
    showSuccessMessage('new registration successful!');
    mBy('dRegister').remove();

  } else if (o.status == 'duplicate') {
    showError('username already registered!!!');
  } else if (o.status == 'pwds_dont_match') {
    showError(`passwords do not match!!!`);
  }

}
function handleResult(result, cmd) {
  //console.log('result',result);//return;
  let obj = isEmptyOrWhiteSpace(result) ? { a: 1 } : JSON.parse(result);
  //dates should be converted to dates, numbers should be converted to numbers
  DA.result = jsCopy(obj);
  switch (cmd) {
    case "login": handleLogin(obj); break;
    case "logout": handleLogout(obj); break;
    case "register": handleRegister(obj); break;
    case "assets": loadAssetsPhp(obj); startWithAssets(); break;
    case "addEvent": handleAddEvent(obj); break;
    default:
      for (const k in obj) {
        console.log(k, obj[k], typeof obj[k])
      }
  }
}
function isCorrectMonth(s) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let n = firstNumber(s);

  if (n >= 1 && n <= 12) return months[n - 1];
  s = s.substring(0, 3).toLowerCase();
  for (const m of months) {
    let m1 = m.substring(0, 3).toLowerCase();
    if (s == m1) return m;
  }
  return false;
}
async function loadAll() {
  DA.sessionType = detectSessionType();
  if (DA.sessionType == 'live') {
    //load assets the live way form localhost
    await loadAssetsLive('../qtest/');
    //let events = DB.events = DB.events.map(x => x.date = new Date(x.date));
    //console.log('users', DB.users)
    //console.log('events', events)
    //console.log('subscribed', DB.subscribed)
    startWithAssets();
  } else {
    phpPost({}, 'assets');
  }
}
async function loadAssetsLive(projectPath, basepath = '../base/') {
  let path = basepath + 'assets/';
  Config = DB = await route_path_yaml_dict(projectPath + 'config.yaml');
  //console.log('from config',Config.events)

  //localStorage.clear();
  let events = localStorage.getItem('events');
  // console.log('___*\nevents in loc:', events);
  Config.events = isdef(events) ? JSON.parse(events) : [];
  // console.log('events',Config.events)
  //console.log('storage:',JSON.parse(localStorage.getItem('events')));
  // Config.events1 = JSON.parse(localStorage.getItem('events'));
  // console.log('events',Config.events1)
  // console.log(typeof Config.events);
  let users = localStorage.getItem('users');
  Config.users = users ? JSON.parse(users) : [];
  let subscribed = localStorage.getItem('subscribed');
  Config.subscribed = subscribed ? JSON.parse(subscribed) : [];
  Syms = await route_path_yaml_dict(path + 'allSyms.yaml');
  SymKeys = Object.keys(Syms);
  ByGroupSubgroup = await route_path_yaml_dict(path + 'symGSG.yaml');
  C52 = await route_path_yaml_dict(path + 'c52.yaml');
  Cinno = await route_path_yaml_dict(path + 'fe/inno.yaml');
  Info = await route_path_yaml_dict(path + 'lists/info.yaml');
  create_card_assets_c52();
  KeySets = getKeySets();
  // console.assert(isdef(Config), 'NO Config!!!!!!!!!!!!!!!!!!!!!!!!');
  // return { users: dict2list(DB.users, 'name'), games: dict2list(Config.games, 'name'), tables: [] };
}
function makeContentEditable(elem, setter) {
  if (nundef(mBy('dummy'))) addDummy(document.body, 'cc');
  elem.contentEditable = true;
  elem.addEventListener('keydown', ev => {
    if (ev.key == 'Enter') {
      ev.preventDefault();
      mBy('dummy').focus();
      if (setter) setter(ev);
    }
  });
}
function mFlexLine(d, bg = 'white', fg = 'contrast') {
  //console.log('h',d.clientHeight,d.innerHTML,d.offsetHeight);
  mStyle(d, { bg: bg, fg: fg, display: 'flex', valign: 'center', hmin: measureHeight(d) });
  mDiv(d, { fg: 'transparent' }, null, '|')
}
function measureHeight(d) {
  let d2 = mDiv(d, { opacity: 0 }, null, 'HALLO');
  return d2.clientHeight;
}
function queryDict() {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  let di = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (isdef(pair[1])) di[pair[0]] = pair[1];
  }
  return di;
}


function uiTypeCalendar(dParent, seedColor, month1, year1, events1 = []) {

  if (nundef(mBy('dummy'))) addDummy(document.body, 'cc');
  const [cellWidth, gap] = [100, 10];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  var dParent = toElem(dParent);
  const events = events1;
  var container = mDiv(dParent, {}, 'dCalendar');
  var currentDate = new Date();
  var today = new Date();
  // let dTitle = mDiv(container, { w: 760, padding: gap, fg: '#d36c6c', fz: 26, family: 'sans-serif', display: 'flex', justify: 'space-between' });
  let dTitle = mDiv(container, { w: 760, padding: gap, fz: 26, family: 'sans-serif', display: 'flex', justify: 'space-between' },{className:'title'});
  var dWeekdays = mGrid(1, 7, container, { gap: gap });
  var dDays = [];
  var info = {};
  //info.wheel = []; for (let i = 0; i < 12; i++) info.wheel.push(rColor('light', .5));
  // setColor(seedColor);
  for (const w of weekdays) { mDiv(dWeekdays, { w: cellWidth }, null, w, 'subtitle') };
  var dGrid = mGrid(6, 7, container, { gap: gap });
  var dDate = mDiv(dTitle, { display: 'flex', gap: gap },'dDate','','title');
  var dButtons = mDiv(dTitle, { display: 'flex', gap: gap });
  mButton('Prev',
    () => {
      let m = currentDate.getMonth();
      let y = currentDate.getFullYear();
      if (m == 0) setDate(12, y - 1); else setDate(m, y);
    },
    dButtons, { w: 70, margin: 0 }, 'input');
  mButton('Next',
    () => {
      let m = currentDate.getMonth();
      let y = currentDate.getFullYear();
      if (m == 11) setDate(1, y + 1); else setDate(m + 2, y);
    }, dButtons, { w: 70, margin: 0 }, 'input');
  var dMonth, dYear;

  function getDay(d) {
    let i = d + info.dayOffset;
    //console.log('i', i);
    if (i < 1 || i > info.numDays) return null;
    let ui = dDays[i];
    //console.log('ui', ui)
    if (ui.style.opacity === 0) return null;
    return { div: dDays[i], events: [] };
  }
  // function setColor(seed){ //c,cc) {
  //   info.wheel =mimali(seed,12);
  //   info.seedColor = seed;
  // }
  function setDate(m, y) {
    currentDate.setMonth(m - 1);
    currentDate.setFullYear(y);
    mClear(dDate);
    dMonth = mDiv(dDate, {}, 'dMonth', `${currentDate.toLocaleDateString('en-us', { month: 'long' })}`);
    dYear = mDiv(dDate, {}, 'dYear', `${currentDate.getFullYear()}`);
    // makeContentEditable(dMonth, ev => {
    //   let d = ev.target;
    //   if (d != dMonth) return;
    //   let val = getCorrectMonth(d.innerHTML, months[currentDate.getMonth()]);
    //   d.innerHTML = val[1];
    //   currentDate.setMonth(val[0])
    // });
    // makeContentEditable(dYear, ev => {
    //   let d = ev.target;
    //   if (d != dYear) return;
    //   let val = firstNumber(d.innerHTML);
    //   currentDate.setFullYear(val);
    //   d.innerHTML = val;
    // });

    mClear(dGrid); dDays.length = 0;
    //console.log('m',m,info.wheel[m])
    let outerStyles = {
      rounding: 4, patop: 4, pabottom: 4, weight: 'bold', box: true,
      paleft: gap / 2, w: cellWidth, hmin: cellWidth, 
      bg:'black',fg:'white',
      // fg: 'contrast', 
      //bg: info.wheel[m-1], //rColor('light', .5) //info.wheel[m-1],//rColor('light', .5)
    }

    let c=colorHex(mGetStyle('dNav','bg')); //info.seedColor; //info.wheel[m-1];
    //console.log('nav color is',c)
    let dayColors=mimali(c,43).map(x=>colorHex(x))
    //console.log('dayColors',dayColors)
    for (const i of range(42)) {
      let cell = mDiv(dGrid, outerStyles);
      mStyle(cell,{bg:dayColors[i],fg:'contrast'})
      dDays[i] = cell;
    }
    populate(currentDate);
    return { container, date: currentDate, dDate, dGrid, dMonth, dYear, setDate, populate };
  }
  function populate() {
    let dt = currentDate;
    const day = info.day = dt.getDate();
    const month = info.month = dt.getMonth();
    const year = info.year = dt.getFullYear();

    const firstDayOfMonth = info.firstDay = new Date(year, month, 1);
    const daysInMonth = info.numDays = new Date(year, month + 1, 0).getDate();

    const dateString = info.dayString = firstDayOfMonth.toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
    info.dayOffset = paddingDays - 1;
    for (const i of range(42)) {
      if (i < paddingDays || i >= paddingDays + daysInMonth) { mStyle(dDays[i], { opacity: 0 }); }
    }
    //restliche tage bis month ende sind ok
    let innerStyles = { box: true, align: 'center', bg: 'beige', rounding: 4, w: '95%', hpadding: '2%', hmin: cellWidth - 28 };
    for (let i = paddingDays + 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = dDays[i - 1];
      let date = new Date(year, month, i - paddingDays);
      daySquare.innerText = i - paddingDays + (isSameDate(date, today) ? ' TODAY' : '');
      let d = mDom(daySquare, innerStyles, { id: date.getTime() });
      d.addEventListener('click', onclickDay); //ev => calendarOpenDay(date, daySquare.lastChild, ev));
    }
    updateEvents();
  }
  function updateEvents() {
    //console.log('events',events);
    for (const k in events) {
      //console.log('hhhhhhhhhhhhhhhhhhhhhhhh')
      let e = events[k];
      let dt = new Date(Number(e.day));
      //console.log('dt',dt)

      if (dt.getMonth() != currentDate.getMonth() || dt.getFullYear() != currentDate.getFullYear()) {
        //console.log('YES!');
        continue;
      }
      let dDay = dDays[dt.getDate() + info.dayOffset].children[0];

      //console.log('add another input to',dt,dDay);
      let d1 = addEditable(dDay, { w: '100%' }, { id: k, onEnter: onEventEdited, value: e.text });
      //console.log(d1);

      // let ch = arrChildren(dDay);
      // let d = ch[0]; 
      // let d1 = calendarAddExistingEvent(e, d);
      // e.div = d;
    }
    mBy('dummy').focus();
  }

  setDate(valf(month1, currentDate.getMonth() + 1), valf(year1, currentDate.getFullYear()));
  populate();

  return { container, date: currentDate, dDate, dGrid, dMonth, dYear, info, getDay, setDate, populate }
}
function mist(){
	//info.wheel = list; //[];
	//let x=colorMix(c,cc,50);

	// let o=new Color(c);
	// const contrastRatio = color.contrast('#ffffff'); // 1:1
	// const complementaryColor = color.complement(); // #00ff00 (Green)
	// const analogousColors = color.analogous(); // ['#ff8000', '#ffff00', '#00ff80']
	// const triadicColors = color.triadic(); // ['#ff0080', '#00ff00', '#8000ff']
	// console.log('!!!!!',contrastRatio,complementaryColor,analogousColors,triadicColors);
	
	// for (let i = 0; i < 12; i++) {
	//   //let c1=colorMix(c,coin()?'white':'black',10+i*(80/12))
	//   // let c1=colorMix(c,coin()?'white':'silver',10+i*(80/12))
	//   // let c1=colorMix(x,'silver',10+i*(80/12))
	//   let c1 = triadicColors[i%3];
	//   info.wheel.push(c1); //rColor('light', .5));
	// }
	//for(let i=0;i<12;i++) {      wheel[i]=list[i];    }
	let m = currentDate.getMonth();
	console.log('__________m', m);

	for (const d of dDays) { mStyle(d, { bg: info.wheel[m] }); }

}
function muell(){
	console.log('clicked on day',idDay);
	let tsEventDay = firstNumber(idDay);
	let dte = new Date(tsEventDay)
	let day=`${dte.get}`
	console.log('clicked on date',dte);
	let tsCreated = Date.now();
	console.log('created',tsCreated,new Date(tsCreated));
	let id = idDay;
	let o = {inpId:idDay,day:tsEventDay,from:null,to:null,created:tsCreated,title:'',text:'',user:Clientdata.userid,subscribers:[]};
	//Config.Events
	console.log('created event',o)
	//start input field in this day element
	//find a unique id for input field
	//create an event for this input field
	//event:{id,user,content,date,time}
}


//#endregion

//#region civs
async function ___imgAsync(src,dParent,styles={},opts={}){
	if (isdef(mBy('img1'))) mBy('img1').remove();
	let img = mDom(document.body, { position: 'absolute', top: '70vh', h: width }, { tag: 'img', id: 'img1' });
	await loadImageAsync(src,img); //hier ist img loaded!!!
}

async function natCivsToLandscape() {
  async function imgSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient) {
    if (isdef(mBy('img1'))) mBy('img1').remove();
    let img = mDom(imgParent, { position: 'absolute', top: '100vh', h: width }, { tag: 'img', id: 'img1' });
    await loadImageAsync(src,img); //hier ist img loaded!!!
    await onloadCiv(img,...arguments);
  }
  async function onloadCiv(img,src, width, name, viewParent, imgParent, sendToServer, downloadAtClient){
    let d = viewParent;
    console.log('d',d)
    console.log('img',img)
    mClear(d);
    let canvas = mDom(d, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
    let ctx = canvas.getContext('2d');
    ctx.translate(img.height, 0)
    ctx.rotate(90 * Math.PI / 180);
  
    // ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
    ctx.drawImage(img, 0, 0, img.width, img.height)
    if (downloadAtClient) downloadCanvas(canvas);
    if (sendToServer) {
      let dataUrl = canvas.toDataURL('image/png');
      //let dataUrl = imgToDataUrl(canvas);
      let unique = `civ_${name}`; //_${rName()}`;
      let path = `assets/games/nations/civs/${unique}.png`;
      let o = { image: dataUrl, name: name, unique: unique, coll: 'nations', path: path, ext: 'png' };
      console.log('dataUrl');
      let resp = await mPostRoute('postImage', o);
      console.log('resp', resp);
    }
  }
  let dbody = document.body; dbody.innerHTML = '';
	let d = mDom(dbody, { bg: 'skyblue', hmin: '100vh' }, { id: 'd1' });
	// let dhidden = mDom(dbody);

	let civlist=['america','arabia','china','egypt','ethiopia','greece','india','japan','korea','mali','mongolia','persia','poland','portugal','rome','venice','vikings'];
	for (const civ of ['vikings']) {
		let src = `../assets/games/nations/civs_old/${civ}.jpg`;
		let width = 800;
		let name = civ;
		let viewParent = d;
		let imgParent = dbody;
		let sendToServer = true;
		let downloadAtClient = false;
		await imgSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);
	}
}
async function imgSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient) {
	if (isdef(mBy('img1'))) mBy('img1').remove();
	mClear(imgParent);
	// let img = mDom(imgParent, { position: 'absolute', top: '100vh', h: width }, { tag: 'img', id: 'img1' });
	let img = mDom(imgParent, { h: width }, { tag: 'img', id: 'img1' });
	await loadImageAsync(src,img,onloadCiv,Array.from(arguments));
}
async function onloadCiv(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient){
	let d = viewParent;
	mClear(d);
	let canvas = mDom(d, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	let ctx = canvas.getContext('2d');
	ctx.translate(img.height, 0)
	ctx.rotate(90 * Math.PI / 180);

	// ctx.fillStyle='yellow';
	//ctx.fillRect(1,1,w,h);
	ctx.drawImage(img, 0, 0, img.width, img.height)

	if (downloadAtClient) downloadCanvas(canvas);
	if (sendToServer) {
		let dataUrl = canvas.toDataURL('image/png');
		//let dataUrl = imgToDataUrl(canvas);
		let unique = `civ_${name}_${rName()}`;
		let o = { image: dataUrl, name: name, unique: unique, coll: 'nations', path: unique + '.png', ext: 'png' };
		console.log('dataUrl');
		let resp = await mPostRoute('postImage', o);
		console.log('resp', resp);
	}
}
async function __loadImageAsync(url,img,callback=null) {
  return new Promise((resolve, reject) => {
    //const img = new Image();
    img.onload = () => {
			if (callback) callback();
      resolve(img);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = url;
  });
}

async function __imgSaveAsLandscape(src, width, viewParent, sendToServer, downloadAtClient) {
	if (isdef(mBy('img1'))) mBy('img1').remove();
	let img = mDom(document.body, { position: 'absolute', top: '100vh', h: width }, { tag: 'img', src: src, id: 'img1' });
	img.onload = async () => {
		let d = viewParent;
		mClear(d);
		let canvas = mDom(d, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
		let ctx = canvas.getContext('2d');
		ctx.translate(img.height, 0)
		ctx.rotate(90 * Math.PI / 180);

		// ctx.fillStyle='yellow';
		//ctx.fillRect(1,1,w,h);
		ctx.drawImage(img, 0, 0, img.width, img.height)

		if (downloadAtClient) downloadCanvas(canvas);
		if (sendToServer) {
			let dataUrl = canvas.toDataURL('image/png');
			//let dataUrl = imgToDataUrl(canvas);
			let unique = `civ_${name}_${rName()}`;
			let o = { image: dataUrl, name: name, unique: unique, coll: 'nations', path: unique + '.png', ext: 'png' };
			console.log('dataUrl');
			let resp = await mPostRoute('postImage', o);
			console.log('resp', resp);
		}


	};

}

//#endregion

//#region colors
function colorToNumber(color='yellow') {

	let c=colorRGB(color,true); console.log(c)
  // Ensure each component is in the valid range (0-255)
  red = c.r;// Math.max(0, Math.min(255, red));
  green = c.g;//Math.max(0, Math.min(255, green));
  blue = c.b;//Math.max(0, Math.min(255, blue));

  // Combine components into a single integer
  const numberRepresentation = (red << 16) + (green << 8) + blue;

  return numberRepresentation;
}
function numberToColor(numberRepresentation) {
  // Extract red, green, and blue components
  const red = (numberRepresentation >> 16) & 255;
  const green = (numberRepresentation >> 8) & 255;
  const blue = numberRepresentation & 255;

  return colorFrom({ r:red, g:green, b:blue });
}
function generateGradientColor(startColor, endColor, steps) {
  // Create an empty array to store the gradient colors
  const gradientColors = [];

  // Iterate over the number of steps
  for (let i = 0; i < steps; i++) {
    // Calculate the step size
    const stepSize = 1 / steps;

    // Calculate the current color
    const currentColor = startColor + (endColor - startColor) * stepSize;

    // Add the current color to the gradient colors array
    gradientColors.push(currentColor);
  }

  // Return the gradient colors array
  return gradientColors;
}
function getComplementaryColor(hexColor) {
	// Remove the hash symbol if present
	hexColor = hexColor.replace(/^#/, '');

	// Convert hex to RGB
	const r = parseInt(hexColor.slice(0, 2), 16);
	const g = parseInt(hexColor.slice(2, 4), 16);
	const b = parseInt(hexColor.slice(4, 6), 16);

	// Calculate complementary color
	const compR = 255 - r;
	const compG = 255 - g;
	const compB = 255 - b;

	// Convert RGB back to hex
	const compHexColor = `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;

	return compHexColor;
}
function getSimilarColor(hexColor) {
	hexColor = hexColor.replace(/^#/, '');

	const r = parseInt(hexColor.slice(0, 2), 16);
	const g = parseInt(hexColor.slice(2, 4), 16);
	const b = parseInt(hexColor.slice(4, 6), 16);

	const hslColor = rgbToHsl(r, g, b);

	// Adjust the hue, saturation, and lightness
	const adjustedColor = hslToRgb(hslColor.h, Math.min(hslColor.s + 20, 100), Math.min(hslColor.l + 10, 100));

	const adjustedHexColor = `#${adjustedColor.r.toString(16).padStart(2, '0')}${adjustedColor.g.toString(16).padStart(2, '0')}${adjustedColor.b.toString(16).padStart(2, '0')}`;

	return adjustedHexColor;

	// Convert RGB to HSL
	function rgbToHsl(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);

		let h, s, l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // grayscale
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
	}

	// Convert HSL to RGB
	function hslToRgb(h, s, l) {
		h /= 360;
		s /= 100;
		l /= 100;

		let r, g, b;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const hue2rgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;

			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
	}
}
function getMatchingColor(hexColor, diff) {
	// Remove the hash symbol if present
	hexColor = hexColor.replace(/^#/, '');

	// Convert hex to RGB
	const r = parseInt(hexColor.slice(0, 2), 16);
	const g = parseInt(hexColor.slice(2, 4), 16);
	const b = parseInt(hexColor.slice(4, 6), 16);

	// Convert RGB to HSL
	const hslColor = rgbToHsl(r, g, b);

	// Adjust the hue (e.g., increase by 180 degrees)
	const adjustedHue = (hslColor.h + diff) % 360;

	// Convert back to RGB
	const matchingColor = hslToRgb(adjustedHue, hslColor.s, hslColor.l);

	// Convert RGB back to hex
	const matchingHexColor = `#${matchingColor.r.toString(16).padStart(2, '0')}${matchingColor.g.toString(16).padStart(2, '0')}${matchingColor.b.toString(16).padStart(2, '0')}`;

	return matchingHexColor;

	// Convert RGB to HSL
	function rgbToHsl(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);

		let h, s, l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // grayscale
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
	}

	// Convert HSL to RGB
	function hslToRgb(h, s, l) {
		h /= 360;
		s /= 100;
		l /= 100;

		let r, g, b;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const hue2rgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;

			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
	}

	// // Example usage:
	// const hexColor = '#3498db'; // Replace with your hex color
	// const matchingColor = getMatchingColor(hexColor);

	// console.log(`Matching color for ${hexColor} is ${matchingColor}`);

}
function mist(){
	let color = new Color("p3", [0, 1, 0]);
	color.steps("red", {
		space: "lch",
		outputSpace: "srgb",
		maxDeltaE: 3, // max deltaE between consecutive steps
		steps: 14 // min number of steps
	});
	let redgreen = color.range("red", {
		space: "lch", // interpolation space
		outputSpace: "srgb"
	});
	console.log('redgreen',redgreen(...wheel))	

}
function switchToMenu(ev) {
	let mnew=isString(ev)?ev:ev.target.innerHTML;
	console.log('switching to',mnew);
	delete DA.calendar;
	mClear('dMain');
	// let p = mBy('dPopup');
	// console.log('............', p)
	// if (p) p.remove();
}
function __getColor(darkness) {
	let theme = U && U.ccontrast == 'white' ? 'dark' : 'light';
	if (theme) darkness = 7 - darkness;
	let c = getCSSVariable(`--pal${darkness}`);
	console.log('theme', theme, darkness, c)
	return c;
}
function getColor(className) {
	className = capitalize(className);
	let c = getCSSVariable(`--fg${className}`);
	console.log('getColor', className, c);
	return 'white';
	let theme = U && U.ccontrast == 'white' ? 'dark' : 'light';
	if (theme) darkness = 7 - darkness;
	c = getCSSVariable(`--pal${darkness}`);
	console.log('theme', theme, darkness, c)
	return c;
}

function showColors(dParent, list, fOnclick, fHtml = x => '', id = 'dPopup') {
	if (!isList(list)) { list = M.playerColors; fOnclick = onclickColor; }

	let dp=mBy('dMain')
	//popup!
	// if (nundef(dParent)) {
	// 	dParent = document.body;
	// 	if (mBy(id)) { console.log('...removing', mBy(id)); mBy(id).remove(); }
	// 	mIfNotRelative(dParent);
	// 	dp = mDom(dParent, { position: 'absolute', top: 52, left: 6, bg: 'white', hmin: 100 }, { id: id });
	// } else {
	// 	dParent = toElem(dParent); mClear(dParent);
	// 	dp = mDom(dParent, { bg: 'white', hmin: 100 }, { id: id });
	// }
	// mButtonX(dp, 30, id);
	// let d = mDom(dp, { padding: 34, display: 'flex', gap: '2px 4px', wrap: true });

	let d = mDom(dp, { hpadding:20, display: 'flex', gap: '2px 4px', wrap: true });

	let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
	list = list.concat(grays);

	//3x3x3x5 colors sind es + 15 grays
	let i = 0;
	for (const c of list) {
		let dc = mDom(d, { w: 50, h: 50, bg: c, fg: idealTextColor(c) }, { html: fHtml(c) });
		if (isdef(fOnclick)) { dc.onclick = fOnclick; mStyle(dc, { cursor: 'pointer' }); }
		i++; if (i % 15 == 0) mDom(d, { w: '100%', h: 0 });
	}
}
function setU() { }

function buildPaletteA(dParent,colorsList) {
  let d=mDom(dParent);
  mDiv(dParent,{},'palette')
  mDiv(dParent,{},'complementary')
  const paletteContainer = document.getElementById("palette");
  const complementaryContainer = document.getElementById("complementary");
  paletteContainer.innerHTML = "";
  complementaryContainer.innerHTML = "";
  colorsList = colorsList.map(x=>colorRGB(x,true))
  const orderedByColor = orderByLuminance(colorsList);
  console.log('ordered',orderedByColor)
  const hslColors = convertRGBtoHSL(orderedByColor);
  for (let i = 0; i < orderedByColor.length; i++) {
    const hexColor = rgbToHexCOOL(orderedByColor[i]);
    const hexColorComplementary = hslToHexCOOL(hslColors[i]);
    if (i > 0) {
      const difference = calculateColorDifference(
        orderedByColor[i],
        orderedByColor[i - 1]
      );
      if (difference < 120) {
        continue;
      }
    }
    const colorElement = document.createElement("div");
    colorElement.style.backgroundColor = hexColor;
    colorElement.appendChild(document.createTextNode(hexColor));
    paletteContainer.appendChild(colorElement);
    if (hslColors[i].h) {
      const complementaryElement = document.createElement("div");
      complementaryElement.style.backgroundColor = `hsl(${hslColors[i].h},${hslColors[i].s}%,${hslColors[i].l}%)`;
      complementaryElement.appendChild(
        document.createTextNode(hexColorComplementary)
      );
      complementaryContainer.appendChild(complementaryElement);
    }
  }
}
function setU(o) {
  U = { name: o.name, color: o.color };
  //let pal = getPalette(o.color,-1,1,.2);
  //let pal = colorPalSet(colorFrom(o.color)); //, nHues = 2, { ch2, lum = 50, sat = 100, lumSatMode = 1, blendMode = 1, a } = {})
  let color = o.color;
  let pal = colorPalette(color); pal.unshift('black'); pal.push('white');
  let icolor = pal.indexOf(color);
  //console.log(pal)
  let ccontrast = idealTextColor(color);
  let icontrast = pal.indexOf(ccontrast);

  //console.log('index of color=',icolor,'contrast',icontrast);
  //console.log('was soll jetzt geschehen?');
  //wenn der bg in user color gesetzt wird, muss der fg
  U.theme = icontrast == 0 ? 'light' : 'dark';

  let inc = icontrast == 0 ? 1 : -1;
  setCssVar('--bgBody', pal[icolor]);
  setCssVar('--bgLighter', pal[icolor + 3]);
  setCssVar('--bgDarker', pal[icolor - 3]);
  setCssVar('--bgNav', pal[icolor + 3 * inc]);
  setCssVar('--bgButtonActive', pal[icolor]);

  let i = icontrast;
  for (const x of ['buttonDisabled', 'button']) {
    let s = `--fg${capitalize(x)}`;
    i += inc;
    //console.log(i,pal[i])
    setCssVar(s, pal[i]);
  }
  setCssVar('--fgTitle', ccontrast);
  setCssVar('--fgSubtitle', pal[icontrast + inc]);
  setCssVar('--fgButtonHover', pal[icontrast + inc]);
  setCssVar('--fgButtonActive', pal[icontrast]);

  let cc = U.compcolor = getComplementaryColor(U.color);
  let pal2 = colorPalette(cc); pal2.unshift('black'); pal2.push('white');

  //ich koennt erstmal den hue rausfinden
  let hsl = colorHSL(color, true);
  console.log('_____hsl', hsl);
  //h ist 203
  //nehme abstand 20 x 12 fuer 12 farben die anderen hue haben als color
  //
  let hue = hsl.h;
  let diff = 30;
  let hstart = (hue + diff); //das ist also 223
  //suche 
  let wheels = [[], [], [], []];
  let p = 20;
  for (i = hstart; i <= hstart + 235; i += 20) {
    let h = i % 360;
    let c1 = colorFromHSL(h, 100, 75);
    //console.log('h',h,c1);
    let c2 = colorMix(color, cc, p);
    let c3 = colorTrans(c2, .5);
    wheels[0].push(c3); p += 5;
    wheels[1].push(getMatchingColor(color, p));
    wheels[2].push(cc);
    wheels[3].push(c1);
  }
  //console.log('wheel',wheels)
  U.wheel = wheels[3];
  //return;
  if (isdef(DA.calendar)) {
    let cal = DA.calendar;
    //let im=cal.date.getMonth();
    cal.setColors(wheels[3]); //color,cc); //wheel);
  }

  //console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
  let d = mBy('dPopup');
  if (!d) return;
  //console.log('d',d,d.firstChild,d.lastChild);
  let ch = d.firstChild.children; //arrChildren(d);
  //console.log('ch',ch)
  removeChildrenFromIndex(d, 1)
  let dw = mDom(d, { matop: 5 });
  let dc = mDom(dw, { w: 90, h: 50, bg: color, fg: idealTextColor(color) }, { html: color });
  let dcc = mDom(dw, { w: 90, h: 50, bg: cc, fg: idealTextColor(cc) }, { html: cc });
  for (i = 0; i < wheels.length; i++) {
    let dw1 = mDom(dw, { display: 'flex', gap: 5, bg: color, matop: 5, padding: 5 });
    //console.log('wheels[i]',wheels[i])
    for (const x of wheels[i]) {
      //console.log('x',x)
      mDom(dw1, { w: 90, h: 50, bg: x, fg: idealTextColor(x.substring(0, 7)) }, { html: x });
    }
  }
}
function onclickColor(ev) {
	let c = ev.target.style.background;
	c = colorHex(c);
	console.log('color',c)
	mStyle(document.body,{bg:c});
	return;
	console.log('clicked on', c);
	if (isdef(U)) {
		U.color = c;
		showUser();
	}

}
function restShowColors(){

	let dp = mPopup('Colors', document.body, { margin: '40px 10%', bg: 'white', padding: 10 },'dPopup');
	console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
	return;


	d = mDom(dp); mFlexWrap(d); mStyle(dp, );
	mStyle(d, { gap: 10 })
	mButtonX(d, ev => dp.remove(), pos = 'tr', sz = 25, fg = 'dimgray')
	for (const c of list) {
		let dc = mDom(d, { w: 50, h: 50, bg: c, fg: idealTextColor(c) }, { html: fHtml(c) });
		if (isdef(fOnclick)) { dc.onclick = fOnclick; mStyle(dc, { cursor: 'pointer' }); }
	} //colorLum(c).toFixed(2) });	}
	//mDom(d, { w: '100%' }, { html: 'HALLO<br>' })
	//	for (const c of list2) {		mDom(d, { w: 90, h: 25, bg: c, fg: idealTextColor(c) }, { html: c}); } //colorLum(c).toFixed(2) });	}
}

//#endregion

//#region combu
function onclickChat(ev){
	let ison=UI.toggler.toggle('dChat',ev.target);
	let dChat = mDom('dChat');mClear(dChat);
	if (ison){
		mStyle('dPage',{'grid-template-columns':`${UI.toggler.isOn('sidebar')?70:20}px auto 200px`});

		UI.chatInput = mInput(dChat, {}, '<your message>', 'input');
		UI.chatWindow = mDom(dChat, { hmax: 300 }, { id: 'dChatWindow' });
		mOnEnter(UI.chatInput, ev => Socket.emit('message', ev.target.value));
	}else{
		mStyle('dPage',{'grid-template-columns':`${UI.toggler.isOn('sidebar')?70:20}px auto 20px`});

	}

}
async function prelims() {
  if (nundef(M.superdi)) {
    Serverdata = await mGetRoute('session');
    await loadCollections();
    loadPlayerColors();
    let nav = UI.nav = mNavbar('dNav', {}, 'COMBU', ['add', 'play', 'schedule', 'view', 'colors']);
    nav.disable('play');
    dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
    dUser = mDom(nav.ui, {}, { id: 'dUser' });
    U = getUser(localStorage.getItem('username'));
    await showUser(U ? U.name : null);
    let server = getServerurl();
    Socket = io(server);
    Socket.on('message', showChatMessage);
    Socket.on('disconnect', x => console.log('>>disconnect:', x));
    Socket.on('update', x => console.log('>>update:', x));
    let dChat = mDom('dChat');
    UI.chatInput = mInput(dChat, {}, '<your message>', 'input');
    UI.chatWindow = mDom(dChat, { hmax: 300 }, { id: 'dChatWindow' });
    mOnEnter(UI.chatInput, ev => Socket.emit('message', ev.target.value));
  }
}
function windowToggler(){
	b=mDom(d,stButton,{html:String.fromCharCode('0x' + M.superdi.comment_sms.fa6),className:'hop1'});
	mStyle(b,{fg:'yellow'});
  b.onclick = ev => { evNoBubble(ev); onclickLeft(ev); }

	// style['text-shadow']='0 0 0 red';
	if (nundef(DA.toggle)) DA.toggle={left:{w:20},right:{w:20}};
	function getDiv(id){return mBy('d'+capitalize(id));}
	function on(id,b){
		let d=getDiv(id);

		if (isdef(b)) mStyle(b,{fg:'lime'})
		return DA.toggle[id].w>20;
	}
	function off(id,b){
		let d=mBy(id);
		if (isdef(b)) mStyle(b,{fg:'coral'})
		return DA.toggle[id]=false;
	}
	function toggle(id,b){
		return DA.toggle[id]===true?off(id,b):on(id,b);
	}
	function isOn(id){return DA.toggle[id];}
	return {isOn,on,off,toggle};
}
function onclickLeft(ev){
	let ison=UI.toggler.toggle('dSidebar',ev.target);
	let d = mDom('dSidebar');mClear(d);
	if (ison){
		mStyle('dPage',{'grid-template-columns':`${UI.toggler.isOn('sidebar')?70:20}px auto 200px`});

		UI.chatInput = mInput(d, {}, '<your message>', 'input');
		UI.chatWindow = mDom(d, { hmax: 300 }, { id: 'dChatWindow' });
		mOnEnter(UI.chatInput, ev => Socket.emit('message', ev.target.value));
	}else{
		mStyle('dPage',{'grid-template-columns':`${UI.toggler.isOn('sidebar')?70:20}px auto 20px`});

	}

}
async function prelims() {
	if (nundef(M.superdi)) {

		Serverdata = await mGetRoute('load', { config: true, session: true }); //console.log('Serverdata', Serverdata);
		await loadCollections();
		loadPlayerColors();

		let nav = UI.nav = mNavbar('dNav', {}, 'COMBU', ['add', 'play', 'schedule', 'view', 'colors']);
		nav.disable('play');

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
		//mInsert(document.body, dTitle, 1);

		dUser = mDom(nav.ui, {}, { id: 'dUser' });
		//console.log('alles ok!')
		await showUser();
	}
}
async function prelims() {
	if (nundef(M.superdi)) {

		Serverdata = await mGetRoute('load', { config: true, session: true }); console.log('Serverdata', Serverdata);
		await loadCollections();
		loadPlayerColors();

		// let nav=mBy('dNav');
		// mStyle(nav,{display:'flex','flex-wrap':'wrap','align-items':'center','justify-content': 'space-between'});


		//console.log('M', M, 'Config', Config);

		//let nav_old = mNavbar_old('dNav_old',{bg:getColor(0),fg:getColor(7)},'COMBU', ['add', 'play', 'schedule', 'view']);
		
		let nav = UI.nav = mNavbar('dNav',{},'COMBU', ['add', 'play', 'schedule', 'view']);
		//console.log('nav',nav)
		nav.disable('play');
		// dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
		//mInsert(document.body, dTitle, 1);

		dUser = mDom(nav.ui, {}, { id: 'dUser' });
		await userLoad();


	}

}
function sortByHueWithoutGrays(colors) {
  // Filter out the gray colors
  const nonGrayColors = colors.filter(color => !isGrayColor(color));

  // Convert non-gray hex colors to HSL format
  const hslNonGrayColors = nonGrayColors.map(AhexToHSL);

  // Sort by hue
  hslNonGrayColors.sort((a, b) => a.hue - b.hue);

  // Convert back to hex format
  const sortedHexColors = hslNonGrayColors.map(AhslToHex);

  return sortedHexColors;
}
function sortByMultipleProperties(list, p1, p2, p3) {
  return list.sort((a, b) => {
    // Compare by first property (p1)
    if (a[p1] < b[p1]) return -1;
    if (a[p1] > b[p1]) return 1;

    // If p1 values are equal, compare by second property (p2)
    if (a[p2] < b[p2]) return -1;
    if (a[p2] > b[p2]) return 1;

    // If p1 and p2 values are equal, compare by third property (p3)
    if (a[p3] < b[p3]) return -1;
    if (a[p3] > b[p3]) return 1;

    // If all properties are equal, no change in order
    return 0;
  });
}
async function prelims() {
	if (nundef(M.superdi)) {
		Config = await mGetYaml('../y/config.yaml');
		M = await mGetYaml('../assets/mhuge.yaml');

		M.byCollection = {};
		M.collections = ['all'];
		for (const k in M.superdi) {
			let o = M.superdi[k];
			lookupAddIfToList(M.byCollection, [o.coll], k);
			addIf(M.collections, o.coll);
		}

		await updateCollections();

		//console.log('M', M, 'Config', Config);
		let nav = UI.nav = mNavbar('COMBU', ['add', 'play', 'schedule', 'view'], ['user']);
		//console.log('nav',nav)
		nav.disable('play');
		dTitle = mDom(document.body); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
		mInsert(document.body, dTitle, 1);

	}

}
async function ___test24_newPrelims(){
	if (nundef(M.superdi)) {
		Config = await mGetYaml('../y/config.yaml');
		M = {};
		M.superdi = await mGetYaml('../assets/superdi.yaml');

		let list = [['byCollection','coll','collections'],['byCat','cats','categories'],['byFriendly','friendly','names']];
		for(const x of list){
			let [dikey,source,listkey]=[x[0],x[1],x[2]];
			let di = M[dikey]={};
			let lst = M[listkey] = [];
			for(const k in M.superdi){
				let o = M.superdi[k];
					//console.log('o[source]',k,source,o[source])
					//assertion(isdef(o[source]),'ERROR');
					if (isList(o[source])){
					o[source].map(x=>lookupAddIfToList(di,[x],o.key));
				}else lookupAddIfToList(di,[o[source]],o.key);
				addIf(lst,o.key);
			}
		}
		M.collections.unshift('all');

		await updateCollections();

		//console.log('M', M, 'Config', Config);
		let nav = UI.nav = mNavbar('COMBU', ['add', 'play', 'schedule', 'view'], ['user']);
		//console.log('nav',nav)
		nav.disable('play');
		dTitle = mDom(document.body); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
		mInsert(document.body, dTitle, 1);

	}

}
function mDatalist(dParent, list, opts = {}) {
	var mylist = list;
	var opts = opts;
	// addKeys({ alpha: true, edit: false, filter: 'contains' }, opts); // matches: (x, inputVal) => x.startsWith(inputVal.toLowerCase()) },opts)
	addKeys({ alpha: true, filter: 'contains' }, opts); // matches: (x, inputVal) => x.startsWith(inputVal.toLowerCase()) },opts)

	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, {w:200}, { tag: 'input', className: 'input', placeholder: "<enter value>" });
	mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });

	var elem = d;
	var inp = elem.firstChild;
	var datalist = elem.lastChild;
	for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }

	inp.setAttribute('list', optid);
	// console.log('datalist',elem,inp,datalist)

	function ____update() {
		console.log('update!!!')
		let val = valf(inp.value, '');
		if (isEmpty(val)) return;
		if (mylist.includes(val) || !opts.edit) {console.log('cannot update!'); return; }
		console.log('val',val,opts)
		mylist.push(val);
		if (opts.alpha) mylist.sort();
		let i = mylist.indexOf(val);
		inp.value = ''; //clear input
		if (opts.filter == 'contains') { let el = mDom(datalist, {}, { tag: 'option', value: val }); mInsertAt(datalist, el, i) }
		else populate();

		//hier muss der value bei dem collections ding zu M.collections und M.byCollection muss zu [] initialisiert werden und zum server gesendet!
		if (isdef(opts.onupdate)) opts.onupdate(val);
	}
	function ___populate() {
		//if (isdef(datalist.firstChild) && opts.filter == 'contains') return;
		let val = valf(inp.value, ''); val = val.toLowerCase();
		datalist.innerHTML = '';
		//console.log('datalist',datalist)
		let filteredList = isEmpty(val) ? mylist : mylist.filter(x => opts.matches(x, val));
		//console.log('filtered',filteredList)
		for (const w of filteredList) { mDom(datalist, {}, { tag: 'option', value: w }); }
	}
	//populate();


	//if (opts.edit) inp.addEventListener('keyup', ev => { if (ev.key === 'Enter') update(); });
	if (opts.onupdate) inp.addEventListener('keyup', opts.onupdate); //ev => { if (ev.key === 'Enter') opts.onupdate(ev.target.value,ev.target); });
	//if (isdef(opts.matches)) inp.addEventListener('input', populate);
	inp.onmousedown = () => inp.value = ''

	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
		//populate: populate,

	}
}
function collectionAddEmpty(ev){ //val,inp){
	if (ev.key != 'Enter') return;
	console.log('onupdate',ev.target,ev.target.value); 
	let val = ev.target.value;
	addIf(M.collections,val);
	M.collections.sort()
	//M.collections.push(val);
	M.byCollection[val] = [];
	initCollection(val);
	return;

	let inp = ev.target;
	let dlid = inp.getAttribute('list');
	console.log('datalist',mBy(dlid)); 
	let dl = mBy(dlid);
	mDom(dl, {}, { tag: 'option', value: inp.value });
	return;
	console.log('would you like to add a new collection',val,'???');
	M.collections.push(val);
	M.byCollection[val] = [];
	console.log('inp'.inp)
	mDom(mBy(inp.list), {}, { tag: 'option', value: val });
	//simplest: add it, send info to m2
}
async function onclickView() {
	await prelims();

	showTitle('View Collection:'); //, [{ caption: 'prev', handler: onclickPrev }, { caption: 'next', handler: onclickNext }]);

	let dParent = dTitle;
	let colls = M.collections; mDom(dParent, {}, { html: '' }); let dlColl = mDatalist(dParent, colls, {edit:false});
	let cats = M.categories; mDom(dParent, {}, { html: 'Filter:' }); let dlCat = mDatalist(dParent, cats, {edit:false});

	console.log('dl', dlCat)
	dlCat.inpElem.oninput = filterImages;
	dlColl.inpElem.oninput = filterImages;

	M.masterViewer = dlColl; M.filterViewer = dlCat;

	mClear('dMain');
	M.rows = 5; M.cols = 8;
	M.grid = mGrid(M.rows, M.cols, 'dMain');
	M.cells = [];
	for (let i = 0; i < M.rows * M.cols; i++) {
		let d = mDom(M.grid, { bg: 'sienna', box: true, padding: 8, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		M.cells.push(d);
	}

	if (nundef(M.keys)) M.keys = Object.keys(M.superdi);
	if (nundef(M.index)) M.index = M.keys.length;
	//M.grid.onclick = () => showNextBatch();
	showImageBatch(0);
}

function mDatalist(dParent, list, opts = {}) {
	var mylist = list;
	var opts = opts;
	addKeys({ defaultValue:'', alpha: true, edit: true, filter: 'contains' }, opts); // matches: (x, inputVal) => x.startsWith(inputVal.toLowerCase()) },opts)

	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, {}, { tag: 'input', className: 'input', value:opts.defaultValue, placeholder: "<enter value>" });
	mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });

	var elem = d;
	var inp = elem.firstChild;
	var datalist = elem.lastChild;

	inp.setAttribute('list', optid);
	// console.log('datalist',elem,inp,datalist)

	function update() {
		let val = valf(inp.value, opts.defaultValue);
		if (isEmpty(val)) return;
		if (mylist.includes(val) || !opts.edit) return;
		mylist.push(val);
		if (opts.alpha) mylist.sort();
		let i = mylist.indexOf(val);
		//if (opts.alpha) addIfAlpha(mylist,val); else addIf(mylist,val);
		inp.value = ''; //clear input
		if (opts.filter == 'contains') { let el = mDom(datalist, {}, { tag: 'option', value: val }); mInsertAt(datalist, el, i) }
		else populate();
	}
	function populate() {
		//if (isdef(datalist.firstChild) && opts.filter == 'contains') return;
		let val = valf(inp.value, opts.defaultValue); val = val.toLowerCase();
		datalist.innerHTML = '';
		//console.log('datalist',datalist)
		let filteredList = isEmpty(val)||val == opts.defaultValue ? mylist : mylist.filter(x => opts.matches(x, val));
		//console.log('filtered',filteredList)
		for (const w of filteredList) { mDom(datalist, {}, { tag: 'option', value: w }); }
	}
	populate();

	if (opts.edit) inp.addEventListener('keyup', ev => { if (ev.key === 'Enter') update(); });
	if (isdef(opts.matches)) inp.addEventListener('input', populate);
	inp.onmousedown = () => inp.value = ''

	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
		populate: populate,

	}
}
function uiTypeCalendar(dParent, month1, year1, events1 = []) {
	const [cellWidth, gap] = [100, 10];
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var dParent = toElem(dParent);
	const events = events1;
	var container = mDiv(dParent, { bg: 'white' }, 'dCalendar');
	var date = new Date();
	let dTitle = mDiv(container, { w: 760, padding: gap, fg: '#d36c6c', fz: 26, family: 'sans-serif', display: 'flex', justify: 'space-between' });
	var dWeekdays = mGrid(1, 7, container, { gap: gap });
	var dDays = [];
	var info = {};
	for (const w of weekdays) { mDiv(dWeekdays, { w: cellWidth, fg: '#247BA0' }, null, w) };
	var dGrid = mGrid(6, 7, container, { gap: gap });
	var dDate = mDiv(dTitle, { display: 'flex', gap: gap });
	var dButtons = mDiv(dTitle, { display: 'flex', gap: gap });
	mButton('Prev',
		() => {
			let m = date.getMonth();
			let y = date.getFullYear();
			if (m == 0) setDate(12, y - 1); else setDate(m, y);
			//setDate(date.getMonth(), date.getFullYear())
		},
		dButtons, { w: 70, margin: 0 }, 'input');
	mButton('Next',
		() => {
			let m = date.getMonth();
			let y = date.getFullYear();
			if (m == 11) setDate(1, y + 1); else setDate(m + 2, y);
			//setDate(date.getMonth() + 2, date.getFullYear())
		}, dButtons, { w: 70, margin: 0 }, 'input');
	var dMonth, dYear;

	function getDay(d) {
		let i = d + info.dayOffset;
		console.log('i', i);
		if (i < 1 || i > info.numDays) return null;
		let ui = dDays[i];
		console.log('ui', ui)
		if (ui.style.opacity === 0) return null;
		return { div: dDays[i], events: [] };
	}
	function setDate(m, y) {
		date.setMonth(m - 1);
		date.setFullYear(y);
		mClear(dDate);
		dMonth = mDiv(dDate, {}, 'dMonth', `${date.toLocaleDateString('en-us', { month: 'long' })}`);
		dYear = mDiv(dDate, {}, 'dYear', `${date.getFullYear()}`);
		makeContentEditable(dMonth, ev => {
			let d = ev.target;
			if (d != dMonth) return;
			let val = getCorrectMonth(d.innerHTML, months[date.getMonth()]);
			d.innerHTML = val[1];
			date.setMonth(val[0])
		});
		makeContentEditable(dYear, ev => {
			let d = ev.target;
			if (d != dYear) return;
			let val = firstNumber(d.innerHTML);
			date.setFullYear(val);
			d.innerHTML = val;
		});

		mClear(dGrid); dDays.length = 0;
		let outerStyles = {
			rounding: 4, patop: 4, pabottom: 4, weight: 'bold', box: true,
			paleft: gap / 2, w: cellWidth, hmin: cellWidth, fg: 'contrast', bg: rColor('light', .5)
		}
		for (const i of range(42)) {
			let cell = mDiv(dGrid, outerStyles);
			dDays[i] = cell;
		}
		populate(date);
		return { container, date, dDate, dGrid, dMonth, dYear, setDate, populate };
	}
	function populate() {
		let dt = date;
		const day = info.day = dt.getDate();
		const month = info.month = dt.getMonth();
		const year = info.year = dt.getFullYear();

		const firstDayOfMonth = info.firstDay = new Date(year, month, 1);
		const daysInMonth = info.numDays = new Date(year, month + 1, 0).getDate();

		const dateString = info.dayString = firstDayOfMonth.toLocaleDateString('en-us', {
			weekday: 'long',
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		});
		const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
		info.dayOffset = paddingDays - 1;
		//console.log('paddingDays', day, month, year, paddingDays);
		//console.log('dDays', dDays);
		for (const i of range(42)) {
			if (i < paddingDays || i >= paddingDays + daysInMonth) { mStyle(dDays[i], { opacity: 0 }); }
		}
		// for (const i of range(paddingDays)) { mStyle(dDays[i], { opacity: 0 }); }
		// for (const i of range(paddingDays + daysInMonth,34)) { mStyle(dDays[i], { opacity: 0 }); }

		//restliche tage bis month ende sind ok
		for (let i = paddingDays + 1; i <= paddingDays + daysInMonth; i++) {
			const daySquare = dDays[i - 1]; //document.createElement('div');
			//const dayString = `${month + 1}/${i - paddingDays}/${year}`;
			daySquare.innerText = i - paddingDays;
			let date = new Date(year, month, i - paddingDays);
			let d = mDiv(daySquare, { box: true, align: 'center', bg: 'beige', rounding: 4, w: '95%', hpadding: '2%', hmin: cellWidth - 28 }, calendarGetDayId(date)); //,null,null,'padding');
			d.addEventListener('click', ev => calendarOpenDay(date, daySquare.lastChild, ev));
			// d.addEventListener('click', ev => calendarOpenDay(date, dayString, daySquare.lastChild, ev));
			//dDays[i - 1].appendChild(daySquare);
		}
		updateEvents();
	}
	function updateEvents() {
		//console.log('events',events);
		//console.log('dDays',dDays);
		for (const e of events) {
			let dt = new Date(e.date);
			if (dt.getMonth() != date.getMonth() || dt.getFullYear() != date.getFullYear()) {
				//console.log('YES!');
				continue;
			}
			// let iday = date.getDate();
			// iday = date.getUTCDay();
			// console.log('date',date)
			// console.log('iday',date.getDay(),date.getUTCDay(),date.getDate(),info.dayOffset)
			let dDay = dDays[dt.getDate() + info.dayOffset];
			//console.log('dDay',dDay)
			let ch = arrChildren(dDay);
			//console.log('children',ch)
			let d = ch[0]; //dDay.firstChild; //arrChildren(dDay)[1];
			let d1 = calendarAddExistingEvent(e, d);
			e.div = d;
			//console.log('d',d)
			//mDiv(d,{bg:'blue'},null,e.title); break;
		}
	}
	setDate(valf(month1, date.getMonth() + 1), valf(year1, date.getFullYear()));
	populate();

	return { container, date, dDate, dGrid, dMonth, dYear, info, getDay, setDate, populate }
}

function maButton(caption, handler, dParent, styles, classes) {
	let a = mLink("javascript:void(0)", dParent, styles, null, caption, classes);
	a.onclick = handler;
	if (isdef(styles)) mStyle(a, styles);
	return a;
}

function __getMouseCoordinates(ev) {
	const elem = ev.target; // Replace with the actual ID of your image element
	const rect = elem.getBoundingClientRect();
	const offsetX = ev.clientX - rect.left;// + window.scrollX - document.documentElement.scrollLeft;
	const offsetY = ev.clientY - rect.top;// + window.scrollY - document.documentElement.scrollTop;

	return { x: offsetX, y: offsetY };
}
function get_mouse_pos(ev, relToElem) {
	let x = ev.clientX - relToElem.offsetLeft + document.body.scrollLeft;
	let y = ev.clientY - relToElem.offsetTop - document.body.scrollTop;
	return ({ x: x, y: y });
}

function showImage(key, dParent, styles = {}) {
	// let d = toElem(dParent);
	let o = M.superdi[key];
	//console.log('k', key)
	try {
		addKeys({ bg: rColor() }, styles);
		// let d1=dParent; //mDom(d,{bg:'red',box:true, align:'center',padding:8,margin:8,})
		mClear(dParent);
		let [w, h] = [dParent.offsetWidth, dParent.offsetHeight];
		//console.log('w',w,'h',h)
		let [sz, fz] = [.9 * w, .8 * h];

		let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', overflow: 'hidden' });
		mCenterCenterFlex(d1)


		if (isdef(o.img)) {
			//console.log('img',o.img);
			// mDom(d1, {hmax:'100%',wmax:'100%',h:'auto',w:'auto'}, { tag: 'img', src: `${o.path}` });
			mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` });
		}
		else if (isdef(o.text)) mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
		// if (isdef(k.hex)) mDom(d,{fz:200,family:'emoNoto',bg:rColor(),fg:rColor(),display:'inline'},{html:String.fromCharCode('0x'+k.hex)});
		else if (isdef(o.fa)) mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
		else if (isdef(o.ga)) mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	} catch {
		console.log('k', key, o)
	}

}

function createImageIndex() {
	let byKey = {}, byFriendly = {}, byCat = {};
	console.log(M.emos.abacus)
	for (const k in M.emos) {
		let o = M.emos[k];
		let onew = { friendly: k };
		addKeys(o, onew);
		if (isdef(o.img)) onew.path = '../assets/img/emo/' + o.img;
		byKey[k] = onew;
		lookupAddIfToList(byFriendly, [k], onew);
		o.cats.map(x => lookupAddIfToList(byCat, [x], onew));
	}
	for (const k in M.collections) {
		let o = M.collections[k];
		let onew = { friendly: o.name, cats: [o.cat], img: k + '.' + k.ext };
		onew.path = `../y/${k}.${o.ext}`;
		byKey[k] = onew;
		lookupAddIfToList(byFriendly, [o.name], onew);
		lookupAddIfToList(byCat, [o.cat], onew);
	}
	return [byKey, byFriendly, byCat];
}

async function uploadImg(img, unique, cat, name) {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		canvas.toBlob(async (blob) => {
			const formData = new FormData();
			formData.append('image', blob, unique + '.png');
			formData.append('category', cat);
			formData.append('name', name);

			try {
				const response = await fetch('http://localhost:3000/upload', {
					method: 'POST',
					mode: 'cors',
					body: formData
				});

				if (response.ok) {
					const data = await response.json();
					//console.log('Image uploaded successfully:', data);
					resolve(data);
				} else {
					// Handle non-ok response status
					//console.error('Error uploading image:', response.statusText);
					reject(response.statusText);
				}


				// const data = await response.json();
				// console.log('Image uploaded successfully:', data);
				// resolve(data);
			} catch (error) {
				console.error('Error uploading image:', error);
				reject(error);
			}
		});
	});
}
function createRg(dParent, img, handler, title,) {
	let rg = mRadioGroup(d, {}, 'rSizes', 'Crop to: '); mClass(rg, 'input')
	mRadio('manual', [0, 0], 'rSizes', rg, {}, handler, 'rSizes', true)
	let [w, h] = [img.offsetWidth, img.offsetHeight];
	if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, handler, 'rSizes', false)
	if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, handler, 'rSizes', false)
	if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, handler, 'rSizes', false)
	if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, handler, 'rSizes', false)
	if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, handler, 'rSizes', false)
	if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, handler, 'rSizes', false)
	else {
		//card portrait kann man auch machen: take das das nicht passt
		let [w1, h1] = [w, w / .7];
		let [w2, h2] = [h * .7, h];
		if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, handler, 'rSizes', false)
		else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, handler, 'rSizes', false)
	}
	if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, handler, 'rSizes', false)
	else {
		//card portrait kann man auch machen: take das das nicht passt
		let [w1, h1] = [w, w * .7];
		let [w2, h2] = [h / .7, h];
		if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, handler, 'rSizes', false)
		else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, handler, 'rSizes', false)
	}
	mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
	return rg;
}
function addCropTool(dParent, img, setSizeFunc) {
	let d = dParent;
	let rg = mRadioGroup(d, {}, 'rSizes', 'Crop to: '); mClass(rg, 'input')
	mRadio('manual', [0, 0], 'rSizes', rg, {}, setSizeFunc, 'rSizes', true)
	let [w, h] = [img.offsetWidth, img.offsetHeight];
	if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	else {
		//card portrait kann man auch machen: take das das nicht passt
		let [w1, h1] = [w, w / .7];
		let [w2, h2] = [h * .7, h];
		if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	}
	if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	else {
		//card portrait kann man auch machen: take das das nicht passt
		let [w1, h1] = [w, w * .7];
		let [w2, h2] = [h / .7, h];
		if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	}
	mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
	return rg;
}
function addResizeTool(dParent, img) {
	let setSizeFunc = async arr => {
		await resizeImage(img, arr[1]);
		console.log('new size', img.offsetWidth, img.offsetHeight);
	}
	let d = dParent;

	//let rg = mDom(d,{},{className:'input',type:'numeric',value:img.offsetHeight});
	mDom(d, {}, { html: 'Resize:' });
	let rg = mDom(d, {}, { tag: 'input', value: img.offsetHeight, name: 'imgheight', type: 'text', className: 'input', placeholder: "<enter height>" });

	// let rg = mRadioGroup(d, {}, 'rSizes', 'Resize to: '); mClass(rg, 'input');

	// mRadio('manual', [0, 0], 'rSizes', rg, {}, setSizeFunc, 'rSizes', true)
	// let [w, h] = [img.offsetWidth, img.offsetHeight];
	// if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// else {
	// 	//card portrait kann man auch machen: take das das nicht passt
	// 	let [w1,h1]=[w,w/.7];
	// 	let [w2,h2]=[h*.7,h];
	// 	if (w1<w2) mRadio(`${w1} x ${h1} (card)`, [w1,h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// 	else mRadio(`${w2} x ${h2} (card)`, [w2,h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// }
	// if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// else {
	// 	//card portrait kann man auch machen: take das das nicht passt
	// 	let [w1,h1]=[w,w*.7];
	// 	let [w2,h2]=[h/.7,h];
	// 	if (w1<w2) mRadio(`${w1} x ${h1} (landscape)`, [w1,h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// 	else mRadio(`${w2} x ${h2} (landscape)`, [w2,h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// }
	//mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
	return rg;
}
function resizePreviewImage(dParent, img) {
	const bottomRightResizeHandle = mDom(dParent, {}, { className: "resize-handle bottom-right" });

	let isResizing = false;
	let resizeStartX;
	let resizeStartY;
	let initialWidth;
	let initialHeight;

	function startResize(e) {
		isResizing = true;
		resizeStartX = e.clientX;
		resizeStartY = e.clientY;
		initialWidth = img.offsetWidth;
		initialHeight = img.offsetHeight;
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}

	function resize(e) {
		if (isResizing) {
			const width = initialWidth + (e.clientX - resizeStartX);
			const height = initialHeight + (e.clientY - resizeStartY);
			img.style.width = `${width}px`;
			img.style.height = `${height}px`;
			bottomRightResizeHandle.style.left = `${width}px`;
			bottomRightResizeHandle.style.top = `${height}px`;
			dParent.style.width = `${width}px`;
			dParent.style.height = `${height}px`;

		}
	}

	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
	}
	bottomRightResizeHandle.addEventListener('mousedown', startResize);


}

function redrawImage1(img, dParent, x, y, w, h, callback) {
	console.log('ausschnitt:', x, y, w, h);
	let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
	const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed

	img.onload = () => {
		img.onload = null;
		img.width = w;
		img.height = h;
		mStyle(img, { w: w, h: h });
		mStyle(dParent, { w: w, h: h });
		callback(); //setRect(0, 0, w, h);
	}
	img.src = imgDataUrl;
	return imgDataUrl;

}
function redrawImage2(img, dParent, wold, hold, w, h, callback) {
	// let [wold,hold]=['width','height'].map(x=>parseInt(dParent.style[x])); //img.width,img.height];
	console.log('old dims', wold, hold)
	console.log('new dims:', w, h);
	let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, wold, hold, 0, 0, w, h);
	const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed

	img.onload = () => {
		img.onload = null;
		img.width = w;
		img.height = h;
		mStyle(dParent, { w: w, h: h });
		callback(); //setRect(0, 0, w, h);
	}
	img.src = imgDataUrl;
	return imgDataUrl;

}
function __redrawImage(img, x, y, w, h, w2, h2, callback = null) {
	// let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
	console.log('___\nausschnitt:', x, y, w, h);
	console.log('dest rect:', 0, 0, w2, h2)
	let canvas = mDom(null, {}, { tag: 'canvas', width: w2, height: h2 });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, x, y, w, h, 0, 0, w2, h2);
	const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
	img.onload = () => {
		img.onload = null;
		img.width = w2;
		img.height = h2;
		if (callback) callback();
		mStyle(img.parentNode, { w: w2, h: h2 });
		mStyle(img.parentNode.parentNode, { w: w2, h: h2 });
		//setRect(0, 0, w, h);
	}
	img.src = imgDataUrl;
	return imgDataUrl;
}


function miCropResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black' });

	let sz = 25;
	const centerBox = mDom(cropBox, { bg: 'red', w: sz, h: sz, rounding: '50%', position: 'absolute' });
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	let isResizing = null;
	let resizeStartW;
	let resizeStartH;
	let isCropping = false;
	let cropStartX;
	let cropStartY;
	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		isResizing = e.target == wHandle ? 'w' : e.target == hHandle ? 'h' : 'wh';
		[resizeStartW, resizeStartH] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)];
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		if (!isResizing) return;
		e.preventDefault(); evNoBubble(e);
		let newWidth, newHeight;
		if (isResizing == 'w') {
			newWidth = e.clientX;
			newHeight = img.height;
		} else if (isResizing == 'h') {
			newWidth = img.width;
			newHeight = e.clientY;
		} else if (isResizing == 'wh') {
			newHeight = e.clientY;
			let aspectRatio = img.width / img.height;
			newWidth = aspectRatio * newHeight;
		}
		[img, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
		setRect(0, 0, newWidth, newHeight);
		//messageBox.innerHTML = `size: ${Math.round(newWidth)} x ${Math.round(newHeight)}`;
	}
	function stopResize() {
		isResizing = null;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		let [wnew, hnew] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)]
		redrawImage(img, dParent, 0, 0, resizeStartW, resizeStartH, wnew, hnew, () => setRect(0, 0, wnew, hnew))
		// redrawImage2(img,dParent,resizeStartW,resizeStartH,wnew,hnew,()=>setRect(0,0,wnew,hnew))
		//resizeImage(img, parseInt(cropBox.style.height))
	}

	function addCropTool(dParent, img, setSizeFunc) {
		let d = dParent;
		let rg = mRadioGroup(d, {}, 'rSizes', 'Crop to: '); mClass(rg, 'input')
		mRadio('manual', [0, 0], 'rSizes', rg, {}, setSizeFunc, 'rSizes', true)
		let [w, h] = [img.offsetWidth, img.offsetHeight];
		if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w / .7];
			let [w2, h2] = [h * .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w * .7];
			let [w2, h2] = [h / .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
		return rg;
	}
	function startCrop(e) {
		e.preventDefault();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop); //cropCenter);
		document.addEventListener('mouseup', stopCrop);
	}
	function crop(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	//#region unused
	function cropX(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = 300; //Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = 0; //Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropCenter(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const radiusX = Math.abs(mouseX - cropStartX);
			const radiusY = Math.abs(mouseY - cropStartY);
			const centerX = cropStartX; // (mouseX + cropStartX) / 2;
			const centerY = cropStartY; //(mouseY + cropStartY) / 2;

			const width = radiusX * 2;
			const height = radiusY * 2;
			const left = centerX - radiusX;
			const top = centerY - radiusY;
			setRect(left, top, width, height);
		}
	}
	//#endregion
	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}
	function cropImage() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		// redrawImage(img,x,y,w,h,w,h,()=>{
		// 	setRect(0,0,w,h);
		// 	mStyle('dMain',{display:'flex'})
		// 	mStyle(dParent, { w: w, h: h, display:'inline' });
		// });
		//redrawImage1(img,dParent,x,y,w,h,()=>setRect(0,0,w,h))
		redrawImage(img, dParent, x, y, w, h, w, h, () => setRect(0, 0, w, h))

		// console.log('ausschnitt:', x, y, w, h);
		// let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
		// const ctx = canvas.getContext('2d');
		// ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		// const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed

		// img.onload=()=>{
		// 	img.onload = null;
		// 	img.width = w;
		// 	img.height = h;
		// 	mStyle(dParent, { w: w, h: h });
		// 	setRect(0, 0, w, h);
		// }
		// img.src = imgDataUrl;
		// return imgDataUrl;
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		//messageBox.innerHTML = `size: ${width} x ${height}`;
		messageBox.innerHTML = `size: ${Math.round(width)} x ${Math.round(height)}`;
		mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
		//console.log('________\nsetRect',left,top,width,height,'\ncenter',width/2,height/2);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		console.log('old rect', x, y, w, h, cx, cy);

		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];


		setRect(xnew, ynew, wnew, hnew);

	}

	wHandle.addEventListener('mousedown', startResize);
	hHandle.addEventListener('mousedown', startResize);
	whHandle.addEventListener('mousedown', startResize);

	setRect(0, 0, worig, horig);
	cropBox.addEventListener('mousedown', startCrop);
	var tool = addCropTool(dButtons, img, setSize);
	var button = mButton('Crop', cropImage, tool, { w: 120, maleft: 12 }, 'input');



	return {
		button: button,
		crop: cropImage,
		elem: cropBox,
		messageBox: messageBox,
		img: img,
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		setSize: setSize,
		tool: tool,
	}
}

function miCropResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black' });
	const centerBox = mDom(cropBox, { bg: 'red', w: 10, h: 10, rounding: '50%', position: 'absolute' });
	let isCropping = false;
	let cropStartX;
	let cropStartY;

	//resizer code
	let sz = 25;
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	let isResizing = null;
	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		isResizing = e.target == wHandle ? 'w' : e.target == hHandle ? 'h' : 'wh';
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		if (!isResizing) return;
		e.preventDefault(); evNoBubble(e);
		let newWidth, newHeight;
		if (isResizing == 'w') {
			newWidth = e.clientX;
			newHeight = img.height;
		} else if (isResizing == 'h') {
			newWidth = img.width;
			newHeight = e.clientY;
		} else if (isResizing == 'wh') {
			newHeight = e.clientY;
			let aspectRatio = img.width / img.height;
			newWidth = aspectRatio * newHeight;
		}
		[img, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
		setRect(0, 0, newWidth, newHeight);
		//messageBox.innerHTML = `size: ${Math.round(newWidth)} x ${Math.round(newHeight)}`;
	}
	function stopResize() {
		isResizing = null;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		resizeImage(img, parseInt(cropBox.style.height))
	}

	function addCropTool(dParent, img, setSizeFunc) {
		let d = dParent;
		let rg = mRadioGroup(d, {}, 'rSizes', 'Crop to: '); mClass(rg, 'input')
		mRadio('manual', [0, 0], 'rSizes', rg, {}, setSizeFunc, 'rSizes', true)
		let [w, h] = [img.offsetWidth, img.offsetHeight];
		if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w / .7];
			let [w2, h2] = [h * .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w * .7];
			let [w2, h2] = [h / .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
		return rg;
	}
	function startCrop(e) {
		e.preventDefault();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop); //cropCenter);
		document.addEventListener('mouseup', stopCrop);
	}
	function crop(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropX(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = 300; //Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = 0; //Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropCenter(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const radiusX = Math.abs(mouseX - cropStartX);
			const radiusY = Math.abs(mouseY - cropStartY);
			const centerX = cropStartX; // (mouseX + cropStartX) / 2;
			const centerY = cropStartY; //(mouseY + cropStartY) / 2;

			const width = radiusX * 2;
			const height = radiusY * 2;
			const left = centerX - radiusX;
			const top = centerY - radiusY;
			setRect(left, top, width, height);
		}
	}
	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}
	function cropImage() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		console.log('x,y,w,h', x, y, w, h);
		let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = imgDataUrl;
		img.width = w;
		img.height = h;
		mStyle(dParent, { w: w, h: h });
		setRect(0, 0, w, h);
		return imgDataUrl;
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		//messageBox.innerHTML = `size: ${width} x ${height}`;
		messageBox.innerHTML = `size: ${Math.round(width)} x ${Math.round(height)}`;
		mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
		//console.log('new rect',left,top,width,height,width/2,height/2);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		console.log('old rect', x, y, w, h, cx, cy);

		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];


		setRect(xnew, ynew, wnew, hnew);

	}

	wHandle.addEventListener('mousedown', startResize);
	hHandle.addEventListener('mousedown', startResize);
	whHandle.addEventListener('mousedown', startResize);

	setRect(0, 0, worig, horig);
	cropBox.addEventListener('mousedown', startCrop);
	var tool = addCropTool(dButtons, img, setSize);
	var button = mButton('Crop', cropImage, tool, { w: 120, maleft: 12 }, 'input');



	return {
		button: button,
		crop: cropImage,
		elem: cropBox,
		messageBox: messageBox,
		img: img,
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		setSize: setSize,
		tool: tool,
	}
}
function miResizer(dParent, img, dButtons) { //}, cropBox, messageBox) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	//console.log('w', worig, 'h', horig);
	//console.log('dParent', dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black' });
	let sz = 25;
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });

	let isResizing = null;
	let maintainAspectRatio = false;

	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		isResizing = e.target == wHandle ? 'w' : e.target == hHandle ? 'h' : 'wh';
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		if (!isResizing) return;
		e.preventDefault(); evNoBubble(e);
		let newWidth, newHeight;
		if (isResizing == 'w') {
			newWidth = e.clientX;
			newHeight = img.height;
			if (maintainAspectRatio) {
				let aspectRatio = img.height / img.width;
				newHeight = aspectRatio * newWidth;
			}
		} else if (isResizing == 'h') {
			newWidth = img.width;
			newHeight = e.clientY;
			if (maintainAspectRatio) {
				let aspectRatio = img.width / img.height;
				newWidth = aspectRatio * newHeight;
			}
		} else if (isResizing == 'wh') {
			newHeight = e.clientY;
			let aspectRatio = img.width / img.height;
			newWidth = aspectRatio * newHeight;
		}
		[img, cropBox, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
		messageBox.innerHTML = `size: ${Math.round(newWidth)} x ${Math.round(newHeight)}`;
	}
	function stopResize() {
		isResizing = null;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		resizeImage(img, parseInt(cropBox.style.height))
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		messageBox.innerHTML = `size: ${width} x ${height}`;
	}
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];
		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];
		setRect(xnew, ynew, wnew, hnew);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }

	setRect(0, 0, worig, horig);
	wHandle.addEventListener('mousedown', startResize);
	hHandle.addEventListener('mousedown', startResize);
	whHandle.addEventListener('mousedown', startResize);
	//var tool = addResizeTool(dButtons,img,setSize);
	// var button = mButton('Resize', cropImage, tool, { w: 120, maleft: 12 }, 'input');

	return {
		//button: button,
		//crop: cropImage,
		elem: cropBox,
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		setSize: setSize,
		//tool: tool,
	}
}
function miResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	console.log('w', worig, 'h', horig);
	console.log('dParent', dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox);
	let sz = 25;
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, left: '100%', top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', top: '100%', rounding: '50%', position: 'absolute' });

	let isResizingW = false;
	let isResizingH = false;

	function startResizeW(e) {
		e.preventDefault(); evNoBubble(e);
		isResizingW = true;
		document.addEventListener('mousemove', resizeW);
		document.addEventListener('mouseup', stopResizeW);
	}
	function resizeW(e) {
		e.preventDefault(); evNoBubble(e);
		if (isResizingW) {

			let x = e.clientX;//,y=e.clientY;

			const width = x; //initialWidth + (e.clientX - resizeStartX);
			const aspectRatio = img.height / img.width;
			const newWidth = width;
			const newHeight = aspectRatio * newWidth;

			img.style.width = `${newWidth}px`;
			dParent.style.width = `${newWidth}px`;
			cropBox.style.width = `${newWidth}px`;

			img.style.height = `${newHeight}px`;
			dParent.style.height = `${newHeight}px`;
			cropBox.style.height = `${newHeight}px`;
		}
	}
	function stopResizeW() {
		isResizingW = false;
		document.removeEventListener('mousemove', resizeW);
		document.removeEventListener('mouseup', stopResizeW);
		resizeImage(img, parseInt(cropBox.style.height))
		// cropImage();
	}
	function startResizeH(e) {
		e.preventDefault(); evNoBubble(e);
		isResizingH = true;
		document.addEventListener('mousemove', resizeH);
		document.addEventListener('mouseup', stopResizeH);
	}
	function resizeH(e) {
		e.preventDefault(); evNoBubble(e);
		if (isResizingH) {

			let y = e.clientY;

			const height = y; //initialWidth + (e.clientX - resizeStartX);
			const aspectRatio = img.width / img.height;
			const newHeight = height;
			const newWidth = aspectRatio * newHeight;

			img.style.width = `${newWidth}px`;
			dParent.style.width = `${newWidth}px`;
			cropBox.style.width = `${newWidth}px`;

			img.style.height = `${newHeight}px`;
			dParent.style.height = `${newHeight}px`;
			cropBox.style.height = `${newHeight}px`;
		}
	}
	function stopResizeH() {
		isResizingH = false;
		document.removeEventListener('mousemove', resizeH);
		document.removeEventListener('mouseup', stopResizeH);
		resizeImage(img, parseInt(cropBox.style.height))
		// cropImage();
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		messageBox.innerHTML = `size: ${width} x ${height}`;
	}
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];
		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];
		setRect(xnew, ynew, wnew, hnew);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }

	setRect(0, 0, worig, horig);
	wHandle.addEventListener('mousedown', startResizeW);
	hHandle.addEventListener('mousedown', startResizeH);
	//var tool = addResizeTool(dButtons,img,setSize);
	// var button = mButton('Resize', cropImage, tool, { w: 120, maleft: 12 }, 'input');

	return {
		//button: button,
		//crop: cropImage,
		elem: cropBox,
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		setSize: setSize,
		//tool: tool,
	}
}

function miResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	console.log('w', worig, 'h', horig);
	console.log('dParent', dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox);
	let sz = 25;
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, left: '100%', top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', top: '100%', rounding: '50%', position: 'absolute' });

	let isResizingW = false;
	let isResizingH = false;

	function startResizeW(e) {
		e.preventDefault(); evNoBubble(e);
		isResizingW = true;
		document.addEventListener('mousemove', resizeW);
		document.addEventListener('mouseup', stopResizeW);
	}
	function resizeW(e) {
		e.preventDefault(); evNoBubble(e);
		if (isResizingW) {

			let x = e.clientX;//,y=e.clientY;

			const width = x; //initialWidth + (e.clientX - resizeStartX);
			const aspectRatio = img.height / img.width;
			const newWidth = width;
			const newHeight = aspectRatio * newWidth;

			img.style.width = `${newWidth}px`;
			dParent.style.width = `${newWidth}px`;
			cropBox.style.width = `${newWidth}px`;

			img.style.height = `${newHeight}px`;
			dParent.style.height = `${newHeight}px`;
			cropBox.style.height = `${newHeight}px`;
		}
	}
	function stopResizeW() {
		isResizingW = false;
		document.removeEventListener('mousemove', resizeW);
		document.removeEventListener('mouseup', stopResizeW);
		resizeImage(img, parseInt(cropBox.style.height))
		// cropImage();
	}
	function startResizeH(e) {
		e.preventDefault(); evNoBubble(e);
		isResizingH = true;
		document.addEventListener('mousemove', resizeH);
		document.addEventListener('mouseup', stopResizeH);
	}
	function resizeH(e) {
		e.preventDefault(); evNoBubble(e);
		if (isResizingH) {

			let y = e.clientY;

			const height = y; //initialWidth + (e.clientX - resizeStartX);
			const aspectRatio = img.width / img.height;
			const newHeight = height;
			const newWidth = aspectRatio * newHeight;

			img.style.width = `${newWidth}px`;
			dParent.style.width = `${newWidth}px`;
			cropBox.style.width = `${newWidth}px`;

			img.style.height = `${newHeight}px`;
			dParent.style.height = `${newHeight}px`;
			cropBox.style.height = `${newHeight}px`;
		}
	}
	function stopResizeH() {
		isResizingH = false;
		document.removeEventListener('mousemove', resizeH);
		document.removeEventListener('mouseup', stopResizeH);
		resizeImage(img, parseInt(cropBox.style.height))
		// cropImage();
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		messageBox.innerHTML = `size: ${width} x ${height}`;
	}
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];
		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];
		setRect(xnew, ynew, wnew, hnew);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }

	setRect(0, 0, worig, horig);
	wHandle.addEventListener('mousedown', startResizeW);
	hHandle.addEventListener('mousedown', startResizeH);
	//var tool = addResizeTool(dButtons,img,setSize);
	// var button = mButton('Resize', cropImage, tool, { w: 120, maleft: 12 }, 'input');

	return {
		//button: button,
		//crop: cropImage,
		elem: cropBox,
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		setSize: setSize,
		//tool: tool,
	}
}

function mCropResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	console.log('w', worig, 'h', horig);
	console.log('dParent', dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox);
	const centerBox = mDom(cropBox, { bg: 'red', w: 10, h: 10, rounding: '50%', position: 'absolute' });
	const bottomRightResizeHandle = mDom(cropBox, { left: worig, top: horig }, { className: "resize-handle bottom-right" });

	let isCropping = false;
	let cropStartX;
	let cropStartY;

	let isResizing = false;

	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		stopCrop();
		isResizing = true;
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		e.preventDefault(); evNoBubble(e);
		if (isResizing) {
			let x = e.clientX, y = e.clientY;

			const width = x; //initialWidth + (e.clientX - resizeStartX);
			const height = y; //initialHeight + (e.clientY - resizeStartY);
			img.style.width = `${width}px`;
			img.style.height = `${height}px`;
			bottomRightResizeHandle.style.left = `${width}px`;
			bottomRightResizeHandle.style.top = `${height}px`;
			dParent.style.width = `${width}px`;
			dParent.style.height = `${height}px`;
			cropBox.style.width = `${width}px`;
			cropBox.style.height = `${height}px`;

		}
	}
	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
	}

	function startCrop(e) {
		e.preventDefault();
		stopResize();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop); //cropCenter);
		document.addEventListener('mouseup', stopCrop);
	}
	function crop(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropX(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = 300; //Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = 0; //Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropCenter(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const radiusX = Math.abs(mouseX - cropStartX);
			const radiusY = Math.abs(mouseY - cropStartY);
			const centerX = cropStartX; // (mouseX + cropStartX) / 2;
			const centerY = cropStartY; //(mouseY + cropStartY) / 2;

			const width = radiusX * 2;
			const height = radiusY * 2;
			const left = centerX - radiusX;
			const top = centerY - radiusY;
			setRect(left, top, width, height);
		}
	}
	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}
	function cropImage() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		console.log('x,y,w,h', x, y, w, h);
		let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = imgDataUrl;
		img.width = w;
		img.height = h;
		mStyle(img, { position: 'absolute', top: 0, left: 0, w: w, h: h });
		mStyle(cropBox, { display: 'none' }); //top: 0, left: img.offsetLeft });
		return imgDataUrl;
	}
	function finalize() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		console.log('x,y,w,h', x, y, w, h);
		let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = imgDataUrl;
		img.width = w;
		img.height = h;
		mStyle(img, { position: 'absolute', top: 0, left: 0, w: w, h: h });
		mStyle(cropBox, { display: 'none' }); //top: 0, left: img.offsetLeft });
		return imgDataUrl;
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		cropBox.style.width = `${width}px`;
		cropBox.style.height = `${height}px`;
		cropBox.style.left = `${left}px`;
		cropBox.style.top = `${top}px`;
		messageBox.innerHTML = `size: ${width} x ${height}`;
		//let [cx,cy] = [(left+width)/2,(top+height)/2];
		mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
		//cropBox.innerHTML = `size: ${width} x ${height}`;
		//mach roten punkt im center

		//console.log('new rect',left,top,width,height,width/2,height/2);


	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		console.log('old rect', x, y, w, h, cx, cy);

		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];


		setRect(xnew, ynew, wnew, hnew);

	}
	setRect(0, 0, worig, horig);
	bottomRightResizeHandle.addEventListener('mousedown', startResize);
	cropBox.addEventListener('mousedown', startCrop);
	//addTool();

	return {
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,
		cropResize: finalize,
		// restart:restart,
		setSize: setSize,
		elem: cropBox,
	}
}
async function onDropPreviewImage(url) {
	let dParent = UI.dDrop;
	let dButtons = UI.dButtons;
	dParent.innerHTML = '';
	dButtons.innerHTML = '';
	let img = UI.img = mDom(dParent, {}, { tag: 'img', src: url });
	img.onload = async () => {
		img.onload = null;
		//await resizeImage(img, 300);
		UI.img_orig = new Image(img.offsetWidth, img.offsetHeight);
		UI.url = url;
		UI.cropper = mCropper(dParent, img, dButtons);

		let d = dButtons;
		UI.cropTool = addCropTool(dButtons, img, UI.cropper.setSize);

		resizePreviewImage(dParent, img);

		//UI.resizeTool = addResizeTool(dButtons,img,resizeImage);
		mDom(d, { w: 120 }, { tag: 'button', html: 'Upload', onclick: onclickUpload, className: 'input' })
		mButton('Crop', UI.cropper.crop, d, { w: 120, maleft: 12 }, 'input');
		// mButton('Restart', UI.cropper.restart, dButtons, { w: 120, maleft: 12 }, 'input');
		mButton('Restart', () => onDropPreviewImage(url), d, { w: 120, maleft: 12 }, 'input');
		//mDom(d, { h: 10 })
		//mDom(d,{},{html:'click & drag image to crop'});


	}
}
function mCropper(dParent, img) {
	let [w, h] = [img.offsetWidth, img.offsetHeight]; //img.offsetY,img.offsetX,
	console.log('w', w, 'h', h);
	console.log('dParent', dParent)
	mStyle(dParent, { w: w, h: h, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: w, h: h }, { className: 'crop-box' });
	//const cropBox = mDom(dParent, { w: w, h: h }, { className: 'crop-box' });
	let isCropping = false;
	let cropStartX;
	let cropStartY;
	cropBox.addEventListener('mousedown', startCrop);

	function startCrop(e) {
		e.preventDefault();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop);
		document.addEventListener('mouseup', stopCrop);
	}

	function crop(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = 300; //Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = 0; //Math.min(mouseY, cropStartY);
			cropBox.style.width = `${width}px`;
			cropBox.style.left = `${left}px`;
			cropBox.style.height = `${height}px`; //erlaubt nur width cropping!
			cropBox.style.top = `${top}px`;
		}
	}

	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}

	function cropImage_orig() {
		const cropX = parseInt(cropBox.style.left);
		const cropY = parseInt(cropBox.style.top);
		const cropWidth = parseInt(cropBox.style.width);
		const cropHeight = parseInt(cropBox.style.height);
		const canvas = document.createElement('canvas');
		canvas.width = cropWidth;
		canvas.height = cropHeight;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
		const croppedImageDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = croppedImageDataUrl;
		img.width = cropWidth;
		img.height = cropHeight;
		mStyle(img, { position: 'absolute', top: 0, left: 0, w: cropWidth, h: cropHeight });
		mStyle(cropBox, { display: 'none' }); //top: 0, left: img.offsetLeft });
		return croppedImageDataUrl;
	}
	function cropImage() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		console.log('x,y,w,h', x, y, w, h);
		let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = imgDataUrl;
		img.width = w;
		img.height = h;
		mStyle(img, { position: 'absolute', top: 0, left: 0, w: w, h: h });
		mStyle(cropBox, { display: 'none' }); //top: 0, left: img.offsetLeft });
		return imgDataUrl;
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	return {
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,
		elem: cropBox,
	}
}
function mCropper(dParent, img) {
	let [w, h] = [img.offsetWidth, img.offsetHeight];
	console.log('w', w, 'h', h)
	mStyle(dParent, { w: w, h: h, position: 'relative' });
	const cropBox = mDom(dParent, { w: w, h: h }, { className: 'crop-box' });
	let isCropping = false;
	let cropStartX;
	let cropStartY;
	cropBox.addEventListener('mousedown', startCrop);

	function startCrop(e) {
		e.preventDefault();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop);
		document.addEventListener('mouseup', stopCrop);
	}

	function crop(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = 300; //Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = 0; //Math.min(mouseY, cropStartY);
			cropBox.style.width = `${width}px`;
			cropBox.style.left = `${left}px`;
			cropBox.style.height = `${height}px`; //erlaubt nur width cropping!
			cropBox.style.top = `${top}px`;
		}
	}

	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}

	function cropImage() {
		const cropX = parseInt(cropBox.style.left);
		const cropY = parseInt(cropBox.style.top);
		const cropWidth = parseInt(cropBox.style.width);
		const cropHeight = parseInt(cropBox.style.height);
		const canvas = document.createElement('canvas');
		canvas.width = cropWidth;
		canvas.height = cropHeight;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
		const croppedImageDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = croppedImageDataUrl;
		img.width = cropWidth;
		img.height = cropHeight;
		mStyle(cropBox, { top: 0, left: 0 });
		return croppedImageDataUrl;
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	return {
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,
		elem: cropBox,
	}
}
async function loadSrcAndComplete(path, dParent, dButtons) {
	return new Promise(async (resolve, reject) => {
		dParent.innerHTML = '';
		let img = UI.imgElem = mDom(dParent, { box: true }, { tag: 'img' });
		//let img = UI.imgElem = mDom(dParent, { position: 'absolute', left: 0, box:true }, { tag: 'img', className: 'previewImage' });
		img.onload = () => {
			img.onload = null;
			const aspectRatio = img.width / img.height;
			const h = 300;
			const w = aspectRatio * h;
			//mStyle(img,{left: 0, h:h, w:w})
			UI.cropper = mCropper(dParent, img);
			mButton('Crop', UI.cropper.crop, dButtons, { w: 120 }, 'input');
			resolve(img);
		};

		img.onerror = (error) => {
			// Handle loading errors, if necessary
			reject(error);
		};

		img.src = path;
		//await resizeImage(img,300);
		//UI.cropper = mCropper(UI.dDrop, imgElem);
		//resolve(img);
	});
}

function loadImage(path, dParent, dButtons) {
	dParent.innerHTML = '';
	let img = UI.imgElem = mDom(dParent, { position: 'absolute', left: 0, box: true }, { tag: 'img', src: path, height: 300, className: 'previewImage' });


	img.onload = () => {
		img.onload = null;
		let image = img;
		const containerHeight = 300; //document.getElementById('container').clientHeight; // Get container height
		const aspectRatio = image.width / image.height; // Calculate aspect ratio

		// Calculate new width based on container height
		const newWidth = containerHeight * aspectRatio;

		// Create a canvas element
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// Set canvas dimensions to resized image dimensions
		canvas.width = newWidth;
		canvas.height = containerHeight;

		// Draw the resized image on the canvas
		ctx.drawImage(image, 0, 0, newWidth, containerHeight);

		const imgData = canvas.toDataURL('image/png');
		image.src = imgData;
		image.onload = () => {
			image.onload = null;
			// mAppend(dParent, image); //canvas);
			// document.getElementById('container').appendChild(canvas);
			UI.cropper = cropPreviewImage(dParent, image);
			dButtons.innerHTML = '';
			mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Crop', onclick: UI.cropper.crop, className: 'input' })
			mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Show Cropper', onclick: UI.cropper.show, className: 'input' })
			mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Hide Cropper', onclick: UI.cropper.hide, className: 'input' })
		}

	};
	return img;

}

function uploadImg(imgElem, cat, name, ev) {
	const canvas = document.createElement('canvas');
	canvas.width = imgElem.width;
	canvas.height = imgElem.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);

	canvas.toBlob((blob) => {
		const formData = new FormData();
		formData.append('image', blob, name + '.png');
		formData.append('category', cat);
		formData.append('name', name);
		let url = `http://localhost:3000/upload`; //TODO: SERVERNAME!!!
		fetch(url, {
			method: 'POST',
			mode: 'cors',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				ev.preventDefault();
				console.log('Image uploaded successfully:', data);
			})
			.catch(error => {
				console.error('Error uploading image:', error);
			});
	});
}
function uploadImg(imgElem, cat, name, ev) {
	const canvas = document.createElement('canvas');
	canvas.width = imgElem.width;
	canvas.height = imgElem.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);

	canvas.toBlob((blob) => {
		const formData = new FormData();
		formData.append('image', blob, name + '.png');
		formData.append('category', cat);
		formData.append('name', name);
		let url = `http://localhost:3000/upload`; //TODO: SERVERNAME!!!

		// Send form data via AJAX
		// var xhr = new XMLHttpRequest();
		// xhr.open('POST', url, true);
		// xhr.setRequestHeader('Content-Type', 'application/json');
		// xhr.withCredentials = false; //das ist cors
		// xhr.onreadystatechange = function () {
		// 	if (xhr.readyState === 4 && xhr.status === 200) {
		// 		// Handle the AJAX response here
		// 		console.log(xhr.responseText);
		// 	}
		// };
		// xhr.send(JSON.stringify(formData));

		// Send form data via fetch
		fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				ev.preventDefault();
				console.log('Image uploaded successfully:', data);
			})
			.catch(error => {
				console.error('Error uploading image:', error);
			});
	});
}
function _loadImage(path, dParent, dButtons) {

	//console.log('img',UI.imgElem)
	UI.imgElem = mDom(dParent, { position: 'absolute', left: 0 }, { tag: 'img', src: path, height: 300, className: 'previewImage' });
	//mDom(dParent,{},{className:"resize-handle top-left"});
	//mDom(dParent,{},{className:"resize-handle bottom-right"});
	//resizePreviewImage();
	UI.imgElem.onload = () => {
		let img = UI.imgElem;
		img.onload = null;
		let [w, h] = [img.offsetWidth, img.offsetHeight];
		img.width = w;
		img.height = h;
		mStyle(img, { w: w, h: h });
		UI.cropper = cropPreviewImage(dParent, img);
		mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Show Cropper', onclick: UI.cropper.show, className: 'input' })
		mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Crop', onclick: UI.cropper.crop, className: 'input' })
	}

	//mDom(dButtons, { w: 120 }, { tag: 'button', html: 'Cancel', onclick: onclickUpload, className: 'input' })


}

function mDatalist(dParent, list, opts = {}) {
	var mylist = list;
	var opts = opts;
	addKeys({ alpha: true, edit: true, filter: 'contains' }, opts); // matches: (x, inputVal) => x.startsWith(inputVal.toLowerCase()) },opts)

	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, {}, { tag: 'input', className: 'datalistInput', placeholder: "<enter value>" });
	mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });

	var elem = d;
	var inp = elem.firstChild;
	var datalist = elem.lastChild;

	inp.setAttribute('list', optid);
	// console.log('datalist',elem,inp,datalist)

	function update() {
		let val = valf(inp.value, '');
		if (isEmpty(val)) return;
		if (mylist.includes(val)) return;
		mylist.push(val);
		if (opts.alpha) mylist.sort();
		let i = mylist.indexOf(val);
		//if (opts.alpha) addIfAlpha(mylist,val); else addIf(mylist,val);
		inp.value = ''; //clear input
		if (opts.filter == 'contains') { let el = mDom(datalist, {}, { tag: 'option', value: val }); mInsertAt(datalist, el, i) }
		else populate();
	}
	function populate() {
		//if (isdef(datalist.firstChild) && opts.filter == 'contains') return;
		let val = valf(inp.value, ''); val = val.toLowerCase();
		datalist.innerHTML = '';
		//console.log('datalist',datalist)
		let filteredList = isEmpty(val) ? mylist : mylist.filter(x => opts.matches(x, val));
		//console.log('filtered',filteredList)
		for (const w of filteredList) { mDom(datalist, {}, { tag: 'option', value: w }); }
	}
	populate();

	if (opts.edit) inp.addEventListener('keyup', ev => { if (ev.key === 'Enter') update(); });
	if (isdef(opts.matches)) inp.addEventListener('input', populate);

	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
		populate: populate,

	}
}


function _myDatalist(dParent, list, opts = {}) {
	//what is the list we are working with?
	var mylist = list;
	var opts = opts;
	addKeys({ alpha: true, edit: true, matches: (x, inputVal) => x.startsWith(inputVal.toLowerCase()) }, opts)

	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, {}, { tag: 'input', className: 'datalistInput', placeholder: "<enter value>" });
	mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
	// //#region create
	// // function create(dParent) {
	// 	let id = getUID('dl');
	// 	let optid = 'opt' + id;
	// 	//console.log('id', id)
	// 	let html = `
	// 		<input list="${optid}" class='datalistInput' id="${id}" placeholder="<enter value>">
	// 		<datalist id="${optid}" class='datalist'></datalist>
	// 		`;
	// 	let d = mDiv(toElem(dParent));
	// 	d.innerHTML = html;
	// // 	return d;
	// // }
	// //#endregion
	var elem = d;//create(toElem(dParent));
	var inp = elem.firstChild;
	var datalist = elem.lastChild;
	inp.setAttribute('list', optid);
	console.log('datalist', elem, inp, datalist)
	function update() {
		let val = valf(inp.value, '');
		//fuege val alphabetisch in liste ein (opt.alpha)
		addIfAlpha(mylist, val);
		//populate
		populate();
		inp.value = ''; //clear input
	}
	function populate(val) {
		val = valf(inp.value, ''); val = val.toLowerCase();
		datalist.innerHTML = '';
		console.log('datalist', datalist)
		let filteredList = mylist.filter(x => opts.matches(x, val));
		for (const w of filteredList) { mDom(datalist, {}, { tag: 'option', value: w }); }
	}
	populate();

	if (opts.edit) inp.addEventListener('keyup', ev => { if (ev.key === 'Enter') update(); });
	//if (opts.alpha) inp.addEventListener('input', this.populate);

	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
		populate: populate,

	}
}
function _mDatalist(dParent, list, allowEdit = true) {
	let id = getUID('dl');
	let optid = 'opt' + id;
	console.log('id', id)
	let html = `
		<input list="${optid}" class='datalistInput' id="${id}" placeholder="<enter value>">
		<datalist id="${optid}" class='datalist'></datalist>
		`;
	let d = mDom(toElem(dParent));
	d.innerHTML = html;
	const inp = document.getElementById(id);
	const datalist = document.getElementById(optid);
	for (const w of list) { //} ['a', 'd', 'f', 's']) {
		mDom(datalist, {}, { tag: 'option', value: w });
	}
	if (allowEdit) {
		inp.addEventListener('keyup', ev => {
			if (ev.key === 'Enter') {
				let inp = ev.target;
				let dl = mBy('opt' + inp.id);
				let val = inp.value.toLowerCase();
				inp.value = '';
				const option = document.createElement('option');
				option.value = val;
				let i = 0;
				for (const el of arrChildren(dl)) {
					let v = el.value;
					//console.log('v', v);
					if (v == val) { break; } //console.log('found val', v); break; }
					else if (v > val) { mInsertAt(dl, option, i); break; }
					else if (el == dl.lastChild) mAppend(dl, option);
					i++;
				}
			}
		});
	}
	return d;
}
function _mDatalist(dParent, list, allowEdit = true) {
	let id = getUID('dl');
	let optid = 'opt' + id;
	console.log('id', id)
	let d = mDom(toElem(dParent));

	// let html = `
	// 	<input list="${optid}" class='datalistInput' id="${id}" placeholder="<enter value>">
	// 	<datalist id="${optid}" class='datalist'></datalist>
	// 	`;
	// d.innerHTML = html;
	// const inp = document.getElementById(id);
	// const datalist = document.getElementById(optid);

	const inp = mDom(d, {}, { tag: 'input', className: 'datalistInput', id: id, placeholder: "<enter value>" });
	const datalist = mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
	inp.setAttribute('list', optid);

	console.log(inp, datalist); //return;

	for (const w of list) { //} ['a', 'd', 'f', 's']) {
		mDom(datalist, {}, { tag: 'option', value: w });
	}

	// return d;
	if (allowEdit) {
		inp.addEventListener('keyup', ev => {
			if (ev.key === 'Enter') {
				let inp = ev.target;
				let dl = mBy('opt' + inp.id);
				// console.log(inp,dl); return;
				let val = inp.value.toLowerCase();
				inp.value = '';
				const option = document.createElement('option');
				option.value = val;
				let i = 0;
				for (const el of arrChildren(dl)) {
					let v = el.value;
					//console.log('v', v);
					if (v == val) { break; } //console.log('found val', v); break; }
					else if (v > val) { mInsertAt(dl, option, i); break; }
					else if (el == dl.lastChild) mAppend(dl, option);
					i++;
				}
			}
		});
	}
	return d;
}

//#endregion combu

//#region db

//#region ai generated SimpleDatabase
class SimpleDatabase {
  constructor() {
    this.data = new Map();
  }

  // Insert or update a key-value pair
  set(key, value) {
    this.data.set(key, value);
  }

  // Retrieve the value associated with a key
  get(key) {
    return this.data.get(key);
  }

  // Remove a key-value pair
  remove(key) {
    this.data.delete(key);
  }

  // Get all keys in the database
  getKeys() {
    return Array.from(this.data.keys());
  }

  // Get all values in the database
  getValues() {
    return Array.from(this.data.values());
  }

  // Get all key-value pairs in the database
  getAll() {
    return Array.from(this.data.entries());
  }
}

// Example usage:
let db = new SimpleDatabase();

// Insert data
db.set('name', 'John');
db.set('age', 25);
db.set('city', 'Example City');

// Retrieve data
console.log('Name:', db.get('name')); // Output: John
console.log('Age:', db.get('age')); // Output: 25

// Remove a key-value pair
db.remove('age');

// Get all keys
console.log('Keys:', db.getKeys()); // Output: ['name', 'city']

// Get all values
console.log('Values:', db.getValues()); // Output: ['John', 'Example City']

// Get all key-value pairs
console.log('All:', db.getAll()); // Output: [['name', 'John'], ['city', 'Example City']]




//#endregion

//#region sqlite3
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(uploadDirectory, 'db', 'database.db');
console.log(`SQLite3 version: ${sqlite3.version}`);

// Step 1: Open a SQLite database connection
db = new sqlite3.Database(dbPath, (err) => {
	if (err) {
		console.error('Error opening database:', err.message);
	} else {
		console.log('Connected to the SQLite database');
	}
});

function createDB() {
	// Step 2: Create 'users' table
	db.run(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY,
			name TEXT,
			color TEXT
		)
	`);
	// Step 3: Create 'events' table
	db.run(`
		CREATE TABLE IF NOT EXISTS events (
			id INTEGER PRIMARY KEY,
			userid INTEGER,
			text TEXT,
			time TEXT,
			date TEXT,
			created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			shared TEXT,
			period TEXT,
			FOREIGN KEY (userid) REFERENCES users (id)
		)
	`);

	// Step 4: Create 'ownEvents' table
	db.run(`
		CREATE TABLE IF NOT EXISTS ownEvents (
			userid INTEGER,
			eventid INTEGER,
			FOREIGN KEY (userid) REFERENCES users (id),
			FOREIGN KEY (eventid) REFERENCES events (id),
			PRIMARY KEY (userid, eventid)
		)
	`);

	// Step 5: Create 'subscribedEvents' table
	db.run(`
		CREATE TABLE IF NOT EXISTS subscribedEvents (
			userid INTEGER,
			eventid INTEGER,
			FOREIGN KEY (userid) REFERENCES users (id),
			FOREIGN KEY (eventid) REFERENCES events (id),
			PRIMARY KEY (userid, eventid)
		)
	`);

	// Step 6: Create 'friends' table
	db.run(`
		CREATE TABLE IF NOT EXISTS friends (
			userid1 INTEGER,
			userid2 INTEGER,
			FOREIGN KEY (userid1) REFERENCES users (id),
			FOREIGN KEY (userid2) REFERENCES users (id),
			PRIMARY KEY (userid1, userid2)
		)
	`);
}

async function testDB_events() {
	const query = 'SELECT * FROM events';
	const db = await sqlitePromise.open(dbPath, { Promise });

	await db.all(query, [], (err, rows) => {
		if (err) {
			console.error(err.message);
		} else {
			// Convert rows to JavaScript objects
			// id INTEGER PRIMARY KEY,
			// userid INTEGER,
			// text TEXT,
			// time TEXT,
			// date TEXT,
			// created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			// shared TEXT,
			// period TEXT,
			// FOREIGN KEY (userid) REFERENCES users (id)
			const fields=['id','userid','time','text','date','created','shared','period'];
			let arr=[];
			for(const row of rows){
				let o={};
				for(const k of fields){
					o[k]=row[k];
				}
				arr.push(o);
			}
			//const data = rows.map(row => {} ({ id: row.id, userid: row.userid, color: row.color }));

			// Serialize JavaScript objects to YAML
			const yamlData = yaml.dump(arr);

			// Save YAML data to a file
			fs.writeFileSync(path.join(uploadDirectory,'events.yaml'), yamlData);

			console.log('Data converted and saved to output.yaml');
		}

		// Close SQLite database connection
		db.close();
	});
}
async function testDB_users() {
	const query = 'SELECT * FROM users';
	const db = await sqlitePromise.open(dbPath, { Promise });

	await db.all(query, [], (err, rows) => {
		if (err) {
			console.error(err.message);
		} else {
			// Convert rows to JavaScript objects
			const data = rows.map(row => ({ id: row.id, name: row.name, color: row.color }));

			// Serialize JavaScript objects to YAML
			const yamlData = yaml.dump(data);

			// Save YAML data to a file
			fs.writeFileSync(path.join(uploadDirectory,'users.yaml'), yamlData);

			console.log('Data converted and saved to users.yaml');
		}

		// Close SQLite database connection
		db.close();
	});

}
async function testDB(){
	await testDB_users();
	await testDB_events();
}
function createUser(name, color) {
  const insertQuery = 'INSERT INTO users (name, color) VALUES (?, ?)';
  const values = [name, color];

  db.run(insertQuery, values, function (err) {
    if (err) {
      console.error('Error creating user:', err.message);
    } else {
      console.log(`User created with ID: ${this.lastID}`);
    }
  });
}
createUser('felix','blue');

testDB_users();
testDB_events();

//#endregion


//*************** trial 2 */
const sqlite3 = require('sqlite3'); //const sqlite3 = require('sqlite3').verbose();

const users = new sqlite3.Database(path.join(uploadDirectory,db,'users.db'), (err) => {});
const events = new sqlite3.Database(path.join(uploadDirectory,db,'events.db'), (err) => {});

// Step 2: Create 'events' table
events.run(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY,
    userid TEXT,
    text TEXT,
    time TEXT,
    date TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shared TEXT,
    period TEXT
  )
`);

// Step 3: Insert an event into the 'events' table
function insertEvent(event) {
  const insertQuery = `
    INSERT INTO events (userid, text, time, date, shared, period)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [event.userid, event.text, event.time, event.date, event.shared, event.period];

  events.run(insertQuery, values, function (err) {
    if (err) {
      console.error('Error inserting event:', err.message);
    } else {
      console.log(`Event inserted with ID: ${this.lastID}`);
    }
  });
}

// Step 4: Retrieve events for a specific userid and month
function getEventsByUserIdAndMonth(userid, month) {
  const selectQuery = `
    SELECT *
    FROM events
    WHERE userid = ? AND strftime('%Y-%m', date) = ?
  `;

  events.all(selectQuery, [userid, month], (err, rows) => {
    if (err) {
      console.error('Error getting events:', err.message);
    } else {
      console.log(`Events for ${userid} in ${month}:`, rows);
    }
  });
}

// // Example usage
// const event1 = {
//   userid: 'user123',
//   text: 'Event 1',
//   time: '12:00 PM',
//   date: '2023-11-15',
//   shared: 'all',
//   period: 'weekday',
// };

// const event2 = {
//   userid: 'user123',
//   text: 'Event 2',
//   time: '3:30 PM',
//   date: '2023-11-20',
//   shared: 'friends',
//   period: 'none',
// };

// insertEvent(event1);
// insertEvent(event2);

// getEventsByUserIdAndMonth('user123', '2023-11');

// // Step 5: Close the SQLite database connection
// db.close((err) => {
//   if (err) {
//     console.error('Error closing database:', err.message);
//   } else {
//     console.log('Closed the SQLite database connection');
//   }
// });

//CREATE READ UPDATE DELETE CRUD

//#endregion

//#region filterImages (combu)
function filterCollection(ev) {
	console.log('changing collection!!!!!!!!!!!!!!!!');
	//hier soll er M.masterList setzen auf alle oder die von collection
	//danach soll er den filter clear setzen!
	let s = ev.target.value.toLowerCase().trim();
	let list = s == 'all' || isEmpty(s)? Object.keys(M.superdi): M.byCollection[s];
	M.masterKeys = list;
	M.keys = Array.from(list);
	M.filterViewer.inpElem.value = '';
	if (nundef(list) || isEmpty(list)) { 
		M.cells.map(x=>mStyle(x,{opacity:0}));
		showFleetingMessage(`collection ${s} is empty`, 'dMessage');
		return;
	}
	M.index = 0;
	showImageBatch(0);
}
function filterImages(ev) {
	//s can be interpreted as cat or part of key
	//erstmal nur als cat
	//wenn da nix ist, dann als part of key
	console.log('oninput!!!!!!!!!!!!!!!!');
	let s = ev.target.value.toLowerCase().trim();
	if (isEmpty(s)) return;
	let list = M.byCat[s];
	if (nundef(list) || isEmpty(list)) {
		list = [];
		for (const k in M.superdi) {
			let o = M.superdi[k];
			if (k.includes(s) || o.friendly.includes(s)) list.push(k);
		}
		if (isEmpty(list)) return; //list = Object.keys(M.superdi);
	}
	M.keys = list;
	M.index = 0;
	showImageBatch(0);

}

function filterImages(ev){
	let coll = M.masterViewer.inpElem.value.toLowerCase().trim();
	let filter = M.filterViewer.inpElem.value.toLowerCase().trim();
	console.log('coll='+coll,'filter='+filter)

	let list = isEmpty(coll)?Object.keys(M.superdi):nundef(M.byCollection[coll])?[]:M.byCollection[coll];

	if (isEmpty(list)){
		showFleetingMessage(`Collection ${coll} is empty!`)
		return;
	}

	let di = {};list.map(x=>di[x]=true);

	//now simply apply filter to list!
	let s=filter;
	let list1 = isEmpty(s)?list:isdef(M.byCat[s])?M.byCat[s].filter(x=>isdef(di[x])):[];

	if (isEmpty(list1)){
		//jetzt apply s for keysearch
		for (const k in di) {
			let o = M.superdi[k];
			if (k.includes(s) || o.friendly.includes(s)) list1.push(k);
		}
	}

	M.keys = list1;
	console.log('list1',list1)



	for(const k of list){

	}


}
//#endregion

//#region img detection
async function natEdgeDetectTitle(k, src, border, idx) {

	let path = `../assets/games/nations/cards/${src}`;
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height]; console.log('w', w, 'h', h);

	//only consider images in landscape form
	if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.drawImage(img, 0, 0, w, h);
	img.remove();

	let [resx, resy] = findPoints(ctx, w * .25, w * .9, 0, h, '#544744');

	resy = sortBy(resy, 'y');
	//let ys=resy.map(o=>o.y); console.log('ys',ys);
	resy.map(o => o.nei = findPointAtDistance(o, 0, 261, resy));
	resy = resy.filter(x => x.nei);
	resy.map(p => drawPix(ctx, p.x, p.y, 'red'));


	// Example usage:
	const points = resy;

	const result = findMostFrequentY(points);
	console.log(result);




	resx = sortBy(resx, 'x');
	//let xs=resx.map(o=>o.x); console.log('xs',xs);
	resx.map(o => o.nei = findPointAtDistance(o, 243, 0, resx));
	resx = resx.filter(x => x.nei);
	resx.map(p => drawPix(ctx, p.x, p.y, 'blue'));



	return [resx, resy];


}

function __findSimPixXSequence(ctx, x1, x2, y, clist) {
	let [x, i] = [x1, 0];
	let ok = true;
	let results = [];
	while (x <= x2 && i < clist.length) {
		let p = isPixSim(ctx, x, y, clist[i]);
		if (p) { results.push({ x: x, y: y, color: p, csim: clist[i] }); i++; }
		x++;
	}
	if (results.length == clist.length) return results; else return null;
}
async function edgeDetect(k, src, border, idx) {

	let path = `../assets/games/nations/cards/${src}`; //.jpg`;
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height]; console.log('w', w, 'h', h);

	//only consider images in landscape form
	if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });

	ctx.drawImage(img, 0, 0, w, h);

	//fuer start suche: #D8BEAF rgb(215,189,174), D5BFB2 rgb(214,192,179), D3BDAF = rgb(208,189,174)
	let corner2 = findSimPixLineHor(ctx, 5, 90, 5, 80, { r: 215, g: 189, b: 174 }, 10, 10);
	drawPixFrame(ctx, corner2.x, corner2.y, 'green', 7);
	let [x, y1, cgoal] = [corner2.x, corner2.y, { r: 167, g: 158, b: 151 }]; //colorRGB('#a18b81', true)];

	let result;
	//for (const delta of [12, 15, 18, 21]) {
	for (let y = y1; y < y1 + 10; y++) {
		result = findSimPixXSequence(ctx, x, w, y,
			[{ r: 167, g: 158, b: 151 }, { r: 220, g: 216, b: 213 }, { r: 167, g: 158, b: 151 }],
			[0, 8, 50], 15)
		console.log('result', result);

		if (result) { result.map(o => drawPixFrame(ctx, o.x, o.y, 'red', 7)); break; }
	}
	//}

	//let corner = findSimPixXY(ctx, 5, 50, 5, 40, { r: 215, g: 189, b: 174 }, 10);
	//let corner2 = findSimPixLineHor(ctx, 5, 90, 5, 60, { r: 215, g: 189, b: 174 },10, 10);
	// console.log('corner', corner, corner2);
	// drawPixFrame(ctx, corner.x, corner.y, 'yellow', 15);
	// drawPixFrame(ctx, corner2.x, corner2.y, 'green', 15);
	// //img.style.display = 'none'; return;
	// let [x, y, cgoal] = [corner2.x, corner2.y, {r:167,g:158,b:151}]; //colorRGB('#a18b81', true)];
	// drawPix(ctx, x, y, 'red', 5);
	// let sim = findSimPixX(ctx, x, w, y, cgoal, 15);
	// if (sim.x) {
	// 	drawPix(ctx, sim.x, y, 'green', 5);
	// 	let sim2 = findSimPixX(ctx, sim.x + 5, w, y, cgoal,15);
	// 	if (sim2.x) drawPix(ctx, sim2.x, y, 'green', 5);
	// } else console.log('NOT FOUND!!!')


	img.style.display = 'none';
	return result;
}
function _findSimPixLineHor(ctx, x1, x2, y1, y2, cgoal, minlen = 10) {
	let p;
	for (let y = y1; y < y2; y++) {
		for (let xStart = x1; xStart < x2; xStart++) {
			let found = true;
			for (let x = xStart; x < xStart + minlen; x++) {
				p = isPixSim(ctx, x, y, cgoal); if (!p) { found = false; break; }
			}
			if (found) return { x: xStart, y: y, color: p };
		}
	}
	return { x: null, color: null }
}
async function rest() {
	//first detect #A18B81 along top to bottom starting at 10% ending at 10%
	let [cgoal, x1, x2, y1, y2] = ['#a18b81', 0, w, 0, h];//w/2,w,Math.round(h/2),Math.round(h*2/3)]; //w*.1,w*.9,h*.1,h*.9];
	let vlines = {}, p;
	for (let x = x1; x < x2; x++) {
		for (let y = y1; y < y2; y++) {
			if (p = isPixSim(ctx, x, y, cgoal)) {
				assertion(nundef(vlines[x]), `duplicate ${x}`)
				vlines[x] = { x1: x, y1: y, color: p };
				// console.log('BINGO!',x,y)
				break;
			}
		}
	}

	// console.log(vlines)
	let max = 0;
	for (const x in vlines) {
		let o = vlines[x];
		o.linedown = getPixLineAtX(ctx, x, o.y1, h);
		o.avg = getPixAvg(o.linedown);
		// //geh alle y's ab y1 hinunter und schau ob bedingung erfuellt ist fuer x,x+1
		// let y=o.y1+1;
		// while(isPixSim2(ctx,x,y,cgoal)||isPixSim2(ctx,x+1,y,cgoal)) y++;
		// o.y2=y;
		// o.other = getPixHex(ctx,x,y);
		// if (y-o.y1>max) max=o;
	}
	// console.log(vlines,colorRGB(cgoal,true));
	// Object.values(vlines).map(o=>console.log(`${o.x1}: ${o.avg.r} ${o.avg.g} ${o.avg.b}`));

	//sort vlines by closeness to goal number
	let goal = colorRGB(cgoal, true);
	let arr = Object.values(vlines);

	console.log(colorRGB(cgoal, true));
	console.log('_______orig', arr.map(x => x.x1))
	//arr.map(el=>console.log(el.x1,el.avg.r,el.avg.g,el.avg.b))

	let arrSorted = sortByFunc(arr, el => Math.abs(el.avg.r - goal.r));//+Math.abs(el.avg.g-goal.g)+Math.abs(el.avg.b-goal.b));
	console.log('_______sorted', arrSorted.map(x => x.x1))
	// arrSorted.map(el=>console.log(el.x1,el.avg.r,el.avg.g,el.avg.b))

	//markiere die lines
	drawPix(ctx, arrSorted[0].x1, arrSorted[0].y1, 'red', 5)
	drawPix(ctx, arrSorted[1].x1, arrSorted[1].y1, 'red', 5)


	mStyle(img, { display: 'none' })
}



async function edgeDetect(k, src, border, idx) {

	let path = `../assets/games/nations/cards/${src}`; //.jpg`;
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height]; console.log('w', w, 'h', h);

	//only consider images in landscape form
	if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });

	ctx.drawImage(img, 0, 0, w, h);

	//fuer start suche: #D8BEAF rgb(215,189,174), D5BFB2 rgb(214,192,179), D3BDAF = rgb(208,189,174)

	let corner = findSimPixXY(ctx, 5, 50, 5, 40, { r: 215, g: 189, b: 174 }, 10);
	let corner2 = findSimPixLineHor(ctx, 5, 90, 5, 60, { r: 215, g: 189, b: 174 },10, 10);
	console.log('corner', corner, corner2);
	drawPixFrame(ctx, corner.x, corner.y, 'yellow', 15);
	drawPixFrame(ctx, corner2.x, corner2.y, 'green', 15);
	//img.style.display = 'none'; return;


	let [x, y, cgoal] = [corner2.x, corner2.y, {r:167,g:158,b:151}]; //colorRGB('#a18b81', true)];
	drawPix(ctx, x, y, 'red', 5);

	let sim = findSimPixX(ctx, x, w, y, cgoal, 15);
	if (sim.x) {
		drawPix(ctx, sim.x, y, 'green', 5);
		let sim2 = findSimPixX(ctx, sim.x + 5, w, y, cgoal,15);
		if (sim2.x) drawPix(ctx, sim2.x, y, 'green', 5);


	} else console.log('NOT FOUND!!!')
	img.style.display = 'none';

}
async function __edgeDetect(k,src,border,idx){

	let path = `../assets/games/nations/cards/${src}`; //.jpg`;
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height]; console.log('w',w,'h',h);

	//only consider images in landscape form
	assertion(w>h,`NOT in landscape! ${k} ${src}`);

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d',{ willReadFrequently: true });

	ctx.drawImage(img, 0, 0, w, h);

	//first detect #A18B81 along top to bottom starting at 10% ending at 10%
	let [cgoal,x1,x2,y1,y2]=['#a18b81',0,w,0,h];//w/2,w,Math.round(h/2),Math.round(h*2/3)]; //w*.1,w*.9,h*.1,h*.9];
	let vlines={},p;
	for(let x=x1;x<x2;x++){
		for(let y=y1;y<y2;y++){
			if (p=isPixSim2(ctx,x,y,cgoal)){
				assertion(nundef(vlines[x]),`duplicate ${x}`)
				vlines[x]={x1:x,y1:y,color:p};
				// console.log('BINGO!',x,y)
				break;
			}
		}		
	}

	// console.log(vlines)
	let max=0;
	for(const x in vlines){
		let o=vlines[x];
		o.linedown=getPixLineAtX(ctx,x,o.y1,h);
		o.avg=getPixAvg(o.linedown);
		// //geh alle y's ab y1 hinunter und schau ob bedingung erfuellt ist fuer x,x+1
		// let y=o.y1+1;
		// while(isPixSim2(ctx,x,y,cgoal)||isPixSim2(ctx,x+1,y,cgoal)) y++;
		// o.y2=y;
		// o.other = getPixHex(ctx,x,y);
		// if (y-o.y1>max) max=o;
	}
	// console.log(vlines,colorRGB(cgoal,true));
	// Object.values(vlines).map(o=>console.log(`${o.x1}: ${o.avg.r} ${o.avg.g} ${o.avg.b}`));

	//sort vlines by closeness to goal number
	let goal=colorRGB(cgoal,true);
	let arr=Object.values(vlines);

	console.log(colorRGB(cgoal,true));
	console.log('_______orig',arr.map(x=>x.x1))
	//arr.map(el=>console.log(el.x1,el.avg.r,el.avg.g,el.avg.b))

	let arrSorted=sortByFunc(arr,el=>Math.abs(el.avg.r-goal.r));//+Math.abs(el.avg.g-goal.g)+Math.abs(el.avg.b-goal.b));
	console.log('_______sorted',arrSorted.map(x=>x.x1))
	// arrSorted.map(el=>console.log(el.x1,el.avg.r,el.avg.g,el.avg.b))

	//markiere die lines
	drawPix(ctx, arrSorted[0].x1, arrSorted[0].y1, 'red',5)
	drawPix(ctx, arrSorted[1].x1, arrSorted[1].y1, 'red',5)


	mStyle(img,{display:'none'})
}
async function edgeDetect(k,src,border,idx){

	let path = `../assets/games/nations/cards/${src}`; //.jpg`;
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height]; console.log('w',w,'h',h);

	//only consider images in landscape form
	assertion(w>h,`NOT in lanscape! ${k} ${src}`);

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d',{ willReadFrequently: true });

	ctx.drawImage(img, 0, 0, w, h);

	//first detect #A18B81 along top to bottom starting at 10% ending at 10%
	let [c,x1,x2,y1,y2]=['#a18b81',w/2,w,0,h/3]; //w*.1,w*.9,h*.1,h*.9];
	let vlines={};
	let cond=p=>p[1]=='a' && p[3]==8 && p[5]==8;
	for(let x=x1;x<x2;x++){
		for(let y=y1;y<y2;y++){
			let p=getPixelColor(ctx,x,y); //console.log('color',p);
			if (cond(p)){
				assertion(nundef(vlines[x]),`duplicate ${x}`)
				vlines[x]={x1:x,y1:y,color:p};
				console.log('BINGO!',x,y)
				break;
			}
		}		
	}

	console.log(vlines)
	for(const x in vlines){
		let o=vlines[x];
		//geh alle y's ab y1 hinunter und schau ob bedingung erfuellt ist fuer x,x+1
		for(let y=o.y1;y<h;y++){
			//if ()
		}
	}

}
async function __present(name, color, idx, rot) {
	//do this for each card:
	//if (isdef(mBy('img1'))) mBy('img1').remove();
	//let name = `age1_aeneid`;
	let path = `../assets/games/nations/cards/${name}.jpg`;

	let hImg = 200, wImg = 310;
	let img = await imgAsync(document.body, { position: 'absolute', top: '70vh', h: hImg, w: wImg }, { height: hImg, width: wImg, src: path, tag: 'img', id: 'img' + idx })
	console.log('img', img)

	let dir = 'portrait';
	let rotate = img.width > img.height;
	let dView = 'dMain';

	let dParent = toElem(dView);
	//mClear(dParent);
	let [w, h] = rotate ? [img.height, img.width] : [img.width, img.height];
	// let canvas = mDom(dParent, { border: '10px solid yellow', box:true }, { tag: 'canvas', id: 'canvas',width: w, height: h });
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w - 4, height: h - 6 });

	let ctx = canvas.getContext('2d');
	console.log('rot', rot)
	if (rot == -90) {
		ctx.translate(0, img.width);
		ctx.rotate(-90 * Math.PI / 180); //ctx.rotate(-90 * Math.PI / 180);
		ctx.translate(-4, 15)
		ctx.drawImage(img, 0, 0, img.width, img.height)
		ctx.beginPath();
		ctx.lineWidth = "10";
		ctx.strokeStyle = color;
		ctx.rect(15, -4, 290, 180);
		ctx.stroke();
	} else if (rot == 90) {
		ctx.translate(canvas.width, 0); //-canvas.height/2) //img.width);
		ctx.rotate(rot * Math.PI / 180); //ctx.rotate(-90 * Math.PI / 180);
		ctx.translate(-8, 6) //erstes:- verschiebt nacht oben, zweites: + verschiebt nach links
		ctx.drawImage(img, 0, 0, img.width, img.height)
		ctx.beginPath();
		ctx.lineWidth = "10";
		ctx.strokeStyle = color;
		ctx.rect(12, 5, img.width - 15, img.height - 20) //15, -4, 290, 180);
		// ctx.rect(15, -4, 290, 180);
		ctx.stroke();
	} else {
		ctx.drawImage(img, 0, 0, img.width, img.height)
	}

	//await imgToServer(canvas,`combu/${name}.png`);
	//await mSleep(1000);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);


	//let cv = imgAsCanvas(img,'dMain');
}

function mist() {

	//return;
	let dir = 'portrait';
	let rotate = img.width > img.height;
	//let [w, h] = rotate ? [img.height, img.width] : [img.width, img.height];
	//jetzt kommt der echte canvas!
	[iw, ih, cw, ch] = [xend - xstart, yend - ystart, yend - ystart, xend - xstart];
	let cv1 = mDom(dParent, { maleft: 20, border: 'green' }, { tag: 'canvas', id: 'cv1', width: cw, height: ch });
	let ct1 = cv1.getContext('2d');
	if (rotate) {
		if (rot == 90) { ct1.translate(cv1.width, 0); } else { ct1.translate(0, ch); }
		ct1.rotate(rot * Math.PI / 180); //ctx.rotate(-90 * Math.PI / 180);
	}
	//ctx.translate()
	ct1.drawImage(img, xstart, ystart, cv1.height, cv1.width, 0, 0, yend - ystart - 20, cv1.width);





}
async function ___present(name, color, idx, rot) {
	let path = `../assets/games/nations/cards/${name}.jpg`;
	let [hImg, wImg, border, diff] = [200, 300, 10, 10];
	let img = await imgAsync(document.body, { position: 'absolute', top: '70vh', h: hImg, w: wImg }, { height: hImg, width: wImg, src: path, tag: 'img', id: 'img' + idx })
	let dir = 'portrait';
	let rotate = img.width > img.height;
	let dView = 'dMain';

	let dParent = toElem(dView);
	//mClear(dParent);
	let [w, h] = rotate ? [img.height, img.width] : [img.width, img.height];
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w - diff, height: h - diff });
	let ctx = canvas.getContext('2d');
	ctx.lineWidth = border;
	ctx.strokeStyle = color;
	console.log('rot', rot)
	if (rot == 90) cvRot90(img, canvas, ctx, w, h, border, diff);
	else if (rot == -90) cvRot270(img, canvas, ctx, w, h, border, diff);
	//await imgToServer(canvas,`combu/${name}.png`);
	//await mSleep(1000);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
}

async function test55_buildings(){
	let type = 'building';
	let diColors = {advisor:'orange',battle:'grey',building:'deepskyblue',colony:'green',event:'purple',golden_age:'gold',military:'red',war:'black',natural:'brown',wonder:'brown'};
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards',natCards);
	let i=0;
	let list = Object.keys(natCards).filter(x=>natCards[x].Type == type);
	console.log('list',list);
	let result=[];
	//list =['brewery']; // 'urban_center'];//'university']; //, 'urban_center'];
	//list = ['department_store','coffee_house','hippodrome']; //,]; //['aqueduct','shantytown','coal_mine'];//['coal_mine']; // 
	let dims={advisor:{dx:150,y:75,xmin:80,top:91,bot:151},building:{dx:250,y:240,xmin:180,top:176,bot:67}
	,hippodrome:{dx:250,y:230,xmin:180,top:176,bot:67},urban_center:{dx:245,y:230,xmin:180,top:176,bot:67}};
	for(const k of list){ //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________',k)
		let c=natCards[k];
		if (c.age == 0) {console.log('age 0',c.key); continue; }
		let path = c.Path;
		let color= diColors[c.Type];
		let dim = valf(dims[k],dims[type]); 
		let canvas = await natModCard(path,color,i++,dim);
		//result.push({cv:canvas,card:c,path:`y/nat/${type}/${k}.png`});
		console.log('path',path);
		let realPath = `y/nat/${type}/${k}.png`;
		if (canvas) await imgToServer(canvas,realPath);
		else{
			let img = await imgAsync('dExtra', {}, { src: path, tag: 'img', id: `im${k}` });
			let cv = imgRotate90(img);
			await imgToServer(cv,realPath);
		}
		//break;
	}
	//console.log('cvs',cvs);
	//let adv=arrLast(result);console.log(adv);
	return;
	for(const adv of result){
		await imgToServer(adv.cv,adv.path);
	}
	//console.log(arrLast(cvs));

}
function calcRealBoundaries(ctx, w, h, ybound = true, xbound = true, yextra = false, xendbd = true) {
	var x = 150; // replace with the desired x-coordinate
	let ystart = -1, yend = -1, y;
	let hbound = ybound ? h - 20 : h - 35;
	let wbound = xbound ? w - 20 : w - 35;
	let ymin = yextra ? 10 : 0;
	if (yextra) hbound += 10;
	let countlines = 0;
	let prevy = [];

	console.log('ymin', ymin)
	for (y = ymin; y < h; y++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;
		var red = pix[0]; var green = pix[1]; var blue = pix[2];

		if (green < 100 && blue < 100) {

			let almost1 = false, almost2 = false;

			//almost1 wird gebraucht wenn
			for (let yy = Math.max(0, y - 3); yy < y; yy++) { //Math.min(y+5,h);yy++)	{
				let p = ctx.getImageData(x, yy, 1, 1).data;
				if (p[0] + p[1] + p[2] > 520) almost1 = true;
				// console.log(p[0],p[1],p[2]);
			}
			for (let yy = y + 1; yy < Math.min(y + 5, h); yy++) { //Math.min(y+5,h);yy++)	{
				let p = ctx.getImageData(x, yy, 1, 1).data;
				if (p[0] + p[1] + p[2] > 520) almost2 = true;
				// console.log(p[0],p[1],p[2]);
			}

			if (almost1 && almost2) {
				ctx.fillStyle = 'black'
				for (const py of prevy) {
					let dy = y - py;
					console.log('dy', dy)
					if (dy > 152 && dy < 158) { console.log('BINGO!!!! zweites middle ding'); ctx.fillStyle = 'red'; }
				}
				prevy.push(y);
				console.log('______', countlines++, y);
				ctx.fillRect(x - 2, y - 2, 5, 5);
				if (ystart < 0) ystart = y; else if (y > hbound) { yend = y; break; }
				y += 10;
			}
		}
	}
	if (!ybound) ystart = 0;
	if (yextra) yend = h;

	y = 100; // replace with the desired x-coordinate
	let xstart = -1, xend = -1;
	for (x = 0; x < w; x++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;
		var red = pix[0]; var green = pix[1]; var blue = pix[2];
		if (green < 100 && blue < 100) if (xstart < 0) xstart = x; else if (x > wbound) { xend = x; break; }
	}
	if (!xbound) xstart = 0;
	if (!xendbd) xend = w;
	// console.log('fromto:',xstart,xend);
	return [xstart + 2, ystart + 2, xend - 1, yend - 2];
}
function weiterImagePresent(name, color, idx, rot) {

	// Get the pixel color at coordinates (x, y)
	var x = 100; // replace with the desired x-coordinate
	let ystart = -1, yend = -1, y;
	for (y = 0; y < h; y++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;

		//console.log('pixelData',y, pix[0], pix[1], pix[2]); //Array.from(pixelData).map(x=>console.log(x));
		var red = pix[0]; var green = pix[1]; var blue = pix[2];

		if (green < 100 && blue < 100) if (ystart < 0) ystart = y; else if (y > 170) { yend = y; break; }


		// Display the color in the console
		//console.log('Pixel color at (' + x + ',' + y + '): RGB(' + red + ',' + green + ',' + blue + ')');
	}
	console.log('fromto:', ystart, yend)

	y = 100; // replace with the desired x-coordinate
	let xstart = -1, xend = -1;
	for (x = 0; x < w; x++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;

		//console.log('pixelData',y, pix[0], pix[1], pix[2]); //Array.from(pixelData).map(x=>console.log(x));
		var red = pix[0]; var green = pix[1]; var blue = pix[2];

		if (green < 100 && blue < 100) if (xstart < 0) xstart = x; else if (x > 280) { xend = x; break; }


		// Display the color in the console
		//console.log('Pixel color at (' + x + ',' + y + '): RGB(' + red + ',' + green + ',' + blue + ')');
	}
	console.log('fromto:', xstart, xend);

	//ohne rotation!
	// [w,h]=[xend-xstart,yend-ystart];
	// console.log('xstart='+xstart,'xend='+xend,'ystart='+ystart,'yend='+yend,'w='+w,'h='+h)
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: w, height: h });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, -xstart, -ystart); //, w,h); //, 0,0,w,h); //,w,h);

}
function toCanvasDraw(img, xstart, xend, ystart, yend) {
	//ohne rotation!
	[w, h] = [xend - xstart, yend - ystart];
	console.log('xstart=' + xstart, 'xend=' + xend, 'ystart=' + ystart, 'yend=' + yend, 'w=' + w, 'h=' + h)
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: w, height: h });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, xstart, ystart, w, h, 0, 0, w, h); //,w,h);

}
function calcBoundsX(ctx, y, w, n = 243) {
	let xstart = -1, xend = -1, x, countlines = 0, prevx = [], xmin = 0, wbound = w - 20;
	let isRotated = false;
	let x1, x2;
	let gotit = false;


	for (x = xmin; x < w; x++) {
		if (gotit) {
			let wt = isPixWhiteOrTransparent(ctx, x, y);

			if (wt) return [xstart, x1, x2, x - 1, isRotated, prevx];
		}
		if (isPixDark(ctx, x, y)) {
			if (isDarkBar(ctx, x, y, w, x < w / 2, x > w / 2)) {

				if (gotit) {
					console.log('====>y', x)
					return [xstart, x1, x2, x, isRotated];
				}

				ctx.fillStyle = 'black';
				let xother = null;
				for (const px of prevx) {
					let dx = x - px;
					// console.log('dy', dy)
					if (dx > n - 3 && dx < n + 3) {
						gotit = true;
						isRotated = true;
						x1 = xother = px;
						x2 = x;
						console.log('BINGO!!!! zweites middle ding');
						ctx.fillStyle = 'red';
					}
				}
				prevx.push(x);
				// console.log('______', countlines++, y);
				ctx.fillRect(x - 2, y - 2, 5, 5);
				if (xother) {
					ctx.fillRect(xother - 2, y - 2, 5, 5);
					let i1 = prevx.indexOf(x1);
					xstart = i1 == 0 ? 0 : prevx[i1 - 1];
				}

				// if (ystart < 0) ystart = y; else if (y > hbound) { yend = y; break; }
				x++;
			}
		}
		if (prevx.length >= 7) {
			//if (pixShow(ctx,x,y)){console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');prevx.push(x);}
			if (isPixDark(ctx, x, y)) {
				console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
				prevx.push(x);
				pixShow(ctx, x, y)
			}
		}
	}
	return [xstart, x1, x2, w, isRotated, prevx];
}
async function natModCard(name, color, idx, dims) { //}, rot, ybound, xbound, yextra, xendbd) {
	let path = `../assets/games/nations/cards/${name}`; //.jpg`;
	let dParent = toElem('dExtra');
	// let img = await imgAsync(dParent, { h: hImg, w: wImg }, { height: hImg, width: wImg, src: path, tag: 'img', id: 'img' + idx })
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height];
	//console.log(w, h);

	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, w, h);

	let [xstart, ystart, xend, yend, isRotated] = [0, 0, w, h, false];
	let y1, y2, x1, x2, prevy, prevx;
	let resy = [ystart, y1, y2, yend, isRotated, prevy] = calcBoundsY(ctx, dims.dx, h, 261);
	console.log('resY', resy)

	let resx = [xstart, x1, x2, xend, prevx, rot] = allDarkPoints(ctx, w, dims); //return;
	console.log('resX', resx)
	//let resx=[xstart,x1,x2,xend,isRotated,prevx]=calcBoundsX(ctx, 80, w, 243);

	//console.log('bounds X',resx)

	// console.log('xstart=' + xstart, 'xend=' + xend, 'ystart=' + ystart, 'yend=' + yend, 'w=' + w, 'h=' + h)
	let [wsmall, hsmall] = [xend - xstart, yend - ystart + 1];
	console.log('wsmall', wsmall, 'hsmall', hsmall)
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, -xstart, -ystart, w, h);

	//let border=10;
	//let [w2, h2] = [wsmall + 2 * border, hsmall + 2 * border]
	// let cv2 = mDom('dMain', { 'box-shadow':`inset 0 0 10px 20px red`,border: `${color} solid 10px`, rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
	// let cv2 = mDom('dMain', { box:true, border:'10px solid yellow', rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
	let cv2 = mDom('dMain', {}, { tag: 'canvas', id: `cv${name}`, width: wsmall, height: hsmall });
	let ct2 = cv2.getContext('2d');
	ct2.drawImage(img, -xstart, -ystart, w, h);
	//drawRoundedRect(ct2,0,0,wsmall,hsmall,12,color,null,20);
	ct2.strokeStyle = color;
	ct2.lineWidth = 20;
	ct2.rect(0, 0, wsmall, hsmall);
	ct2.stroke();

	return cv2;

	//next: draw rotated!

}
function allDarkPoints(ctx, w, dims) {
	let [y,xmin,top,bot]=[dims.y,dims.xmin,dims.top,dims.bot];
	let xlist = [];
	for (let x = 0; x < w; x++) {
		if (isPixDark(ctx, x, y)) {
			//drawPix(ctx, x, y, 'red');
			xlist.push(x);
		}
	}
	let n = 243;xmin=120;
	console.log('list', xlist);
	//xlist.map(x => { drawPix(ctx, x, y, 'red', 2) });
	let diffs=[];
	//xlist.map(x => { console.log('===>', x); drawPix(ctx, x, y, 'red') });
	for (let i = 0; i < xlist.length - 1; i++) {
		if (xlist[i] < xmin) continue;
		if (isLightBefore(ctx,xlist[i],y)) {console.log('YES!',xlist[i])} else {console.log('NO',xlist[i]);continue;}
		for (let j = i + 1; j < xlist.length; j++) {
			let pix = xlist[j];
			assertion(isPixDark(ctx, pix, y));
			//test ob nach diesem pix mindestens 1 aus 3 light ist! sonst nehm ich den NICHT!
			//let light = false; for (let p = pix; p < pix + 3; p++) if (isPixLight(ctx, p, y)) light = true; if (!light) continue;
			if (isLightAfter(ctx,pix,y)) {console.log('YES!',pix)} else {console.log('NO',pix);continue;}

			let d = xlist[j] - xlist[i];
			diffs.push({i:i,j:j,d:d})
			console.log('d', xlist[i], xlist[j], d)
			if (d >= n - 2 && d <= n + 2) { //} 243){
				console.log('BINGO!!!!!!!!!!!!!!!!!!!', xlist[i], xlist[y], y)
				let doben = xlist[i] - xlist[i - 1]; console.log('doben=' + doben)
				let dunten = arrLast(xlist) - xlist[j]; console.log('dunten=' + dunten)

				let test90 = pixTest90(ctx, y, xlist[i] - top, xlist[j] + bot);
				rot = test90 ? 90 : -90;
				xstart = test90 ? xlist[i] - top : xlist[i] - bot;
				xend = test90 ? xlist[j] + bot : xlist[j] + top;

				drawPix(ctx, xlist[i], y, 'green')
				drawPix(ctx, xlist[j], y, 'green')
				return [xstart, xlist[i], xlist[j], xend, xlist, rot]
			}
		}
	}
	console.log('diffs',diffs)
	return [0, 0, w, w, xlist, 0];
}

function calcBoundsH(ctx, x, h, n=261) {
	let ystart = -1, yend = -1, y, countlines = 0, prevy = [], ymin = 0, hbound=h-20;
	let isRotated = false;

	for (y = ymin; y < h; y++) {
		if (isPixDark(ctx, x, y)) {
			if (isDarkLine(ctx,x,y,h, y<h/2,y>h/2)){
				ctx.fillStyle = 'black';
				yother=null;
				for (const py of prevy) {
					let dy = y - py;
					// console.log('dy', dy)
					if (dy > n-3 && dy < n+3) { isRotated=true; yother=py; console.log('BINGO!!!! zweites middle ding'); ctx.fillStyle = 'red'; }
				}
				prevy.push(y);
				// console.log('______', countlines++, y);
				ctx.fillRect(x - 2, y - 2, 5, 5);
				if (yother) ctx.fillRect(x - 2, yother - 2, 5, 5);

				if (ystart < 0) ystart = y; else if (y > hbound) { yend = y; break; }
				y += 10;
			}
		}
	}
	return [ystart,yend,isRotated];
}
async function present(name, color, idx, rot, ybound, xbound, yextra, xendbd) {
	let path = `../assets/games/nations/cards/${name}.jpg`;
	let [hImg, wImg, border, diff] = [rot ? 200 : 300, rot ? 300 : 200, 10, 10];
	// let img = await imgAsync(document.body, { position: 'absolute', top: '70vh', h: hImg, w: wImg }, { height: hImg, width: wImg, src: path, tag: 'img', id: 'img' + idx })
	let dParent = toElem('dExtra');

	let img = await imgAsync(dParent, { h: hImg, w: wImg }, { height: hImg, width: wImg, src: path, tag: 'img', id: 'img' + idx })
	//mClear(dParent);
	let [w, h] = [img.width, img.height];
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, w, h);//ctx.drawImage(img, -13,-2,w,h);

	// let [xstart, ystart, xend, yend] = calcRealBoundaries(ctx, w, h, ybound, xbound, yextra, xendbd);
	let [xstart, ystart, xend, yend, isRotated] = [0,0,w,h,false]; //calcRealBoundaries(ctx, w, h, ybound, xbound, yextra, xendbd);
	[ystart,yend,isRotated]=calcBoundsH(ctx,150,h);
	console.log('isRotated',isRotated)

	console.log('xstart=' + xstart, 'xend=' + xend, 'ystart=' + ystart, 'yend=' + yend, 'w=' + w, 'h=' + h)
	return;
	let [wsmall, hsmall] = [xend - xstart + 1, yend - ystart + 1];
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, -xstart, -ystart, w, h);

	//let border=10;
	//let [w2, h2] = [wsmall + 2 * border, hsmall + 2 * border]
	let cv2 = mDom('dMain', { border: `${color} solid 10px`, rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
	let ct2 = cv2.getContext('2d');
	ct2.drawImage(img, -xstart, -ystart, w, h);



}
async function present(name, color, idx, rot, ybound, xbound,yextra,xendbd) {
	let path = `../assets/games/nations/cards/${name}.jpg`;
	let [hImg, wImg, border, diff] = [rot?200:300, rot?300:200, 10, 10];
	// let img = await imgAsync(document.body, { position: 'absolute', top: '70vh', h: hImg, w: wImg }, { height: hImg, width: wImg, src: path, tag: 'img', id: 'img' + idx })
	let dParent = toElem('dExtra');

	let img = await imgAsync(dParent, { h: hImg, w: wImg }, { height: hImg, width: wImg, src: path, tag: 'img', id: 'img' + idx })
	//mClear(dParent);
	let [w, h] = [img.width, img.height];
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, w, h);//ctx.drawImage(img, -13,-2,w,h);

	let [xstart, ystart, xend, yend] = calcRealBoundaries(ctx, w, h, ybound,xbound,yextra,xendbd);
	console.log('xstart=' + xstart, 'xend=' + xend, 'ystart=' + ystart, 'yend=' + yend, 'w=' + w, 'h=' + h)
	let [wsmall, hsmall] = [xend - xstart + 1, yend - ystart +1];
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, -xstart, -ystart, w, h);

	//let border=10;
	//let [w2, h2] = [wsmall + 2 * border, hsmall + 2 * border]
	let cv2 = mDom('dMain', { border: `${color} solid 10px`, rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
	let ct2 = cv2.getContext('2d');
	ct2.drawImage(img, -xstart, -ystart, w, h);



}
function calcRealBoundaries(ctx, w, h, ybound = true, xbound = true,yextra=false,xendbd=true) {
	var x = 150; // replace with the desired x-coordinate
	let ystart = -1, yend = -1, y;
	let hbound = ybound?h-20:h-35;
	let wbound = xbound?w-20:w-35;
	let ymin=yextra?10:0;
	if (yextra) hbound+=10;
	let countlines=0;
	let prevy=[];

	console.log('ymin',ymin)
	for (y = ymin; y < h; y++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;
		var red = pix[0]; var green = pix[1]; var blue = pix[2];

		if (green < 100 && blue < 100) { 

			let almost1=false,almost2=false;

			//almost1 wird gebraucht wenn
			for(let yy=Math.max(0,y-3);yy<y;yy++){ //Math.min(y+5,h);yy++)	{
				let p=ctx.getImageData(x, yy, 1, 1).data;
				if (p[0]+p[1]+p[2] > 520) almost1=true;
				// console.log(p[0],p[1],p[2]);
			}
			for(let yy=y+1;yy<Math.min(y+5,h);yy++){ //Math.min(y+5,h);yy++)	{
				let p=ctx.getImageData(x, yy, 1, 1).data;
				if (p[0]+p[1]+p[2] > 520) almost2=true;
				// console.log(p[0],p[1],p[2]);
			}

			if (almost1 && almost2) {
				ctx.fillStyle = 'black'
				for(const py of prevy){
					let dy=y-py;
					console.log('dy',dy)
					if (dy>152 && dy<158) {console.log('BINGO!!!! zweites middle ding'); ctx.fillStyle='red';} 
				}
				prevy.push(y); 
				console.log('______',countlines++,y);
				ctx.fillRect(x-2,y-2,5,5);
				if (ystart < 0) ystart = y; else if (y > hbound) { yend = y; break; } 
				y+=10;
			}
		}
	}
	if (!ybound) ystart = 0;
	if (yextra) yend = h;

	y = 100; // replace with the desired x-coordinate
	let xstart = -1, xend = -1;
	for (x = 0; x < w; x++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;
		var red = pix[0]; var green = pix[1]; var blue = pix[2];
		if (green < 100 && blue < 100) if (xstart < 0) xstart = x; else if (x > wbound) { xend = x; break; }
	}
	if (!xbound) xstart = 0;
	if (!xendbd) xend = w;
	// console.log('fromto:',xstart,xend);
	return [xstart + 2, ystart + 2, xend - 1, yend - 2];
}
function weiterImagePresent(name, color, idx, rot) {

	// Get the pixel color at coordinates (x, y)
	var x = 100; // replace with the desired x-coordinate
	let ystart = -1, yend = -1, y;
	for (y = 0; y < h; y++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;

		//console.log('pixelData',y, pix[0], pix[1], pix[2]); //Array.from(pixelData).map(x=>console.log(x));
		var red = pix[0]; var green = pix[1]; var blue = pix[2];

		if (green < 100 && blue < 100) if (ystart < 0) ystart = y; else if (y > 170) { yend = y; break; }


		// Display the color in the console
		//console.log('Pixel color at (' + x + ',' + y + '): RGB(' + red + ',' + green + ',' + blue + ')');
	}
	console.log('fromto:', ystart, yend)

	y = 100; // replace with the desired x-coordinate
	let xstart = -1, xend = -1;
	for (x = 0; x < w; x++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;

		//console.log('pixelData',y, pix[0], pix[1], pix[2]); //Array.from(pixelData).map(x=>console.log(x));
		var red = pix[0]; var green = pix[1]; var blue = pix[2];

		if (green < 100 && blue < 100) if (xstart < 0) xstart = x; else if (x > 280) { xend = x; break; }


		// Display the color in the console
		//console.log('Pixel color at (' + x + ',' + y + '): RGB(' + red + ',' + green + ',' + blue + ')');
	}
	console.log('fromto:', xstart, xend);

	//ohne rotation!
	// [w,h]=[xend-xstart,yend-ystart];
	// console.log('xstart='+xstart,'xend='+xend,'ystart='+ystart,'yend='+yend,'w='+w,'h='+h)
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: w, height: h });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, -xstart, -ystart); //, w,h); //, 0,0,w,h); //,w,h);

}
function toCanvasDraw(img, xstart, xend, ystart, yend) {
	//ohne rotation!
	[w, h] = [xend - xstart, yend - ystart];
	console.log('xstart=' + xstart, 'xend=' + xend, 'ystart=' + ystart, 'yend=' + yend, 'w=' + w, 'h=' + h)
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: w, height: h });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, xstart, ystart, w, h, 0, 0, w, h); //,w,h);

}
//#endregion

//#region imgSplit
async function splitImageH(inputImagePath, outputDirectory) {
	const image = await loadImage(inputImagePath);
	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);

	let columnIndex = 0;
	let startX = 0;
	let endX = 0;
	let isPart = false;

	for (let x = 0; x < canvas.width; x++) {
			let hasNonWhitePixel = false;
			for (let y = 0; y < canvas.height; y++) {
					const pixelData = ctx.getImageData(x, y, 1, 1).data;
					if (pixelData[3] !== 0 && pixelData[0] !== 255 && pixelData[1] !== 255 && pixelData[2] !== 255) {
							hasNonWhitePixel = true;
							break;
					}
			}

			if (hasNonWhitePixel) {
					if (!isPart) {
							startX = x;
					}
					isPart = true;
			} else {
					if (isPart) {
							endX = x;
							const partCanvas = createCanvas(endX - startX, canvas.height);
							const partCtx = partCanvas.getContext('2d');
							partCtx.drawImage(canvas, startX, 0, endX - startX, canvas.height, 0, 0, endX - startX, canvas.height);

							const partFileName = `${outputDirectory}/part${columnIndex}.png`;
							fs.writeFileSync(partFileName, partCanvas.toBuffer());
							console.log(`Part ${columnIndex} saved as ${partFileName}`);

							columnIndex++;
					}
					isPart = false;
			}
	}
}


function getImageBoundariesX(ctx,fromx, maxx){
	let x=fromx;
	let from,to;
	while(isWhitePixel(ctx,x,0)) x++;
	from=x; //first non-white pixel
	while(!isWhitePixel(ctx,x,0)) x++;
	to=x; //first white pixel
	return {from,to};
}

async function splitImageH(inputImagePath, outputDirectory) {
	const image = await loadImage(inputImagePath);
	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
	//now save this column fromx tox into new image!
	let x=0, maxx=image.width, iPart=0;
	while(x<maxx){
		let bd=getImageBoundariesX(ctx,x,maxx);
		console.log('bd',bd);
		let w=bd.to-bd.from;
		if (w > 5) {
			iPart++;
			const partCanvas = createCanvas(w, canvas.height);
			const partCtx = partCanvas.getContext('2d');
			partCtx.drawImage(canvas, bd.from, 0, w, canvas.height, 0, 0, w, canvas.height);

			const partFileName = `${outputDirectory}/part${iPart}.png`;
			fs.writeFileSync(partFileName, partCanvas.toBuffer());
			console.log(`Part ${iPart} saved as ${partFileName}`);
		}
		x=bd.to;
	}
}
async function splitImageY(inputImagePath, outputDirectory,xPart) {
	const image = await loadImage(inputImagePath);
	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
	//now save this column fromx tox into new image!
	let x=0, maxx=image.height, iPart=0;
	while(x<maxx){
		let bd=getImageBoundariesY(ctx,x,maxx);
		console.log('bd',bd);
		let h=bd.to-bd.from;
		if (h > 5) {
			iPart++;
			const partCanvas = createCanvas(canvas.width, h);
			const partCtx = partCanvas.getContext('2d');
			partCtx.drawImage(canvas, bd.from, 0, canvas.width, h, 0, 0, canvas.width, h);

			const partFileName = `${outputDirectory}/part${xPart}${iPart}.png`;
			fs.writeFileSync(partFileName, partCanvas.toBuffer());
			console.log(`Part ${iPart} saved as ${partFileName}`);
		}
		x=bd.to;
	}
}

function mist() {
	let pix = ctx.getImageData(0, 0, 1, 1).data; console.log('pix', pix, pix[0]);

	let x = 0;


	for (let x = 0; x < canvas.width; x++) {
		pix = ctx.getImageData(x, 0, 1, 1).data;
		if (pix[0] + pix[1] + pix[2] > 740) {

			//split at this x
			//first look for x that is the end of this whitespace

		}
		return;
	}

	for (let x = 0; x < canvas.width; x++) {
		let hasNonWhitePixel = false;
		for (let y = 0; y < canvas.height; y++) {
			const pixelData = ctx.getImageData(x, y, 1, 1).data;
			console.log('pixelData', pixelData);
			if (pixelData[3] !== 0 && pixelData[0] !== 255 && pixelData[1] !== 255 && pixelData[2] !== 255) {
				hasNonWhitePixel = true;
				break;
			}
		}

		if (hasNonWhitePixel) {
			if (!isPart) {
				startX = x;
			}
			isPart = true;
		} else {
			if (isPart) {
				endX = x;
				const partCanvas = createCanvas(endX - startX, canvas.height);
				const partCtx = partCanvas.getContext('2d');
				partCtx.drawImage(canvas, startX, 0, endX - startX, canvas.height, 0, 0, endX - startX, canvas.height);

				const partFileName = `${outputDirectory}/part${columnIndex}.png`;
				fs.writeFileSync(partFileName, partCanvas.toBuffer());
				console.log(`Part ${columnIndex} saved as ${partFileName}`);

				columnIndex++;
			}
			isPart = false;
		}
	}
}

//#endregion

//#region m
function measureElement(el) {
  let info = window.getComputedStyle(el, null);
	return {w:info.width,h:info.height};
}
function measureHeight(dParent,styles={}){
	let d=mDom(dParent,styles,{html:'Hql'});
	let s=measureElement(d);
	d.remove();
	return s.height;
}
function uiTypeEvent(dParent,o){
	Items[o.id]=o;
	//console.log('hallo!')
	//ui=mDom(dParent,{w:'100%',h:12,bg:'red'});
	let fz=12;
	let d=mDom(dParent,{fz:fz},{html:'Hql'});
	let s=measureElement(d);
	d.remove();
	console.log('s',s)
	let h=s.h;

	// let size=measureText('Hql',measureTextX('Hql',{fz:fz});
	// console.log(size);
	let ui=mDom(dParent,{w:'100%',fz:fz,h:h,bg:'red'},{html:rWord()});


	return ui;
}
function openPopup(ev) {
  // Create the popup div
  let popup = document.createElement('div');

	let defStyle = {padding:25,bg:'white',fg:'black',zIndex:1000,rounding:12,position:'fixed',boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',wmin:300,hmin:200,border: '1px solid #ccc',};
	mStyle(popup,defStyle);

	//do whatever inside of popup
	popup.innerHTML = 'hallo das ist ein schoenes kleines popup window!'
	
	//mStyle(popup,{box:true,top:'50%',left:'50%',transform: 'translate(-50%, -50%)'}); //position centered

	let [w,h]=[popup.offsetWidth,popup.offsetHeight];
	mStyle(popup,{left:ev.clientX-w/2,top:ev.clientY-h / 2});

	mButtonX(popup,25,4);
  document.body.appendChild(popup);
	return popup;
}
function ____mButtonX(dParent, handler, pos = 'tr', sz = 25, color = 'white') {
	// let d2 = mDiv(dParent, { fg: color, w: sz, h: sz, cursor: 'pointer' }, null, `<i class="fa fa-times" style="font-size:${sz}px;"></i>`, 'btnX');
	let d2 = mDom(dParent, { fg: color, w: sz, h: sz, cursor: 'pointer' });
	showImage('times', d2, { fg: color })
	mPlace(d2, pos, 2);
	d2.onclick = handler;
	return d2;
}
//#endregion

//#region Navbar
function _extra1() {
	let ui = mDom(dParent, { display: 'flex', 'flex-wrap': 'wrap', 'align-items': 'center', 'justify-content': 'space-between' });
	mStyle(ui, { 'flex-flow': 'row nowrap' });
	mClass(dParent, 'nav');
	let d1 = mDom(ui, { display: 'flex', 'align-items': 'center', gap: 12 });
	let title = mDom(d1, { fz: 20 }, { html: pageTitle, classes: 'title' });
	let d2 = mDom(d1);
	for (let i = 0; i < titles.length; i++) {
		let d3 = mDom(d2, { display: 'inline-block' }, { html: `<a class="nav-link" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>` })
	}
	return ui;
}
function extra1() {
	let ui = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
	mClass(dParent, 'nav');
	let stflex={display:'flex','align-items': 'center'};
	let [dl,dr]=[mDom(ui,stflex),mDom(ui,stflex)]; 
	//let d1 = mDom(dl, { display: 'flex', 'align-items': 'center', gap: 12 });
	let title = mDom(dl, { fz: 20 }, { html: pageTitle, classes: 'title' });
	let d2 = mDom(dl);
	for (let i = 0; i < titles.length; i++) {
		let d3 = mDom(d2, { display: 'inline-block' }, { html: `<a class="nav-link" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>` })
	}
	return ui;
}
var ui = extra1();

function mNavbar(dParent, styles, pageTitle, titles, funcNames) {
  if (nundef(funcNames)) {
    funcNames = titles.map(x => `onclick${capitalize(x)}`);
  }
  function activate(ev) {
    closeApps();
    let links = document.getElementsByClassName('nav-link');
    let inner = isString(ev) ? ev : ev.target.innerHTML;
    for (const el of links) {
      if (el.innerHTML == inner) mClass(el, 'active');
      else mClassRemove(el, 'active');
    }
  }
  function disable() {
    let links = Array.from(document.getElementsByClassName('nav-link'));
    for (const w of arguments) {
      let el = links.find(x => x.innerHTML == w);
      if (isdef(el)) mClass(el, 'disabled');
    }
  }
  function enable() {
    let links = document.getElementsByClassName('nav-link');
    for (const w of arguments) {
      let el = links.find(x => x.innerHTML == w);
      if (isdef(el)) mClassRemove(el, 'disabled');
    }
  }
  function isThemeLight() { return !U || U.theme == 'light' ? true : false; }
  function _extra1() {
    let ui = mDom(dParent, { display: 'flex', 'flex-wrap': 'wrap', 'align-items': 'center', 'justify-content': 'space-between' });
    mStyle(ui, { 'flex-flow': 'row nowrap' });
    mClass(dParent, 'nav');
    let d1 = mDom(ui, { display: 'flex', 'align-items': 'center', gap: 12 });
    let title = mDom(d1, { fz: 20 }, { html: pageTitle, classes: 'title' });
    let d2 = mDom(d1);
    for (let i = 0; i < titles.length; i++) {
      let d3 = mDom(d2, { display: 'inline-block' }, { html: `<a class="nav-link" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>` })
    }
    return ui;
  }
  function extra1() {
    let ui = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
    mClass(dParent, 'nav');
    let stflex={display:'flex','align-items': 'center'};
    let [dl,dr]=[mDom(ui,stflex),mDom(ui,stflex)]; 
    //let d1 = mDom(dl, { display: 'flex', 'align-items': 'center', gap: 12 });
    let title = mDom(dl, { fz: 20 }, { html: pageTitle, classes: 'title' });
    let d2 = mDom(dl);
    for (let i = 0; i < titles.length; i++) {
      let d3 = mDom(d2, { display: 'inline-block' }, { html: `<a class="nav-link" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>` })
    }
    return ui;
  }
  var ui = extra1();
  return { activate: activate, disable: disable, enable: enable, isThemeLight: isThemeLight, ui: ui };
}

async function prelims() {
	if (nundef(M.superdi)) {
		Serverdata = await mGetRoute('session'); //hier wird gesamte session geladen!!!
		await loadCollections();
		loadPlayerColors();

		// let navlinks =['add', 'play', 'schedule', 'view', 'colors']
		// let funcNames = titles.map(x => `onclick${capitalize(x)}`);
		
		let nav = UI.nav = mNavbar('dNav', {}, 'COMBU', ['add', 'play', 'schedule', 'view', 'colors']);

		console.log('nav',nav)
		nav.disable('play');

		dUser = mDom(nav.ui, {}, { id: 'dUser' });

		let dt=iDiv(nav);
		console.log('dt',dt)
		let t1=toggleAdd('left','arrow_down_long',dt,{hpadding:9,vpadding:5},{w:0,wmin:0},{wmin:100});
		mInsert(dt.firstChild,t1.button,0)
		let t2=toggleAdd('right','arrow_down_long',dt, {hpadding:9,vpadding:5},{w:0},{w:300});
		//mInsert(dt,t2.button,0)
		// let t2=toggleAdd('right','arrow_right_long',{w:0},{w:300});

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })


		let uname = localStorage.getItem('username');
		//console.log('uname',uname)
		if (isdef(uname)) U = await getUser(uname);
		await showUser(uname);

		let server = getServerurl();
		Socket = io(server);
		Socket.on('message', showChatMessage);
		Socket.on('disconnect', x => console.log('>>disconnect:', x));
		Socket.on('update', x => console.log('>>update:', x));
	
		showChatWindow();

		//let d=mBy('dToolbar');mFlex(d);mStyle('dToolbar',{gap:12});
		// let t1=toggleAdd(UI.nav,'left','arrow_left_long',{w:0,wmin:0},{wmin:100});
		// let t2=toggleAdd('right','arrow_right_long',{w:0},{w:300});
	
	}
}
function mNavbar_old(dParent, styles, pageTitle, titles, funcNames) {
  //da wollt ich noch icons und iconfuncs dazutun!
  if (nundef(funcNames)) {
    //standard is that funcs are named: onclick${title}
    funcNames = titles.map(x => `onclick${capitalize(x)}`);
  }
  function activate(ev) {
    //currently selected menu button
    let links = document.getElementsByClassName('nav-link');
    //console.log('links',links)
    let inner = ev.target.innerHTML;
    for (const el of links) {
      if (el.innerHTML == inner) mClass(el, 'active');
      else mClassRemove(el, 'active');
    }
  }
  function disable() {
    let links = Array.from(document.getElementsByClassName('nav-link'));
    for (const w of arguments) {
      let el = links.find(x => x.innerHTML == w);
      if (isdef(el)) mClass(el, 'disabled');
    }
  }
  function enable() {
    let links = document.getElementsByClassName('nav-link');
    for (const w of arguments) {
      let el = links.find(x => x.innerHTML == w);
      if (isdef(el)) mClassRemove(el, 'disabled');
      //if (isdef(el)) { mClass(el, 'active'); el.style.pointerEvents = 'auto' }
    }
  }
  function extra() {
    let html = `
      <div class="navbar-expand">
        <a class="navbar-brand a" href="#">${pageTitle}</a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">`;
    for (let i = 0; i < titles.length; i++) {
      html += `
          <li>
            <a class="nav-link" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>
          </li>
        `;
    }
    html += `
        </ul>
        </div>
      </div>
      `;
    //let inner = document.body.innerHTML;
    let x=mCreateFrom(html);
    mAppend('dNav_old',x);
    var ui = x; // mInsertFirst(document.body, mCreateFrom(html));
    mStyle(ui, styles); //'#ffffffe0' });
    return ui;
    //document.body.insertAdjacentElement(0,mCreateFrom(html)); //innerHTML += html + inner;
  }
  var ui = extra();
  mStyle(ui, { display: 'flex', 'flex-wrap': 'wrap', 'align-items': 'center', 'justify-content': 'space-between' });
  return { activate: activate, disable: disable, enable: enable, ui: ui };
}
function mNavbar(styles,pageTitle, titles, funcNames) {
	//da wollt ich noch icons und iconfuncs dazutun!
	if (nundef(funcNames)) {
		//standard is that funcs are named: onclick${title}
		funcNames = titles.map(x => `onclick${capitalize(x)}`);
	}

	function activate(ev) {
		let links = document.getElementsByClassName('nav-link');
		//console.log('links',links)
		let inner = ev.target.innerHTML;
		for (const el of links) {
			if (el.innerHTML == inner) mClass(el, 'active');
			else mClassRemove(el, 'active');
		}
	}
	function disable() {
		let links = Array.from(document.getElementsByClassName('nav-link'));
		for (const w of arguments) {
			let el = links.find(x => x.innerHTML == w);
			//console.log('el',el)
			if (isdef(el)) mClass(el, 'disabled');
		}
	}
	function enable() {
		let links = document.getElementsByClassName('nav-link');
		for (const w of arguments) {
			let el = links.find(x => x.innerHTML == w);
			if (isdef(el)) {
				mClass(el, 'active');
				el.style.pointerEvents = 'auto'
			}
		}
	}

	let html = `
    <nav class="navbar navbar-expand" id="dNav">
      <a class="navbar-brand a" href="#">${pageTitle}</a>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">`;
	for (let i = 0; i < titles.length; i++) {
		html += `
				<li>
					<a class="nav-link" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>
				</li>
			`;
	}
	html += `
			</ul>
			</div>
		</nav>
		`;
	//let inner = document.body.innerHTML;
	var ui = mInsertFirst(document.body, mCreateFrom(html));
	mStyle(ui, styles); //'#ffffffe0' });
	//document.body.insertAdjacentElement(0,mCreateFrom(html)); //innerHTML += html + inner;
	return { activate: activate, disable: disable, enable: enable, ui: ui };
}
function showNavbar(pageTitle, titles, funcNames) {
	if (nundef(funcNames)) {
		//standard is that funcs are named: onclick${title}
		funcNames = titles.map(x => `onclick${capitalize(x)}`);
	}

	function activate(ev){
		let links = document.getElementsByClassName('nav-link');
		//console.log('links',links)
		let inner = ev.target.innerHTML;
		for(const el of links){
			if (el.innerHTML == inner) mClass(el, 'active');
			else mClassRemove(el,'active');
		}
	}
	function disable(){
		let links = Array.from(document.getElementsByClassName('nav-link'));
		for (const w of arguments) {
			let el = links.find(x => x.innerHTML == w);
			//console.log('el',el)
			if (isdef(el)) mClass(el, 'disabled');
		}
	}
	function enable(){
		let links = document.getElementsByClassName('nav-link');
		for (const w of arguments) {
			let el = links.find(x => x.innerHTML == w);
			if (isdef(el)) {
				mClass(el, 'active');
				el.style.pointerEvents = 'auto'
			}
		}
	}
	
	let html = `
    <nav class="navbar navbar-expand navbar-light bg-light">
      <a class="navbar-brand a" href="#">${pageTitle}</a>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">`;
	for (let i = 0; i < titles.length; i++) {
		html += `
				<li class="nav-item">
					<a class="nav-link a" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>
				</li>
			`;
	}
	html += `
			</ul>
			</div>
      <div style="align-self:end" >
				<ul class="navbar-nav mr-auto">
					<li class="nav-item">
						<a class="nav-link a" href="#" onclick="UI.nav.activate(event);">HALLO</a>
					</li>
				</ul>
			</div>
		</nav>
		`;
	//let inner = document.body.innerHTML;
	var ui = mInsertFirst(document.body, mCreateFrom(html));
	//document.body.insertAdjacentElement(0,mCreateFrom(html)); //innerHTML += html + inner;
	return {activate:activate,disable:disable,enable:enable,ui:ui};
}

function showNavbar(pageTitle, titles, funcNames) {
	if (nundef(funcNames)) {
		//standard is that funcs are named: onclick${title}
		funcNames = titles.map(x => `onclick${capitalize(x)}`);
	}
	let html = `
    <nav class="navbar navbar-expand navbar-light bg-light">
      <a class="navbar-brand a" href="#">${pageTitle}</a>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">`;
	for (let i = 0; i < titles.length; i++) {
		// html += `
		// 		<li class="nav-item active">
		// 			<a class="nav-link hoverHue a" href="#" onclick="${funcNames[i]}()">${titles[i]}</a>
		// 		</li>
		// 	`;
		html += `
				<li class="nav-item">
					<a class="nav-link a" href="#" onclick="${funcNames[i]}()">${titles[i]}</a>
				</li>
			`;
	}
	html += `
			</ul>
			</div>
		</nav>
		`;
	//let inner = document.body.innerHTML;
	mInsertFirst(document.body, mCreateFrom(html));
	//document.body.insertAdjacentElement(0,mCreateFrom(html)); //innerHTML += html + inner;

}
function navbarActivate() {
	let links = document.getElementsByClassName('nav-link');
	for (const w of arguments) {
		let el = links.find(x => x.innerHTML == w);
		if (isdef(el)) {
			mClass(el, 'active');
			el.style.pointerEvents = 'auto'
		}
	}
}
function navbarDeactivate() {
	let links = Array.from(document.getElementsByClassName('nav-link'));
	//console.log('links',links)
	for (const w of arguments) {
		let el = links.find(x => x.innerHTML == w);
		//console.log('el',el)
		if (isdef(el)) {
			mClassRemove(el.parentNode, 'active');
			el.style.pointerEvents = 'none'
		}
	}
}

//#endregion

//#region sidebar
function showSidebar(dParent) {
  dSidebar = mDom(dParent, { 'align-self': 'stretch', hmin: '100vh' }, { id: 'dSidebar' });
  dLeiste = mDiv(dParent);
  mStyle(dLeiste, { wmin: 70, hmin: '100vh', display: 'flex', 'flex-flow': 'column wrap' });
}

function show_sidebar(list, handler) {
	dSidebar = mBy('dSidebar'); mClear(dSidebar); mStyle(dSidebar, { w: 200, h: window.innerHeight - 68, overy: 'auto' });
	for (const k of list) {
		let d = mDiv(dSidebar, { cursor: 'pointer', wmin: 100 }, null, k, 'hop1')
		if (isdef(handler)) d.onclick = handler;
	}
}
function sidebar_belinda() {
	let html = `
		<div id="md" style="display: flex">
		<div id="sidebar" style="align-self: stretch;min-height:100vh"></div>
		<div id="rightSide">
			<div id="table" class="flexWrap"></div>
		</div>
		</div>
		`;
	function initSidebar() {
		let dParent = mBy('sidebar');
		clearElement(dParent);
		dLeiste = mDiv(dParent);
		mStyle(dLeiste, { 'min-width': 70, 'max-height': '100vh', display: 'flex', 'flex-flow': 'column wrap' });
	}
}
function sidebar_coding() {
	function test_ui_extended() {
		mClear(document.body);
		let d1 = mDom(document.body, {}, { classes: 'fullpage airport' });
		let [dl, dr] = mColFlex(d1, [7, 2]);
		for (const d of [dl, dr]) mStyle(d, { bg: rColor('blue', 'green', .5) })
		mStyle(dr, { h: '100vh', fg: 'white' })
		dSidebar = mDiv100(dr, { wmax: 240, overy: 'auto', overx: 'hidden' }, 'dSidebar'); //,{h:window.innerHeight},'dSidebar')
		dLeft = dl;
		onresize = create_left_side_extended;
		create_left_side_extended();
	}
	function show_sidebar(list, handler) {
		dSidebar = mBy('dSidebar');
		mClear(dSidebar);
		for (const k of list) {
			let d = mDiv(dSidebar, { cursor: 'pointer', wmin: 100 }, null, k, 'hop1')
			if (isdef(handler)) d.onclick = handler;
		}
	}

}

//#endregion

//#region simple image upload
async function uploadImg2(img, unique, cat, name) {
	let type = detectSessionType();
	let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
	server += `/save`;
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	const dataUrl = canvas.toDataURL('image/png');
	console.log(dataUrl);
	let o = { data: {image:dataUrl}, path: 'out.png', mode: 'wi' };

	const response = await fetch(server, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors',
		body: JSON.stringify(o)
	});
	return await response.json();
}
//#endregion

//#region image upload
async function imgtest(){
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';
	let img = await imgAsync(d,{},{tag:'img',src:path});

	// let dataUrl = imgToDataUrl(img);
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	const dataUrl = canvas.toDataURL('image/png');

	let o = { data: {image:dataUrl}, path: path, mode: 'wi' };
	let resp = await uploadJson('save',o)
	console.log('response',resp)
}
async function imgToDataUrl(src, h) {
	async function imageToDataURLAsync(src, h) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = "Anonymous"; // Enable cross-origin resource sharing (CORS) for the image
			img.onload = function () {
				// Calculate new width and height while preserving aspect ratio
				const aspectRatio = img.width / img.height;
				const newHeight = h;
				const newWidth = aspectRatio * newHeight;
				const canvas = document.createElement('canvas');
				canvas.width = newWidth;
				canvas.height = newHeight;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, newWidth, newHeight);
				const dataUrl = canvas.toDataURL('image/png');
				resolve(dataUrl);
			};
			img.onerror = function (error) {
				reject(error);
			};
			img.src = src;
		});
	}

	try {
		const dataUrl = await imageToDataURLAsync(src, h);
		console.log('Image converted!'); // to dataUrl:', dataUrl);
		// Use the dataUrl as needed (e.g., display it in an image tag or send it to the server)
		return dataUrl;
	} catch (error) {
		console.error('Error converting image to dataUrl:', error);
		return null;
	}
}
async function onclickUpload() {
  let img = UI.img;
  let name = valnwhite(UI.imgName.value, rUID('img'));
  let unique = isdef(M.superdi[name]) ? rUID('img') : name;
  let cat = valnwhite(UI.imgColl.value, 'other');
  let data = await uploadImg(img, unique, cat, name);
  await updateCollections();
}

async function imgToDataUrl(src, h) {
	async function imageToDataURLAsync(src, h) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = "Anonymous"; // Enable cross-origin resource sharing (CORS) for the image
			img.onload = function () {
				// Calculate new width and height while preserving aspect ratio
				const aspectRatio = img.width / img.height;
				const newHeight = h;
				const newWidth = aspectRatio * newHeight;
				const canvas = document.createElement('canvas');
				canvas.width = newWidth;
				canvas.height = newHeight;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, newWidth, newHeight);
				const dataUrl = canvas.toDataURL('image/png');
				resolve(dataUrl);
			};
			img.onerror = function (error) {
				reject(error);
			};
			img.src = src;
		});
	}

	try {
		const dataUrl = await imageToDataURLAsync(src, h);
		console.log('Image converted!'); // to dataUrl:', dataUrl);
		// Use the dataUrl as needed (e.g., display it in an image tag or send it to the server)
		return dataUrl;
	} catch (error) {
		console.error('Error converting image to dataUrl:', error);
		return null;
	}
}
function uploadImgSync(imgElem, cat, name) {
	const canvas = document.createElement('canvas');
	canvas.width = imgElem.width;
	canvas.height = imgElem.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);
	canvas.toBlob((blob) => {
		const formData = new FormData();
		formData.append('image', blob, name + '.png');
		formData.append('category', cat);
		let url = `http://localhost:3000/upload`;
		fetch(url, {
			method: 'POST',
			mode: 'cors',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				console.log('Image uploaded successfully:', data);
			})
			.catch(error => {
				console.error('Error uploading image:', error);
			});
	});
}

async function _resizeImage(img, newHeight) { //WORKS!
	return new Promise((resolve, reject) => {
		const aspectRatio = img.width / img.height;
		const newWidth = aspectRatio * newHeight;
		const canvas = document.createElement('canvas');
		canvas.width = newWidth;
		canvas.height = newHeight;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, newWidth, newHeight);
		const resizedDataURL = canvas.toDataURL('image/png');
		img.onload = function () { resolve(); };
		img.onerror = function (error) { reject(error); };
		img.src = resizedDataURL;
	});
}
async function _resizeImage(imageElement, imageSrc, newHeight) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = function () {
			const aspectRatio = img.width / img.height;
			const newWidth = aspectRatio * newHeight;

			// Create a canvas to draw the resized image
			const canvas = document.createElement('canvas');
			canvas.width = newWidth;
			canvas.height = newHeight;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, newWidth, newHeight);

			// Convert the canvas content to data URL
			const resizedDataURL = canvas.toDataURL('image/png');

			// Set the image source to trigger the 'onload' event
			img.src = resizedDataURL;
			img.onload = function () {
				// Set the resized image data URL as the source of the image element
				imageElement.src = resizedDataURL;
				resolve();
			};
		};

		img.onerror = function (error) {
			reject(error);
		};

		// Set the image source to trigger the 'onload' event
		img.src = imageSrc;
	});
}

async function loadImageAndResize(img, src, h) {
	try {
		const imageUrl = src; // Replace with the path to your PNG image
		const targetHeight = h; // Desired height for the resized image
		await resizeImage(img, imageUrl, targetHeight);
		console.log('Image resized successfully.');
	} catch (error) {
		console.error('Error resizing image:', error);
	}
}

//***************** */
function uploadImage(imgElem, cat, name, ev) {
	const canvas = document.createElement('canvas');
	canvas.width = imgElem.width;
	canvas.height = imgElem.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);

	canvas.toBlob((blob) => {
		const formData = new FormData();
		formData.append('image', blob, name + '.png');
		formData.append('category', cat);
		formData.append('name', name);
		let url = `http://localhost:3000/upload`; //TODO: SERVERNAME!!!

		// Send form data via AJAX
		// var xhr = new XMLHttpRequest();
		// xhr.open('POST', url, true);
		// xhr.setRequestHeader('Content-Type', 'application/json');
		// xhr.withCredentials = false; //das ist cors
		// xhr.onreadystatechange = function () {
		// 	if (xhr.readyState === 4 && xhr.status === 200) {
		// 		// Handle the AJAX response here
		// 		console.log(xhr.responseText);
		// 	}
		// };
		// xhr.send(JSON.stringify(formData));

		// Send form data via fetch
		fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				ev.preventDefault();
				console.log('Image uploaded successfully:', data);
			})
			.catch(error => {
				console.error('Error uploading image:', error);
			});
	});
}


async function uploadImageToServer(dataUrl) {
	try {
		// Convert dataUrl to Blob (binary data)
		//dataUrl = 'data:image/png;base64,'+dataUrl;
		console.log('data', dataUrl.substring(0, 100))
		const blobData = await fetch(dataUrl).then(response => response.blob());

		// Create FormData object and append the Blob data
		const formData = new FormData();
		formData.append('image', blobData, 'image.png'); // 'image' is the field name on the server

		// Send POST request to the server
		const response = await fetch('http://localhost:3000/save', {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type': 'application/json', },
			body: formData,
		});

		// Handle the server response as needed
		const result = await response.json();
		console.log('Server Response:', result);
	} catch (error) {
		console.error('Error uploading image:', error);
	}
}

async function _uploadDataUrl(dataUrl) {
	console.log(dataUrl);
	const response = await fetch('http://localhost:3000/save', {
		method: 'POST',
		mode: 'cors',
		headers: { 'Content-Type': 'application/json', },
		body: JSON.stringify({ dataUrl }),
	});

	const result = await response.text();
	console.log(result);
}



//#************************************************************************************
function createImageFromDataURL(dataUrl) {
	const img = new Image();
	img.src = dataUrl;
	return img;
}

async function test1() {
	test0();
	//jetzt lade das file hoch zu nodejs
	imageToDataURLWithResizeHeight('../test0/ball1.png', 300, test1_weiter);
}
function test1_weiter(x) {
	console.log('habs gemacht!', x);


}
async function test0() {
	let d = mBy('dTest');
	mDom(d, { h: 200 }, { tag: 'img', src: '../test0/ball1.png' });
}

function imageToDataURLWithResizeHeight(src, h, callback) {
	const img = new Image();
	img.crossOrigin = "Anonymous"; // Enable cross-origin resource sharing (CORS) for the image
	img.onload = function () {
		// Calculate new width and height while preserving aspect ratio
		const aspectRatio = img.width / img.height;
		const newHeight = h;
		const newWidth = aspectRatio * newHeight;

		const canvas = mDom('dTest', {}, { tag: 'canvas', id: 'canvas1' }); // document.createElement('canvas');
		canvas.width = newWidth;
		canvas.height = newHeight;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, newWidth, newHeight);
		const dataUrl = canvas.toDataURL('image/png');
		callback(dataUrl);
	};
	img.src = src;
}

function imageToDataURL(src, callback) {
	const img = new Image();
	img.crossOrigin = "Anonymous"; // Enable cross-origin resource sharing (CORS) for the image
	img.onload = function () {
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, img.width, img.height);
		const dataUrl = canvas.toDataURL('image/png');
		callback(dataUrl);
	};
	img.src = src;
}

function imageToDataURL_(file, callback) {
	const reader = new FileReader();
	reader.onloadend = function () {
		const img = new Image();
		img.onload = function () {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, img.width, img.height);
			const dataUrl = canvas.toDataURL('image/png');
			callback(dataUrl);
		};
		img.src = reader.result;
	};
	reader.readAsDataURL(file);
}



//********************************************* */
function addTool(dParent, img, setSizeFunc) {
	let d = dParent;
	let rg = mRadioGroup(d, {}, 'rSizes', 'Crop to: '); mClass(rg, 'input')
	mRadio('manual', [0, 0], 'rSizes', rg, {}, setSizeFunc, 'rSizes', true)
	let [w, h] = [img.offsetWidth, img.offsetHeight];
	if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	else {
		//card portrait kann man auch machen: take das das nicht passt
		let [w1, h1] = [w, w / .7];
		let [w2, h2] = [h * .7, h];
		if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	}
	if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	else {
		//card portrait kann man auch machen: take das das nicht passt
		let [w1, h1] = [w, w * .7];
		let [w2, h2] = [h / .7, h];
		if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	}
	mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
	return rg;
}

async function test1() {
	//mBy('button1').addEventListener('click',saveCanvas)
	//window.onbeforeunload = function() {    return "Dude, are you sure you want to leave? Think of the kittens!";  }

	//console.log('test1.....')
	html2canvas(document.querySelector("#dTest")).then(canvas => {
		canvas.id = 'canvas1';
		document.body.appendChild(canvas);
	});

	let x = localStorage.getItem('hallo');
	if (isdef(x)) console.log(JSON.parse(x));
	// if (nundef(x))  test1(); else console.log(JSON.parse(x));
	localStorage.removeItem('hallo');
}

function onclickButton(ev) {
	// DA.TOTO=setInterval(function(){
	//   window.location.reload();
	//   window.stop();
	// },100)
	ev.preventDefault();
	let elem = mBy('canvas1');
	console.log('elem', elem);
	saveCanvas(ev);
	return false;
}

async function saveCanvas(ev) {
	ev.preventDefault();
	const canvas = document.getElementById('canvas1');
	const dataURL = canvas.toDataURL('image/png');
	const response = await fetch('http://localhost:3000/save', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ dataURL }),
	});

	const result = await response.json();
	console.log(result);
	localStorage.setItem('hallo', JSON.stringify(result));
}



//#endregion

//#region user
async function loadUserdata(uname) {
	//hier muss user reloaden! weil koennte auf anderem browser geaendert worden sein!
	let data = await mGetRoute('user',{user:uname});
	if (!data) {
		data = await postUserChange({ name: uname, color: rChoose(M.playerColors) });
		// console.log('adding new user!!!', uname);
		// data = { name: uname, color: rChoose(M.playerColors) };
		// data = await mPostRoute('postUser', data);
	} else	Serverdata.users[uname] = data;
	//console.log('data',data);
	return data;
}

async function loadUserdata_mist(){
	let data = lookup(Serverdata.session, ['users', uname]) ?? lookup(Serverdata.config, ['users', uname]);
	if (!data) {
		console.log('adding new user!!!', uname);
		data = { name: uname, color: rChoose(M.playerColors) };
		await serverUpdate('newuser', data);
	}
	assertion(data, "WTK??? userLoad!!!!!!!!!!!!!!!! " + uname);
	localStorage.setItem('username', uname);
	U = data;
	U.data = await mGetYaml(`../y/users/${uname}.yaml`);
	return U;
}

async function userLoad(uname) {
	UI.nav.activate('no')
	if (nundef(uname)) uname = localStorage.getItem('username');
	//U = null;
	//uname = null;
	if (isdef(uname) && (!U || U.name != uname)) {
		//what if the current U has unsaved data??? TODO
		let data = lookup(Serverdata.session, ['users', uname]) ?? lookup(Serverdata.config, ['users', uname]);
		if (!data) {
			console.log('adding new user!!!', uname);
			data = { name: uname, color: rChoose(M.playerColors) };
			await serverUpdate('newuser', data);
		}
		assertion(data, "WTK??? userLoad!!!!!!!!!!!!!!!! " + uname);
		localStorage.setItem('username', uname);
		U = data;
		U.data = await mGetYaml(`../y/users/${uname}.yaml`);
	}
	mClear(dUser);
	mStyle(dUser, { display: 'flex', gap: 12, valign: 'center' })

	let d;
	if (U) {
		d = mDom(dUser, { cursor: 'pointer', padding: '.5rem 1rem', rounding: '50%' }, { html: U.name, className: 'active' });
		setColors(U.color)
	} else {
		let styles = { family: 'fa6', fg: 'grey', fz: 25, cursor: 'pointer' };
		d = mDom(dUser, styles, { html: String.fromCharCode('0x' + M.superdi.user.fa6) })
	}
	d.onclick = onclickUser;
}
function showUser() {
	mClear(dUser);
	//mCenterCenterFlex(dUser); //, bg:'red', 'align-self': 'end' , 'justify-self':'center'},{id:'dUser'});
	mStyle(dUser, { display: 'flex', gap: 12, valign: 'center' })

	let d;
	if (U) {
		d = mDom(dUser, { cursor: 'pointer', padding: '.5rem 1rem', rounding: '50%' }, { html: U.name, className: 'active' });
		//d = mDom(dUser, { cursor: 'pointer', fz: 18, rounding: 9, hpadding: 9 }, { html: U.name, className:'active' });
		//mStyle(document.body, { bg: U.bg }); //colorLighter(U.color) });
		let d1 = showImage('gear', dUser, { sz: 25 });
		d1.onclick = ev => showColors(M.playerColors, updateUserColor);
	} else {
		let styles = { family: 'fa6', fg: 'grey', fz: 25, cursor: 'pointer' }; //,'align-self': 'end'
		d = mDom(dUser, styles, { html: String.fromCharCode('0x' + M.superdi.user.fa6) })
	}
	d.onclick = onclickUser;
}
async function userLoad(uname) {
	if (nundef(uname)){
		//am anfang lookup username (!!!) in localstorage!
		uname = localStorage.getItem('username');
		assertion(nundef(uname) || isdef(Serverdata.config.users[uname]));
	}

	if (isdef(uname)) { let u = getUserdata(uname); if (isdef(u)) setU(u); }
	if (!U) {
		Serverdata = await addNewUser(uname);
		console.log('added user', uname, Serverdata.session.users[uname])
		U = Serverdata.session.users[uname];
	}
	showUser();
}
function muell() {

  // U.ccontrast = ccontrast;
  // U.pal = pal;
  // U.bg = o.color;
  // U.fg = ccontrast == 'white' ? pal[8] : pal[2];

  //hier sollen die css colors gesetzt werden!
  //let [hell,dunkel]=[pal[7],pal[1]];
  //let inc=ccontrast=='white'?-1:1;
  let i = idx - 1;
  // for(const x of ['button','body']){
  //   let s=`--bg${capitalize(x)}`;
  //   i+=inc;
  //   setCssVar(s,pal[i])
  // }
  setCssVar('--bgButton', 'transparent');
  setCssVar('--bgBody', pal[idx]);
  inc = ccontrast == 'white' ? 1 : -1;
  i = idx + inc * 2;
  for (const x of ['buttonDisabled', 'button', 'buttonActive', 'buttonHover']) {
    let s = `--fg${capitalize(x)}`;
    i += inc;
    setCssVar(s, pal[i]);
  }
  setCssVar('--fgTitle', ccontrast);
  setCssVar('--fgSubtitle', pal[9]);
  // U.fg=o.color;
  // U.bg=ccontrast == 'white'?pal[7]:pal[2];
  // U.light=
  // [U.fg,U.bg,U.light,U.dark]=[pal[4],pal]
}
async function onclickUser() {
	let uname = await mPrompt(); //returns null if invalid!
	console.log('onclickUser:', uname);
  //wenn der user schon bekannt ist dann soll ihn einfach laden
  
	if (uname) {
		let result = await addNewUser(uname);

		console.log('result', result);
		if (!result) { alert('login failed!'); return; }
		U = result.session.users[uname];
	}
	showUser();
}
async function addNewUser(uname) {
	// if (!isString(uname)) return false;
	// uname = uname.toLowerCase().trim();
	// //only letters please!
	// let correct = true;
	// for (const ch of toLetters(uname)) { if (!isLetter(ch)) correct = false; }
	// if (!correct) return false;
	//name is correct, so send it to session and update UI!
	console.log('adding new user!!!', uname);
	let data = { name: uname, color: valf(userColors[uname],rChoose(plColors))}; //rColor(50,1,15) };
	o = { data: data, path: `users.${uname}`, mode: 's' }; //['users',uname]
	return await uploadJson('save', o);
	//phpPost(o, 'add_user');
}

async function onclickUser(){
	console.log(U); //null am anfang!
	if (!U) {
		//let uname = prompt('Enter name: ');
		let uname = await mPrompt(); 
		console.log('uname',uname);
		if (uname) {
			let result  = await addNewUser(uname);
			console.log('result',result);
			if (!result) {alert('login failed!'); return;}
			U=result.session.users[uname];
		}
	}else {
		//this user is logging out, another one logged in
		U=null;
		onclickUser();
	}
}
async function updateUserColor(ev) {
	let c = ev.target.style.background;
	setU({ name: U.name, color: colorHex(c) });
	let data = { name: U.name, color: U.color };
	o = { data: data, path: `users.${U.name}`, mode: 'c' }; 
	Serverdata = await uploadJson('save', o);
	await userLoad(U.name);
}

//#endregion

//******* NODE JS *********/
//#region approutes von nodejs 
app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")); });

app.get('/filenames', async (req, res) => {
	const { directory: dir } = req.query;
	if (!dir) { return res.status(400).json({ error: 'Directory parameter is missing' }); }
	try {
		const directoryPath = dir.startsWith('C:') ? dir : path.join(__dirname, dir);
		console.log('dirpath', directoryPath)
		const files = await fsp.readdir(directoryPath);
		res.json({ files });
	} catch (err) {
		res.status(500).json({ error: 'Error reading directory', details: err.message });
	}
});
app.get('/login', (req, res) => {
	console.log('______\n/login!!!!! query', req.query);
	let u = req.query;
	let uname = u.name;
	if (nundef(uname)) { res.json({ message: 'ERROR! missing name' }); return; }
	let uconf = lookup(Config, ['users', uname]);
	if (!uconf || uconf.color != u.color) { uconf = lookupSetOverride(Config, ['users', uname], u); saveConfig(); }
	let usession = lookupSetOverride(Session, ['users', uname], u);
	//now user is registered as well as loggedIn and with correct color!
	res.json({ session: Session, config: Config, message: `user ${uname} logged in!` });
})
app.post('/upload', (req, res) => {
	console.log(Object.keys(req.body)); //'req.body',req.body)
	const uploadedFile = req.files.image; // 'image' is the field name in the form
	uploadedFile.mv(path.join(uploadDirectory, 'img', uploadedFile.name), (err) => {
		if (err) { return res.status(500).send(err); }
		const fileSizeInBytes = uploadedFile.size;
		const fileName = uploadedFile.name;
		let [unique, ext] = fileName.split('.');
		console.log('filename', fileName)
		const fileSizeInKB = fileSizeInBytes / 1024; // KB
		const fileSizeInMB = fileSizeInKB / 1024; // MB
		console.log('!!!!', req.body.category, req.body.name);
		fs.appendFile(path.join(uploadDirectory, 'm2.yaml'), `\n${unique}:\n  cat: ${req.body.collection}\n  coll: ${req.body.collection}\n  name: ${req.body.name}\n  ext: ${ext}`, err => { if (err) console.log('error:', err); });
		res.json({
			message: 'File uploaded successfully',
			fileName: fileName,
			fileSizeInBytes: fileSizeInBytes,
			fileSizeInKB: fileSizeInKB,
			fileSizeInMB: fileSizeInMB,
		});
	});
});
app.post('/event', (req, res) => {
	const event = req.body;
	let uname = event.user;
	console.log('...user', uname)
	let fname = path.join(uploadDirectory, 'users', uname + '.yaml');
	if (nundef(Users[uname])) {
		let exists = fs.existsSync(fname);
		if (exists) {
			const yamlFile = fs.readFileSync(fname, 'utf8');
			Users[uname] = yaml.load(yamlFile);
		} else Users[uname] = {};
	}
	let udata = Users[uname];

	//if event.text is empty and this event exists, delete it! otherwise save it
	if (isEmpty(event.text)) {
		let e = lookup(udata, ['events', event.id]);
		if (e) delete udata.events[event.id];
	} else lookupSetOverride(udata, ['events', event.id], event);

	try {
		const yamlData = yaml.dump(udata);
		fs.writeFileSync(fname, yamlData, 'utf8');
	} catch (error) {
		console.error('Error writing YAML file:', error);
	}
	res.json({ message: `event ${event.id} updated!`, user: udata });
});
app.post('/save', (req, res) => {
	const body = req.body;
	const data = body.data; //some json object or base64 image data (or undef)
	const fname = isdef(body.path) ? path.join(__dirname, body.path) : ''; // 
	const mode = body.mode;

	console.log('save:', mode, 'to', fname); //, '\n', data);
	try {
		if (mode == 'a') {
			fs.appendFileSync(fname, data, 'utf8');
		} else if (mode == 'cs') {
			if (data) {
				lookupSetOverride(Config, body.path.split('.'), data);
				lookupSetOverride(Session, body.path.split('.'), data);
			}
			saveConfig();
		} else if (mode == 'w') {
			fs.writeFileSync(fname, data, 'utf8');
		} else if (mode == 'wi') {
			var base64Data = data.image.replace(/^data:image\/png;base64,/, "");
			fs.writeFileSync(fname, base64Data, 'base64'); //, function(err) {  console.log('ERROR img upload: '+fname);});
		} else if (mode == '_ac') {
			addKeys(data, Config);
		} else if (mode == '_wc') {
			copyKeys(data, Config);
		} else if (mode == 'ay') {
			let di = yaml.load(fs.readFileSync(fname, 'utf8'));
			addKeys(data, di);
			let y = yaml.dump(di);
			fs.writeFileSync(fname, y, 'utf8');
		} else if (mode == 'wy') {
			let di = yaml.load(fs.readFileSync(fname, 'utf8'));
			copyKeys(data, di);
			let y = yaml.dump(di);
			fs.writeFileSync(fname, y, 'utf8');
		} else if (mode == 'as' || mode == 's') {
			lookupSet(Session, body.path.split('.'), data);
			console.log('Session', Session)
		} else if (mode == 'ws') {
			lookupSetOverride(Session, body.path.split('.'), data);
			console.log('Session', Session)
		} else if (mode == 'ac') {
			lookupSet(Config, body.path.split('.'), data);
			let y = yaml.dump(Config);
			fs.writeFileSync(configFile, y, 'utf8');
		} else if (mode == 'wc' || mode == 'c') {
			if (data) lookupSetOverride(Config, body.path.split('.'), data);
			saveConfig();
		}
		console.log('*** success ***');
	} catch (error) {
		console.error('Error updating file:', error);
	}
	res.json({ message: `save mode:${mode} ${fname} *** successful ***`, config: Config, session: Session });
});
app.get('/load', (req, res) => {
	try {
		//console.log('______\nquery',req.query);
		let params = req.query;
		let result = {};
		if (params.config) result.config = Config;
		if (params.session) result.session = Session;

		//const yamlFile = fs.readFileSync('path/to/your/file.yaml', 'utf8');	const data = yaml.load(yamlFile);

		res.json(result);
	} catch (error) {
		console.error('Error reading or parsing the YAML file:', error);
	}
});
app.post('/postMove', (req, res) => {
	console.log('<== post move')
	let data = req.body;
	let idTable = data.idTable;
	let player = data.name;
	let move = data.move;
	let fen = Tables[idTable].fen;
	let turn = fen.turn;

	let oldConfig = Session.config;
	Session.config = deepMerge(oldConfig, newConfig);
	let y = yaml.dump(Session.config);
	fs.writeFileSync(configFile, y, 'utf8');
	res.json(Session.config);
});

//#endregion

//#region app.js neuer:
app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")); });

app.get('/filenames', async (req, res) => {
	const { directory: dir } = req.query;
	if (!dir) { return res.status(400).json({ error: 'Directory parameter is missing' }); }
	try {
		const directoryPath = dir.startsWith('C:') ? dir : path.join(__dirname, dir);
		console.log('dirpath', directoryPath)
		const files = await fsp.readdir(directoryPath);
		res.json({ files });
	} catch (err) {
		res.status(500).json({ error: 'Error reading directory', details: err.message });
	}
});
app.get('/login', (req, res) => {
	console.log('______\n/login!!!!! query', req.query);
	let u = req.query;
	let uname = u.name;
	if (nundef(uname)) { res.json({ message: 'ERROR! missing name' }); return; }
	let uconf = lookup(Config, ['users', uname]);
	if (!uconf || uconf.color != u.color) { uconf = lookupSetOverride(Config, ['users', uname], u); saveConfig(); }
	let usession = lookupSetOverride(Session, ['users', uname], u);
	//now user is registered as well as loggedIn and with correct color!
	res.json({ session: Session, config: Config, message: `user ${uname} logged in!` });
})

app.post('/upload', (req, res) => {
	console.log(Object.keys(req.body)); //'req.body',req.body)
	const uploadedFile = req.files.image; // 'image' is the field name in the form
	uploadedFile.mv(path.join(uploadDirectory, 'img', uploadedFile.name), (err) => {
		if (err) { return res.status(500).send(err); }
		const fileSizeInBytes = uploadedFile.size;
		const fileName = uploadedFile.name;
		let [unique, ext] = fileName.split('.');
		console.log('filename', fileName)
		const fileSizeInKB = fileSizeInBytes / 1024; // KB
		const fileSizeInMB = fileSizeInKB / 1024; // MB
		console.log('!!!!', req.body.category, req.body.name);
		fs.appendFile(path.join(uploadDirectory, 'm2.yaml'), `\n${unique}:\n  cat: ${req.body.collection}\n  coll: ${req.body.collection}\n  name: ${req.body.name}\n  ext: ${ext}`, err => { if (err) console.log('error:', err); });
		res.json({
			message: 'File uploaded successfully',
			fileName: fileName,
			fileSizeInBytes: fileSizeInBytes,
			fileSizeInKB: fileSizeInKB,
			fileSizeInMB: fileSizeInMB,
		});
	});
});
app.post('/event', (req, res) => {
	const event = req.body;
	let uname = event.user;
	console.log('...user', uname)
	let fname = path.join(uploadDirectory, 'users', uname + '.yaml');
	if (nundef(Users[uname])) {
		let exists = fs.existsSync(fname);
		if (exists) {
			const yamlFile = fs.readFileSync(fname, 'utf8');
			Users[uname] = yaml.load(yamlFile);
		} else Users[uname] = {};
	}
	let udata = Users[uname];

	//if event.text is empty and this event exists, delete it! otherwise save it
	if (isEmpty(event.text)) {
		let e = lookup(udata, ['events', event.id]);
		if (e) delete udata.events[event.id];
	} else lookupSetOverride(udata, ['events', event.id], event);

	try {
		const yamlData = yaml.dump(udata);
		fs.writeFileSync(fname, yamlData, 'utf8');
	} catch (error) {
		console.error('Error writing YAML file:', error);
	}
	res.json({ message: `event ${event.id} updated!`, user: udata });
});
app.post('/save', (req, res) => {
	const body = req.body;
	const data = body.data; //some json object or base64 image data (or undef)
	const fname = isdef(body.path) ? path.join(__dirname, body.path) : ''; // 
	const mode = body.mode;

	console.log('save:', mode, 'to', fname); //, '\n', data);
	try {
		if (mode == 'a') {
			fs.appendFileSync(fname, data, 'utf8');
		} else if (mode == 'cs') {
			if (data) {
				lookupSetOverride(Config, body.path.split('.'), data);
				lookupSetOverride(Session, body.path.split('.'), data);
			}
			saveConfig();
		} else if (mode == 'w') {
			fs.writeFileSync(fname, data, 'utf8');
		} else if (mode == 'wi') {
			var base64Data = data.image.replace(/^data:image\/png;base64,/, "");
			fs.writeFileSync(fname, base64Data, 'base64'); //, function(err) {  console.log('ERROR img upload: '+fname);});
		} else if (mode == '_ac') {
			addKeys(data, Config);
		} else if (mode == '_wc') {
			copyKeys(data, Config);
		} else if (mode == 'ay') {
			let di = yaml.load(fs.readFileSync(fname, 'utf8'));
			addKeys(data, di);
			let y = yaml.dump(di);
			fs.writeFileSync(fname, y, 'utf8');
		} else if (mode == 'wy') {
			let di = yaml.load(fs.readFileSync(fname, 'utf8'));
			copyKeys(data, di);
			let y = yaml.dump(di);
			fs.writeFileSync(fname, y, 'utf8');
		} else if (mode == 'as' || mode == 's') {
			lookupSet(Session, body.path.split('.'), data);
			console.log('Session', Session)
		} else if (mode == 'ws') {
			lookupSetOverride(Session, body.path.split('.'), data);
			console.log('Session', Session)
		} else if (mode == 'ac') {
			lookupSet(Config, body.path.split('.'), data);
			let y = yaml.dump(Config);
			fs.writeFileSync(configFile, y, 'utf8');
		} else if (mode == 'wc' || mode == 'c') {
			if (data) lookupSetOverride(Config, body.path.split('.'), data);
			saveConfig();
		}
		console.log('*** success ***');
	} catch (error) {
		console.error('Error updating file:', error);
	}
	res.json({ message: `save mode:${mode} ${fname} *** successful ***`, config: Config, session: Session });
});
app.post('/newuser', (req, res) => {
	let name = req.body.name;
	let data = req.body;
	console.log('data', data)
	let fname = path.join(uploadDirectory, 'users', name + '.yaml');
	lookupSetOverride(Config, ['users', name], data);
	lookupSetOverride(Session, ['users', name], data);
	let y = yaml.dump(data);
	fs.writeFileSync(fname, y, 'utf8');
	saveConfig();
	res.json({ message: `added user ${name} *** successful ***`, config: Config, session: Session });
});
app.get('/load', (req, res) => {
	try {
		//console.log('______\nquery',req.query);
		let params = req.query;
		let result = {};
		if (params.config) result.config = Config;
		if (params.session) result.session = Session;

		//const yamlFile = fs.readFileSync('path/to/your/file.yaml', 'utf8');	const data = yaml.load(yamlFile);

		res.json(result);
	} catch (error) {
		console.error('Error reading or parsing the YAML file:', error);
	}
});

//#endregion

//#region nodejs
//#region image processing
function getImageBoundariesX(ctx,fromx, maxx){
	let x=fromx;
	let from,to;
	while(x<=maxx && isWhitePixel(ctx,x,20)) x++;
	from=x; //first non-white pixel
	while(x<=maxx && !isWhitePixel(ctx,x,20)) x++;
	to=x; //first white pixel
	return {from,to};
}
function getImageBoundariesY(ctx,fromy, maxy){
	let y=fromy;
	let from,to;
	while(y<=maxy && isWhitePixel(ctx,20,y)) y++;
	from=y;
	while(y<=maxy && !isWhitePixel(ctx,20,y)) y++;
	to=y; //last non
	return {from,to};
}
async function __splitImage(inputImagePath, outputDirectory, stem) {
	const image = await loadImage(inputImagePath);
	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);

	let x=0, maxx=image.width, iPartX=0;
	console.log('maxx',maxx)
	while(x<10){
		let xsum=getPixelSum(ctx,x,20,1,1);
		console.log('from',x,'sum='+xsum);	
		x++;
	}
}

//#endregion

async function init() {
	try {
		const yamlFile = fs.readFileSync(configFile, 'utf8');
		Session.config = yaml.load(yamlFile);
		let userfiles = await getFiles('../y/users');
		Session.users = {};
		for (const fname of userfiles) {
			let uname = fname.substring(0, fname.length - 5);
			// console.log('uname',uname);
			let p = path.join(uploadDirectory, 'users', fname);
			//console.log('path',p)
			let f = fs.readFileSync(p, 'utf8');
			Session.users[uname] = yaml.load(f);
		}
		app.listen(PORT, () => console.log(`Server on port ${PORT}`));
	} catch (error) {
		console.error('Error reading or parsing the YAML file:', error);
	}
}
//#region crypto
const crypto = require('crypto');

// Generate key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
	modulusLength: 2048, // You can adjust the modulus length based on your security requirements
	publicKeyEncoding: { type: 'spki', format: 'pem' },
	privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

//console.log('Public Key:', publicKey);
//console.log('Private Key:', privateKey);
//console.log('...keys generated')

// Function to decrypt data using Node.js crypto module
function decryptData(encryptedData, privateKey) {
	const privateKeyBuffer = Buffer.from(privateKey, 'base64');
	const decryptedBuffer = crypto.privateDecrypt(
		{ key: privateKeyBuffer, passphrase: '' }, // Use a passphrase if your private key is encrypted
		Buffer.from(encryptedData, 'base64')
	);

	return decryptedBuffer.toString('utf8');
}

// Example: Decrypt data received from the client
// const encryptedDataFromClient = '...'; // Replace with the actual encrypted data received from the client
// const privateKey = '...'; // Replace with your actual private key
// const decryptedData = decryptData(encryptedDataFromClient, privateKey);
// console.log('Decrypted Data:', decryptedData);

// Save the decrypted data or perform other operations as needed

//#endregion

//#region cors error
const express = require("express");
var app = express();
const http = require("http").createServer(app);
// const io = require('socket.io')(http);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000;
try {
  http.listen(port, () => {
    console.log("listening on localhost:" + port);
  });
} catch (e) {
  console.error("Server failed to listen " + e);
}

CLIENT:
const socket = io('http://localhost:3000', {
  extraHeaders: {
      "Access-Control-Allow-Origin": "http://localhost:8080"
  },
  // transports: ['websocket']
});

socket.connect();
socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});


//#endregion

//#region newest combu/app.js
const express = require("express");
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const fs = require('fs');
const fsp = require('fs').promises;
const path = require("path");
const PORT = process.env.PORT || 3000;
const yaml = require('js-yaml');

const uploadDirectory = path.join(__dirname, '..', 'y');
var Config = {};
try {
	const yamlFile = fs.readFileSync(path.join(uploadDirectory, 'config.yaml'), 'utf8');
	Config = yaml.load(yamlFile);
	showEvents();
} catch (error) {
	console.error('Error reading or parsing the YAML file:', error);
}

const app = express();
app.use(bodyParser.json());
app.use(fileUpload());
const cors = require('cors'); app.use(cors());
app.use(express.static(path.join(__dirname, '/..'))); //Serve public directory

//#region functions
function showEvents(){
	console.log('Events', Object.keys(Config.events).length);	
}
//#endregion

//console.log('__dirname', __dirname)

app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")); });

app.get('/filenames', async (req, res) => {
	const { directory: dir } = req.query;
	if (!dir) { return res.status(400).json({ error: 'Directory parameter is missing' }); }
	try {
		const directoryPath = dir.startsWith('C:') ? dir : path.join(__dirname, dir);
		console.log('dirpath', directoryPath)
		const files = await fsp.readdir(directoryPath);
		res.json({ files });
	} catch (err) {
		res.status(500).json({ error: 'Error reading directory', details: err.message });
	}
});

app.post('/upload', (req, res) => {
	console.log(Object.keys(req.body)); //'req.body',req.body)
	const uploadedFile = req.files.image; // 'image' is the field name in the form
	uploadedFile.mv(path.join(uploadDirectory, uploadedFile.name), (err) => {
		if (err) { return res.status(500).send(err); }
		const fileSizeInBytes = uploadedFile.size;
		const fileName = uploadedFile.name;
		let [unique, ext] = fileName.split('.');
		console.log('filename', fileName)
		const fileSizeInKB = fileSizeInBytes / 1024; // KB
		const fileSizeInMB = fileSizeInKB / 1024; // MB
		console.log('!!!!', req.body.category, req.body.name);
		fs.appendFile(path.join(uploadDirectory, 'm2.yaml'), `\n${unique}:\n  cat: ${req.body.category}\n  name: ${req.body.name}\n  ext: ${ext}`, err => { if (err) console.log('error:', err); });
		res.json({
			message: 'File uploaded successfully',
			fileName: fileName,
			fileSizeInBytes: fileSizeInBytes,
			fileSizeInKB: fileSizeInKB,
			fileSizeInMB: fileSizeInMB,
		});
	});
});
app.post('/event', (req, res) => {
	const event = req.body;
	//console.log('Received data:', event);

	Config.events[event.id] = event;
	showEvents()
	
	try {
		// Convert the JavaScript object to a YAML string
		const yamlData = yaml.dump(Config);

		// Write the YAML string to a file
		fs.writeFileSync(path.join(uploadDirectory, 'config.yaml'), yamlData, 'utf8');
		console.log('Config file updated successfully.');
	} catch (error) {
		console.error('Error writing YAML file:', error);
	}
	// Process the received JSON object as needed
	//update this event!
	//ich sollte am server ein Config dict haben!

	res.json({ message: `event ${event.id} updated!` });
	// console.log('req',Object.keys(req.query)); //Object.keys(req.body));
	// res.json({msg:'YEAH!!!!'});
});
app.post('/save', (req, res) => {
	const body = req.body;
	const data = body.data;
	const fname = path.join(__dirname, body.path);
	const mode = body.mode;

	console.log('save:', mode,'to',fname,'\n',data);

	// Config.events[event.id] = event;
	// showEvents()
	
	// try {
	// 	// Convert the JavaScript object to a YAML string
	// 	const yamlData = yaml.dump(Config);

	// 	// Write the YAML string to a file
	// 	fs.writeFileSync(path.join(uploadDirectory, 'config.yaml'), yamlData, 'utf8');
	// 	console.log('Config file updated successfully.');
	// } catch (error) {
	// 	console.error('Error writing YAML file:', error);
	// }
	// // Process the received JSON object as needed
	// //update this event!
	// //ich sollte am server ein Config dict haben!

	res.json({ message: `${mode} ${fname} DONE!` });
	// console.log('req',Object.keys(req.query)); //Object.keys(req.body));
	// res.json({msg:'YEAH!!!!'});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//#endregion

app.post('/upload', //WORKS!!!!!!!
	fileUpload({ createParentPath: true }),
	filesPayloadExists,
	fileExtLimiter(['.png', '.jpg', '.jpeg']),
	fileSizeLimiter,
	(req, res) => {
		const files = req.files;
		//console.log(files);
		console.log(Object.keys(req).join('\n'));
		console.log('____________ BODY')
		console.log(Object.keys(req.body).join('\n'));
		console.log('____________ FILES');
		console.log(Object.keys(req.files).join('\n'));

		Object.keys(files).forEach(key => {
			const filepath = path.join(__dirname, '..', 'y', files[key].name)
			files[key].mv(filepath, (err) => {
				if (err) return res.status(500).json({ status: "error", message: err })
			})
		})

		return res.json({ status: 'success', message: Object.keys(files).toString() })
	}
)

app.get('/submit', (req, res) => {
	const base64data = req.query.data;
	const decodedData = Buffer.from(base64data, 'base64');//.toString('utf-8');
	console.log('Decoded Base64 Data:', decodedData);
	// Specify the file path where you want to save the image
	const filePath = path.join(__dirname, '..', 'y', 'image.png');

	// Write the decoded data to the file
	fs.writeFile(filePath, decodedData, 'base64', (err) => {
		if (err) {
			console.error(err);
			res.status(500).json({ error: 'Error saving file' });
		} else {
			console.log('File saved successfully');
			res.json({ message: 'Data processed and saved as image.png' });
		}
	});
	// const filePath = path.join(__dirname, 'saved_image.png');

	// fs.writeFile(filePath, base64Data, 'base64', (err) => {
	// 	if (err) {
	// 		res.status(500).json({ message: 'Error saving file' });
	// 	} else {
	// 		res.json({ message: 'File saved successfully' });
	// 	}
	// });
	// res.json({ message: 'Received and processed base64 data successfully' });
});

//#endregion

//#region mist
async function ___loadUser(uname){
	if (nundef(Config)) {Serverdata = await mGetRoute('load',{config:true,session:true}); console.log('Serverdata',Serverdata);}

	let user;
	if (nundef(uname)){
		localStorage.setItem('user',JSON.stringify({name:'felix',color:'blue'}));
		let info=localStorage.getItem('user');
		if (info){
			user = JSON.parse(info);
			console.log('user found',user);
		}
		console.log('Session',Session,Config,Users);
		//Config ist am anfang undefined!!!!!
		let isloggedin = lookup(Session,['users',user.name]);
		let isreg = lookup(Config,['users',user.name]);
		let isme = U.name == user.name;	

		if (!isme){
			let result = await mGetRoute('login',user);
			console.log('result',result)
			//den user anmelden! dann erst anzeigen!
			
		}
		showUser()
	} else {
		//no user has logged in on this computer before
		showUser();
	}
	//show username in upper right corner
	//load this users version of whatever is open right now!

}
function ___mCropResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	console.log('w', worig, 'h', horig);
	console.log('dParent', dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox);
	const centerBox = mDom(cropBox, { bg: 'red', w: 10, h: 10, rounding: '50%', position: 'absolute' });
	const bottomRightResizeHandle = mDom(cropBox, { left: worig, top: horig }, { className: "resize-handle bottom-right" });

	let isCropping = false;
	let cropStartX;
	let cropStartY;

	let isResizing = false;

	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		stopCrop();
		isResizing = true;
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		e.preventDefault(); evNoBubble(e);
		if (isResizing) {
			let x = e.clientX, y = e.clientY;

			const width = x; //initialWidth + (e.clientX - resizeStartX);
			const height = y; //initialHeight + (e.clientY - resizeStartY);
			img.style.width = `${width}px`;
			img.style.height = `${height}px`;
			bottomRightResizeHandle.style.left = `${width}px`;
			bottomRightResizeHandle.style.top = `${height}px`;
			dParent.style.width = `${width}px`;
			dParent.style.height = `${height}px`;
			cropBox.style.width = `${width}px`;
			cropBox.style.height = `${height}px`;

		}
	}
	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
	}

	function startCrop(e) {
		e.preventDefault();
		stopResize();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop); //cropCenter);
		document.addEventListener('mouseup', stopCrop);
	}
	function crop(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropX(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = 300; //Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = 0; //Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropCenter(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const radiusX = Math.abs(mouseX - cropStartX);
			const radiusY = Math.abs(mouseY - cropStartY);
			const centerX = cropStartX; // (mouseX + cropStartX) / 2;
			const centerY = cropStartY; //(mouseY + cropStartY) / 2;

			const width = radiusX * 2;
			const height = radiusY * 2;
			const left = centerX - radiusX;
			const top = centerY - radiusY;
			setRect(left, top, width, height);
		}
	}
	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}
	function cropImage() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		console.log('x,y,w,h', x, y, w, h);
		let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = imgDataUrl;
		img.width = w;
		img.height = h;
		mStyle(img, { position: 'absolute', top: 0, left: 0, w: w, h: h });
		mStyle(cropBox, { display: 'none' }); //top: 0, left: img.offsetLeft });
		return imgDataUrl;
	}
	function finalize() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		console.log('x,y,w,h', x, y, w, h);
		let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = imgDataUrl;
		img.width = w;
		img.height = h;
		mStyle(img, { position: 'absolute', top: 0, left: 0, w: w, h: h });
		mStyle(cropBox, { display: 'none' }); //top: 0, left: img.offsetLeft });
		return imgDataUrl;
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		cropBox.style.width = `${width}px`;
		cropBox.style.height = `${height}px`;
		cropBox.style.left = `${left}px`;
		cropBox.style.top = `${top}px`;
		messageBox.innerHTML = `size: ${width} x ${height}`;
		//let [cx,cy] = [(left+width)/2,(top+height)/2];
		mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
		//cropBox.innerHTML = `size: ${width} x ${height}`;
		//mach roten punkt im center

		//console.log('new rect',left,top,width,height,width/2,height/2);


	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		console.log('old rect', x, y, w, h, cx, cy);

		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];


		setRect(xnew, ynew, wnew, hnew);

	}
	setRect(0, 0, worig, horig);
	bottomRightResizeHandle.addEventListener('mousedown', startResize);
	cropBox.addEventListener('mousedown', startCrop);
	//addTool();

	return {
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,
		cropResize: finalize,
		// restart:restart,
		setSize: setSize,
		elem: cropBox,
	}
}
function mCropper(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	console.log('w', worig, 'h', horig);
	console.log('dParent', dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox);
	const centerBox = mDom(cropBox, { bg: 'red', w: 10, h: 10, rounding: '50%', position: 'absolute' });
	let isCropping = false;
	let cropStartX;
	let cropStartY;


	function __restart() {
		stopCrop();
		mStyle(cropBox, { left: 0, top: 0, w: worig, h: horig });
		cropBox.innerHTML = `size: ${worig} x ${horig}`;
	}
	function startCrop(e) {
		e.preventDefault();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop); //cropCenter);
		document.addEventListener('mouseup', stopCrop);
	}
	function crop(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropX(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = 300; //Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = 0; //Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	function cropCenter(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const radiusX = Math.abs(mouseX - cropStartX);
			const radiusY = Math.abs(mouseY - cropStartY);
			const centerX = cropStartX; // (mouseX + cropStartX) / 2;
			const centerY = cropStartY; //(mouseY + cropStartY) / 2;

			const width = radiusX * 2;
			const height = radiusY * 2;
			const left = centerX - radiusX;
			const top = centerY - radiusY;
			setRect(left, top, width, height);
		}
	}
	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}
	function cropImage() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		console.log('x,y,w,h', x, y, w, h);
		let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = imgDataUrl;
		img.width = w;
		img.height = h;
		mStyle(img, { position: 'absolute', top: 0, left: 0, w: w, h: h });
		mStyle(cropBox, { display: 'none' }); //top: 0, left: img.offsetLeft });
		return imgDataUrl;
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		cropBox.style.width = `${width}px`;
		cropBox.style.height = `${height}px`;
		cropBox.style.left = `${left}px`;
		cropBox.style.top = `${top}px`;
		messageBox.innerHTML = `size: ${width} x ${height}`;
		//let [cx,cy] = [(left+width)/2,(top+height)/2];
		mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
		//cropBox.innerHTML = `size: ${width} x ${height}`;
		//mach roten punkt im center

		console.log('new rect', left, top, width, height, width / 2, height / 2);


	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		console.log('old rect', x, y, w, h, cx, cy);

		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];


		setRect(xnew, ynew, wnew, hnew);

	}
	setRect(0, 0, worig, horig);
	cropBox.addEventListener('mousedown', startCrop);
	//addTool();

	return {
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,
		// restart:restart,
		setSize: setSize,
		elem: cropBox,
	}
}
function resizePreviewImage(dParent, img) {
	// const dParent = document.querySelector('.dParent');
	// const img = document.querySelector('.img');
	//const uploadButton = document.getElementById('uploadButton');
	//<div class="resize-handle top-left"></div>
	// <div class="resize-handle bottom-right"></div>
	const topLeftResizeHandle = mDom(dParent, {}, { className: "resize-handle top-left" }); //document.querySelector('.resize-handle.top-left');
	const bottomRightResizeHandle = mDom(dParent, {}, { className: "resize-handle bottom-right" }); //document.querySelector('.resize-handle.bottom-right');

	let isResizing = false;
	let resizeStartX;
	let resizeStartY;
	let initialWidth;
	let initialHeight;

	function startResize(e) {
		isResizing = true;
		resizeStartX = e.clientX;
		resizeStartY = e.clientY;
		initialWidth = img.offsetWidth;
		initialHeight = img.offsetHeight;
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}

	function resize(e) {
		if (isResizing) {
			const width = initialWidth + (e.clientX - resizeStartX);
			const height = initialHeight + (e.clientY - resizeStartY);
			img.style.width = `${width}px`;
			img.style.height = `${height}px`;
		}
	}

	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
	}
	topLeftResizeHandle.addEventListener('mousedown', startResize);
	bottomRightResizeHandle.addEventListener('mousedown', startResize);


}
async function _saveCanvas(ev) {
	ev.preventDefault();
	const canvas = document.getElementById('canvas1');
	const base64data = canvas.toDataURL('image/png');
	const encodedBase64 = encodeURIComponent(base64data);
	const queryString = `?data=${encodedBase64}`;
	const response = await fetch(`http://localhost:3000/submit${queryString}`, {
		method: 'GET',
		mode: 'cors',
	});

	const result = await response.text();
	console.log(result);
	localStorage.setItem('hallo', JSON.stringify(result));
	return false;
}



async function test0() {
	try {
		const element = document.getElementById('dTest'); // Replace 'your-element-id' with the actual ID of your HTML element
		const base64data = await htmlElementToBase64(element);
		console.log('Base64 Data URL:', base64data);
		// Do something with the base64 data URL
	} catch (error) {
		console.error('Error:', error);
	}
}

function htmlElementToBase64(element) {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const rect = element.getBoundingClientRect();

		canvas.width = rect.width;
		canvas.height = rect.height;

		const styles = window.getComputedStyle(element);
		const oldOverflow = styles.overflow;
		const oldPosition = styles.position;

		// Override styles to ensure the element is rendered correctly on the canvas
		element.style.overflow = 'visible';
		element.style.position = 'static';

		const elementClone = element.cloneNode(true);

		// Remove any potential IDs to prevent duplicates in the document
		elementClone.removeAttribute('id');

		const cloneContainer = document.createElement('div');
		cloneContainer.appendChild(elementClone);

		// Draw the element on the canvas
		const svg = new Blob([cloneContainer.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(svg);
		console.log('url', url);
		const img = document.getElementById('result'); //new Image();
		img.src = url;
		return url;

		img.onload = () => {
			ctx.drawImage(img, 0, 0, rect.width, rect.height);
			// Get the base64 data URL from the canvas
			const base64data = canvas.toDataURL('image/png');
			// Revert overridden styles
			element.style.overflow = oldOverflow;
			element.style.position = oldPosition;
			// Clean up
			URL.revokeObjectURL(url);
			resolve(base64data);
		};

		img.onerror = (error) => {
			// Revert overridden styles
			element.style.overflow = oldOverflow;
			element.style.position = oldPosition;
			// Clean up
			URL.revokeObjectURL(url);
			reject(error);
		};

	});
}


//#endregion

//#region factory
function fetchFilenamesLocalhost(dir) {
	const directory = dir;
	if (!directory) {
		alert('Please enter a directory name.');
		return;
	}

	// Fetch filenames based on the user-entered directory
	fetch(`http://localhost:3000/filenames?directory=${directory}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors' // Set CORS mode to enable cross-origin requests
	})
		.then(response => response.json())
		.then(data => {
			return data;
		})
		.catch(error => console.error('Error:', error));
}
function fromOpenai() {
	const filenamesList = document.getElementById('filenames-list');
	const directoryInput = document.getElementById('directory-input');
	const fetchButton = document.getElementById('fetch-button');

	// Function to fetch filenames from the server and display them in the list
	const fetchFilenames = () => {
		const directory = directoryInput.value;
		if (!directory) {
			alert('Please enter a directory name.');
			return;
		}

		// Fetch filenames based on the user-entered directory
		fetch(`http://localhost:3000/filenames?directory=${directory}`)
			.then(response => response.json())
			.then(data => {
				filenamesList.innerHTML = ''; // Clear previous list
				data.files.forEach(filename => {
					const listItem = document.createElement('li');
					listItem.textContent = filename;
					filenamesList.appendChild(listItem);
				});
			})
			.catch(error => console.error('Error:', error));
	};

	fetchButton.addEventListener('click', fetchFilenames);

}
//#endregion

//#region test
async function test27_user() {
	await prelims();
	let nav = UI.nav.ui;
	dUser = mDom(nav, { fz: 20 }, { id: 'dUser' }); //, bg:'red', 'align-self': 'end' , 'justify-self':'center'},{id:'dUser'});
	//showUser();
}
async function test25_user() {
	await prelims();
	let nav = UI.nav.ui;
	dUser = mDom(nav, { fz: 20 }, { id: 'dUser' }); //, bg:'red', 'align-self': 'end' , 'justify-self':'center'},{id:'dUser'});
	//showUser();
}

//#endregion

let d1 = showImage('gear', dUser, { sz: 25 });	d1.onclick = onclickGear;

