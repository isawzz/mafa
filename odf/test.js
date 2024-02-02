async function test3_modal(){
	await prelimsFast();

	onclickUser();
}
async function test2_modal(){
	let gadget = UI.gadget; //mModalInput('username',{right:0,top:50});
	let res = await mPrompt(gadget);
	console.log('username is',res)

}
async function test1_modal(){

	let d=document.body;
	mClear(d);
	let d1=mDom(d,{position:'absolute',top:0,left:0,bg:'silver',w:300,h:200});
	openDialog(d1)

	//let res = await mModal('Enter username');
}
async function test0() {
	await prelimsFast();

	showNavbar();

	//jetzt brauch ich einen user!!!!
	//await switchToUser('felix')



}
