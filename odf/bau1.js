async function createScaledCanvasFromImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // const scale = 200 / Math.min(img.width, img.height);
      // const scaledWidth = img.width * scale;
      // const scaledHeight = img.height * scale;

      const canvas = document.createElement('canvas');
      let w = canvas.width = img.width; //scaledWidth;
      let h = canvas.height = img.height; //scaledHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w,h); //scaledWidth, scaledHeight);


      // mAppend(d,canvas)
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
async function showUrlInCanvasInDiv(dParent,src){
  return new Promise((resolve, reject) => {
    let d=mDom(dParent);
    const img = new Image();
    img.onload = () => {
      const canvas = mDom(d,{},{tag:'canvas'});
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img,0,0); //, 0, 0, scaledWidth, scaledHeight);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
async function showUrlResizedToMin(dParent, src, szmin) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate the scale to ensure the smaller side is 300px
      const scale = szmin / Math.min(img.width, img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Create a canvas and set its width and height
      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      // Draw the image onto the canvas with the new size
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

      // Resolve the promise with the canvas
      mAppend(dParent, canvas);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
function onclickCanvasSetNewCenterOverlay(ev) {
  let cv = ev.target;
  let d = cv.parentNode;
  let c = getMouseCoordinatesRelativeToElement(ev,cv);
  setNewCenterOverlay(d, c.x, c.y);
}
function setNewCenterOverlay(d, x, y) {
  console.log('d',d)
  UI.mouseCoords = { x, y };
  mIfNotRelative(d);
  let sz = 10;
  if (isdef(UI.mouseMarker)) { UI.mouseMarker.remove(); }
  let d1 = UI.mouseMarker = mDom(d, { rounding: '50%', position: 'absolute', left: x-sz/10, top: y-sz/2, w: sz, h: sz, bg: 'white' }, {})
  let rect = getRect(d,d); 

  //rechne aus wie weit ist x von 0 entfernt?
  let leftSide = x;
  let rightSide = rect.w-x;
  let radx=Math.floor(Math.min(leftSide,rightSide));
  let topSide = y;
  let bottomSide = rect.h-y;
  let rady=Math.floor(Math.min(topSide,bottomSide));
  let rad=Math.min(radx,rady);

  console.log('rect',rect,'center',x,y,'rad',rad);
  //draw a rectangle of radius rad around center point!
  let ov=mDom(d,{position:'absolute',w:rad*2,h:rad*2,box:true,bg:'#ffffff80',left:x-rad,top:y-rad},{className:'no_events'});



}

function mist() {
  //outline rectangle!
  //kleinere seite
  let [small, big] = [cv.width > cv.height ? cv.height : cv.width, cv.width < cv.height ? cv.height : cv.width];
  //let _scale = small<300?
  let [w, h] = [Math.min(300, cv.width), Math.min(300, cv.h)];


  let rect = mDom(d, { border: 'red', position: 'absolute', top: c.x - 100, hL }, {});

  //modifyInstruction on d
  let d2 = d.children[1];
  d2.innerHTML = ''; //drag centerpoint around until you like the outline of your image';
  mButton('Done', ev => {



  });


}


















