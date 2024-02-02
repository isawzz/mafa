function mModalInput(name,styles={}){
  let d=document.body;
  let dialog = mDom(d, {w100:true}, { className:'reset', tag: 'dialog', id: `modal_${name}` });
  //addKeys({ position: 'fixed', top: 40, left: 0, display: 'inline-block', padding: 12, box: true },styles)
  addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true },styles)
  let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
  let inp = mDom(form, { outline: 'none' }, { name: name, tag: 'input', type: 'text', placeholder: `<${name}>` });
  mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
  async function prompt(){
    return new Promise((resolve, reject) => {
      console.log('form', form);
      dialog.showModal();
      form.onsubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission
        resolve(inp.value);
        dialog.remove(); //close();
      };
    });
  }
  return prompt;
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
