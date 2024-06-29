
function showim2(imgKey, d, styles = {}, opts = {}) {
	let o = lookup(M.superdi, [imgKey]); //console.log(imgKey,o)
	let src;
	if (nundef(o) && imgKey.includes('.')) src = imgKey;
	else if (isdef(o) && isdef(opts.prefer)) src = valf(o[opts.prefer], o.img);
	else if (isdef(o)) src = valf(o.img, o.photo)
	let [w, h] = mSizeSuccession(styles, 40);
	addKeys({ w, h }, styles);

	if (nundef(o)) src = rChoose(M.allImages).path;
	if (isdef(src)) return mDom(d, styles, { tag: 'img', src });

	fz=.8*h;
	let [family,html]=isdef(o.text)?['emoNoto',o.text]:isdef(o.fa)?['pictoFa',String.fromCharCode('0x' + o.fa)]:isdef(o.ga)?['pictoGame',String.fromCharCode('0x' + o.ga)]:isdef(o.fa6)?['fa6',String.fromCharCode('0x' + o.fa6)]:['algerian',o.friendly];
	addKeys({ family, fz, hline: fz, display: 'inline'}, styles);

	let el = mDom(d, styles, { html }); mCenterCenterFlex(el);

	return el;

	if (isdef(o.text)) el = mDom(d, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	return el;
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

	let src=valf(files[key],key == 'food'?files[rChoose(keys)]:null);
	if (src) return  mDom(dParent, styles, { tag: 'img', width: sz, height: sz, src: files[valf(key, rChoose(keys))] });

	let o=M.superdi[key];
	return showim2(key,dParent,styles);
}
function wsGetChildInline(item,color){
	let type = item.class;
	let key = type == 'mammal'?'paw':'big_egg';
	let o=M.superdi[key];
	let [fam,sym]=isdef(o.fa6)?['fa6','fa6']:isdef(o.fa)?['pictoFa','fa']:['pictoGame','ga'];
	//console.log(item.colorPower)
	let fg = valf(color,colorIdealText(item.colorPower,true)); // == 'white'?'grey':'inherit';
	//console.log(fg)
	return `<span style="color:${fg};vertical-align:middle;line-height:80%;font-size:${item.fz * 1.5}px;font-family:${fam}">${String.fromCharCode('0x' + M.superdi[key][sym])}</span>`;
}
function wsGetSymbolInline(key, fz) { return `&nbsp;<span style="vertical-align:middle;line-height:80%;font-size:${fz * 1.5}px;font-family:pictoGame">${String.fromCharCode('0x' + M.superdi[key].ga)}</span>`; }

