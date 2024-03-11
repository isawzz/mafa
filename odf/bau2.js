
function inpToChecklist(ev, grid) {
	let key = ev.key;
	if (key != ',' && key != 'Enter') return;

	console.log('key', key); //return;

	let inp = ev.target;
	let words = extractWords(inp.value).map(x => x.toLowerCase());
	console.log('words', words);

	let checklist=Array.from(grid.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
	let allNames = checklist.map(x => x.name);
	let names = checklist.filter(x => x.checked).map(x => x.name);

	//console.log('names',allNames,names);
	// let needToSortChildren = false;
	for (const w of words) {
		if (!allNames.includes(w)) {
			//add this word to the options
			console.log('a new name!', w);
			//how do I add another checkbox?
			let div = mCheckbox(grid, w);
			div.firstChild.checked = true;
			needToSortChildren = true;

		} else {
			console.log('got it:', w);
			let chk = checklist.find(x => x.name == w);
			if (!chk.checked) chk.checked = true;

		}
	}

	// if (needToSortChildren) {
	// 	//rearrange grid elements!
	// 	let divs = arrChildren(grid);
	// 	divs.map(x=>x.remove())
	// 	// grid.innerHTML = '';
	// 	//sort divs by name
	// 	divs=sortByFunc(divs, x => x.firstChild.name);
	// 	//remove all divs from grid
	// 	for (const d of divs) { mAppend(grid, d) }
	// }


	sortCheckboxes(grid);
	words.sort();
	inp.value = words.join(', ');

}
function sortCheckboxes(grid){
	let divs = arrChildren(grid);
	divs.map(x=>x.remove());

	let chyes=divs.filter(x=>x.firstChild.checked == true);
	let chno=divs.filter(x=>!chyes.includes(x));

	chyes=sortByFunc(chyes, x => x.firstChild.name);
	chno=sortByFunc(chno, x => x.firstChild.name);
	for (const d of chyes) { mAppend(grid, d) }
	for (const d of chno) { mAppend(grid, d) }
	// grid.innerHTML = '';
	//sort divs by name
	//divs=sortByFunc(divs, x => x.firstChild.name);
	//remove all divs from grid
	// for (const d of divs) { mAppend(grid, d) }
}
function checkToInput(ev, inp, grid) {
	let el = ev.target;

	console.log(ev);
	console.log(ev.target['checked']);
	console.log(ev.target.checked);
	console.log(el.checked)
	let val = el.checked;
	let name = el.name;
	console.log(val, name)

	let words = extractWords(inp.value).map(x => x.toLowerCase());
	console.log('words', words);

	if (val && !words.includes(name)) {
		words.push(name);
		words.sort();
		inp.value = words.join(', ');
	} else if (!val && words.includes(name)) {
		removeInPlace(words, name);
		inp.value = words.join(', ');
	}

	sortCheckboxes(grid);
}










