
function uiTypeExtraWorker(w) {
	//w ist a string eg. food:3
	let [res, n] = [stringBefore(w, ':'), Number(stringAfter(w, ':'))];
	let s = `worker (cost:${res} ${n})`
	let present = presentExtraWorker; 
	let select = selectExtraWorker; 
	return {itemtype:'worker', a: s, key: `worker_${res}`, o: { res: res, n: n }, friendly: s, present,select}
}
function presentExtraWorker(item,dParent,styles={}){
	let sz=styles.sz; //console.log(sz)
	addKeys({paright:10,bg:'white',rounding:'50%',hmargin:8,h:30,position:'relative'},styles)
	let d=mDom(dParent,styles);mFlex(d);
	let img=mDom(d,{h:'100%'},{tag:'img',src:'../assets/games/nations/templates/worker.png'})
	//console.log(item.o)
	let img2=mDom(d,{h:sz*2/3,w:sz*2/3,position:'absolute',top:'17%',left:'40%'},{tag:'img',src:`../assets/games/nations/templates/${item.o.res}.png`});
	return d;
}
function selectExtraWorker(item){
}








