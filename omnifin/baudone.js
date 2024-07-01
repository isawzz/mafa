async function dbInit(path) {
	const fileUrl = './test.db';

	try {
		const response = await fetch(fileUrl);
		const buffer = await response.arrayBuffer();

		const SQL = await initSqlJs({ locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${filename}` });
		const db = new SQL.Database(new Uint8Array(buffer));
		return db;
	} catch (error) {
		console.error('Error:', error);
		document.getElementById('output').textContent = 'Error: ' + error.message;
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
	commands.test = menuCommand(nav.l, 'nav', 'test', 'Test', menuOpenTest, menuCloseTest);
	nav.commands = commands;
	return nav;
}
