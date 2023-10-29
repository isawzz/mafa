
function showImage(key,dParent,styles){
	let d = toElem(dParent);
	let o = M.superdi[key];
	console.log('k', key)
	try{
		if (isdef(o.img)) {
			console.log('img',o.img);
			mDom(d, { h: 200 }, { tag: 'img', src: `${o.path}` });
		}
		else if (isdef(o.text)) mDom(d, { fz: 200, family: 'emoNoto', bg: rColor(), fg: rColor(), display: 'inline' }, { html: o.text });
		// if (isdef(k.hex)) mDom(d,{fz:200,family:'emoNoto',bg:rColor(),fg:rColor(),display:'inline'},{html:String.fromCharCode('0x'+k.hex)});
		else if (isdef(o.fa)) mDom(d, { fz: 200, family: 'pictoFa', bg: rColor(), fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
		else if (isdef(o.ga)) mDom(d, { fz: 200, family: 'pictoGame', bg: rColor(), fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	}catch{
		console.log('k',k,o)
	}

}











