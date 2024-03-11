
function createWordsGrid(dParent, words, maxHeight, numColumns) {

	// Create the grid container
	const grid = document.createElement('div');
	grid.classList.add('grid-container');
	grid.style.maxHeight = `${maxHeight}px`;
	grid.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;

	// Fill the grid with words
	words.forEach(word => {
		const item = document.createElement('div');
		item.classList.add('grid-item');
		item.textContent = word;
		grid.appendChild(item);
	});

	// Clear previous content and add the new grid
	dParent.innerHTML = '';
	dParent.appendChild(grid);
}
function createItemsGrid(dParent, items, maxHeight, numColumns) {

	// Create the grid container
	const grid = document.createElement('div');
	grid.classList.add('grid-container');
	grid.style.maxHeight = `${maxHeight}px`;
	grid.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;

	items.forEach(item => mAppend(grid,iDiv(item)));

	// Clear previous content and add the new grid
	dParent.innerHTML = '';
	dParent.appendChild(grid);
}


function uiGadgetTypeDoubleList(form, dict, styles = {}, opts = {}) {







	let select = DA.select = mDom(form, styles, { className: 'input', tag: 'select' });
	//console.log('dict',dict);
	if (isList(dict)) dict = list2dict(dict);
	mDom(select, {}, { tag: 'option', html: '' });

	//console.log('dict',dict)
	for (const k in dict) {
		let [content, val] = [k, dict[k]];
		mDom(select, {}, { tag: 'option', html: content, value: val });
	}
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	select.addEventListener('change', () => form.submit());
	return () => { console.log('selected', DA.select, DA.select.value); return DA.select.value; }
}
