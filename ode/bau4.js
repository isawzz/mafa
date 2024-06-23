function wsCard(d, w, h) {
  let card = cBlank(d, { h, w, border: 'silver' }); //return;
  let dCard = iDiv(card);
  return [card, dCard];
}
function wsTopLeft(dCard, sztop, rounding) {
  let dtop = mDom(dCard, { w: sztop, h: sztop, bg: '#ccc' });
  mPlace(dtop, 'tl');
  dtop.style.borderTopLeftRadius = dtop.style.borderBottomRightRadius = `${rounding}px`;
  mCenterCenterFlex(dtop);
  return dtop;
}
function wsHabitat(tokens, dtop, sz) {
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    if (i == 2) mLinebreak(dtop);
    let d = wsPrintSymbol(dtop, sz, t);
    if (i == 2) mStyle(d, { matop: -sz * 3 / 2 });
  }
}
function wsFood(tokens, dtop, sz) {
  let d = mDom(dtop); mCenterCenterFlex(d);
  let ch = tokens.length == 2 && coin() ? '/' : '+';
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    let d1 = wsPrintSymbol(d, sz, t);
    if (i != 2) mDom(d, { fz: sz * .7 }, { html: ch });
  }
}
function wsTitle(o, dCard, sztop, fz, gap) {
  let dtitle = mDom(dCard, { paleft: gap, wmax: sztop * 1.5 }); mPlace(dtitle, 'tl', sztop, gap)
  mDom(dtitle, { fz: fz * 1.1, weight: 'bold' }, { html: fromNormalized(o.friendly) });
  mDom(dtitle, { fz, 'font-style': 'italic' }, { html: o.species });
}
function getAbstractSymbol(n){
	// let abs=M.byCollection.icon.filter(x=>x.includes('abstract'));
	if (nundef(n)) n=rChoose(range(1,100));
	else if (isList(n)) n=rChoose(n);
	return `abstract_${String(n).padStart(3, '0')}`;
}
function getDetailedSuperdi(key) {
	let o = M.superdi[key];
	addKeys(M.details[key], o);
	addKeys(M.details[o.friendly], o);
	o.key = key;
	o.class = o.class.toLowerCase();
	if (isdef(o.lifespan)) o.olifespan = calcLifespan(o.lifespan);
	if (isdef(o.food)) {
		[o.foodlist, o.foodtype] = extractFoodAndType(o.food);
		let foodTokens = [];
		if (['berries', 'fruit'].some(x => o.foodlist.includes(x))) foodTokens.push('cherries');
		if (['fish', 'shrimp', 'squid'].some(x => o.foodlist.includes(x))) foodTokens.push('fish');
		if (['wheat', 'grain', 'crops'].some(x => o.foodlist.includes(x))) foodTokens.push('grain');
		if (o.foodtype.startsWith('insect')) foodTokens.push('worm');
		else if (o.foodtype.startsWith('carni')) foodTokens.push('mouse');
		else if (o.foodtype.startsWith('omni')) foodTokens.push('omni');
		else if (o.foodtype.startsWith('herbi')) foodTokens.push('seedling');
		o.foodTokens = foodTokens;
	}
	if (isdef(o.offsprings)) o.ooffsprings = calcOffsprings(o.offsprings);
	if (isdef(o.weight)) { o.oweight = calcWeight(o.weight); o.nweight = o.oweight.avg; }
	if (isdef(o.size)) { o.osize = calcSize(o.size); o.nsize = o.osize.avg; }
	if (isdef(o.species)) {
		let x = o.species; o.longSpecies = x; o.species = extractSpecies(x);
	}

	if (isdef(o.habitat)) {
		let text = o.habitat;
		let hlist = o.hablist = extractHabitat(text, ['coastal']);
		let habTokens = [];
		if (['wetland'].some(x => hlist.includes(x))) { habTokens.push('wetland'); } //colors.push('lightblue'); imgs.push('../assets/games/wingspan/wetland.png'); }
		if (['dwellings', 'grassland', 'desert'].some(x => hlist.includes(x))) { habTokens.push('grassland'); } //{ colors.push('goldenrod'); imgs.push('../assets/games/wingspan/grassland2.png'); }
		if (['forest', 'mountain', 'ice'].some(x => hlist.includes(x))) { habTokens.push('forest'); } //{ colors.push('emerald'); imgs.push('../assets/games/wingspan/forest1.png'); }
		o.habTokens = habTokens;
		//let ohab = o.ohabitat = { text };
		// let colors = ohab.colors = [];
		// let imgs = ohab.imgs = [];
		// if (['wetland'].some(x => hlist.includes(x))) { colors.push('lightblue'); imgs.push('../assets/games/wingspan/wetland.png'); }
		// if (['dwellings', 'grassland', 'desert'].some(x => hlist.includes(x))) { colors.push('goldenrod'); imgs.push('../assets/games/wingspan/grassland2.png'); }
		// if (['forest', 'mountain', 'ice'].some(x => hlist.includes(x))) { colors.push('emerald'); imgs.push('../assets/games/wingspan/forest1.png'); }
	}

	let colors = ['turquoise', 'bluegreen', 'teal', 'brown', 'gray', 'green', 'violet', 'blue', 'black', 'yellow', 'white', 'lavender', 'orange', 'buff', 'red', 'pink', 'golden', 'cream', 'grey', 'sunny', 'beige'];
	if (isdef(o.color)) o.colors = extractColors(o.color, colors);
	o = sortDictionary(o);
	return o;
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
	//svgParts.push(`<g transform="matrix(1,0,0,1,0,-${sz/2})">`);
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

function wsPrintSymbol(dParent, sz, key) {
	let files = {
		cherries: '../assets/games/wingspan/fruit.svg',
		fish: '../assets/games/wingspan/fish.svg',
		forest: '../assets/games/wingspan/forest1.png',
		grain: '../assets/games/wingspan/wheat.svg',
		grassland: '../assets/games/wingspan/grassland2.png',
		mouse: '../assets/games/wingspan/mouse.svg',
		omni: '../assets/games/wingspan/pie3.svg',
		seedling: '../assets/img/emo/seedling.png',
		wetland: '../assets/games/wingspan/wetland.png',
		worm: '../assets/games/wingspan/worm.svg',
	};
	let keys = Object.keys(files);
	let styles = { w: sz, h: sz, };
	if (['wetland', 'grassland', 'forest'].includes(key)) styles['clip-path'] = PolyClips.diamond;
	if (key == 'wetland') styles.bg = 'lightblue';
	else if (key == 'grassland') styles.bg = 'goldenrod';
	else if (key == 'forest') styles.bg = 'emerald';
	return mDom(dParent, styles, { tag: 'img', width: sz, height: sz, src: files[valf(key, rChoose(keys))] });
}


//obsolete!
function wsDrawFoodToken(d, func, sz) {
	let df = mDom(d, { w: sz, h: sz }); //mCenterCenterFlex(df);
	func(df, { w: sz, h: sz, sz });
	return df;
}
function showFood(dParent, tokens, w, fz) {
	let dOuter = mDom(dParent); mCenterFlex(dOuter);
	let sz = w / 4;
	let last = arrLast(tokens);
	let ch = tokens.length == 2 && coin() ? '/' : '+';
	for (const t of tokens) {
		wsDrawFoodToken(dOuter, t, sz);

		// if (t != last) {
		// 	//let d1=mDom(dOuter,{h:sz});mCenterCenterFlex(d1);
		// 	mDom(dOuter, { fz,matop:sz/2 }, { html: ch })
		// }
	}

}
function showFoodMist() {

	let img = showim1('../assets/games/wingspan/pie3.svg', df, { w: sz, h: sz }); return;
	let len = tokens.length, i = 0;

	let [sz, szSym, szChar, gap] = [w / 3, w / 3.5, w / 9, 10];
	k
	let src = tokens[0]; if (!src) return;


	let ch = len < 3 && coin() ? '/' : '+';

	let tlist = [{ t: tokens[0], sz: szSym }];
	if (len > 1) { tlist.push({ t: ch, sz: szChar }); tlist.push({ t: tokens[1], sz: szSym }) }
	if (len > 2) { tlist.push({ t: ch, sz: szChar }); tlist.push({ t: tokens[2], sz: szSym }) }
	let [l, y] = [0, 0];
	for (const x of tlist) {
		let d = mDom(df, { w: x.sz, position: 'absolute', x: l, y }); //,bg:rColor()}); 
		//mCenterCenterFlex(d);
		let c = x.t;
		if (c == '+') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c == '/') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c.includes('.')) {
			let img = showim1(c, d, { w: x.sz });
			if (c.includes('mouse')) mStyle(img, { matop: fz / 4 })
		} else {
			let szimg = x.sz * .7;
			let img = showim1('../assets/games/wingspan/pie2.png', d, { w: szimg, h: szimg });//mStyle(img,{round:true})
		}
	}
}
function getOhab() {
	let colors = [];
	let imgs = [];
	colors.push('lightblue'); imgs.push('../assets/games/wingspan/wetland.png');
	colors.push('goldenrod'); imgs.push('../assets/games/wingspan/grassland2.png');
	colors.push('emerald'); imgs.push('../assets/games/wingspan/forest1.png');
	return { colors, imgs };
}
function randomSvg(dParent, sz) {
	let files = {
		seedling: '../assets/img/emo/seedling.png',
		mouse: '../assets/games/wingspan/mouse.svg',
		cherries: '../assets/games/wingspan/fruit.svg',
		grain: '../assets/games/wingspan/wheat.svg',
		fish: '../assets/games/wingspan/fish.svg',
		worm: '../assets/games/wingspan/worm.svg',
		wetland: '../assets/games/wingspan/wetland.png',
		grassland: '../assets/games/wingspan/grassland2.png',
		forest: '../assets/games/wingspan/forest1.png',
	};
	let keys = Object.keys(files);
	mDom(dParent, { w: sz, h: sz }, { tag: 'img', width: sz, height: sz, src: files[rChoose(keys)] }); //'../assets/img/emo/seedling.png'})
	//wsDrawWorm(dParent,{w:sz,h:sz,sz});
}


