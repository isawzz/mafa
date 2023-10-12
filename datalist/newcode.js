
function autocomplete(inp, arr) {
  var currentFocus;
  inp = toElem(inp);
  inp.addEventListener('input', e => {
		let inp = e.target;
    let a, b, i, val = inp.value;
    console.log('val',val)
    autocomplete_closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    a = document.createElement('DIV');
    a.setAttribute('id', inp.id + 'autocomplete-list');
    a.setAttribute('class', 'autocomplete-items');
    inp.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement('DIV');
        b.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>';
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener('click', e => {
          inp.value = document.getElementsByTagName('input')[0].value;
          autocomplete_closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  inp.addEventListener('keydown', e => {
    var x = document.getElementById(this.id + 'autocomplete-list');
    if (x) x = x.getElementsByTagName('div');
    if (e.keyCode == 40) {
      currentFocus++;
      autocomplete_addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      autocomplete_addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  inp.addEventListener('dblclick', e => { evNoBubble(e); });
  document.addEventListener('click', e => {
    autocomplete_closeAllLists(e.target);
  });
}
function autocomplete_addActive(x) {
  if (!x) return false;
  autocomplete_removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = x.length - 1;
  x[currentFocus].classList.add('autocomplete-active');
}
function autocomplete_closeAllLists(elmnt) {
  var x = document.getElementsByClassName('autocomplete-items');
  for (var i = 0; i < x.length; i++) {
    if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
function autocomplete_removeActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove('autocomplete-active');
  }
}






//=>integrate with allfhuge.js
function mDropZone(dropZone){
	//const dropZone = document.getElementById('dropZone');

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

	return dropZone;
}
async function mGetFiles(server,dir){
	let data = await mGetJsonCors(`${server}/filenames?directory=${dir}`);
	return data.files;
}
async function mGetJsonCors(url){
	let res = await fetch(url, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors' // Set CORS mode to enable cross-origin requests
	});
	let json = await res.json();
	console.log('json',json)
	return json;
}
