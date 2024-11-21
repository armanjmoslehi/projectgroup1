// Get the element with the ID 'myClick'
var clickBox = document.getElementById('myClick');

// Get the OK button
var okButton = document.getElementById('okBtn');

// Get the main content area
var mainContent = document.getElementById('mainContent');

// When the page loads, display the box
window.onload = function() {
  clickBox.style.display = 'flex'; // Show the box
};

// When the user clicks the "OK" button, hide the box and show the content
okButton.onclick = function() {
  clickBox.style.display = 'none'; // Hide the box
  mainContent.style.display = 'block'; // Show the main content
};

// script.js
const draggable = document.getElementById('draggable');

// Variables to store position
let offsetX = 0;
let offsetY = 0;
let isDragging = false;

// Mouse down event to start dragging
draggable.addEventListener('mousedown', (e) => {
    isDragging = true;

    // Calculate the mouse position relative to the draggable element
    offsetX = e.clientX - draggable.offsetLeft;
    offsetY = e.clientY - draggable.offsetTop;

    draggable.style.cursor = 'grabbing';
});

// Mouse move event to drag the element
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Prevent text selection
    e.preventDefault();

    // Update the position of the draggable element
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    draggable.style.left = `${newX}px`;
    draggable.style.top = `${newY}px`;
});

// Mouse up event to stop dragging
document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        draggable.style.cursor = 'grab';
    }
});

