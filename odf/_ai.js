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
