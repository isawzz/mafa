
function showCardWingspanPortrait(o, d, sz=500) {

	let [yTitle, yPic, szPic] = [8, sz / 5, sz / 2];
	let [yLifespan, yBrown, hTop] = [yPic + szPic, yPic + szPic + 22, yPic];

	let card = cBlank(d, { h: sz, border: 'silver' });
	let dCard = iDiv(card);// console.log(card);

	let d1 = showim1(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tc', 0, yPic);

	let title = fromNormalized(o.friendly);
	let dtitle = mDom(dCard, { display: 'inline', weight: 'bold' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle);

	title = o.species; //fromNormalized(o.friendly);
	dtitle = mDom(dCard, { display: 'inline', 'font-style': 'italic' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle+24);
	
	let n=o.offsprings.num;
	let plaetze=nundef(n)?2:n==0?0:n==1?1:n<8?2:n<25?3:n<100?4:n<1000?5:6;
	//jetzt muss ich plaetze * kleinen circle machen unter den title!
	
	let dplaetze=mDom(dCard,{bg:'red'}); mCenterFlex(dplaetze);

	mPlace(dplaetze, 'tc', 0, yTitle+44);

	return o;



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








