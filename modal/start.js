onload = start;

async function start() { test3(); }

async function test3(){

	function mModalInput(name,styles={}){
		let d=document.body;
		let dialog = mDom(d, {}, { className:'reset', tag: 'dialog', id: `modal_${name}` });
		addKeys({ position: 'fixed', top: 40, left: 0, display: 'inline-block', padding: 12, box: true },styles)
		let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
		let inp = mDom(form, { outline: 'none' }, { name: name, tag: 'input', type: 'text', placeholder: `<${name}>` });
		mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
		async function prompt(){
			return new Promise((resolve, reject) => {
				// const form = dialog.getElementsByTagName('form')[0];
				// const inp = dialog.getElementsByTagName('input')[0];
				console.log('form', form);
				dialog.showModal();
				form.onsubmit = (event) => {
					console.log('submitting!')
					event.preventDefault(); // Prevent the default form submission
					resolve(inp.value);
					dialog.close();
				};
			});
		}
		return prompt;
	}
	let gadget = mModalInput('username');
	let res = await gadget();
	console.log('username is',res)


}
async function test2(){

	function mModalInput(name,styles={}){
		let d=document.body;
		let dia = mDom(d, {}, { tag: 'dialog', id: `modal_${name}` });
		addKeys({ position: 'fixed', top: 40, left: 0, display: 'inline-block', padding: 12, box: true },styles)
		let form = mDom(dia, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
		mDom(form, { outline: 'none' }, { name: name, tag: 'input', type: 'text', placeholder: `<${name}>` });
		mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
		return dia;
	}
	async function mPromptModalInput(dialog){
		return new Promise((resolve, reject) => {
			const form = dialog.getElementsByTagName('form')[0];
			const inp = dialog.getElementsByTagName('input')[0];
			console.log('form', form);
			dialog.showModal();
			form.onsubmit = (event) => {
				console.log('submitting!')
				event.preventDefault(); // Prevent the default form submission
				resolve(inp.value);
				dialog.close();
			};
		});
	}
	let dialog = mModalInput('username');
	let res = await mPromptModalInput(dialog);
	console.log('username is',res)


}
async function test1() {
	function openModal() { let m = document.querySelector('dialog'); mBy('modal1').showModal(); }
	function closeModal() { let m = document.querySelector('dialog'); mBy('modal1').close(); }
	function getModalValue() { let m = document.querySelector('dialog'); let inp = m.getElementsByTagName('input')[0]; return inp.value; }
	function popModalValue() { let m = document.querySelector('dialog'); let inp = m.getElementsByTagName('input')[0]; let res = inp.value; inp.value = ''; return res; }
	async function handleFormSubmission() {
		try {
			const formData = await openFormDialog();
			console.log('Form data:', formData);
			// Process form data here
		} catch (error) {
			console.error('Form submission was canceled or failed', error);
		}
	}
	function openFormDialog() {
		return new Promise((resolve, reject) => {
			const dialog = document.getElementById('modal1');
			const form = dialog.getElementsByTagName('form')[0];
			console.log('form', form);

			// Show the dialog
			dialog.showModal();

			// Event listener for form submission
			form.onsubmit = (event) => {

				console.log('submitting!')
				event.preventDefault(); // Prevent the default form submission

				// Collect form data if needed
				const formData = new FormData(form); //damit das funktioniert muessen alle inputs 'name' attribute haben!!!
				const formProps = Object.fromEntries(formData);

				console.log('formData', formData); //,mBy('inp_modal1').value)

				// Resolve the promise with form data
				resolve(formProps);

				// Close the dialog
				dialog.close();
			};

			// Optional: Handle the dialog cancellation or close event
			dialog.addEventListener('cancel', () => {
				reject(new Error('Form was canceled'));
			});

			// Optional: Cleanup the event listeners when dialog is closed
			dialog.onclose = () => {
				form.onsubmit = null; // Remove form submit listener
				dialog.removeEventListener('cancel', reject); // Remove cancel listener
			};
		});
	}

	let body = document.body;
	mClear(body);
	let d = mDiv(body);
	mButton('Open', openModal, d);
	// let dia=mDom(d,{w100:true,bg:'transparent',border:'none'},{tag:'dialog'});
	let dia = mDom(d, {}, { tag: 'dialog', id: 'modal1' });
	//dia.addEventListener('close',popModalValue)

	let form = mDom(dia, { position: 'fixed', top: 40, left: 0, display: 'inline-block', padding: 12, box: true }, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	//form.onsubmit=popModalValue;
	//form.addEventListener('submit',popModalValue)
	// mDom(d1,{},{html:'enter username:'})
	mDom(form, { outline: 'none' }, { name: 'inp1', tag: 'input', type: 'text', placeholder: '<username>' });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	// mButton('Close',closeModal,d1);
	//openModal();
	let res = await openFormDialog();
	console.log('res', res)
}
async function test0() {
	let body = document.body;
	mClear(body);
	let d = mDiv(body);
	d.innerHTML = `
			<button data-open-modal onclick='openModal()'>Open</button>
			<dialog data-modal style='border:none;background:transparent;width:100%;'>
				<div style="position:'fixed';top:40px;left:0;background:silver;display:inline-block;padding:12px;box-sizing:border-box">
					<div>enter color:</div>
					<input type="text"><br>
					<button data-close-modal onclick='closeModal()'>Close</button>
				</div>
			</dialog>
		`;
}

















