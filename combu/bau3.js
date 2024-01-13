
function getCivSpot(civ,row,col){
	let rAdvisor={x:11,y:27,w:87,h:136}; //von persia
	let rColony1={x:10,y:193,w:87,h:137}; //von japan
	let rColony2={x:122,y:192,w:87,h:136}; //von india
	let rColonyUpPersia={x:122,y:26,w:87,h:136}; //von portugal
	let rBuilding1={x:132,y:26,w:87,h:136}; //von portugal
	let rBuilding1Persia={x:243,y:26,w:87,h:136}; //von persia
	let rBuilding2={x:243,y:28,w:87,h:136};
	let dxBuildings=rBuilding2.x-(rBuilding1.x+rBuilding1.w);
	let rWic={x:700,y:26,w:87,h:136}; //calculated
	let rLastWonder={x:700,y:193,w:87,h:136};
	let rWonder={x:674,y:193,w:87,h:136};
	let dxWonders=25;

	if (row==0 && col==0) return rAdvisor;
	if (row==0 && col == 1 && civ=='persia') return rColonyUpPersia;
	if (row==0 && col == 1) return rBuilding1;
	if (row==0 && col == 2 && civ=='persia') return rBuilding1Persia;
	if (row==0 && col == 2) return rBuilding2;

	if (row == 0 && col == 6) return rWic;

	let r,dist;
	if (row == 0){
		// return a building
		r=rBuilding2;
		dist=dxBuildings+r.w
		return {x:r.x+dist*(col-2),y:r.y,w:r.w,h:r.h};
	}

	if (row==1 && col == 0) return rColony1;
	if (row==1 && col == 1 && civ!='china' && civ!='poland') return rColony2;
	if (row==1 && col == 6) return rLastWonder;

	r=rLastWonder;
	dist=dxWonders+r.w;
	return {x:r.x-dist*(6-col),y:r.y,w:r.w,h:r.h};

}











