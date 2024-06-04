
function mimali(c, n) {
  //das ding muss einfach nur n colors returnen!
  //ich koennt es so machen: nimm einfach random pixels auf dem background!
	//just return n colors!
	console.log('___mimali n',n)

	//why 43?
  let colors = paletteShadesBi(c,60);
  console.log('colors',colors);
  let wheel=[];//'blue'];
  for(const x of colors){
    let pal1=paletteShades(x);
    //wheel=wheel.concat(pal1);
    for(const i of range(7)) wheel.push(pal1[i+2]);
  }
  console.log('wheel',wheel.length)
  return wheel;
	


  // function whh(c1, c2) { return generateArrayColors(colorHex(c1), colorHex(c2), 10); }
  // function genc(c, hinc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, hsl.s * 100, hsl.l * 100); }
  // function cinc(c, hinc, sinc, linc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, clamp(hsl.s * 100 + sinc, 0, 100), clamp(hsl.l * 100 + linc, 0, 100)); }
  // function arrd(c, hinc, sinc, linc, n) { let r = []; for (let i = 0; i < n; i++) { r.push(cinc(c, hinc * i, sinc * i, linc * i)); } return r; }
  // function light(c, lper = 75) { let hsl = colorHSL(c, true); return colorHSLBuild(hsl.h, hsl.s * 100, lper); }
  // function sat(c, sper = 100) { let hsl = colorHSL(c, true); return colorHSLBuild(sper, hsl.s * 100, hsl.l * 100); }
  // function hue(c, hdeg) { let hsl = colorHSL(c, true); return colorHSLBuild(hdeg, hsl.s * 100, hsl.l * 100); }
  // c = light(c, 75);
  // let diff = Math.round(360 / n)
  // wheel = arrd(c, diff, 0, 0, n);
  // return wheel;
}












