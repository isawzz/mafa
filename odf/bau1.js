
async function setOnclickCard(item,items){
	console.log('click',item.key)
	toggleItemSelection(item);
	let selitems=items.filter(x=>x.isSelected);
	let keys=selitems.map(x=>x.key);
	let m = selitems.length;
	let me = getUname();
	let table = Clientdata.table;
	let fen=table.fen;
	let pl=fen.players[me];
	if (m == 3 || TESTING && m==3){
		mShield(dOpenTable,{bg:'#00000000'}); //disable ui
		let isSet = checkIfSet(keys); //console.log('isSet',isSet); //check if set condition is met
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
		// let res = await mPostRoute('moveComplete',{id,friendly,name,fen,step,turn});
		let res = await mPostRoute('postTable',table);

		console.log('res',res)
	}
	else if (m>=1) disableButton(T.bHint); else enableButton(T.bHint);
}


function createCountdownG(dParent, styles={}, ms=3000, callback=null) {
	removeCountdownG();
	if (isEmpty(styles)) styles = {display:'inline',fz:40,fg:'white',bg:'gray'}; //{ w: 80, maleft: 10, fg: 'red', weight: 'bold' };
  let dCountdown = mDom(dParent, styles, {id:'dCountdown'});
  let cd = DA.countdown = new SimpleTimer(dCountdown, 1000, null, ms, callback);
  cd.start();
  return cd;
}
function removeCountdownG(){if (isdef(DA.countdown)) { DA.countdown.clear(); DA.countdown.elem.remove(); DA.countdown = null; }}














