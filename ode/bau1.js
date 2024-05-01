
async function getPaletteFromColorTextureBlend(color,texture,blend,dParent){
  let elem = mDom(dParent, {w:100,h:100,border:'red',position:'absolute',top:100,left:800});
  elem.style.backgroundColor = color;
  if (isEmpty(texture)) return colorPalette(color);
  elem.style.backgroundImage=texture.startsWith('url')?texture:`url("${texture}")`;
  elem.style.backgroundBlendMode = blend;
  let [repeat,size]=getRepeatAndSizeForTexture(texture);
  elem.style.backgroundRepeat = repeat;
  elem.style.backgroundSize = size;
  return getPaletteFromElem(elem);
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
async function colorsUpdate(){
  let seldivs = Array.from(document.body.getElementsByClassName('framedPicture'));
  console.log(seldivs); 
  //first, find selected sample!
  //if there is a sample already, take all the attributes from it
  let sample = seldivs.find(x=>x.id.startsWith('dSample'));

  let pal=await getPaletteFromElem(sample);console.log('!!!!!YEAH!!!!!',pal); 
  pal.unshift('#ffffff');pal.push('#000000');
  console.log('got new palette',pal);
  
  //U=await postUserChange({name:getUname(),color:'red'})
  return;

  console.log('YES, we have a sample',sample);

  //extract styles
  sample = document.body; 
  let color = sample.style.backgroundColor;if (!isEmpty(color)) color=colorHex(color);
  let texture = stringBetween(sample.style.backgroundImage,'"','"');
  let repeat = sample.style.backgroundRepeat;
  let size = sample.style.backgroundSize;
  let blend = sample.style.backgroundBlendMode;

  console.log(color,texture,repeat,size,blend);
  if (isEmpty(color) && isEmpty(texture)) return;

  let data={name:getUname()};
  if (isEmpty(color)) {
    //take a random color from body


  }
  //der user braucht nur color,texture,blend
  U=await postUserChange({name:getUname(),color,texture,blend})


  // for(const el of Array.from(seldivs)){
  //   console.log('el',el);
  //   if (el.id.startsWith('dSample'))
  // }
}

