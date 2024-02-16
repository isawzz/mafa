
function createInteractiveCanvas(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = canvas.width = img.width; 
      let h = canvas.height = img.height; 
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w,h); 


      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
async function createScaledCanvasFromImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // const scale = 200 / Math.min(img.width, img.height);
      // const scaledWidth = img.width * scale;
      // const scaledHeight = img.height * scale;

      const canvas = document.createElement('canvas');
      let w = canvas.width = img.width; //scaledWidth;
      let h = canvas.height = img.height; //scaledHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w,h); //scaledWidth, scaledHeight);


      // mAppend(d,canvas)
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
async function imgCropCenter(img, w=300,h=300) {
  let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h);
  const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
  img.onload = () => {
    img.onload = null;
    img.width = w;
    img.height = h;
    mStyle(img, { w: w, h: h });
    mStyle(dParent, { w: w, h: h });
    callback();
  }
  img.src = imgDataUrl;
  return imgDataUrl;
}
async function imgEditor(cell,src){
	let m = await imgMeasure(src); //console.log('sz',m);  
	let [img, wOrig, hOrig, sz, dParent] = [m.img, m.w, m.h, 300, mPopup('',cell)];
	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	mIfNotRelative(d);
	mStyle(img, { h: sz });
	mAppend(d, img);
	let [w0, h0] = [img.width, img.height];

	let dc = mDom(d, { position: 'absolute', left: (w0 - sz) / 2, top: (h0 - sz) / 2, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;

	mDom(dParent, { w: 1, h: 1 })
	mButton('restart', () => imgReset(img, dc, sz, w0, h0), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('squish', () => imgSquish(img, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('expand', () => imgExpand(img, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('ok', () => imgCrop(img, dc, wOrig, hOrig), dParent, { fz: 30, padding: 10, maleft: 10 });

}
function imgEditor1(){
  console.log('EDITOR COMING SOON!!!')
}
function imgEdit(img,onDone){
  console.log('edit image!!!');
  let popup = mPopup('Image Editor<br>',document.body,{bg:'grey',position:'absolute',top:20,left:20,wmin:400,hmin:400,padding:12});
  let imgNew = mDom(popup,{},{tag:'img',src:img.src});
  imgNew.onclick = ev=>{UI.coords = getMouseCoordinatesRelativeToElement(ev,imgNew); UI.mouseX=ev.clientX;UI.mouseY=ev.clientY;}
  mDom(popup,{w100:true,h:1});
  mDom(popup,{},{html:'click on image where you want the center!<br>'});
  mButton('Set center',onDone,popup);
}
function imgRecenter(cell,x,y){
  console.log('x',UI.mouseX,'y',UI.mouseY, UI.coords);
  cropOrExpandImageAndGetDataUrl

}
function mDropZone1aW(dropZone, onDrop) {
	dropZone.setAttribute('allowDrop', true)
	dropZone.addEventListener('dragover', function (event) {
		event.preventDefault();
		dropZone.style.border = '2px dashed #007bff';
	});
	dropZone.addEventListener('dragleave', function (event) {
		event.preventDefault();
		dropZone.style.border = '2px dashed #ccc';
	});
	dropZone.addEventListener('drop', function (evDrop) {
		evDrop.preventDefault();
		dropZone.style.border = '2px dashed #ccc';
		const files = evDrop.dataTransfer.files;
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = evReader => {
				onDrop(evReader.target.result, dropZone);
			};
			reader.readAsDataURL(files[0]);
		}
	});
	return dropZone;
}
function mDropZoneX(dropZone, onDrop) {
  dropZone.setAttribute('allowDrop', true)
  dropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #007bff';
  });
  dropZone.addEventListener('dragleave', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
  });
  dropZone.addEventListener('drop', function (evDrop) {
    evDrop.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
    const files = evDrop.dataTransfer.files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = evReader => {
        onDrop(evDrop, evReader);
      };
      reader.readAsDataURL(files[0]);
    }
  });
  return dropZone;
}
function mDropZoneX1(dropZone, onDrop) {
  dropZone.setAttribute('allowDrop', true)
  dropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #007bff';
  });
  dropZone.addEventListener('dragleave', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
  });
  dropZone.addEventListener('drop', function (evDrop) {
    evDrop.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
    const files = evDrop.dataTransfer.files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = evReader => {
        onDrop(evDrop, evReader.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  });
  return dropZone;
}
function mDropZoneX2(dropZone, onDrop) {
	//onDrop signature: onDrop(url, dDrop, draggedItem*, dropTarget); *must be set UI.draggedItem
	dropZone.setAttribute('allowDrop', true)
	dropZone.addEventListener('dragenter', function (event) {
		event.preventDefault();
		dropZone.setAttribute('origBorder', dropZone.style.border)
		dropZone.style.border = '2px dashed #007bff';
	});
	// dropZone.addEventListener('dragover', function (event) {
	//   event.preventDefault();
	// 	dropZone.setAttribute('origBorder',dropZone.style.border)
	//   dropZone.style.border = '2px dashed #007bff';
	// });
	dropZone.addEventListener('dragleave', function (event) {
		event.preventDefault();
		dropZone.style.border = dropZone.getAttribute('origBorder'); //'2px dashed #ccc';
		// dropZone.style.border = '2px dashed #ccc';
	});
	dropZone.addEventListener('drop', function (evDrop) {
		console.log('bin da evDrop!!!!!')
		evDrop.preventDefault();
		dropZone.style.border = dropZone.getAttribute('origBorder'); //'2px dashed #ccc';
		const files = evDrop.dataTransfer.files;
		if (files.length > 0) {
			console.log('bin da!!!!!')
			const reader = new FileReader();
			reader.onload = evReader => {
				let [url, dDrop, item, dropTarget] = [evReader.target.result, evToAttrElem(evDrop, 'allowDrop').elem, UI.draggedItem, evDrop.target];
				UI.draggedItem = null;
				onDrop(url, dropZone, item, dropTarget);
			};
			reader.readAsDataURL(files[0]);
		}
	});
	return dropZone;
}
function onclickCanvasSetNewCenterOverlay(ev) {
  let cv = ev.target;
  let d = cv.parentNode;
  let c = getMouseCoordinatesRelativeToElement(ev,cv);
  setNewCenterOverlay(d, c.x, c.y);
}
async function ondropImage_UNKNOWN(evDrop, evReader) {
  //console.log('evReader',evReader); return;
  let [url, dropTarget, dDrop, item] = [evReader.target.result, evDrop.target, evToAttrElem(evDrop, 'allowDrop').elem, UI.draggedItem];

  console.log(dropTarget, dDrop, item); //return;
  UI.draggedItem = null;

  let coll = UI.collSecondary;

  if (isdef(item)) {
    //user dragged from an item on the page
    assertion(isdef(item.key),'NO KEY!!!!!');
    await collAddItem(coll,item.key, item);
    //show in cell
    let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
    console.log('free cell', cell);
    if (isdef(cell)) {
      mStyle(cell, { opacity: 1 });
      mClass(cell, 'magnifiable')
      console.log('item', item)
      showImageInBatch(item.key, cell);
    }
  } else {
    let cell = collFindEmptyCell(coll);//find an empty cell to put the picture in!

    let img = await collShowImageInCell(cell,url);// console.log('cell img loaded!!!!')
    //add an edit button to image
    mButton('edit',async =>{imgEditor1(url);},cell,{position:'absolute'});
    return;

    let friendly = await mPromptGadgetFor(cell,'name',()=>clearCell(cell)); console.log('the name is',friendly);
    if (isEmpty(friendly)) return; // {mClear(cell);mStyle(cell,{opacity:0}); return;}

    let cats = await mPromptGadgetFor(cell,'categories',()=>clearCell(cell)); cats = extractWords(cats); assertion(isList(cats),`cats not a list!!!!!!! ${cats}`); console.log('the categories are',cats);
    if (isEmpty(friendly)) return; // {mClear(cell);mStyle(cell,{opacity:0}); return;}

    let filename = (isdef(M.superdi[friendly])?'i'+get_timestamp() : friendly) + '.png'; console.log('filename',filename);

		let dataUrl = await cropOrExpandImageAndGetDataUrl(url);
		let o = { image: dataUrl, coll:coll.name, path:filename };
		// let resp = await mPostRoute('postImage', o);	console.log('resp', resp); //sollte path enthalten!

    //jetzt hab ich das complete item und kann es zu coll adden!
    let key = stringBefore(filename,'.');
    let imgPath = `../assets/img/${coll.name}/${filename}`;
    let item = {friendly:friendly,img:imgPath,cats:cats,colls:[coll.name]};
    // resp = await collAddItem(coll,key,item);

    console.log('!!!would save image to',filename,'and add item',item,'to m.yaml');
  }
}
async function ondropShowImage_1_W(url,dDrop){
	//this time, I want 
	mClear(dDrop);
	let img = await imgAsync(dDrop,{hmax:300},{src:url});
	
	console.log('img dims',img.width,img.height); //works!!!
	//mDom(dDrop,)
	
	mStyle(dDrop,{w:img.width,h:img.height+30,align:'center'});
	mDom(dDrop,{fg:colorContrast(dDrop,['blue','lime','yellow'])},{className:'blink',html:'DONE! now click on where you think the image should be centered!'})
	console.log('DONE! now click on where you think the image should be centered!')

	img.onclick = storeMouseCoords;


}
async function ondropShowImage_1_W(url,dDrop){
  console.log('show dropped url', url, dDrop); //return;

	let img = await imgAsync(dDrop,{},{src:url});
	console.log('DONE!')

}
function openDivCenteredOnElement(divId, targetId) {
  const div = document.getElementById(divId);
  const target = document.getElementById(targetId);
  mIfNotRelative(target);

  // Get target element's position and size
  const rect = target.getBoundingClientRect();

  // Calculate center position
  const centerX = rect.left + (rect.width / 2) - (div.offsetWidth / 2);
  const centerY = rect.top + (rect.height / 2) - (div.offsetHeight / 2);

  // Apply calculated position to the div
  div.style.left = `${centerX}px`;
  div.style.top = `${centerY}px`;
  div.style.position = 'absolute';
  div.style.display = 'block'; // Make the div visible
}
async function promptForNameAndCats() {
	let friendly = await mPromptGadgetFor(cell, 'name', () => clearCell(cell)); console.log('the name is', friendly);
	if (isEmpty(friendly)) return; // {mClear(cell);mStyle(cell,{opacity:0}); return;}

	let cats = await mPromptGadgetFor(cell, 'categories', () => clearCell(cell)); cats = extractWords(cats); assertion(isList(cats), `cats not a list!!!!!!! ${cats}`); console.log('the categories are', cats);
	if (isEmpty(friendly)) return; // {mClear(cell);mStyle(cell,{opacity:0}); return;}

	let filename = (isdef(M.superdi[friendly]) ? 'i' + get_timestamp() : friendly) + '.png'; console.log('filename', filename);

	let dataUrl = await cropOrExpandImageAndGetDataUrl(url);
	let o = { image: dataUrl, coll: coll.name, path: filename };
	// let resp = await mPostRoute('postImage', o);	console.log('resp', resp); //sollte path enthalten!

	//jetzt hab ich das complete item und kann es zu coll adden!
	let key = stringBefore(filename, '.');
	let imgPath = `../assets/img/${coll.name}/${filename}`;
	let item = { friendly: friendly, img: imgPath, cats: cats, colls: [coll.name] };
	// resp = await collAddItem(coll,key,item);

	console.log('!!!would save image to', filename, 'and add item', item, 'to m.yaml');

}
async function showUrlInCanvas(dParent,src){
  return new Promise((resolve, reject) => {
    let d=dParent; //mDom(dParent);
    const img = new Image();
    img.onload = () => {
      const canvas = mDom(d,{},{tag:'canvas'});
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img,0,0); //, 0, 0, scaledWidth, scaledHeight);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
async function showUrlInCanvasInDiv(dParent,src,sz=300){
  return new Promise((resolve, reject) => {
    let d=mDom(dParent);
    const img = new Image();
    img.onload = () => {
      let scale = sz/img.height;
      let [w0,h0,w,h]=[img.width,img.height,scale*img.width,scale*img.height]
      const canvas = mDom(d,{w:w,h:h},{tag:'canvas'});
      canvas.width = w; // img.width*300/img.height;
      canvas.height = h; //300; // img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img,0,0,w0,h0,0,0,w,h); //, 0, 0, scaledWidth, scaledHeight);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
async function showUrlResizedToMin(dParent, src, szmin) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate the scale to ensure the smaller side is 300px
      const scale = szmin / Math.min(img.width, img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Create a canvas and set its width and height
      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      // Draw the image onto the canvas with the new size
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

      // Resolve the promise with the canvas
      mAppend(dParent, canvas);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
async function serverdataConfigUrl(){
	Serverdata = await mGetRoute('session'); //console.log(Serverdata); 
	let url = Serverdata.config.url; //`../assets/img/animals/bird/bird13.png`; // Serverdata.config.url; //console.log('url',url)
	return url;
}
function setNewCenterOverlay(d, x, y) {
  console.log('d',d)
  UI.mouseCoords = { x, y };
  mIfNotRelative(d);
  let sz = 10;
  if (isdef(UI.mouseMarker)) { UI.mouseMarker.remove(); }
  let d1 = UI.mouseMarker = mDom(d, { rounding: '50%', position: 'absolute', left: x-sz/10, top: y-sz/2, w: sz, h: sz, bg: 'white' }, {})
  let rect = getRect(d,d); 

  //rechne aus wie weit ist x von 0 entfernt?
  let leftSide = x;
  let rightSide = rect.w-x;
  let radx=Math.floor(Math.min(leftSide,rightSide));
  let topSide = y;
  let bottomSide = rect.h-y;
  let rady=Math.floor(Math.min(topSide,bottomSide));
  let rad=Math.min(radx,rady);

  console.log('rect',rect,'center',x,y,'rad',rad);
  //draw a rectangle of radius rad around center point!
  let ov=mDom(d,{position:'absolute',w:rad*2,h:rad*2,box:true,bg:'#ffffff80',left:x-rad,top:y-rad},{className:'no_events'});



}
function storeMouseCoords(ev){
	let img=ev.target;
	let d=img.parentNode;

	let c=UI.mouseCoords = getMouseCoordinatesRelativeToElement(ev,d);
	mIfNotRelative(d)
	let sz=10;
	if (isdef(UI.mouseMarker)){
		UI.mouseMarker.remove();
	}
	let d1 = UI.mouseMarker = mDom(d,{rounding:'50%',position:'absolute',left:c.x,top:c.y,w:sz,h:sz,bg:'white'},{})

	//img soll als 300x300 around center gespeichert werden
	
	
	//outline rectangle!
	//kleinere seite
	let [small,big]=[img.width>img.height?img.height:img.width,img.width<img.height?img.height:img.width];
	//let _scale = small<300?
	let [w,h]=[Math.min(300,img.width),Math.min(300,img.h)];


	let rect=mDom(d,{border:'red',position:'absolute',top:c.x-100,hL},{});

	//modifyInstruction on d
	let d2=d.children[1];
	d2.innerHTML = ''; //drag centerpoint around until you like the outline of your image';
	mButton('Done',ev=>{



	});


}






