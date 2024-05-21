async function getPaletteFromElem(elem) {
	//blend-mode is not taken into account!
  let cv = await html2canvas(elem);
  let imgData = cv.toDataURL("image/jpeg", 0.9);
  let img = await imgAsync(elem.parentNode, { w: 100, h: 100, border: 'red', position: 'absolute', top: 210, left: 800 }, { src: imgData });
  let pal = ColorThiefObject.getPalette(img); //console.log('palette',pal)

  //sort palette by brightness!
  let arr = pal.map(x => ({ orig: x, hex: colorHex(x), lum: colorHSL(x, true).l }));
  arr = sortBy(arr, 'lum');
  //img.remove();
  //console.log(arr);

  return arr.map(x => x.hex); //.map(x=>colorHex(x));//new Image(cv.width,cv.height,imgData;
  // .then(function (canvas) {
  // 	let imgData = canvas.toDataURL("image/jpeg", 0.9);
  // 	var profile_image = mBy("profile_image");
  // 	profile_image.src = imgData;
  // 	mBy('imgPreview').src = imgData;

}
function loadPlayerColors() {
  let [hstep, hmin, hmax] = [20, 0, 359];
  let [lstep, lmin, lmax] = [20, 50, 60];
  let [sstep, smin, smax] = [30, 70, 100];
  let [whites, blacks, all] = [[], [], []];
  for (let h = hmin; h < hmax; h += hstep) {
    for (let l = lmin; l <= lmax; l += lstep) {
      for (let s = smin; s <= smax; s += sstep) {
        let o = { h: h, s: s, l: l };
        let c = hslToHexCOOL(o);
        o.c = c;
        all.push(o);
        let fg = idealTextColor(c);
        if (fg == 'white') whites.push(c); else blacks.push(c);
      }
    }
  }
  DA.allColors = all;
  blacks.push('#FFDD33')
  let plColors = whites.concat(blacks);
  shuffle(plColors);
  let userColors = {
    "afia": "#69c963",
    "ally": "#6660f3",
    "amanda": "#339940",
    "annabel": "#ADA0EE",
    "bob": "#033993",
    "buddy": "midnightblue",
    "felix": BLUE,
    "guest": "dodgerblue",
    "gul": "#6fccc3",
    "lauren": BLUEGREEN,
    "leo": "#C19450",
    "mac": ORANGE,
    "minnow": "#F28DB2",
    "mimi": "#76AEEB",
    "nasi": "#EC4169",
    "nimble": "#6E52CC",
    "sarah": "deeppink",
    "sheeba": "gold",
    "valerie": "lightgreen"
  };
  // for (const plname in userColors) {
  //   let uc = userColors[plname];
  //   uc = colorFrom(uc);
  //   let already = firstCond(all, x => x.c.toLowerCase() == uc.substring(0, 7).toLowerCase());
  //   if (already) console.log('present', uc);
  // }
  userColors = Object.values(userColors).map(x => colorFrom(x));
  ensureColorDict();
  ensureColorNames();
  let allColors = Object.values(ColorDi).map(x => x.c);
  let list = Object.values(userColors).concat(plColors).concat(allColors).concat(Object.values(ColorNames));
  // console.log('list',jsCopy(list))
  //list = list.filter(x => colorLum(x) < .85);
  list = list.filter(x => !isGrayColor(x));
  let s = new Set(list);
  list = Array.from(s);
  // let x=list.filter(x=>x.length!=7); console.log(x)
  assertion(list.every(x => x.length == 7), "COLORS WRONG!")
  let hsllist = list.map(x => colorHexToHsl01Array(x)); //, true));
  // hsllist = hsllist.map(x=>({h:x[0],s:x[1],l:x[2]}));
  hsllist = hsllist.map(x => ({ h: x[0] * 360, s: x[1] * 100, l: x[2] * 100 }));
  console.log('list', jsCopy(hsllist));
  sortByMultipleProperties(hsllist, 'h', 'l');
  console.log('list', jsCopy(hsllist[100]));
  // let list2 = hsllist.map(x => hslToHex(x.h*360,x.s*100,x.l*100)); //colorFrom(hslToHsl(x)));
  let list2 = hsllist.map(x => hslToHex(x.h, x.s, x.l)); //colorFrom(hslToHsl(x)));
  for (let i = 0; i < list2.length; i++) if (!list.includes(list2[i])) console.log("ERROR")
  console.log('list', jsCopy(list))
  //list = arrRemoveDuplicates(list);
  //M.playerColors = list;
  return list;
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

function mimali(c, n) {
  function whh(c1, c2) { return generateArrayColors(colorHex(c1), colorHex(c2), 10); }
  function genc(c, hinc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, hsl.s * 100, hsl.l * 100); }
  function cinc(c, hinc, sinc, linc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, clamp(hsl.s * 100 + sinc, 0, 100), clamp(hsl.l * 100 + linc, 0, 100)); }
  function arrd(c, hinc, sinc, linc, n) { let r = []; for (let i = 0; i < n; i++) { r.push(cinc(c, hinc * i, sinc * i, linc * i)); } return r; }
  function light(c, lper = 75) { let hsl = colorHSL(c, true); return colorHSLBuild(hsl.h, hsl.s * 100, lper); }
  function sat(c, sper = 100) { let hsl = colorHSL(c, true); return colorHSLBuild(sper, hsl.s * 100, hsl.l * 100); }
  function hue(c, hdeg) { let hsl = colorHSL(c, true); return colorHSLBuild(hdeg, hsl.s * 100, hsl.l * 100); }
  c = light(c, 75);
  let diff = Math.round(360 / n)
  wheel = arrd(c, diff, 0, 0, n);
  return wheel;
}


















