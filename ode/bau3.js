
//#region color legacy code: isolate and eliminate
function colorHSL(cAny, asObject = false) {
  let res = colorFrom(cAny, undefined, true);
  let shsl = res;
  if (res[0] == '#') {
    if (res.length == 9) {
      shsl = hexAToHSLA(res);
    } else if (res.length == 7) {
      shsl = hexToHSL(res);
    }
  } else if (res[0] == 'r') {
    if (res[3] == 'a') {
      shsl = RGBAToHSLA(res);
    } else {
      shsl = RGBToHSL(res);
    }
  }
  let n = allNumbers(shsl);
  if (asObject) {
    return { h: n[0] / 360, s: n[1] / 100, l: n[2] / 100, a: n.length > 3 ? n[3] : 1 };
  } else {
    return shsl;
  }
}
function colorLum(cAny, percent = false) {
  let hsl = colorHSL(cAny, true);
  return percent ? hsl.l * 100 : hsl.l;
}
async function getPaletteFromElem(elem){
	let cv = await html2canvas(elem);
  let imgData = cv.toDataURL("image/jpeg", 0.9);
  let img = await imgAsync(elem.parentNode, {w:100,h:100,border:'red',position:'absolute',top:210,left:800}, {src:imgData});
  let pal=ColorThiefObject.getPalette(img); //console.log('palette',pal)

  //sort palette by brightness!
  let arr=pal.map(x=>({orig:x,hex:colorHex(x),lum:colorHSL(x,true).l}));
  arr=sortBy(arr,'lum');
  //img.remove();
  //console.log(arr);

  return arr.map(x=>x.hex); //.map(x=>colorHex(x));//new Image(cv.width,cv.height,imgData;
  // .then(function (canvas) {
	// 	let imgData = canvas.toDataURL("image/jpeg", 0.9);
	// 	var profile_image = mBy("profile_image");
	// 	profile_image.src = imgData;
	// 	mBy('imgPreview').src = imgData;

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



