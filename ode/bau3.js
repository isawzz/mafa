
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
		{ hex: '#ffccff', name: 'Pale Pink', bucket: 'magenta' },
		{ hex: '#ff99ff', name: 'Light Pink', bucket: 'magenta' },
		{ hex: '#ff66ff', name: 'Pink', bucket: 'magenta' },
		{ hex: '#660066', name: 'Purple', bucket: 'magenta' },
		{ hex: '#336600', name: 'Olive', bucket: 'green' },
		{ hex: '#009900', name: 'Strong Green', bucket: 'green' },
		{ hex: '#66ff33', name: 'Bright Green', bucket: 'yellowgreen' },
		{ hex: '#99ff66', name: 'Light Lime', bucket: 'yellowgreen' },
		{ hex: '#ccff99', name: 'Very Light Green', bucket: 'yellowgreen' },
		{ hex: '#ffcccc', name: 'Very Pale Pink', bucket: 'magenta' },
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
		{ hex: '#ff6666', name: 'Salmon', bucket: 'red' },
		{ hex: '#ff0066', name: 'Hot Pink', bucket: 'magenta' },
		{ hex: '#cc6699', name: 'Medium Pink', bucket: 'magenta' },
		{ hex: '#993366', name: 'Dark Mauve', bucket: 'magenta' },
		{ hex: '#cccc00', name: 'Yellow', bucket: 'yellow' },
		{ hex: '#ff5050', name: 'Coral', bucket: 'red' },
		{ hex: '#cc0066', name: 'Crimson', bucket: 'magenta' },
		{ hex: '#660033', name: 'Dark Red', bucket: 'red' },
		{ hex: '#996633', name: 'Brown', bucket: 'orange' },
		{ hex: '#cc6600', name: 'Burnt Orange', bucket: 'orange' },
		{ hex: '#ff3300', name: 'Red Orange', bucket: 'orangered' },
		{ hex: '#cc0000', name: 'Red', bucket: 'red' },
		{ hex: '#990033', name: 'Dark Crimson', bucket: 'red' },
		{ hex: '#663300', name: 'Dark Brown', bucket: 'orange' },
		{ hex: '#cc3300', name: 'Persimmon', bucket: 'orangered' },
		{ hex: '#993333', name: 'Indian Red', bucket: 'red' },
		{ hex: '#fc600a', name: 'Tangerine', bucket: 'orange' },
		{ hex: '#fccc1a', name: 'Bright Yellow', bucket: 'yellow' },
		{ hex: '#b2d732', name: 'Lime Green', bucket: 'yellowgreen' },
		{ hex: '#4424d6', name: 'Ultramarine', bucket: 'bluemagenta' },
		{ hex: '#c21460', name: 'Raspberry', bucket: 'magenta' },
		{ hex: '#afff45', name: 'Chartreuse', bucket: 'yellowgreen' },
		{ hex: '#42d4f4', name: 'Sky Blue', bucket: 'cyanblue' },
		{ hex: '#ffe119', name: 'Sunshine Yellow', bucket: 'yellow' },
		{ hex: '#e6194b', name: 'Red', bucket: 'red' },
		{ hex: '#3cb44b', name: 'Green', bucket: 'green' },
		{ hex: '#4363d8', name: 'Cobalt Blue', bucket: 'blue' },
		{ hex: '#911eb4', name: 'Violet', bucket: 'bluemagenta' },
		{ hex: '#fff620', name: 'Lemon Yellow', bucket: 'yellow' },
		{ hex: '#f58231', name: 'Orange', bucket: 'orange' },
		{ hex: '#ffd8b1', name: 'Peach', bucket: 'orangeyellow' },
		{ hex: '#000075', name: 'Deep Blue', bucket: 'blue' },
		{ hex: '#e6194b', name: 'Red', bucket: 'red' },
		{ hex: '#ff6f61', name: 'Coral', bucket: 'orangered' },
		{ hex: '#f7cac9', name: 'Light Pink', bucket: 'magenta' },
		{ hex: '#009b77', name: 'Teal', bucket: 'cyan' },
		{ hex: '#dd4124', name: 'Rust Red', bucket: 'orangered' },
		{ hex: '#d65076', name: 'Blush', bucket: 'magenta' },
		{ hex: '#efc050', name: 'Goldenrod', bucket: 'orangeyellow' },
		{ hex: '#9b2335', name: 'Carmine', bucket: 'red' },
		{ hex: '#e15d44', name: 'Burnt Sienna', bucket: 'orangered' },
		{ hex: '#bc243c', name: 'Maroon', bucket: 'red' },
		{ hex: '#c3447a', name: 'Mulberry', bucket: 'magenta' },
		{ hex: '#ffd662', name: 'Mustard', bucket: 'orangeyellow' },
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
		{ hex: '#26547c', name: 'Dark Blue', bucket: 'blue' },
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