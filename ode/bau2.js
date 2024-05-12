

function colorSchemeRYB(){
	let ryb=['#FE2712','#FC600A','#FB9902','#FCCC1A','#FEFE33','#B2D732','#66B032','#347C98','#0247FE','#4424D6','#8601AF','#C21460'];
	return ryb;
	console.log('w3color',w3color('deeppink'))

	for (const c of ryb){
		let cw=w3color(c);
		console.log(cw.hue,cw.sat,cw.lightness,cw.ncol);
	}
}
function downloadAsText(s, filename, ext = 'txt') {
  saveFileAtClient(
    filename + "." + ext,
    "data:application/text",
    new Blob([s], { type: "" }));
}
function downloadAsYaml(o, filename) {
  let y = jsyaml.dump(o);
  downloadAsText(y, filename, 'yaml');
}
function getBeautifulColors(){
  let res = getColormapColors();
	res = res.concat(colorSchemeRYB());
  res = res.concat(levelColors.concat(modernColors.concat(Object.values(playerColors).concat(vibrantColors.concat(childrenRoomColors.concat(deepRichColors)))))).map(x=>w3color(x));
	res = res.filter(x=>x.sat*100 >= 50);
  for(const o of res) o.hex = o.toHexString();
  return res; //.map(x=>x.hex);
}
async function mGetText(path = '../base/assets/m.txt') {
  let res = await fetch(path);
  let text = await res.text();
  return text;
}
function saveFileAtClient(name, type, data) {
  if (data != null && navigator.msSaveBlob) return navigator.msSaveBlob(new Blob([data], { type: type }), name);
  let a = document.createElement('a');
  a.style.display = 'none';
  let url = window.URL.createObjectURL(new Blob([data], { type: type }));
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  simulateClick(a);
  setTimeout(function () {
    window.URL.revokeObjectURL(url);
    a.remove();
  }, 500);
}
function showPalette(dParent,colors){
  let d1=mDom(dParent,{display:'flex',dir:'column',wrap:true, gap:2, hmax:'100vh'});
  
  for(var c of colors){
    if (isDict(c)) c=c.hex;
		let html=`${c}<br>hue:${w3color(c).hue}<br>sat:${Math.round(w3color(c).sat*100)}<br>lum:${Math.round(w3color(c).lightness*100)}`
    let dmini=mDom(d1,{wmin:40,hmin:40,padding:2,bg:c,fg:idealTextColor(c)},{html});
  }

}
function showPaletteNames(dParent,colors){
  let d1=mDom(dParent);
  
  for(var c of colors){
    let bg=c.hex;
		let html=`${c.name}: ${bg} hue:${c.hue} sat:${Math.round(c.sat*100)} lum:${Math.round(c.lightness*100)}`
    let dmini=mDom(d1,{padding:2,bg,fg:idealTextColor(bg)},{html});
  }

}
function showPaletteNames(dParent,colors){
  let d1=mDom(dParent,{gap:12}); mFlexWrap(d1);
  console.log('HALLO')
  for(var c of colors){
    let bg=c.hex;
    let d2=mDom(d1,{wmin:250,bg,fg:idealTextColor(bg),padding:20});
    mDom(d2,{weight:'bold',align:'center'},{html:c.name});
    
		// let html=`<span style:'font-weight:900'>${c.name}</span><br>${bg}<br>hue:${c.hue}<br>sat:${Math.round(c.sat*100)}<br>lum:${Math.round(c.lightness*100)}`
		let html=`<br>${bg}<br>hue:${c.hue}<br>sat:${Math.round(c.sat*100)}<br>lum:${Math.round(c.lightness*100)}`
    let dmini=mDom(d2,{align:'center',wmin:120,padding:2,bg,fg:idealTextColor(bg)},{html});
  }

}
function simulateClick(elem) {
  var evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
  var canceled = !elem.dispatchEvent(evt);
}
function sortByHues(list){
  let buckets={red:[],orange:[],yellow:[],green:[],cyan:[],blue:[],purple:[],magenta:[],pink:[],grey:[]};
  for(const c of list){
    let hue = c.hue;
    if (hue>=355 || hue <=10) buckets.red.push(c);
    if (hue>=11 && hue <=45) buckets.orange.push(c);
    if (hue>=46 && hue <=62 && c.lightness*100>=45) buckets.yellow.push(c);
    if (hue>=63 && hue <=164) buckets.green.push(c);
    if (hue>=165 && hue <=199) buckets.cyan.push(c); //180
    if (hue>=200 && hue <=245) buckets.blue.push(c);
    if (hue>=246 && hue <=277) buckets.purple.push(c);
    if (hue>=278 && hue <=305) buckets.magenta.push(c);
    if (hue>=306 && hue <=355) buckets.pink.push(c);
  }
  for(const b in buckets){
    sortByMultipleProperties(buckets[b],'lightness','hue');
  }
  return buckets;
}



