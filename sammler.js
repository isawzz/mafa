
async function collDeleteKey(key) {
	let item = M.superdi[key];
	assertion(isdef(item.img) && isdef(item.key), `superdi[${key}] cannot be deleted!!!!`);
	let path = item.img;
	let res = await mPostRoute('deleteImage', { path: item.img });
	console.log('res', res);

	//das mach ich jetzt anders
	res = await mPostRoute('deleteItem', { key: key });
	//wie wird M geladen? prelims?
	await loadAssets();

	//collections muessen neu initiated werden!

}
async function collDeleteOrRemove(k,collname,di,deletedKeys){
	let item = M.superdi[k];
	console.log('item', item)
	let colls = item.colls;
	console.log('colls',colls)
	assertion(colls.includes(collname),`item ${k} from coll ${collname} does not have ${collname} in colls!!!!!!`)
	if (colls.length == 1) {
		console.log('deleting',k,'!!!!!!!!!!!!');
		deletedKeys.push(k);
	}else if (isdef(item.img) && item.img.includes(`/${collname}/`)){
		removeInPlace(item.colls,collname);
		//move this img to other collname, create it if it does not exist!!!

		let olddir = collname;
		let newdir=item.colls[0];
		let filename = stringAfterLast(item.img,'/');
		//item.img=`../assets/img/${newdir}/`
		item.img = item.img.replace(olddir,newdir);

		let resp = await mPostRoute('moveImage',{olddir,newdir,filename});
		if (isdef(resp.newpath)) item.img = resp.newpath;
		console.log('moveImage:',resp)
		// needToRenameImgDir={oldname:collname,newname:newpath};

		//bei einem key den ich nicht delete! muss ich colls aendern!
		//console.log('item',item);
		// removeInPlace(item.colls,collname);
		di[k]=item;
	}else{
		//this pic cannot be deleted! also: the key cannot be deleted!!!
		//bei einem key den ich nicht delete! muss ich colls aendern!
		//console.log('item',item);
		removeInPlace(item.colls,collname);
		di[k]=item;
		//res = await mPostRoute('postUpdateItem', { key: k, item:item });
	}

}
async function onclickDeleteSelected() {
	let selist = UI.selectedImages;
	console.log('delete', selist); 

	//only items that do not belong to locked collection can be deleted
	//first check if this item can be deleted
	//collPreReload(collname);
	let di = {}, deletedKeys = {};

	for (const k of selist) {
		
		let o=collKeyCollnameFromSelkey(k);
		let key=o.key;
		let collname = o.collname;
		// console.log('item', item);
		// let coll = collFromElement(iDiv(item));
		// item.coll = coll;
		// assertion(coll, 'deleteSelected called outside of Collections!!!!!');
		// console.log('item', item.key, coll.name)
		// if (collLocked(coll.name)) continue; //item cannot be removed or deleted because collection locked
		// if (nundef(deletedKeys[coll.name])) deletedKeys[coll.name] = [];
		// await collDeleteOrRemove(item.key, coll.name, di, deletedKeys[coll.name]);
		
		if (collLocked(collname)) continue; // *** SAFETY CHECK!!!!! ***

		if (nundef(deletedKeys[collname])) deletedKeys[collname] = [];
		await collDeleteOrRemove(key, collname, di, deletedKeys[collname]);

	}

	//die deletedKeys da muss ich mir merken von welcher coll!!!!
	console.log('deletedKeys dict: ', deletedKeys);

	for (const k in deletedKeys) {
		let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: deletedKeys[k], collname: k });
		console.log('postUpdateSuperdi', k, res)
	}

	await loadAssets();
	collPostReload(); //	delete M.byCollection[collname];
	UI.selectedImages = [];

}
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
function mGadget(name, styles = {}, opts = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${name}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { name, dialog, form, inp }
}
function mGadgetList(namelist, styles = {}, opts = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });

	let inputs = {};
	for (const name of namelist) {
		let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${name}>`) });
		inputs[name] = inp;
	}
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { namelist, dialog, form, inputs }
}
function mGadget1(name, styles = {}, opts = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${name}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { name, dialog, form, inp }
}
function mGadgetYesNo(question, styles = {}, opts = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${question}` });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	//let form = mDom(dialog);
	let dq=mDom(form,{},{html:question});
	let bYes = mDom(form,{},{html:'Yes',tag:'button',onclick:()=>form.setAttribute('proceed','yes')})
	let bNo = mDom(form,{maleft:10},{html:'No',tag:'button',onclick:()=>form.setAttribute('proceed','no')})
	// let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: question, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${question}>`) });
	// mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { name: question, dialog, form, bYes, bNo }
}
async function mGather1(dAnchor,label='name'){
	//open a 1 text gadget that anchors to UI.newCollection command div
	let d=dAnchor;
	let rect=getRect(d);
	let gadget = mGadget(label, { padding:0, maleft:8, left: rect.l, top: rect.b });//, { placeholder: `<enter name>` });
	//console.log(gadget)
	let result = await mPrompt(gadget);
	return result;
}
async function mGatherYesNo(dAnchor,label){
	//open a 1 text gadget that anchors to UI.newCollection command div
	let d=dAnchor;
	let rect=getRect(d);
	let gadget = mGadgetYesNo(label, { bg:'white',padding:10, maleft:8, left: rect.l, top: rect.b });//, { placeholder: `<enter name>` });
	//console.log(gadget)
	let result = await mPromptYesNo(gadget);
	return result;
}
async function mPromptGadgetFor(cell, placeholderName, onCancel) {
	let rect = getRect(cell); //,document.body);
	console.log('rect', rect)
	let gadget = mGadget(placeholderName, { padding: 0, position: 'absolute', left: rect.l, top: rect.t + rect.h });
	console.log('gadget', gadget);

	if (isdef(onCancel)) {
		let dia = gadget.dialog;
		mButton('Cancel', onCancel, dia);
		dia.oncancel = onCancel;
	}
	let res = await mPrompt(gadget);
	return res;

}
async function mPrompt(gadget) {
	return new Promise((resolve, reject) => {
		//console.log('form', gadget.form);
		gadget.dialog.showModal();
		//gadget.inp.focus();
		gadget.form.onsubmit = (event) => {
			event.preventDefault(); // Prevent the default form submission
			resolve(gadget.inp.value);
			gadget.inp.value = '';
			gadget.dialog.close();
		};
	});
}
async function mPromptYesNo(gadget) {
	return new Promise((resolve, reject) => {
		//console.log('form', gadget.form);
		gadget.dialog.showModal();
		gadget.bNo.focus();
		//gadget.inp.focus();
		gadget.form.onsubmit = (event) => {
			event.preventDefault(); // Prevent the default form submission
			let data=gadget.form.getAttribute('proceed'); //new FormData(gadget.form);
			//console.log('data',data)
			resolve(data=='yes');
			//if (data) resolve(); else reject()
			//gadget.inp.value = '';
			gadget.dialog.close();
		};
	});
}
function mStyle(elem, styles, unit = 'px') {
  elem = toElem(elem);
  if (isdef(styles.whrest)) { delete styles.whrest; styles.w = styles.h = 'rest'; } else if (isdef(styles.wh100)) { styles.w = styles.h = '100%'; delete styles.wh100; }
  if (isdef(styles.w100)) styles.w = '100%'; else if (isdef(styles.wrest)) styles.w = 'rest';
  if (isdef(styles.h100)) styles.h = '100%'; else if (isdef(styles.hrest)) styles.h = 'rest';
  let dParent = elem.parentNode;
  if (isdef(dParent)) {
    //console.log('dParent',dParent)
    let pad = dParent && isdef(dParent.style.padding) ? parseInt(dParent.style.padding) : 0;
    let rp = getRect(dParent);
    let r = getRect(elem, dParent);
    if (styles.w == 'rest') {
      let left = r.l;
      let w = rp.w;
      let wrest = w - left - pad;
      styles.w = wrest;
    }
    if (styles.h == 'rest') {
      let r1 = getRect(dParent.lastChild, dParent);
      let hrest = rp.h - (r1.y) - pad;
      styles.h = hrest;
    }
  }
  let bg, fg;
  if (isdef(styles.bg) || isdef(styles.fg)) {
    [bg, fg] = colorsFromBFA(styles.bg, styles.fg, styles.alpha);
  }
  if (isdef(styles.vpadding) || isdef(styles.hpadding)) {
    styles.padding = valf(styles.vpadding, 0) + unit + ' ' + valf(styles.hpadding, 0) + unit;
  }
  if (isdef(styles.vmargin) || isdef(styles.hmargin)) {
    styles.margin = valf(styles.vmargin, 0) + unit + ' ' + valf(styles.hmargin, 0) + unit;
    //console.log('margin should be',styles.margin)
  }
  if (isdef(styles.upperRounding) || isdef(styles.lowerRounding)) {
    let rtop = '' + valf(styles.upperRounding, 0) + unit;
    let rbot = '' + valf(styles.lowerRounding, 0) + unit;
    styles['border-radius'] = rtop + ' ' + rtop + ' ' + rbot + ' ' + rbot;
  }
  if (isdef(styles.box)) styles['box-sizing'] = 'border-box';
  if (isdef(styles.round)) styles['border-radius'] = '50%';
  for (const k in styles) {
    let val = styles[k];
    let key = k;
    if (isdef(STYLE_PARAMS[k])) key = STYLE_PARAMS[k];
    else if (k == 'font' && !isString(val)) {
      let fz = f.size; if (isNumber(fz)) fz = '' + fz + 'px';
      let ff = f.family;
      let fv = f.variant;
      let fw = isdef(f.bold) ? 'bold' : isdef(f.light) ? 'light' : f.weight;
      let fs = isdef(f.italic) ? 'italic' : f.style;
      if (nundef(fz) || nundef(ff)) return null;
      let s = fz + ' ' + ff;
      if (isdef(fw)) s = fw + ' ' + s;
      if (isdef(fv)) s = fv + ' ' + s;
      if (isdef(fs)) s = fs + ' ' + s;
      elem.style.setProperty(k, s);
      continue;
    } else if (k.includes('class')) {
      mClass(elem, styles[k]);
    } else if (k == 'border') {
      if (isNumber(val)) val = `solid ${val}px ${isdef(styles.fg) ? styles.fg : '#ffffff80'}`;
      if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
    } else if (k == 'ajcenter') {
      elem.style.setProperty('justify-content', 'center');
      elem.style.setProperty('align-items', 'center');
    } else if (k == 'layout') {
      if (val[0] == 'f') {
        val = val.slice(1);
        elem.style.setProperty('display', 'flex');
        elem.style.setProperty('flex-wrap', 'wrap');
        let hor, vert;
        if (val.length == 1) hor = vert = 'center';
        else {
          let di = { c: 'center', s: 'start', e: 'end' };
          hor = di[val[1]];
          vert = di[val[2]];
        }
        let justStyle = val[0] == 'v' ? vert : hor;
        let alignStyle = val[0] == 'v' ? hor : vert;
        elem.style.setProperty('justify-content', justStyle);
        elem.style.setProperty('align-items', alignStyle);
        switch (val[0]) {
          case 'v': elem.style.setProperty('flex-direction', 'column'); break;
          case 'h': elem.style.setProperty('flex-direction', 'row'); break;
        }
      } else if (val[0] == 'g') {
        val = val.slice(1);
        elem.style.setProperty('display', 'grid');
        let n = allNumbers(val);
        let cols = n[0];
        let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
        elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
        elem.style.setProperty('place-content', 'center');
      }
    } else if (k == 'layflex') {
      elem.style.setProperty('display', 'flex');
      elem.style.setProperty('flex', '0 1 auto');
      elem.style.setProperty('flex-wrap', 'wrap');
      if (val == 'v') { elem.style.setProperty('writing-mode', 'vertical-lr'); }
    } else if (k == 'laygrid') {
      elem.style.setProperty('display', 'grid');
      let n = allNumbers(val);
      let cols = n[0];
      let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
      elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
      elem.style.setProperty('place-content', 'center');
    }
    if (key == 'font-weight') { elem.style.setProperty(key, val); continue; }
    else if (key == 'background-color') elem.style.background = bg;
    else if (key == 'color') elem.style.color = fg;
    else if (key == 'opacity') elem.style.opacity = val;
    else if (key == 'wrap') { if (val == 'hard') elem.setAttribute('wrap', 'hard'); else elem.style.flexWrap = 'wrap'; }
    else if (k.startsWith('dir')) {
      isCol = val[0] == 'c';
      elem.style.setProperty('flex-direction', 'column');
    } else if (key == 'flex') {
      if (isNumber(val)) val = '' + val + ' 1 0%';
      elem.style.setProperty(key, makeUnitString(val, unit));
    } else {
      elem.style.setProperty(key, makeUnitString(val, unit));
    }
  }
}
async function onclickAdd() {
  showTitle('Add to Collections');
  let colls = M.collections;
  let d = mDom('dMain', { margin: 10 }); mFlexWrap(d);
  let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop, ondropPreviewImage);
  let dForm = mDom(d, { padding: 12 }, { tag: 'form', onsubmit: ev => { ev.preventDefault(); return false; } });
  mDom(dForm, {}, { html: 'Collection:' }); let dl = mDatalist(dForm, colls);
  mDom(dForm, { h: 10 })
  mDom(dForm, {}, { html: 'Name:' });
  let inpName = mDom(dForm, {}, { tag: 'input', name: 'imgname', type: 'text', value: '', className: 'input', placeholder: "<enter value>", autocomplete: "off" });
  mDom(dForm, { h: 10 })
  UI.dTool = mDom(dForm)
  UI.dDrop = dDrop; mClass(dDrop, 'previewContainer');
  UI.dForm = dForm;
  UI.dButtons = mDom(dTitle, { display: 'inline-block' });
  UI.imgColl = dl.inpElem;
  UI.imgName = inpName;
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






