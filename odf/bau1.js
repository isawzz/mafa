// create a dialog element with an input inside
function createDialog() {
  // create a dialog element
  let dialog = document.createElement("dialog");
  // set some style attributes
  dialog.style.width = "300px";
  dialog.style.height = "200px";
  dialog.style.border = "solid black 2px";
  dialog.style.backgroundColor = "white";
  // create an input element
  let input = document.createElement("input");
  // set some style attributes
  input.style.width = "80%";
  input.style.margin = "20px";
  input.style.padding = "10px";
  input.style.border = "solid gray 1px";
  // append the input to the dialog
  dialog.appendChild(input);
  // return the dialog element
  return dialog;
}

// open the dialog as a modal dialog in the top left corner of the parent div
function openDialog(parent) {

	// let dialog = createDialog();
  let dialog = document.createElement("dialog");

	parent.appendChild(dialog);

	// position the dialog in the top left corner of the parent
  dialog.style.position = "absolute";
  dialog.style.top = "0";
  dialog.style.left = "0";
  // show the dialog as a modal
  dialog.showModal();
}


async function mModal(placeholder='') {
  return new Promise((resolve, reject) => {
		let m=mDom(document.body,{},{tag:'modal'});
		let inp = mInput(m, { w: 100 }, 'inpPrompt', placeholder, 'input', 1);
    inp.focus();
    inp.onkeyup = ev => {
      if (ev.key == 'Enter' || ev.key == 'Escape') {
        let val = ev.target.value;
				resolve(val);
      }
    };
		m.showModal();
  });
}
async function mPrompt(dParent = 'dUser', placeholder = '<username>', cond = isAlphanumeric) {
  return new Promise((resolve, reject) => {
    mClear(dParent)
    let d = mInput(dParent, { w: 100 }, 'inpPrompt', placeholder, 'input', 1);
    d.focus();
    d.onkeyup = ev => {
      if (ev.key == 'Enter') {
        let val = ev.target.value;
        ev.target.remove();
        if (cond(val)) {
          resolve(val.toLowerCase().trim());
        } else {
          console.log('not a valid input => null');
          resolve(null);
        }
      } else if (ev.key == 'Escape') {
        resolve(null);
      }
    };
  });
}
