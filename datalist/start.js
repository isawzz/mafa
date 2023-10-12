onload = start

async function start() { test1(); }

function test1() {
	let html = `
		<input class='input' list="options" id="inputField" placeholder="Type here and press Enter">
		<datalist id="options"></datalist>
		`;
	mBy('dMain').innerHTML = html;
	initInput();
}
function initInput() {
	const inputField = document.getElementById('inputField');
	const datalist = document.getElementById('options');

	inputField.addEventListener('keyup', function (event) {
		if (event.key === 'Enter') {
			const option = document.createElement('option');
			option.value = inputField.value;
			datalist.appendChild(option);
			inputField.value = ''; // Clear the input field after adding the option
		}
	});


}