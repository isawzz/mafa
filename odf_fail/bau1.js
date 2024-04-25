
function getRadioValue(prop){
	let fs = mBy(`d_${prop}`);
	let val = get_checked_radios(fs)[0]; //console.log(p,val)
	return isNumber(val) ? Number(val) : val;
}
function setRadioValue(prop,val){
	let input = mBy(`i_${prop}_${val}`);
	//console.log('input',input)
	//if (nundef(input));
	input.checked = true;
}
function setPlayersToMulti(){
	//playermode default is 'human' for all players
	for(const name in DA.allPlayers){
		DA.allPlayers[name].playmode='human';
		let el=document.querySelector(`div[username="${name}"]`);
		//console.log('el',el);
		let img = el.getElementsByTagName('img')[0];
		mStyle(img,{round:true});
	}
	setRadioValue('playmode','human');
	//images of all players are round
}
function setPlayersToSolo(){
	//playermode default is 'bot' for all players
	//images of all players are square
	for(const name in DA.allPlayers){
		if (name==getUname()) continue;
		DA.allPlayers[name].playmode='bot';
		let el=document.querySelector(`div[username="${name}"]`);
		//console.log('el',el);
		let img = el.getElementsByTagName('img')[0];
		mStyle(img,{rounding:2});
	}

	let popup=mBy('dPlayerOptions');
	if (isdef(popup) && popup.firstChild.innerHTML.includes(getUname())) return;
	setRadioValue('playmode','bot');
	
}














