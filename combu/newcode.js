//=>integrate with allfhuge.js
function collectCats(di) {
	let cats = [];
	for (const k in di) di[k].cats.map(x => addIf(cats, x));
	return cats;
}
function mDropZone(dropZone) {
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
async function mGetFiles(server, dir) {
	let data = await mGetJsonCors(`${server}/filenames?directory=${dir}`);
	return data.files;
}
async function mGetJsonCors(url) {
	let res = await fetch(url, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors' // Set CORS mode to enable cross-origin requests
	});
	let json = await res.json();
	console.log('json', json)
	return json;
}
