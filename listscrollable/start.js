onload = start;

async function start() { test1(); }

async function test1() {

	let n = 125; let list = generateRandomWords(n); list.sort();

	let items = [];
	let dg = mDom(document.body)
	for (const i of range(n)) {
		let name = list[i];
		let di = mDom(dg, { display: 'inline-block' });
		let chk = mDom(di, {}, { tag: 'input', type: 'checkbox', id: `chk${i}` });
		let label = mDom(di, {}, { tag: 'label', html: name, for: chk.id });
		mNewline(dg);
		let item = { name: name, el: di, w: mGetStyle(di, 'w'), h: mGetStyle(di, 'h') };
		items.push(item);
	}

	let wmax = 0, hmax = 0;
	items.forEach(x => {
		if (x.w > wmax) wmax = x.w;
		if (x.h > hmax) hmax = x.h;
	});
	console.log('szmax', wmax, hmax)


	//w 500 und hmax 510
	mStyle(dg, { wmax: (wmax) * 4 })
	createItemsGrid(dg, items, 500, 3);



	// let d=mDom(document.body,{opacity:.5})
	// measureText


	// let [w,h]=[400,400];
	// let d = clearBodyDiv({w:w,h:h});


	//

}
async function test0() {
	// const words = generate['Hello', 'World', 'This', 'Is', 'A', 'Simple', 'Test', 'Of', 'The', 'Grid'];
	// const d = document.getElementById('wordsGridContainer');

	let [w, h] = [400, 400];
	let d = clearBodyDiv({ w: w, h: h });

	let n = 125;
	let list = generateRandomWords(n); list.sort();

	createWordsGrid(d, list, h, 2);

}