onload = start;
var img = null, canvas = null;

function start(){
  img = document.getElementById('image');
  canvas = document.getElementById('canvas');

  if(!canvas || !canvas.getContext){
    canvas.parentNode.removeChild(canvas);
  } else {
    img.style.position = 'absolute';
    img.style.visibility = 'hidden';
  }
  rotateImage(0);

  //  Handle clicks for control links
  $('#resetImage').click(function(){ rotateImage(0); });
  $('#rotate90').click(function(){ rotateImage(90); });
  $('#rotate180').click(function(){ rotateImage(180); });
  $('#rotate270').click(function(){ rotateImage(270); });
}


function rotateImage(degree){
  if(document.getElementById('canvas')){
    var cContext = canvas.getContext('2d');
    var cw = img.width, ch = img.height, cx = 0, cy = 0;

    //   Calculate new canvas size and x/y coorditates for image
    switch(degree){
      case 90:
        cw = img.height;
        ch = img.width;
        cy = img.height * (-1);
        break;
      case 180:
        cx = img.width * (-1);
        cy = img.height * (-1);
        break;
      case 270:
        cw = img.height;
        ch = img.width;
        cx = img.width * (-1);
        break;
    }

    //  Rotate image            
    canvas.setAttribute('width', cw);
    canvas.setAttribute('height', ch);
    cContext.rotate(degree * Math.PI / 180);
    cContext.drawImage(img, cx, cy);
    document.getElementById('download').setAttribute('href',canvas.toDataURL())
    //$('#download').attr('href', canvas.toDataURL())
  } else {
    //  Use DXImageTransform.Microsoft.BasicImage filter for MSIE
    switch(degree){
      case 0: image.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=0)'; break;
      case 90: image.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=1)'; break;
      case 180: image.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)'; break;
      case 270: image.style.filter =    'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)'; break;
    }
  }
}