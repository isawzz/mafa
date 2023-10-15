onload = start

async function start() { test2(); }

async function test2() {

	let html = `
		<input list="options1" class='datalistInput' id="input1" placeholder="Type here and press Enter">
		<datalist id="options1" class='datalist'></datalist>
		`;
	mBy('dMain').innerHTML = html;
	const inp = document.getElementById('input1');
	const datalist = document.getElementById('options1');
	for(const w of ['a','d','f','s']){
		mDom(datalist, {}, { tag: 'option', value: w });
	}
	inp.addEventListener('keyup', ev=> {
		if (ev.key === 'Enter') {
			let inp = ev.target;
			let dl = mBy('options1');
			let val = inp.value.toLowerCase();
			inp.value = ''; // Clear the input field after adding the option
			//if (M.cats.includes(val)) return;
			const option = document.createElement('option');
			option.value = val;
			//insert into datalist
			let i=0;
			for(const el of arrChildren(dl)){
				let v=el.value;
				console.log('v',v);
				if (v==val) {console.log('found val',v); break;}
				else if (v>val) {mInsertAt(dl,option,i); break;}
				i++;
			}
			//datalist.appendChild(option);
		}
	});
}

function mDatalist(dParent, list, allowEdit = true) {
	dParent = toElem(dParent);
	let d = mDom(dParent);
	let idOptions = getUID();
	let inp = mDom(d, {}, { tag: 'input', list: idOptions, placeholder: '<enter word>' });
	let datalist = mDom(d, {}, { tag: 'datalist', id: idOptions });
	for (const c of list) {
		mDom(datalist, {}, { tag: 'option', value: c });
	}
	if (allowEdit) {
		inp.addEventListener('keyup', ev=> {
			if (ev.key === 'Enter') {
				let val = inp.value.toLowerCase();
				inp.value = ''; // Clear the input field after adding the option
				let values = arrChildren(datalist).map(x=>x.value);
				console.log('values are',values);
				if (values.includes(val)) return;
				const option = document.createElement('option');
				option.value = val;
				datalist.appendChild(option);
			}
		});
	}
	return d;
}

async function test1() {

	let html = `
		<input list="options" id="inputField" placeholder="Type here and press Enter">
		<datalist id="options"></datalist>
		`;
	mBy('dMain').innerHTML = html;
	await populateDatalist();
	initInput();
}
function collectCats(di) {
	let cats = [];
	for (const k in di) di[k].cats.map(x => addIf(cats, x));
	return cats;
}
function initInput() {
	const inputField = document.getElementById('inputField');
	const datalist = document.getElementById('options');

	inputField.addEventListener('keyup', function (event) {
		if (event.key === 'Enter') {
			let val = inputField.value.toLowerCase();
			inputField.value = ''; // Clear the input field after adding the option
			if (M.cats.includes(val)) return;
			const option = document.createElement('option');
			option.value = val;
			datalist.appendChild(option);
		}
	});
}
async function populateDatalist() {
	let emos = M.emos = await mGetYaml('../assets/m.yaml');
	let cats = M.cats = collectCats(emos); console.log('cats', cats); cats.sort(); //return;
	const datalist = document.getElementById('options');
	for (const c of cats) {
		if (c.length < 2 || isNumber(c)) continue;
		mDom(datalist, {}, { tag: 'option', value: c });
	}
}
