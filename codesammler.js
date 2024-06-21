
//#region baui 21.6.24
function wsShowTitle(dCard,title,fz,szlt){
	let margin = szlt/12;
	//let title = fromNormalized(o.friendly);
	let dtitle = mDom(dCard, { fz, margin, display: 'inline', weight: 'bold' }, { html: title });
	mPlace(dtitle, 'tl',szlt+margin/2,0); //, 0, yTitle);

}
function showPlaetze(dCard,n, szPlatz){
	let plaetze = nundef(n) ? 2 : n == 0 ? 0 : n == 1 ? 1 : n < 8 ? 2 : n < 25 ? 3 : n < 100 ? 4 : n < 1000 ? 5 : 6;
	let dPlaetze = mDom(dCard, { w: szPlatz, gap: szPlatz/2 }); mCenterFlex(dPlaetze);
	for (const i of range(plaetze)) { mDom(dPlaetze, { round: true, w: szPlatz, h: szPlatz, border: 'silver' }); }
	return dPlaetze;
}
function showFood(dParent,tokens,w,fz){
	let df=mDom(dParent);mCenterCenterFlex(df);
	// let tokens = o.foodTokens; //console.log(tokens,o.foodtype,o.food)
	let len = tokens.length; 
	let ch = len < 3 && coin()?'/':'+';
	let [szSym,szChar]=[w/4,w/9];
	let tlist=[{t:tokens[0],sz:szSym}];
	if (len>1) {tlist.push({t:ch,sz:szChar});tlist.push({t:tokens[1],sz:szSym})}
	if (len>2) {tlist.push({t:ch,sz:szChar});tlist.push({t:tokens[2],sz:szSym})}
	for(const x of tlist){
		let d=mDom(df,{w:x.sz}); //,bg:rColor()}); 
		mCenterCenterFlex(d);
		let c=x.t;
		if (c == '+') {d.innerHTML = c;mStyle(d,{fz})}
		else if (c == '/') {d.innerHTML = c;mStyle(d,{fz})}
		else if (c.includes('.')) {
			let img=showim1(c,d,{w:x.sz});
			if (c.includes('mouse')) mStyle(img,{matop:fz/4})
		}else {
			let szimg=x.sz*.7;
			let img=showim1('../assets/games/wingspan/pie2.png',d,{w:szimg,h:szimg});//mStyle(img,{round:true})
			//omnisym(d,x.sz)
			//let d1=mDom(d,{h:x.sz*.8})
			//mAppend(d,mCreateFrom(generatePizzaSvg(sz)));
			//mPizza(d, x.sz*.75, 'red', 'green', 'yellow', 'gray', 'orange', 'skyblue'); 
		}
	}
}

function showHabitat(dParent,ohab,h){
	for(let i=0;i<ohab.imgs.length;i++){
		let c=ohab.colors[i];
		if (c == 'gray') continue;
		let d=showim1(ohab.imgs[i],dParent,{h,round:true,bg:c,'clip-path':PolyClips.diamond})	
		if (i == 2) mStyle(d,{matop:-h}); //-20})
	}
}


function extractFoodAndType(s){

	let carni = ['mouse', 'bird', 'fish', 'beetle',  'spider', 'animal', 'frog', 'lizard', 'worm', 'deer', 'zebra', 'shrimp', 'squid', 'snail'];
	let insecti = ['worm', 'ant', 'insect', 'moth', 'flies', 'grasshopper',]
	let herbi = ['grass', 'grasses', 'leaves', 'fruit', 'flowers', 'grain', 'berries', 'plant', 'bamboo', 'tree', 'wood', 'reed', 'twig', 'crops', 'herbs'];

	s = s.toLowerCase();
	let words = toWords(s, true).map(x => strRemoveTrailing(x, 's'));

	let di = { herbi, carni, insecti };
	let types = [];
	let contained = [];
	for (const type in di) {
		let arr = di[type];
		for (const a of arr) {
			let w = strRemoveTrailing(a, 's'); 
			if (words.includes(w)){
				addIf(contained, a);
				addIf(types, type);
				continue;
			}
		}
	}
	let type;
	for (const t of ['omni', 'herbi', 'carni', 'insecti']) {
		if (s.includes(t)) type = t + 'vorous';
	}
	if (nundef(type)){
		if (isEmpty(types)) { type='unknown' }
		if (types.includes('herbi') && types.length >= 2) type='omnivorous';
		else if (types.length >= 2) type='carnivorous';
		else type = types[0] + 'vorous';
	}
	
	return [contained,type];

}	
function extractFoods(s) {
	s = s.toLowerCase();
	let words = toWords(s, true).map(x => strRemoveTrailing(x, 's'));

	let herbi = M.byCat.plant; herbi = herbi.concat(['plant', 'berries', 'grasses', 'leave', 'tree', 'twig', 'fruit', 'grass', 'grain']);
	let carni = M.byCat.animal; carni = carni.concat(['animal'])
	let insecti = ['insect', 'worm', 'ant', 'fly', 'flies']
	let di = { herbi, carni, insecti };
	let types = [];
	let contained = [];
	for (const type in di) {
		let arr = di[type];
		for (const a of arr) {
			let w = strRemoveTrailing(a, 's'); //console.log('w',w)
			let o = M.superdi[a];
			if (isdef(o) && words.includes(o.friendly) || words.includes(w)) {
				let cont = {};
				if (o) { cont.key = a; cont.cats = o.cats; cont.friendly = o.friendly }
				else cont.key = w;
				addIf(contained, cont);
				addIf(types, type);
				continue;
			}
		}
	}
	return [contained,types];
}
function extractFoodType(s, easy = true, key = null) {
	s = s.toLowerCase();
	let words = toWords(s, true).map(x => strRemoveTrailing(x, 's'));
	if (easy) {
		for (const t of ['omni', 'herbi', 'carni', 'insecti']) {
			if (s.includes(t)) return t + 'vorous';
		}
	}
	let herbi = M.byCat.plant; herbi = herbi.concat(['plant', 'berries', 'grasses', 'leave', 'tree', 'twig', 'fruit', 'grass', 'grain']);
	let carni = M.byCat.animal; carni = carni.concat(['animal'])
	let insecti = ['insect', 'worm', 'ant', 'fly', 'flies']
	let di = { herbi, carni, insecti };
	let types = [];
	let contained = [];
	for (const type in di) {
		let arr = di[type];
		for (const a of arr) {
			let w = strRemoveTrailing(a, 's'); //console.log('w',w)
			let o = M.superdi[a];
			if (isdef(o) && words.includes(o.friendly) || words.includes(w)) {
				let cont = {};
				if (o) { cont.key = a; cont.cats = o.cats; cont.friendly = o.friendly }
				else cont.key = w;
				addIf(contained, cont);
				addIf(types, type);
				continue;
			}
		}
	}
	if (isEmpty(types)) { return 'unknown' }
	if (types.includes('herbi') && types.length >= 2) return 'omnivorous';
	else if (types.length >= 2) return 'carnivorous';
	else return types[0] + 'vorous';
}

function mPizza(dParent,sz){
	let args = Array.from(arguments).slice(2);
	args = args.map(x=>colorFrom(x))
	if (args.lenght == 0) return mDom(dParent,{w:sz,h:sz,border:'silver',round:true});
	else if (args.length == 1) return mDom(dParent,{bg:args[0],w:sz,h:sz,border:'silver',round:true});
	let html = generatePizzaSvg(sz,...args);
	let el=mCreateFrom(html);
	let d=mDom(dParent,{patop:4}); //,{patop:4});
	mAppend(d,el);
	return el;
}
function mPizza(dParent,sz){
	let args = Array.from(arguments).slice(2);
	args = args.map(x=>colorFrom(x))
	if (args.lenght == 0) return mDom(dParent,{w:sz,h:sz,border:'silver',round:true});
	else if (args.length == 1) return mDom(dParent,{bg:args[0],w:sz,h:sz,border:'silver',round:true});
	let html = generatePizzaSvg(sz,...args);
	let el=mCreateFrom(html);
	let d=mDom(dParent); //,{patop:4});
	mAppend(d,el);
	return d;
}
function generatePizzaSvg(sz) {
	let colors = Array.from(arguments).slice(1);
	let numSlices = colors.length;
	const radius = sz / 2;
	const centerX = radius;
	const centerY = radius;
	const angleStep = (2 * Math.PI) / numSlices;
	const svgParts = [];
	svgParts.push(`<svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}" xmlns="http://www.w3.org/2000/svg">`);
	for (let i = 0; i < numSlices; i++) {
		const startAngle = i * angleStep;
		const endAngle = (i + 1) * angleStep;
		const x1 = centerX + radius * Math.cos(startAngle);
		const y1 = centerY + radius * Math.sin(startAngle);
		const x2 = centerX + radius * Math.cos(endAngle);
		const y2 = centerY + radius * Math.sin(endAngle);
		const largeArcFlag = angleStep > Math.PI ? 1 : 0;
		const pathData = [
			`M ${centerX},${centerY}`, // Move to the center
			`L ${x1},${y1}`,           // Line to the start of the arc
			`A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`, // Arc to the end of the slice
			`Z`                        // Close the path
		].join(' ');
		svgParts.push(`<path d="${pathData}" fill="${colors[i]}" />`);
	}
	svgParts.push('</svg>');
	return svgParts.join('\n');
}

function mCluster(olist,func,fout){
	let res={};
	if (nundef(fout)) fout = x=>x
	for(const o of olist){
		for(const x of func(o)){lookupAddIfToList(res,[x],fout(o))}
	}
	return res;
}
function getAllHabitats(){
	let res=[];
	for(const k in M.details){
		let hab = M.details[k].habitat;
		toWords(hab.toLowerCase()).map(x=>addIf(res,x));
	}
	res.sort();
	
	return res;
}
function extractHabitat(str,ignore=[]){
	let s = str.toLowerCase();
	let habit=[];
	let di=M.habitat;
	for(const k in di){
		if (k == 'geo') continue;
		for(const hab of di[k]){
			if (ignore.includes(hab)) continue;
			if (s.includes(hab)) {addIf(habit,k);break;}
		}
	}
	return habit;
}

function calcOffsprings(str) {
	let s = str.toLowerCase(); s = replaceAll(s, '-', ' '); s = replaceAll(s, ',', '');
	if (s.includes('incub')) s=stringBefore(s,'incub');
	
	//console.log('s',s)
	let arr = allNumbers(s);

	if (isEmpty(arr) && s.includes('hundred') && s.includes('thousand')) {s=s.replace('hundred','100 ');s=s.replace('thousand','1000 ');arr=[100,1000];}
	else if (isEmpty(arr) && s.includes('hundred')) {s=s.replace('hundred','100 ');arr=[100];}
	else if (isEmpty(arr) && s.includes('thousand')) {s=s.replace('thousand','1000 ');arr=[1000];}
	else if (isEmpty(arr) && s.includes('ten')) {s=s.replace('ten','10 ');arr=[10];}
	else if (isEmpty(arr) && s.includes('dozen')) {s=s.replace('dozen','20 ');arr=[20];}

	let words = toWords(s).filter(x=>x!='s');

	//console.log('words',words);

	if (isEmpty(arr)) return 1;
	let newarr = [];
	for (const n of arr) {
		let w = wordAfter(words, n);
		if (isdef(w) && ['day', 'month', 'week', 'year'].some(x => w.includes(x))) break;
		newarr.push(n);
	}
	let num = arrAverage(newarr);
	let text = newarr.length > 1 ? `${newarr[0]}-${newarr[1]} children}` : `${num} child${num == 1 ? '' : 'ren'}`;
	return { str, num, unit: 'child', text };
}
function calcSize(str) {
	return calcNumericInfo(str, { cm: .01, centimeter: .01, centimeters: .01, mm: .001, millimeter: .001, millimeters: .001, meter: 1, meters: 1, m: 1 }, 'm');
}
function calcWeight(str) {
	return calcNumericInfo(str, { kg: 1, kilogram: 1, kilograms: 1, mg: .000001, milligram: .000001, milligrams: .000001, grams: .001, gram: .001, g: .001, ton: 1000, tons: 1000 }, 'kg');
}
function calcNumericInfo(str, diunit, base) {
	if (nundef(str)) return {str:'',num:0,base,text:''};
	let s = str.toLowerCase(); s = replaceAll(s, '-', ' ');
	let words1 = stringSplit(s);
	let words = words1.map(x=>x == 'few' || x == 'several'?3:x); //console.log(words)
	
	let arr = allNumbers(words.join(' ')); //console.log(arr)
	if (isEmpty(arr)) {
		console.log('could NOT find any numbers!!!!')
		return { str, num: 1, unit: base, text: s };
	}
	//console.log(arr)
	let num, unit, text;

	//console.log('str',str,'\ns',s,'\nwords',words);//return null;
	let units = Object.keys(diunit);//console.log('units',units)
	let arrunits=[];
	let unitFound=base;
	for(const n of arr){
		let i=words.indexOf(''+n); //console.log('...',n,arr,words,i); //return;
		unit=arrFindKeywordFromIndex(units,words,i);
		if (unit) {
			unitFound = unit.w; 
		arrunits.push({n,unit:unit.w});
		}//else console.log(arr,n,words,i,unit)
		words = words.slice(i+1);
	}

	//jetzt werden alle zahlen in arr umgerechnet in die entsprechende base unit
	for(const o of arrunits){
		o.nnorm = o.n*diunit[o.unit];
	}

	let avg = arrBalancedAverage(arrunits,'nnorm'); //let av2=arrBalancedAverage(arrunits,'nnorm')
	unit = arrunits[0].unit;
	num = avg/diunit[unit]; 
	text = `${num.toFixed(1)} ${unit}`;
	return {str,num,unit,text,avg};
}


