//#region new coll code
async function collAddItem(coll, key, item) {
	if (isdef(M.superdi[key])) addIf(item.colls, coll.name);
	let di = {}; di[key]=item;
	await updateSuperdi(di);
}
async function collOnDroppedItem(item, coll) {
	assertion(isdef(item.key), 'NO KEY!!!!!');
	await collAddItem(coll, item.key, item);
	collOpenSecondary(4, 2);
	showImageBatch(coll, 0);
}
async function onclickCollItemLabel(ev) {
	evNoBubble(ev);
	let o = evToAttrElem(ev, 'key');
	if (!o) return;
	let [key, elem] = [o.val, o.elem];
	if (nundef(key)) { console.log('no key'); return; }
	let collname = elem.getAttribute('collname');
	console.log('clicked', key, collname);
	let newfriendly = await mGather(ev.target);
	if (!newfriendly) return;
	if (isEmpty(newfriendly)) {
		showMessage(`ERROR: name invalid: ${newfriendly}`);
		return;
	}
	console.log('rename friendly to', newfriendly)
	let item = M.superdi[key];
	item.friendly = newfriendly;

	let di={};
	di[key]=item;
	// await updateSuperdi(di,key)
	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	// let resp = await mPostRoute('postUpdateItem', { key: key, item: item });
	// console.log(resp);
	ev.target.innerHTML = newfriendly;
}
function showDetailsAndMagnify(elem){
	let key = elem.firstChild.getAttribute('key')
	if (nundef(key)){mMagnify(elem);return;}
	MAGNIFIER_IMAGE = elem;
	let d=mPopup(null,{},{id:'hallo'});
	let o=M.superdi[key];
	addKeys(M.details[key],o);
	addKeys(M.details[o.friendly],o)
	let title=fromNormalized(valf(o.name,o.friendly));
	mDom(d,{},{tag:'h1',html:title});
	mDom(d,{},{tag:'img',src:valf(o.photo,o.img)});
	for(const k in o){
		if ('cats colls fa fa6 img photo text key friendly ga name'.includes(k)) continue;
		let val = o[k];
		if (!isLiteral(val)) continue;
		mDom(d,{},{html:`${k}:${val}`})
	}
}
function showImageInBatch(key, dParent, styles = {}, opts={}) {
	let o = M.superdi[key]; o.key = key;
	addKeys({ bg: rColor() }, styles);
	mClear(dParent);
	[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
	let [sz, fz] = [.9 * w, .8 * h];
	let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	let src= (opts.prefer == 'photo' && isdef(o.photo))?o.photo:valf(o.img,null); 
	if (isdef(src)) {
		if (o.cats.includes('card')) {
			el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src});
			mDom(d1, { h: 1, w: '100%' })
		} else {
			el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src });
		}
	}
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	assertion(el, 'PROBLEM mit' + key);
	let label = mDom(d1, { fz: 11, cursor: 'pointer' }, { html: o.friendly, className: 'ellipsis hoverHue' });
	label.onclick = onclickCollItemLabel;
	mStyle(d1, { cursor: 'pointer' });
	d1.onclick = onclickCollItem;
	d1.setAttribute('key', key);
	d1.setAttribute('draggable', true)
	d1.ondragstart = () => { UI.draggedItem = o; };
	return d1;
}
async function updateSuperdi(di,key){
	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	collPostReload();
}
//#endregion

//#region new functions
function clearMain() { staticTitle(); clearEvents(); mClear('dMain'); mClear('dTitle'); clearMessage(); }

async function correctUsersDeleteKeyImageKey() {
  for (const name in Serverdata.users) {
    let u = Serverdata.users[name];
    delete u.key;
    delete u.imageKey;
    await postUserChange(u, true);
  }
}
function fromNormalized(s){
	let x=replaceAll(s,'_',' ');
	let words = toWords(x).map(x=>capitalize(x)).join(' ');
	return words;
}
async function instructionStandard(table, instruction) {
  let myTurn = isMyTurn(table);

  if (!myTurn) staticTitle(table); else animatedTitle();

  if (nundef(instruction)) return;

  let styleInstruction = { display: 'flex', 'justify-content': 'center', 'align-items': 'center' };
  let dinst = mBy('dInstruction'); mClear(dinst);

  let html;
  if (myTurn) {
    styleInstruction.maleft = -30;
    html = `
        ${get_waiting_html()}
        <span style="color:red;font-weight:bold;max-height:25px">You</span>
        &nbsp;${instruction};
        `;
  } else { html = `waiting for: ${getTurnPlayers(table)}` }

  mDom(dinst, styleInstruction, { html });

}
function keyDownHandler(ev) {
	if (IsControlKeyDown && MAGNIFIER_IMAGE) return;
	if (!MAGNIFIER_IMAGE && ev.key == 'Control') {
		IsControlKeyDown = true;
		let hoveredElements = document.querySelectorAll(":hover");
		let cand = Array.from(hoveredElements).find(x => mHasClass(x, 'magnifiable'));
		if (isdef(cand)) showDetailsAndMagnify(cand);
	}
}
function keyUpHandler(ev) {
	if (ev.key == 'Control') {
		IsControlKeyDown = false;
		mMagnifyOff();
		if (isdef(mBy('hallo'))) mBy('hallo').remove();
	}
}
function lastWord(s) { return arrLast(toWords(s)); }

function mimali(c, m) {
  let seasonColors = 'winter_blue midnightblue light_azure capri spring_frost light_green deep_green summer_sky yellow_pantone orange pale_fallen_leaves timberwolf'.split(' ');
  let c2 = seasonColors[m - 1];
  let colors = paletteMix(c, c2, 6).slice(); //paletteShadesBi(c,36*m);
  let wheel = [];
  for (const x of colors) {
    let pal1 = paletteShades(x); //console.log(pal1.length)
    for (const i of range(7)) wheel.push(pal1[i + 2]);
  }
  return wheel;
}
function mixColors(c1, c2, c2Weight01) {
  let [color1, color2] = [colorFrom(c1), colorFrom(c2)]
  const hex1 = color1.substring(1);
  const hex2 = color2.substring(1);
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  const r = Math.floor(r1 * (1 - c2Weight01) + r2 * c2Weight01);
  const g = Math.floor(g1 * (1 - c2Weight01) + g2 * c2Weight01);
  const b = Math.floor(b1 * (1 - c2Weight01) + b2 * c2Weight01);
  const hex = colorRgbArgsToHex79(r, g, b);
  return hex;
}
function scaleAnimation(elem) {
  elem = toElem(elem);
  let ani = elem.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.3)' },
  ], {
    duration: 1000,
    easing: 'ease-in-out',
    iterations: 2,
    direction: 'alternate'
  });
  return ani;
}
function someOtherPlayerName(table) {
  return rChoose(arrWithout(table.playerNames, getUname()));
}

function strSameCaseInsensitive(s1,s2){return s1.toLowerCase() == s2.toLowerCase();}
function sortDictionary(di){
	let keys = Object.keys(di);
	keys.sort();
	let newdi={};
	for(const k of keys){
		newdi[k] = di[k];
	}
	return newdi;
}
//#endregion

