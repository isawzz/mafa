
function setScoresSameOrHigher(told,tnew){
	if (nundef(told)) return true;
	let [plold,plnew]=[told.fen.players,tnew.fen.players];
	for(const name in plnew){
		if (plold[name].score+plold[name].incScore != plnew[name].score) return false;
		plnew[name].incScore = 0;//loesche check val
	}
	return true;
}

async function collectPlayerOptions(pl, gamename) {
	let name = pl.name;
	let options = valf(pl[gamename], {});
	//console.log('___collectPlayerOptions\n', name, jsCopy(options)); //return;
	//if (!mExists('dPlayerOptions')) { console.log('opts', name, DA.playerOptions[name]); return; }
	let poss = Serverdata.config.games[gamename].ploptions;
	if (nundef(poss)) return options;
	for (const p in poss) {
		let fs = mBy(`d_${p}`);
		let val = get_checked_radios(fs)[0]; //console.log(p,val)
		options[p] = isNumber(val) ? Number(val) : val;
		//console.log('change',p,options[p])
	}
	pl[gamename] = options;
	let id = 'dPlayerOptions'; mRemoveIfExists(id);//mRemove(d);
	//console.log('collected',DA.playerList.map(x=>DA.allPlayers[x]));
	//options with org user options compare 
	let uold = Serverdata.users[pl.name];
	let unew = {};
	for (const k in pl) {
		if (['div', 'isSelected'].includes(k)) continue;
		unew[k] = jsCopy(pl[k]);
	}
	//console.log('item',item)
	//console.log('uold',uold[gamename])
	//console.log('unew',unew[gamename])
	for (const k in unew[gamename]) {
		if (lookup(uold, [gamename, k]) != unew[gamename][k]) {
			//console.log(`${k} CHANGED!!!!`, lookup(uold, [gamename, k]), unew[gamename][k]);
			let res = await postUserChange(unew);
			copyKeys(res,DA.allPlayers[name]);
			//console.log('postUserChange!!!')
			//console.log('server opts', name, Serverdata.users[name][gamename]);
			return;
		}
	}
}













