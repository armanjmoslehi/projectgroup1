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

  // Function to create and add a button
  function createButton(x, y, userInput) {
    const button = document.createElement("button");
    button.classList.add("dot");
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;

    // Add an image inside the button
    const img = document.createElement("img");
    img.src = "images/slugpinclear.JPG"; // Replace with your button image link
    img.alt = "Dot";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.borderRadius = "50%";
    button.appendChild(img);

    // Save the user input as a tooltip or a hidden attribute
    button.title = userInput;
    button.setAttribute("data-text", userInput);
    button.setAttribute("data-x", x);
    button.setAttribute("data-y", y);

    // Add an event listener to show the custom modal
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      showModal(x, y, userInput, button);
    });

    // Append the button to the image container
    imageContainer.appendChild(button);
  }

  // Save button data to localStorage
  function saveButtonData(x, y, text) {
    const buttonsData = JSON.parse(localStorage.getItem("buttons")) || [];
    buttonsData.push({ x, y, text });
    localStorage.setItem("buttons", JSON.stringify(buttonsData));
  }

  // Delete button data from localStorage
  function deleteButtonData(x, y, text) {
    const buttonsData = JSON.parse(localStorage.getItem("buttons")) || [];
    const updatedButtonsData = buttonsData.filter(
      (button) => !(button.x === x && button.y === y && button.text === text)
    );
    localStorage.setItem("buttons", JSON.stringify(updatedButtonsData));
  }

  // Load buttons from localStorage
  function loadButtons() {
    const buttonsData = JSON.parse(localStorage.getItem("buttons")) || [];
    buttonsData.forEach(({ x, y, text }) => {
      createButton(x, y, text);
    });
  }

  // Custom modal logic
  function showModal(x, y, userInput, buttonElement) {
    // Create modal container
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Add modal content
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modalContent.innerHTML = `
      <p>I'm listening to: ${userInput}</p>
      <button id="ok-btn">OK</button>
      <button id="delete-btn">Delete</button>
    `;
    modal.appendChild(modalContent);

    // Append modal to body
    document.body.appendChild(modal);

    // Handle "OK" button click
    document.getElementById("ok-btn").addEventListener("click", () => {
      modal.remove(); // Close the modal
    });

    // Handle "Delete" button click
    document.getElementById("delete-btn").addEventListener("click", () => {
      // Remove button from DOM and localStorage
      buttonElement.remove();
      deleteButtonData(x, y, userInput);
      modal.remove();
    });
  }

  // Add event listener to the image
  image.addEventListener("click", (event) => {
    const rect = image.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const userInput = prompt("Enter your song:");

    if (!userInput) return;

    createButton(x, y, userInput);
    saveButtonData(x, y, userInput);
  });

  // Load buttons on page load
  loadButtons();
});