function showCardWingspanPortrait(o, d, sz = 480) {
	let item = { o, key: o.key };
	let card = cBlank(d, { sz, border: 'silver' });
	let dCard = iDiv(card);
	let fa = sz / 480;
	let [rounding, h, w, fz, gap] = [card.rounding, card.h, card.w, 15 * fa, card.w/36];

	let szlt = w / 3;
	let dlt = mDom(dCard, { w: szlt, h: szlt * .9, bg: '#eee' }); mPlace(dlt, 'tl'); dlt.style.borderTopLeftRadius = dlt.style.borderBottomRightRadius = `${rounding}px`; mCenterCenterFlex(dlt);
	showHabitat(dlt, o.ohabitat, 40 * fa);
	mLinebreak(dlt, 4 * fa);
	showFood(dlt, o.foodTokens, szlt, fz);

	let dtitle = mDom(dCard, { paleft: gap,wmax:szlt*1.5 }); mPlace(dtitle, 'tl', szlt, gap)
	mDom(dtitle, { fz: fz * 1.2, weight: 'bold' }, { html: fromNormalized(o.friendly) });
	mDom(dtitle, { fz, 'font-style': 'italic' }, { html: o.species });

	let [szPic, yPic] = [sz / 2, szlt]
	let d1 = showim1(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tr', w / 50, yPic);

	let szPlatz = sz / 30; //Math.max(sz / 40, 8);
	let dPlaetze = showPlaetze(dCard, o.ooffsprings.num, szPlatz);
	mPlace(dPlaetze, 'tl', (w - szPic) / 2, szlt + szPlatz);

	let dbrown = mDom(dCard, { fz:fz*1.2, padding:gap, matop: szlt+szPic+szPlatz, w100: true, bg: 'sienna', fg: 'white', box: true }, { html: 'WHEN ACTIVATED: All players gain 1 food from supply.' })

	let lifespan = calcLifespan(o.lifespan);// console.log('lifespan',lifespan);
	let dlifespan = mDom(dCard, { fz, display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'bl', gap);

	let size = calcSize(o.size);// console.log('lifespan',lifespan);
	let dsize = mDom(dCard, { fz, display: 'inline' }, { html: size.text })
	mPlace(dsize, 'br', gap);

	let value = rChoose(range(1,3))*o.foodTokens.length;
	let dval=mDom(dCard,{fz:fz*1.8,weight:'bold'},{html:value}); mPlace(dval,'tr',2*gap,gap)

}

function arrFindKeywordFromIndex(keywords, words, iStart) {
	//console.log(keywords,words,iStart)
	for (let i = iStart; i < words.length; i++) {
		let w = words[i];
		if (keywords.some(x => x == w)) return { i, w };
	}
	return null;
}
function getDetailedSuperdi(key) {
	let o = M.superdi[key];
	addKeys(M.details[key], o); //console.log('1',o.species)
	addKeys(M.details[o.friendly], o); //console.log('e',o.species)
	o.key = key;

	//specifics
	if (isdef(o.lifespan)) o.olifespan = calcLifespan(o.lifespan);
	if (isdef(o.food)) {
		[o.foodlist,o.foodtype] = extractFoodAndType(o.food); //console.log(key,foodtype)
		let foodTokens = [];
		if (['berries','fruit'].some(x=>o.foodlist.includes(x))) foodTokens.push('../assets/games/wingspan/fruit.svg');
		if (['fish','shrimp','squid'].some(x=>o.foodlist.includes(x))) foodTokens.push('../assets/games/wingspan/fish.svg');
		if (['wheat','grain','crops'].some(x=>o.foodlist.includes(x))) foodTokens.push('../assets/games/wingspan/wheat.svg');
		if (o.foodtype.startsWith('insect')) foodTokens.push('../assets/games/wingspan/worm.svg');
		else if (o.foodtype.startsWith('carni')) foodTokens.push('../assets/games/wingspan/mouse.svg');
		else if (o.foodtype.startsWith('omni')) foodTokens.push('omni');
		else if (o.foodtype.startsWith('herbi')) foodTokens.push('../assets/img/emo/seedling.png');
		o.foodTokens = foodTokens;
	}
	if (isdef(o.offsprings)) o.ooffsprings = calcOffsprings(o.offsprings);
	if (isdef(o.weight)) { o.oweight = calcWeight(o.weight); o.nweight = o.oweight.avg; }
	if (isdef(o.size)) { o.osize = calcSize(o.size); o.nsize = o.osize.avg; }
	if (isdef(o.species)) {
		//console.log(o.species,typeof o.species);
		let x = o.species; o.longSpecies = x; o.species = extractSpecies(x); //console.log(x) 
	}
	if (isdef(o.habitat)) { 
		let text = o.habitat; 
		let ohab= o.ohabitat = { text };
		let hlist = ohab.list = extractHabitat(text,['coastal']);
		let colors = ohab.colors = [];
		let imgs = ohab.imgs = [];
		if (['wetland'].some(x=>hlist.includes(x))) {colors.push('lightblue');imgs.push('../assets/games/wingspan/wetland.png');}
		if (['dwellings','grassland','desert'].some(x=>hlist.includes(x))) 			{colors.push('goldenrod');imgs.push('../assets/games/wingspan/grassland2.png');}
		if (['forest','mountain','ice'].some(x=>hlist.includes(x))) 			{colors.push('emerald');imgs.push('../assets/games/wingspan/forest1.png');}
		//if (['dwellings','ice'].some(x=>hlist.includes(x))) hcolors.push('grey');
	}

	let colors = ['turquoise', 'bluegreen', 'teal', 'brown', 'gray', 'green', 'violet', 'blue', 'black', 'yellow', 'white', 'lavender', 'orange', 'buff', 'red', 'pink', 'golden', 'cream', 'grey', 'sunny', 'beige'];
	if (isdef(o.color)) o.colors = extractColors(o.color, colors);

	o = sortDictionary(o);
	return o;
}
function mClip(shape, d) {
	if (shape == 'circle' || shape == 'ellipse') mStyle(d, { rounding: '50%' });
	else mStyle(d, { 'clip-path': PolyClips[shape] });
}
function showPlaetze(dParent, n, bg) {
	let ch = arrChildren(dParent);
	ch.map(x => mStyle(x, { bg: 'transparent' }));
	arrTake(ch, n).map(x => mStyle(x, { bg }));
}
function showInfoCard(key, d) {

	let o = getDetailedSuperdi(key);

	let sz = 400;
	let [yTitle, yPic, szPic] = [8, sz / 5, sz / 2];
	let [yLifespan, yBrown, hTop] = [yPic + szPic, yPic + szPic + 22, yPic];

	let card = cBlank(d, { h: sz, border: 'dimgray' });
	let dCard = iDiv(card);// console.log(card);

	let d1 = showim1(key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tc', 0, yPic);

	let title = fromNormalized(o.friendly);
	let dtitle = mDom(dCard, { display: 'inline', weight: 'bold' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle);

	let lifespan = calcLifespan(o.lifespan);// console.log('lifespan',lifespan);
	let dlifespan = mDom(dCard, { display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'tr', 40, yLifespan);

	let dbrown = mDom(dCard, { matop: yBrown, w100: true, bg: 'sienna', fg: 'white', padding: 10, box: true }, { html: 'WHEN ACTIVATED: All players gain 1 food from supply.' })

	let foodtype = extractFoodType(o.food); //console.log(key,foodtype)
	let difood = { omnivorous: 'pot_of_food', carnivorous: 'poultry_leg', herbivorous: 'seedling', insectivorous: 'ant' }
	let dfood = mDom(dCard); //,{bg:'silver',round:true,}); //,{},{html:foodtype});
	showim1(difood[foodtype], dfood, { sz: 30 });
	mPlace(dfood, 'tl', 10, 0)

	let weight = calcNumericInfo(o.weight, { kg: 1000, g: 1, mg: .001 }, 'kg');
	let size = calcNumericInfo(o.size, { cm: .01, centimeter: .01, mm: .001, millimeter: .001, meter: 1, m: 1 }, 'm');
	let offs = calcOffsprings(o.offsprings);

	o.foodType = foodtype;
	o.difood = difood;
	o.weight = weight;
	o.size = size;
	o.offsprings = offs;
	//console.log(key,offs.text);

	addKeys(card, o)
	//mLinebreak(d)

	return o;

}
function stringSplit(input) {
	// Split the string at any whitespace character or comma
	return input.split(/[\s,]+/);
}

//#endregion

//#region baui 20.6.24
function extractSpecies(s){
	//console.log(s)
	s = s.toLowerCase();
	let words = toWords(s);
	if (words.length <= 2) {s=s.replace('suborder','');s=s.replace('genus','');return s.trim(); }

	s=s.replace(' x ',', ');
	if (s.includes('hybrid')) return s;

	if (s.includes('including')) return arrTake(toWords(stringAfter(s,'including')),2).join(' ');

	if (s.includes('suborder')) return wordAfter(s,'suborder');

	//if (slower.includes('(')) return 

	let firstTwo = arrTake(words,2).join(' '); //console.log(slower);
	return firstTwo;
}
function showDetailsPresentation(o, dParent) {
	let onew = {};
	//console.log(o);
	let nogo = ['longSpecies','ooffsprings', 'name', 'cats', 'colls', 'friendly', 'ga', 'fa', 'fa6', 'text', 'key', 'nsize', 'nweight', 'img', 'photo']
	for (const k in o) {
		if (nogo.includes(k)) continue;
		let val = o[k];
		let knew = k == 'ofoodtype' ? 'foodtype' : k;
		if (isString(val)) {
			val = replaceAll(val, '>-', '');
			val = val.trim();
			if (val.startsWith("'")) val = val.substring(1);
			if (val.endsWith("'")) val = val.substring(0, val.length - 1);
			if (val.includes(':')) val = stringAfter(val, ':')
			onew[knew] = capitalize(val.trim());
		}
		if (k == 'food') console.log(onew[knew])
	}
	onew = sortDictionary(onew);

	return showObjectInTable(onew,dParent,{ w: window.innerWidth * .8 });
}
function showObjectInTable(onew,dParent,styles={},opts={}){
	let d = mDom(dParent, styles);
	let t = mTable(d);
	for (const k in onew) {
		let r = mCreate('tr');
		mAppend(t, r);
		let col = mCreate('td'); mAppend(r, col); col.innerHTML = `${k}: `;
		col = mCreate('td'); mAppend(r, col); mDom(col, {}, { html: `${onew[k]}` });
	}
	return t;
}

function isAncestorOf(elem, elemAnc) {
	while (elem) {
			if (elem === elemAnc) {
					return true;
			}
			elem = elem.parentNode;
	}
	return false;
}
function getSuperdi(key){ return valf(M.superdi[key],{});}
function getDetails(key){
  let o=getSuperdi(key);
  let de=valf(M.details[key],M.details[o.friendly]); 
  return valf(de,{});

}
function enableDataDrop(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border;
	elem.addEventListener('dragover', ev => { ev.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', ev => { 
		console.log(ev);
		let els=ev.srcElement;
		if (isAncestorOf(els,elem)) return;
		elem.style.border = '2px solid red'; 
	}); // Highlight the border on drag enter
	elem.addEventListener('drop', ev => {
		ev.preventDefault();
		elem.style.border = originalBorderStyle;
		console.log('border', elem.style.border)
		onDropCallback(ev, elem);
	});
}
function arrFindKeywordFromIndex(keywords,words,iStart){
	for(let i=iStart;i<words.length;i++){
		let w= words[i];
		if (keywords.some(x=>x == w)) return {i,w};
	}
	return null;
}
function calcWeight(str){
	return calcNumericInfo(str, { kg: 1, kilogram: 1, kilograms: 1, mg: .000001, milligram: .000001,milligrams: .000001, grams: .001, gram: .001, g: .001, ton:1000, tons:1000 }, 'kg');
}
function calcSize(str){
	return calcNumericInfo(str, { cm: .01, centimeter: .01, centimeters: .01, mm: .001, millimeter: .001, millimeters: .001, meter: 1, meters: 1, m: 1 }, 'm');
}
function arrBalancedAverage(arr,prop){
	if (arr.length != 2) return arrAverage(arr,prop);
	//console.log(arr.map(x=>x[prop]))
	let o=arrMinMax(arr,x=>x[prop]);
	let [min,max]=[o.min,o.max];
	if (max<min*1000) return (min+max)/2;

	//console.log('min',min,'max',max)
	let s=''+max; //console.log('smax',s)
	
	let snew='';
	for(let i=0;i<s.length;i++){
		let ch=s[i];
		if (ch == '0' || ch == '.') snew+=ch; else snew+='1';
	}
	//console.log('snew',snew)
	// let i=0;
	// while(i<s.length && s[i]!=0 && s[i]!='.') i++;
	// let d=s[i]; //Number(s[i]);
	// let snew=s.replace(d,'1'); console.log('snew',snew)
	
	let nnew=Number(snew); //console.log(nnew,typeof nnew)
	return (min+nnew)/2;
	//if (arr.length == 2 && o.max>=o.min*1000) 
}

function getPresentableDetails(o) {
	let di = {};
	for (const key in o) {
		if ('cats colls fa fa6 img photo text key friendly ga name'.includes(key)) continue;
		let val = o[key];
		if (!isLiteral(val)) continue;
		di[key] = val;
	}
	return di;
}
function strRemoveTrailing(s, sub) {
	return s.endsWith(sub) ? stringBeforeLast(s, sub) : s;
}
function extractFoodType(s, easy = true, key = null) {
	s = s.toLowerCase();
	let words = toWords(s, true).map(x => strRemoveTrailing(x, 's'));
	if (easy) {
		for (const t of ['omni', 'herbi', 'carni', 'insecti']) {
			if (s.includes(t)) return t + 'vorous';
		}
	}
	let herbi = M.byCat.plant; herbi = herbi.concat(['plant', 'berries', 'grasses', 'leave', 'tree', 'twig', 'fruit', 'grass', 'grain']);
	let carni = M.byCat.animal; carni = carni.concat(['animal'])
	let insecti = ['insect', 'worm', 'ant', 'fly', 'flies']
	let di = { herbi, carni, insecti };
	let types = [];
	let contained = [];
	for (const type in di) {
		let arr = di[type];
		for (const a of arr) {
			let w = strRemoveTrailing(a, 's'); //console.log('w',w)
			let o = M.superdi[a];

			//if (key == 'stellers_jay') console.log('...', words)

			if (isdef(o) && words.includes(o.friendly) || words.includes(w)) {
				let cont = {};
				if (o) { cont.key = a; cont.cats = o.cats; cont.friendly = o.friendly }
				else cont.key = w;
				addIf(contained, cont); // w); 
				addIf(types, type);
				continue;
			}
		}
	}
	// if (plants.some(x => s.includes(x.substring(0,4)))) types.push('herbi');
	// if (carni.some(x => s.includes(x.substring(0,4)))) types.push('carni');
	//console.log('contained', contained, key)
	if (isEmpty(types)) { return 'unknown' }
	if (types.includes('herbi') && types.length >= 2) return 'omnivorous';
	else if (types.length >= 2) return 'carnivorous';
	else return types[0] + 'vorous';
}
function extractColors(s,colors) {
	let words = toWords(s);
	words = words.map(x => strRemoveTrailing(x, 'ish')).map(x => x.toLowerCase());
	if (nundef(colors)) colors = Object.keys(M.colorByName);

	let res = [];
	//console.log(words)
	for (const w of words) {
		for (const c of colors) {
			//if (c == 'pink') console.log('JAAAAAAAAAA')
			if (w == c) res.push(c);
		}
	}
	return res;

}
function stringBeforeLast(sFull, sSub) {
	//test stringBeforeLast('das ist pinkish','ish')
	let parts = sFull.split(sSub);
	//console.log(parts);
	return sFull.substring(0, sFull.length - arrLast(parts).length - sSub.length);
}
function mNode(o, dParent, title, isSized = false) {
	let d = mCreate('div');
	mYaml(d, o);
	let pre = d.getElementsByTagName('pre')[0];
	pre.style.fontFamily = 'inherit';
	if (isdef(title)) mInsert(d, mText(title));
	if (isdef(dParent)) mAppend(dParent, d);
	if (isDict(o)) d.style.textAlign = 'left';
	if (isSized) addClass(d, 'centered');
	return d;
}
function mYaml(d, js) {
	d.innerHTML = '<pre>' + jsonToYaml(js) + '</pre>';
}
function jsonToYaml(o) { let y = jsyaml.dump(o); return y; }

function showObject(o, keys, dParent, styles = {}, opts={}) {

	if (nundef(keys)) {keys = Object.keys(o);opts.showKeys = true;styles.align='left'}
	addKeys({ align: 'center', padding: 2, bg:'dimgrey', fg: 'contrast' }, styles);

	let d = mDom(dParent, styles, opts);

	let onew={};
	for(const k of keys) onew[k]=o[k];

	mNode(onew,d,opts.title);
	// let html = '';
	// for (const k of keys) { html += (opts.showKeys?k+': ':'') + o[k] + '<br>'; }
	// let d = mDom(dParent, styles, { html });
	return d;
}
//#endregion

//#region baui 17.6.24

function showim1(imgKey, d, styles = {}, opts = {}) {
	let o = lookup(M.superdi, [imgKey]);
	let src;
	if (nundef(o) && imgKey.includes('.')) src = imgKey;
	else if (isdef(o) && isdef(opts.prefer)) src = valf(o[opts.prefer], o.img);
	else if (isdef(o)) src = valf(o.img, o.photo)

	if (nundef(src)) src = rChoose(M.allImages).path;
	//console.log('src', src)
	//let src = valf(lookup(M.superdi, [imgKey, valf(opts.prefer,'img')]), );

	let [w,h]=mSizeSuccession(styles,40);
	addKeys({w,h},styles)
	let img = mDom(d, styles, { tag: 'img', src });
	return img;
}


function wsGetIcon(sym, sz = 30) {
	let html;
	if (nundef(sym)) sym = 'leaf';//rChoose(['omni', 'fish', 'mouse', 'wheat', 'worm', 'cherry']);

	if (sym == 'omni') {
		let colors = toWords('british_racing_green yellow sangria azure gray', true).map(x => colorFrom(x));
		html = generatePizzaSvg(sz, ...colors);
	} else if (sym == 'fish') {
		html = `
			<svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
					<g transform="matrix(1,0,0,1,-700,-300)">
							<g transform="matrix(-10.1636,-1.24469e-15,1.24469e-15,-10.1636,756.948,402.109)">
									<g id="ws-4">
											<path id="fish" d="M0,0.092C0,-0.238 0.267,-0.506 0.598,-0.506C0.927,-0.506 1.195,-0.238 1.195,0.092C1.195,0.422 0.927,0.69 0.598,0.69C0.267,0.69 0,0.422 0,0.092M-11.442,-1.15L-11.442,-1.088C-11.442,-1.037 -11.42,-0.992 -11.408,-0.945C-11.275,-0.465 -10.779,-0.016 -10.771,0.305C-10.756,0.912 -11.504,1.256 -11.586,1.625C-11.586,1.625 -11.667,1.904 -11.559,2.025C-11.499,2.092 -11.42,2.102 -11.337,2.094C-9.921,1.954 -8.259,1.047 -7.839,1.24C-7.419,1.433 -5.796,3.438 -2.936,3.63C-1.327,3.738 1.139,3.412 2.135,2.096C2.368,1.819 2.579,1.517 2.783,1.224C2.876,1.09 2.97,0.957 3.065,0.825C3.225,0.596 3.097,0.387 3.056,0.337C2.902,0.146 2.75,-0.056 2.602,-0.253C2.27,-0.693 1.927,-1.148 1.529,-1.524C-0.167,-3.129 -2.469,-3.646 -4.806,-2.897C-5.842,-2.565 -7.774,-0.907 -7.775,-0.907C-8.289,-0.579 -10.235,-1.284 -11.139,-1.405C-11.214,-1.415 -11.286,-1.421 -11.346,-1.37C-11.406,-1.32 -11.442,-1.237 -11.442,-1.15" style="fill:rgb(0,121,159);fill-rule:nonzero;"/>
									</g>
							</g>
					</g>
			</svg>

		`;
	} else if (sym == 'mouse') {
		html = `
				<svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
						<g transform="matrix(1,0,0,1,-500,-300)">
								<g transform="matrix(9.09451,0,0,9.09451,670.98,392.954)">
										<g id="ws-5">
												<path id="mouse" d="M0,0.136C-0.705,-0.412 -2.127,-0.236 -2.867,-0.095C-2.803,-2.905 -7.442,-5.024 -10.299,-2.45L-11.797,-2.233C-11.131,-3.613 -12.9,-3.994 -13.312,-2.346L-15.426,-0.406C-16.451,0.4 -16.105,1.031 -15.189,1.031C-14.876,1.031 -11.897,1.617 -11.472,2.094C-11.535,2.206 -11.852,2.384 -11.773,2.995L-5.978,3.179C-4.286,2.679 -3.368,1.772 -3.023,0.768C-2.195,0.57 -0.921,0.449 -0.497,0.777C-0.434,0.826 -0.369,0.899 -0.369,1.063C-0.369,1.549 -0.767,1.699 -1.744,1.949C-2.445,2.129 -3.24,2.332 -3.749,2.912C-4.156,3.376 -4.309,3.827 -4.202,4.25C-4.05,4.859 -3.429,5.107 -3.359,5.134C-3.312,5.152 -3.264,5.16 -3.216,5.16C-3.052,5.16 -2.897,5.059 -2.837,4.896C-2.758,4.687 -2.864,4.452 -3.074,4.374C-3.131,4.352 -3.371,4.228 -3.415,4.053C-3.452,3.907 -3.354,3.692 -3.139,3.447C-2.796,3.057 -2.159,2.893 -1.542,2.735C-0.658,2.509 0.442,2.227 0.442,1.063C0.442,0.681 0.289,0.36 0,0.136" style="fill:rgb(116,100,91);fill-rule:nonzero;"/>
										</g>
								</g>
						</g>
				</svg>
			`;
	} else if (sym == 'worm') {
		html = `
				<svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
						<g transform="matrix(1,0,0,1,-300,-100)">
								<g transform="matrix(7.14802,0,0,7.14802,-2977.16,-1174.38)">
										<g id="ws-1">
												<g id="worm">
														<g transform="matrix(1,0,0,1,467.653,195.772)">
																<path d="M0,-8.535C-0.018,-8.351 -0.038,-8.047 -0.036,-7.798C-0.033,-7.536 -0.021,-7.275 0.007,-7.021C0.06,-6.511 0.179,-6.031 0.35,-5.619C0.432,-5.41 0.538,-5.226 0.648,-5.059C0.75,-4.905 0.789,-4.895 0.869,-4.838C1.013,-4.757 1.318,-4.665 1.782,-4.653C2.239,-4.635 2.789,-4.679 3.406,-4.729C3.718,-4.754 4.049,-4.779 4.42,-4.788C4.792,-4.794 5.204,-4.792 5.732,-4.686C6.694,-4.473 7.445,-4.057 8.093,-3.608C8.416,-3.38 8.716,-3.139 8.999,-2.886C9.14,-2.758 9.278,-2.629 9.413,-2.493C9.556,-2.348 9.664,-2.238 9.84,-2.031L9.993,-1.85C10.704,-1.01 10.599,0.248 9.758,0.959C8.918,1.67 7.66,1.564 6.95,0.724C6.866,0.626 6.79,0.513 6.729,0.404C6.711,0.373 6.616,0.251 6.548,0.17C6.473,0.08 6.394,-0.009 6.313,-0.096C6.152,-0.269 5.983,-0.43 5.815,-0.575C5.479,-0.863 5.134,-1.063 4.895,-1.148C4.821,-1.18 4.615,-1.217 4.37,-1.231C4.125,-1.248 3.839,-1.252 3.535,-1.254C2.922,-1.259 2.237,-1.25 1.464,-1.348C0.709,-1.447 -0.233,-1.666 -1.075,-2.345C-1.479,-2.669 -1.84,-3.145 -2.029,-3.534C-2.22,-3.903 -2.374,-4.283 -2.48,-4.66C-2.701,-5.417 -2.79,-6.164 -2.792,-6.886C-2.795,-7.247 -2.774,-7.603 -2.74,-7.957C-2.701,-8.323 -2.657,-8.633 -2.563,-9.056C-2.408,-9.76 -1.711,-10.205 -1.007,-10.049C-0.355,-9.906 0.075,-9.297 0.011,-8.649L0,-8.535Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(-0.516885,-0.856055,-0.856055,0.516885,474.654,198.339)">
																<path d="M-0.369,-0.653C-0.561,-0.652 -0.716,-0.461 -0.716,-0.223C-0.716,0.015 -0.561,0.208 -0.369,0.208C-0.177,0.208 -0.021,0.016 -0.021,-0.223C-0.021,-0.46 -0.177,-0.653 -0.369,-0.653" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(1,0,0,1,474.892,196.692)">
																<path d="M0,1.752C0.014,1.561 0.041,1.419 0.072,1.26C0.114,1.108 0.14,0.954 0.209,0.811C0.272,0.66 0.356,0.52 0.439,0.401C0.515,0.27 0.593,0.149 0.661,0L1.046,0.377C0.917,0.433 0.806,0.524 0.705,0.613C0.614,0.715 0.525,0.806 0.489,0.922C0.451,1.042 0.417,1.168 0.427,1.297C0.431,1.42 0.458,1.564 0.518,1.653L0,1.752Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(0.516885,0.856055,0.856055,-0.516885,479.321,195.111)">
																<path d="M0.369,-0.208C0.561,-0.208 0.716,-0.015 0.716,0.222C0.716,0.461 0.56,0.653 0.369,0.653C0.176,0.653 0.021,0.46 0.021,0.222C0.021,-0.016 0.177,-0.208 0.369,-0.208" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(1,0,0,1,479.355,194.874)">
																<path d="M0,0.679C-0.051,0.585 -0.166,0.495 -0.273,0.434C-0.382,0.364 -0.51,0.336 -0.633,0.314C-0.753,0.293 -0.874,0.329 -1.008,0.362C-1.134,0.41 -1.266,0.465 -1.375,0.554L-1.53,0.038C-1.367,0.047 -1.223,0.034 -1.072,0.028C-0.927,0.01 -0.764,0 -0.602,0.015C-0.443,0.02 -0.295,0.069 -0.14,0.102C0.015,0.148 0.152,0.191 0.329,0.267L0,0.679Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
														</g>
												</g>
										</g>
								</g>
						</g>
				</svg>
				`;
	} else if (sym == 'wheat') {
		html = `
				<svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
						<g transform="matrix(1,0,0,1,-300,-500)">
								<g transform="matrix(7.70232,0,0,7.70232,-3403,-873.691)">
										<g id="ws-6">
												<g id="wheat">
														<g transform="matrix(1,0,0,1,487.796,189.11)">
																<path d="M0,-2.293C0.445,-1.498 1.102,-0.729 1.282,-0.522C1.462,-0.316 3.41,-0.035 4.113,0.01C3.948,-0.403 3.671,-0.749 3.079,-1.281C2.586,-1.724 2.109,-1.963 1.47,-2.084C1.11,-2.152 0.279,-2.303 0,-2.293" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(0.807192,0.590289,0.590289,-0.807192,489.51,186.325)">
																<path d="M0.599,0.015C0.869,0.113 1.467,0.126 1.68,0.173C1.017,0.749 0.85,1.614 0.599,1.67C0.348,1.727 -0.747,1.767 -1.127,1.674C-1.066,1.536 -0.423,0.405 0.599,0.015" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(1,0,0,1,493.462,188.018)">
																<path d="M0,-0.85C-0.107,-1.338 -1.235,-2.168 -1.841,-2.459C-1.935,-2.155 -2.079,-1.594 -2.053,-1.056C-2.024,-0.467 -1.76,0.211 -1.407,0.615C-1.055,1.019 -0.183,1.515 0.13,1.609C0.128,1.597 0.126,1.586 0.124,1.574C-0.042,0.499 0.107,-0.361 0,-0.85" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(1,0,0,1,493.524,194.883)">
																<path d="M0,-2.513C-1.031,-2.522 -1.653,-2.448 -2.565,-2.524C-2.161,-1.814 -1.315,-0.599 -0.557,-0.253C0.201,0.094 1.4,-0.3 2.482,-0.291C2.697,-0.289 3.439,-0.2 3.657,-0.152C3.551,-0.509 3.087,-1.833 2.6,-2.147C1.889,-2.607 1.577,-2.5 0,-2.513" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(1,0,0,1,496.22,189.606)">
																<path d="M0,-0.012C-0.375,-1.259 -1.609,-2.115 -2.317,-2.551C-2.342,-1.879 -2.343,-1.374 -2.21,-0.514C-2.049,0.535 -1.946,0.574 -1.451,1.053C-1.175,1.319 -0.283,2.43 0.145,2.539C0.145,2.539 0.144,0.467 0,-0.012" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(-0.506442,0.862274,0.862274,0.506442,497.305,197.132)">
																<path d="M-1.454,-1.812C-0.793,-3.066 -0.232,-3.44 0.202,-4.508C0.816,-2.36 0.396,0.388 -1.454,1.136C-1.693,1.232 -0.925,0.982 -1.454,1.136C-1.409,0.584 -2.027,-0.726 -1.454,-1.812" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(1,0,0,1,496.942,193.86)">
																<path d="M0,-2.164C-0.197,-0.955 0.514,0.481 0.88,0.901C1.246,1.32 1.926,2.192 2.218,2.336C3.808,0.963 1.265,-2.639 0.213,-3.845C0.017,-4.069 -0.193,-4.287 -0.415,-4.5C-0.415,-4.5 -0.002,-3.337 0,-2.164" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(0.658061,-0.752964,-0.752964,-0.658061,489.682,185.285)">
																<path d="M-1.083,-0.492C-0.929,-0.19 -0.7,0.149 -0.362,0.372C-0.023,0.597 -1.083,2.385 -1.083,2.385C-1.083,2.385 -1.281,0.976 -1.678,0.238C-1.494,0.048 -1.282,-0.197 -1.083,-0.492" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(1,0,0,1,493.645,189.424)">
																<path d="M0,2.503C0.135,2.509 1.42,2.539 1.55,2.55C1.235,2.005 0.612,1.245 0.031,0.771C-0.532,0.313 -1.45,0.27 -2.369,0.204C-2.97,0.161 -3.964,-0.039 -4.563,-0.047C-4.309,0.6 -3.575,1.878 -3.04,2.181C-2.504,2.485 -1.165,2.457 0,2.503" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
														</g>
														<g transform="matrix(1,0,0,1,498.162,197.672)">
																<path d="M0,-0.974C0.138,-0.91 0.295,-0.809 0.427,-0.701C0.564,-0.594 0.684,-0.467 0.803,-0.344C0.906,-0.218 0.995,-0.088 1.06,0.052C1.119,0.181 1.236,0.44 1.251,0.547L2.018,-0.089C1.867,-0.346 1.481,-0.74 1.316,-0.866C0.983,-1.134 0.56,-1.408 0.317,-1.521L0,-0.974Z" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
														</g>
												</g>
										</g>
								</g>
						</g>
				</svg>
			`;
	} else if (sym == 'mouse') {
		html = `
							<svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
									<g transform="matrix(1,0,0,1,-500,-300)">
											<g transform="matrix(9.09451,0,0,9.09451,670.98,392.954)">
													<g id="ws-5">
															<path id="mouse" d="M0,0.136C-0.705,-0.412 -2.127,-0.236 -2.867,-0.095C-2.803,-2.905 -7.442,-5.024 -10.299,-2.45L-11.797,-2.233C-11.131,-3.613 -12.9,-3.994 -13.312,-2.346L-15.426,-0.406C-16.451,0.4 -16.105,1.031 -15.189,1.031C-14.876,1.031 -11.897,1.617 -11.472,2.094C-11.535,2.206 -11.852,2.384 -11.773,2.995L-5.978,3.179C-4.286,2.679 -3.368,1.772 -3.023,0.768C-2.195,0.57 -0.921,0.449 -0.497,0.777C-0.434,0.826 -0.369,0.899 -0.369,1.063C-0.369,1.549 -0.767,1.699 -1.744,1.949C-2.445,2.129 -3.24,2.332 -3.749,2.912C-4.156,3.376 -4.309,3.827 -4.202,4.25C-4.05,4.859 -3.429,5.107 -3.359,5.134C-3.312,5.152 -3.264,5.16 -3.216,5.16C-3.052,5.16 -2.897,5.059 -2.837,4.896C-2.758,4.687 -2.864,4.452 -3.074,4.374C-3.131,4.352 -3.371,4.228 -3.415,4.053C-3.452,3.907 -3.354,3.692 -3.139,3.447C-2.796,3.057 -2.159,2.893 -1.542,2.735C-0.658,2.509 0.442,2.227 0.442,1.063C0.442,0.681 0.289,0.36 0,0.136" style="fill:rgb(116,100,91);fill-rule:nonzero;"/>
													</g>
											</g>
									</g>
							</svg>
						`;
	} else if (sym == 'leaf') {
		html = `<img width="${sz}" height="${sz}" src='../assets/img/emo/seedling.png' />`;
	} else { //cherry
		html = `
				<svg width="${sz}" height="${sz}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
						<g transform="matrix(1,0,0,1,-300,-300)">
								<g transform="matrix(8.59167,0,0,8.59167,432.85,422.626)">
										<g id="ws-3">
												<path id="berries" d="M0,-5.356C-0.427,-5.356 -0.825,-5.247 -1.184,-5.07L-1.487,-6.86C-1.18,-7.11 -0.839,-7.331 -0.47,-7.508C0.341,-7.901 1.273,-8.154 2.148,-8.241L2.17,-8.243C2.227,-8.249 2.283,-8.262 2.338,-8.282C2.695,-8.415 2.877,-8.811 2.745,-9.168C2.612,-9.524 2.216,-9.706 1.859,-9.574C0.872,-9.208 -0.018,-8.809 -0.897,-8.288C-1.327,-8.022 -1.751,-7.73 -2.127,-7.365C-2.478,-7.028 -2.813,-6.676 -3.154,-6.309C-3.37,-6.078 -3.566,-5.826 -3.752,-5.566C-3.756,-5.566 -3.759,-5.568 -3.763,-5.568L-5.106,-5.582C-5.308,-6.864 -6.41,-7.847 -7.749,-7.847C-9.233,-7.847 -10.435,-6.645 -10.435,-5.162C-10.435,-3.679 -9.233,-2.476 -7.749,-2.476C-6.304,-2.476 -5.134,-3.62 -5.074,-5.051L-4.184,-4.886C-4.394,-4.515 -4.579,-4.131 -4.719,-3.739C-4.942,-3.129 -5.117,-2.511 -5.27,-1.883C-6.879,-1.753 -8.148,-0.421 -8.148,1.221C-8.148,2.949 -6.748,4.35 -5.019,4.35C-3.291,4.35 -1.89,2.949 -1.89,1.221C-1.89,-0.297 -2.973,-1.562 -4.408,-1.846C-4.278,-2.39 -4.122,-2.933 -3.938,-3.457C-3.647,-4.336 -3.233,-5.136 -2.609,-5.816C-2.452,-5.994 -2.279,-6.162 -2.1,-6.327L-1.724,-4.714C-2.307,-4.221 -2.686,-3.493 -2.686,-2.67C-2.686,-1.187 -1.483,0.016 0,0.016C1.484,0.016 2.686,-1.187 2.686,-2.67C2.686,-4.153 1.484,-5.356 0,-5.356" style="fill:rgb(152,21,49);fill-rule:nonzero;"/>
										</g>
								</g>
						</g>
				</svg>
			`;
	}
	return mCreateFrom(html);
}
function generatePizzaSvg(sz) {
	// // Example usage:
	// const diameter = 100;
	// const numSlices = 5;
	// const colors = ["red", "yellow", "green", "blue", "gray"];
	// const svgCode = generatePizzaSVG(diameter, numSlices, colors);
	// console.log(svgCode);
	let colors = Array.from(arguments).slice(1);
	let numSlices = colors.length;
	if (colors.length !== numSlices) {
		throw new Error("The number of colors must match the number of slices.");
	}

	const radius = sz / 2;
	const centerX = radius;
	const centerY = radius;
	const angleStep = (2 * Math.PI) / numSlices;
	const svgParts = [];

	// SVG header
	svgParts.push(`<svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}" xmlns="http://www.w3.org/2000/svg">`);

	for (let i = 0; i < numSlices; i++) {
		const startAngle = i * angleStep;
		const endAngle = (i + 1) * angleStep;

		const x1 = centerX + radius * Math.cos(startAngle);
		const y1 = centerY + radius * Math.sin(startAngle);
		const x2 = centerX + radius * Math.cos(endAngle);
		const y2 = centerY + radius * Math.sin(endAngle);

		const largeArcFlag = angleStep > Math.PI ? 1 : 0;

		const pathData = [
			`M ${centerX},${centerY}`, // Move to the center
			`L ${x1},${y1}`,           // Line to the start of the arc
			`A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`, // Arc to the end of the slice
			`Z`                        // Close the path
		].join(' ');

		svgParts.push(`<path d="${pathData}" fill="${colors[i]}" />`);
	}

	// SVG footer
	svgParts.push('</svg>');

	return svgParts.join('\n');
}
function calcLifespan(s) {

	let arr = allNumbers(s, Math.abs);
	let num, unit, lifespan;
	if (!isEmpty(arr)) {
		if (arr.length > 2) arr = arr.slice(0, 2)
		let n = arrAverage(arr);
		unit = s.includes('year') ? 'y' : s.includes('month') ? 'm' : s.includes('week') ? 'w' : s.includes('day') ? 'd' : s.includes('hour') ? 'h' : 'y';
		num = calcYears(n, unit);
		lifespan = yearsToReadable(num);
	} else {
		let s1 = s.toLowerCase();
		let words = toWords(s1); //console.log('words',words)
		if (s1.includes('a few')) {
			unit = wordAfter(words, 'few');
			let n = calcYears(3, unit);
			arr.push(n);
		}

		if (s1.includes('several')) {
			unit = wordAfter(words, 'several'); //console.log('unit',unit)
			let n = calcYears(3, unit);
			arr.push(n);
			let next = wordAfter(words, unit); //console.log('...',next)
			if (next == 'to') {
				//console.log('jaaaaaaaaaaaaaaaa')
				unit = wordAfter(words, 'to'); //console.log('unit',unit)
				if (['day', 'week', 'month', 'year'].some(x => unit.startsWith(x))) {
					let n = calcYears(3, unit);
					arr.push(n);
				}
			}
		}

		let di = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, fifteen: 15, twenty: 20 };
		for (const w of Object.keys(di)) {
			if (s.includes(w)) {
				let n = calcYears(di[w], stringAfter(s, w));
				arr.push(n);
			}
		}

		let n = arrAverage(arr);
		unit = 'year';
		lifespan = yearsToReadable(n);
		//let nums = allNumbers(lifespan); console.log('nums',nums)
		num = allNumbers(lifespan)[0];
		unit = stringAfter(lifespan, ' ');
	}

	unit = unit[0];
	return { s, lifespan, num, unit };
}
function calcOffsprings(str) {

	let s = str.toLowerCase(); s = replaceAll(s, '-', ' '); s = replaceAll(s, ',', '');
	let arr = allNumbers(s);
	let words = toWords(s);

	if (isEmpty(arr)) return 1;

	let newarr = [];
	for (const n of arr) {
		let w = wordAfter(words, n);
		if (isdef(w) && ['day', 'month', 'week', 'year'].some(x => w.includes(x))) break;
		newarr.push(n);
	}

	let num = arrAverage(newarr);
	let text = newarr.length == 1 ? `${newarr[0]}-${newarr[1]} children}` : `${num} children`;
	return { str, num, unit: 'child', text };

}
function calcNumericInfo(str, diunit, base) {

	let s = str.toLowerCase(); s = replaceAll(s, '-', ' ');
	let arr = allNumbers(s);

	//console.log(arr)

	//assertion(!isEmpty(arr));
	if (isEmpty(arr)) return { str, num: 1, unit: base, text: s };

	let num, unit, text;
	for (const k in diunit) {
		unit = k; //diunit[k];
		if (s.includes(unit)) {
			let arr = allNumbers(s, Math.abs);
			let n = arrAverage(arr);
			text = `${n.toFixed(1)} ${unit}`;
			num = n * diunit[k];
			return { s, num, unit, text };
		}
	}
	return { s, num: 1, unit: base, text: s };
}
function calcYears(n, unit) {
	let ch = unit[0];
	let frac = ch == 'y' ? 1 : ch == 'm' ? 12 : ch == 'w' ? 52 : ch == 'd' ? 365 : ch == 'h' ? 365 * 24 : 1;
	return n / frac;
}
function extractFoodType(s) {
	s = s.toLowerCase();
	for (const t of ['omni', 'herbi', 'carni', 'insecti']) {
		if (s.includes(t)) return t + 'vorous';
	}
	let plants = M.byCat.plant; plants = plants.concat(['leave', 'tree', 'twig', 'fruit', 'grass', 'grain']);
	let carni = M.byCat.animal;

	let types = [];
	if (plants.some(x => s.includes(x))) types.push('herbi');
	if (carni.some(x => s.includes(x))) types.push('carni');
	if (isEmpty(types)) { console.log(s); return 'unknown' }
	if (types.length >= 2) return 'omnivorous';
	else return types[0] + 'vorous';

}
function findAllFoodTypes() {
	let res = [];
	for (const k in M.details) {
		let o = M.details[k];
		//console.log(k,o.food);
		let food = o.food.toLowerCase();
		let type = null;
		for (const t of ['omni', 'herbi', 'carni', 'insecti']) {
			if (food.includes(t)) type = t;
		}
		if (!type) type = food;
		addIf(res, type);
	}
	return res;
}
function wordAfter(arr, w) {
	if (isString(arr)) arr = toWords(arr);
	let i = arr.indexOf(w);
	return i >= 0 && arr.length > i ? arr[i + 1] : null;
}
function yearsToReadable(n) {
	let di = { y: 1, m: 12, w: 52, d: 365, h: 365 * 24 };
	if (n > 1) return n.toFixed(1) + ' years';
	if (n * 12 > 1) return (n * 12).toFixed(1) + ' months';
	if (n * 52 > 1) return (n * 52).toFixed(1) + ' weeks';
	if (n * 365 > 1) return (n * 365).toFixed(1) + ' days';
	return (n * 365 * 24).toFixed(1) + ' hours';
}

function mPlace(elem, pos, offx, offy) {
	//console.log('___pos',pos,'offx',offx,'offy',offy);
	elem = toElem(elem);
	pos = pos.toLowerCase();
	let dParent = elem.parentNode; mIfNotRelative(dParent);
	let hor = valf(offx, 0);
	let vert = isdef(offy) ? offy : hor;
	if (pos[0] == 'c' || pos[1] == 'c') {
		let dpp = dParent.parentNode;
		let opac = mGetStyle(dParent, 'opacity'); //console.log('opac', opac);
		if (nundef(dpp)) { mAppend(document.body, dParent); mStyle(dParent, { opacity: 0 }) }
		let rParent = getRect(dParent);
		let [wParent, hParent] = [rParent.w, rParent.h];
		let rElem = getRect(elem);
		let [wElem, hElem] = [rElem.w, rElem.h];
		if (nundef(dpp)) { dParent.remove(); mStyle(dParent, { opacity: valf(opac, 1) }) }
		switch (pos) {
			case 'cc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, top: vert + (hParent - hElem) / 2 }); break;
			case 'tc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, top: vert }); break;
			case 'bc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, bottom: vert }); break;
			case 'cl': mStyle(elem, { position: 'absolute', left: hor, top: vert + (hParent - hElem) / 2 }); break;
			case 'cr': mStyle(elem, { position: 'absolute', right: hor, top: vert + (hParent - hElem) / 2 }); break;
		}
		//for(const st of ['top','bottom','left','right']) console.log(st,elem.style[st]);
		return;
	}
	let di = { t: 'top', b: 'bottom', r: 'right', l: 'left' };
	elem.style.position = 'absolute';
	let kvert=di[pos[0]],khor=di[pos[1]];
	elem.style[kvert] = vert + 'px'; elem.style[khor] = hor + 'px';
	//console.log(kvert,elem.style[kvert],khor,elem.style[khor])
}


























//#endregion

//#region baui 15.6.24

function fillMultiForm(dict,inputs,wIdeal,df,styles,opts){
	mClear(df);
	for (const k in dict) {
		let [content, val] = [k, dict[k]];
		mDom(df, {}, { html: `${content}:` });
		let inp = mDom(df, styles, opts);
		inp.rows = calcRows(styles.fz, styles.family, val, wIdeal); //console.log('rows',inp.rows)
		inp.value = val;
		inputs.push({ name: content, inp: inp });
		mNewline(df)
	}

}

function uiGadgetTypeMultiText(dParent, dict, resolve, styles = {}, opts = {}) {
	let inputs = [];
	let wIdeal = 500;
	let formStyles = { maleft: 10, wmin: wIdeal, padding: 10, bg: 'white', fg: 'black' };
	// let form = mDom(dParent, formStyles, { tag: 'form', method: null, action: "javascript:void(0)" })
	let form = mDom(dParent, formStyles, {})
	
	addKeys({ className: 'input', tag: 'textarea', }, opts);
	addKeys({ fz: 14, family: 'tahoma', w: wIdeal, resize: 'none' }, styles);

	let df=mDom(form);
	let db = mDom(form, { vmargin: 10, align: 'right' });
	mButton('Cancel', ev => resolve(null), db, { classes: 'button', maright: 10 });
	mButton('Save', ev => {
		let di = {};
		inputs.map(x => di[x.name] = x.inp.value);
		resolve(di);
	}, db, { classes: 'button', maright: 10 });

	if (isEmpty(dict)){
		fillFormFromObject(inputs,wIdeal, df,db,styles,opts);
	}else{
		fillMultiForm(dict,inputs,wIdeal,df,styles,opts);
	}
	// for (const k in dict) {
	// 	let [content, val] = [k, dict[k]];
	// 	mDom(form, {}, { html: `${content}:` });
	// 	let inp = mDom(form, styles, opts);
	// 	inp.rows = calcRows(styles.fz, styles.family, val, wIdeal); //console.log('rows',inp.rows)
	// 	inp.value = val;
	// 	inputs.push({ name: content, inp: inp });
	// 	mNewline(form)
	// }
	//mButton('Paste Object', ev => fillFormFromObject(inputs,wIdeal, df,styles,opts), db, { classes: 'button', maright: 10 });

	// mDom(db, { maright:10,className:'button' }, { tag: 'input', type: 'button', value:'Paste Object', onclick:ev=>fillFormFromObject(ev,inputs,form) });
	// mDom(db, { maright:10,className:'button' }, { tag: 'input', type: 'button', value:'Cancel', onclick:()=>resolve(null) });
	// mDom(db, { className:'button' }, { tag: 'input', type: 'submit', value:'Save' });
	//mButton('done', handler, dOuter, { classes: 'input', margin: 10 });
	// let handler = () => resolve(getCheckedNames(ui)); //.join('@'));
	// form.onsubmit = ev => {
	// 	ev.preventDefault();
	// 	let di = {};
	// 	inputs.map(x => di[x.name] = x.inp.value);
	// 	resolve(di);
	// }
	return form;
}

function fillFormFromObject(inputs, wIdeal, df,db, styles, opts) {
	let popup = mDom(df,{margin:10}); //mPopup(df, { margin: 100 }); //mStyle(popup,{left:10})
	mDom(popup, {}, { html: 'paste your information into the text area' })
	let ta = mDom(popup, {}, { tag: 'textarea', rows: 20, cols: 80 });
	mButton('Fill Form', () => { onclickPasteDetailObject(ta.value, inputs, wIdeal, df, styles, opts); }, db, { maright: 10 },'button','bParseIntoForm');
}
function onclickPasteDetailObject(text, inputs, wIdeal, df, styles, opts) {
	//each inpu is of the form:{name,inp}, inp is the element
	//console.log('text', text);
	//console.log(inputs)

	function parseToInputs(o) {
		let keys = Object.keys(o); //console.log('keys',keys);
		//console.log(o);
		if (keys.length == 1) { o = o[keys[0]]; }//console.log('new o is', o); }
		let onorm = {};
		for (const k in o) {
			let k1 = normalizeString(k);
			onorm[k1] = o[k];
		}
		if (isEmpty(inputs)) {
			mBy('bParseIntoForm').remove();
			fillMultiForm(o,inputs,wIdeal,df,styles,opts);
		} else {
			for (const oinp of inputs) {
				let k = normalizeString(oinp.name);
				if (isdef(o[k])) oinp.inp.value = o[k];
			}
		}
		//popup.remove();
	}

	try {
		let o = jsyaml.load(text);
		if (isdef(o)) parseToInputs(o);
		//console.log('object',o)
	} catch {
		try {
			let o = JSON.parse(text);
			if (isdef(o)) parseToInputs(o);
		} catch { showMessage('text cannot be parsed into yaml or json object!') }
	}

}

async function onclickEditDetails(){
	let key = UI.selectedImages[0];
	let cmd = UI.commands.simpleNew;
	await editDetailsFor(key,iDiv(cmd));
}
async function editDetailsFor(key,anchor){

	let details = detailsForKey(key);
	let di = detailsPresentDict(details); //console.log('details',key,di,isEmpty(di))

	let result = await mGather(anchor,{},{content:di,type:'multiText',title:M.superdi[key].friendly});

	//console.log('result',result);
	if (!result) return;
	//jetzt brauch ich echt ein updateDetails!!!!
	let res = await updateDetails(result,key);
	//console.log('res',res)
	//M.details[key]=res;
	//das object ist complete
	//return result;
}

async function simpleOnDroppedItem(itemOrKey, key, sisi) {
	//console.log(itemOrKey)
	if (nundef(sisi)) sisi = UI.simple;
	let item;
	if (isString(itemOrKey)) { key = itemOrKey; item = M.superdi[key]; } else { item = itemOrKey; }
	//console.log('===>',key, item)
	assertion(isdef(key), 'NO KEY!!!!!');

	lookupAddIfToList(item, ['colls'], sisi.name);

	let o = M.superdi[key]; //console.log(key, item, o, sisi)
	//assertion(nundef(o) || o == item, "DISPARITY!!!!!!!!!!!!!!!!!!!!!")
	// let list = item.colls;
	if (isdef(o)) { //} && list.includes(sisi.name)) { 
		//check if any changes to o in item
		console.log(`HA! ${key} already there`);
		let changed = false;
		for (const k in item) {
			let val = item[k];
			if (isLiteral(val) && o[k] != item[k]) { changed = true; break; }
			else if (isList(val) && !sameList(val, o[k])) { changed = true; break; }
		}
		if (!changed) return;
	}// dropped item into same collection!!!
	console.log(`........But changed!!!`);
	//addIf(item.colls, sisi.name);
	let di = {}; di[key] = item;
	await updateSuperdi(di);
	simpleInit(sisi.name, sisi)
}

async function updateSuperdi(di, key) {
	//console.log('send postUpdateSuperdi', { di })
	let res = await mPostRoute('postUpdateSuperdi', { di });
	//console.log('postUpdateSuperdi', res)
	await loadAssets();
}

function getImageData(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'Anonymous'; // To avoid CORS issues
		img.src = src;

		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);
			let data = canvas.toDataURL('image/png');
			resolve(data);
			// const imageData = ctx.getImageData(0, 0, img.width, img.height);
			// resolve(imageData);
		};

		img.onerror = (err) => {
			reject(new Error('Failed to load image'));
		};
	});
}
async function simpleFinishEditing(canvas, dPopup, inpFriendly, inpCats, sisi) {
	const dataUrl = canvas.toDataURL('image/png'); //davon jetzt die dataUrl!
	if (isEmpty(inpFriendly.value)) inpFriendly.value = 'pic'
	let friendly = inpFriendly.value;

	let [name, imgname] = findUniqueSuperdiKey(friendly);

	console.log('key name will be', name, imgname);
	//console.log('NIX PASSIERT!!!! key name will be',name,imgname); return;
	let key = name, filename = name + '.png';
	//name ist unique! oder ich hab noch das slot fuer img oder photo available
	//let filename = (isdef(M.superdi[friendly]) ? 'i' + getTimestamp() : friendly) + '.png'; //console.log('filename', filename);
	let o = { image: dataUrl, coll: sisi.name, filename };
	let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!
	filename = resp.filename;
	let imgPath = `../assets/img/${sisi.name}/${filename}`;
	let cats = extractWords(valf(inpCats.value, ''));
	let item = isdef(M.superdi[key])?jsCopy(M.superdi[key]): { key, friendly, cats, colls: [] };
	//addIf(item.colls, sisi.name);
	item[valf(imgname, 'img')] = imgPath;

	dPopup.remove();
	//console.log('NOT saving item',item); return;
	//console.log('saving',item)
	await simpleOnDroppedItem(item, key, sisi);
}

