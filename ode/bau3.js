async function collectPlayerOptions(pl, gamename) {
  let name = pl.name;
  let options = valf(pl[gamename], {});
  let poss = Serverdata.config.games[gamename].ploptions;
  if (nundef(poss)) return options;
  for (const p in poss) {
    options[p] = getRadioValue(p);
  }
  pl[gamename] = options;
  let id = 'dPlayerOptions'; mRemoveIfExists(id);//mRemove(d);
  let uold = Serverdata.users[pl.name];
  let unew = {};
  for (const k in pl) {
    if (['div', 'isSelected', 'playmode'].includes(k)) continue;
    unew[k] = jsCopy(pl[k]);
  }
  for (const k in unew[gamename]) {
    if (lookup(uold, [gamename, k]) != unew[gamename][k]) {
      let res = await postUserChange(unew);
      copyKeys(res,DA.allPlayers[name]);
      return;
    }
  }
}
function defaultGameFunc() {
  function setup(table) { let fen = { players: table.players, turn: [table.owner] }; delete table.players; }
  async function activate(table) { console.log('activate for', getUname()) }
  function checkGameover(table) { return false; }
  async function present(table) { mClear('dMain'); } //showMessage(`BINGO!!! ${table.friendly} view ${name}: NOT IMPLEMENTED!!!!!`,1000); } 
  async function hybridMove(table) { console.log('hybrid moves for', getUname()) }
  async function botMove(table) { console.log('robot moves for', getUname()) }
  async function stepComplete(table, o) { console.log(`integrate if step complete for ${table.friendly}`); }
  return { setup, activate, checkGameover, present, hybridMove, botMove, stepComplete };
}
function getRadioValue(prop) {
	let fs = mBy(`d_${prop}`);
  if (nundef(fs)) return null;
	let val = getCheckedRadios(fs)[0]; //console.log(p,val)
	return isNumber(val) ? Number(val) : val;
}
function setRadioValue(prop, val) {
	let input = mBy(`i_${prop}_${val}`);
  if (nundef(input)) return;
	input.checked = true;
}
async function setPlayerPlaying(item, gamename) {
  let [name, da] = [item.name, item.div]; 
  addIf(DA.playerList, name);
  selectPlayerItem(item);
  await collectFromPrevious(gamename);
  let id = 'dPlayerOptions';
  DA.lastPlayerItem = item;
  let poss = getGamePlayerOptions(gamename);
  if (nundef(poss)) return;
  let dParent = mBy('dGameMenu'); //mBy('dMain'); //mBy('dGameMenu'); //document.body;
  let bg = getUserColor(name);
  let rounding = 6;
  let d1 = mDom(dParent, { bg: colorLight(bg, 50), border: `solid 2px ${bg}`, rounding, display: 'inline-block', hpadding: 3, rounding }, { id });
  mDom(d1, {}, { html: `${name}` }); //title
  d = mDom(d1, {}); mCenterFlex(d);
  mCenterCenter(d);
  for (const p in poss) {
    let key = p; 
    let val = poss[p];
    if (isString(val)) {
      let list = val.split(',');
      let legend = formatLegend(key);
      let fs = mRadioGroup(d, {}, `d_${key}`, legend);
      for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, false); }
      let userval = lookup(DA.allPlayers, [name, gamename, p]);
      //console.log('val',userval,DA.allPlayers[name])
      let radio;
      let chi = fs.children;
      for (const ch of chi) {
        let id = ch.id;
        if (nundef(id)) continue;
        let radioval = stringAfterLast(id, '_');
        if (isNumber(radioval)) radioval = Number(radioval);
        if (userval == radioval) ch.firstChild.checked = true;
        else if (nundef(userval) && `${radioval}` == arrLast(list)) ch.firstChild.checked = true;
      }
      measureFieldset(fs);
    }
  }
  let r = getRectInt(da, mBy('dGameMenu'));
  let rp = getRectInt(d1);
  let [y, w, h] = [r.y - rp.h - 4, rp.w, rp.h];
  let x = r.x - rp.w / 2 + r.w / 2;
  if (x < 0) x = r.x - 22;
  if (x > window.innerWidth - w - 100) x = r.x - w + r.w + 14;
  mIfNotRelative(dParent);
  mPos(d1, x, y);
  mButtonX(d1, ev => collectPlayerOptions(item, gamename), 18, 3, 'dimgray');
}
function setPlayersToMulti() {
	for (const name in DA.allPlayers) {
		DA.allPlayers[name][DA.gamename].playmode = 'human';
		let el = document.querySelector(`div[username="${name}"]`);
		let img = el.getElementsByTagName('img')[0];
		mStyle(img, { round: true });
	}
	setRadioValue('playmode', 'human');
}
function setPlayersToSolo() {
	for (const name in DA.allPlayers) {
		if (name == getUname()) continue;
		DA.allPlayers[name][DA.gamename].playmode = 'bot';
		let el = document.querySelector(`div[username="${name}"]`);
		let img = el.getElementsByTagName('img')[0];
		mStyle(img, { rounding: 2 });
	}
	let popup = mBy('dPlayerOptions');
	if (isdef(popup) && popup.firstChild.innerHTML.includes(getUname())) return;
	setRadioValue('playmode', 'bot');
}




