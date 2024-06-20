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

	console.log('words',words);

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
	text = `${num} ${unit}`;
	return {str,num,unit,text,avg};
}