function findUniqueSuperdiKey(friendly) {
	console.log('friendly', friendly)
	let name = friendly;
	let i = 1;
	let imgname = null;
	while (true) {
		let o = M.superdi[name];
		if (nundef(o)) { break; }
		console.log(o.colls.includes('emo'))
		if (isdef(o.img) && isdef(o.photo) || ['emo', 'fa6', 'icon'].every(x => !o.colls.includes(x))) { name = friendly + (i++); continue; }
		else if (isdef(o.img)) { imgname = 'photo'; break; }
		else { imgname = 'img'; break; }
	}
	return [name, imgname];
}




function calcRows(fontSize, fontFamily, content, maxWidth) {

	// // Example usage:
	// const ta = document.createElement('textarea'); // or any other reference element
	// const fontSize = 16;
	// const fontFamily = 'Arial';
	// const content = 'This is a sample content to test the number of rows needed to fit this text within the given maximum width.';
	// const maxWidth = 200;

	// console.log(calcRows(fontSize, fontFamily, content, maxWidth));

	// Create an off-screen canvas to measure text width
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	// Set the font properties on the context
	ctx.font = `${fontSize}px ${fontFamily}`;

	// Split the content into words
	const words = content.split(' ');
	let line = '';
	let rows = 0;

	// Measure each word
	for (let i = 0; i < words.length; i++) {
		const testLine = line + words[i] + ' ';
		const metrics = ctx.measureText(testLine);
		const testWidth = metrics.width;

		if (testWidth > maxWidth && i > 0) {
			// When the line is too wide, count the line and start a new line
			rows++;
			line = words[i] + ' ';
		} else {
			// Continue adding words to the current line
			line = testLine;
		}
	}

	// Count the last line
	if (line.length > 0) {
		rows++;
	}

	return rows;
}


function detailsForKey(key) {
	let o = M.superdi[key];
	addKeys(M.details[key], o);
	addKeys(M.details[o.friendly], o)
	return o;
}
function detailsPresentDict(o) {
	let di = {};
	for (const key in o) {
		if ('cats colls fa fa6 img photo text key friendly ga name'.includes(key)) continue;
		let val = o[key];
		if (!isLiteral(val)) continue;
		di[key] = val;
	}
	return di;

}


