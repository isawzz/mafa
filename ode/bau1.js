
function wordAfter(arr,w){
	if (isString(arr)) arr = toWords(arr);
	let i=arr.indexOf(w);
	return i>=0 && arr.length>i?arr[i+1]:null;
}
function calcYears(n,unit){
	let ch=unit[0];
	let frac=ch == 'y'?1:ch == 'm'?12:ch == 'w'?52:ch == 'd'?365:ch == 'h'?365*24:1;
	return n/frac;
}
function yearsToReadable(n){
	let di={y:1,m:12,w:52,d:365,h:365*24};
	if (n>1) return n.toFixed(1)+' years';
	if (n*12>1)return (n*12).toFixed(1)+' months';
	if (n*52>1)return (n*52).toFixed(1)+' weeks';
	if (n*365>1)return (n*365).toFixed(1)+' days';
	return (n*365*24).toFixed(1)+' hours';
}
function calcLifespan(s){

	let arr = allNumbers(s,Math.abs);
	let num,unit,lifespan;
	if (!isEmpty(arr)){
		if (arr.length>2) arr=arr.slice(0,2)
		let n=arrAverage(arr);
		unit = s.includes('year')?'y':s.includes('month')?'m':s.includes('week')?'w':s.includes('day')?'d':s.includes('hour')?'h':'y';
		num=calcYears(n,unit);
		lifespan=yearsToReadable(num);
	}else{
		let s1=s.toLowerCase();	
		let words = toWords(s1); //console.log('words',words)
		if (s1.includes('a few')){
			unit = wordAfter(words,'few');
			let n=calcYears(3,unit);
			arr.push(n);
		}

		if (s1.includes('several')){
			unit = wordAfter(words,'several'); //console.log('unit',unit)
			let n=calcYears(3,unit);
			arr.push(n);
			let next = wordAfter(words,unit); //console.log('...',next)
			if (next == 'to') {
				//console.log('jaaaaaaaaaaaaaaaa')
				unit = wordAfter(words,'to'); //console.log('unit',unit)
				if (['day','week','month','year'].some(x=>unit.startsWith(x))) {
					let n=calcYears(3,unit);
					arr.push(n);
				}
			}
		}

		let di={one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, fifteen:15, twenty:20};
		for(const w of Object.keys(di)){
			if (s.includes(w)) {
				let n=calcYears(di[w],stringAfter(s,w));
				arr.push(n);
			}
		}

		let n=arrAverage(arr);
		unit = 'year';
		lifespan=yearsToReadable(n);
		//let nums = allNumbers(lifespan); console.log('nums',nums)
		num=allNumbers(lifespan)[0];
		unit=stringAfter(lifespan,' ');
	}

	unit=unit[0];
	return {s,lifespan,num,unit};
}
function findAllFoodTypes(){
	let res = [];
	for(const k in M.details){
		let o = M.details[k];
		//console.log(k,o.food);
		let food = o.food.toLowerCase();
		let type=null;
		for(const t of ['omni','herbi','carni','insecti']){
			if (food.includes(t)) type = t;
		}
		if (!type) type = food;
		addIf(res,type);
	}
	return res;
}
function extractFoodType(s){
	for(const t of ['omni','herbi','carni','insecti']){
		if (food.includes(t)) return t+'ivorous';
	}
	let plants = M.byCat.plant;plants=plants.concat(['leave','tree','twig','fruit','grass','grain']);
	let carni = M.byCat.animal;

	let types=[];
	if (plants.some(x=>s.includes(x))) types.push('herbi');
	if (carni.some(x=>s.includes(x))) types.push('carni');
	if (isEmpty(types)) {console.log(s); return 'unknown'}
	if (types.length >= 2) return 'omnivorous';
	else return types[0]+'ivorous';

}








