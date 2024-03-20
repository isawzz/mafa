
async function onclickAsAvatar(ev){
	let item = UI.selectedImages[0];
	console.log('item',item)
	let o=collKeyCollnameFromSelkey(item);
	let key = o.key;
	let m=M.superdi[key];
	U.avatar=key;
	let res = await postUserChange(U);
	console.log('res',res)
}
function showAvatar(dParent,sz){
	
}









