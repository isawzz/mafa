onload = start;

async function start() { test1(); }

function openModal(){let m=document.querySelector('dialog');m.showModal();}
function closeModal(){let m=document.querySelector('dialog');m.close();}
function getModalValue(){let m=document.querySelector('dialog');let inp=m.getElementsByTagName('input')[0];return inp.value;}
function popModalValue(){let m=document.querySelector('dialog');let inp=m.getElementsByTagName('input')[0];let res= inp.value;inp.value='';return res;}

async function test1(){
	let body=document.body;
	mClear(body);
	let d=mDiv(body);
	mButton('Open',openModal,d);
	let dia=mDom(d,{w100:true,bg:'transparent',border:'none'},{tag:'dialog'});
	let d1=mDom(dia,{position:'fixed',top:40,left:0,display:'inline-block',padding:12,box:true},{tag:'form',method:'dialog'});
	// mDom(d1,{},{html:'enter username:'})
	mDom(d1,{},{tag:'input',type:'text',placeholder:'<username>'});
	mDom(d1,{},{tag:'input',type:'submit'});
	// mButton('Close',closeModal,d1);

}

async function test0(){
	let body=document.body;
	mClear(body);
	let d=mDiv(body);
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

