//#region weitere tiere
function getAnimalDetails() {
	const NEWDETAILS = {
	};
	return NEWDETAILS;
	const old_details = {
		bear: {
			name: 'eurasian_brown_bear',
			lifespan: "20-30 years in the wild, up to 50 years in captivity",
			habitat: "Forests, mountains, and tundra across Europe and northern Asia",
			weight: "Females: 100-250 kg, Males: 135-390 kg",
			size: "1.2-2.2 meters in length, 0.7-1.5 meters in height at the shoulders",
			food: "Omnivorous: feeds on a wide variety of foods including fruits, nuts, berries, insects, small mammals, fish, and carrion",
			species: "Ursus arctos arctos",
			color: "Varies from pale brown to dark brown; occasionally black or with blonde highlights",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 1-4 cubs per litter after a gestation period of about 8 months, with delayed implantation",
			class: "Mammal"
		},
		gray_squirrel: {
			name: 'eastern_gray_squirrel',
			lifespan: "6-12 years in the wild, up to 20 years in captivity",
			habitat: "Deciduous and mixed forests, urban and suburban areas in eastern North America",
			weight: "400-600 grams",
			size: "23-30 cm in body length, with a tail length of 15-25 cm",
			food: "Omnivorous: primarily feeds on nuts, seeds, fruits, fungi, and occasionally insects and bird eggs",
			species: "Sciurus carolinensis",
			color: "Gray fur with a white underside; variations can include black or brown fur",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 young per litter after a gestation period of about 44-45 days",
			class: "Mammal"
		},
		mandrill: {
			lifespan: "20-30 years in the wild, up to 40 years in captivity",
			habitat: "Tropical rainforests and occasionally savannas in Central Africa, primarily in countries like Gabon, Cameroon, and Congo",
			weight: "Females: 11-14 kg, Males: 19-37 kg",
			size: "Females: 55-66 cm in body length, Males: 75-95 cm in body length; both sexes have tails about 5-10 cm long",
			food: "Omnivorous: feeds on fruits, seeds, leaves, insects, small mammals, and occasionally fungi",
			species: "Mandrillus sphinx",
			color: "Distinctive colorful face with blue and red markings; olive green or dark gray fur; males have more vibrant colors",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 1 offspring per litter after a gestation period of about 6 months",
			class: "Mammal"
		},
		monkey: {
			lifespan: "15-30 years depending on the species",
			habitat: "Various habitats including tropical rainforests, savannas, mountains, and grasslands worldwide",
			weight: "0.3-40 kg depending on the species",
			size: "25-100 cm in body length, not including the tail",
			food: "Omnivorous: feeds on fruits, leaves, seeds, nuts, insects, and small animals",
			species: "Various species within the infraorder Simiiformes",
			color: "Varies widely; common colors include brown, black, gray, and golden",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 1-2 offspring per litter after a gestation period of 4-8 months depending on the species",
			class: "Mammal"
		},
		squirrel:
		{
			name: 'american_red_squirrel',
			lifespan: "6-12 years in the wild, up to 20 years in captivity",
			habitat: "Found in coniferous and mixed forests of Eastern Europe and Asia, particularly in Siberia",
			weight: "250-400 grams",
			size: "19-23 cm in body length, with a tail length of 15-20 cm",
			food: "Omnivorous: feeds on seeds, nuts, fruits, fungi, and occasionally insects and bird eggs",
			species: "Sciurus vulgaris ognevi",
			color: "Reddish-brown fur with a white or cream-colored underside; winter coat may be grayer",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 young per litter after a gestation period of about 38-39 days",
			class: "Mammal"
		},
		british_shorthair: {
			lifespan: "12-20 years on average",
			habitat: "Domesticated; commonly found in homes, originating from the United Kingdom",
			weight: "4-8 kg",
			size: "56-64 cm in length including tail, 30-36 cm in height at the shoulders",
			food: "Carnivorous: primarily feeds on commercially prepared cat food, small mammals, and birds",
			species: "Felis catus (British Shorthair breed)",
			color: "Varies widely; common colors include blue (gray), black, white, red, cream, and various patterns such as tabby, bicolor, and tortoiseshell",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 64-67 days",
			class: "Mammal"
		},
		american_bobtail: {
			lifespan: "13-15 years on average",
			habitat: "Domesticated; commonly found in homes, originating from North America",
			weight: "3-7 kg",
			size: "30-38 cm in length excluding tail, 25-30 cm in height at the shoulders",
			food: "Carnivorous: primarily feeds on commercially prepared cat food, small mammals, and birds",
			species: "Felis catus (American Bobtail breed)",
			color: "Varies widely; common colors include brown, black, white, blue, red, and various patterns such as tabby, calico, and bicolor",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 64-67 days",
			class: "Mammal"
		},
		siberian_cat: {
			lifespan: "12-15 years on average",
			habitat: "Domesticated; commonly found in homes and rural areas, originating from Russia's Siberian forests",
			weight: "3.5-8 kg",
			size: "23-30 cm in height at the shoulders, 38-46 cm in body length excluding tail",
			food: "Carnivorous: primarily feeds on commercially prepared cat food, small mammals, and birds",
			species: "Felis catus (Siberian Cat breed)",
			color: "Varies widely; common colors include white, black, blue, red, and various patterns such as tabby, tortoiseshell, and bicolor",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 64-67 days",
			class: "Mammal"
		},

		norwegian_forest_cat: {
			lifespan: "14-16 years on average",
			habitat: "Domesticated; commonly found in homes, farms, and rural areas; native to Norway's forests",
			weight: "4.5-9 kg",
			size: "30-46 cm in body length, excluding tail; 23-30 cm in height at the shoulders",
			food: "Carnivorous: primarily feeds on commercially prepared cat food, small mammals, and birds",
			species: "Felis catus (Norwegian Forest Cat breed)",
			color: "Varies widely; common colors include white, black, blue, red, and various patterns such as tabby, tortoiseshell, and bicolor",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 64-67 days",
			class: "Mammal"
		},
		domestic_cat: {
			lifespan: "12-15 years on average, with some living over 20 years",
			habitat: "Found worldwide in various habitats including homes, farms, urban, and rural areas",
			weight: "3.6-4.5 kg on average, but can range from 2.5-7 kg or more depending on the breed",
			size: "23-25 cm in height at the shoulders, 46-51 cm in body length excluding tail",
			food: "Carnivorous: primarily feeds on small mammals, birds, and commercially prepared cat food",
			species: "Felis catus",
			color: "Varies widely; common colors include black, white, gray, orange, and various patterns such as tabby, calico, and tortoiseshell",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 64-67 days",
			class: "Mammal"
		},
		pallas_cat: {
			lifespan: "12-14 years in the wild",
			habitat: "Found in montane grasslands and shrublands of Central Asia, including Mongolia, China, and the Himalayas",
			weight: "2.5-4.5 kg",
			size: "46-65 cm in length, not including the tail",
			food: "Carnivorous: primarily feeds on small mammals, birds, and insects",
			species: "Otocolobus manul",
			color: "Dense, long fur with a gray to reddish-brown coat; has dark vertical bars on the torso and legs",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 66-75 days",
			class: "Mammal"
		},
		eastern_rosella: {
			lifespan: "15-20 years in the wild, longer in captivity",
			habitat: "Found in open woodlands, gardens, parks, and forests in southeastern Australia and Tasmania",
			weight: "90-120 grams",
			size: "30-33 cm in length",
			food: "Seeds, fruits, berries, nuts, flowers, and insects",
			species: "Platycercus eximius",
			color: "Bright red head and chest, white cheek patches, yellow-green underparts, and a combination of blue, green, and black on the wings and back",
			reproduction: "Oviparous",
			offsprings: "Females lay 4-8 eggs per clutch; incubation period is about 19-21 days",
			class: "Bird"
		},
		"Sparkling Violetear": {
			lifespan: "3-4 years in the wild, potentially longer in captivity",
			habitat: "Found in high-altitude forests, gardens, and shrublands in the Andes Mountains of South America",
			weight: "6-7 grams",
			size: "13-15 cm in length",
			food: "Nectar from flowers, small insects, and spiders",
			species: "Colibri coruscans",
			color: "Iridescent green with a violet-blue patch on the throat and chest, and blue-violet ear tufts",
			reproduction: "Oviparous",
			offsprings: "Females lay 2 eggs per clutch; incubation period is about 17-18 days",
			class: "Bird"
		},
		"White-lipped Tree Frog": {
			lifespan: "Up to 10 years in the wild, longer in captivity",
			habitat: "Tropical rainforests, mangroves, and wet sclerophyll forests in northern Australia, New Guinea, and surrounding islands",
			weight: "50-90 grams",
			size: "Up to 14 cm in length, making it the largest tree frog in the world",
			food: "Insectivorous: primarily feeds on insects, spiders, and other small invertebrates; occasionally consumes smaller frogs and lizards",
			species: "Litoria infrafrenata",
			color: "Bright green with a distinctive white stripe along the lower lip and extending to the shoulders; some may exhibit white spots on their sides",
			reproduction: "Oviparous",
			offsprings: "Females lay hundreds to thousands of eggs in temporary pools of water, tadpoles metamorphose into frogs over several weeks",
			class: "Amphibian"
		},
		"Blue poison dart frog": {
			lifespan: "4-6 years in the wild, up to 12 years in captivity",
			habitat: "Tropical rainforests of Suriname and northern Brazil, usually found near streams and moist areas",
			weight: "3-5 grams",
			size: "3-5 cm in length",
			food: "Insectivorous: primarily feeds on ants, termites, and other small invertebrates",
			species: "Dendrobates tinctorius 'azureus'",
			color: "Bright blue with black spots or patches; coloration serves as a warning to predators about its toxicity",
			reproduction: "Oviparous",
			offsprings: "Females lay 5-10 eggs in moist, protected areas; tadpoles are carried to water by the male where they continue development",
			class: "Amphibian"
		},
		"European Garden Spider": {
			lifespan: "1-2 years",
			habitat: "Gardens, woodlands, grasslands, and human structures throughout Europe and parts of North America",
			weight: "0.5-2 grams",
			size: "Females: 6.5-20 mm, Males: 5.5-13 mm",
			food: "Carnivorous: primarily feeds on flying insects such as flies, mosquitoes, and moths",
			species: "Araneus diadematus",
			color: "Varies from pale yellow to dark brown, with a distinctive white cross pattern on the abdomen",
			reproduction: "Oviparous",
			offsprings: "Females lay up to 300-800 eggs in a silk sac; eggs hatch into spiderlings after several weeks",
			class: "Arachnid"
		},
		"Barn Spider": {
			lifespan: "1 year",
			habitat: "Barns, sheds, gardens, and areas near human habitation across North America",
			weight: "Approximately 1 gram",
			size: "Females: 14-20 mm, Males: 10-13 mm",
			food: "Carnivorous: primarily feeds on flying insects such as flies, moths, and beetles",
			species: "Araneus cavaticus",
			color: "Varies from brown to orange with white and dark markings on the abdomen",
			reproduction: "Oviparous",
			offsprings: "Females lay several hundred eggs in a silk sac; eggs hatch into spiderlings in the spring",
			class: "Arachnid"
		},
		"Housefly": {
			lifespan: "15-30 days",
			habitat: "Found worldwide in a variety of environments, especially in close association with human habitation",
			weight: "10-15 milligrams",
			size: "6-7 mm in length",
			food: "Omnivorous: feeds on a wide range of organic matter, including food waste, feces, and decaying organic material",
			species: "Musca domestica",
			color: "Gray thorax with four dark longitudinal stripes; the abdomen is yellowish with a central dark stripe",
			reproduction: "Oviparous",
			offsprings: "Females can lay up to 500 eggs in several batches over their lifetime; eggs hatch into larvae (maggots) which then pupate and emerge as adult flies",
			class: "Insect"
		},
		"Dragonfly": {
			lifespan: "Several months to several years (including larval stage)",
			habitat: "Found near freshwater habitats like ponds, lakes, rivers, and wetlands worldwide",
			weight: "0.2-0.5 grams",
			size: "2-5 inches (5-12.5 cm) in wingspan",
			food: "Carnivorous: primarily feeds on other insects, including mosquitoes, flies, and small aquatic organisms during the larval stage",
			species: "Suborder Anisoptera, encompassing numerous genera and species",
			color: "Varies widely among species; often bright and iridescent with colors such as blue, green, red, and yellow",
			reproduction: "Oviparous",
			offsprings: "Females lay hundreds to thousands of eggs in or near water; eggs hatch into aquatic larvae (nymphs) which eventually metamorphose into adults",
			class: "Insect"
		},
		"Variegated Ladybug": {
			lifespan: "1-2 years",
			habitat: "Found in various habitats including gardens, fields, forests, and meadows across Europe, Asia, Africa, and introduced to North America and Australia",
			weight: "Less than 1 gram",
			size: "4-7 mm in length",
			food: "Carnivorous: primarily feeds on aphids, but also consumes other soft-bodied insects and mites",
			species: "Hippodamia variegata",
			color: "Typically orange to red with black spots; some individuals may have a more yellowish or tan hue",
			reproduction: "Oviparous",
			offsprings: "Females lay clusters of 10-50 eggs on plants near aphid colonies; eggs hatch into larvae that feed voraciously on aphids",
			class: "Insect"
		},
		"Caterpillar": {
			lifespan: "Several weeks to months (larval stage)",
			habitat: "Found in various habitats including forests, fields, gardens, and meadows worldwide",
			weight: "Varies widely; can range from a few milligrams to several grams depending on the species",
			size: "Varies widely; typically ranges from a few millimeters to over 10 cm in length depending on the species",
			food: "Herbivorous: primarily feeds on leaves of various plants; some species may have specific host plants",
			species: "Numerous species across the Order Lepidoptera",
			color: "Varies widely among species; can be green, brown, yellow, black, and often with patterns and markings for camouflage or warning",
			reproduction: "Oviparous",
			offsprings: "Females lay hundreds to thousands of eggs depending on the species; eggs hatch into larvae (caterpillars) which then undergo several molts",
			class: "Insect"
		},
		"Grasshopper": {
			lifespan: "Several months",
			habitat: "Found in various habitats including grasslands, meadows, fields, and forests worldwide",
			weight: "0.1-3 grams depending on the species",
			size: "2-5 inches (5-12 cm) in length depending on the species",
			food: "Herbivorous: primarily feeds on grasses, leaves, and other plant material",
			species: "Numerous species across the Suborder Caelifera",
			color: "Varies widely among species; typically green or brown, but can also be brightly colored or patterned",
			reproduction: "Oviparous",
			offsprings: "Females lay hundreds of eggs in the soil or plant material; eggs hatch into nymphs which gradually develop into adults through several molts",
			class: "Insect"
		},
		"European Rhinoceros Beetle": {
			lifespan: "3-5 years (including larval stage)",
			habitat: "Woodlands, forests, gardens, and areas with decaying wood or compost piles across Europe and parts of Asia",
			weight: "4-10 grams",
			size: "20-40 mm in length",
			food: "Larvae feed on decaying wood and organic matter; adults feed on plant sap and fruit",
			species: "Oryctes nasicornis",
			color: "Shiny dark brown to black",
			reproduction: "Oviparous",
			offsprings: "Females lay 50-100 eggs in decaying wood or compost; eggs hatch into larvae that undergo several molts before pupating and emerging as adults",
			class: "Insect"
		},
		"Wasp": {
			lifespan: "Several weeks to months depending on the species",
			habitat: "Found worldwide in various habitats including gardens, forests, fields, and urban areas",
			weight: "Varies widely among species; typically ranges from a few milligrams to several grams",
			size: "Varies widely among species; typically ranges from a few millimeters to several centimeters in length",
			food: "Varies among species; carnivorous or omnivorous diets including insects, nectar, fruit, and other food sources",
			species: "Numerous species across various families including Vespidae, Apidae, and others",
			color: "Varies widely among species; can be black, yellow, brown, or metallic with various patterns and markings",
			reproduction: "Oviparous",
			offsprings: "Varies among species; queens lay eggs in nests or cells, and eggs hatch into larvae that are cared for until they pupate and emerge as adults",
			class: "Insect"
		},
		"White Peacock Butterfly": {
			lifespan: "2-4 weeks (adult stage)",
			habitat: "Found in open, sunny areas including meadows, fields, gardens, and parks across the Americas",
			weight: "Varies, typically less than 1 gram",
			size: "Wingspan of 4-5 cm",
			food: "Herbivorous: feeds primarily on nectar from various flowers, particularly those in the aster family (Asteraceae)",
			species: "Anartia jatrophae",
			color: "White wings with black and orange patterns; males and females have similar wing patterns",
			reproduction: "Oviparous",
			offsprings: "Females lay eggs on host plants of the passionflower family (Passifloraceae); eggs hatch into caterpillars which pupate and eventually emerge as adult butterflies",
			class: "Insect"
		},
		"Stag Beetle": {
			lifespan: "1-7 years depending on the species",
			habitat: "Found in forests, woodlands, and gardens across Europe, Asia, and North America",
			weight: "5-35 grams depending on the species",
			size: "5-12 cm in length depending on the species",
			food: "Larvae feed on decaying wood; adults primarily feed on tree sap and fruit juices",
			species: "Lucanidae family, encompassing numerous genera and species",
			color: "Varies among species; typically brown to black with shiny, smooth exoskeletons; males have enlarged mandibles resembling deer antlers",
			reproduction: "Oviparous",
			offsprings: "Females lay eggs in decaying wood; larvae hatch and develop within the wood, often taking several years to mature before pupating into adults",
			class: "Insect"
		},
		"European Mantis": {
			lifespan: "1-2 years in the wild",
			habitat: "Found in various habitats including gardens, meadows, and shrublands across Europe, Asia, and North America",
			weight: "2-5 grams",
			size: "5-7 cm in length",
			food: "Carnivorous: feeds primarily on insects such as flies, moths, and smaller insects",
			species: "Mantis religiosa",
			color: "Typically green or brown with long, slender bodies and triangular heads; front legs adapted for grasping prey",
			reproduction: "Oviparous",
			offsprings: "Females lay a foamy egg case called an ootheca containing up to 200 eggs; nymphs hatch from eggs and resemble miniature adults",
			class: "Insect"
		},
		"Arctic Fox": {
			lifespan: "3-6 years in the wild, up to 14 years in captivity",
			habitat: "Found in Arctic and subarctic regions, including tundra, coastal areas, and mountains",
			weight: "3-8 kg",
			size: "46-68 cm in length, not including tail",
			food: "Omnivorous: feeds on small mammals, birds, eggs, fish, berries, and carrion",
			species: "Vulpes lagopus",
			color: "White or blue-gray in winter for Arctic populations, brown or gray in summer; transitional phases also occur",
			reproduction: "Ovoviviparous",
			offsprings: "Females give birth to 5-8 pups in spring; pups are cared for in underground dens",
			class: "Mammal"
		},
		"Florida Panther": {
			lifespan: "8-15 years in the wild",
			habitat: "Found in swamps, forests, and prairies of southern Florida, USA",
			weight: "Female: 29-45 kg, Male: 45-72 kg",
			size: "Length: 180-210 cm including tail, Height: 60-70 cm at the shoulders",
			food: "Carnivorous: primarily feeds on white-tailed deer, but also small mammals, birds, and occasionally livestock",
			species: "Puma concolor coryi",
			color: "Tawny or reddish-brown with lighter underparts; kittens have spots that fade with age",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 1-4 kittens per litter; kittens stay with their mother for up to 2 years",
			class: "Mammal"
		},
		Aardvark: {
			name: "Aardvark",
			lifespan: "23 years",
			habitat: "Savannahs, grasslands, woodlands",
			weight: "60 kg",
			size: "1.3 m",
			food: "Ants and termites",
			species: "Orycteropus afer",
			color: "Pale yellow or grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		alpaca: {
			name: "Alpaca",
			lifespan: "15-20 years",
			habitat: "Mountainous regions of South America",
			weight: "55-65 kg",
			size: "90-100 cm tall",
			food: "Grasses, hay, and sometimes grains",
			species: "Vicugna pacos",
			color: "Various colors including white, brown, and black",
			reproduction: "Viviparous",
			offsprings: "1 cria (baby alpaca)",
			class: "Mammal"
		},
		ant: {
			name: "Ant",
			lifespan: "Several weeks to several years depending on species",
			habitat: "Various terrestrial habitats including forests, grasslands, and urban areas",
			weight: "0.1-5 mg depending on species",
			size: "1-50 mm depending on species",
			food: "Omnivorous: scavenges for dead insects, nectar, seeds, fungi",
			species: "Formicidae family",
			color: "Varies by species: black, brown, red, or yellow",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: from a few to thousands of eggs per queen",
			class: "Insect"
		},
		badger: {
			name: "Badger",
			lifespan: "4-10 years in the wild, up to 14 years in captivity",
			habitat: "Forests, grasslands, deserts",
			weight: "5-15 kg",
			size: "0.6-0.9 m long",
			food: "Omnivorous: insects, small mammals, birds, fruits, roots",
			species: "Meles and Taxidea genera",
			color: "Gray to black with distinctive white facial markings",
			reproduction: "Viviparous",
			offsprings: "1-5 cubs per litter",
			class: "Mammal"
		},
		Beaver: {
			name: "Beaver",
			lifespan: "10-15 years in the wild, up to 20 years in captivity",
			habitat: "Rivers, streams, lakes, and ponds",
			weight: "16-32 kg",
			size: "0.9-1.4 m long including tail",
			food: "Herbivorous: bark, twigs, leaves, aquatic plants",
			species: "Castor genus",
			color: "Brown fur with webbed hind feet and flat tail",
			reproduction: "Viviparous",
			offsprings: "2-4 kits per litter",
			class: "Mammal"
		},
		bee: {
			name: "Bee",
			lifespan: "4-6 weeks for worker bees, several months for queen bees",
			habitat: "Varied habitats including gardens, meadows, and forests",
			weight: "Approximately 100 mg",
			size: "10-20 mm depending on species",
			food: "Herbivorous: collects pollen and nectar from flowers",
			species: "Anthophila order",
			color: "Varies by species: yellow and black stripes, or metallic green or blue",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: up to thousands of eggs per queen",
			class: "Insect"
		},
		bison: {
			name: "Bison",
			lifespan: "15-20 years",
			habitat: "Grasslands, prairies, forests",
			weight: "500-1000 kg",
			size: "1.5-2 m tall at the shoulder",
			food: "Grasses, herbs, shrubs",
			species: "Bison bison (American bison)",
			color: "Dark brown to black",
			reproduction: "Viviparous",
			offsprings: "1 calf",
			class: "Mammal"
		},
		blue_morpho_butterfly: {
			name: "Blue Morpho Butterfly",
			lifespan: "2-3 weeks as adults",
			habitat: "Tropical rainforests of Central and South America",
			weight: "0.5-0.7 g",
			size: "12-20 cm wingspan",
			food: "Herbivorous: primarily feeds on rotting fruits, tree sap, and nectar",
			species: "Morpho genus",
			color: "Iridescent blue wings with brown undersides",
			reproduction: "Egg-laying",
			offsprings: "Hundreds of eggs laid individually on host plants",
			class: "Insect"
		},
		Bobcat: {
			name: "Bobcat",
			lifespan: "10-12 years in the wild, up to 25 years in captivity",
			habitat: "Forests, swamps, deserts, and urban areas",
			weight: "6-12 kg",
			size: "0.5-0.8 m long",
			food: "Carnivorous: small mammals, birds, rabbits, and rodents",
			species: "Lynx rufus",
			color: "Spotted or streaked coat, usually brownish-red to grayish-brown",
			reproduction: "Viviparous",
			offsprings: "1-6 kittens per litter",
			class: "Mammal"
		},
		buffalo: {
			name: "Buffalo",
			lifespan: "10-20 years",
			habitat: "Grasslands, savannas, woodlands",
			weight: "500-900 kg",
			size: "1.5-1.8 m tall at the shoulder",
			food: "Grasses, herbs, shrubs",
			species: "Syncerus caffer (Cape buffalo)",
			color: "Dark brown to black",
			reproduction: "Viviparous",
			offsprings: "1 calf",
			class: "Mammal"
		},
		Bumblebee: {
			name: "Bumblebee",
			lifespan: "4-6 weeks for worker bees, several months for queen bees",
			habitat: "Varied habitats including gardens, meadows, and forests",
			weight: "Approximately 300 mg",
			size: "10-23 mm depending on species",
			food: "Herbivorous: collects pollen and nectar from flowers",
			species: "Bombus genus",
			color: "Varies by species: black and yellow stripes, or orange and black",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: up to hundreds of eggs per queen",
			class: "Insect"
		},
		camel: {
			name: "Camel",
			lifespan: "40-50 years",
			habitat: "Deserts, arid regions",
			weight: "400-600 kg",
			size: "1.8-2.2 m tall at the shoulder",
			food: "Grasses, grains, leaves",
			species: "Camelus",
			color: "Light brown to dark brown",
			reproduction: "Viviparous",
			offsprings: "1 calf",
			class: "Mammal"
		},
		Capybara: {
			name: "Capybara",
			lifespan: "8-10 years in the wild, up to 12 years in captivity",
			habitat: "Semi-aquatic: rivers, lakes, marshes, and forests",
			weight: "35-65 kg",
			size: "0.5-0.6 m tall at the shoulder",
			food: "Herbivorous: grasses, aquatic plants, fruits",
			species: "Hydrochoerus hydrochaeris",
			color: "Brownish-gray fur with a stout body and webbed feet",
			reproduction: "Viviparous",
			offsprings: "2-8 pups per litter",
			class: "Mammal"
		},
		cheetah: {
			name: "Cheetah",
			lifespan: "10-12 years",
			habitat: "Grasslands, savannas",
			weight: "50 kg",
			size: "1.2 m",
			food: "Gazelles, wildebeests calves, impalas",
			species: "Acinonyx jubatus",
			color: "Golden with black spots",
			reproduction: "Viviparous",
			offsprings: "3-5",
			class: "Mammal"
		},
		chimpanzee: {
			name: "Chimpanzee",
			lifespan: "33-40 years",
			habitat: "Tropical forests",
			weight: "40-70 kg",
			size: "1.2 m",
			food: "Fruit, nuts, seeds, insects",
			species: "Pan troglodytes",
			color: "Black",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		Cockroach: {
			name: "Cockroach",
			lifespan: "6 months to 2 years depending on species",
			habitat: "Found worldwide in warm environments, often in homes and buildings",
			weight: "3-50 g depending on species",
			size: "10-50 mm depending on species",
			food: "Omnivorous: scavenges on organic matter, food scraps, and even glue",
			species: "Blattodea order",
			color: "Varies by species: typically brown or black",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: can produce several hundred to thousands of eggs",
			class: "Insect"
		},
		cricket: {
			name: "Cricket",
			lifespan: "1-2 years depending on species",
			habitat: "Grasslands, forests, and urban areas",
			weight: "0.5-3 g depending on species",
			size: "2-5 cm",
			food: "Omnivorous: eats plants, fungi, and occasionally other insects",
			species: "Gryllidae family",
			color: "Varies by species: typically brown or black",
			reproduction: "Egg-laying",
			offsprings: "Up to 150 eggs laid in soil or vegetation",
			class: "Insect"
		},
		Earwig: {
			name: "Earwig",
			lifespan: "1-3 years depending on species",
			habitat: "Moist areas such as gardens, under rocks, and in rotting wood",
			weight: "0.1-1 g depending on species",
			size: "10-50 mm including pincers",
			food: "Omnivorous: feeds on plants, insects, and decaying organic matter",
			species: "Dermaptera order",
			color: "Dark brown or black with reddish-brown appendages",
			reproduction: "Egg-laying",
			offsprings: "Up to 80 eggs laid in soil or debris",
			class: "Insect"
		},
		elephant: {
			name: "Elephant",
			lifespan: "60-70 years",
			habitat: "Savannah and forest",
			weight: "6000 kg",
			size: "3 m",
			food: "Grass, leaves",
			species: "Loxodonta",
			color: "Grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		flamingo: {
			name: "Flamingo",
			lifespan: "20-30 years in the wild, up to 60 years in captivity",
			habitat: "Shallow lakes, lagoons, and coastal mudflats",
			weight: "2-4 kg",
			size: "1.1-1.5 m tall",
			food: "Algae, crustaceans, small fish",
			species: "Phoenicopteridae",
			color: "Pink to reddish-orange",
			reproduction: "Oviparous",
			offsprings: "1 chick",
			class: "Bird"
		},
		flea: {
			name: "Flea",
			lifespan: "2-3 months",
			habitat: "Found worldwide, often in homes, on pets, and in wildlife habitats",
			weight: "Varies by species, typically less than 1 mg",
			size: "1-4 mm",
			food: "Parasitic: blood of mammals and birds",
			species: "Siphonaptera order",
			color: "Dark brown to reddish-brown",
			reproduction: "Egg-laying",
			offsprings: "Several hundred eggs laid in bedding or host animal fur",
			class: "Insect"
		},
		fire_ant: {
			name: "Fire Ant",
			lifespan: "1-3 years",
			habitat: "Mostly in warm climates, often found in urban areas and agricultural lands",
			weight: "0.5-6 mg depending on species",
			size: "2-6 mm",
			food: "Omnivorous: feeds on plant matter, seeds, insects, and other small animals",
			species: "Solenopsis genus",
			color: "Reddish-brown to black",
			reproduction: "Egg-laying",
			offsprings: "Varies by colony size: can produce thousands of eggs per queen",
			class: "Insect"
		},
		fox: {
			name: "Fox",
			lifespan: "2-5 years in the wild, up to 15 years in captivity",
			habitat: "Varied habitats including forests, grasslands, mountains, and urban areas",
			weight: "3-14 kg depending on species",
			size: "0.3-0.5 m tall at the shoulder",
			food: "Small mammals, birds, insects, fruits, and berries",
			species: "Vulpes genus",
			color: "Red, gray, brown, white, or black depending on species",
			reproduction: "Viviparous",
			offsprings: "4-5 pups per litter",
			class: "Mammal"
		},
		giraffe: {
			name: "Giraffe",
			lifespan: "20-25 years",
			habitat: "Savannah",
			weight: "1200 kg",
			size: "4.8 m",
			food: "Leaves, twigs",
			species: "Giraffa camelopardalis",
			color: "Yellow with brown spots",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		gorilla: {
			name: "Gorilla",
			lifespan: "35-40 years",
			habitat: "Forests",
			weight: "160 kg",
			size: "1.7 m",
			food: "Leaves, shoots, fruit",
			species: "Gorilla beringei",
			color: "Black, grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		Grasshopper: {
			name: "Grasshopper",
			lifespan: "1 year or more depending on species",
			habitat: "Grasslands, meadows, and agricultural fields",
			weight: "Up to 2 g depending on species",
			size: "2-11 cm depending on species",
			food: "Herbivorous: primarily eats grasses, leaves, and crops",
			species: "Caelifera suborder",
			color: "Varies by species: typically green, brown, or gray camouflage",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: can lay dozens to hundreds of eggs",
			class: "Insect"
		},
		Hedgehog: {
			name: "Hedgehog",
			lifespan: "2-5 years in the wild, up to 7 years in captivity",
			habitat: "Forests, grasslands, urban gardens",
			weight: "0.4-1.2 kg",
			size: "15-30 cm long",
			food: "Insectivorous: insects, worms, small vertebrates",
			species: "Erinaceidae family",
			color: "Spiny coat ranging from brown to white",
			reproduction: "Viviparous",
			offsprings: "2-7 hoglets per litter",
			class: "Mammal"
		},
		hippopotamus: {
			name: "Hippopotamus",
			lifespan: "40-50 years",
			habitat: "Rivers, lakes",
			weight: "1500 kg",
			size: "1.5 m at the shoulder",
			food: "Grasses",
			species: "Hippopotamus amphibius",
			color: "Greyish",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		hyena: {
			name: "Hyena",
			lifespan: "10-25 years",
			habitat: "Savannas, grasslands, and woodlands",
			weight: "50-80 kg",
			size: "0.7-1.3 m tall at the shoulder",
			food: "Scavenger: carrion, but also hunt small to medium-sized animals",
			species: "Hyaenidae family",
			color: "Spotted or striped coats, varying in color from light grey to dark brown",
			reproduction: "Viviparous",
			offsprings: "1-3 cubs per litter",
			class: "Mammal"
		},
		ibex: {
			name: "Ibex",
			lifespan: "10-15 years",
			habitat: "Mountainous regions, cliffs, and rocky slopes",
			weight: "30-120 kg depending on species",
			size: "0.8-1.2 m tall at the shoulder",
			food: "Herbivorous: grasses, herbs, leaves",
			species: "Capra genus",
			color: "Brownish-gray fur with long, curved horns",
			reproduction: "Viviparous",
			offsprings: "1 kid",
			class: "Mammal"
		},
		Imago: {
			name: "Imago",
			lifespan: "Several days to several weeks depending on species",
			habitat: "Varied habitats depending on the insect species",
			weight: "Varies by species",
			size: "Varies by species",
			food: "Varies by species: could be nectar, pollen, or other plant parts",
			species: "Varies by insect species",
			color: "Varies by species",
			reproduction: "Varies by species: can reproduce sexually or asexually",
			offsprings: "Varies by species",
			class: "Insect"
		},
		kangaroo: {
			name: "Kangaroo",
			lifespan: "20 years",
			habitat: "Grasslands, forests, savannahs",
			weight: "85 kg",
			size: "1.6 m",
			food: "Grasses, leaves",
			species: "Macropus",
			color: "Brown, grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		Katydid: {
			name: "Katydid",
			lifespan: "1-2 years depending on species",
			habitat: "Tropical and temperate regions, often in trees and shrubs",
			weight: "1-5 g depending on species",
			size: "2-6 cm depending on species",
			food: "Herbivorous: primarily eats leaves, flowers, and fruits",
			species: "Tettigoniidae family",
			color: "Varies by species: green, brown, or leaf-like camouflage",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: can lay dozens to hundreds of eggs",
			class: "Insect"
		},
		koala: {
			name: "Koala",
			lifespan: "13-18 years",
			habitat: "Forest",
			weight: "14 kg",
			size: "85 cm",
			food: "Eucalyptus leaves",
			species: "Phascolarctos cinereus",
			color: "Grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		ladybug: {
			name: "Ladybug",
			lifespan: "1-2 years",
			habitat: "Gardens, meadows, forests, and agricultural fields",
			weight: "Approximately 10 mg",
			size: "5-8 mm",
			food: "Carnivorous: aphids, scale insects, and other small insects",
			species: "Coccinellidae family",
			color: "Red or orange with black spots, or black with red spots",
			reproduction: "Egg-laying",
			offsprings: "Up to hundreds of eggs",
			class: "Insect"
		},
		leopard: {
			name: "Leopard",
			lifespan: "12-17 years",
			habitat: "Forests, savannas, mountains, and grasslands",
			weight: "60 kg",
			size: "1.3 m",
			food: "Deer, antelopes, rodents",
			species: "Panthera pardus",
			color: "Golden with black spots",
			reproduction: "Viviparous",
			offsprings: "2-3",
			class: "Mammal"
		},
		lion: {
			name: "Lion",
			lifespan: "10-14 years in the wild, up to 20 years in captivity",
			habitat: "Grasslands, savannas, dense scrub, and open woodlands",
			weight: "190 kg for males, 130 kg for females",
			size: "1.2 m at the shoulder",
			food: "Large ungulates such as zebras, antelopes, and wildebeests",
			species: "Panthera leo",
			color: "Tawny yellow coat",
			reproduction: "Viviparous",
			offsprings: "2-3 cubs",
			class: "Mammal"
		},
		llama: {
			name: "Llama",
			lifespan: "15-25 years",
			habitat: "Mountainous regions of South America",
			weight: "130-200 kg",
			size: "1.7-1.8 m tall",
			food: "Grasses, hay, and occasionally grains",
			species: "Lama glama",
			color: "Various colors including white, brown, and black",
			reproduction: "Viviparous",
			offsprings: "1 cria (baby llama)",
			class: "Mammal"
		},
		lynx: {
			name: "Lynx",
			lifespan: "10-15 years in the wild, up to 25 years in captivity",
			habitat: "Forests, tundra, and mountainous regions",
			weight: "8-18 kg depending on species",
			size: "0.5-0.8 m tall at the shoulder",
			food: "Carnivorous: small to medium-sized mammals, birds",
			species: "Lynx genus",
			color: "Light brown to gray fur with tufted ears and short tail",
			reproduction: "Viviparous",
			offsprings: "1-4 kittens per litter",
			class: "Mammal"
		},
		meerkat: {
			name: "Meerkat",
			lifespan: "12-14 years in captivity",
			habitat: "Open, arid habitats like savannas and grasslands",
			weight: "0.7-1 kg",
			size: "25-35 cm",
			food: "Insects, small vertebrates, eggs, roots",
			species: "Suricata suricatta",
			color: "Greyish to tan with darker bands",
			reproduction: "Viviparous",
			offsprings: "2-5 pups per litter",
			class: "Mammal"
		},
		mongoose: {
			name: "Mongoose",
			lifespan: "6-10 years in the wild, up to 20 years in captivity",
			habitat: "Various habitats including forests, savannas, and grasslands",
			weight: "0.3-5 kg depending on species",
			size: "0.2-0.6 m long",
			food: "Omnivorous: insects, small mammals, birds, eggs, fruits",
			species: "Herpestidae family",
			color: "Brown, gray, or yellowish fur",
			reproduction: "Viviparous",
			offsprings: "2-4 pups per litter",
			class: "Mammal"
		},
		Moth: {
			name: "Moth",
			lifespan: "1-2 months depending on species",
			habitat: "Varied habitats including forests, gardens, and urban areas",
			weight: "Varies by species, typically less than 1 g",
			size: "1-5 cm wingspan depending on species",
			food: "Herbivorous: larvae feed on plant material, adults primarily seek nectar",
			species: "Lepidoptera order",
			color: "Varies by species: wide range of colors and patterns",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: can lay hundreds of eggs",
			class: "Insect"
		},
		Narwhal: {
			name: "Narwhal",
			lifespan: "50-60 years",
			habitat: "Arctic waters near Canada, Greenland, and Russia",
			weight: "1,500-1,800 kg",
			size: "4-5 m long, including tusk",
			food: "Carnivorous: fish, squid, shrimp",
			species: "Monodon monoceros",
			color: "Mottled grayish-brown skin with a distinctive spiral tusk",
			reproduction: "Viviparous",
			offsprings: "1 calf",
			class: "Mammal"
		},
		Orangutan: {
			name: "Orangutan",
			lifespan: "35-45 years in the wild, up to 55 years in captivity",
			habitat: "Tropical rainforests of Borneo and Sumatra",
			weight: "30-90 kg depending on species",
			size: "1.2-1.5 m tall",
			food: "Primarily frugivorous: fruits, leaves, insects",
			species: "Pongo genus",
			color: "Orange to reddish-brown fur",
			reproduction: "Viviparous",
			offsprings: "1 infant",
			class: "Mammal"
		},
		ostrich: {
			name: "Ostrich",
			lifespan: "30-40 years",
			habitat: "Savannas, grasslands, and semi-desert areas",
			weight: "100-130 kg",
			size: "2-2.8 m tall",
			food: "Plants, seeds, and occasionally insects",
			species: "Struthio camelus",
			color: "Mainly brown and white",
			reproduction: "Viviparous",
			offsprings: "4-8 eggs per clutch",
			class: "Bird"
		},
		otter: {
			name: "Otter",
			lifespan: "10-15 years in the wild, up to 25 years in captivity",
			habitat: "Rivers, lakes, coastal areas",
			weight: "5-14 kg",
			size: "0.6-1.3 m long",
			food: "Carnivorous: fish, crustaceans, amphibians",
			species: "Lutrinae family",
			color: "Brown fur with lighter underparts",
			reproduction: "Viviparous",
			offsprings: "1-5 pups per litter",
			class: "Mammal"
		},
		panda: {
			name: "Panda",
			lifespan: "20 years",
			habitat: "Temperate broadleaf and mixed forests",
			weight: "100 kg",
			size: "1.5 m",
			food: "Bamboo",
			species: "Ailuropoda melanoleuca",
			color: "Black and white",
			reproduction: "Viviparous",
			offsprings: "1-2",
			class: "Mammal"
		},
		penguin: {
			name: "Penguin",
			lifespan: "15-20 years",
			habitat: "Marine and coastal",
			weight: "25 kg",
			size: "70 cm",
			food: "Fish, squid",
			species: "Aptenodytes forsteri",
			color: "Black and white",
			reproduction: "Oviparous",
			offsprings: "2",
			class: "Bird"
		},
		Platypus: {
			name: "Platypus",
			lifespan: "15-20 years in the wild, up to 17 years in captivity",
			habitat: "Freshwater rivers, streams, and lakes in eastern Australia and Tasmania",
			weight: "0.7-2.4 kg",
			size: "30-40 cm long",
			food: "Carnivorous: aquatic insects, larvae, and small crustaceans",
			species: "Ornithorhynchus anatinus",
			color: "Dark brown fur with a duck-like bill and webbed feet",
			reproduction: "Oviparous (egg-laying)",
			offsprings: "1-3 eggs per clutch",
			class: "Mammal"
		},
		Porcupine: {
			name: "Porcupine",
			lifespan: "15-20 years",
			habitat: "Forests, deserts, and grasslands",
			weight: "18 kg",
			size: "80 cm",
			food: "Bark, leaves, fruit",
			species: "Erethizon dorsatum",
			color: "Brown or black with sharp spines",
			reproduction: "Viviparous",
			offsprings: "1-2",
			class: "Mammal"
		},
		raccoon: {
			name: "Raccoon",
			lifespan: "2-3 years in the wild, up to 20 years in captivity",
			habitat: "Forests, wetlands, urban areas",
			weight: "5-12 kg",
			size: "0.3-0.6 m long",
			food: "Omnivorous: fruits, nuts, insects, small vertebrates, eggs, garbage",
			species: "Procyon lotor",
			color: "Grayish-brown fur with black facial mask and ringed tail",
			reproduction: "Viviparous",
			offsprings: "2-5 kits per litter",
			class: "Mammal"
		},
		red_panda: {
			name: "Red Panda",
			lifespan: "8-12 years in the wild, up to 14 years in captivity",
			habitat: "Temperate forests in the Himalayas",
			weight: "3-6 kg",
			size: "0.5-0.6 m long including tail",
			food: "Herbivorous: bamboo leaves, berries, fruits",
			species: "Ailurus fulgens",
			color: "Reddish-brown fur with white face markings and ringed tail",
			reproduction: "Viviparous",
			offsprings: "1-4 cubs per litter",
			class: "Mammal"
		},
		rhinoceros: {
			name: "Rhinoceros",
			lifespan: "35-50 years",
			habitat: "Grasslands, savannahs",
			weight: "2300 kg",
			size: "1.8 m",
			food: "Grasses, leaves, branches",
			species: "Rhinocerotidae",
			color: "Grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		sea_lion: {
			name: "Sea Lion",
			lifespan: "20-30 years",
			habitat: "Marine",
			weight: "300 kg",
			size: "2.5 m",
			food: "Fish, squid",
			species: "Zalophus californianus",
			color: "Brown",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		seal: {
			name: "Seal",
			lifespan: "20-30 years",
			habitat: "Coastal waters and ice floes of the Arctic and Antarctic",
			weight: "85-300 kg depending on species",
			size: "1.5-3 m long",
			food: "Carnivorous: fish, squid, and crustaceans",
			species: "Phocidae family",
			color: "Varies by species: gray, brown, or spotted patterns",
			reproduction: "Viviparous",
			offsprings: "1 pup",
			class: "Mammal"
		},
		Silverfish: {
			name: "Silverfish",
			lifespan: "2-8 years depending on species",
			habitat: "Dark and damp areas such as basements, kitchens, and bathrooms",
			weight: "Up to 1 g",
			size: "10-20 mm including antennae and tail",
			food: "Detritivorous: feeds on starches, cellulose, and sugars found in paper, books, and fabrics",
			species: "Lepisma saccharina",
			color: "Silvery-gray or bluish-silver scales covering elongated body",
			reproduction: "Egg-laying",
			offsprings: "Up to 60 eggs laid in cracks and crevices",
			class: "Insect"
		},
		skunk: {
			name: "Skunk",
			lifespan: "2-4 years in the wild, up to 10 years in captivity",
			habitat: "Forests, grasslands, urban areas",
			weight: "1.5-4.5 kg",
			size: "0.3-0.4 m long",
			food: "Omnivorous: insects, small vertebrates, fruits, plants",
			species: "Mephitidae family",
			color: "Black with white stripes down the back",
			reproduction: "Viviparous",
			offsprings: "2-10 kits per litter",
			class: "Mammal"
		},
		sloth: {
			name: "Sloth",
			lifespan: "20-30 years",
			habitat: "Tropical rainforests",
			weight: "8 kg",
			size: "60 cm",
			food: "Leaves, fruits, insects",
			species: "Bradypus",
			color: "Brown",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		stick_insect: {
			name: "Stick Insect",
			lifespan: "1-3 years depending on species",
			habitat: "Forests, grasslands, and gardens",
			weight: "0.5-50 g depending on species",
			size: "2-30 cm depending on species",
			food: "Herbivorous: primarily eats leaves and foliage",
			species: "Phasmatodea order",
			color: "Varies by species: brown, green, or mottled to blend with surroundings",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: can lay hundreds of eggs",
			class: "Insect"
		},
		tapir: {
			name: "Tapir",
			lifespan: "25-30 years",
			habitat: "Rainforests, grasslands, and mountains",
			weight: "300 kg",
			size: "2 m",
			food: "Leaves, twigs, fruit",
			species: "Tapirus",
			color: "Varies (typically dark brown, black, or grey)",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		termite: {
			name: "Termite",
			lifespan: "Several years depending on the caste",
			habitat: "Woodlands, forests, and urban areas",
			weight: "Varies by species and caste, typically less than 1 g for workers",
			size: "3-20 mm depending on species and caste",
			food: "Cellulose-rich materials like wood, paper, and plant debris",
			species: "Isoptera order",
			color: "Varies by species: white, cream, brown, or black",
			reproduction: "Egg-laying",
			offsprings: "Millions of eggs per colony, laid by the queen",
			class: "Insect"
		},
		tiger: {
			name: "Tiger",
			lifespan: "10-15 years",
			habitat: "Forest",
			weight: "200 kg",
			size: "3 m",
			food: "Deer, wild boars",
			species: "Panthera tigris",
			color: "Orange with black stripes",
			reproduction: "Viviparous",
			offsprings: "2-4",
			class: "Mammal"
		},
		Walrus: {
			name: "Walrus",
			lifespan: "20-30 years in the wild, up to 40 years in captivity",
			habitat: "Arctic and subarctic regions, often found on ice floes",
			weight: "800-1,700 kg",
			size: "2.2-3.6 m long",
			food: "Carnivorous: benthic invertebrates such as clams and snails",
			species: "Odobenus rosmarus",
			color: "Brown or pinkish skin with large tusks and whiskers",
			reproduction: "Viviparous",
			offsprings: "1 calf",
			class: "Mammal"
		},
		Warthog: {
			name: "Warthog",
			lifespan: "15 years",
			habitat: "Grasslands, savanna, and woodlands",
			weight: "100 kg",
			size: "85 cm at the shoulder",
			food: "Grass, roots, berries",
			species: "Phacochoerus africanus",
			color: "Grey with sparse hair",
			reproduction: "Viviparous",
			offsprings: "2-6",
			class: "Mammal"
		},
		wolf: {
			name: "Wolf",
			lifespan: "6-8 years in the wild, up to 16 years in captivity",
			habitat: "Forests, mountains, grasslands, and arctic tundra",
			weight: "20-80 kg depending on species",
			size: "0.6-0.9 m tall at the shoulder",
			food: "Hunts large ungulates such as deer and elk, also small mammals",
			species: "Canis lupus",
			color: "Gray, brown, black, or white",
			reproduction: "Viviparous",
			offsprings: "4-6 pups per litter",
			class: "Mammal"
		},
		zebra: {
			name: "Zebra",
			lifespan: "25 years",
			habitat: "Grasslands, savannahs",
			weight: "450 kg",
			size: "1.3 m at the shoulder",
			food: "Grasses",
			species: "Equus quagga",
			color: "Black and white stripes",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		sphynx_cat: {
			name: "Sphynx Cat",
			lifespan: "8-14 years",
			habitat: "Domestic",
			weight: "3-5 kg",
			size: "30-40 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Varies: often appears hairless with skin pigmentation",
			reproduction: "Viviparous",
			offsprings: "4-6 kittens per litter",
			class: "Mammal"
		},
		chameleon: {
			name: "Common Chameleon",
			lifespan: "2-10 years depending on species",
			habitat: "Tropical and subtropical forests, savannas",
			weight: "100-200 g",
			size: "15-25 cm",
			food: "Insectivorous: insects, small invertebrates",
			species: "Chamaeleo chamaeleon",
			color: "Varies: green, brown, can change color for camouflage and communication",
			reproduction: "Oviparous",
			offsprings: "20-40 eggs per clutch",
			class: "Reptile"
		},
		bengal_cat: {
			name: "Bengal Cat",
			lifespan: "12-16 years",
			habitat: "Domestic",
			weight: "4-7 kg",
			size: "35-45 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Spotted or marbled coat with a variety of colors",
			reproduction: "Viviparous",
			offsprings: "4-6 kittens per litter",
			class: "Mammal"
		},
		barn_owl: {
			name: "Barn Owl",
			lifespan: "4-10 years in the wild, up to 20 years in captivity",
			habitat: "Open countryside, farmlands, woodlands",
			weight: "400-700 g",
			size: "33-39 cm in length, wingspan 80-95 cm",
			food: "Carnivorous: small mammals, birds, insects",
			species: "Tyto alba",
			color: "Pale, heart-shaped face with a mix of white, golden-brown, and gray feathers",
			reproduction: "Oviparous",
			offsprings: "4-7 eggs per clutch",
			class: "Bird"
		},
		cattle_egret: {
			name: "Cattle Egret",
			lifespan: "10-15 years",
			habitat: "Grasslands, agricultural fields, wetlands",
			weight: "300-400 g",
			size: "46-56 cm in length, wingspan 88-96 cm",
			food: "Insectivorous: insects, especially grasshoppers, and other small invertebrates",
			species: "Bubulcus ibis",
			color: "White with yellow or orange bill and legs, can have buff patches during breeding season",
			reproduction: "Oviparous",
			offsprings: "3-4 eggs per clutch",
			class: "Bird"
		},
		main_coon_cat: {
			name: "Maine Coon Cat",
			lifespan: "12-15 years",
			habitat: "Domestic",
			weight: "5-8 kg (males can be larger)",
			size: "48-100 cm in length including tail",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Variety of colors and patterns, including tabby, solid, bicolor, and more",
			reproduction: "Viviparous",
			offsprings: "4-6 kittens per litter",
			class: "Mammal"
		},
		ojos_azules_cat: {
			name: "Ojos Azules Cat",
			lifespan: "12-15 years",
			habitat: "Domestic",
			weight: "3-5 kg",
			size: "30-40 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Variety of colors, notable for striking blue eyes",
			reproduction: "Viviparous",
			offsprings: "4-6 kittens per litter",
			class: "Mammal"
		},
		scarlet_tanager: {
			name: "Scarlet Tanager",
			lifespan: "3-5 years in the wild",
			habitat: "Deciduous and mixed woodlands, forests",
			weight: "23-38 g",
			size: "16-19 cm in length, wingspan 25-30 cm",
			food: "Omnivorous: insects, fruits, berries",
			species: "Piranga olivacea",
			color: "Bright red with black wings and tail (males), yellowish-green with darker wings (females)",
			reproduction: "Oviparous",
			offsprings: "3-5 eggs per clutch",
			class: "Bird"
		},
		southern_festoon: {
			name: "Southern Festoon",
			lifespan: "2-3 weeks as adults",
			habitat: "Grasslands, meadows, and open woodlands in Southern Europe",
			weight: "0.5-1 g",
			size: "5-7 cm wingspan",
			food: "Herbivorous: larvae feed on Aristolochia plants, adults feed on nectar",
			species: "Zerynthia polyxena",
			color: "Yellow with black, red, and blue markings",
			reproduction: "Egg-laying",
			offsprings: "Several dozen eggs laid on host plants",
			class: "Insect"
		},
		khao_manee_cat: {
			name: "Khao Manee Cat",
			lifespan: "10-15 years",
			habitat: "Domestic",
			weight: "3-5 kg",
			size: "30-40 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Pure white with striking blue, green, or odd-colored eyes",
			reproduction: "Viviparous",
			offsprings: "4-6 kittens per litter",
			class: "Mammal"
		},
		toucan: {
			name: "Toucan",
			lifespan: "15-20 years",
			habitat: "Tropical and subtropical rainforests in Central and South America",
			weight: "300-700 g depending on species",
			size: "29-63 cm in length including bill",
			food: "Omnivorous: fruits, insects, small reptiles, and eggs",
			species: "Ramphastidae family",
			color: "Brightly colored plumage with a large, colorful bill",
			reproduction: "Oviparous",
			offsprings: "2-4 eggs per clutch",
			class: "Bird"
		},
		bald_eagle: {
			name: "Bald Eagle",
			lifespan: "20-30 years in the wild",
			habitat: "Near large bodies of open water such as lakes, rivers, and coastal regions in North America",
			weight: "3-6.3 kg",
			size: "70-102 cm in length, wingspan 180-230 cm",
			food: "Carnivorous: primarily fish, but also small mammals, birds, and carrion",
			species: "Haliaeetus leucocephalus",
			color: "Dark brown body with a white head and tail, yellow beak and feet",
			reproduction: "Oviparous",
			offsprings: "1-3 eggs per clutch",
			class: "Bird"
		},
		Axolotl: {
			name: "Axolotl",
			lifespan: "10-15 years in captivity",
			habitat: "Freshwater lakes and canals in Mexico, particularly Lake Xochimilco",
			weight: "60-200 g",
			size: "15-45 cm",
			food: "Carnivorous: worms, insects, small fish, and other small aquatic animals",
			species: "Ambystoma mexicanum",
			color: "Varies: wild types are usually dark with speckling, while captive-bred can be white, pink, or gold",
			reproduction: "Oviparous",
			offsprings: "100-300 eggs per clutch",
			class: "Amphibian"
		},
		macaw: {
			name: "Macaw",
			lifespan: "30-50 years, some species up to 75 years in captivity",
			habitat: "Tropical rainforests, savannas, and woodlands of Central and South America",
			weight: "900-1200 g depending on species",
			size: "76-100 cm in length including tail",
			food: "Omnivorous: seeds, nuts, fruits, leaves, and occasionally insects",
			species: "Ara genus",
			color: "Brightly colored plumage, often in shades of blue, red, green, and yellow",
			reproduction: "Oviparous",
			offsprings: "2-4 eggs per clutch",
			class: "Bird"
		},
		blue_tit: {
			lifespan: "2-3 years in the wild, up to 15 years in captivity",
			habitat: "Woodlands, gardens, hedgerows, and parks throughout Europe and western Asia",
			weight: "9-12 g",
			size: "12 cm in length, wingspan 17-20 cm",
			food: "Omnivorous: insects, seeds, nuts, and berries",
			species: "Cyanistes caeruleus",
			color: "Blue cap, wings, and tail with yellow underparts and greenish back",
			reproduction: "Oviparous",
			offsprings: "7-12 eggs per clutch",
			class: "Bird"
		},
		"Alpine Ibex": {
			lifespan: "10-14 years in the wild",
			habitat: "Mountainous regions in the European Alps",
			weight: "65-100 kg (males), 45-55 kg (females)",
			size: "1.3-1.5 m in length, 70-90 cm at shoulder height",
			food: "Herbivorous: grasses, herbs, and leaves",
			species: "Capra ibex",
			color: "Brownish-gray with lighter underparts and large, backward-curving horns",
			reproduction: "Viviparous",
			offsprings: "1-2 kids per birth",
			class: "Mammal"
		},
		"Grizzly Bear": {
			lifespan: "20-25 years in the wild, up to 30 years in captivity",
			habitat: "Forests, alpine meadows, and tundra in North America",
			weight: "180-360 kg (males), 130-200 kg (females)",
			size: "1.8-2.4 m in length, 1-1.2 m at shoulder height",
			food: "Omnivorous: berries, roots, salmon, small mammals, and carrion",
			species: "Ursus arctos horribilis",
			color: "Brown with grizzled (gray-tipped) fur",
			reproduction: "Viviparous",
			offsprings: "1-4 cubs per litter",
			class: "Mammal"
		},
		"Giant Swallowtail": {
			lifespan: "6-14 days as adults",
			habitat: "Woodlands, fields, gardens, and citrus groves in North and Central America",
			weight: "0.5-1 g",
			size: "10-16 cm wingspan",
			food: "Herbivorous: larvae feed on leaves of citrus plants, adults feed on nectar from flowers",
			species: "Papilio cresphontes",
			color: "Black wings with yellow bands and spots, underside is yellow with blue and red spots",
			reproduction: "Oviparous",
			offsprings: "Several hundred eggs laid singly on host plants",
			class: "Insect"
		},
		"Blue Morpho": {
			lifespan: "115 days (about 4 months) from egg to adult",
			habitat: "Tropical rainforests in Central and South America",
			weight: "0.3-0.5 g",
			size: "15-20 cm wingspan",
			food: "Herbivorous: larvae feed on leaves, adults feed on rotting fruit, fungi, and tree sap",
			species: "Morpho menelaus",
			color: "Brilliant blue upper wings, brown underside with eyespots for camouflage",
			reproduction: "Oviparous",
			offsprings: "Several hundred eggs laid singly on host plants",
			class: "Insect"
		},
		"Domestic Water Buffalo": {
			lifespan: "18-25 years",
			habitat: "Wetlands, swamps, and agricultural lands in tropical and subtropical regions",
			weight: "400-900 kg (females), 700-1200 kg (males)",
			size: "2.4-3 m in length, 1.5-1.8 m at shoulder height",
			food: "Herbivorous: grasses, aquatic plants, and crop residues",
			species: "Bubalus bubalis",
			color: "Generally dark gray to black",
			reproduction: "Viviparous",
			offsprings: "1 calf per birth",
			class: "Mammal"
		},
		"Tabby Cat": {
			lifespan: "12-15 years on average",
			habitat: "Domestic",
			weight: "3.6-7.2 kg (males), 3.2-5.4 kg (females)",
			size: "23-25 cm in height, 46-51 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Varies: distinct coat pattern with stripes, swirls, or spots",
			reproduction: "Viviparous",
			offsprings: "3-5 kittens per litter on average",
			class: "Mammal"
		},
		"Persian Cat": {
			lifespan: "10-15 years on average, some live up to 20 years",
			habitat: "Domestic",
			weight: "3.6-6.8 kg (males), 3.2-5.4 kg (females)",
			size: "25-30 cm in height, 30-50 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Varies: long-haired breed with various coat colors and patterns",
			reproduction: "Viviparous",
			offsprings: "3-4 kittens per litter on average",
			class: "Mammal"
		},
		"Siberian Husky": {
			lifespan: "12-15 years on average",
			habitat: "Domestic",
			weight: "20-27 kg (males), 16-23 kg (females)",
			size: "50-60 cm in height, 50-60 cm in length",
			food: "Omnivorous: commercial dog food, meat",
			species: "Canis lupus familiaris",
			color: "Varies: commonly black, white, gray, or a mix with distinctive facial markings",
			reproduction: "Viviparous",
			offsprings: "4-6 puppies per litter on average",
			class: "Mammal"
		},
		"Chinese Alligator": {
			lifespan: "50-70 years in the wild, up to 80 years in captivity",
			habitat: "Freshwater habitats such as rivers, streams, and marshes in eastern China",
			weight: "20-45 kg",
			size: "1.5-2.1 m in length",
			food: "Carnivorous: fish, amphibians, small mammals, and birds",
			species: "Alligator sinensis",
			color: "Dark olive-green with lighter underbelly and distinct bony plates on the head",
			reproduction: "Oviparous",
			offsprings: "10-50 eggs per nest, depending on environmental conditions",
			class: "Reptile"
		},
		"Pacific Orange-spine Unicornfish": {
			lifespan: "Unknown (varies among species)",
			habitat: "Coral reefs and rocky areas in the Pacific Ocean, particularly around Hawaii and French Polynesia",
			weight: "Up to 1 kg",
			size: "30-50 cm in length",
			food: "Herbivorous: primarily algae and small invertebrates",
			species: "Naso lituratus (also includes other species in the Naso genus)",
			color: "Bright blue body with orange spots, a distinctive horn-like projection from its forehead",
			reproduction: "Oviparous",
			offsprings: "Varies depending on species",
			class: "Fish"
		},
		"Ocellaris Clownfish": {
			lifespan: "6-10 years in the wild, up to 20 years in captivity",
			habitat: "Coral reefs and lagoons in the Indo-Pacific region",
			weight: "Up to 100 g",
			size: "7-12 cm in length",
			food: "Omnivorous: algae, zooplankton, and small crustaceans",
			species: "Amphiprion ocellaris",
			color: "Bright orange with white bands outlined in black",
			reproduction: "Oviparous",
			offsprings: "Hundreds of eggs per clutch, cared for by the male",
			class: "Fish"
		},
		"Sandbar Shark": {
			lifespan: "20-30 years",
			habitat: "Temperate and tropical waters worldwide, typically found near continental and insular shelves",
			weight: "Up to 159 kg (males), up to 91 kg (females)",
			size: "2-2.5 m in length",
			food: "Carnivorous: fish, rays, crustaceans, and cephalopods",
			species: "Carcharhinus plumbeus",
			color: "Gray to brownish-gray upper body with a white underside",
			reproduction: "Viviparous",
			offsprings: "1-14 pups per litter, with a 1-3 year reproductive cycle",
			class: "Fish"
		},
		"African Bush Elephant": {
			lifespan: "Up to 60-70 years in the wild",
			habitat: "Various habitats including savannas, forests, and deserts in sub-Saharan Africa",
			weight: "Up to 6,000 kg (male), up to 3,000-4,000 kg (female)",
			size: "2.5-4 m tall at the shoulder, 6-7 m in length",
			food: "Herbivorous: primarily grasses, leaves, fruits, and bark",
			species: "Loxodonta africana",
			color: "Gray to brownish-gray skin",
			reproduction: "Viviparous",
			offsprings: "1 calf every 2-4 years",
			class: "Mammal"
		},
		"Yellow Tang": {
			lifespan: "7-10 years in the wild, up to 20 years in captivity",
			habitat: "Reef environments and shallow lagoons in the Pacific Ocean, particularly around Hawaii",
			weight: "Up to 100 g",
			size: "12-15 cm in length",
			food: "Herbivorous: primarily algae and small invertebrates",
			species: "Zebrasoma flavescens",
			color: "Vibrant yellow body with a white spine along the base of the tail fin",
			reproduction: "Oviparous",
			offsprings: "Eggs hatch into larvae which eventually settle and develop into adults",
			class: "Fish"
		},
		"Siamese Fighting Fish": {
			lifespan: "2-5 years on average",
			habitat: "Freshwater habitats such as rice paddies, shallow ponds, and slow-moving streams in Southeast Asia",
			weight: "Up to 15 g",
			size: "6-8 cm in length",
			food: "Carnivorous: primarily insects, larvae, and small crustaceans",
			species: "Betta splendens",
			color: "Vibrant colors and elaborate fins, including shades of blue, red, green, and white",
			reproduction: "Oviparous",
			offsprings: "Up to several hundred eggs laid in bubble nests by the male",
			class: "Fish"
		},
		"Spinner Dolphin": {
			lifespan: "20-25 years on average",
			habitat: "Tropical and subtropical waters worldwide, often near continental shelves and islands",
			weight: "Up to 80-100 kg",
			size: "1.7-2.3 m in length",
			food: "Carnivorous: primarily fish, squid, and small crustaceans",
			species: "Stenella longirostris",
			color: "Gray with a distinct three-part color pattern: dark gray on top, light gray on the sides, and white underside",
			reproduction: "Viviparous",
			offsprings: "Usually 1 calf per birth",
			class: "Mammal"
		},
		"Callanthiidae": {
			lifespan: "Varies among species",
			habitat: "Deep-sea environments, typically found on continental slopes and seamounts",
			weight: "Varies among species",
			size: "Varies among species",
			food: "Carnivorous: feeds on small fish, crustaceans, and mollusks",
			species: "Various species within the Callanthiidae family",
			color: "Varies among species, often brightly colored with distinctive patterns",
			reproduction: "Oviparous",
			offsprings: "Varies among species",
			class: "Fish"
		},
		"Copperband Butterflyfish": {
			lifespan: "5-7 years in the wild",
			habitat: "Tropical coral reefs and lagoons in the Indo-Pacific region",
			weight: "Up to 100 g",
			size: "15-20 cm in length",
			food: "Omnivorous: feeds primarily on coral polyps, small invertebrates, and algae",
			species: "Chelmon rostratus",
			color: "White body with black vertical bands and a prominent coppery-orange band across its face",
			reproduction: "Oviparous",
			offsprings: "Eggs are released into the water and develop into larvae",
			class: "Fish"
		},
		"Nile Crocodile": {
			lifespan: "40-50 years in the wild, up to 80-100 years in captivity",
			habitat: "Freshwater habitats such as rivers, lakes, and marshes in sub-Saharan Africa",
			weight: "Up to 225-550 kg",
			size: "3.5-5 m in length, with some individuals reaching up to 6 m",
			food: "Carnivorous: fish, reptiles, birds, and mammals",
			species: "Crocodylus niloticus",
			color: "Dark bronze-green with black spots and bands on the body and tail",
			reproduction: "Oviparous",
			offsprings: "20-80 eggs per nest, with hatchlings cared for by the female",
			class: "Reptile"
		},
		"Intellagama lesueurii": {
			lifespan: "10-20 years in the wild, up to 30 years in captivity",
			habitat: "Eastern Australia, inhabiting forests, woodlands, and near water sources such as rivers and lakes",
			weight: "300-600 grams",
			size: "60-80 cm in length, including the tail",
			food: "Omnivorous: diet includes insects, small mammals, fish, and vegetation",
			species: "Intellagama lesueurii",
			color: "Varies; typically green to brown with dark bands and markings, juveniles often have brighter colors",
			reproduction: "Oviparous",
			offsprings: "6-18 eggs per clutch",
			class: "Reptile"
		},
		"Red Lionfish": {
			lifespan: "5-10 years in the wild",
			habitat: "Coral reefs and rocky crevices in the Indo-Pacific region, also found in the Atlantic Ocean",
			weight: "Up to 1 kg",
			size: "25-38 cm in length",
			food: "Carnivorous: feeds on small fish, crustaceans, and mollusks",
			species: "Pterois volitans (and Pterois miles for some similar species)",
			color: "Red to dark brown with white stripes and spines",
			reproduction: "Oviparous",
			offsprings: "Several thousands of eggs released into the water column",
			class: "Fish"
		},
		bee: {
			lifespan: "Varies among species; typically several weeks to a few months",
			habitat: "Varies widely; bees are found on every continent except Antarctica, predominantly in gardens, forests, and agricultural areas",
			weight: "Approximately 0.1-1 gram",
			size: "Approximately 0.8-2.5 cm in length",
			food: "Herbivorous: primarily feeds on nectar and pollen collected from flowers",
			species: "There are over 20,000 known species of bees, belonging to the superfamily Apoidea",
			color: "Varies among species; commonly yellow and black striped, but can range from metallic blue-green to solid black",
			reproduction: "Oviparous",
			offsprings: "Varies among species; a single queen bee can lay up to 2,000 eggs per day in peak season",
			class: "Insect"
		},
		hare: {
			lifespan: "1-9 years, depending on species and environmental factors",
			habitat: "Varies widely; found in grasslands, meadows, woodlands, and tundra regions across Europe, Asia, Africa, and North America",
			weight: "2-5 kg",
			size: "40-70 cm in length",
			food: "Herbivorous: primarily feeds on grasses, herbs, and twigs",
			species: "Several species within the genus Lepus",
			color: "Varies among species; typically shades of brown or gray, with some species exhibiting seasonal color changes",
			reproduction: "Viviparous",
			offsprings: "1-8 leverets per litter, depending on species and environmental conditions",
			class: "Mammal"
		},
		"Camargue Horse": {
			lifespan: "20-30 years",
			habitat: "Camargue region in the south of France, primarily found in wetlands, marshes, and salt flats",
			weight: "400-500 kg",
			size: "130-150 cm at the withers",
			food: "Herbivorous: primarily feeds on grasses, reeds, and other vegetation found in its habitat",
			species: "Equus ferus caballus",
			color: "Gray to white coat, known for its light coloration which helps with heat reflection in its hot and sunny habitat",
			reproduction: "Viviparous",
			offsprings: "1 foal per birth",
			class: "Mammal"
		},
		"Cotentin Donkey": {
			lifespan: "25-35 years",
			habitat: "Originally from the Cotentin Peninsula in Normandy, France; found in various habitats including pastures and meadows",
			weight: "300-400 kg",
			size: "110-130 cm at the withers",
			food: "Herbivorous: primarily feeds on grasses, hay, and other vegetation",
			species: "Equus africanus asinus",
			color: "Gray to brown coat, often with a lighter underbelly",
			reproduction: "Viviparous",
			offsprings: "1 foal per birth",
			class: "Mammal"
		},
		"Mule": {
			lifespan: "25-30 years",
			habitat: "Varies widely depending on human activity; found in agricultural settings, ranches, and sometimes wild environments",
			weight: "350-500 kg",
			size: "140-160 cm at the withers",
			food: "Herbivorous: primarily feeds on grasses, hay, and grains",
			species: "Equus asinus x Equus caballus hybrid",
			color: "Varies widely depending on the parent species; can be any color found in horses or donkeys",
			reproduction: "Sterile hybrid; mules are typically sterile and cannot reproduce",
			offsprings: "Mules do not reproduce; they are the offspring of a male donkey (jack) and a female horse (mare)",
			class: "Mammal"
		},
		"Northern Giraffe": {
			lifespan: "20-25 years in the wild, up to 30 years in captivity",
			habitat: "Savannas, woodlands, and dry forests in parts of sub-Saharan Africa, including countries like Kenya, Uganda, and South Sudan",
			weight: "800-1,400 kg",
			size: "5-6 m tall at the shoulder, with males taller than females",
			food: "Herbivorous: primarily feeds on leaves, shoots, and fruits from acacia and other trees",
			species: "Giraffa camelopardalis",
			color: "Yellowish to brown coat with irregular patches of darker spots; northern giraffes have lighter coats than their southern counterparts",
			reproduction: "Viviparous",
			offsprings: "Usually one calf per birth, after a gestation period of about 15 months",
			class: "Mammal"
		},
		"African Leopard": {
			lifespan: "12-17 years in the wild, up to 23 years in captivity",
			habitat: "Varies widely across sub-Saharan Africa, including forests, savannas, and mountainous regions",
			weight: "30-70 kg",
			size: "1.5-2.1 m in length, with a tail length of 0.6-1.1 m",
			food: "Carnivorous: hunts a variety of prey including antelopes, gazelles, and smaller mammals",
			species: "Panthera pardus",
			color: "Yellow to gold with black rosettes and spots; the coloration helps provide camouflage in different habitats",
			reproduction: "Viviparous",
			offsprings: "2-3 cubs per litter, born after a gestation period of approximately 90-105 days",
			class: "Mammal"
		},
		"Barbary Lion": {
			lifespan: "Estimated to be similar to other lion subspecies, around 10-14 years in the wild",
			habitat: "Historically found in North Africa, particularly in the Atlas Mountains and surrounding regions",
			weight: "200-250 kg for males, slightly smaller for females",
			size: "2.5-3.3 m in length, including tail",
			food: "Carnivorous: hunts large mammals such as gazelles, zebras, and buffalo",
			species: "Panthera leo leo",
			color: "Similar to other lion subspecies; tawny yellow to reddish-brown coat with a mane that varies in color from dark to blond",
			reproduction: "Viviparous",
			offsprings: "2-4 cubs per litter, born after a gestation period of approximately 100-110 days",
			class: "Mammal"
		},
		"Bengal Tiger": {
			lifespan: "10-15 years in the wild, up to 20-25 years in captivity",
			habitat: "Varies across India, Bangladesh, Nepal, Bhutan, and Myanmar; habitats include tropical and subtropical forests, mangroves, and grasslands",
			weight: "180-258 kg for males, 100-160 kg for females",
			size: "2.4-3 m in length, including tail",
			food: "Carnivorous: hunts large prey such as deer, wild boar, and occasionally smaller mammals and birds",
			species: "Panthera tigris tigris",
			color: "Orange to yellow coat with black stripes; the pattern of stripes is unique to each tiger, serving as camouflage in their habitat",
			reproduction: "Viviparous",
			offsprings: "2-4 cubs per litter, born after a gestation period of approximately 100-110 days",
			class: "Mammal"
		},
		"Jewel Bug": {
			lifespan: "Varies among species; typically several months to a year",
			habitat: "Found in tropical and subtropical regions worldwide, often on plants, bushes, and trees",
			weight: "Varies among species; generally less than 1 gram",
			size: "Approximately 1-2 cm in length",
			food: "Herbivorous: feeds on plant sap, often from seeds, flowers, and stems",
			species: "Family Scutelleridae, which includes numerous genera and species",
			color: "Highly variable and often vibrant, with metallic or iridescent hues of green, blue, red, and orange",
			reproduction: "Oviparous",
			offsprings: "Varies among species; eggs laid on plants and undergo several nymphal stages before reaching adulthood",
			class: "Insect"
		},
		"Hoplia": {
			lifespan: "Varies among species; typically several weeks to a few months",
			habitat: "Found in various habitats with flowering plants, including gardens, meadows, and grasslands",
			weight: "Varies among species; generally less than 1 gram",
			size: "Approximately 1-2 cm in length",
			food: "Herbivorous: feeds primarily on pollen, nectar, and petals of flowers",
			species: "Genus Hoplia, which includes numerous species of flower beetles",
			color: "Varies among species; often metallic green, blue, or brown with patterns of spots or stripes",
			reproduction: "Oviparous",
			offsprings: "Varies among species; eggs laid near flowers, larvae feed on plant material",
			class: "Insect"
		},
		"Asian Lady Beetle": {
			lifespan: "1-3 years",
			habitat: "Found in various habitats including gardens, agricultural fields, forests, and urban areas",
			weight: "Less than 1 gram",
			size: "5-8 mm in length",
			food: "Omnivorous: feeds on aphids, scale insects, and other soft-bodied insects, as well as pollen and nectar",
			species: "Harmonia axyridis",
			color: "Highly variable; typically orange to red with black spots, but can also be yellow to black or even melanistic (black with red spots)",
			reproduction: "Oviparous",
			offsprings: "Females can lay up to 1,500 eggs in their lifetime",
			class: "Insect"
		},
		"Scarlet Lily Beetle": {
			lifespan: "1-2 years",
			habitat: "Found in gardens, parks, and other areas where lilies and fritillaries are cultivated",
			weight: "Less than 1 gram",
			size: "Approximately 6-8 mm in length",
			food: "Herbivorous: feeds on the leaves, stems, and flowers of lilies and fritillaries",
			species: "Lilioceris lilii",
			color: "Bright scarlet red with black legs, head, antennae, and undersides",
			reproduction: "Oviparous",
			offsprings: "Females lay clusters of bright orange eggs on the undersides of lily leaves",
			class: "Insect"
		},
		"Southern Black Rhinoceros": {
			lifespan: "30-35 years in the wild, up to 45 years in captivity",
			habitat: "Found in savannas and semi-arid areas of southern Africa, including countries like Namibia, South Africa, Zimbabwe, and Kenya",
			weight: "800-1,400 kg",
			size: "1.4-1.8 m tall at the shoulder",
			food: "Herbivorous: primarily feeds on leaves, branches, and twigs of shrubs and trees",
			species: "Diceros bicornis bicornis",
			color: "Gray to brownish-gray in color, with two distinctive horns on the snout; horns are made of keratin and used for defense and dominance",
			reproduction: "Viviparous",
			offsprings: "Usually one calf per birth, after a gestation period of approximately 15-16 months",
			class: "Mammal"
		},
		"British Shorthair Cat": {
			lifespan: "12-20 years",
			habitat: "Domesticated; found in households and occasionally in breeding facilities",
			weight: "Male: 4.5-7 kg, Female: 3.6-5.4 kg",
			size: "Medium to large size, with males typically larger than females",
			food: "Omnivorous: commercial cat food, meat, and occasionally vegetables",
			species: "Felis catus",
			color: "Wide variety of colors and patterns including solid blue, black, white, tabby, and more",
			reproduction: "Viviparous",
			offsprings: "Varies; a typical litter size ranges from 3-6 kittens",
			class: "Mammal"
		},
		"Wallum Sedge Frog": {
			lifespan: "Up to 5 years",
			habitat: "Found in wetlands, swamps, and heathlands with acidic sandy soils, primarily in eastern Australia",
			weight: "Less than 10 grams",
			size: "3-4 cm in length",
			food: "Insectivorous: feeds on small insects and other invertebrates found in its habitat",
			species: "Litoria olongburensis",
			color: "Variable; typically ranges from light brown to green with darker markings; may change color based on environment and temperature",
			reproduction: "Oviparous",
			offsprings: "Several hundred eggs laid in shallow water, tadpoles undergo metamorphosis to become adult frogs",
			class: "Amphibian"
		},

		armadillo: {
			lifespan: "4-30 years, depending on species",
			habitat: "Grasslands, forests, and semi-deserts",
			weight: "0.5-6 kg, depending on species",
			size: "15-75 cm, depending on species",
			food: "Insects, small vertebrates, plants",
			species: "Dasypodidae",
			color: "Brown, grey, or pinkish",
			reproduction: "Viviparous",
			offsprings: "1-12, depending on species",
			class: "Mammal"
		},

	};
	return old_details;
}

function getAnimals() {
	const animals = `
		
Earwig,Cockroach,Grasshopper,Silverfish,Moth
Mosquito
Fly
Bee
Wasp
Beetle
	`;
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
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2><span style="font-family:emoNoto"${getGameProp('friendly').toUpperCase()}: ${table.friendly} (${table.step})</h2>`; // title
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

function fishgame() {

	function setup(table) {
		let fen = {};
		fen.deck = rChoose(M.byCollection.animals, 170); //range(4, table.options.numCards); //[4, 5, 6, 7, 8, 9, 10];
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
			pl.cards = deckDeal(fen.deck, 5);
		}
		//fen.cards = [1, 2, 3];
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function stats(table) {
		let [me, players] = [getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'rowflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d); //, {}, {id:`stat_${plname}_score`});
		}
	}
	function present(table) {
		let fen = table.fen;
		let d = mBy('dTable');
		d.style = '';
		d.className = '';

		mStyle(d, { hmin: 500, w: '90%', margin: 20 }); //, bg:'#ffffffaa'}); // bgImage:`url('../assets/textures/marble_water.jpg')` });
		d.innerHTML = ' ';

		let me = getUname();
		let pl = table.players[me];

		let dCards = mDom(d, { gap: 8 }); mCenterFlex(dCards);
		for (const c of pl.cards) {
			//let d1=mDom(dCards, {w:100,h:100,bg:U.color})
			showImageCard(c, dCards, { bg: U.color }); //, {sz:100,border:})
		}
		//mach eine animal card
		//wie geht das?
		//console.log(M.byCat.animal)



		//mBy('dTable').remove(); 
		//let dTable = 
	}
	function restPresent(table) {
		let dTable = mBy(dTable); mClassRemove(dTable, 'wood');
		mStyle('dTable', { padding: 25, w: 400, h: 400, rounding: 0 }); //, bgImage:'../assets/textures/' });
		let d = mDom('dTable', { gap: 10, padding: 0 }); mCenterFlex(d);
		let items = [];
		for (const card of fen.cards) {
			let item = cNumber(card);
			mAppend(d, iDiv(item));
			items.push(item);
		}
		return items;
	}
	async function activate(table, items) {
		return;
		await instructionStandard(table); //browser tab and instruction if any

		if (!isMyTurn(table)) { return; } //console.log('table.turn',table.turn); 

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}

		//check end condition
		if (isEmpty(table.fen.cards)) return gameoverScore(table);

		//bot move activation: in solo mode OR if user is a bot
		if (amIHuman(table) && table.options.gamemode == 'multi') return;

		let name = amIHuman(table) && table.options.gamemode == 'solo' ? someOtherPlayerName(table) : getUname();
		if (nundef(name)) return; //console.log('bot name',name)

		await botMove(name, table, items);
	}
	async function botMove(name, table, items) {
		let ms = rChoose(range(2000, 5000));

		TO.bot = setTimeout(async () => {
			let item = rChoose(items);
			toggleItemSelection(item);
			TO.bot1 = setTimeout(async () => await evalMove(name, table, item.key), 500);

		}, rNumber(ms, ms + 2000));

	}

	async function onclickCard(table, item, items) {
		toggleItemSelection(item);
		try { await mSleep(200); } catch (err) { return; }
		await evalMove(getUname(), table, item.key);
	}
	async function evalMove(name, table, key) {
		clearEvents();
		mShield('dTable', { bg: 'transparent' });
		let id = table.id;
		let step = table.step;

		let best = arrMinMax(table.fen.cards).min;
		let succeed = key == best;
		if (succeed) {
			table.players[name].score += 1;

			//calc how to replace cards from set
			let fen = table.fen;
			let newCards = deckDeal(fen.deck, 1);
			if (newCards.length > 0) arrReplace1(fen.cards, key, newCards[0]); else removeInPlace(fen.cards, key);
		} else {
			table.players[name].score -= 1;
		}
		lookupAddToList(table, ['moves'], { step, name, move: key, change: succeed ? '+1' : '-1', score: table.players[name].score });

		let o = { id, name, step, table };

		if (succeed) o.stepIfValid = step + 1;

		let res = await mPostRoute('table', o);
	}
	return { setup, present, stats, activate };

}
function showImageCard(key,dParent,styles={},opts={}){
	let d=mDom(dParent,styles,opts);
	let o = M.superdi[key];
	console.log(o);
	let d1=showImage1(key,d);
}
function showImage1(key, dParent, styles = {}, useSymbol = false) {
	let o = M.superdi[key];
	assertion(o,`showImage:key not found ${key}`);
	let [w, h] = mSizeSuccession(styles); console.log(w,h)
	let [sz, fz] = [.9 * w, .8 * h];
	addKeys({ position: 'relative', w, h, padding: 11, box: true },styles)
	let d1 = mDiv(dParent, styles);//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	if (!useSymbol && isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: hline, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: hline, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoGame', bg: valf(styles.bg, 'beige'), fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'contain', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	assertion(el, 'PROBLEM mit' + key);
	return d1;
}

//#endregion
