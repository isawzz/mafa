const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function splitImage(inputImagePath, outputDirectory) {
    const image = await loadImage(inputImagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let partNumber = 1; let MAXPARTS=9;
    let currentPart = createCanvas(image.width, image.height);
		console.log('w,h',image.width,image.height);
    let currentPartCtx = currentPart.getContext('2d');

    for (let i = 0; i < data.length; i += 4) {
        const isTransparentOrWhite = data[i + 3] === 0 || (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255);

        if (isTransparentOrWhite) {
            currentPartCtx.putImageData(new ImageData(new Uint8ClampedArray(data.slice(i, i + 4)), 1, 1), (i / 4) % canvas.width, Math.floor((i / 4) / canvas.width));
        } else {
            const partFileName = `${outputDirectory}/part${partNumber}.png`;
            fs.writeFileSync(partFileName, currentPart.toBuffer());
            console.log(`Part ${partNumber} saved as ${partFileName}`);
            partNumber++;

            currentPart = createCanvas(image.width, image.height);
            currentPartCtx = currentPart.getContext('2d');
        }
    }

    // Save the last part
    const partFileName = `${outputDirectory}/part${partNumber}.png`;
    fs.writeFileSync(partFileName, currentPart.toBuffer());
    console.log(`Part ${partNumber} saved as ${partFileName}`);
}

// Example usage
const inputImagePath = 'amanda4.JPG'; //'path/to/your/input/image.png';
const outputDirectory = __dirname; //'path/to/your/output/directory';
splitImage(inputImagePath, outputDirectory);
