
async function simpleOnDroppedUrl(src, sisi) {

	let sz = 400;
	let dPopup = mDom(document.body, { position: 'fixed', top: 40, left: 0, wmin: sz, hmin: sz, bg: 'pink' });
	let dParent=mDom(dPopup);
	let canvas=createPanZoomCanvas(dParent, src, sz, sz);
  mStyle(canvas,{border:'red'})
  mLinebreak(dParent)
  //mButton('save', ()=>savePanZoomCanvas(canvas), dParent,{},'button');

	let dinp = mDom(dPopup, { padding: 10, align: 'right', display: 'inline-block' })
	mDom(dinp, { display: 'inline-block' }, { html: 'Name: ' });
	let inpFriendly = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'friendly', tag: 'input', type: 'text', placeholder: `<enter name>` });
	let defaultName = '';
	let iDefault = 1;
	let k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`);
	while (isdef(k)) { iDefault++; k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`); }
	defaultName = `${sisi.name}${iDefault}`;
	inpFriendly.value = defaultName;
	mDom(dinp, { h: 1 });
	mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
	let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });

	// mLinebreak(dinp);
	// let ta = mDom(dinp,{w:sz},{tag:'textarea',rows:10,value:''})

	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('cancel', () => dPopup.remove(), db2, { w: 70 }, 'input');
	mButton('OK', () => simpleFinishEditing(canvas, dPopup, inpFriendly, inpCats, sisi), db2, { w: 70 }, 'input');





}
async function rest(){
	let m = await imgMeasure(src); console.log('simpleOnDroppedUrl!!! sz', m);
	let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 400];
	let dPopup = mDom(document.body, { position: 'fixed', top: 40, left: 0, wmin: sz + 80, hmin: sz + 80, bg: 'pink' });
	let d = mDom(dPopup); //, wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });

	mIfNotRelative(d);

	let zoom = 1;


	mStyle(img, { h: sz });
	
	mAppend(d, img);
	let [w0, h0] = [img.width, img.height];
	let dc = mDom(d, { position: 'absolute', left: (w0 - sz) / 2, top: (h0 - sz) / 2, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;
	let db1 = mDom(dPopup, { bg: 'red', padding: 10, display: 'flex', gap: 10, 'justify-content': 'center' });
	
	mButton('restart', () => imgReset(img, dc, sz, w0, h0), db1, { w: 70 }, 'input');
	mButton('squish', () => imgSquish(img, dc, sz), db1, { w: 70 }, 'input');
	mButton('expand', () => imgExpand(img, dc, sz), db1, { w: 70 }, 'input');
	mButton('zoom out', () => imgZoomOut(img, dc, sz,wOrig, hOrig), db1, { w: 70 }, 'input');
	mButton('zoom in', () => imgZoomIn(img, dc, sz), db1, { w: 70 }, 'input');
	
	let dinp = mDom(dPopup, { padding: 10, align: 'right', display: 'inline-block' })
	mDom(dinp, { display: 'inline-block' }, { html: 'Name: ' });
	let inpFriendly = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'friendly', tag: 'input', type: 'text', placeholder: `<enter name>` });
	let defaultName = '';
	let iDefault = 1;
	let k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`);
	while (isdef(k)) { iDefault++; k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`); }
	defaultName = `${sisi.name}${iDefault}`;
	inpFriendly.value = defaultName;
	mDom(dinp, { h: 1 });
	mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
	let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });
	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('cancel', () => dPopup.remove(), db2, { w: 70 }, 'input');
	mButton('OK', () => simpleFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, sisi), db2, { w: 70 }, 'input');
}









