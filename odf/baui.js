async function ondropShowImage(url,dDrop){
	mClear(dDrop);
	let img = await imgAsync(dDrop,{hmax:300},{src:url});
	
	console.log('img dims',img.width,img.height); //works!!!

	//I just want to determine the new center point!
	//image should be cropped to a square!
	//1. set the center: 
	//2. set the radiusX radiusY: default is 150,150
	//3. 

	
	mStyle(dDrop,{w:img.width,h:img.height+30,align:'center'});
	mDom(dDrop,{fg:colorContrast(dDrop,['blue','lime','yellow'])},{className:'blink',html:'DONE! now click on where you think the image should be centered!'})
	console.log('DONE! now click on where you think the image should be centered!')

	img.onclick = storeMouseCoords;


}



function clearBodyDiv(styles = {}) { document.body.innerHTML = ''; return mDom(document.body, styles) }


async function ondropSaveUrl(url) {
	console.log('save dropped url to config:', url);
	Serverdata.config = mPostRoute('postConfig', { url: url });
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
function storeMouseCoords(ev){
	let d=ev.target.parentNode;

	let c=UI.mouseCoords = getMouseCoordinatesRelativeToElement(ev,d);
	mIfNotRelative(d)
	let sz=10;
	let d1 = UI.mouseMarker = mDom(d,{rounding:'50%',position:'absolute',left:c.x,top:c.y,w:sz,h:sz,bg:'white'},{})
	//modifyInstruction on d
	let d2=d.children[1];
	d2.innerHTML = 'drag centerpoint around until you like the outline of your image';


}
function colorContrast(dDrop,list=['white','black']){
	let bg = mGetStyle(dDrop,'bg');return bestContrastingColor(bg,list);
}
async function ondropShowImage_1_W(url,dDrop){
  console.log('show dropped url', url, dDrop); //return;

	let img = await imgAsync(dDrop,{},{src:url});
	console.log('DONE!')

}

//async function imgAsync(dParent, src) { let img = mDom(dParent, {}, { tag: 'img' }); await loadImageAsync(src, img); return img; }

function enableImageDrop(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border; // Store the original border style to restore it later

	elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping

	// Restore the original border and call the callback function when an image is dropped
	elem.addEventListener('drop', function (event) {
		event.preventDefault(); // Prevent the browser's default file open behavior
		elem.style.border = originalBorderStyle; // Restore the original border style

		const files = event.dataTransfer.files; // Get the files that were dropped
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = evReader => {
				onDropCallback(evReader.target.result, elem);
			};
			reader.readAsDataURL(files[0]);
		}
	});
}
function enableImageDrop_trial1_W(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border; // Store the original border style to restore it later

	elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping

	// Restore the original border and call the callback function when an image is dropped
	elem.addEventListener('drop', function (event) {
		event.preventDefault(); // Prevent the browser's default file open behavior
		elem.style.border = originalBorderStyle; // Restore the original border style

		const files = event.dataTransfer.files; // Get the files that were dropped
		if (files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) { // Check if the dropped file is an image
				onDropCallback(file); // Call the provided callback function with the image file
			}
		}
	});
}

function mDropZone1(dropZone, onDrop) {
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



















