onload = start

async function start() { test3(); }

function test3(){
	let d=mBy('dImage');
	mAutocomplete(d,['hallo', 'das', 'ist']);
	return;
	d.innerHTML = `
			<input list=languages>
			<datalist id=languages>
			<option value="English"></option>
			<option value="Dutch"></option>
			</datalist>	
		`;
}

function mAutocomplete(dParent,list) {
  let form = mCreateFrom(`
    <form class='form' autocomplete="off" action="javascript:void(0);">
      <div class="autocomplete" style="width: 200px">
        <input id="myInput" type="text" name="myCity" placeholder="..." onclick="select()" />
      </div>
      <input style="margin-left:-15px" type="submit" value="Go!" />
    </form>
  `  );
  form.onsubmit = () => {
    let c = mBy('myInput').value.toLowerCase();
    let o = Geo.cities[c];
    if (nundef(o)) { c = toUmlaut(c); o = Geo.cities[c]; }
    console.log('c', c);
    let center = o.center;
    M.map.flyTo(center, M.map.getZoom(), { animate: false })
  }
  let d = mAppend(dParent, form);
  autocomplete('myInput', list);
}


async function test2(){
	let html = `
		<div class="editable-select-container">
		<input type="text" id="editable-select" class="editable-select-input">
		<ul id="editable-select-options" class="editable-select-options">
				<!-- Options will be dynamically added here -->
		</ul>
		</div>
	`;
	let d1 = mDiv('dImage');
	d1.innerHTML = html;

	var inputField = document.getElementById('editable-select');
	var optionsList = document.getElementById('editable-select-options');
	var options = ['Option 1', 'Option 2', 'Option 3']; // Initial options
	
	// Function to populate options
	function populateOptions() {
			optionsList.innerHTML = '';
			options.forEach(function(option) {
					var li = document.createElement('li');
					li.textContent = option;
					li.addEventListener('click', function() {
							inputField.value = option;
							optionsList.style.display = 'none';
					});
					optionsList.appendChild(li);
			});
	}
	
	// Event listeners
	inputField.addEventListener('input', function() {
			var filterValue = inputField.value.toLowerCase();
			var filteredOptions = options.filter(function(option) {
					return option.toLowerCase().includes(filterValue);
			});
			populateOptions(filteredOptions);
			optionsList.style.display = 'block';
	});
	
	// Initial population of options
	populateOptions();
	
	// Close options on click outside the container
	document.addEventListener('click', function(event) {
			if (!event.target.closest('.editable-select-container')) {
					optionsList.style.display = 'none';
			}
	});
	
}