function simpleSidebar(wmin) {
	mStyle('dLeft', { wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;
	let stylesTitles = { matop: 10, bg: '#ffffff80', fg: 'black' };

	let cmds = {};
	//mDom(d,stylesTitles,{html:'Collection:'});
	cmds.simpleNew = mCommand(d, 'simpleNew', 'New'); mNewline(d, gap);

	mDom(d, stylesTitles, { html: 'Selection:' })
	cmds.simpleSelectAll = mCommand(d, 'simpleSelectAll', 'Select All'); mNewline(d, gap);
	cmds.simpleSelectPage = mCommand(d, 'simpleSelectPage', 'Select Page'); mNewline(d, gap);
	cmds.simpleClearSelections = mCommand(d, 'simpleClearSelections', 'Clear Selection', { fSel: x => x >= 1 }); mNewline(d, gap);

	mDom(d, stylesTitles, { html: 'Item:' })
	cmds.setAvatar = mCommand(d, 'setAvatar', 'Set Avatar', { fSel: x => x == 1 }); mNewline(d, gap);
	cmds.editDetails = mCommand(d, 'editDetails', 'Edit Details', { fSel: x => x == 1 }); mNewline(d, gap);

	mDom(d, stylesTitles, { html: 'Items:' })
	cmds.addSelected = mCommand(d, 'addSelected', 'Add To', { fSel: x => (x >= 1) }); mNewline(d, gap);
	cmds.simpleRemove = mCommand(d, 'simpleRemove', 'Remove', { fSel: x => (!simpleLocked() && x >= 1) }); mNewline(d, gap);

	// UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d, gap);
	// UI.removeCategory = mCommand(d, 'removeCategory', 'Remove Category'); mNewline(d, gap);
	// UI.addCategory = mCommand(d, 'addCategory', 'Add Category'); mNewline(d, gap);
	// UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete Selected'); mNewline(d, 3 * gap);
	// UI.asSecondary = mCommand(d, 'asSecondary', 'Edit Collection'); mNewline(d, gap);
	// UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection'); mNewline(d, gap);
	// UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection'); mNewline(d, 3 * gap);
	// simpleDisableListCommands();
	// simpleDisableItemCommands();
	copyKeys(cmds, UI.commands);
	simpleCheckCommands();
}

function createPanZoomCanvas(parentElement, src, wCanvas, hCanvas) {
	const canvas = document.createElement('canvas');
	canvas.width = wCanvas;
	canvas.height = hCanvas;
	parentElement.appendChild(canvas);
	const ctx = canvas.getContext('2d');
	let image = new Image();
	image.src = src;

	// Variables for panning and zooming
	let scale = 1;
	let originX = 0;
	let originY = 0;
	let startX = 0;
	let startY = 0;
	let isDragging = false;

	image.onload = () => {

		if (image.width<canvas.width) canvas.width=image.width;
		if (image.height<canvas.height) canvas.height=image.height;

		// Calculate the scale to fit the smaller side of the image to the canvas
		const scaleX = canvas.width / image.width;
		const scaleY = canvas.height / image.height;
		scale = Math.min(scaleX, scaleY, 1);

		// Center the image initially
		originX = (canvas.width - image.width * scale) / 2;
		originY = (canvas.height - image.height * scale) / 2;

		draw();
	};

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(originX, originY);
		ctx.scale(scale, scale);
		ctx.drawImage(image, 0, 0);
		ctx.restore();
	}

	// Mouse events for panning
	canvas.addEventListener('mousedown', (e) => {
		isDragging = true;
		startX = e.clientX - originX;
		startY = e.clientY - originY;
		canvas.style.cursor = 'grabbing';
	});

	canvas.addEventListener('mousemove', (e) => {
		if (isDragging) {
			originX = e.clientX - startX;
			originY = e.clientY - startY;
			draw();
		}
	});

	canvas.addEventListener('mouseup', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	canvas.addEventListener('mouseout', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	// Mouse wheel event for zooming
	canvas.addEventListener('wheel', (e) => {
		e.preventDefault();
		const zoom = Math.exp(e.deltaY * -0.0005);
		scale *= zoom;
		if (scale >= 1) scale = 1;

		// Zoom relative to the mouse pointer
		const mouseX = e.clientX - canvas.offsetLeft;
		const mouseY = e.clientY - canvas.offsetTop;
		originX = mouseX - (mouseX - originX) * zoom;
		originY = mouseY - (mouseY - originY) * zoom;

		draw();
	});

	// Touch events for mobile support
	let touchStartX = 0;
	let touchStartY = 0;

	canvas.addEventListener('touchstart', (e) => {
		if (e.touches.length === 1) {
			isDragging = true;
			touchStartX = e.touches[0].clientX - originX;
			touchStartY = e.touches[0].clientY - originY;
			canvas.style.cursor = 'grabbing';
		}
	});

	canvas.addEventListener('touchmove', (e) => {
		if (e.touches.length === 1 && isDragging) {
			originX = e.touches[0].clientX - touchStartX;
			originY = e.touches[0].clientY - touchStartY;
			draw();
		}
	});

	canvas.addEventListener('touchend', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	// // Save button event
	// saveButton.addEventListener('click', () => {
	// 	const dataURL = canvas.toDataURL('image/png');
	// 	const link = document.createElement('a');
	// 	link.href = dataURL;
	// 	link.download = 'canvas-image.png';
	// 	link.click();
	// });

	return canvas;
}
async function simpleOnDroppedUrl(src, sisi) {

	let sz = 400;
	let dPopup = mDom(document.body, { position: 'fixed', top: 40, left: 0, wmin: sz, hmin: sz, bg: 'pink' });
	let dParent = mDom(dPopup);

	let d = mDom(dParent, { w: sz, h: sz, border: 'dimgray', margin: 10 });
	let canvas = createPanZoomCanvas(d, src, sz, sz);

	let instr = mDom(dPopup, { align: 'center', mabot: 10 }, { html: `- panzoom image to your liking -` })

	let dinp = mDom(dPopup, { padding: 10, align: 'right', display: 'inline-block' })
	mDom(dinp, { display: 'inline-block' }, { html: 'Name: ' });
	let inpFriendly = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'friendly', tag: 'input', type: 'text', placeholder: `<enter name>` });
	let defaultName = '';
	let iDefault = 1;
	let k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`);
	while (isdef(k)) { iDefault++; k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`); }
	defaultName = `${sisi.name}${iDefault}`;
	inpFriendly.value = defaultName;
	mDom(dinp, { h: 1 });
	mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
	let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });

	// mLinebreak(dinp);
	// let ta = mDom(dinp,{w:sz},{tag:'textarea',rows:10,value:''})

	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('Cancel', () => dPopup.remove(), db2, { w: 70 }, 'input');
	mButton('Save', () => simpleFinishEditing(canvas, dPopup, inpFriendly, inpCats, sisi), db2, { w: 70 }, 'input');
}
function savePanZoomCanvas(canvas) {
	if (canvas) {
		const dataURL = canvas.toDataURL('image/png');
		const link = document.createElement('a');
		link.href = dataURL;
		link.download = 'canvas-image.png';
		link.click();
	}
}

//#region 13.6.24 alles bau1 bau2 bau3 bau4



function showImagePartial(dParent, image, x, y, w, h, left, top, wShow, hShow, wCanvas, hCanvas) {

	mClear(dParent)
	let canvas = mDom(dParent, {}, { tag: 'canvas' }); //console.log('left', left, 'top', top)
	//const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// Set canvas size to the specified width and height
	canvas.width = wCanvas;
	canvas.height = hCanvas;

	// Draw the specified part of the image onto the canvas
	ctx.drawImage(image, x, y, w, h, left, top, wShow, hShow);
}

function isExactly(n, num = 1) { return n == num; }
function isAtLeast(n, num = 1) { return n >= num; }
async function onclickAddSelected() {
	let keys = UI.selectedImages;
	let cmd = UI.commands.addSelected;
	let collist = M.collections.filter(x => !simpleLocked(x)).map(x => ({ name: x, value: false }));
	let result = await mGather(iDiv(cmd), {}, { content: collist, type: 'checkList' });
	if (!result || isEmpty(result)) { console.log('nothing added'); simpleClearSelections(); return; }

	//console.log('result',result,keys); //return;
	assertion(isList(result), 'uiCadgetTypeChecklist result is NOT a list!!!')
	let di = {}, changed = false;
	for (const key of keys) {
		let o = M.superdi[key];
		for (const collname of result) {
			if (o.colls.includes(collname)) continue;
			changed = true;
			o.colls.push(collname);
			di[key] = o;
		}
	}
	if (!changed) { console.log('nothing added'); simpleClearSelections(); return; }
	console.log('items changed:', Object.keys(di));
	await updateSuperdi(di);
	simpleInit();
}
function simpleCheckCommands() {
	if (nundef(UI.selectedImages)) UI.selectedImages = [];
	let n = UI.selectedImages.length;
	for (const k in UI.commands) {
		let cmd = UI.commands[k];
		if (nundef(cmd) || nundef(iDiv(cmd))) continue;

		//console.log(cmd)
		//let x = cmd.fSel(n);console.log('k',k,cmd,x)
		if (nundef(cmd.fSel) || cmd.fSel(n)) cmdEnable(k); else cmdDisable(k);
	}
}




//#endregion

//region fishgame
async function showTable(id) {
	let me = getUname();
	let table = await mGetRoute('table', { id });  //console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	let func = DA.funcs[table.game];
	T = table;
	clearMain();
	let d = mBy('dExtraLeft');
	d.innerHTML = `<h2>${getGameProp('friendly').toUpperCase()}: ${table.friendly} (${table.step})</h2>`; // title
	d = mDom('dMain'); mCenterFlex(d);
	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction
	mDom(d, {}, { id: 'dStats' }); mLinebreak(d);
	func.stats(table);
	let minTableSize = 400;
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);
	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }
	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);
	await updateTestButtonsPlayers(table);
	func.activate(table, items);
}


//#endregion

//#endregion

//#region integrate 4.6.24 =>closure (bau4.js)
async function onclickSettMyTheme(){
	localStorage.setItem('settingsMenu','settMyTheme')

	let dSettings = mBy('dSettingsMenu'); mClear(dSettings); 
	//console.log(getRect(dSettings))
	//console.log(dSettings); //return;
	let d=mDom(dSettings,{h:'100vh',bg:U.color})
	//let dParent = mDom(d,{h:2000,bg:U.color}); mFlex(dParent);

	//return;

	let dOuter=mDom(d, {padding:25}); // { padding: 10, gap: 10, margin:'auto', w:500, align:'center', bg:'white' }); //mCenterFlex(dParent);
	mCenterFlex(dOuter)

	let ui = await uiTypePalette(dOuter,U.color,U.fg,U.texture,U.blendMode);
	//mDom(dText,{fg:'white',fz:30,h:200},{html:'hallo'})
	return;

	let d1 = mDom(dParent);
	let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
	let palette = await getPaletteFromCanvas(ca.cv);
	palette.unshift(fill); palette.splice(8);
	showPaletteMini(d1, palette);
	d1.onclick = async () => {
		U.palette = palette;
		U.blendMode = blendCSS;
		await updateUserTheme();
	}


	let list = arrMinus(getBlendModesCSS(), ['saturation', 'color']);
	for (const blendMode of list) { await showBlendMode(dParent, blendMode); }
}

async function uiTypePalette(dParent, color, fg, src, blendMode) {

	let fill = color;
	let bgBlend = getBlendCanvas(blendMode);
	let d = mDom(dParent, { w100: true, gap: 4 }); mCenterFlex(d);
	let NewValues = { fg, bg: color };

	let palette = [color];
	let dContainer = mDom(d, { w: 500, h: 300 });
	if (isdef(src)) {
		let ca = await getCanvasCtx(dContainer, { w: 500, h: 300, fill, bgBlend }, { src });
		palette = await getPaletteFromCanvas(ca.cv);
		palette.unshift(fill);
	} else {
		//make a palette with color and other shades of that color

		palette = arrCycle(paletteShades(color), 4);
	}

	let dominant = palette[0];
	let palContrast = paletteContrastVariety(palette, palette.length);
	mLinebreak(d);
	let bgItems = showPaletteMini(d, palette);
	mLinebreak(d);
	let fgItems = showPaletteMini(d, palContrast);
	mLinebreak(d);

	mIfNotRelative(dParent);
	let dText = mDom(dParent, { 'pointer-events': 'none', align: 'center', fg: 'white', fz: 30, position: 'absolute', top: 0, left: 0, w100: true, h100: true });
	mCenterFlex(dText);
	dText.innerHTML = `<br>HALLO<br>das<br>ist ein Text`

	for (const item of fgItems) {
		let div = iDiv(item);
		//console.log(div)
		mStyle(div, { cursor: 'pointer' });
		// div.onclick = async () => onclickTextColor(item.bg);

		div.onclick = ()=>{
			mStyle(dText, { fg: item.bg });
			NewValues.fg=item.bg;
			console.log('NewValues',NewValues);
		}
	}
	for (const item of bgItems) {
		let div = iDiv(item);
		//console.log(div)
		mStyle(div, { cursor: 'pointer' });
		div.onclick = async () => {
			if (isdef(src)) {
				mClear(dContainer);
				let fill = item.bg;
				await getCanvasCtx(dContainer, { w: 500, h: 300, fill, bgBlend }, { src });
			}
			mStyle(dParent, { bg: item.bg });
			NewValues.bg = item.bg;
		}
	}
	async function onclickSaveMyTheme() {
		if (U.fg == NewValues.fg && U.color == NewValues.bg) return;

		U.fg = NewValues.fg;
		U.color = NewValues.bg;
		await updateUserTheme();
		await onclickSettMyTheme();
		// await postUserChange();
		// setUserTheme();
		// await settingsOpen();

	}

	mButton('Save', onclickSaveMyTheme, dParent,{matop:10,className:'button'})

	return { pal: palette.map(x => colorO(x)), palContrast };
}


