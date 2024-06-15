
async function onclickEditDetails(){
	let key = UI.selectedImages[0];
	let cmd = UI.commands.simpleNew;
	await editDetailsFor(key,iDiv(cmd));
}
async function editDetailsFor(key,anchor){

	let details = detailsForKey(key);
	let di = detailsPresentDict(details); //console.log('details',key,di,isEmpty(di))

	let result = await mGather(anchor,{},{content:di,type:'multiText',title:M.superdi[key].friendly});

	//console.log('result',result);
	if (!result) return;
	//jetzt brauch ich echt ein updateDetails!!!!
	let res = await updateDetails(result,key);
	//console.log('res',res)
	//M.details[key]=res;
	//das object ist complete
	//return result;
}