function populateOptions___(optionsList, inputField, options) {
	optionsList.innerHTML = '';
	options.forEach(function (option) {
		var li = document.createElement('li');
		li.textContent = option;
		li.addEventListener('click', function () {
			inputField.value = option;
			optionsList.style.display = 'none';
		});
		optionsList.appendChild(li);
	});
}
function mSelectEditable(d, options) {
	let html = `
		<div class="editable-select-container">
		<input type="text" id="editable-select" class="editable-select-input">
		<ul id="editable-select-options" class="editable-select-options">
				<!-- Options will be dynamically added here -->
		</ul>
		</div>
	`;
	let d1 = mDiv(d);
	d1.innerHTML = html;
	var inputField = document.getElementById('editable-select');
	console.log('inputField',inputField)
	console.log('d1',d1)
// 	setTimeout(weiter,10);
// }
// function weiter(){
	var optionsList = document.getElementById('editable-select-options');
	var options = ['Option 1', 'Option 2', 'Option 3']; // Initial options

	inputField.addEventListener('input', function () {
		//let inp=mBy("editable-select")
		var filterValue = inputField.value.toLowerCase();
		var filteredOptions = options.filter(function (option) {
			return option.toLowerCase().includes(filterValue);
		});
		populateOptions(optionsList, inputField, filteredOptions);
		optionsList.style.display = 'block';
	});

	populateOptions(optionsList, inputField, options);

	// Close options on click outside the container
	document.addEventListener('click', function (event) {
		if (!event.target.closest('.editable-select-container')) {
			optionsList.style.display = 'none';
		}
	});


}
async function test1() {
	M = await mGetYaml('../assets/m.yaml');
	let cats = collectCats(M); console.log('cats', cats); cats.sort(); //return;
	let d = mBy('dImage'); mFlex(d);

	mSelectEditable(d, ['hallo', 'das', 'ist'])
}
function mSelect1() {

	// let d1 = mDom(d,{},{tag:'select'});	for(const c of cats){mDom(d1,{},{tag:'option',value:c,innerHTML:c})};return;


	let s = `
		<div class="combobox">
			<div>
				<select id=MandatoryBenefits onchange="this.nextElementSibling.value=this.value" required>
					<option value="" selected>Select ...</option>
					<option value="Pension">Pension %</option>
					<option value="Medical">Medical %</option>
					<option value="Unemployment">Unemployment %</option>
					<option value="Injury">Injury %</option>
					<option value="Maternity">Maternity %</option>
					<option value="Serious Illness">Serious Illness %</option>
					<option value="Housing Fund">Housing Fund %</option>
				</select>
				<input type="text" value="" onchange="this.previousElementSibling.selectedIndex=0"
						oninput="this.previousElementSibling.options[0].value=this.value; this.previousElementSibling.options[0].innerHTML=this.value" />
			</div>
		</div>		`;

	let html = `
		<select id="mySelect">
		<option value="option1">Option 1</option>
		<option value="option2">Option 2</option>
		<!-- Other predefined options -->
		</select>		
		`;
	let dSelect = mDom(d, {}, { html: s }); //mSelect(d,['hallo','das','ist'])


	return;
	let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' });
	mDropZone(dDrop);


	let dForm = mForm(d, [{ tag: 'select', label: 'Category', options: cats }, 'Name'], { align: 'right', margin: 'auto' }); //transform:'translateY(30%)'})
}
function collectCats(di) {
	let cats = [];
	for (const k in di) di[k].cats.map(x => addIf(cats, x));
	return cats;
}
function mSelect(dParent, listOfOptions = [], styles = [], opts = {}) {
	dParent = toElem(dParent);
	addKeys({ tag: 'select' }, opts);
	let dSelect = mDom(dParent, styles, opts);
	for (const o of listOfOptions) {
		if (isString(o)) {
			let dOption = mDom(dSelect, {}, { tag: 'options', value: o });
		}
	}
	return dSelect;
}
function mForm(dParent, listOfInputs = [], styles = {}, opts = {}) {
	dParent = toElem(dParent);
	addKeys({ tag: 'form' }, opts);
	let dForm = mDom(dParent, styles, opts);
	for (const o of listOfInputs) {
		if (isString(o)) {
			let dLabel = mDom(dForm, {}, { tag: 'span', html: o + ':' });
			mDom(dForm, {}, { tag: 'br' });
			let dInput = mDom(dForm, {}, { tag: 'input', name: o, type: 'text' });
			mDom(dForm, {}, { tag: 'br' });
			mDom(dForm, {}, { tag: 'br' });
		} else {
			addKeys({ tag: 'input', type: 'text', html: valf(o.label, 'value') }, o);
			if (isdef(o.label)) {
				let dLabel = mDom(dForm, {}, { tag: 'span', html: o.label + ':' });
				mDom(dForm, {}, { tag: 'br' });
			}
			if (o.tag == 'select') {
				let d = mSelect(dForm, o.options);
			} else {
				let d = mDom(dForm, {}, { tag: 'input', name: o.html, type: o.type });
			}
			mDom(dForm, {}, { tag: 'br' });
			mDom(dForm, {}, { tag: 'br' });
		}
	}
	// 	<form>
	// 	<span>Category:</span><br>
	// 	<input type="text" id="category" name="category" placeholder="Enter category"><br><br>
	// 	<span>Name:</span><br>
	// 	<input type="text" id="name" name="name" placeholder="Enter name">
	// </form>
	return dForm;
}
function test0_addToCollection() {
	const dropZone = document.getElementById('dropZone');

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

			reader.onload = function (e) {
				const img = new Image();
				img.src = e.target.result;
				img.height = 300;
				img.alt = 'Dropped Image';
				dropZone.innerHTML = '';
				dropZone.appendChild(img);
			};

			reader.readAsDataURL(files[0]);
		}
	});
}