async function test0_addToCollection() {
	let emos = M.emos = await mGetYaml('../assets/m.yaml');
	let cats = M.cats = collectCats(emos); cats.sort(); //console.log('cats', cats); 

	let d = mDom('dMain');
	mFlexWrap(d);
	let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop, ondropPreviewImage);

	let dForm = mDom(d, { padding: 12 }, { tag: 'form', onsubmit: ev => event.preventDefault() });

	mDom(dForm, {}, { html: 'Category:' }); let dl = mDatalist(dForm, cats);
	mDom(dForm, {}, { html: 'Name:' }); let inpName = mDom(dForm, {}, { tag: 'input', name: 'imgname', type: 'text', className: 'input', placeholder: "<enter value>" });
	mDom(dForm, { h: 10 })
	mDom(dForm, { w: 120 }, { tag: 'input', type: 'submit', className: 'input' })
	dForm.onsubmit = ev => { 
		return false; } //ev.preventDefault(); onclickUpload(ev); }

	// dForm.onsubmit = function(ev) {
	// 	console.log('haaaaaaaaaaaaaaaallloo')
	//   ev.preventDefault(); // Prevent form submission and page reload

	//   // // Get form data as JSON
	//   // var formData = new FormData(myForm);
	//   // var formDataJSON = {};
	//   // formData.forEach(function(value, key) {
	//   //     formDataJSON[key] = value;
	//   // });

	//   // Send form data via AJAX
	//   var xhr = new XMLHttpRequest();
	//   xhr.open('POST', 'your-api-endpoint', true);
	//   xhr.setRequestHeader('Content-Type', 'application/json');
	//   xhr.onreadystatechange = function() {
	//       if (xhr.readyState === 4 && xhr.status === 200) {
	//           // Handle the AJAX response here
	//           console.log(xhr.responseText);
	//       }
	//   };
	//   xhr.send(JSON.stringify(formDataJSON));
	// };


	//mClass(dDrop, 'previewContainer');
	UI.dDrop = dDrop;
	UI.dForm = dForm;
	UI.dButtons = mDom(dForm, { display: 'inline-block' });
	UI.imgCat = dl.inpElem;
	UI.imgName = inpName;

}
