
function showFood(dParent, tokens, w, fz) {
	let dOuter=mDom(dParent);mCenterFlex(dOuter);
	let sz=25;
	let df = mDom(dOuter,{w:sz,h:sz}); //mCenterCenterFlex(df);
	let img = showim1('../assets/games/wingspan/pie3.svg', df, { w:sz,h:sz }); return;
}
function showFoodMist(){
	
	let len = tokens.length,i=0;
	
	let [sz, szSym, szChar,gap] = [w/3, w / 3.5, w / 9,10];
	
	let src=tokens[0];if (!src) return;


	let ch = len < 3 && coin() ? '/' : '+';
	
	let tlist = [{ t: tokens[0], sz: szSym }];
	if (len > 1) { tlist.push({ t: ch, sz: szChar }); tlist.push({ t: tokens[1], sz: szSym }) }
	if (len > 2) { tlist.push({ t: ch, sz: szChar }); tlist.push({ t: tokens[2], sz: szSym }) }
	let [l,y]=[0,0];
	for (const x of tlist) {
		let d = mDom(df, { w: x.sz,position:'absolute',x:l,y }); //,bg:rColor()}); 
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














