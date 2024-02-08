
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
  mStyle(grid,{bg:'#00000030'})
  mDropZoneX(grid, ondropImage);


  mButtonX(d, collCloseSecondary); //, 'tr', 25, color = 'white')
  //mButtonX(d,30);
}
function mDropZoneX(dropZone, onDrop) {
  dropZone.setAttribute('allowDrop',true)
  dropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #007bff';
  });
  dropZone.addEventListener('dragleave', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
  });
  dropZone.addEventListener('drop', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = evReader => {
        onDrop(event,evReader);
      };
      reader.readAsDataURL(files[0]);
    }
  });
  return dropZone;
}
function collAddItem(coll,item){
  console.log('adding',item,'to collection',coll)
}
async function ondropImage(evDrop, evReader) {
  //console.log('evReader',evReader); return;
  let [url,dropTarget,dDrop,item] = [evReader.target.result,evDrop.target,evToAttrElem(evDrop,'allowDrop').elem,UI.draggedItem];

  console.log(dropTarget,dDrop,item); //return;
  UI.draggedItem = null;

  let coll = UI.collSecondary;

  if (isdef(item)){
    //user dragged from an item on the page
    collAddItem(coll,item);
  }else{
    //resize
    //hier muss ich ein superdi item generaten!
    //brauch eigentlich ein prompt! mit multiple zeug drin!
    //item name (=friendly)=>wird auch fuer key verwendet!
    //cats: ideally aus liste auswaehlbar multiple!
    item = {}
  }
  //jetzt muss ich das ding in eine cell reingeben!
  //wie find ich eine freie cell?
  let cell = coll.cells.find(x=>mGetStyle(x,'opacity')==0);
  console.log('free cell',cell);
  if (isdef(cell)) {
    mStyle(cell, { opacity: 1 });
    mClass(cell,'magnifiable')
    console.log('item',item)
    showImageInBatch(item.key, cell);
  }


}
function muellrest(){

  return;
  // console.log('dropped url',url,'key',key, 'dDrop',dDrop); //url sind die data!
  console.log('key',key, 'dDrop',ev.target); //url sind die data! dDrop ist ein fileReader!
  let d=evToAttrElem(ev,'allowDrop')
  console.log('d',d.elem);
  //dDrop kann auch ein opacity 0 cell sein!
  if (isdef(key)) {
    let o = M.superdi[key];
    UI.imgColl.value = o.cats[0];
    UI.imgName.value = o.friendly;
  }
  let dParent = UI.dDrop;
  let dButtons = UI.dButtons;
  let dTool = UI.dTool;
  dParent.innerHTML = '';
  dButtons.innerHTML = '';
  dTool.innerHTML = '';
  let img = UI.img = mDom(dParent, {}, { tag: 'img', src: url });
  img.onload = async () => {
    img.onload = null;
    UI.img_orig = new Image(img.offsetWidth, img.offsetHeight);
    UI.url = url;
    let tool = UI.cropper = mCropResizePan(dParent, img);
    addToolX(tool, dTool)
    mDom(dButtons, { w: 120 }, { tag: 'button', html: 'Upload', onclick: onclickUpload, className: 'input' })
    mButton('Restart', () => ondropPreviewImage(url), dButtons, { w: 120, maleft: 12 }, 'input');
  }
}

function clearParent(ev){mClear(ev.target.parentNode);}
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
  collOpenSecondary(6, 3); 
}
function collSidebar() {

  mStyle('dLeft', { wmin: 100 });
  let d = mDom('dLeft', { margin: 10, matop: 100 }); //,fg:getThemeFg()});

  //let c1=mDom(d,{padding:4},{html:'new collection',className:'nav-link'})
  let c1 = UI.newCollection = mCommand(d, 'newCollection', 'New Collection');

  UI.gadgetNewCollection = mGadget('newCollection',{left:16,top:160},{placeholder:`<enter name>`});
}

