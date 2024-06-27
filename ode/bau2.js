
function wsPowerText(item,d,styles={}){
	mClear(d)
	let key=item.power;
	let list=wsGetPower(key);

	//da muessern jetzt die symbols eingefuegt werden!!!!
	let parts = key.split('_'); console.log(parts)
	let s='';
	let color = ['pink','white','lightblue'].some(x=>key.startsWith(x))? parts[0]:'sienna';
	if (color == 'sienna') s+='WHEN ACTIVATED: ';
	else if (color == 'pink') s+= 'ONCE BETWEEN TURNS: ';
	else if (color == 'white') s+= 'WHEN PLAYED: ';
	else if (color == 'lightblue') s+= 'ROUND END: ';

	copyKeys({bg:color},styles); mStyle(d,{bg:color,fg:'contrast'});

	let what=parts[1];
	let verb='';
	let n=Number(parts[2]);
	
	if (what == 'child') {
		verb = 'place';
		s+=`${capitalize(verb)} ${n} ${pluralOf('child',n)} on any`;
		let prop=parts[3];
		switch(prop){
			case 'color': 
				s+= ` ${n==1?'card':'2 cards'} with color <span style="border-radius:${item.fz}px;padding-left:${item.fz/2}px;padding-right:${item.fz/2}px;background-color:white;color:${colorFrom(item.colorSym)}">${wsGetColorRainbowText(item.colorSym)}</span>.`; break;
			case 'class': 
				s+= ` ${item.class}.`; break;
			case 'sym': 
			default:
				s+= ` ${n==1?'card':'2 cards'} with symbol ${wsGetSymbolInline(item.abstract,item.fz)}.`; 
		}
		if (n == 2) s+= ` Other players may place 1 ${what}.`
	}	else 	if (what == 'draw') {
		verb = 'draw';
		s+=`${capitalize(verb)} ${n} ${pluralOf('card',n)}`;
		let prop=parts[3];
		switch(prop){
			case 'tray':
			case 'deck': s+=` from ${prop}.`; break;
			case 'return': s+=`, return 1 at the end of action.`; break;
			default: s+='.'; break;
		}
	}	else 	if (what == 'tuck') {
		verb = what;
		what=parts[3];
		s+=`${capitalize(verb)} ${n} ${pluralOf('card',n)}`;
		let prop=parts[3];
		switch(prop){
			case 'pick': s+=` to ${prop} 1 food from ${parts[4]}.`; break;
			case 'draw': s+=` to ${prop} 1 card from ${parts[4]}.`; break;
			case 'place': s+=` to ${prop} 1 child on any card.`; break;
			default: 
		}
	}		

	

	d.innerHTML = s;
	return d;

}

function wsGetSymbolInline(key,fz){ return `&nbsp;<span style="vertical-align:middle;line-height:80%;font-size:${fz*1.5}px;font-family:pictoGame">${String.fromCharCode('0x' + M.superdi[key].ga)}</span>`;}
function pluralOf(s,n) { 
	di={food:'',child:'ren'};
	return s + (n == 0 || n > 1 ? valf(di[s.toLowerCase()],'s') : ''); 
}










