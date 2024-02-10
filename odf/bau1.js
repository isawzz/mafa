
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
async function collShowImageInCell(cell,src){
  mStyle(cell, { opacity: 1 });
  mClass(cell, 'magnifiable');

  //will ich jetzt awaitable!
  let img = mDom(cell, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img' });
  await loadImageAsync(src,img);

  return img;

}
function getMouseCoordinatesRelativeToElement(ev, elem) {
  // Get the bounding rectangle of the element
  if (nundef(elem)) elem = ev.target;
  const rect = elem.getBoundingClientRect();

  // Calculate the click's coordinates relative to the element
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;

  return { x, y };
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
function extractWords(s){  let parts = splitAtAnyOf(s,' ,-'); return parts; }
async function cropOrExpandImageAndGetDataUrl(imageSrc) {
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

function presentImageCropper(url){
	let d=mDom('dMain',{position:'absolute',h:500,w:500,bg:'navy'});
	let img = mDom(d, { w: 300, h: 300, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: url });
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

async function postImage(img,path){
  let dataUrl = imgToDataUrl(img);
  let o = { image: dataUrl, path:path };
  let resp = await mPostRoute('postImage', o);
  console.log('resp', resp); //sollte path enthalten!
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

function clearParent(ev) { mClear(ev.target.parentNode); }
function collClosePrimary() { let d = iDiv(UI.collPrimary); mClear(d); UI.collPrimary.isOpen = false; }
function collCloseSecondary() {
  let d = iDiv(UI.collSecondary);
  mClear(d);
  mStyle(d, { w: 0, wmin: 0 });
  UI.collSecondary.isOpen = false;

}
async function onclickNewCollection(name) {
  if (nundef(name)) name = await mPrompt(UI.gadgetNewCollection);
  UI.collSecondary.name = name;
  collOpenPrimary(6, 4);
  collOpenSecondary(1, 2);
}
function collSidebar() {

  mStyle('dLeft', { wmin: 100 });
  let d = mDom('dLeft', { margin: 10, matop: 100 }); //,fg:getThemeFg()});

  //let c1=mDom(d,{padding:4},{html:'new collection',className:'nav-link'})
  let c1 = UI.newCollection = mCommand(d, 'newCollection', 'New Collection');

  UI.gadgetNewCollection = mGadget('newCollection', { left: 16, top: 160 }, { placeholder: `<enter name>` });
}

