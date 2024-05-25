
function getNavBg() { return mGetStyle('dNav', 'bg'); }
function mimali(c, n) {
  //das ding muss einfach nur n colors returnen!
  //ich koennt es so machen: nimm einfach random pixels auf dem background!


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
async function _showBlendModes() {
	let d = mBy('dSettingsColor'); mClear(d);
	let dTheme = mDom(d, { padding: 10, gap: 10 }); mFlexWrap(dTheme);
	let bgImage = U.bgImage;
	let bg = U.color;
	let bgRepeat = bgImage.includes('marble') || bgImage.includes('wall') ? 'no-repeat' : 'repeat';
	let bgSize = bgImage.includes('marble') || bgImage.includes('wall') ? 'cover' : '';
	let bgSizeItem = bgSize;
	let list = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
	let items = [];
	for (const bgBlend of list) {
		let d = mDom(dTheme, { align: 'center', border: 'red', bgBlend, bg, bgRepeat, bgImage, bgRepeat, bgSize, w: '30%', h: 150 });
		mCenterCenterFlex(d);
		let d1 = mDom(d, { className: 'no_events' })
		mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'white' }, { html: bgBlend })
		mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'black' }, { html: bgBlend })
		let item = { div: d, bgImage, bgRepeat, bgSize: bgSizeItem, bgBlend, isSelected: false };
		items.push(item);
		d.onclick = async () => onclickBlendMode(item);
	}
	return items;
}
async function showTextures() {
	let d = mBy('dSettingsColor'); mClear(d);
	let dTheme = mDom(d, { padding: 12, gap: 10 }); mFlexWrap(dTheme);
	let list = M.textures;
	let itemsTexture = [];
	for (const t of list) {
		let bgRepeat = t.includes('marble_') || t.includes('wall') ? 'no-repeat' : 'repeat';
		let bgSize = t.includes('marble_') || t.includes('wall') ? `cover` : t.includes('ttrans') ? '' : 'auto';
		let bgImage = `url('${t}')`;
		let recommendedMode = t.includes('ttrans') ? 'normal' : (t.includes('marble_') || t.includes('wall')) ? 'luminosity' : 'multiply';
		let dc = mDom(dTheme, { bg: U.color, bgImage, bgSize, bgRepeat, bgBlend: 'normal', cursor: 'pointer', border: 'white', w: '30%', wmax: 300, h: 170 });
		let item = { div: dc, path: t, bgImage, bgRepeat, bgSize, bgBlend: recommendedMode, isSelected: false };
		itemsTexture.push(item);
		dc.onclick = async () => onclickTexture(item, itemsTexture);
	}
	return itemsTexture;
}































