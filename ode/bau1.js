
async function calcUserPalette(name){
	if (nundef(name)) name = U.name;
	let user = await getUser(name);
	let d=mPopup();
	return calcPalette(d,user.texture,user.color,user.blendMode);
}
async function calcPalette(dParent, src, color, blendMode) {
	let fill = color;
	let bgBlend = getBlendCanvas(blendMode);
	let d1 = mDom(dParent,{gap:4}); mFlexWrap(d1);

	let palette = [color];
	if (isdef(src)){
		let ca = await getCanvasCtx(d1, { w: 310, h: 200, fill, bgBlend }, { src });
		palette = await getPaletteFromCanvas(ca.cv);
		palette.unshift(fill);
	} else {
		//make a palette with color and other shades of that color
		palette = paletteShades(color);

	}
	
	let dominant = palette[0];
	//['black','white','#ffff00','#ff0000','#00ffff','#00ff00','#0000ff'].map(x=>palette.push(x))
	//palette.push('black');palette.push('white');palette.push('#ff0000');
	let dfunc = colorDistanceHue;
	let opal = paletteAddDistanceTo(palette,fill,'bg',dfunc);
	paletteAddDistanceTo(opal,dominant,'dom',dfunc);
	opal.map(x=>showObject(x,['hex','hue','dist_bg','dist_dom'],d1,{bg:x.hex,wmin:50})); 
	mLinebreak(d1);

	let best = arrMinMax(opal,x=>Math.min(x.dist_bg,x.dist_dom)).imax;
	let obest=opal[best];
	showObject(obest,['hue'],d1,{bg:obest.hex,wmin:50}); mLinebreak(d1);
	//console.log('===>best',opal[best]); 

	//console.log('opal',opal.map(x=>x.hex)); 
	let p1=palettePureHue(opal);
	p1.map(x=>showObject(x,['hue'],d1,{bg:x.hex,wmin:50}));	//showPaletteMini(d1, p1); 
	mLinebreak(d1);

	let o = paletteGetBestContrasting(p1,fill,dominant);
	showObject(o.best,['hue'],d1,{bg:o.best.hex,wmin:50});
	mLinebreak(d1);

	let p2=paletteContrastVariety(opal);
	p2.map(x=>showObject(x,['hue'],d1,{bg:x.hex,wmin:50}));	
	mLinebreak(d1);

	res = p2.map(x=>x.hex); res = arrRemoveDuplicates(res);
	showPaletteMini(d1,res);
	mLinebreak(d1);

	//do NOT add color if distance is too close to one that is already in the array
	console.log('_______________')
	let p3=res.slice(0,2);
	let i=2;
	while(i<res.length){
		let hex=res[i];
		let ok=true;
		for(const h1 of p3){
			let d=colorDistance(hex,h1);
			//console.log(d);
			if (d<40) {ok=false;break;}
		}
		if (ok) p3.push(hex);
		i++;
	}

	showPaletteMini(d1,p3);
	mLinebreak(d1);

	console.log(p3[0],p3[2],colorDistance(p3[0],p3[2]))
	return;

	//showPaletteMini(d1, palette);
	let pal2 = [colorComplement(fill), colorComplement(dominant), 'white', 'silver', 'dimgray', 'black'];
	showPaletteMini(d1, pal2); mLinebreak(d1);
	let pal3 = [colorTurnHueBy(fill), colorTurnHueBy(dominant), colorTurnHueBy(fill, 120), colorTurnHueBy(dominant, 120), colorTurnHueBy(fill, 240), colorTurnHueBy(dominant, 240)];
	showPaletteMini(d1, pal3); mLinebreak(d1);
	let pal4 = [getBestContrastingColor(fill), getBestContrastingColor(dominant)];
	showPaletteMini(d1, pal4); mLinebreak(d1);
	let pal5 = [fill, colorTurnHueBy(fill), colorComplement(fill), getBestContrastingColor(fill), colorIdealText(fill)]
	showPaletteMini(d1, pal5); mLinebreak(d1);
	for (const c of pal5) {
		console.log(c, colorDistance(fill, c));
	}

	console.log(src, opal)
	return palette;
}