function isLiteral(x) { return isString(x) || isNumber(x); }
function settingsCheck(){
	if (isdef(DA.settings)){
		//console.log(iDiv(UI.settResetAll))
		cmdDisable(UI.settResetAll.key); //console.log('disabled!')
		for(const k in DA.settings){
			if (isLiteral(U[k]) && DA.settings[k] != U[k]) {
				//console.log('k',k,'different: enable!')
				cmdEnable(UI.settResetAll.key);break;}
		}
		//console.log(iDiv(UI.settResetAll))
	}
}
async function updateUserTheme() {
	await postUserChange();
	setUserTheme(U);
	settingsCheck();
}
async function onclickSettResetAll() {
	assertion(isdef(DA.settings), "NO DA.settings!!!!!!!!!!!!!!!")
	if (JSON.stringify(U) == JSON.stringify(DA.settings)) return;
	U = jsCopy(DA.settings);
	await postUserChange(U, true);
	setUserTheme();
	await settingsOpen();
	settingsCheck();
}
async function settingsOpen() {
	DA.settings = jsCopy(U);
	mClear('dMain');
	let d = mDom('dMain',{},{id:'dSettingsMenu'}); // { padding: 0, overy: 'auto', hmax: '100vh' }, { id: 'dSettingsMenu' }); //,calcRestHeight('dMain') }, { id: 'dSettingsMenu' });
	let submenu = valf(localStorage.getItem('settingsMenu'), 'settTheme');
	//console.log('submenu',submenu)
	settingsSidebar();
	await UI[submenu].open();
	settingsCheck();
}
function setUserTheme() {
	setColors(U.color, U.fg);
	setTexture(U);
	settingsCheck();

}
function settingsSidebar() {
	let wmin = 170;
	mStyle('dLeft', { wmin: wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 160, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;
	UI.settMyTheme = mCommand(d, 'settMyTheme', 'My Theme', { save: true }); mNewline(d, gap);
	UI.settTheme = mCommand(d, 'settTheme', 'Themes', { save: true }); mNewline(d, gap);
	UI.settColor = mCommand(d, 'settColor', 'Color', { save: true }); mNewline(d, gap);
	UI.settFg = mCommand(d, 'settFg', 'Text Color', { save: true }); mNewline(d, gap);
	UI.settTexture = mCommand(d, 'settTexture', 'Texture', { save: true }); mNewline(d, gap);
	UI.settBlendMode = mCommand(d, 'settBlendMode', 'Blend Mode', { save: true }); mNewline(d, 2 * gap);
	UI.settRemoveTexture = mCommand(d, 'settRemoveTexture', 'Remove Texture'); mNewline(d, gap);
	UI.settResetAll = mCommand(d, 'settResetAll', 'Revert Settings'); mNewline(d, gap);
	UI.settAddYourTheme = mCommand(d, 'settAddYourTheme', 'Add Your Theme'); mNewline(d, gap);
	// settingsCheck();
}

async function calcUserPalette(name) {
	if (nundef(name)) name = U.name;
	let user = await getUser(name);

	let dParent = mPopup(null,{opacity:0});
	return await showPaletteFor(dParent,user.texture, user.color, user.blendMode);
}
async function showPaletteFor(dParent,src, color, blendMode) {
	let fill = color;
	let bgBlend = getBlendCanvas(blendMode);
	let d = mDom(dParent, { w100:true, gap: 4 }); mCenterFlex(d);

	let palette = [color];
	if (isdef(src)) {
		let ca = await getCanvasCtx(d, { w:500, h: 300, fill, bgBlend }, { src });
		palette = await getPaletteFromCanvas(ca.cv);
		palette.unshift(fill);
	} else {
		//make a palette with color and other shades of that color
		let ca = mDom(d,{w:500,h:300});
		palette = arrCycle(paletteShades(color), 4);
	}

	let dominant = palette[0];
	let palContrast = paletteContrastVariety(palette,palette.length);
	mLinebreak(d);
	showPaletteMini(d, palette);
	mLinebreak(d);
	showPaletteMini(d, palContrast);
	mLinebreak(d);

	return [palette.map(x=>colorO(x)),palContrast];
}

function colorSortByLightness(list){
	let ext=list.map(x=>colorO(x));
	let sorted = sortByDescending(ext,'lightness').map(x=>x.hex);
	return sorted;
}

function colorGetPureHue(c) { c = colorO(c); return c.hue == 0 ? c.hex : colorFromHsl(c.hue, 100, 50); }
function palettePureHue(pal) {
	//let xb=w3color('black');console.log(xb)
	//console.log(pal.map(x=>x.hex))
	let p2 = pal.map(x => colorGetPureHue(x));
	//console.log(p2)
	return pal.map(x => colorO(colorGetPureHue(x)));
}
function paletteGetBestContrasting(pal) {
	let clist = Array.from(arguments).slice(1).map(x => colorO(x)); //console.log(clist)
	pal = pal.map(x => colorO(x));
	let best = null, dbest = 0;
	for (const p of pal) {
		let arr = clist.map(x => colorDistanceHue(p, x)); //console.log(arr)
		let dmax = arrMinMax(arr).min; //console.log(dmax,dbest,p.hue)
		if (dmax > dbest) {
			//console.log('new best',p.hue,dmax,'beats',dbest)
			best = p; dbest = dmax;
		}
	}
	if (dbest == 0) best = pal[4];
	return { best, dbest };
}
function paletteContrastVariety(pal, n = 20) {
	//return a palette of good contrasting colors to pal
	pal = pal.map(x => colorO(x));
	let res = [];

	//add white and black
	['white', 'black'].map(x => res.push(colorO(x)));

	let o = paletteGetBestContrasting(pal, pal[0], pal[1]).best;
	res.push(o)
	let pal2 = jsCopy(pal).filter(x => x.hex != o.hex);
	res.push(colorO(colorGetPureHue(o)));

	let o2 = paletteGetBestContrasting(pal2, pal[0], pal[1]).best;
	res.push(o2)
	res.push(colorO(colorGetPureHue(o2)))

	//res.push(colorO('#eea37b')); mimi
	//push complement
	res.push(colorO(colorComplement(pal[0].hex)));
	res.push(colorO(colorComplement(pal[1].hex)));

	[60, 120, 180, 240, 300].map(x => {
		res.push(colorO(colorTurnHueBy(pal[0].hex, x)));
		res.push(colorO(colorTurnHueBy(pal[1].hex, x)));
	});

	['silver', 'dimgray', '#ff0000', '#ffff00'].map(x => res.push(colorO(x)));
	//console.log(res.map(x=>x.hex));

	res = res.map(x => x.hex); res = arrRemoveDuplicates(res);
	let palContrast = res.slice(0, 2);	//console.log(palContrast);
	let sorted = colorSortByLightness(res.slice(2)); //console.log('===>',sorted);
	let i = 0;
	while (i < sorted.length) {
		let hex = sorted[i];
		let ok = true;
		for (const h1 of palContrast) {
			let d = colorDistance(hex, h1);//console.log(d);
			if (d < 70) { ok = false; break; }
		}
		if (ok) palContrast.push(hex);
		i++;
	}


	if (n < palContrast.length) palContrast = palContrast.slice(0, n)
	return palContrast;

}
function paletteShades(color, from = -0.8, to = 0.8, step = 0.2) {
	let res = [];
	for (let frac = from; frac <= to; frac += step) {
		let c = colorCalculator(frac, color, undefined, true);
		res.push(c);
	}
	return res;
}
function paletteShadesQuad(color, from = -0.5, to = 0.5, step = 0.5) {
	let tri = [color, colorTurnHueBy(color, 90), colorTurnHueBy(color, 180), colorTurnHueBy(color, 270)];
	let res = jsCopy(tri);
	for (const c1 of tri) {
		for (let frac = from; frac <= to; frac += step) {
			let c = colorCalculator(frac, c1, undefined, true);
			addIf(res,c);
		}
	}
	return res;
}
function paletteShadesTri(color, from = -0.5, to = 0.5, step = 0.5) {
	let tri = [color, colorTurnHueBy(color, 120), colorTurnHueBy(color, 240)];
	let res = jsCopy(tri);
	for (const c1 of tri) {
		for (let frac = from; frac <= to; frac += step) {
			let c = colorCalculator(frac, c1, undefined, true);
			addIf(res,c);
		}
	}
	return res;
}
function paletteShadesBi(color, turnHueBy = 180, from = -0.8, to = 0.8, step = 0.4) {
	let bi = [color, colorTurnHueBy(color, turnHueBy)];
	let res = jsCopy(bi);
	for (const c1 of bi) {
		for (let frac = from; frac <= to; frac += step) {
			let c = colorCalculator(frac, c1, undefined, true);
			addIf(res,c);
		}
	}
	return res;
}
function paletteShadesHues(color, n=2, turnHueBy = 30, from = -0.5, to = 0.5, step = 0.5) {
	let list=[color];
	for(let i=1;i<n;i++) list.push(colorTurnHueBy(color, i*turnHueBy))
	let res = jsCopy(list);
	// a palette should have 8-10 colors
	if (n==2){from=-.8;to=.8;step=.4;}
	for (const c1 of list) {
		for (let frac = from; frac <= to; frac += step) {
			let c = colorCalculator(frac, c1, undefined, true);
			addIf(res,c);
		}
	}
	return res;
}
function paletteTrans(color, from = 0.1, to = 1, step = 0.2) {
	let res = [];
	for (let frac = from; frac <= to; frac += step) {
		let c = colorTrans(color, frac);
		res.push(c);
	}
	return res;
}
function paletteTransWhiteBlack(n = 9) {
	let c = colorHex('white');
	let pal = [c];
	let [iw, ib] = [Math.floor(n / 2) - 1, Math.floor((n - 1) / 2) - 1];
	let [incw, incb] = [1 / (iw + 1), 1 / (ib + 1)];
	for (let i = 1; i < iw; i++) {
		let alpha = i * incw;
		pal.push(colorTrans(c, alpha));
	}
	pal.push('transparent');
	c = colorHex('black');
	for (let i = 1; i < ib; i++) {
		let alpha = i * incb;
		pal.push(colorTrans(c, alpha));
	}
	pal.push(c);
	return pal;
}


function colorDistanceHue(color1,color2){
	let c1=colorO(color1);
	let c2=colorO(color2);
	let hueDiff = Math.abs(c1.hue-c2.hue);
	let hueDistance = Math.min(hueDiff, 360 - hueDiff) / 180; // Normalize to [0, 1]
	let num = (hueDistance*100).toFixed(2);
	return Number(num);
}
function colorDistanceHueLum(color1,color2){
	let c1=colorO(color1);
	let c2=colorO(color2);
	// console.log('color1',c1.hex,c1.hue,c1.lightness)
	// console.log('color2',c2.hex,c2.hue,c2.lightness)
	let hueDiff = Math.abs(c1.hue-c2.hue);
	let hueDistance = Math.min(hueDiff, 360 - hueDiff) / 180; // Normalize to [0, 1]
	let lightnessDistance = Math.abs(c1.lightness - c2.lightness); // Normalize to [0, 1]
	// console.log('===>',hueDistance,lightnessDistance)
	let distance = hueDistance + lightnessDistance; //koennte .5*lightnessDistance machen!
	return Number((distance*100).toFixed(2));
}
function colorDistanceHSL(color1, color2) {
	let hsl1 = hexToHSL(color1);
	let hsl2 = hexToHSL(color2);

	let hueDiff = Math.abs(hsl1.h - hsl2.h);
	let hueDistance = Math.min(hueDiff, 360 - hueDiff) / 180; // Normalize to [0, 1]

	let lightnessDistance = Math.abs(hsl1.l - hsl2.l) / 100; // Normalize to [0, 1]

	let distance = hueDistance + 0.5 * lightnessDistance;
	return distance;
}
function mPopup(dParent, styles={}, opts={}) {
  if (nundef(dParent)) dParent = document.body;
  if (isdef(mBy(opts.id))) mRemove(opts.id);
  mIfNotRelative(dParent);
  let animation = 'diamond-in-center .5s ease-in-out'; let transition = 'opacity .5s ease-in-out';
  addKeys({ animation, bg:'white', fg:'black', padding:20, rounding:12, top: 50, left: '50%', transform: 'translateX(-50%)', position:'absolute' },styles);
  let popup = mDom(dParent, styles, opts);
  mButtonX(popup); //, null, 25, 4, 'silver');
  return popup;
}
function paletteAddDistanceTo(pal,color,key,distfunc=colorGetContrast){
	let opal = isDict(pal[0])?pal:paletteToObjects(pal);
	for (let i = 0; i < pal.length; i++) {
		let o = opal[i];
		o[`dist_${key}`] = distfunc(o.hex, color);
	}
	return opal;
}
function paletteToObjects(pal){return pal.map(x=>colorO(x));}
function showColorFromHue(dParent, hue, s = 100, l = 50) {
  let c = colorHsl360ArgsToHex79(hue, s, l);
  let w3 = colorNearestNamed(c, M.colorList);
  let d1 = showObject(w3, ['name', 'hex', 'bucket', 'hue'], dParent, { bg: w3.hex,wmin:120 });
  d1.innerHTML += colorGetBucket(w3.hex);
}










//#endregion

//#region integrate 1.6.24 bau4.js =>newclosure.js

function uiGadgetTypeCheckList(dParent, content, resolve, styles = {}, opts = {}) {
	addKeys({ hmax: 500, wmax: 200, bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
	let dOuter = mDom(dParent, styles);
	
	let hmax = styles.hmax-193,wmax=styles.wmax;
	let innerStyles = {hmax,wmax,box:true};
	let ui = uiTypeCheckList(content, dOuter, innerStyles, opts);
	let handler = () => resolve(getCheckedNames(ui).join('@'));

	mButton('done', handler, dOuter, { classes: 'input', margin: 10 });
	return dOuter;
}
function uiTypeCheckList(any, dParent, styles = {}, opts = {}) {
	let lst = toNameValueList(any); lst.map(x => { if (x.value !== true) x.value = false; });
	addKeys({ overy: 'auto' },styles)
	let d = mDom(dParent, styles, opts); //hier drin kommt die liste!
	lst.forEach((o, index) => {
		let [text, value] = [o.name, o.value];
		let dcheck = mDom(d, {}, { tag: 'input', type: 'checkbox', name: text, value: text, id: `ch_${index}`, checked: value });
		let dlabel = mDom(d, {}, { tag: 'label', for: dcheck.id, html: text });
		mNewline(d, 0);
	});
	return d;
}


function uiGadgetTypeSelect(dParent, content, resolve, styles = {}, opts = {}) {
	let dSelect = uiTypeSelect(content, dParent, styles, opts);
	dSelect.onchange = ev=>resolve(ev.target.value); //console.log('onchange',ev.target,ev.target.value)
	return dSelect;
}
function uiTypeSelect(any, dParent, styles = {}, opts = {}) {
	let list = toNameValueList(any);
	addKeys({ className: 'input', tag: 'select' }, opts);
	let dselect = mDom(dParent, styles, opts);
	for (const el of list) { mDom(dselect, {}, { tag: 'option', html: el.name, value: el.value }); }
	dselect.value = '';
	return dselect;
}


async function mGather(dAnchor, styles = {}, opts = {}) {
	return new Promise((resolve, _) => {
		let [content, type] = [valf(opts.content, 'name'), valf(opts.type, 'text')]; //defaults
		let dbody = document.body;
		let dDialog = mDom(dbody, { bg: '#00000040', box: true, w: '100vw', h: '100vh' }, { tag: 'dialog', id: 'dDialog' });

		let d = mDom(dDialog);

		let funcName=`uiGadgetType${capitalize(type)}`; console.log(funcName)
		let uiFunc = window[funcName];

		let dx=uiFunc(d, content, x=>{dDialog.remove();resolve(x)}, styles, opts);
		dDialog.addEventListener('mouseup', ev => {
			if (opts.type != 'select' && isPointOutsideOf(dx, ev.clientX, ev.clientY)) {
				console.log('RESOLVE NULL POINTER OUTSIDE!!!', ev.clientX, ev.clientY)
				resolve(null);
				dDialog.remove();
			}
		});
		dDialog.addEventListener('keydown', ev => {
			if (ev.key === 'Escape') {
				dDialog.remove(); 
				console.log('RESOLVE NULL ESCAPE');
				resolve(null);
			}
		});


		dDialog.showModal();
		mAnchorTo(dx,dAnchor,opts.align);//calc alignment to anchor element
	});
}

function uiGadgetTypeCheckListInput(form, content, resolve,  styles, opts) {
	addKeys({ wmax:'100vw', hmax:500, bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
	let dOuter = mDom(form, styles);
	opts.handler = resolve;
	let ui = uiTypeCheckListInput(content, dOuter, styles, opts);
	return dOuter;
}
function uiTypeCheckListInput(any, dParent, styles = {}, opts = {}) {
	let dg = mDom(dParent);
	let list = toNameValueList(any); list.map(x => { if (x.value !== true) x.value = false; });
	let items = [];
	for (const o of list) {
		let div = mCheckbox(dg, o.name, o.value);
		items.push({ nam: o.name, div, w: mGetStyle(div, 'w'), h: mGetStyle(div, 'h') });
	}
	let wmax = arrMax(items, 'w'); //console.log('wmax',wmax); //measure max width of items
	let cols = 4;
	let wgrid = wmax * cols + 100;
	dg.remove();

	dg = mDom(dParent);
	let inp = mDom(dg, { w100: true, box: true, mabottom: 10 }, { className: 'input', tag: 'input', type: 'text' });
	let db = mDom(dg, { w100: true, box: true, align: 'right', mabottom: 4 });
	mButton('cancel', () => opts.handler(null), db, {}, 'input');
	mButton('clear', ev => { onclickClear(inp, grid) }, db, { maleft: 10 }, 'input');
	mButton('done', () => opts.handler(extractWords(inp.value, ' ')), db, { maleft: 10 }, 'input');
	mStyle(dg, { w: wgrid, box: true, padding: 10 }); //, w: wgrid })

	let hmax = isdef(styles.hmax)?styles.hmax-150:300;
	let grid = mGrid(null, cols, dg, { w100: true, gap: 10, matop: 4, hmax });
	items.map(x => mAppend(grid, iDiv(x)));
	let chks = Array.from(dg.querySelectorAll('input[type="checkbox"]')); 
	for (const chk of chks) {
		chk.addEventListener('click', ev => checkToInput(ev, inp, grid))
	}
	inp.value = list.filter(x => x.value).map(x => x.name).join(', ');
	inp.addEventListener('keypress', ev => inpToChecklist(ev, grid));
	return { dg, inp, grid };
}


function mAnchorTo(elem,dAnchor,align='bl'){
	let rect = dAnchor.getBoundingClientRect();
	let drect = elem.getBoundingClientRect(); //console.log(drect)
	let [v, h] = [align[0], align[1]];
	let vPos = v == 'b' ? { top: rect.bottom } : v == 'c' ? { top: rect.top } : { top: rect.top-drect.height };
	let hPos = h == 'l' ? { left: rect.left } : v == 'c' ? { left: rect.left } : { right: window.innerWidth-rect.right };
	let posStyles = { position: 'absolute' };
	addKeys(vPos, posStyles);
	addKeys(hPos, posStyles);
	mStyle(elem,posStyles);
}
function toNameValueList(any){
	if (isEmpty(any)) return [];
	let list=[];
	if (isString(any)){
		let words = toWords(any);
		for(const w of words){list.push({name:w,value:w})};
	}else if (isDict(any)){
		for(const k in any){list.push({name:k,value:any[k]})};
	}else if (isList(any) && !isDict(any[0])){
		for(const el of any) list.push({name:el,value:el});
	}else if (isList(any) && isdef(any[0].name)  && isdef(any[0].value)) {
		list = any;
	}else {
		let el=any[0];
		let keys = Object.keys(el);
		let nameKey=keys[0];
		let valueKey=keys[1];
		for(const x of any){
			list.push({name:x[nameKey],value:x[nameKey]});
		}
	}
	return list;
}
function uiGadgetTypeYesNo(dParent, content, resolve, styles = {}, opts = {}) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
	let dOuter = mDom(dParent, styles)
	let dq = mDom(dOuter, { mabottom: 7 }, { html: capitalize(content) });
	let db = mDom(dOuter, { w100: true, box: true, display: 'flex', 'justify-content': 'space-between', gap: 10 })
	let bYes = mDom(db, { w: 70, classes: 'input' }, { html: 'Yes', tag: 'button', onclick: () => resolve('yes') })
	let bNo = mDom(db, { w: 70, classes: 'input' }, { html: 'No', tag: 'button', onclick: () => resolve('no') })
	return dOuter;
}
function uiGadgetTypeText(dParent, content, resolve, styles = {}, opts = {}) {
	let inp = mDom(dParent, styles, { autocomplete:'off', className: 'input', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	mOnEnterInput(inp,resolve);
	return inp;
}
function uiGadgetTypeMulti(dParent, dict, resolve, styles = {}, opts = {}) {
	let inputs = [];
	let form=mDom(dParent,{},{tag:'form',method:null, action:"javascript:void(0)" })
	for (const k in dict) {
		let [content, val] = [k, dict[k]];
		let inp = mDom(form, styles, { autocomplete:'off', className: 'input', name: content, tag: 'input', type: 'text', value: val, placeholder: `<enter ${content}>` });
		inputs.push({ name: content, inp: inp });
		mNewline(form)
	}
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	form.onsubmit = ev => {
		ev.preventDefault();
		let di = {};
		inputs.map(x => di[x.name] = x.inp.value);
		resolve(di);
	}
	return form;
}












//#endregion

//#region integrate 31.mai 24 bau4.js =>closure.js
function colorGetBucket(c) {
	let buckets = 'red orange yellow lime green greencyan cyan cyanblue blue bluemagenta magenta magentared black'.split(' ');
	//console.log('buckets',buckets);

	c = colorFrom(c);

	//if (colorIsGrey(c)) return 'black';

	let hsl = colorHexToHsl360Object(c);
	let hue = hsl.h;

	//0 30 60 ...
	//orange range 15-45
	//yellow range 45-75
	//lime range 75-105
	//green range 105-135

	//hue+15:
	//red ... 0-30
	//orange ... 30-60
	let hshift = (hue + 16) % 360;
	let ib = Math.floor(hshift / 30);
	return buckets[ib];


}
function colorFromNat(ncol, wPercent, bPercent) { 
	return colorFromNcol(ncol,wPercent,bPercent); 
}
function colorFromHwb(h,wPercent,bPercent){
	let [r,g,b]=colorHwb360ToRgbArray(h,wPercent,bPercent); //console.log(r,g,b)
	return colorRgbArgsToHex79(r,g,b);
}
function colorFromNcol(ncol,wPercent,bPercent){
	let h=colorNcolToHue(ncol); console.log('hue',h);
	return colorFromHwb(h,wPercent,bPercent);
}
function colorFromRgb(r, g, b) { return colorFrom({ r, g, b }); }
function colorFromHsl(h, s = 100, l = 50) { return colorFrom({ h, s, l }); }
function colorFromHue(h, s = 100, l = 50) { return colorFrom({ h, s, l }); }
function colorFromRgbNamed(r, g, b) { let x = colorFrom({ r, g, b }); return colorNearestNamed(x); }
function colorFromHslNamed(h, s = 100, l = 50) { let x = colorFrom({ h, s, l }); return colorNearestNamed(x); }
function colorFromHueNamed(h, s = 100, l = 50) { return colorFromHslNamed(h, s, l); }
function colorIsGrey(c, tolerance = 5) {
	let { r, g, b } = colorHexToRgbObject(colorFrom(c));
	return Math.abs(r - g) <= tolerance && Math.abs(r - b) <= tolerance && Math.abs(g - b) <= tolerance;
}

function clearFlex() {
	let dp = clearBodyDiv({ bg: 'white', hmin: '100vh', padding: 10 });
	let d = mDom(dp, { gap: 10 }); mFlexWrap(d);
	return d;
}
function showObject(o, keys, dParent, styles = {}) {
	let bg = valf(styles.bg, 'dimgray');
	addKeys({ align: 'center', wmin: 120, padding: 2, bg, fg: colorIdealText(bg) }, styles);
	let html = '';
	for (const k of keys) { html += o[k] + '<br>'; }

	let d = mDom(dParent, styles, { html });
	return d;
}
function colorToW3Ext(c){
	let hex=colorFrom(c);
	let o=w3color(hex);

	let named=colorNearestNamed(hex); 
	let distance = Math.round(colorDistance(named.hex,hex));
	console.log('distance to',named.name,distance);

	//console.log('___',hex,'\n',named);
	o.name=named.name;
	o.distance = distance;
	o.bucket=colorGetBucket(hex);
	o.hex=hex;
	return o;
}

function colorHwb360ToRgbArray(h, w, b) {
	// Convert HWB to HSL
	let [r,g,blue] = colorHsl01ArgsToRgbArray(h/360, 1, 0.5);
	
	//console.log(r,g,blue)

	// Apply whiteness and blackness
	let whiteness = w / 100;
	let blackness = b / 100;

	r = Math.round((r / 255 * (1 - whiteness - blackness) + whiteness) * 255);
	g = Math.round((g / 255 * (1 - whiteness - blackness) + whiteness) * 255);
	b = Math.round((blue / 255 * (1 - whiteness - blackness) + whiteness) * 255);

	return [r,g,b];
}
function colorToHwb360Object(c){

	c=colorFrom(c);
	//rgb=colorHexToRgbObject(c);
	let [r,g,blue]=colorHexToRgbArray(c);

	let [h,s,l] = colorHexToHsl01Array(c); h*=360;

	let w = 100*Math.min(r, g, blue) / 255;
	let b = 100*(1 - Math.max(r, g, blue) / 255);

	return {h,w,b};
}
function colorToHwb360Object(c){

	c=colorFrom(c);
	//rgb=colorHexToRgbObject(c);
	let [r,g,blue]=colorHexToRgbArray(c);

	let [h,s,l] = colorHexToHsl01Array(c); h*=360;

	let w = 100*Math.min(r, g, blue) / 255;
	let b = 100*(1 - Math.max(r, g, blue) / 255);

	return {h,w,b};
}
function colorToHwbRounded(c){ 
	let o=colorToHwb360Object(c);
	return {h:Math.round(o.h),w:Math.round(o.w),b:Math.round(o.b)};

}
function colorGetWhite(c){return colorToHwb360Object(c).w;}
function colorGetBlack(c){return colorToHwb360Object(c).b;}
function colorHueToNat(hue){
	let x=Math.floor(hue/60);
	let pure=['red','yellow','green','cyan','blue','magenta'];
	let color=pure[x];
	//let inc=hue%60; //(hue%60)*100/60;
	let inc=hue%60; //Math.floor((hue%60)*100/60);
	return color.toUpperCase()[0]+inc; // return as String, eg. G15 {color,inc};
}
function colorNatToHue(ncol){
	//let x=Math.floor(hue/60);
	let pure=['red','yellow','green','cyan','blue','magenta'].map(x=>x.toUpperCase()[0]);
	let [letter,num]=[ncol[0],Number(ncol.substring(1))];
	let idx=pure.indexOf(letter);
	let hue=idx*60+num; //Math.ceil(num*60/100);
	return hue;
}
function colorHueToNcol(hue){

	let x=Math.floor(hue/60);
	let pure=['red','yellow','green','cyan','blue','magenta'];
	let color=pure[x];
	//let inc=hue%60; //(hue%60)*100/60;
	let inc=(hue%60)/0.6; 
	//console.log('mod60',hue%60)
	//toPercent(hue%60,60); //Math.floor((hue%60)*100/60);
	return color.toUpperCase()[0]+toPercent(hue%60,60); //Math.ceil(inc); //Math.floor(inc); // return as String, eg. G15 {color,inc};
}
function colorNcolToHue(ncol){
	//let x=Math.floor(hue/60);
	let pure=['red','yellow','green','cyan','blue','magenta'].map(x=>x.toUpperCase()[0]);
	let [letter,num]=[ncol[0],Number(ncol.substring(1))];
	let idx=pure.indexOf(letter);
	let hue=idx*60+fromPercent(num,60); //Math.ceil(num*60/100);
	return hue;
}
function toPercent(n,total){return Math.round(n*100/total);}
function fromPercent(n,total){return Math.round(n*total/100);}


async function analyseColorsForUser(d, name) {
  let user = Serverdata.users[name];
  let d1 = mDom(d, { align: 'center', bg: user.color, fg: valf(user.fg, colorIdealText(user.color)) });
  mDom(d1, {}, { html: name });
  let palette = await calcPalette(d1, user.texture, user.color, user.blendMode);
}
async function calcPalette(dParent, src, color, blendMode) {
	let fill = color;
	let bgBlend = getBlendCanvas(blendMode);
	let d1 = mDom(dParent);
	let ca = await getCanvasCtx(d1, { w: 310, h: 200, fill, bgBlend }, { src });
	let palette = await getPaletteFromCanvas(ca.cv);

	palette.splice(8);
	let dominant = palette[0];

	let opal = [];
	for (let i = 0; i < palette.length; i++) {
		let c = palette[i];
		let o = w3color(c);
		o.hex = c;
		o.distbg = colorDistance(c, fill);
		o.distbg = colorDistance(c, dominant);
		opal.push(o);
	}

	palette.unshift(fill);
	showPaletteMini(d1, palette);

	let pal2 = [colorComplement(fill), colorComplement(dominant), 'white', 'silver', 'dimgray', 'black'];
	showPaletteMini(d1, pal2);

	let pal3 = [colorTurnHueBy(fill), colorTurnHueBy(dominant), colorTurnHueBy(fill, 120), colorTurnHueBy(dominant, 120), colorTurnHueBy(fill, 240), colorTurnHueBy(dominant, 240)];
	showPaletteMini(d1, pal3);

	let pal4 = [getBestContrastingColor(fill), getBestContrastingColor(dominant)];
	showPaletteMini(d1, pal4);

	let pal5 = [fill, colorTurnHueBy(fill), colorComplement(fill), getBestContrastingColor(fill), colorIdealText(fill)]
	showPaletteMini(d1, pal5);
	for (const c of pal5) {
		console.log(c, colorDistance(fill, c));
	}

	console.log(src, opal)
	//palette nachbearbeiten!
	//wenn es keine texture hat, soll es ein colorMix scheme schicken
	//console.log(src)

	return palette;

}
function getBestContrastingColor(color) {
	let [r, g, b] = colorHexToRgbArray(colorFrom(color));

	// Calculate the YIQ value
	let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

	// Return black or white based on the YIQ value
	return (yiq >= 128) ? '#000000' : '#FFFFFF';
}
function colorBlendMode(c1, c2, blendMode) {
	function colorBurn(base, blend) {
		return (blend === 0) ? 0 : Math.max(0, 255 - Math.floor((255 - base) / blend));
	}
	function blendColorBurn(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let resultR = colorBurn(baseR, blendR);
		let resultG = colorBurn(baseG, blendG);
		let resultB = colorBurn(baseB, blendB);

		return colorRgbArgsToHex79(resultR, resultG, resultB);
	}
	function blendColorDodge(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);
		const dodge = (a, b) => (b === 255) ? 255 : Math.min(255, ((a << 8) / (255 - b)));
		let r = dodge(r1, r2);
		let g = dodge(g1, g2);
		let b = dodge(b1, b2);
		return colorRgbArgsToHex79(r, g, b);
	}
	function blendColor(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);
		let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
		let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);
		let cfinal = colorHsl01ArgsToRgbArray(h2, s1, l1);
		return colorRgbArgsToHex79(...cfinal);
	}
	function blendDarken(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);
		let r = Math.min(r1, r2);
		let g = Math.min(g1, g2);
		let b = Math.min(b1, b2);
		return colorRgbArgsToHex79(r, g, b);
	}
	function difference(a, b) {
		return Math.abs(a - b);
	}
	function blendDifference(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let resultR = difference(baseR, blendR);
		let resultG = difference(baseG, blendG);
		let resultB = difference(baseB, blendB);

		return colorRgbArgsToHex79(resultR, resultG, resultB);
	}
	function exclusion(a, b) {
		a /= 255;
		b /= 255;
		return (a + b - 2 * a * b) * 255;
	}
	function blendExclusion(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let resultR = Math.round(exclusion(baseR, blendR));
		let resultG = Math.round(exclusion(baseG, blendG));
		let resultB = Math.round(exclusion(baseB, blendB));

		return colorRgbArgsToHex79(resultR, resultG, resultB);
	}
	function hardLight(a, b) {
		a /= 255;
		b /= 255;
		return (b < 0.5) ? (2 * a * b) : (1 - 2 * (1 - a) * (1 - b));
	}
	function blendHardLight(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let resultR = Math.round(hardLight(baseR, blendR) * 255);
		let resultG = Math.round(hardLight(baseG, blendG) * 255);
		let resultB = Math.round(hardLight(baseB, blendB) * 255);

		return colorRgbArgsToHex79(resultR, resultG, resultB);
	}
	function blendHue(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let [baseH, baseS, baseL] = colorRgbArgsToHsl01Array(baseR, baseG, baseB);
		let [blendH, blendS, blendL] = colorRgbArgsToHsl01Array(blendR, blendG, blendB);

		let [resultR, resultG, resultB] = colorHsl01ArgsToRgbArray(blendH, baseS, baseL);

		return colorRgbArgsToHex79(resultR, resultG, resultB);
	}
	function blendLighten(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);
		let r = Math.max(r1, r2);
		let g = Math.max(g1, g2);
		let b = Math.max(b1, b2);
		return colorRgbArgsToHex79(r, g, b);
	}
	function blendLuminosity(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);
		let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
		let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);
		let [r, g, b] = colorHsl01ArgsToRgbArray(h1, s1, l2);
		return colorRgbArgsToHex79(r, g, b);
	}
	function blendMultiply(color1, color2) {
		let [r1, g1, b1] = colorHexToRgbArray(color1);
		let [r2, g2, b2] = colorHexToRgbArray(color2);
		let r = (r1 * r2) / 255;
		let g = (g1 * g2) / 255;
		let b = (b1 * b2) / 255;
		return colorRgbArgsToHex79(Math.round(r), Math.round(g), Math.round(b));
	}
	function blendNormal(baseColor, blendColor) {
		return blendColor;
	}
	function blendOverlay(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);
		const overlayCalculate = (a, b) => (a <= 128) ? (2 * a * b / 255) : (255 - 2 * (255 - a) * (255 - b) / 255);
		let r = overlayCalculate(r1, r2);
		let g = overlayCalculate(g1, g2);
		let b = overlayCalculate(b1, b2);
		return colorRgbArgsToHex79(r, g, b);
	}
	function blendSaturation(baseColor, blendColor) {
		let [r1, g1, b1] = colorHexToRgbArray(baseColor);
		let [r2, g2, b2] = colorHexToRgbArray(blendColor);
		let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
		let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);
		let cfinal = colorHsl01ArgsToRgbArray(h1, s2, l1);
		return colorRgbArgsToHex79(...cfinal);
	}
	function blendScreen(color1, color2) {
		let [r1, g1, b1] = colorHexToRgbArray(color1);
		let [r2, g2, b2] = colorHexToRgbArray(color2);
		let r = 255 - (((255 - r1) * (255 - r2)) / 255);
		let g = 255 - (((255 - g1) * (255 - g2)) / 255);
		let b = 255 - (((255 - b1) * (255 - b2)) / 255);
		return colorRgbArgsToHex79(r, g, b);
	}
	function softLight(a, b) {
		a /= 255;
		b /= 255;
		let result;
		if (a < 0.5) {
			result = (2 * a - 1) * (b - b * b) + b;
		} else {
			result = (2 * a - 1) * (Math.sqrt(b) - b) + b;
		}
		return Math.min(Math.max(result * 255, 0), 255);
	}
	function blendSoftLight(baseColor, blendColor) {
		let [baseR, baseG, baseB] = colorHexToRgbArray(baseColor);
		let [blendR, blendG, blendB] = colorHexToRgbArray(blendColor);

		let resultR = Math.round(softLight(baseR, blendR));
		let resultG = Math.round(softLight(baseG, blendG));
		let resultB = Math.round(softLight(baseB, blendB));

		return colorRgbArgsToHex79(resultR, resultG, resultB);
	}
	let di = {
		darken: blendDarken, lighten: blendLighten, color: blendColor, colorBurn: blendColorBurn, colorDodge: blendColorDodge,
		difference: blendDifference, exclusion: blendExclusion, hardLight: blendHardLight, hue: blendHue,
		luminosity: blendLuminosity, multiply: blendMultiply, normal: blendNormal, overlay: blendOverlay,
		saturation: blendSaturation, screen: blendScreen, softLight: blendSoftLight
	};
	if (blendMode.includes('-')) blendMode = stringCSSToCamelCase(blendMode);
	let func = di[blendMode]; if (nundef(di)) { console.log('blendMode', blendMode); return c1; }
	c1hex = colorFrom(c1);
	c2hex = colorFrom(c2);
	let res = func(c1hex, c2hex);
	return res;
}
function colorTurnHueBy(color, inc = 180) { //genau gleiches result wie bei colorComplement!!!!!
	// Convert hex to RGB
	let [r, g, b] = colorHexToRgbArray(colorFrom(color));

	// Convert RGB to HSL
	let [h, s, l] = colorRgbArgsToHsl01Array(r, g, b); h *= 360;

	// Calculate the opposite hue
	h = (h + inc) % 360;

	// Convert HSL back to RGB
	let [newR, newG, newB] = colorHsl01ArgsToRgbArray(h / 360, s, l);

	// Convert RGB back to hex
	return colorRgbArgsToHex79(newR, newG, newB);
}
function colorDistance(color1, color2) {
	let [r1, g1, b1] = colorHexToRgbArray(colorFrom(color1));
	let [r2, g2, b2] = colorHexToRgbArray(colorFrom(color2));

	let distance = Math.sqrt(
		Math.pow(r2 - r1, 2) +
		Math.pow(g2 - g1, 2) +
		Math.pow(b2 - b1, 2)
	);

	return distance;
}
function colorComplement(color) {
	// Convert hex to RGB
	let [r, g, b] = colorHexToRgbArray(colorFrom(color));

	// Calculate the complementary color
	let compR = 255 - r;
	let compG = 255 - g;
	let compB = 255 - b;

	// Convert the complementary RGB back to hex
	return colorRgbArgsToHex79(compR, compG, compB);
}
function colorNearestNamed(inputColor, namedColors) {
	if (nundef(namedColors)) namedColors = M.colorList;
	let minDistance = Infinity;
	let nearestColor = null;

	namedColors.forEach(namedColor => {
		let distance = colorDistance(inputColor, namedColor.hex);
		if (distance < minDistance) {
			minDistance = distance;
			nearestColor = namedColor;
			//console.log(nearestColor,distance);
		}
	});

	return nearestColor;
}
function colorFarestNamed(inputColor, namedColors) {
	let maxDistance = 0;
	let nearestColor = null;

	namedColors.forEach(namedColor => {
		let distance = colorDistance(inputColor, namedColor.hex);
		if (distance > maxDistance) {
			maxDistance = distance;
			nearestColor = namedColor;
			//console.log(nearestColor,distance);
		}
	});

	return nearestColor;
}
function colorGetDicolorList() {
	let di = M.dicolor;
	let list = [];
	for (const k in di) {
		let bucket = di[k];
		for (const name in bucket) {
			let o={name,bucket:k,hex:bucket[name]};
			list.push(o);
		}
	}
	return list;
}
function showColor(dParent, c) {
  let [bg, name, bucket] = isDict(c) ? [c.hex, c.name, c.bucket] : [c, c, c];
  return mDom(dParent, { align: 'center', wmin: 120, padding: 2, bg, fg: colorIdealText(bg) }, { html: name + (bg != name ? `<br>${bg}` : '') });
}
function showText(dParent, text, bg='black') {
  return mDom(dParent, { align: 'center', wmin: 120, padding: 2, bg, fg: colorIdealText(bg) }, { html: text });
}
function stringCSSToCamelCase(s) {
	let parts = s.split('-');
	let res = parts[0];
	for (let i = 1; i < parts.length; i++) { res += capitalize(parts[i]) }
	return res;
}


