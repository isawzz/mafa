function clickColor(c, y, x) {
  let cObj = w3color(c);
  let hex = cObj.toHexString(); console.log(hex);

  if ((!y || y == -1) && (!x || x == -1)) { [x, y] = findColor(hex); }

  if (nundef(x)) { console.log('NO VALID COLOR FOUND!!!!', hex); return; }
  document.getElementById("selectedhexagon").style.top = y + "px";
  document.getElementById("selectedhexagon").style.left = x + "px";
  document.getElementById("selectedhexagon").style.visibility = "visible";
}
