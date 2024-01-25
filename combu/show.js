async function showDashboard(){
	mClear('dMain');
	mDom('dMain',{fg:getThemeFg()},{html:`hi, ${U.name}! this is your dashboard`})
}