//#endregion

//#region integrate 26.mai 24 bau4.js
async function showBlendModes() {
	let d = mBy('dSettingsColor'); mClear(d);
	let dTheme = mDom(d, { padding: 10, gap: 10 }); mFlexWrap(dTheme);
	let list = arrMinus(getBlendModesCSS(), ['saturation', 'color']);
	for (const blendMode of list) { await showBlendMode(dTheme, blendMode); }
}
async function showBlendMode(dParent, blendCSS) {
	let src = U.texture;
	let fill = U.color;
	let bgBlend = getBlendCanvas(blendCSS);

	let d1 = mDom(dParent);
	let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
	let palette = await getPaletteFromCanvas(ca.cv);
	palette.unshift(fill); palette.splice(8);
	showPaletteMini(d1, palette);

	d1.onclick = async () => {
		U.palette = palette;
		U.blendMode = blendCSS;
		await updateUserTheme();
	}
}
function setUserTheme() {
	setColors(U.color, U.fg);
	setTexture(U);
}
function setTexture(item) {
	let d = document.body;
	let bgImage = valf(item.bgImage, bgImageFromPath(item.texture), '');
	let bgBlend = valf(item.bgBlend, item.blendMode, '');
	d.style.backgroundColor = valf(item.color, item.bg, '');
	d.style.backgroundImage = bgImage;
	d.style.backgroundSize = bgImage.includes('marble') || bgImage.includes('wall')? '100vw 100vh' : '';
	d.style.backgroundRepeat = 'repeat'; 
	d.style.backgroundBlendMode = bgBlend;
}
async function updateUserTheme() {
	await postUserChange();
	setUserTheme(U);
}
async function onclickTexture(item) {
	U.texture = pathFromBgImage(item.bgImage);
	await updateUserTheme();
}
async function onclickThemeSample(ev) {
	let key = evToAttr(ev, 'theme');
	//console.log('key', key)
	let theme = jsCopyExceptKeys(Serverdata.config.themes[key], ['name']);
	//console.log('theme', theme);
	copyKeys(theme, U);
	await updateUserTheme(); //console.log('U',U)
}

