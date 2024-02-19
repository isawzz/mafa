// Create a modal with a question, Yes button, and No button
function createConfirmationModal(dParent,question) {
  // Get the modal element
  const modal = document.createElement("div");
  modal.classList.add("modal");

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Add the question to the modal
  const questionText = document.createElement("p");
  questionText.textContent = question;
  modalContent.appendChild(questionText);

  // Create Yes button
  const yesButton = document.createElement("button");
  yesButton.textContent = "Yes";
  yesButton.addEventListener("click", () => {
    // Handle Yes button click (you can add your logic here)
    modal.style.display = "none"; // Close the modal
  });
  modalContent.appendChild(yesButton);

  // Create No button
  const noButton = document.createElement("button");
  noButton.textContent = "No";
  noButton.addEventListener("click", () => {
    // Handle No button click (you can add your logic here)
    modal.style.display = "none"; // Close the modal
  });
  modalContent.appendChild(noButton);

  // Append modal content to the modal
  modal.appendChild(modalContent);

  // Append the modal to the document body
  dParent.appendChild(modal);
}
function createInteractiveCanvas(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 300 / Math.min(img.width, img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

      let isDragging = false;
      let rect = {x: 100, y: 100, width: 50, height: 50}; // Initial rectangle properties
      let dragOffsetX, dragOffsetY;

      // Function to check if the mouse position is inside the rectangle
      function isMouseInRect(x, y) {
        return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight); // Redraw image
        ctx.fillStyle = 'red';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height); // Draw the rectangle
      }

      canvas.addEventListener('mousedown', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (isMouseInRect(x, y)) {
          isDragging = true;
          dragOffsetX = x - rect.x;
          dragOffsetY = y - rect.y;
        }
      });

      canvas.addEventListener('mousemove', (event) => {
        if (isDragging) {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          rect.x = x - dragOffsetX;
          rect.y = y - dragOffsetY;
          draw(); // Redraw the canvas with the rectangle in the new position
        }
      });

      canvas.addEventListener('mouseup', () => {
        isDragging = false;
      });

      draw(); // Initial draw

      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}

// Example usage
async function loadAndMakeInteractive(imageUrl) {
  try {
    const canvas = await createInteractiveCanvas(imageUrl);
    document.body.appendChild(canvas);
  } catch (error) {
    console.error("Error loading image:", error);
  }
}

// Example call
loadAndMakeInteractive('https://example.com/path/to/your/image.jpg');



function createScaledCanvasFromImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 300 / Math.min(img.width, img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

      // Add click event listener to draw on canvas
      canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Draw a red circle of radius 5 at the click position
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Calculate the distance to the nearest border
        const distanceToBorder = Math.min(x, y, canvas.width - x, canvas.height - y);
        const sideLength = Math.min(300, distanceToBorder);

        // Draw a square centered on the click position
        // Adjust the starting point to keep the square centered
        ctx.beginPath();
        ctx.rect(x - sideLength / 2, y - sideLength / 2, sideLength, sideLength);
        ctx.stroke();
      });

      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}

// Usage example:
async function loadAndScaleImage(imageUrl) {
  try {
    const canvas = await createScaledCanvasFromImage(imageUrl);
    document.body.appendChild(canvas);
  } catch (error) {
    console.error("Error loading image:", error);
  }
}

// Example call
loadAndScaleImage('https://example.com/path/to/your/image.jpg');



function createScaledCanvasFromImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate the scale to ensure the smaller side is 300px
      const scale = 300 / Math.min(img.width, img.height);
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
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}

// Usage example:
async function loadAndScaleImage(imageUrl) {
  try {
    const canvas = await createScaledCanvasFromImage(imageUrl);
    // Do something with the canvas, e.g., add it to the document
    document.body.appendChild(canvas);
  } catch (error) {
    console.error("Error loading image:", error);
  }
}

// Example call with an image URL
loadAndScaleImage('https://example.com/path/to/your/image.jpg');

function enableImageDrop(element, onDropCallback) {
  // Store the original border style to restore it later
  const originalBorderStyle = element.style.border;

  // Prevent default behavior for dragover and drop events to allow drop
  element.addEventListener('dragover', function(event) {
    event.preventDefault();
  });

  // Highlight the border on drag enter
  element.addEventListener('dragenter', function(event) {
    element.style.border = '2px solid red';
  });

  // Restore the original border and call the callback function when an image is dropped
  element.addEventListener('drop', function(event) {
    event.preventDefault(); // Prevent the browser's default file open behavior
    element.style.border = originalBorderStyle; // Restore the original border style

    const files = event.dataTransfer.files; // Get the files that were dropped
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) { // Check if the dropped file is an image
        onDropCallback(file); // Call the provided callback function with the image file
      }
    }
  });

  // Restore the original border if the item is dragged out without dropping
  element.addEventListener('dragleave', function(event) {
    element.style.border = originalBorderStyle;
  });
}

// Example usage:
// Assuming there's an element with the ID 'dropZone' and a function to handle the dropped image
const dropZone = document.getElementById('dropZone');
enableImageDrop(dropZone, function(imageFile) {
  console.log('Image dropped:', imageFile.name);
  // Here you can handle the dropped image file, for example, read and display it
});
