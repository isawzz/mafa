
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
			let img=showim1('../ode/pie2.png',d,{w:szimg,h:szimg});//mStyle(img,{round:true})
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