function getBlendCanvas(bgBlend='normal'){
	const blendModeMapping = {
		'normal': 'source-over',       // Default blending mode
		'multiply': 'multiply',
		'screen': 'screen',
		'overlay': 'overlay',
		'darken': 'darken',
		'lighten': 'lighten',
		'color-dodge': 'color-dodge',
		// 'color-burn': 'color-burn',
		// 'hard-light': 'hard-light',
		// 'soft-light': 'soft-light',
		// 'difference': 'difference',
		// 'exclusion': 'exclusion',
		// 'hue': 'hue',
		'saturation': 'saturation',
		'color': 'color',
		'luminosity': 'luminosity',
		// The following CSS blend modes do not have direct canvas equivalents,
		// but can be approximated using other techniques:
		'pass-through': 'source-over' // This is a made-up value for cases where no blending is applied
	};


	return blendModeMapping[bgBlend];
}
function getBlendModesCSS(){
	return 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
}
function getBlendModesCanvas(){
	const blendModes = [
		'source-over',
		// 'source-in',
		// 'source-out',
		// 'source-atop',
		// 'destination-over',
		// 'destination-in',
		// 'destination-out',
		// 'destination-atop',
		'lighter',
		'copy',
		// 'xor',
		'multiply',
		'screen',
		'overlay',
		'darken',
		'lighten',
		'color-dodge',
		'color-burn',
		'hard-light',
		'soft-light',
		'difference',
		'exclusion',
		'hue',
		'saturation',
		'color',
		'luminosity'
	]; //these are for canvas
	return blendModes;	
}
async function getCanvasCtx(d,styles={},opts={}){
	opts.tag = 'canvas';
	let cv = mDom(d,styles,opts);
	let ctx = cv.getContext('2d');

	let fill = valf(styles.fill,styles.bg);
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fillRect(0, 0, cv.width, cv.height);
	}
	let bgBlend = styles.bgBlend;
	if (bgBlend) ctx.globalCompositeOperation = bgBlend;

	let src = valf(opts.src,opts.path);
	if (src){
		let isRepeat = src.includes('ttrans');
		let imgStyle = isRepeat?{}:{w:cv.width,h:cv.height};
		let img = await imgAsync(null,imgStyle,{src});
		if (bgBlend) ctx.globalCompositeOperation = bgBlend;
		if (isRepeat) {
			const pattern = ctx.createPattern(img, 'repeat');	
			ctx.fillStyle = pattern;
			ctx.fillRect(0, 0, cv.width, cv.height);
		}else	ctx.drawImage(img, 0, 0, cv.width, cv.height);
	}
	return {cv,ctx};
}
async function getPaletteFromCanvas(canvas) {
  if (nundef(ColorThiefObject)) ColorThiefObject = new ColorThief();
  const dataUrl = canvas.toDataURL();
  const img = new Image();
  img.src = dataUrl;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const palette = ColorThiefObject.getPalette(img);
      resolve(palette?palette.map(x=>colorFrom(x)):['black','white']);
    };

    img.onerror = () => {
      reject(new Error('Failed to load the image from canvas.'));
    };
  });
}
async function getTextures(){
	M.textures = (await mGetFiles(`../assets/textures`)).map(x=>`../assets/textures/${x}`);
	return M.textures;
}
function getTextureStyle(bg,t){
  let bgRepeat = t.includes('marble_') || t.includes('wall') ? 'no-repeat' : 'repeat';
  let bgSize = t.includes('marble_') || t.includes('wall') ? `cover` : t.includes('ttrans') ? '' : 'auto';
  let bgImage = `url('${t}')`;
  let bgBlend = t.includes('ttrans') ? 'normal' : (t.includes('marble_') || t.includes('wall')) ? 'luminosity' : 'multiply';
	return { bg, bgImage, bgSize, bgRepeat, bgBlend };
}
function rBlend(){return rBlendCanvas();}
function rBlendCSS(){return rChoose(getBlendModesCSS());}
function rBlendCanvas(){	return rChoose(getBlendModesCanvas());}
function rTexture(){return rChoose(valf(M.textures,[]));}
function showPaletteMini(dParent, colors, sz=30) {
	let d1 = mDom(dParent, { display: 'flex', wrap: true, gap: 2 }); //, hmax: '100vh', dir: 'column' });
	let items = [];
	for (var c of colors) {
		if (isDict(c)) c = c.hex;
		let fg = 'dimgray'; //colorIdealText(c); if (fg == 'white') fg='silver';
		let dc = mDom(d1, { w: sz, h: sz, bg: c, fg, border:`${fg} solid 3px` });
		items.push({div:dc,bg:c})
	}
	return items;
}
function showPaletteText(dParent, list) {
	let d1 = mDom(dParent, { display: 'flex', wrap: true, gap: 2 }); //, hmax: '100vh', dir: 'column' });
	let items = [];
	for (var c of list) {
		let dc = mDom(d1, {bg:'black',fg:'white'},{html:c});
		items.push({div:dc,text:c})
	}
	return items;
}
function pathFromBgImage(bgImage) { return bgImage.substring(5, bgImage.length - 2); }
function bgImageFromPath(path) { return isdef(path)?`url('${path}')`:null; }
async function showTextures() {
	let d = mBy('dSettingsColor'); mClear(d);
	let dTheme = mDom(d, { padding: 12, gap: 10 }); mFlexWrap(dTheme);
	let list = M.textures;
	if (colorGetLum(U.color)>75) list=list.filter(x=>!x.includes('ttrans'));
	let itemsTexture = [];
	for (const t of list) {
		let bgRepeat = t.includes('marble_') || t.includes('wall') ? 'no-repeat' : 'repeat';
		let bgSize = t.includes('marble_') || t.includes('wall') ? `cover` : t.includes('ttrans') ? '' : 'auto';
		let bgImage = `url('${t}')`;
		let recommendedMode = t.includes('ttrans') ? 'normal' : (t.includes('marble_') || t.includes('wall')) ? 'luminosity' : 'multiply';
		let dc = mDom(dTheme, { bg: U.color, bgImage, bgSize, bgRepeat, bgBlend: 'normal', cursor: 'pointer', border: 'white', w: '30%', wmax: 300, h: 170 });
		let item = { div: dc, path: t, bgImage, bgRepeat, bgSize, bgBlend: recommendedMode, isSelected: false };
		itemsTexture.push(item);
		dc.onclick = async () => onclickTexture(item, itemsTexture);
	}
	return itemsTexture;
}
function arrDisjoint(ad1, ad2, prop) {
	console.log(isDict(ad1), isDict(ad2))
	if (isDict(ad1) && isDict(ad2)) return Object.keys(ad1).find(x => x in ad2);
	else return ad1.map(x => x[prop]).find(el => ad2.map(x => x[prop]) == el);
}
function getListAndDicts(list) {
	let dicts = {}, lists = [];
	for (const arg of Array.from(arguments).slice(1)) {
		//dicts[`by${arg}`]=dict2list(list,arg);
		//console.log(arg)
		lists.push(list2dict(list, arg));
	}
	return [list].concat(lists); //dicts;
}
function getListAndDictsForDicolors() {
	let bucketlist = 'black yellow orangeyellow orange orangered red magentapink magenta bluemagenta blue cyanblue cyan greencyan green yellowgreen'.split(' ');
	bucketlist = arrCycle(bucketlist, 8);
	let dicolorlist = [];
	for (const bucket of bucketlist) {
		let list = dict2list(M.dicolor[bucket]);
		for (const c of list) {
			let o = w3color(c.value);
			o.name = c.id;
			o.hex = c.value;
			o.bucket = bucket;
			dicolorlist.push(o);
		}
	}

	let byhex = list2dict(dicolorlist, 'hex');
	let byname = list2dict(dicolorlist, 'name');
	return [dicolorlist, byhex, byname];
}
function getMyColors1() {
	const colors = [
		{ hex: '#336699', name: 'Dark Slate Blue', bucket: 'blue' },
		{ hex: '#3366cc', name: 'Royal Blue', bucket: 'blue' },
		{ hex: '#000099', name: 'Dark Blue', bucket: 'blue' },
		{ hex: '#0000cc', name: 'Medium Blue', bucket: 'blue' },
		{ hex: '#000066', name: 'Navy Blue', bucket: 'blue' },
		{ hex: '#006666', name: 'Medium Teal', bucket: 'cyanblue' },
		{ hex: '#006699', name: 'Sea Bluegreen', bucket: 'cyanblue' },
		{ hex: '#0099cc', name: 'Deep Sky Blue', bucket: 'cyanblue' },
		{ hex: '#0066cc', name: 'Dodger Blue', bucket: 'cyanblue' },
		{ hex: '#0033cc', name: 'Bright Blue', bucket: 'blue' },
		{ hex: '#3333ff', name: 'Electric Blue', bucket: 'blue' },
		{ hex: '#009999', name: 'Strong Cyan', bucket: 'cyan' },
		{ hex: '#33cccc', name: 'Sea Sky', bucket: 'cyan' },
		{ hex: '#0099ff', name: 'Spring Sky', bucket: 'cyanblue' },
		{ hex: '#0066ff', name: 'Brilliant Blue', bucket: 'cyanblue' },
		{ hex: '#3366ff', name: 'Summer Sky', bucket: 'blue' },
		{ hex: '#3333cc', name: 'Indigo Sky', bucket: 'blue' },
		{ hex: '#339966', name: 'Sea Green', bucket: 'greencyan' },
		{ hex: '#00ffcc', name: 'Aquagreen', bucket: 'cyan' },
		{ hex: '#33ccff', name: 'Light Sky Blue', bucket: 'cyanblue' },
		{ hex: '#6699ff', name: 'Light Royal Blue', bucket: 'blue' },
		{ hex: '#6600ff', name: 'Vivid Violet', bucket: 'bluemagenta' },
		{ hex: '#6600cc', name: 'Deep Purple', bucket: 'bluemagenta' },
		{ hex: '#339933', name: 'Forest Green', bucket: 'green' },
		{ hex: '#00cc66', name: 'Medium Spring Green', bucket: 'greencyan' },
		{ hex: '#00ff99', name: 'Spring Green', bucket: 'greencyan' },
		{ hex: '#66ffcc', name: 'Light Aqua', bucket: 'cyan' },
		{ hex: '#66ffff', name: 'bleach', bucket: 'cyan' },
		{ hex: '#66ccff', name: 'Light Azure', bucket: 'cyanblue' },
		{ hex: '#99ccff', name: 'Pale Sky Blue', bucket: 'cyanblue' },
		{ hex: '#9999ff', name: 'Pale Lilac', bucket: 'bluemagenta' },
		{ hex: '#9966ff', name: 'Medium Violet', bucket: 'bluemagenta' },
		{ hex: '#9933ff', name: 'Electric Lilac', bucket: 'bluemagenta' },
		{ hex: '#9900ff', name: 'Bright Violet', bucket: 'bluemagenta' },
		{ hex: '#00cc00', name: 'Lime Green', bucket: 'green' },
		{ hex: '#66ff99', name: 'Spearmint', bucket: 'greencyan' },
		{ hex: '#99ffcc', name: 'Pale Mint', bucket: 'greencyan' },
		{ hex: '#ccffff', name: 'Very Pale Cyan', bucket: 'cyan' },
		{ hex: '#cc66ff', name: 'Medium Orchid', bucket: 'magenta' },
		{ hex: '#cc33ff', name: 'Bright Orchid', bucket: 'magenta' },
		{ hex: '#9900cc', name: 'Dark Violet', bucket: 'bluemagenta' },
		{ hex: '#003300', name: 'Dark Green', bucket: 'green' },
		{ hex: '#009933', name: 'Jungle Green', bucket: 'green' },
		{ hex: '#33cc33', name: 'Light Green', bucket: 'green' },
		{ hex: '#99ff99', name: 'Pale Green', bucket: 'green' },
		{ hex: '#ccffcc', name: 'Very Pale Green', bucket: 'green' },
		{ hex: '#ffccff', name: 'Rosa', bucket: 'magenta' },
		{ hex: '#ffcccc', name: 'Pale Pink', bucket: 'magenta' },
		{ hex: '#ff99ff', name: 'Light Pink', bucket: 'magenta' },
		{ hex: '#ff66ff', name: 'Magentapink', bucket: 'magenta' },
		{ hex: '#660066', name: 'Purple', bucket: 'magenta' },
		{ hex: '#336600', name: 'Young Olive', bucket: 'green' },
		{ hex: '#009900', name: 'Strong Green', bucket: 'green' },
		{ hex: '#66ff33', name: 'Spring Leaf', bucket: 'yellowgreen' },
		{ hex: '#99ff66', name: 'Light Lime', bucket: 'yellowgreen' },
		{ hex: '#ccff99', name: 'Very Light Green', bucket: 'yellowgreen' },
		{ hex: '#cc0099', name: 'Strong Magenta', bucket: 'magenta' },
		{ hex: '#993399', name: 'Dark Magenta', bucket: 'magenta' },
		{ hex: '#333300', name: 'Very Dark Olive', bucket: 'green' },
		{ hex: '#669900', name: 'Olive Drab', bucket: 'yellowgreen' },
		{ hex: '#99ff33', name: 'Light Chartreuse', bucket: 'yellowgreen' },
		{ hex: '#ccff66', name: 'Pale Yellow Green', bucket: 'yellowgreen' },
		{ hex: '#ff6699', name: 'Light Red Violet', bucket: 'magenta' },
		{ hex: '#ff3399', name: 'Deep Pink', bucket: 'magenta' },
		{ hex: '#cc3399', name: 'Medium Red Violet', bucket: 'magenta' },
		{ hex: '#990099', name: 'Dark Red Violet', bucket: 'magenta' },
		{ hex: '#99cc00', name: 'Lime', bucket: 'yellowgreen' },
		{ hex: '#ccff33', name: 'Light Lime Green', bucket: 'yellowgreen' },
		{ hex: '#ffcc66', name: 'Light Orange', bucket: 'orangeyellow' },
		{ hex: '#ff6666', name: 'Dark Salmon', bucket: 'red' },
		{ hex: '#ff0066', name: 'Hot Pink', bucket: 'magenta' },
		{ hex: '#cc6699', name: 'Medium Pink', bucket: 'magenta' },
		{ hex: '#993366', name: 'Dark Mauve', bucket: 'magenta' },
		{ hex: '#ff5050', name: 'Strawberry', bucket: 'red' },
		{ hex: '#cc0066', name: 'Vivid Raspberry', bucket: 'magenta' },
		{ hex: '#660033', name: 'Dark Red', bucket: 'red' },
		{ hex: '#996633', name: 'Medium Brown', bucket: 'orange' },
		{ hex: '#cc6600', name: 'Orange Brown', bucket: 'orange' },
		{ hex: '#ff3300', name: 'Red Orange', bucket: 'orangered' },
		{ hex: '#cc0000', name: 'Jolly Red', bucket: 'red' },
		{ hex: '#990033', name: 'Dark Crimson', bucket: 'red' },
		{ hex: '#663300', name: 'Darkbrown', bucket: 'orange' },
		{ hex: '#cc3300', name: 'Carrot', bucket: 'orangered' },
		{ hex: '#993333', name: 'Indian Red', bucket: 'red' },
		{ hex: '#fc600a', name: 'Tangerine', bucket: 'orange' },
		{ hex: '#fccc1a', name: 'Bright Yellow', bucket: 'yellow' },
		{ hex: '#b2d732', name: 'Lime Green', bucket: 'yellowgreen' },
		{ hex: '#4424d6', name: 'Violetblue', bucket: 'bluemagenta' },
		{ hex: '#c21460', name: 'Raspberry', bucket: 'magenta' },
		{ hex: '#afff45', name: 'Apple Green', bucket: 'yellowgreen' },
		{ hex: '#42d4f4', name: 'Sky Blue', bucket: 'cyanblue' },
		{ hex: '#ffe119', name: 'Sunshine Yellow', bucket: 'yellow' },
		{ hex: '#e6194b', name: 'Deep Raspberry', bucket: 'red' },
		{ hex: '#3cb44b', name: 'Pleasant Green', bucket: 'green' },
		{ hex: '#4363d8', name: 'Cobalt Blue', bucket: 'blue' },
		{ hex: '#911eb4', name: 'Violet', bucket: 'bluemagenta' },
		{ hex: '#fff620', name: 'Buttercup Yellow', bucket: 'yellow' },
		{ hex: '#f58231', name: 'Orange', bucket: 'orange' },
		{ hex: '#ffd8b1', name: 'Peach', bucket: 'orangeyellow' },
		{ hex: '#000075', name: 'Deep Blue', bucket: 'blue' },
		{ hex: '#ff6f61', name: 'Watermelon', bucket: 'orangered' },
		{ hex: '#c68e17', name: 'Caramel', bucket: 'yellow' },
		{ hex: '#f7cac9', name: 'Light Pink', bucket: 'magenta' },
		{ hex: '#009b77', name: 'Seaglass', bucket: 'cyan' },
		{ hex: '#dd4124', name: 'Rust Red', bucket: 'orangered' },
		{ hex: '#d65076', name: 'Blush', bucket: 'magenta' },
		{ hex: '#efc050', name: 'Goldenrod', bucket: 'orangeyellow' },
		{ hex: '#9b2335', name: 'Carmine', bucket: 'red' },
		{ hex: '#e15d44', name: 'Terracotta', bucket: 'orangered' },
		{ hex: '#bc243c', name: 'Red', bucket: 'red' },
		{ hex: '#c3447a', name: 'Berry Pink', bucket: 'magenta' },
		{ hex: '#ffd662', name: 'Banana', bucket: 'orangeyellow' },
		{ hex: '#f4b9b8', name: 'Pale Blush', bucket: 'magenta' },
		{ hex: '#ff968a', name: 'Light Coral', bucket: 'orangered' },
		{ hex: '#83781b', name: 'Olive', bucket: 'yellowgreen' },
		{ hex: '#d01013', name: 'Scarlet', bucket: 'red' },
		{ hex: '#58a813', name: 'Lawn Green', bucket: 'yellowgreen' },
		{ hex: '#fad302', name: 'Golden Yellow', bucket: 'yellow' },
		{ hex: '#55038c', name: 'Deep Violet', bucket: 'bluemagenta' },
		{ hex: '#ed527a', name: 'Raspberry Pink', bucket: 'magenta' },
		{ hex: '#d99559', name: 'Sand', bucket: 'orange' },
		{ hex: '#049dd9', name: 'Ocean Blue', bucket: 'cyanblue' },
		{ hex: '#ff4057', name: 'Salmon Pink', bucket: 'orangered' },
		{ hex: '#00b8a9', name: 'Sea Green', bucket: 'greencyan' },
		{ hex: '#f46036', name: 'Orange Red', bucket: 'orangered' },
		{ hex: '#e71d36', name: 'Crimson Red', bucket: 'red' },
		{ hex: '#2ec4b6', name: 'Aqua', bucket: 'cyan' },
		{ hex: '#ffd166', name: 'Apricot', bucket: 'orangeyellow' },
		{ hex: '#06d6a0', name: 'Medium Spring Green', bucket: 'greencyan' },
		{ hex: '#ef476f', name: 'Pale Red', bucket: 'orangered' },
		{ hex: '#26547c', name: 'Winter Blue', bucket: 'blue' },
		{ hex: '#ff9f1c', name: 'Vivid Orange', bucket: 'orange' },
		{ hex: '#00bbf9', name: 'Bright Sky Blue', bucket: 'cyanblue' },
		{ hex: '#118ab2', name: 'Blue Green', bucket: 'cyanblue' },
		{ hex: '#073b4c', name: 'Dark Teal', bucket: 'cyanblue' },
		{ hex: '#ffd32d', name: 'Bright Yellow', bucket: 'yellow' },
		{ hex: '#8338ec', name: 'Bright Purple', bucket: 'bluemagenta' },
		{ hex: '#fb5607', name: 'Bright Orange Red', bucket: 'orangered' },
		{ hex: '#ff006e', name: 'Hot Magenta', bucket: 'magenta' },
		{ hex: '#3a86ff', name: 'Bright Blue', bucket: 'blue' },
		{ hex: '#ffbe0b', name: 'Bright Yellow Orange', bucket: 'orangeyellow' },
		{ hex: '#ff006e', name: 'Hot Magenta', bucket: 'magenta' },
		{ hex: '#f94144', name: 'Strong Red', bucket: 'red' },
		{ hex: '#f3722c', name: 'Deep Orange', bucket: 'orangered' },
		{ hex: '#9b5de5', name: 'Bright Violet', bucket: 'bluemagenta' },
		{ hex: '#f15bb5', name: 'Light Magenta', bucket: 'magenta' },
		{ hex: '#fee440', name: 'Bright Yellow', bucket: 'yellow' },
		{ hex: '#00f5d4', name: 'Bright Aqua', bucket: 'cyan' },
		{ hex: '#7209b7', name: 'Dark Purple', bucket: 'bluemagenta' },
		{ hex: '#ff9aa2', name: 'Light Pink', bucket: 'magenta' },
		{ hex: '#ffb7b2', name: 'Light Blush', bucket: 'magenta' },
		{ hex: '#ffdac1', name: 'Peach Puff', bucket: 'orangeyellow' },
		{ hex: '#e2f0cb', name: 'Pale Green', bucket: 'yellowgreen' },
		{ hex: '#b5ead7', name: 'Mint Green', bucket: 'greencyan' },
		{ hex: '#fddb3a', name: 'Bright Yellow', bucket: 'yellow' },
		{ hex: '#f49ac2', name: 'Orchid Pink', bucket: 'magenta' },
		{ hex: '#836fff', name: 'Medium Slate Blue', bucket: 'bluemagenta' },
		{ hex: '#ffd1dc', name: 'Pale Blush Pink', bucket: 'magenta' },
		{ hex: '#a23bec', name: 'Bright Purple', bucket: 'bluemagenta' },
		{ hex: '#450920', name: 'Dark Crimson', bucket: 'red' },
		{ hex: '#004346', name: 'Dark Cyan', bucket: 'cyan' },
		{ hex: '#540b0e', name: 'Dark Maroon', bucket: 'red' },
		{ hex: '#0b132b', name: 'Dark Blue', bucket: 'blue' },
		{ hex: '#3c1874', name: 'Deep Purple', bucket: 'bluemagenta' },
		{ hex: '#08415c', name: 'Dark Cyan Blue', bucket: 'cyanblue' },
		{ hex: '#650d1b', name: 'Deep Red', bucket: 'red' },
		{ hex: '#005f73', name: 'Teal Blue', bucket: 'cyanblue' },
		{ hex: '#6622cc', name: 'Bright Violet', bucket: 'bluemagenta' },
		{ hex: '#6a040f', name: 'Dark Red', bucket: 'red' },
		{ hex: '#230c33', name: 'Dark Purple', bucket: 'bluemagenta' },
		{ hex: '#3a0ca3', name: 'Dark Violet', bucket: 'bluemagenta' },
		{ hex: '#240046', name: 'Very Dark Violet', bucket: 'bluemagenta' },
		{ hex: '#10002b', name: 'Midnight Purple', bucket: 'bluemagenta' }
	];

	let res = [];
	for (const c of colors) {
		let o = w3color(c.hex);
		o.name = transformColorName(c.name);
		o.bucket = c.bucket;
		o.hex = c.hex;
		res.push(o)
	}
	return res; //colors.map(c=>({hex:c.hex,name:transformColorName(c.name),bucket:c.bucket}));
}
function getMyColors2() {
	const colors = [
		{ hex: '#669999', name: 'Desaturated Cyan', bucket: 'cyan' },
		{ hex: '#666699', name: 'Dark Lavender', bucket: 'bluemagenta' },
		{ hex: '#ffffff', name: 'White', bucket: 'black' },
		{ hex: '#a9a9a9', name: 'Dark Gray', bucket: 'blue' },
		{ hex: '#000000', name: 'Black', bucket: 'black' },
		{ hex: '#cb99c9', name: 'Lavender Pink', bucket: 'magenta' },
		{ hex: '#aec6cf', name: 'Pastel Blue', bucket: 'cyanblue' },
		{ hex: '#dea5a4', name: 'Pastel Red', bucket: 'red' },
		{ hex: '#779ecb', name: 'Periwinkle', bucket: 'bluemagenta' },
		{ hex: '#b39eb5', name: 'Pastel Purple', bucket: 'bluemagenta' },
		{ hex: '#cfcfc4', name: 'Light Gray', bucket: 'black' },
		{ hex: '#666633', name: 'Dark Olive Green', bucket: 'yellowgreen' },
		{ hex: '#999966', name: 'Pale Olive', bucket: 'yellowgreen' },
		{ hex: '#347c98', name: 'Steel Blue', bucket: 'cyanblue' },
		{ hex: '#469990', name: 'Teal', bucket: 'cyan' },
		{ hex: '#6b5b95', name: 'Royal Purple', bucket: 'bluemagenta' },
		{ hex: '#88b04b', name: 'Lime Green', bucket: 'yellowgreen' },
		{ hex: '#92a8d1', name: 'Pale Blue', bucket: 'cyanblue' },
		{ hex: '#955251', name: 'Rosewood', bucket: 'red' },
		{ hex: '#b565a7', name: 'Orchid', bucket: 'magenta' },
		{ hex: '#45b8ac', name: 'Medium Turquoise', bucket: 'cyan' },
		{ hex: '#5b5ea6', name: 'Medium Blue', bucket: 'blue' },
		{ hex: '#dfcfbe', name: 'Beige Grey', bucket: 'yellow' },
		{ hex: '#55b4b0', name: 'Dark Turquoise', bucket: 'cyan' },
		{ hex: '#7fcdcd', name: 'Light Cyan', bucket: 'cyan' },
		{ hex: '#98b4d4', name: 'Pale Blue', bucket: 'cyanblue' },
		{ hex: '#8d9440', name: 'Olive', bucket: 'yellowgreen' },
		{ hex: '#a4b086', name: 'Sage Green', bucket: 'yellowgreen' },
		{ hex: '#774d8e', name: 'Purple', bucket: 'bluemagenta' },
		{ hex: '#6e81a0', name: 'Slate Blue', bucket: 'cyanblue' },
		{ hex: '#5a7247', name: 'Military Green', bucket: 'yellowgreen' },
		{ hex: '#d2c29d', name: 'Pale Tan', bucket: 'yellow' },
		{ hex: '#f2e2e0', name: 'Very Pale Pink', bucket: 'magenta' },
		{ hex: '#e1ede9', name: 'Very Pale Cyan', bucket: 'cyan' },
		{ hex: '#5e3d26', name: 'Dark Brown', bucket: 'orange' },
		{ hex: '#a65f46', name: 'Copper Brown', bucket: 'orange' },
		{ hex: '#48bf84', name: 'Light Emerald', bucket: 'greencyan' },
		{ hex: '#90be6d', name: 'Light Olive Green', bucket: 'yellowgreen' },
		{ hex: '#577590', name: 'Airforce Greyblue', bucket: 'blue' },
		{ hex: '#c7ceea', name: 'Lavender Blue', bucket: 'bluemagenta' },
		{ hex: '#2b2d42', name: 'Gun Grey', bucket: 'blue' },
		{ hex: '#3f3351', name: 'Dark Lavender', bucket: 'bluemagenta' },
		{ hex: '#423629', name: 'Dark Taupe', bucket: 'orange' },
		{ hex: '#283618', name: 'Dark Olive', bucket: 'yellowgreen' },
		{ hex: '#462255', name: 'Purple', bucket: 'bluemagenta' },
		{ hex: '#1b263b', name: 'Prussian Blue', bucket: 'blue' },
		{ hex: '#353535', name: 'Dark Gray', bucket: 'black' },
		{ hex: '#101820', name: 'Eerie Black', bucket: 'black' },
		{ hex: '#1a1423', name: 'Raisin Black', bucket: 'black' },
		{ hex: '#4a4e69', name: 'Independence2', bucket: 'bluemagenta' },
		{ hex: '#264653', name: 'Greengrey', bucket: 'cyanblue' }
	];
	let res = [];
	for (const c of colors) {
		let o = w3color(c.hex);
		o.name = transformColorName(c.name);
		o.bucket = c.bucket;
		o.hex = c.hex;
		res.push(o)
	}
	return res; //colors.map(c=>({hex:c.hex,name:transformColorName(c.name),bucket:c.bucket}));

}
function getNavBg() { return mGetStyle('dNav', 'bg'); }
function from01ToPercent(x) { return Math.round(Number(x) * 100); }
function fromPercentTo01(x, nDecimals = 2) { return (Number(x) / 100).toFixed(nDecimals); }
function showColorBox(c, skeys = 'name hex hue sat lum', dParent = null, styles = {}) {

	let bg = c.hex; //isdef(c.hex) ? c.hex : isdef(c.bg) ? c.bg : isdef(c.color) ? c.color : 'white';
	let fg = colorIdealText(bg);
	//console.log('bg',bg)
	let keys = toWords(skeys);

	//console.log()
	let st = jsCopy(styles)
	addKeys({ bg, fg, align: 'center' }, st);
	let textStyles = { weight: 'bold' };

	let d2 = mDom(dParent, st, { class: 'colorbox', dataColor: bg });

	mDom(d2, textStyles, { html: c[keys[0]] });

	let html = '';
	for (let i = 1; i < keys.length; i++) {
		let key = keys[i];
		let val = c[key];
		if (isNumber(val)) val = Number(val);
		if (val <= 1) val = from01ToPercent(val);
		html += `${key}:${val}<br>`;
		
	}
	// let html = `<br>${bg}<br>hue: ${c.hue}<br>sat: ${Math.round(c.sat * 100)}<br>lum: ${Math.round(c.lightness * 100)}<br>bucket: ${c.bucket}`
	let dmini = mDom(d2, {}, { html });

	let item = jsCopy(c);
	item.div = dmini;
	item.dOuter = d2;
	return item;
}
function showColorBoxes(w3extlist, skeys, dParent, styles={}) {
	let d1 = mDom(dParent, { gap: 12, padding: 12 }); mFlexWrap(d1);
	let items = [];
	for (var c of w3extlist) {
		//console.log(c.hex)
		let item = showColorBox(c, skeys, d1, styles); items.push(item);
		items.push(item);
	}
	return items;
}
async function showColors() {
	let d = mBy('dSettingsColor'); mClear(d);
	let di = M.dicolor;
	let bucketlist = 'yellow orangeyellow orange orangered red magentapink magenta bluemagenta blue cyanblue cyan greencyan green yellowgreen'.split(' ');
	bucketlist = arrCycle(bucketlist, 8);
	for (const bucket of bucketlist) {
		let list = dict2list(di[bucket]);
		let clist = [];
		for (const c of list) {
			let o = w3color(c.value);
			o.name = c.id;
			o.hex = c.value;
			clist.push(o);
		}
		let sorted = sortByFunc(clist, x => -x.lightness);
		_showPaletteNames(d, sorted);
	}
	let divs = document.getElementsByClassName('colorbox');
	for (const div of divs) {
		mStyle(div, { cursor: 'pointer' })
		div.onclick = async () => onclickColor(div.getAttribute('dataColor'));
	}
}
function sortDicolor(di){
  if (nundef(di)) di = jsCopy(M.dicolor);
  let dinew = {};
  let kbucket = Object.keys(di);
  kbucket.sort();
  for(const k of kbucket){
    let o=di[k];
    let di_bucket_new={};
    let kc = Object.keys(o);
    kc.sort(); console.log(kc);
    for(const k1 of kc){
      di_bucket_new[k1]=o[k1];
    }
    dinew[k]=di_bucket_new;
    //break;
  }

  //return;
  downloadAsYaml(dinew,'dicolor')

}
function transformColorName(s) {
	let res = replaceAll(s, ' ', '_');
	return res.toLowerCase();
}

//#endregion

//#region integrate 21.mai 24 bau3.js
//#region theme setting
async function onclickSettTheme() { await showThemes(); }
async function onclickSettAddYourTheme() {
  let name = await mGather(iDiv(UI.settAddYourTheme));
  //console.log(`should add theme for user ${getUname()} under name ${name}`);
  let o = {};
  for (const s of ['color', 'bgImage', 'bgBlend', 'fg']) {
    if (isdef(U[s])) o[s] = U[s];
  }
  o.name = name;
  let themes = lookup(Serverdata.config, ['themes']);
  let key = isdef(themes[name]) ? rUniqueId(6, 'th') : name;
  Serverdata.config.themes[key] = o;
  await mPostRoute('postConfig', Serverdata.config);
}

async function showThemes() {
  let d = mBy('dSettingsColor'); mClear(d);
  let d1 = mDom(d, { gap: 12, padding: 10 }); mFlexWrap(d1);
  let themes = lookup(Serverdata.config, ['themes']);
  let bgImage, bgSize, bgRepeat, bgBlend, name, color, fg;
  for (const key in themes) {
    let th = themes[key];
    if (isdef(th.bgImage)) {
      //find bgSize and bgRepeat for bgImage
      bgImage = th.bgImage;
      bgRepeat = (bgImage.includes('marble')||bgImage.includes('wall')) ? 'no-repeat' : 'repeat';
      bgSize = (bgImage.includes('marble')||bgImage.includes('wall')) ? 'cover' : '';
      bgBlend = isdef(th.bgBlend) ? th.bgBlend : (bgImage.includes('ttrans') ? 'normal' : bgImage.includes('marble_') ? 'luminosity' : 'multiply');
    }
    color = th.color;
    if (isdef(th.fg)) fg = th.fg;
    name = th.name;

    let [realBg,bgContrast,bgNav,fgNew,fgContrast] = calculateGoodColors(color,fg)

    let styles = {w:300,h:200,bg:realBg,fg:fgNew,border:`solid 1px ${getCSSVariable('--fgButton')}`};
    if (isdef(bgImage)) addKeys({bgImage,bgSize,bgRepeat},styles);
    if (isdef(bgBlend)) addKeys({bgBlend},styles);
    let dsample = mDom(d1,styles,{theme:key});
    let dnav = mDom(dsample,{bg:bgNav,padding:10},{html:name.toUpperCase()});
    let dmain = mDom(dsample,{padding:10,fg:'black',className:'section'},{html:getMotto()});
    dsample.onclick = onclickThemeSample;
  }
}
async function onclickThemeSample(ev){
  let key = evToAttr(ev,'theme');
  console.log('key',key)
  let theme = jsCopyExceptKeys(Serverdata.config.themes[key],['name']);
  console.log('theme',theme);

  copyKeys(theme,U);
  await postUserChange();
  setTheme();
}
function getMotto(){
  let list = [
    `Let's play!`, 'Enjoy this beautiful space!', 'First vacation day!', 'No place like home!',
    'You are free!', 'Nothing to do here!', `Don't worry, be happy!`, `Good times ahead!`,
    'Right here, right now', 'Life is a dream', 'Dream away!', 'Airport forever'
  ];
  return rChoose(list);
}
//#endregion

