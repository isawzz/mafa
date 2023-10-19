onload = start;

//const SERVERURL='http://216.250.112.218:4041';
const SERVERURL='http://localhost:4041';

function start() {
	const form = document.getElementById('uploadForm')
	form.addEventListener('submit', (e) => {
		e.preventDefault()
		send_files()
	})
	
}
async function send_files() {
	// Object 
	const myFiles = document.getElementById('myFiles').files;

	const formData = new FormData();

	Object.keys(myFiles).forEach(key => {
		formData.append(myFiles.item(key).name, myFiles.item(key));
	})

	const response = await fetch(SERVERURL + '/upload', {
		method: 'POST',
		body: formData
	});

	const json = await response.json();

	const h2 = document.querySelector('h2');
	h2.textContent = `Status: ${json?.status}`;

	const h3 = document.querySelector('h3');
	h3.textContent = json?.message;

	console.log(json);

}

