
function showImage(key,dParent,styles={}){
	// let d = toElem(dParent);
	let o = M.superdi[key];
	//console.log('k', key)
	try{
		addKeys({bg:rColor()},styles);
		// let d1=dParent; //mDom(d,{bg:'red',box:true, align:'center',padding:8,margin:8,})
		mClear(dParent);
		let [w,h]=[dParent.offsetWidth,dParent.offsetHeight];
		//console.log('w',w,'h',h)
		let [sz,fz]=[.9*w,.8*h];

		let d1 = mDiv(dParent,{position:'relative',w:'100%',h:'100%',overflow:'hidden'});
		mCenterCenterFlex(d1)

		
		if (isdef(o.img)) {
			//console.log('img',o.img);
			// mDom(d1, {hmax:'100%',wmax:'100%',h:'auto',w:'auto'}, { tag: 'img', src: `${o.path}` });
			mDom(d1, {w:'100%',h:'100%','object-fit':'cover','object-position':'center center'}, { tag: 'img', src: `${o.path}` });
		}
		else if (isdef(o.text)) mDom(d1, { fz: fz,hline:fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
		// if (isdef(k.hex)) mDom(d,{fz:200,family:'emoNoto',bg:rColor(),fg:rColor(),display:'inline'},{html:String.fromCharCode('0x'+k.hex)});
		else if (isdef(o.fa)) mDom(d1, { fz: fz,hline:fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
		else if (isdef(o.ga)) mDom(d1, { fz: fz,hline:fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	}catch{
		console.log('k',key,o)
	}

}











