
function hslTable(dParent,x,color) {
  let i, a='', match, same, comp, loopHSL, HSL;
  //var color = document.getElementById("colorhexDIV").innerHTML;
  let  hslObj = w3color(color);
  let h = hslObj.hue;
  let s = hslObj.sat;
  let l = hslObj.lightness;
  let arr = [];
  let lineno = (x == "hue")?12:10;
  let header = x.toUpperCase();
  for (i = 0; i <= lineno; i++) {
    let chue=`hsl(${(h+i*30)%360},${s},${l})`;
    if (x == "hue") { arr.push(w3color(chue)); }
    // if (x == "hue") { arr.push(w3color("hsl(" + (i * 15) + "," + s + "," + l + ")")); }
    else if (x == "sat") { arr.push(w3color("hsl(" + h + "," + (i * 0.05) + "," + l + ")")); }
    else if (x == "light") { arr.push(w3color("hsl(" + h + "," + s + "," + (i * 0.05) + ")")); }
  }
  // console.log('arr',arr); 
  if (x == "sat" || x == "light") { arr.reverse(); }
  a += "<div class='w3-responsive'>";
  a += "<table class='ws-table-all colorTable' style='width:100%;white-space: nowrap;font-size:14px;'>";
  a += "<tr>";
  a += `<td style='width:30px;'>${header}</td>`;
  for (i = 0; i < arr.length; i++) {
    a += `<tr><td style='cursor:pointer;background-color:${arr[i].toHexString()}' onclick='onclickColor("${arr[i].toHexString()}")'>${arr[i].toHexString()}</td></tr>`;
  }
  a += "</table></div>";
  dParent.innerHTML = a;
}
function hslTables(dParent,color) {
  let i, a='', match, same, comp, loopHSL, HSL;
  //var color = document.getElementById("colorhexDIV").innerHTML;
  let  hslObj = w3color(color);
  let h = hslObj.hue;
  let s = hslObj.sat;
  let l = hslObj.lightness;
  let arr = [];
  lineno=10;
  //let header = x.toUpperCase();
  for (i = 0; i <= lineno; i++) {
    let chue=`hsl(${(h-50+i*10)%360},${s},${l})`;
    let csat=`hsl(${h},${i*.1},${l})`;
    let clum=`hsl(${h},${s},${i*.1})`;
    arr.push({h:w3color(chue),s:w3color(csat),l:w3color(clum)});
  }
  // console.log('arr',arr); 
  a += "<div class='w3-responsive'>";
  a += "<table class='ws-table-all colorTable' style='width:100%;white-space: nowrap;font-size:14px;'>";
  a += "<tr>";
  a += `<td style='width:30px;'>Hue</td><td style='width:30px;'>Sat</td><td style='width:30px;'>Lum</td>`;
  for (i = 0; i < arr.length; i++) {
    let [hexh,hexs,hexl]=[arr[i].h.toHexString(),arr[i].s.toHexString(),arr[i].l.toHexString()];
    a += `
      <tr>
        <td style='cursor:pointer;background-color:${hexh}' onclick='onclickHue("${hexh}")'>${hexh}</td>
        <td style='cursor:pointer;background-color:${hexs}' onclick='onclickSat("${hexs}")'>${hexs}</td>
        <td style='cursor:pointer;background-color:${hexl}' onclick='onclickLum("${hexl}")'>${hexl}</td>
      </tr>`;
  }
  a += "</table></div>";
  dParent.innerHTML = a;
}
function onclickHue(color){
  
}








