
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
function calcOffsprings(str){

	let s=str.toLowerCase(); s=replaceAll(s,'-',' ');s=replaceAll(s,',','');
	let arr = allNumbers(s);
	let words = toWords(s);

	if (isEmpty(arr)) return 1;

	let newarr=[];
	for(const n of arr){
		let w=wordAfter(words,n);
		if (isdef(w) && ['day','month','week','year'].some(x=>w.includes(x))) break;
		newarr.push(n);
	}

	let num=arrAverage(newarr);
	let text = newarr.length == 1? `${newarr[0]}-${newarr[1]} children}`:`${num} children`;
	return {str,num,unit:'child',text};

}
function calcNumericInfo(str,diunit,base){

	let s=str.toLowerCase(); s=replaceAll(s,'-',' ');
	let arr = allNumbers(s);

	//console.log(arr)

	//assertion(!isEmpty(arr));
	if (isEmpty(arr)) return {str,num:1,unit:base,text:s};

	let num,unit,text;
	for(const k in diunit){
		unit = k; //diunit[k];
		if (s.includes(unit)){
			let arr = allNumbers(s,Math.abs);
			let n=arrAverage(arr);
			text=`${n.toFixed(1)} ${unit}`;
			num=n*diunit[k];
			return {s,num,unit,text};
		}
	}
	return {s,num:1,unit:base,text:s};
}
function calcYears(n,unit){
	let ch=unit[0];
	let frac=ch == 'y'?1:ch == 'm'?12:ch == 'w'?52:ch == 'd'?365:ch == 'h'?365*24:1;
	return n/frac;
}
function extractFoodType(s){
	s=s.toLowerCase();
	for(const t of ['omni','herbi','carni','insecti']){
		if (s.includes(t)) return t+'vorous';
	}
	let plants = M.byCat.plant;plants=plants.concat(['leave','tree','twig','fruit','grass','grain']);
	let carni = M.byCat.animal;

	let types=[];
	if (plants.some(x=>s.includes(x))) types.push('herbi');
	if (carni.some(x=>s.includes(x))) types.push('carni');
	if (isEmpty(types)) {console.log(s); return 'unknown'}
	if (types.length >= 2) return 'omnivorous';
	else return types[0]+'vorous';

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
function showInfoCard(key,d){
  let sz = 400;
  let [yTitle,yPic,szPic]=[8,sz/5,sz/2];
  let [yLifespan,yBrown,hTop]=[yPic+szPic,yPic+szPic+22,yPic];

  let card = cBlank(d, { h: sz, border: 'dimgray' });
  let dCard = iDiv(card);// console.log(card);
  let d1 = showim1(key, dCard, { rounding: 12, w: szPic, h: szPic },{prefer:'photo'});

  //eigentlich moecht ich auf jeden fall als photo shown!!!

  mPlace(d1, 'tc', 0, yPic); 

  let o = M.superdi[key];
	let details = detailsForKey(key);
	let di = detailsPresentDict(details);
  addKeys(di,o);

  let title = fromNormalized(o.friendly);
  let dtitle = mDom(dCard,{display:'inline',weight:'bold'},{html:title});
  mPlace(dtitle,'tc',0,yTitle); 

  let lifespan = calcLifespan(o.lifespan);// console.log('lifespan',lifespan);
  let dbrown = mDom(dCard,{matop:yBrown,w100:true,bg:'sienna',fg:'white',padding:10,box:true},{html:'WHEN ACTIVATED: All players gain 1 food from supply.'})
  let dlifespan=mDom(dCard,{display:'inline'},{html:lifespan.lifespan})
  mPlace(dlifespan,'tr',40,280);

  let foodtype = extractFoodType(o.food); //console.log(key,foodtype)
  let difood= {omnivorous:'pot_of_food',carnivorous:'poultry_leg',herbivorous:'seedling',insectivorous:'ant'}
  let dfood = mDom(dCard); //,{bg:'silver',round:true,}); //,{},{html:foodtype});
  showim1(difood[foodtype],dfood,{sz:30});
  mPlace(dfood,'tl',10,0)

  let weight = calcNumericInfo(o.weight,{kg:1000,g:1,mg:.001},'kg');
  let size = calcNumericInfo(o.size,{cm:.01,centimeter:.01,mm:.001,millimeter:.001,meter:1,m:1},'m');
  let offs = calcOffsprings(o.offsprings);

  //console.log(key,offs.text);

  //mLinebreak(d)

  return o;

}
function wordAfter(arr,w){
	if (isString(arr)) arr = toWords(arr);
	let i=arr.indexOf(w);
	return i>=0 && arr.length>i?arr[i+1]:null;
}
function yearsToReadable(n){
	let di={y:1,m:12,w:52,d:365,h:365*24};
	if (n>1) return n.toFixed(1)+' years';
	if (n*12>1)return (n*12).toFixed(1)+' months';
	if (n*52>1)return (n*52).toFixed(1)+' weeks';
	if (n*365>1)return (n*365).toFixed(1)+' days';
	return (n*365*24).toFixed(1)+' hours';
}








