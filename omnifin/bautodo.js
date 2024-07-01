async function menuOpenOverview(){
	// sidebarHome();
	// mDom('dMain',{wmax:'1000'},{tag:'pre',id:'dPre'});
}
async function menuOpenSql(){
	// mClear('dMain')
	sidebarSql();
	// let d=mDom('dMain',{w:window.innerWidth-200,box:true});
	// UI.ta=mDom(d,{w100:true,box:true},{tag:'textarea',id:'taSql',rows:10,value:'select * from transactions'});
	// mButton('Execute',onclickExecute,d,{},'button');

	// let d1 = mDom(d,{wmax:1000},{tag:'pre',bg:'silver',overflow:'hidden',id:'dPre'}); return;
	// let text = dbQuery(DB,UI.ta.value);

	// // mTable(d1)
	// // const output = res.map(({ columns, values }) => {
	// // 	return columns.join('\t') + '\n' + values.map(row => row.join('\t')).join('\n');
	// // }).join('\n\n');

	// d1.textContent = text; //output;
	// // mDom(d1,{overx:'auto'},{tag:'pre',id:'dPre'});
}
async function menuOpenTables(){}
async function menuOpenTest(){}

async function menuCloseHome(){closeLeftSidebar();mClear('dMain')}
async function menuCloseSql(){closeLeftSidebar();mClear('dMain')}
async function menuCloseTables(){closeLeftSidebar();mClear('dMain')}
async function menuCloseTest(){closeLeftSidebar();mClear('dMain')}

