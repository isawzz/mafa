
function wsPowerText(item, d, styles = {}) {
	mClear(d)
	let key = item.power; if (key.startsWith('_')) key = 'sienna' + key;
	//let list=wsGetPower(key);

	//let powerColors = ['sienna','pink','white','lightblue'];

	//da muessern jetzt die symbols eingefuegt werden!!!!
	let parts = key.split('_'); console.log(parts)
	let s = '';
	let color = parts[0];
	if (color == 'sienna') s += 'WHEN ACTIVATED: ';
	else if (color == 'pink') s += 'ONCE BETWEEN TURNS: ';
	else if (color == 'white') s += 'WHEN PLAYED: ';
	else if (color == 'lightblue') s += 'ROUND END: ';

	copyKeys({ bg: color }, styles); mStyle(d, { bg: color, fg: 'contrast' });

	let what = parts[1];
	let verb = '';
	let n = Number(parts[2]);

	if (color == 'sienna') {
		if (what == 'child') {
			verb = 'place';
			s += `${capitalize(verb)} ${n} ${pluralOf('child', n)} on any`;
			let prop = parts[3];
			switch (prop) {
				case 'color':
					s += ` ${n == 1 ? 'card' : '2 cards'} with color <span style="border-radius:${item.fz}px;padding-left:${item.fz / 2}px;padding-right:${item.fz / 2}px;background-color:white;color:${colorFrom(item.colorSym)}">${wsGetColorRainbowText(item.colorSym)}</span>.`; break;
				case 'class':
					s += ` ${item.class}.`; break;
				case 'sym':
				default:
					s += ` ${n == 1 ? 'card' : '2 cards'} with symbol ${wsGetSymbolInline(item.abstract, item.fz)}.`;
			}
			if (n == 2) s += ` Other players may place 1 ${what}.`
		} else if (what == 'draw') {
			verb = 'draw';
			what = parts[3];
			s += `${capitalize(verb)} ${n} ${pluralOf(what, n)}`;
			let prop = parts[4];
			switch (prop) {
				case 'tray':
				case 'deck': s += ` from ${prop}.`; break;
				case 'return': s += `, return 1 at the end of action.`; break;
				case '1': s += ` Other players may draw 1.`; break;
				default: s += '.'; break;
			}
		} else if (what == 'tuck') {
			verb = what;
			what = parts[3];
			s += `${capitalize(verb)} ${n} ${pluralOf('card', n)}`;
			let prop = parts[3];
			switch (prop) {
				case 'pick': s += ` to ${prop} 1 food from ${parts[4]}.`; break;
				case 'draw': s += ` to ${prop} 1 card from ${parts[4]}.`; break;
				case 'place': s += ` to ${prop} 1 child on any card.`; break;
				default:
			}
		} else if (what == 'food') {
			verb = 'pick';
			s += `${capitalize(verb)} ${n} ${what} from ${parts[3]}.`;
			if (n == 2) s += ` Other players ${verb} 1 ${what}.`
		} else if (what == 'all') {
			s += `All players ${parts[2]} ${parts[3]} ${what}.`;
		} else if (what == 'discard') {
			let n1 = Number(parts[5])
			s += `You may ${what} ${n} ${parts[3]} to ${parts[4]}`;
			if (parts.length > 5) {
				let n1 = Number(parts[5]);
				s += ` ${n1} ${pluralOf(parts[6], n1)}`;
				s += parts.length > 7 ? ` from ${parts[7]}.` : '.';
			} else s += '.';
		} else if (what == 'repeat') {
			s += `Repeat another brown power on this habitat.`;
		} else if (what == 'hunt') {
			let verb = what; what = parts[2];
			if (what == 'food') {
				s += `Roll dice in feeder. If there is a ${parts[3]}, keep it.`;
			} else if (what == 'card') {
				s += `Draw a card. `;
				switch(parts[3]){
					case 'sym':
					default: s+=`If it has symbol ${wsGetSymbolInline(item.abstract, item.fz)}, tuck it.`; break;
				}
				
			}
		}
	}

	if (color == 'pink') {
		let [verb1, what1, verb2, n, what2, from] = parts.slice(1);
		s += `When another player ${verb1}s ${what1}, ${verb2} ${n} ${what2}`;
		s += isdef(from) ? ` from ${from}.` : '.';
	}

	if (color == 'white') {
		if (what == 'draw') {
			verb = 'draw';
			what = parts[3];
			s += `${capitalize(verb)} ${n} ${pluralOf(what, n)}`;
			let prop = parts[4];console.log(parts[4])
			switch (prop) {
				case 'tray':
				case 'deck': s += ` from ${prop}.`; break;
				case 'return': s += `, return 1`; s += what == 'card'? ` at the end of action.`:'.'; break;
				case '1': s += ` Other players may draw 1.`; break;
				default: s += '.'; break;
			}
		} else if (what == 'collect'){
			s+= `Collect all ${parts[2]} from feeder.`
		}else if (what == 'child'){
			s+=`Place 1 child on each of your cards with `;
			what=parts[2];
			switch(what){
				case 'sym': s+=`symbol ${wsGetSymbolInline(item.abstract, item.fz)}.`; break;
				case 'class': s+=`class ${item.class}.`; break;
				case 'color': s+=`color <span style="color:${colorFrom(item.colorSym)}">${wsGetColorRainbowText(item.colorSym)}</span>.`; break;
			}
		}
	}

	if (color == 'lightblue'){
		if (what == 'feeder') s+=`Collect all food in feeder.`
		else if (what == 'tray') s+=`Collect a card from tray.`
	}

	s=replaceAll(s,'child',wsGetChildInline(item));
	d.innerHTML = s;
	return d;

}

function wsGetChildInline(item,color){
	let type = item.class;
	let key = type == 'mammal'?'paw':'big_egg';
	let o=M.superdi[key];
	let [fam,sym]=isdef(o.fa6)?['fa6','fa6']:isdef(o.fa)?['pictoFa','fa']:['pictoGame','ga'];
	console.log(item.colorPower)
	let fg = valf(color,colorIdealText(item.colorPower,true)); // == 'white'?'grey':'inherit';
	console.log(fg)
	return `<span style="color:${fg};vertical-align:middle;line-height:80%;font-size:${item.fz * 1.5}px;font-family:${fam}">${String.fromCharCode('0x' + M.superdi[key][sym])}</span>`;
}
function wsGetSymbolInline(key, fz) { return `&nbsp;<span style="vertical-align:middle;line-height:80%;font-size:${fz * 1.5}px;font-family:pictoGame">${String.fromCharCode('0x' + M.superdi[key].ga)}</span>`; }
function pluralOf(s, n) {
	di = { food: '', child: 'ren' };
	return s + (n == 0 || n > 1 ? valf(di[s.toLowerCase()], 's') : '');
}










