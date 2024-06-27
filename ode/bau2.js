
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
		s+=`${capitalize(verb)} 1 child on any`;
		let prop=parts[3];
		switch(prop){
			case 'color': 
				s+= ` ${n==1?'card':'two cards'} with color <span style="border-radius:${item.fz}px;padding-left:${item.fz/2}px;padding-right:${item.fz/2}px;background-color:white;color:${colorFrom(item.colorSym)}">${wsGetColorRainbowText(item.colorSym)}</span>.`; break;
			case 'class': 
				s+= ` ${item.class}.`; break;
			case 'sym': 
			default:
				s+= `${n==1?'card':'two cards'} with symbol ${wsGetSymbolInline(item.abstract,item.fz)}.`; 
		}
	}		
	

	if (n == 2) s+= ` Other players may place 1 ${what}.`
	d.innerHTML = s;
	return d;

}
function wsGetSymbolInline(key,fz){ return `&nbsp;<span style="vertical-align:middle;line-height:80%;font-size:${fz*1.5}px;font-family:pictoGame">${String.fromCharCode('0x' + M.superdi[key].ga)}</span>`;}










