
function colorGetPureHue(c) { c = colorO(c); return c.hue == 0 ? c.hex : colorFromHsl(c.hue, 100, 50); }
function palettePureHue(pal) {
	//let xb=w3color('black');console.log(xb)
	//console.log(pal.map(x=>x.hex))
	let p2 = pal.map(x => colorGetPureHue(x));
	//console.log(p2)
	return pal.map(x => colorO(colorGetPureHue(x)));
}
function paletteGetBestContrasting(pal) {
	let clist = Array.from(arguments).slice(1).map(x => colorO(x)); //console.log(clist)
	pal = pal.map(x => colorO(x));
	let best = null, dbest = 0;
	for (const p of pal) {
		let arr = clist.map(x => colorDistanceHue(p, x)); //console.log(arr)
		let dmax = arrMinMax(arr).min; //console.log(dmax,dbest,p.hue)
		if (dmax > dbest) {
			//console.log('new best',p.hue,dmax,'beats',dbest)
			best = p; dbest = dmax;
		}
	}
	return { best, dbest };
}
function paletteContrastVariety(pal, n = 20) {
	//return a palette of good contrasting colors to pal
	pal = pal.map(x => colorO(x));
	let res = [];

	//add white and black
	['white', 'black'].map(x => res.push(colorO(x)));

	let o = paletteGetBestContrasting(pal, pal[0], pal[1]).best;
	res.push(o)
	let pal2 = jsCopy(pal).filter(x => x.hex != o.hex);
	res.push(colorO(colorGetPureHue(o)));

	let o2 = paletteGetBestContrasting(pal2, pal[0], pal[1]).best;
	res.push(o2)
	res.push(colorO(colorGetPureHue(o2)))

	//res.push(colorO('#eea37b')); mimi
	//push complement
	res.push(colorO(colorComplement(pal[0].hex)));
	res.push(colorO(colorComplement(pal[1].hex)));

	[60, 120, 180, 240, 300].map(x => {
		res.push(colorO(colorTurnHueBy(pal[0].hex, x)));
		res.push(colorO(colorTurnHueBy(pal[1].hex, x)));
	});

	['silver', 'dimgray', '#ff0000', '#ffff00'].map(x => res.push(colorO(x)));
	//console.log(res.map(x=>x.hex));



	if (n < res.length) res = res.slice(0, n)
	return res;

}
function paletteShades(color, from = -0.8, to = 0.8, step = 0.2) {
	let res = [];
	for (let frac = from; frac <= to; frac += step) {
		let c = colorCalculator(frac, color, undefined, true);
		res.push(c);
	}
	return res;
}
function paletteShadesQuad(color, from = -0.5, to = 0.5, step = 0.5) {
	let tri = [color, colorTurnHueBy(color, 90), colorTurnHueBy(color, 180), colorTurnHueBy(color, 270)];
	let res = jsCopy(tri);
	for (const c1 of tri) {
		for (let frac = from; frac <= to; frac += step) {
			let c = colorCalculator(frac, c1, undefined, true);
			addIf(res,c);
		}
	}
	return res;
}
function paletteShadesTri(color, from = -0.5, to = 0.5, step = 0.5) {
	let tri = [color, colorTurnHueBy(color, 120), colorTurnHueBy(color, 240)];
	let res = jsCopy(tri);
	for (const c1 of tri) {
		for (let frac = from; frac <= to; frac += step) {
			let c = colorCalculator(frac, c1, undefined, true);
			addIf(res,c);
		}
	}
	return res;
}
function paletteShadesBi(color, turnHueBy = 180, from = -0.8, to = 0.8, step = 0.4) {
	let bi = [color, colorTurnHueBy(color, turnHueBy)];
	let res = jsCopy(bi);
	for (const c1 of bi) {
		for (let frac = from; frac <= to; frac += step) {
			let c = colorCalculator(frac, c1, undefined, true);
			addIf(res,c);
		}
	}
	return res;
}
function paletteShadesHues(color, n=2, turnHueBy = 30, from = -0.5, to = 0.5, step = 0.5) {
	let list=[color];
	for(let i=1;i<n;i++) list.push(colorTurnHueBy(color, i*turnHueBy))
	let res = jsCopy(list);
	// a palette should have 8-10 colors
	if (n==2){from=-.8;to=.8;step=.4;}
	for (const c1 of list) {
		for (let frac = from; frac <= to; frac += step) {
			let c = colorCalculator(frac, c1, undefined, true);
			addIf(res,c);
		}
	}
	return res;
}
function paletteTrans(color, from = 0.1, to = 1, step = 0.2) {
	let res = [];
	for (let frac = from; frac <= to; frac += step) {
		let c = colorTrans(color, frac);
		res.push(c);
	}
	return res;
}
function paletteTransWhiteBlack(n = 9) {
	let c = colorHex('white');
	let pal = [c];
	let [iw, ib] = [Math.floor(n / 2) - 1, Math.floor((n - 1) / 2) - 1];
	let [incw, incb] = [1 / (iw + 1), 1 / (ib + 1)];
	for (let i = 1; i < iw; i++) {
		let alpha = i * incw;
		pal.push(colorTrans(c, alpha));
	}
	pal.push('transparent');
	c = colorHex('black');
	for (let i = 1; i < ib; i++) {
		let alpha = i * incb;
		pal.push(colorTrans(c, alpha));
	}
	pal.push(c);
	return pal;
}









