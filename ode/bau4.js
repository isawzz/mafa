
function mimali(c, m) {
	let seasonColors = 'winter_blue midnightblue light_azure capri spring_frost light_green deep_green summer_sky yellow_pantone orange pale_fallen_leaves timberwolf'.split(' ');
	let c2=seasonColors[m-1];
  let colors = paletteMix(c,c2,6).slice(); //paletteShadesBi(c,36*m);
  let wheel=[];
  for(const x of colors){
    let pal1=paletteShades(x); //console.log(pal1.length)
    for(const i of range(7)) wheel.push(pal1[i+2]);
  }
  return wheel;
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