//#region color functions neu
function colorBlendMode(c1, c2, blendMode) {
  function blendColorDodge(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    const dodge = (a, b) => (b === 255) ? 255 : Math.min(255, ((a << 8) / (255 - b)));

    let r = dodge(r1, r2);
    let g = dodge(g1, g2);
    let b = dodge(b1, b2);

    return colorRgbArgsToHex79(r, g, b);
  }
  function blendColor(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
    let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);

    // Use the blend hue, but keep the base saturation and lightness
    let cfinal = colorHsl01ArgsToRgbArray(h2, s1, l1);
    return colorRgbArgsToHex79(...cfinal);
  }
  function blendDarken(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    let r = Math.min(r1, r2);
    let g = Math.min(g1, g2);
    let b = Math.min(b1, b2);

    return colorRgbArgsToHex79(r, g, b);
  }
  function blendLighten(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    let r = Math.max(r1, r2);
    let g = Math.max(g1, g2);
    let b = Math.max(b1, b2);

    return colorRgbArgsToHex79(r, g, b);
  }
  function blendLuminosity(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
    let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);

    // Set the luminosity of the base color to the luminosity of the blend color
    let [r, g, b] = colorHsl01ArgsToRgbArray(h1, s1, l2);

    return colorRgbArgsToHex79(r, g, b);
  }
  function blendMultiply(color1, color2) {
    let [r1, g1, b1] = colorHexToRgbArray(color1);
    let [r2, g2, b2] = colorHexToRgbArray(color2);

    // Multiply each channel and divide by 255 to scale back to color space
    let r = (r1 * r2) / 255;
    let g = (g1 * g2) / 255;
    let b = (b1 * b2) / 255;

    return colorRgbArgsToHex79(Math.round(r), Math.round(g), Math.round(b));
  }
  function blendNormal(baseColor, blendColor) {
    return blendColor; // The blend color simply replaces the base color
  }
  function blendOverlay(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    const overlayCalculate = (a, b) => (a <= 128) ? (2 * a * b / 255) : (255 - 2 * (255 - a) * (255 - b) / 255);

    let r = overlayCalculate(r1, r2);
    let g = overlayCalculate(g1, g2);
    let b = overlayCalculate(b1, b2);

    return colorRgbArgsToHex79(r, g, b);
  }
  function blendSaturation(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
    let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);

    // Use the base hue and lightness, blend saturation
    let cfinal = colorHsl01ArgsToRgbArray(h1, s2, l1);
    return colorRgbArgsToHex79(...cfinal);
  }
  function blendScreen(color1, color2) {
    let [r1, g1, b1] = colorHexToRgbArray(color1);
    let [r2, g2, b2] = colorHexToRgbArray(color2);

    // Apply the screen blend mode formula
    let r = 255 - (((255 - r1) * (255 - r2)) / 255);
    let g = 255 - (((255 - g1) * (255 - g2)) / 255);
    let b = 255 - (((255 - b1) * (255 - b2)) / 255);

    return colorRgbArgsToHex79(r, g, b);
  }

  //console.log('blendMode',blendMode);
  let di = {
    darken: blendDarken, lighten: blendLighten, color: blendColor, colorDodge: blendColorDodge, luminosity: blendLuminosity, multiply: blendMultiply, normal: blendNormal, overlay: blendOverlay,
    saturation: blendSaturation, screen: blendScreen
  };
  let func = di[blendMode]; if (nundef(di)) { console.log('blendMode', blendMode); return c1; }
  //console.log(func);
  c1hex = colorFrom(c1);
  c2hex = colorFrom(c2);
  let res = func(c1hex, c2hex);
  //console.log('blend',c1hex,c2hex,'=>',res);
  return res;
}
function colorContrastPickFromList(color, colorlist = ['white', 'black']) {
	let contrast = 0;
	let result = null;
	let rgb = colorHexToRgbArray(colorFrom(color));
	for (c1 of colorlist) {
    let x = colorHexToRgbArray(colorFrom(c1));
		let c = colorGetContrast(rgb, x);
		if (c > contrast) { contrast = c; result = c1; }
	}
	return result;
}
function colorContrastFromElem(elem, list = ['white', 'black']) {
  let bg = mGetStyle(elem, 'bg'); 
  return colorContrastPickFromList(bg, list);
}
function colorsFromBFA(bg, fg, alpha) {
  if (fg == 'contrast') {
    if (bg != 'inherit') bg = colorFrom(bg, alpha);
    fg = colorIdealText(bg);
  } else if (bg == 'contrast') {
    fg = colorFrom(fg);
    bg = colorIdealText(fg);
  } else {
    if (isdef(bg) && bg != 'inherit') bg = colorFrom(bg, alpha);
    if (isdef(fg) && fg != 'inherit') fg = colorFrom(fg);
  }
  return [bg, fg];
}
function colorGetContrast(c1,c2) {
  function luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
	let rgb1 = colorHexToRgbArray(colorFrom(c1));
	let rgb2 = colorHexToRgbArray(colorFrom(c2));
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
	var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
	var brightest = Math.max(lum1, lum2);
	var darkest = Math.min(lum1, lum2);
	return (brightest + 0.05)
		/ (darkest + 0.05);
}
function colorGetLum(c){ return colorGetLum01(c)*100; }
function colorGetLum01(c){
	let hex=colorFrom(c);
	let hsl=colorHexToHsl01Array(hex); //console.log('hsl',hsl);
	return hsl[2];
}
function colorGetHue(c){ return colorGetHue01(c)*360; }
function colorGetHue01(c){
	let hex=colorFrom(c);
	let hsl=colorHexToHsl01Array(hex); //console.log('hsl',hsl);
	return hsl[0];
}
function colorGetSat(c){ return colorGetSat01(c)*100; }
function colorGetSat01(c){
	let hex=colorFrom(c);
	let hsl=colorHexToHsl01Array(hex); //console.log('hsl',hsl);
	return hsl[1];
}
function colorIdealText(bg, grayPreferred = false, nThreshold = 105) {
  let rgb = colorHexToRgbObject(colorFrom(bg));
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;
  var bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
  var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
  if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
  return foreColor;
}
function colorPalette(color, type = 'shade') {  return colorShades(colorFrom(color));}
function colorPaletteFromImage(img) {
  if (nundef(ColorThiefObject)) ColorThiefObject = new ColorThief();
  return ColorThiefObject.getPalette(img).map(x=>colorFrom(x));
}
function colorPaletteFromUrl(path) {
  let img = mCreateFrom(`<img src='${path}' />`);
  let pal = colorPaletteFromImage(img);
  return pal;
}
function colorShades(color) {
  let res = [];
  for (let frac = -0.8; frac <= 0.8; frac += 0.2) {
    let c = colorCalculator(frac, color, undefined, true);
    res.push(c);
  }
  return res;
}
function colorTrans(cAny, alpha = 0.5) { return colorFrom(cAny, alpha); }

function colorTransPalette(n = 9) {
  let c = colorHex('white');
  let pal = [c];
  let [iw, ib] = [Math.floor(n / 2) - 1, Math.floor((n - 1) / 2) - 1];
  let [incw, incb] = [1 / (iw + 1), 1 / (ib + 1)];
  for (let i = 1; i < iw; i++) {
    let alpha = i * incw;
    pal.push(colorTrans(c, alpha));
  }
  pal.push('transparent');
  c = colorHex('black');
  for (let i = 1; i < ib; i++) {
    let alpha = i * incb;
    pal.push(colorTrans(c, alpha));
  }
  pal.push(c);

  return pal;
}
//#endregion


function calculateGoodColors(bg, fg) {
	let fgIsLight = isdef(fg) ? colorIdealText(fg) == 'black' : colorIdealText(bg) == 'white';
	let bgIsDark = colorIdealText(bg) == 'white';
	if (nundef(fg)) fg = colorIdealText(bg);
	let bgNav = bg;
	fg = colorToHex79(fg);
	if (fgIsLight) {
		if (isEmpty(U.bgImage)) { bgNav = '#00000040'; }
		else if (bgIsDark) { bgNav = colorTrans(bg, .8); }
		else { bgNav = colorTrans(colorDark(bg, 50), .8); }
	} else {
		if (isEmpty(U.bgImage)) { bgNav = '#ffffff40'; }
		else if (!bgIsDark) { bgNav = colorTrans(bg, .8); }
		else { bgNav = colorTrans(colorLight(bg, 50), .8); }
	}
	let t = U.bgImage;
	let realBg = bg;
	if (bgNav == realBg) bgNav = fgIsLight ? colorDark(bgNav, .2) : colorLight(bgNav, .2);
	let bgContrast = fgIsLight ? colorDark(bgNav, .2) : colorLight(bgNav, .2);
	let fgContrast = fgIsLight ? '#ffffff80' : '#00000080'; 
	return [realBg, bgContrast, bgNav, fg, fgContrast];
}
async function gameoverScore(table) {
	table.winners = getPlayersWithMaxScore(table);
	table.status = 'over';
	table.turn = [];
	let id = table.id;
	let name = getUname();
	let step = table.step;
	let stepIfValid = step + 1;
	let o = { id, name, step, stepIfValid, table };
	let res = await mPostRoute('table', o); //console.log(res);

}
function modifyStat(name,prop,val){
	//for this to work need to provide opts.id to playerStatCount!
	let id = `stat_${name}_${prop}`;
	console.log('id',id)
	let ui=mBy(id);
	console.log('ui',ui)
	if (isdef(ui)) ui.innerHTML = val;
}
function playerStatCount(key, n, dParent, styles = {}, opts = {}) {
	let sz = valf(styles.sz, 16);
	addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'center', fz: sz, align: 'center' }, styles);
	let d = mDiv(dParent, styles);
	let o = M.superdi[key];
	if (isdef(o)) showImage(key, d, { h: sz, 'line-height': sz, w: '100%', fg: 'grey' }, true);
	else mText(key, d, { h: sz, fz: sz, w: '100%' });
	d.innerHTML += `<span ${isdef(opts.id)?`id='${opts.id}'`:''} style="font-weight:bold;color:inherit">${n}</span>`;
	return d;
}
function showValidMoves(table) {
	if (nundef(table.moves)) { console.log('no moves yet!'); return; }
	console.log('________', table.step)
	for (const m of table.moves) {
		console.log(`${m.step} ${m.name}: ${m.move.map(x => x.substring(0, 5)).join(',')} (${m.change})=>${m.score}`);
	}
}


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

//#endregion

//#region integrate 18.mai 24 baui.js


//#region bau3, bau4

function isSameTableOpen(id){return T && T.id == id;}
async function onsockMerged(x) {
	if (!isSameTableOpen(x.id)) return;
	await showTable(x);
}
async function onsockTable(x) {
	let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];
	let menu = getMenu();
	let me = getUname();
	if (turn.includes(me) && menu == 'play') {Tid = id;await switchToMainMenu('table');}
	else if (menu == 'table') await showTable(id);
	else if (menu == 'play') await showTables();
}
async function onsockTables(x) { //passiert nur bei deleteTable!
	let menu = getMenu();
	if (menu == 'play') await showTables('onsockTables');
	else if (menu == 'table') {
		assertion(isdef(T),"menu table but no table!!!")
		let id = T.id;
		let exists = x.find(t => t.id == id);
		if (nundef(exists)) {Tid=T=null; await switchToMenu(UI.nav, 'play');}
	}
}
async function onsockPending(id) { 
	if (!isSameTableOpen(id)) return;
	await showTable(id);
}
async function sendMergeTable(o, cond = 'merge') {
	if (nundef(o)) {
		let table = Cliendata.table;
		let name = getUname();
		let id = table.id;
		o = { name, id, table };
	} else if (nundef(o.name)) {
		let table = o;
		let name = getUname();
		let id = table.id;
		o = { name, id, table };
	}
	let table = await mPostRoute(`${cond}Table`, o);
	if (!isDict(table)) { console.log('from server', table); } //INVALID!!!
	else await showTable(table);
}
async function sendRaceError(table, name, errors = 1) {
	let data = {
		id: table.id,
		name,
		errors,
		olist: [
			{ keys: ['players', name, 'score'], val: table.players[name].score - errors },
			{ keys: ['players', name, 'errors'], val: valf(table.players[name].errors, 0) + errors }
		]
	}
	let res = await sendMergeTable(data, 'race');
}
async function sendRaceStepScore(table, name, score = 1, olist = []) {
	let step = table.step + 1;
	olist.push({ keys: ['step'], val: step });
	olist.push({ keys: ['players', name, 'score'], val: table.players[name].score + score });
	let data = { id: table.id, name, step, olist };
	let res = await sendMergeTable(data, 'race');
}

async function onclickTable(id) {
	Tid = id;
	await switchToMainMenu('table');
	//await showTable(id);
}
async function onclickTableMenu() {
	let id = getTid();
	if (nundef(id)){
		let me = getUname();
		let table = Serverdata.tables.find(x => x.status == 'started' && x.turn.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status == 'started' && x.playerNames.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status != 'open' && x.playerNames.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status != 'open');
		if (isdef(table)) id=table.id;
	}
  //console.log('id',id)
	if (isdef(id)) {Tid=null;await showTable(id); } else await switchToMainMenu('play');
}
async function switchToMainMenu(name) { return await switchToMenu(UI.nav, name); }

async function switchToMenu(menu, key) {
	menuCloseCurrent(menu);
	Menu = {key}; localStorage.setItem('menu',key);
	await menuOpen(menu, key);
}
async function switchToOtherUser() {
	let uname = await mGetRoute('otherUser', arguments);
	await switchToUser(uname);
}
async function switchToTables() { return await switchToMainMenu('play'); }

async function switchToUser(uname,menu) {
	if (!isEmpty(uname)) uname = normalizeString(uname);
	if (isEmpty(uname)) uname = 'guest';
	sockPostUserChange(U ? getUname() : '', uname); //das ist nur fuer die client id!
	U = await getUser(uname);
	localStorage.setItem('username', uname);
	iDiv(UI.user).innerHTML = uname;
	setTheme(U);
	menu = valf(menu,getMenu(),localStorage.getItem('menu'),'home');
  switchToMainMenu(menu);
}



//#endregion


//#region showTables NEW
async function showTables(from) {
	await updateTestButtonsLogin();
	let me = getUname();
	let tables = Serverdata.tables = await mGetRoute('tables');
	tables.map(x => x.prior = x.status == 'open' ? 0 : x.turn.includes(me) ? 1 : x.playerNames.includes(me) ? 2 : 3);
	sortBy(tables, 'prior');
	let dParent = mBy('dTableList');
	if (isdef(dParent)) { mClear(dParent); }
	else dParent = mDom('dMain', {}, { className: 'section', id: 'dTableList' });
	if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }
	tables.map(x => x.game_friendly = capitalize(getGameFriendly(x.game)));
	mText(`<h2>game tables</h2>`, dParent, { maleft: 12 })
	let t = UI.tables = mDataTable(tables, dParent, null, ['friendly', 'game_friendly', 'playerNames'], 'tables', false);
	mTableCommandify(t.rowitems.filter(ri => ri.o.status != 'open'), {
		0: (item, val) => hFunc(val, 'onclickTable', item.o.id, item.id),
	});
	mTableStylify(t.rowitems.filter(ri => ri.o.status == 'open'), { 0: { fg: 'blue' }, });
	let d = iDiv(t);
	for (const ri of t.rowitems) {
		let r = iDiv(ri);
		let id = ri.o.id;
		if (ri.o.prior == 1) mDom(r, {}, { tag: 'td', html: getWaitingHtml(24) });
		if (ri.o.status == 'open') {
			let playerNames = ri.o.playerNames;
			if (playerNames.includes(me)) {
				if (ri.o.owner != me) {
					let h1 = hFunc('leave', 'onclickLeaveTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
				}
			} else {
				let h1 = hFunc('join', 'onclickJoinTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
			}
		}
		if (ri.o.owner != me) continue;
		let h = hFunc('delete', 'onclickDeleteTable', id); let c = mAppend(r, mCreate('td')); c.innerHTML = h;
		if (ri.o.status == 'open') { let h1 = hFunc('start', 'onclickStartTable', id); let c1 = mAppend(r, mCreate('td')); c1.innerHTML = h1; }
	}
}
function showGames(ms = 500) {
	let dParent = mBy('dGameList'); if (isdef(dParent)) { mClear(dParent); } else dParent = mDom('dMain', {}, { className: 'section', id: 'dGameList' });
	mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
	let d = mDiv(dParent, { fg: 'white' }, 'game_menu'); mFlexWrap(d);
	let gamelist = 'accuse aristo bluff ferro nations spotit wise'; if (DA.TEST0) gamelist += ' a_game'; gamelist = toWords(gamelist);
	gamelist = ['button96']; //'button99','button98','button97','setgame']
	for (const gname of gamelist) {
		let g = getGameConfig(gname);
		let [sym, bg, color, id] = [M.superdi[g.logo], g.color, null, getUID()];
		let d1 = mDiv(d, { cursor: 'pointer', rounding: 10, margin: 10, padding: 0, patop: 10, w: 140, height: 100, bg: bg, position: 'relative' }, g.id);
		d1.setAttribute('gamename', gname);
		d1.onclick = onclickGameMenuItem;
		mCenterFlex(d1);
		let o = M.superdi[g.logo];
		let el = mDom(d1, { matop: 0, mabottom: 6, fz: 65, hline: 65, family: 'emoNoto', fg: 'white', display: 'inline-block' }, { html: o.text });
		mLinebreak(d1);
		mDiv(d1, { fz: 18, align: 'center' }, null, g.friendly);
	}
}

//#endregion

//#region game menu
function allPlToPlayer(name){
	let allPl = DA.allPlayers[name];
	return jsCopyExceptKeys(allPl,['div','isSelected']);
}
function collectPlayers() {
	let players = {};
	for (const name of DA.playerList) {		players[name] = allPlToPlayer(name);}
	return players;
}
function createGamePlayer(name, gamename, opts = {}) {
	let pl = userToPlayer(name, gamename);
	copyKeys(opts, pl);
	return pl;
}
function createOpenTable(gamename, players, options) {
	let me = getUname();
	let playerNames = [me];
	assertion(me in players, "_createOpenTable without owner!!!!!")
	for (const name in players) { addIf(playerNames, name); }

	let table = {
		status: 'open',
		id: generateTableId(),
		fen: null,
		game: gamename,
		owner: playerNames[0],
		friendly: generateTableName(),
		players,
		playerNames: playerNames,
		options
	};
	return table;
}
function highlightPlayerItem(item) { mStyle(iDiv(item), { bg: getUserColor(item.name), fg: 'white', border: `white` }); }

async function saveDataFromPlayerOptionsUI(gamename) {
	let id = 'dPlayerOptions';
	let lastAllPl = DA.lastAllPlayerItem;
	let dold = mBy(id);
	if (isdef(dold)) { await saveAndUpdatePlayerOptions(lastAllPl, gamename); dold.remove(); }
}
async function saveAndUpdatePlayerOptions(allPl, gamename) {
	let name = allPl.name;
	let poss = getGamePlayerOptionsAsDict(gamename);
	if (nundef(poss)) return;

	let opts = {};
	for (const p in poss) { allPl[p] = getRadioValue(p); if (p != 'playmode') opts[p] = allPl[p]; }

	let id = 'dPlayerOptions'; mRemoveIfExists(id); //dont need UI anymore

	let oldOpts = valf(getUserOptionsForGame(name, gamename), {});

	let changed = false;
	for (const p in poss) {
		if (p == 'playmode') continue;
		if (oldOpts[p] != opts[p]) { changed = true; break; }
	}

	if (changed) {
		let games = valf(Serverdata.users[name].games, {});
		games[gamename] = opts;
		await postUserChange({ name, games })
	}
}
async function setPlayerPlaying(allPlItem, gamename) {
	let [name, da] = [allPlItem.name, allPlItem.div];
	addIf(DA.playerList, name);
	highlightPlayerItem(allPlItem);

	await saveDataFromPlayerOptionsUI(gamename);

	let id = 'dPlayerOptions';
	DA.lastAllPlayerItem = allPlItem;

	let poss = getGamePlayerOptions(gamename);
	if (nundef(poss)) return;

	//console.log('item', allPlItem)

	let dParent = mBy('dGameMenu');
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
			let userval = lookup(DA.allPlayers, [name, p]);
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
	mButtonX(d1, ev => saveAndUpdatePlayerOptions(allPlItem, gamename), 18, 3, 'dimgray');
}
async function showGameOptions(dParent, gamename) {
	let poss = getGameOptions(gamename);
	if (nundef(poss)) return;
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = formatLegend(key);
			let fs = mRadioGroup(dParent, {}, `d_${key}`, legend);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
			measureFieldset(fs);
		}
	}
	let inpsolo = mBy(`i_gamemode_solo`);//console.log('HALLO',inpsolo)
	let inpmulti = mBy(`i_gamemode_multi`);
	if (isdef(inpsolo)) inpsolo.onclick = setPlayersToSolo;
	if (isdef(inpmulti)) inpmulti.onclick = setPlayersToMulti;
}
async function showGamePlayers(dParent, users) {
	let me = getUname();
	mStyle(dParent, { wrap: true });
	let userlist = ['amanda', 'felix', 'mimi'];
	for (const name in users) addIf(userlist, name);
	for (const name of userlist) {
		let d = mDom(dParent, { align: 'center', padding: 2, cursor: 'pointer', border: `transparent` });
		let img = showUserImage(name, d, 40);
		let label = mDom(d, { matop: -4, fz: 12, hline: 12 }, { html: name });
		d.setAttribute('username', name)
		d.onclick = onclickGameMenuPlayer;

		let item = userToPlayer(name, DA.gamename); item.div = d; item.isSelected = false;

		DA.allPlayers[name] = item;
	}
	await clickOnPlayer(me);
}
function userToPlayer(name, gamename, playmode = 'human') {
	//assumes Serverdata.users is up-to-date!!!
	let user = Serverdata.users[name];
	let pl = jsCopyExceptKeys(user, ['games']);
	let options = valf(getUserOptionsForGame(name, gamename), {});
	addKeys(options, pl);

	pl.playmode = playmode;

	//for all the player options in this game, if this user does not have the corresponding options,
	//copy the default value from game options	
	let poss = getGamePlayerOptions(gamename);
	//console.log('poss', poss);
	for (const p in poss) {
		if (isdef(pl[p])) continue;
		let val = poss[p];
		let defval = arrLast(val.split(','));
		if (isNumber(defval)) defval = Number(defval);
		pl[p] = defval;
		//console.log('default for',p,'is',defval);
	}
	return pl;
}


//#endregion

function amIHuman(table){  return isPlayerHuman(table,getUname());}
function calcHeightLeftUnder(div) {
  let hwin = window.innerHeight;
  let r = getRect(div);
  let top = r.b; //console.log('top',top)
  let h = hwin - top;
  return h;
}
function get_waiting_html(sz = 30) { return `<img src="../assets/icons/active_player.gif" height="${sz}" style="margin:0px ${sz / 3}px" />`; }
function isPlayerHuman(table,name){return table.players[name].playmode != 'bot';}
function mFlexLine(d,startEndCenter='center'){mStyle(d,{display: 'flex','justify-content': startEndCenter,'align-items': 'center'});}
function mSwitch(dParent,styles={},opts={}) {
  addKeys({id:'dSwitch',val:''},opts);
  let inpid=`inp${opts.id}`
  let html = `
      <label class="switch">
        <input id='${inpid}' type="checkbox" ${opts.val}>
        <span class="slider round"></span>
      </label>
    `;
  opts.html=html
  let d=mDom(dParent,styles,opts);
  return {div:d,inp:mBy(inpid)};
}
async function onchangeBotSwitch(ev) {
  let elem = ev.target;
  assertion(T,"NO TABLE!!!!!!!!!!!!!!!")
  let name=getUname();
  let id = T.id;
  let playmode = (elem.checked) ? 'bot':'human';
  let olist = [{keys: ['players', name, 'playmode'], val: playmode}];
  let res=await mPostRoute(`olist`, {id,name,olist}); console.log(res)
}
async function resetUsers() {
  for (const name in Serverdata.users) {
    let uold = Serverdata.users[name];
    let unew = {};
    let list = ['name', 'key', 'color', 'bgImage', 'bgBlend', 'bgRepeat', 'bgSize'];
    for (const s of list) unew[s] = uold[s];
    //let unew = {name,color:uold.color,key:uold.key};
    await postUserChange(unew, true);
  }
  console.log(Serverdata.users);
}
//#endregion
async function ondropSaveUrl(url) {
	console.log('save dropped url to config:', url);
	Serverdata.config = mPostRoute('postConfig', { url: url });
}
app.post('/postConfig', (req, res) => {
	console.log('<== post config')
	let newConfig = req.body;
	let oldConfig = Session.config;
	Session.config = deepMerge(oldConfig, newConfig);
	let y = yaml.dump(Session.config);
	fs.writeFileSync(configFile, y, 'utf8');
	res.json(Session.config);
});





