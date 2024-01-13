

function cardRect(ctx,x,y,color){
	//let color=`#F17D2D`; //orange
	let dark='#635651';
	let light='#D9C7BD';

	//starting at x,y find first point of color, relax delta, continue x until last point of color
	delta=20;
	//y=40;
	let ybar=y+33;
	let o=findNextBar(ctx,x,x+100,ybar,ybar+20, color,10);
	if (nundef(o)) o=findNextBar(ctx,x,x+100,ybar,ybar+20, color,15);
	console.log('bar',o);
	let xnew=o.x;//+1;
	let o1=findNextBar(ctx,xnew,xnew+20,ybar,ybar+20, dark,delta);
	if (nundef(o1)) o1=findNextBar(ctx,xnew,xnew+20,ybar,ybar+20, dark,delta+10);
	console.log('dark',o1)
	let xx=o1.x+30;
	let o2=findNextBar(ctx,xx,xx+100,ybar,ybar+20, color,delta);
	console.log('bar',o2)

	let xline=x+33;
	let o3=findNextLine(ctx,xline,xline+20,y,y+100, color)
	if (nundef(o3)) o3=findNextLine(ctx,xline,xline+20,y,y+100, color,delta)
	console.log('line',o3)
	let ynew=o3.y;//+1;
	let o4=findNextLine(ctx,xline,xline+20,ynew,ynew+20, dark,delta)
	if (nundef(o4)) o4=findNextLine(ctx,xline,xline+20,ynew,ynew+20, dark,delta+10)
	console.log('line',o4)
	ynew = o4.y+80;
	let o5=findNextLine(ctx,xline,xline+20,ynew,ynew+100, color)
	console.log('line',o5)

	return {x:o1.x,y:o4.y,w:o2.x-o1.x,h:o5.y-o4.y};
}








