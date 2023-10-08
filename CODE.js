

//#region factory
function fetchFilenamesLocalhost(dir) {
	const directory = dir;
	if (!directory) {
		alert('Please enter a directory name.');
		return;
	}

	// Fetch filenames based on the user-entered directory
	fetch(`http://localhost:3000/filenames?directory=${directory}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors' // Set CORS mode to enable cross-origin requests
	})
		.then(response => response.json())
		.then(data => {
			return data;
		})
		.catch(error => console.error('Error:', error));
}
function fromOpenai() {
	const filenamesList = document.getElementById('filenames-list');
	const directoryInput = document.getElementById('directory-input');
	const fetchButton = document.getElementById('fetch-button');

	// Function to fetch filenames from the server and display them in the list
	const fetchFilenames = () => {
		const directory = directoryInput.value;
		if (!directory) {
			alert('Please enter a directory name.');
			return;
		}

		// Fetch filenames based on the user-entered directory
		fetch(`http://localhost:3000/filenames?directory=${directory}`)
			.then(response => response.json())
			.then(data => {
				filenamesList.innerHTML = ''; // Clear previous list
				data.files.forEach(filename => {
					const listItem = document.createElement('li');
					listItem.textContent = filename;
					filenamesList.appendChild(listItem);
				});
			})
			.catch(error => console.error('Error:', error));
	};

	fetchButton.addEventListener('click', fetchFilenames);

}
//#endregion
