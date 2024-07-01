
function dbQuery(db, q, dParent) {
	try {
		const result = db.exec(q);
		// console.log('result',result)
		// return result;
		const output = result.map(({ columns, values }) => {
			return columns.join('\t') + '\n' + values.map(row => row.join('\t')).join('\n');
		}).join('\n\n');
		if (isdef(dParent)){
			dParent = toElem(dParent)
			dParent.textContent = output || 'Query executed successfully.';
		}
		return output;
	} catch (error) {
		dParent.textContent = 'Error executing SQL: ' + error.message;
		return null;
	}

}

function showNavbar() {
	mDom('dNav',{fz:34,mabottom:10,w100:true},{html:`Omnifin`});
	let nav = mMenu('dNav');
	let commands = {};
	commands.home = menuCommand(nav.l, 'nav', 'home', 'Overview', menuOpenOverview, menuCloseHome);
	commands.sql = menuCommand(nav.l, 'nav', 'sql', 'Sql', menuOpenSql, menuCloseSql);
	commands.tables = menuCommand(nav.l, 'nav', 'tables', 'Tables', menuOpenTables, menuCloseTables);
	nav.commands = commands;
	return nav;
}
async function menuOpenOverview(){
	// sidebarHome();
	// mDom('dMain',{wmax:'1000'},{tag:'pre',id:'dPre'});
}
function sidebarHome() {
	let wmin = 170;
	mStyle('dLeft', { wmin: wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 });
	let gap = 5;
	UI.commands.showSchema = mCommand(d, 'showSchema', 'DB Structure'); mNewline(d, gap);
}
async function onclickSql(){console.log('hallo')}
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
async function onclickExecute(){
	dbQuery(DB,UI.ta.value,'dPre');
}
function sidebarSql() {
	let wmin = 170;
	mStyle('dLeft', { wmin: wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 });
	let gap = 5;
	//UI.commands.showSchema = mCommand(d, 'showSchema', 'DB Structure'); mNewline(d, gap);
}

async function menuCloseHome(){closeLeftSidebar();mClear('dMain')}
async function menuCloseSql(){closeLeftSidebar();mClear('dMain')}
async function menuOpenTables(){}
async function menuCloseTables(){closeLeftSidebar();mClear('dMain')}

//stubs
async function updateExtra(){}

