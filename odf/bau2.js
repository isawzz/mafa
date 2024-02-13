function createInteractiveCanvas(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = canvas.width = img.width; 
      let h = canvas.height = img.height; 
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w,h); 


      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}



