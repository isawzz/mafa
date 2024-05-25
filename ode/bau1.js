
async function showColors() {
	let d = mBy('dSettingsColor'); mClear(d);
	let di = M.dicolor;
	let bucketlist = 'yellow orangeyellow orange orangered red magentapink magenta bluemagenta blue cyanblue cyan greencyan green yellowgreen'.split(' ');
	bucketlist = arrCycle(bucketlist, 8);
	for (const bucket of bucketlist) {
		let list = dict2list(di[bucket]);
		let clist = [];
		for (const c of list) {
			let o = w3color(c.value);
			o.name = c.id;
			o.hex = c.value;
			clist.push(o);
		}
		let sorted = sortByFunc(clist, x => -x.lightness);
		_showPaletteNames(d, sorted);
	}
	let divs = document.getElementsByClassName('colorbox');
	for (const div of divs) {
		mStyle(div, { cursor: 'pointer' })
		div.onclick = async () => onclickColor(div.getAttribute('dataColor'));
	}
}

async function showBlendModes() {
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

//wegwerf!!!
function correctPastelRed(){
  //doppelt: pastel_red
  let di = jsCopy(M.dicolor);
  di.red.pastel_red = '#ff6961';
}
function correctDarkLavender(){
  //doppelt: dark_lavender
  console.log('lilac',n1.darklilac,n1.dark_lilac)
  let di = jsCopy(M.dicolor);
  delete di.blue.dark_blue_gray;
  di.bluemagenta.dark_lavender = n2.dark_lavender.hex;
  di.bluemagenta.dark_lilac = n1.dark_lavender.hex;

  downloadAsYaml(di,'dicolor')

  // //let styles = { wmin: 250, padding: 20 };
  // for (const list of [l1, l2, l3]) {
  //   console.log('list',list.length)
  //   showColorBoxes(list, 'name', dParent, { padding: 10 });
  //   mLinebreak(dParent)
  // }

}
function showHexDuplicates(int1,skeys,d1,styles,h1,h2,n1){
  for(const k of int1){
    //console.log('k',k, jsCopy(h1[k]), jsCopy(h2[k]))
    let odi = h1[k];
    let ofi = h2[k];
    showColorBox(odi, skeys, d1, styles)
    showColorBox(ofi, skeys, d1, styles)

    //console.log('=',k, jsCopy(h1[k]), jsCopy(h2[k]))
    let name = ofi.name;
    let odiname = n1[name];
    if (isdef(odiname) && odiname.hex != odi.hex){
      console.log(odiname.hex,odi.hex)
      showColorBox(odiname, skeys, d1, styles);
      showColorBox(n1.lilac, skeys, d1, styles);
    }

    mLinebreak(d1)
    //console.log(odi,ofi);
  }

}



