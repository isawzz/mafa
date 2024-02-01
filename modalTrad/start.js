onload=start;

async function start(){test0();}

function openModal(modal,overlay){	mStyle(modal,{display:'block'});	overlay.classList.add('open');}
function closeModal(modal,overlay){	mStyle(modal,{display:'none'});	overlay.classList.remove('open');}

async function test2(){
	let body=document.body;
	body.innerHTML='';
	let d=mDom(body,{},{});
	let overlay = mDom(body,{},{className:'overlay'});
	let modal = mDom(d,{display:'none'});
	mButton('Close',()=>closeModal(modal,overlay),modal)
	mButton('Open',()=>openModal(modal,overlay),d)
}
async function test1(){
	let body=document.body;
	body.innerHTML='';
	let d=mDom(body,{},{});
	let overlay = mDom(body,{},{id:'dModal',className:'overlay'});
	let modal = mDom(body,{w:200,h:200,bg:'blue'},{id:'dOverlay',className:'modal'});
	mButton('Close',()=>closeModal(modal,overlay),modal)
	mButton('Open',()=>openModal(modal,overlay),d)
}
async function test0(){
	let bOpen = document.querySelector('[data-open-modal]');
	let bClose = document.querySelector('[data-close-modal]');
	let modal = document.querySelector('[data-modal]');
	let overlay = document.querySelector('[data-overlay]');

	bOpen.addEventListener('click',()=>{
		modal.classList.add('open');
		overlay.classList.add('open');
	})
	bClose.addEventListener('click',()=>{
		modal.classList.remove('open');
		overlay.classList.remove('open');
	});
}




















