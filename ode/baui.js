
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
function calcNumericInfo(str, diunit, base) {
	if (nundef(str)) return {str:'',num:0,base,text:''};
	let s = str.toLowerCase(); s = replaceAll(s, '-', ' ');
	let words1 = toWords(s);
	let words = words1.map(x=>x == 'few' || x == 'several'?3:x); //console.log(words)
	let arr = allNumbers(words.join(' ')); //console.log(arr)
	if (isEmpty(arr)) {
		console.log('could NOT find any numbers!!!!')
		return { str, num: 1, unit: base, text: s };
	}
	//console.log(arr)
	let num, unit, text;

	//console.log('words',words);
	let units = Object.keys(diunit);
	let arrunits=[];
	let unitFound=base;
	for(const n of arr){
		let i=words.indexOf(n); //console.log('...',n,arr,words,i)
		unit=arrFindKeywordFromIndex(units,words,i);
		if (unit) {
			unitFound = unit.w; 
		arrunits.push({n,unit:unit.w});
		}else console.log(arr,n,words,i,unit)
		words = words.slice(i+1);
	}

	//jetzt werden alle zahlen in arr umgerechnet in die entsprechende base unit
	for(const o of arrunits){
		o.nnorm = o.n*diunit[o.unit];
	}

	let avg = arrBalancedAverage(arrunits,'nnorm'); //let av2=arrBalancedAverage(arrunits,'nnorm')
	unit = arrunits[0].unit;
	num = avg/diunit[unit]; 
	text = `${num} ${unit}`;
	return {str,num,unit,text,avg};
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
