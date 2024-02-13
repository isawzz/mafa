function clearBodyDiv(styles = {},opts={}) { document.body.innerHTML = ''; return mDom(document.body, styles, opts) }
function clearCell(cell){mClear(cell);mStyle(cell,{opacity:0});}
function clearParent(ev) { mClear(ev.target.parentNode); }
async function collAddItem(coll, key, item) {
  console.log('adding', key,item, 'to collection', coll);
  if (nundef(M.superdi[key])){
    //need to add to superdi and save superdi!
    M.superdi[key] = item;
    let res = await mPostRoute('postNewItem', {key:key,item:item});
    console.log('<=server:',res);
  }
  for (const cat of item.cats) lookupAddIfToList(M.byCat, [cat], key);
  for (const coll of item.colls) lookupAddIfToList(M.byCollection, [coll], key);
  lookupAddIfToList(M.byFriendly, [item.friendly], key)
  M.categories = Object.keys(M.byCat); M.categories.sort();
	M.collections = Object.keys(M.byCollection); M.collections.sort();
	M.names = Object.keys(M.byFriendly); M.names.sort();


}
function collClear() { closeLeftSidebar(); clearMain(); }
function collClosePrimary() { let d = iDiv(UI.collPrimary); mClear(d); UI.collPrimary.isOpen = false; }
function collCloseSecondary() {
  let d = iDiv(UI.collSecondary);
  mClear(d);
  mStyle(d, { w: 0, wmin: 0 });
  UI.collSecondary.isOpen = false;

}
function collFilterImages(ev) {
	let id = evToId(ev); console.log('id', id)
	let coll = UI[id];
	let s = ev.target.value.toLowerCase().trim();
	console.log('filter on', s)
	if (isEmpty(s)) return;
	let di = {};
	for (const k of coll.masterKeys) { di[k] = true; }
	let list = isdef(M.byCat[s]) ? M.byCat[s].filter(x => isdef(di[x])) : [];
	if (nundef(list) || isEmpty(list)) {
		list = [];
		for (const k of coll.masterKeys) {
			let o = M.superdi[k];
			if (k.includes(s) || o.friendly.includes(s)) list.push(k);
		}
		//if (isEmpty(list)) return;
	}
	coll.keys = list;
	coll.index = 0;
	showImageBatch(coll, 0, false);
}
function collFindEmptyCell(coll){
  let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
  //console.log('free cell', cell);
  if (nundef(cell)){
    coll.index++;
    coll.cells.map(x=>{mClear(x);mStyle(x,{opacity:0});});
    cell=coll.cells[0];
  }
  return cell;
}
function collInitCollection(name, coll) {
	let list = [];
	if (name == 'all' || isEmpty(name)) {
		list = Object.keys(M.superdi);
	} else if (isdef(M.byCollection[name])) {
		list = M.byCollection[name];
	} else list=[]; //return;
	if (coll == UI.collPrimary) localStorage.setItem('collection', name)
	let dMenu = coll.dMenu;
	mClear(dMenu);
	let d=mDom(dMenu);mFlexV(d);
	mDom(d, { fz:24,weight:'bold' }, { html: 'Collection:' });
	let colls = M.collections;
	// mDom(dMenu, {}, { html: '' });


	let dlColl = mDatalist(d, colls, { placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value, coll);
	dlColl.inpElem.value = name;


	coll.masterKeys = list;
	let cats = collectCats(list);
	cats.sort();
	d=mDom(dMenu);mFlexV(d);
	let wLabel=coll.cols<6?117:'auto';
	mDom(d, { fz:24,weight:'bold',w:wLabel,align:'right' }, { html: 'Filter:' });
	// mDom(d, {  }, { html: '<h2>Filter:</h2>' });
	let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>" });
	dlCat.inpElem.oninput = collFilterImages;

	//let wButtons=coll.w<650?'100%':'auto'; // mDom(dMenu,{h:1,w100:true})
	d=mDom(dMenu,{gap:10,align:'right'});
	if (coll.cols<6) mStyle(d,{w100:true}); //?true:false
	mButton('prev', onclickPrev, d, { w: 70, margin: 0 }, 'input');
	mButton('next', onclickNext, d, { w: 70, margin: 0, maleft:10 }, 'input');
	coll.keys = list;
	coll.index = 0;
	showImageBatch(coll);
	//showDiv(dMenu); return;
}
function collOpenPrimary(rows, cols) { collPresent(UI.collPrimary, rows, cols); UI.collPrimary.isOpen = true; }
function collOpenSecondary(rows, cols) {
  let coll = UI.collSecondary;
  let d = iDiv(coll);
  mStyle(d, { wmin: 450 });
  collPresent(coll, rows, cols);
  coll.isOpen = true;
  coll.dInstruction.innerHTML = '* drag images into the shaded area *'
  let grid = coll.grid;
  mStyle(grid, { bg: '#00000030' })
  mDropZoneX(grid, ondropImage);


  mButtonX(d, collCloseSecondary); //, 'tr', 25, color = 'white')
  //mButtonX(d,30);
}
function collPresent(coll, rows,cols) {
	let d1=iDiv(coll);

	mClear(d1);
	let w=coll.w=140*cols;
	mStyle(d1,{wmax:w,w:w})
	let dMenu = coll.dMenu = mDom(d1, {padding:12,wmax:w,w:w}, { className: 'title' });
	mFlexVWrap(dMenu); 
	mStyle(dMenu, { gap: 10 });

	// mDom(d1,{w100:true,h:1});
	let dInstruction = coll.dInstruction = mDom(d1, { align: 'center', fg: getThemeFg() }, { html: '* press Control key when hovering to magnify image! *' })
	// mDom(d1,{w100:true,h:1});

	//coll = uiTypeCollection(5,6,)
	coll.rows = rows; coll.cols = cols;
	coll.grid = mGrid(coll.rows, coll.cols, d1, { 'align-self': 'start' });
	coll.cells = [];
	let bg = mGetStyle('dNav', 'bg');
	for (let i = 0; i < coll.rows * coll.cols; i++) {
		let d = mDom(coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		coll.cells.push(d);
	}
	mStyle(dInstruction, { w: mGetStyle(coll.grid, 'w') });

	collInitCollection(coll.name, coll);
}
async function collShowImageInCell(cell,src){
  mStyle(cell, { opacity: 1 });
  mClass(cell, 'magnifiable');

  //will ich jetzt awaitable!
  let img = mDom(cell, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img' });
  await loadImageAsync(src,img);

  return img;

}
function collSidebar() {

  mStyle('dLeft', { wmin: 100 });
  let d = mDom('dLeft', { margin: 10, matop: 100 }); //,fg:getThemeFg()});

  //let c1=mDom(d,{padding:4},{html:'new collection',className:'nav-link'})
  let c1 = UI.newCollection = mCommand(d, 'newCollection', 'New Collection');

  UI.gadgetNewCollection = mGadget('newCollection', { left: 16, top: 160 }, { placeholder: `<enter name>` });
}
function colorContrast(dDrop,list=['white','black']){
	let bg = mGetStyle(dDrop,'bg');return bestContrastingColor(bg,list);
}
async function cropOrExpandImageAndGetDataUrl_trial1_W(imageSrc) {
  return new Promise((resolve, reject) => {
    // Create an image object
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
    img.onload = () => {
      // Canvas setup
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;

      // Determine scaling needed to "cover" 300x300
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Calculate the center position
      const dx = (canvas.width - scaledWidth) / 2;
      const dy = (canvas.height - scaledHeight) / 2;

      // Draw the image centered and covering
      ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);

      // Get the data URL of the canvas
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    };
    img.onerror = (error) => reject(error);

    // Set the source of the image
    img.src = imageSrc;
  });
}
async function cropOrExpandImageAndGetDataUrl(imageSrc,x,y) {
  return new Promise((resolve, reject) => {
    // Create an image object
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
    img.onload = () => {
      // Canvas setup
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;

      // Determine scaling needed to "cover" 300x300
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Calculate the center position
      const dx = isdef(x)?x*scale : (canvas.width - scaledWidth) / 2;
      const dy = isdef(y)?y*scale :(canvas.height - scaledHeight) / 2;

      // Draw the image centered and covering
      ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);

      // Get the data URL of the canvas
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    };
    img.onerror = (error) => reject(error);

    // Set the source of the image
    img.src = imageSrc;
  });
}
function createScaledCanvasFromImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate the scale to ensure the smaller side is 300px
      const scale = 300 / Math.min(img.width, img.height);
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
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
function enableImageDrop(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border; // Store the original border style to restore it later

	elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping

	// Restore the original border and call the callback function when an image is dropped
	elem.addEventListener('drop', function (event) {
		event.preventDefault(); // Prevent the browser's default file open behavior
		elem.style.border = originalBorderStyle; // Restore the original border style

		const files = event.dataTransfer.files; // Get the files that were dropped
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = evReader => {
				onDropCallback(evReader.target.result, elem);
			};
			reader.readAsDataURL(files[0]);
		}
	});
}
function enableImageDrop_trial1_W(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border; // Store the original border style to restore it later

	elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping

	// Restore the original border and call the callback function when an image is dropped
	elem.addEventListener('drop', function (event) {
		event.preventDefault(); // Prevent the browser's default file open behavior
		elem.style.border = originalBorderStyle; // Restore the original border style

		const files = event.dataTransfer.files; // Get the files that were dropped
		if (files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) { // Check if the dropped file is an image
				onDropCallback(file); // Call the provided callback function with the image file
			}
		}
	});
}
function extractWords(s){  let parts = splitAtAnyOf(s,' ,-'); return parts; }
function getMouseCoordinatesRelativeToElement(ev, elem) {
  // Get the bounding rectangle of the element
  if (nundef(elem)) elem = ev.target;
  const rect = elem.getBoundingClientRect();

  // Calculate the click's coordinates relative to the element
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;

  return { x, y };
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
function mDropZone1(dropZone, onDrop) {
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
async function mPromptGadgetFor(cell,placeholderName,onCancel){
  let rect=getRect(cell); //,document.body);
  console.log('rect',rect)
  let gadget = mGadget(placeholderName,{padding:0,position:'absolute',left:rect.l,top:rect.t+rect.h});
  console.log('gadget',gadget);

  if (isdef(onCancel)){
    let dia=gadget.dialog;
    mButton('Cancel',onCancel,dia);
    dia.oncancel = onCancel;
  }
  let res = await mPrompt(gadget);
  return res;

}
async function onclickCollections() {

  let dPanes = mDom('dMain'); mFlex(dPanes);
  let dSecondary = mDom(dPanes, { wmin: 0, w: 0 }, { id: 'collSecondary', className: 'translow' }); //mFlexWrap(dPlus);
  let dPrimary = mDom(dPanes, {}, { id: 'collPrimary' }); //mFlexWrap(d1);

  collSidebar();

  let collName = localStorage.getItem('collection');
  if (nundef(collName) || !M.collections.includes(collName)) collName = 'animals'

  UI.collPrimary = { div: dPrimary, name: collName }; //{name:'amanda'};
  UI.collSecondary = { div: dSecondary, name: null };
  collOpenPrimary(5, 6);
}
async function onclickNewCollection(name) {
  if (nundef(name)) name = await mPrompt(UI.gadgetNewCollection);
  UI.collSecondary.name = name;
  collOpenPrimary(6, 4);
  collOpenSecondary(1, 2);
}
async function onclickNext(ev) { 
  let id = evToId(ev); console.log('id',id)
	let coll = UI[id];
  showImageBatch(coll,1); 
}
async function onclickPrev(ev) { 
  let id = evToId(ev); console.log('id',id)
	let coll = UI[id];
  showImageBatch(coll,-1); 
}
async function ondropSaveUrl(url) {
	console.log('save dropped url to config:', url);
	Serverdata.config = mPostRoute('postConfig', { url: url });
}
async function ondropShowImage(url,dDrop){
	mClear(dDrop);
	let img = await imgAsync(dDrop,{hmax:300},{src:url});
	
	console.log('img dims',img.width,img.height); //works!!!

	mStyle(dDrop,{w:img.width,h:img.height+30,align:'center'});
	mDom(dDrop,{fg:colorContrast(dDrop,['blue','lime','yellow'])},{className:'blink',html:'DONE! now click on where you think the image should be centered!'})
	console.log('DONE! now click on where you think the image should be centered!')

	img.onclick = storeMouseCoords;
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
async function ondropShowImage_1_W(url,dDrop){
  console.log('show dropped url', url, dDrop); //return;

	let img = await imgAsync(dDrop,{},{src:url});
	console.log('DONE!')

}
async function postImage(img,path){
  let dataUrl = imgToDataUrl(img);
  let o = { image: dataUrl, path:path };
  let resp = await mPostRoute('postImage', o);
  console.log('resp', resp); //sollte path enthalten!
}
function presentImageCropper(url){
	let d=mDom('dMain',{position:'absolute',h:500,w:500,bg:'navy'});
	let img = mDom(d, { w: 300, h: 300, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: url });
}
function showDiv(d){mStyle(d,{bg:rColor()}); console.log(d,mGetStyle(d,'w')); }
function showImageBatch(coll,inc = 0,alertEmpty=false) {
  let [keys, index, numCells] = [coll.keys, coll.index, coll.rows * coll.cols];
  if (isEmpty(keys) && alertEmpty) showMessage('nothing has been added to this collection yet!'); 
  if (keys.length <= numCells) inc = 0;
  index += numCells * inc; if (index >= keys.length) index = 0; else if (index < 0) index += keys.length;
  let list = arrTakeFromTo(keys, index, index + numCells);
  coll.index = index;
  for (let i = 0; i < list.length; i++) {
    let d=coll.cells[i];
    mStyle(d, { opacity: 1 });
    mClass(d,'magnifiable')
    showImageInBatch(list[i], d);
  }
  for (let i = list.length; i < numCells; i++) {
    mStyle(coll.cells[i], { opacity: 0 })
  }
}
function showImageInBatch(key, dParent, styles = {}) {
  let o = M.superdi[key]; o.key=key; //console.log('o',o)
  addKeys({ bg: rColor() }, styles);
  mClear(dParent);
  [w, h] = [dParent.offsetWidth, dParent.offsetHeight];
  let [sz, fz] = [.9 * w, .8 * h];
  let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
  mCenterCenterFlex(d1)
  let el = null;
  if (isdef(o.img)) {
    if (o.cats.includes('card')) {
      el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
      mDom(d1, { h: 1, w: '100%' })
    } else {
      el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
    }
  }
  else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
  else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
  else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
  else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
  assertion(el, 'PROBLEM mit' + key);
	el.ondragstart = ()=>UI.draggedItem=o;
  let label = mDom(d1, { fz: 11 }, { html: key, className: 'ellipsis' }); //,w:'100%'
  mStyle(d1, { cursor: 'pointer' });
  d1.onclick = onclickItem;
  d1.setAttribute('key', key)
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




















