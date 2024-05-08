function clickColor(c, y, x) {
  let cObj = w3color(c);
  let hex = cObj.toHexString(); console.log(hex);

  if ((!y || y == -1) && (!x || x == -1)) { [x, y] = findColor(hex); }

  if (nundef(x)) { console.log('NO VALID COLOR FOUND!!!!', hex); return; }

  mStyle("selectedhexagon",{top:y,left:x,visibility:'visible'});
  mStyle(document.body,{bg:hex});
}
