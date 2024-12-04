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


document.addEventListener("DOMContentLoaded", () => {
  const imageContainer = document.getElementById("map-container");
  const image = document.getElementById("clickable-image");

  image.addEventListener("click", (event) => {
    // Get the bounding rectangle of the image
    const rect = image.getBoundingClientRect();
    const x = event.clientX - rect.left; // X position within the image
    const y = event.clientY - rect.top;  // Y position within the image

    // Show a prompt to the user
    const userInput = prompt("Enter your text:");

    // Exit if the user cancels or enters nothing
    if (!userInput) return;

    // Create the button
    const button = document.createElement("button");
    button.classList.add("dot");
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;

    // Add an image inside the button (use your image link here)
    const img = document.createElement("img");
    img.src = "images/slugpinclear.JPG"; // Replace with your button image link
    img.alt = "Dot"; // Optional alt text for the image
    img.style.width = "100%"; // Make the image fill the button
    img.style.height = "100%";
    img.style.borderRadius = "50%"; // Optional: Round image
    button.appendChild(img);

    // Save the user input as a tooltip or a hidden attribute
    button.title = userInput; // Tooltip when hovering
    button.setAttribute("data-text", userInput); // Save input for later use

    // Add an event listener to show the text when clicked
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering the image click event
      alert(`Button Text: ${userInput}`);
    });

    // Append the button to the image container
    imageContainer.appendChild(button);
<<<<<<< HEAD
  }

  // Save button data to localStorage
  function saveButtonData(x, y, text) {
    const buttonsData = JSON.parse(localStorage.getItem("buttons")) || [];
    buttonsData.push({ x, y, text });
    localStorage.setItem("buttons", JSON.stringify(buttonsData));
  }

  // Load buttons from localStorage
  function loadButtons() {
    const buttonsData = JSON.parse(localStorage.getItem("buttons")) || [];
    buttonsData.forEach(({ x, y, text }) => {
      createButton(x, y, text);
    });
  }

  // Add event listener to the image
  image.addEventListener("click", (event) => {
    // Get the bounding rectangle of the image
    const rect = image.getBoundingClientRect();
    const x = event.clientX - rect.left; // X position within the image
    const y = event.clientY - rect.top;  // Y position within the image

    // Show a prompt to the user
    const userInput = prompt("Enter your text:");

    // Exit if the user cancels or enters nothing
    if (!userInput) return;

    // Create the button and save it
    createButton(x, y, userInput);
    saveButtonData(x, y, userInput);
  });

  // Load buttons on page load
  loadButtons();
=======
  });
>>>>>>> parent of a94395c (Refresh)
});