function wsDrawSeedling(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let sz = styles.h; console.log(sz)
	let d1 = mDom(d, styles);
	let html = `<img width='${sz}' height='${sz}' style='margin-top:-${sz / 20}px' src='../assets/img/emo/seedling.png' />`;
	d1.innerHTML = html
}
function wsDrawOmni(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = generatePizzaSvg(styles.w, 'red', 'yellow', 'blue', 'orange', 'green');
	d1.innerHTML = html
}
function wsDrawGrain(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = `
		<svg width="${styles.w}" height="${styles.h}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
			<g transform="matrix(1.9,0,0,1.8,-655,-980)">
				<g transform="matrix(7.70232,0,0,7.70232,-3403,-873.691)">
					<g>
						<g>
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
	d1.innerHTML = html
}
function wsDrawMouse(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = `
		<svg width="${styles.w}" height="${styles.h}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
				<g transform="matrix(1.3,0,0,1.5,-680,-490)">
						<g transform="matrix(9.09451,0,0,9.09451,670.98,392.954)">
								<g id="ws-5">
										<path id="mouse" d="M0,0.136C-0.705,-0.412 -2.127,-0.236 -2.867,-0.095C-2.803,-2.905 -7.442,-5.024 -10.299,-2.45L-11.797,-2.233C-11.131,-3.613 -12.9,-3.994 -13.312,-2.346L-15.426,-0.406C-16.451,0.4 -16.105,1.031 -15.189,1.031C-14.876,1.031 -11.897,1.617 -11.472,2.094C-11.535,2.206 -11.852,2.384 -11.773,2.995L-5.978,3.179C-4.286,2.679 -3.368,1.772 -3.023,0.768C-2.195,0.57 -0.921,0.449 -0.497,0.777C-0.434,0.826 -0.369,0.899 -0.369,1.063C-0.369,1.549 -0.767,1.699 -1.744,1.949C-2.445,2.129 -3.24,2.332 -3.749,2.912C-4.156,3.376 -4.309,3.827 -4.202,4.25C-4.05,4.859 -3.429,5.107 -3.359,5.134C-3.312,5.152 -3.264,5.16 -3.216,5.16C-3.052,5.16 -2.897,5.059 -2.837,4.896C-2.758,4.687 -2.864,4.452 -3.074,4.374C-3.131,4.352 -3.371,4.228 -3.415,4.053C-3.452,3.907 -3.354,3.692 -3.139,3.447C-2.796,3.057 -2.159,2.893 -1.542,2.735C-0.658,2.509 0.442,2.227 0.442,1.063C0.442,0.681 0.289,0.36 0,0.136" style="fill:rgb(116,100,91);fill-rule:nonzero;"/>
								</g>
						</g>
				</g>
		</svg>
    `;
	d1.innerHTML = html
}
function wsDrawCherries(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = `
		<svg width="${styles.w}" height="${styles.h}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
				<g transform="matrix(1.6,0,0,1.6,-540,-540)">
						<g transform="matrix(8.59167,0,0,8.59167,432.85,422.626)">
								<g>
										<path d="M0,-5.356C-0.427,-5.356 -0.825,-5.247 -1.184,-5.07L-1.487,-6.86C-1.18,-7.11 -0.839,-7.331 -0.47,-7.508C0.341,-7.901 1.273,-8.154 2.148,-8.241L2.17,-8.243C2.227,-8.249 2.283,-8.262 2.338,-8.282C2.695,-8.415 2.877,-8.811 2.745,-9.168C2.612,-9.524 2.216,-9.706 1.859,-9.574C0.872,-9.208 -0.018,-8.809 -0.897,-8.288C-1.327,-8.022 -1.751,-7.73 -2.127,-7.365C-2.478,-7.028 -2.813,-6.676 -3.154,-6.309C-3.37,-6.078 -3.566,-5.826 -3.752,-5.566C-3.756,-5.566 -3.759,-5.568 -3.763,-5.568L-5.106,-5.582C-5.308,-6.864 -6.41,-7.847 -7.749,-7.847C-9.233,-7.847 -10.435,-6.645 -10.435,-5.162C-10.435,-3.679 -9.233,-2.476 -7.749,-2.476C-6.304,-2.476 -5.134,-3.62 -5.074,-5.051L-4.184,-4.886C-4.394,-4.515 -4.579,-4.131 -4.719,-3.739C-4.942,-3.129 -5.117,-2.511 -5.27,-1.883C-6.879,-1.753 -8.148,-0.421 -8.148,1.221C-8.148,2.949 -6.748,4.35 -5.019,4.35C-3.291,4.35 -1.89,2.949 -1.89,1.221C-1.89,-0.297 -2.973,-1.562 -4.408,-1.846C-4.278,-2.39 -4.122,-2.933 -3.938,-3.457C-3.647,-4.336 -3.233,-5.136 -2.609,-5.816C-2.452,-5.994 -2.279,-6.162 -2.1,-6.327L-1.724,-4.714C-2.307,-4.221 -2.686,-3.493 -2.686,-2.67C-2.686,-1.187 -1.483,0.016 0,0.016C1.484,0.016 2.686,-1.187 2.686,-2.67C2.686,-4.153 1.484,-5.356 0,-5.356" style="fill:rgb(152,21,49);fill-rule:nonzero;"/>
								</g>
						</g>
				</g>
		</svg>
    `;
	d1.innerHTML = html
}
function wsDrawFish(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = `
		<svg width="${styles.w}" height="${styles.h}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
			<g transform="matrix(1.28,0,0,1.28,-924,-406)">
				<g transform="matrix(-10.1636,-1.24469e-15,1.24469e-15,-10.1636,756.948,402.109)">
					<g>
						<path d="M0,0.092C0,-0.238 0.267,-0.506 0.598,-0.506C0.927,-0.506 1.195,-0.238 1.195,0.092C1.195,0.422 0.927,0.69 0.598,0.69C0.267,0.69 0,0.422 0,0.092M-11.442,-1.15L-11.442,-1.088C-11.442,-1.037 -11.42,-0.992 -11.408,-0.945C-11.275,-0.465 -10.779,-0.016 -10.771,0.305C-10.756,0.912 -11.504,1.256 -11.586,1.625C-11.586,1.625 -11.667,1.904 -11.559,2.025C-11.499,2.092 -11.42,2.102 -11.337,2.094C-9.921,1.954 -8.259,1.047 -7.839,1.24C-7.419,1.433 -5.796,3.438 -2.936,3.63C-1.327,3.738 1.139,3.412 2.135,2.096C2.368,1.819 2.579,1.517 2.783,1.224C2.876,1.09 2.97,0.957 3.065,0.825C3.225,0.596 3.097,0.387 3.056,0.337C2.902,0.146 2.75,-0.056 2.602,-0.253C2.27,-0.693 1.927,-1.148 1.529,-1.524C-0.167,-3.129 -2.469,-3.646 -4.806,-2.897C-5.842,-2.565 -7.774,-0.907 -7.775,-0.907C-8.289,-0.579 -10.235,-1.284 -11.139,-1.405C-11.214,-1.415 -11.286,-1.421 -11.346,-1.37C-11.406,-1.32 -11.442,-1.237 -11.442,-1.15" style="fill:rgb(0,121,159);fill-rule:nonzero;"/>
					</g>
				</g>
			</g>
		</svg>
    `;
	d1.innerHTML = html
}
function wsDrawWorm(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = `
    <svg width="${styles.w}" height="${styles.h}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(1.8,0,0,1.9,-621,-280)">
            <g transform="matrix(7.14802,0,0,7.14802,-2977.16,-1174.38)">
                <g>
                    <g>
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
	d1.innerHTML = html

}















