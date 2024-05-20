
function mByAttr(key, val) {
  // Build the attribute selector string
  const selector = val ? `[${key}="${val}"]` : `[${key}]`;

  // Use querySelectorAll to find matching elements
	let list = Array.from(document.querySelectorAll(selector));
	return (list.length == 1)? list[0]:list;
}
function mRadio(label, val, name, dParent, styles = {}, onchangeHandler, group_id, is_on) {
	let cursor = styles.cursor; delete styles.cursor;
	let d = mDiv(dParent, styles, group_id + '_' + val);
	let id = isdef(group_id) ? `i_${group_id}_${val}` : getUID();
	let type = isdef(group_id) ? 'radio' : 'checkbox';
	let checked = isdef(is_on) ? is_on : false;
	let inp = mCreateFrom(`<input class='radio' id='${id}' type="${type}" name="${name}" value="${val}">`);
	if (checked) inp.checked = true;
	let text = mCreateFrom(`<label for='${inp.id}'>${label}</label>`);
	if (isdef(cursor)) { inp.style.cursor = text.style.cursor = cursor; }
	mAppend(d, inp);
	mAppend(d, text);
	if (isdef(onchangeHandler)) {
		inp.onchange = ev => {
			ev.cancelBubble = true;
			if (onchangeHandler == 'toggle') {
			} else if (isdef(onchangeHandler)) {
				onchangeHandler(ev.target.checked,name,val);
			}
		};
	}
	return d;
}
function setPlayersToMulti() {
	for (const name in DA.allPlayers) {
		lookupSetOverride(DA.allPlayers, [name, 'playmode'], 'human');
		updateUserImageToBotHuman(name,'human');
	}
	setRadioValue('playmode', 'human');
}
function setPlayersToSolo() {
	for (const name in DA.allPlayers) {
		if (name == getUname()) continue;
		lookupSetOverride(DA.allPlayers, [name, 'playmode'], 'bot');
		updateUserImageToBotHuman(name,'bot');
	}
	let popup = mBy('dPlayerOptions');
	if (isdef(popup) && popup.firstChild.innerHTML.includes(getUname())) return;
	setRadioValue('playmode', 'bot');
}
async function showTable(id) {
	//INVALID TABLES KOMMEN GARNICHT HIERHER!!!
	//VALID TABLES SOLLEN NICHT UNBEDINGT DEN MOVE UNTERBRECHEN! es kann auch nur ein UI update sein!
	let me = getUname();
	let table = await mGetRoute('table', { id });	//console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game]; //showValidMoves(table);

	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2>${table.friendly} (${table.step})</h2>`; // title
	d = mDom('dMain'); mCenterFlex(d); 
	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction
	mDom(d, {}, { id: 'dStats' }); mLinebreak(d); 
	
	func.stats(table); // player stats

	let minTableSize = 400; // present
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);

	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }

	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);

	await updateTestButtonsPlayers(table); // right side buttons

	func.activate(table, items); // activate

}
function updateUserImageToBotHuman(playername,value){
	function doit(checked,name,val){
		let du=mByAttr('username',playername);
		//console.log('checked',checked,name,val,du); return;
		let img = du.getElementsByTagName('img')[0]; //du.firstChild;
		if (checked==true) if (val == 'human') mStyle(img,{round:true}); else mStyle(img,{rounding:2});
	}
	if (isdef(value)) doit(true,0,value); else return doit;
}



