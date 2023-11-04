function splitImage(imageUrl, callback) {
	const img = new Image();
	img.crossOrigin = 'Anonymous';
	img.src = imageUrl;

	img.onload = function() {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0, img.width, img.height);

			const parts = [];
			let currentPart = null;
			let isPart = false;

			for (let y = 0; y < canvas.height; y++) {
					for (let x = 0; x < canvas.width; x++) {
							const pixel = ctx.getImageData(x, y, 1, 1).data;
							const isTransparentOrWhite = (pixel[3] === 0) || (pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255);

							if (isTransparentOrWhite) {
									if (isPart) {
											parts.push(currentPart);
									}
									isPart = false;
							} else {
									if (!isPart) {
											currentPart = document.createElement('canvas');
											currentPart.width = canvas.width;
											currentPart.height = canvas.height;
											currentPart.getContext('2d').drawImage(canvas, 0, 0);
											isPart = true;
									}
									currentPart.getContext('2d').clearRect(x, y, 1, 1);
							}
					}
			}

			if (isPart) {
					parts.push(currentPart);
			}

			const imageElements = parts.map(part => {
					const imgElement = new Image();
					imgElement.src = part.toDataURL();
					return imgElement;
			});

			callback(imageElements);
	};
}

// Example usage
const imageUrl = 'path/to/your/image.png'; // Replace with the actual image URL
splitImage(imageUrl, function(imageElements) {
	// Append image elements to the document or perform other actions
	imageElements.forEach(img => {
			document.body.appendChild(img);
	});
});
