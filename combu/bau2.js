function calcBoundingBox(ctx,w,h,type){
	let [cgoal,clight,lighting]=type=='event'?['#6C4F64','#E7BB97',false]:['#59544E','#DBCEBE',true];

	findDarkLines(ctx,w,h,cgoal);

}
function _calcBoundingBox(ctx,w,h,type){

	let toplight = findRectSample(ctx, 20, w, 1, 1, clight, 4); 
	let bottomlight = findRectSample(ctx, 20, w, h - 5, h - 5, clight, 4, true); 
	let leftlight = findRectSample(ctx, 0, 0, 10, h, clight, 4); 
	let rightlight = findRectSample(ctx, w-5, w-5, 20, h-15, clight, 4, true); 

	let rect={};

	let [yoff1,yoff2,dyblank]=[0,20,lighting?20:0];
	let [xoff1,xoff2,dxblank]=[0,30,lighting?20:0];
	let top, bottom;
	if (toplight) {
		rect.top=0;
		bottom = findEdgeVert(ctx, h-yoff2-dyblank-5, h - yoff1 -dyblank, w, cgoal, lighting); 
		bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.bottom=bottom[0].y; 
	} else if (bottomlight) {
		rect.bottom=h;
		top = findEdgeVert(ctx, yoff1+dyblank, yoff2+dyblank, w, cgoal, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.top=top[0].y;
	} else {
		top = findEdgeVert(ctx, yoff1, yoff2, w, cgoal, lighting); top.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		bottom = findEdgeVert(ctx, h-yoff2, h - yoff1, w, cgoal, lighting); bottom.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.top=top[0].y;
		rect.bottom=bottom[0].y; 
	}

	let left,right;
	if (leftlight) {
		rect.left=0;
		right = findEdgeHor(ctx, w-xoff2-dxblank, w - xoff1-dxblank, h, cgoal, lighting); 
		right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.right=right[0].x; 
	} else if (rightlight) {
		left = findEdgeHor(ctx, xoff1+dxblank, xoff2+dxblank, h, cgoal, lighting); 
		left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.left=left[0].x; 
		rect.right=w; 
	} else {
		left = findEdgeHor(ctx, xoff1, xoff2, h, cgoal, lighting); 
		left.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		right = findEdgeHor(ctx, w-xoff2, w - xoff1, h, cgoal, lighting); 
		right.map(p => drawPix(ctx, p.x, p.y, 'yellow'));
		rect.left=left[0].x; 
		rect.right=right[0].x; 
	}
	rect.x=rect.left;rect.y=rect.top;rect.w=rect.right-rect.left;rect.h=rect.bottom-rect.top;

	return [rect,toplight,bottomlight,leftlight,rightlight]; // [resx, resy];

}











