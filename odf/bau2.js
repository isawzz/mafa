
async function showTable(table) {
	//INTERRUPT:
	//clearEvents: 
	for (const k in TO) {clearTimeout(TO[k]);TO[k]=null;} 
	for (const k in ANIM) {if (isdef(ANIM[k])) ANIM[k].cancel();ANIM[k]=null;} 
	V={};

	//ensure table
	if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); } 
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	Clientdata.table = table; 

	//common to all views
	showTitle(`${table.friendly}`);
	let func = DA.funcs[table.game];
	mClear('dMain'); 
	let d = mDom('dMain',{w100:true,box:true,padding:12}); //, bg: '#00000080' }); mCenterFlex(d)
	//console.log('dims',getRectInt('dMain').w)
	[dOben, dOpenTable, dRechts] = tableLayoutMR(d);

	//main view
	let vid='main';
	let vmain = V[vid] = await func.presentTable(dOpenTable,table,getUname(),100);
	await func.presentStats(dOben,vid);
	mRise(d);

	//mini bot view bei solo game
	let rtop=getRect(d).t;
	mStyle(dRechts,{h:window.innerHeight-rtop}); //'100vh'});

	let dMini=mDom(dRechts,{position:'absolute',bottom:0,maleft:10,rounding:10,bg:'#000000a0',padding:10});
	let botname='gul';
	mDom(dMini,{align:'center',fg:'white',pabottom:4},{html:botname})
	V.x = await func.presentTable(dMini,table,botname,50);
	console.log(V.x)
	// mDom(dRechts,{bg:'green',wmin:100},{html:'hallo'})

	// //sample view of other player
	// let d=mDom('dMain',{w100:true,position:'relative',hmin:200});
	// let dd=mDom(d,{position:'absolute',hmin:100,wmin:200,right:0});
	// dd.innerHTML = 'HALLO'
	// V.x = await func.presentTable(dd,table,'gul',50);

}

function tableLayoutMR_colors(dParent) {
  clearElement(dParent);
	let d=mGrid(1,2,dParent);
	//let d=mDom(dParent,{w100:true,display:'grid'});
  //d.style.gridTemplateColumns = 2;
  let [dMiddle, dRechts] = [mDom(d,{bg:'blue'}),mDom(d,{bg:'green'})]; 
  //mCenterFlex(dMiddle, false);
  let dOben = mDom(dMiddle, {bg:'orange'}, {id:'dOben'});
  let dOpenTable = mDom(dMiddle, {bg:'yellow'}, {id:'dOpenTable'});
	return [dOben,dOpenTable,dRechts];
}
function tableLayoutMR(dParent) {
  clearElement(dParent);
	let d=mGrid(1,2,dParent);
	//let d=mDom(dParent,{w100:true,display:'grid'});
  //d.style.gridTemplateColumns = 2;
  let [dMiddle, dRechts] = [mDom(d),mDom(d)]; 
  //mCenterFlex(dMiddle, false);
  let dOben = mDom(dMiddle, {mabottom:10}, {id:'dOben'});
  let dOpenTable = mDom(dMiddle, {}, {id:'dOpenTable'});
	return [dOben,dOpenTable,dRechts];
}
function tlayout(dParent){
  let dSelections = mDiv(dOben, {}, 'dSelections');
  for (let i = 0; i <= 5; i++) { mDiv(dSelections, {}, `dSelections${i}`); }
  let dActions = mDiv(dOben, { w: '100%' });
  for (let i = 0; i <= 5; i++) { mDiv(dActions, { w: '100%' }, `dActions${i}`); }
  let dError = mDiv(dOben, { w: '100%', bg: 'red', fg: 'yellow', hpadding: 12, box: true }, 'dError');
  let dSubmitOrRestart = mDiv(dOben, { w: '100%' });
	mNewline(d);
  let dOpenTable = mDiv(dMiddle, { padding: 10 }); mFlexWrap(dOpenTable);
  return [dOben, dError, dSubmitOrRestart, dSelections, dActions, dOpenTable, dMiddle, dRechts];
}






