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


// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMiDKDPnkFWZGqrcgMRa4f6GxohGbvqyg",
    authDomain: "booyah2-f00fc.firebaseapp.com",
    projectId: "booyah2-f00fc",
    storageBucket: "booyah2-f00fc.firebasestorage.app",
    messagingSenderId: "278778285303",
    appId: "1:278778285303:web:f57c7297a1097ee4d6d7f2",
    measurementId: "G-2WKECGFX18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
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

    // Add an event listener to show the text when clicked
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      alert(`Button Text: ${userInput}`);
    });

    // Append the button to the image container
    imageContainer.appendChild(button);
  }

  // Add event listener to the image
  image.addEventListener("click", async (event) => {
    // Get the bounding rectangle of the image
    const rect = image.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Show a prompt to the user
    const userInput = prompt("Enter your text:");

    // Exit if the user cancels or enters nothing
    if (!userInput) return;

    // Create the button and save it to Firebase
    createButton(x, y, userInput);
    try {
      await addDoc(collection(db, "buttons"), { x, y, text: userInput });
    } catch (error) {
      console.error("Error saving button:", error);
    }
  });

  // Load buttons from Firebase
  async function loadButtons() {
    try {
      const querySnapshot = await getDocs(collection(db, "buttons"));
      querySnapshot.forEach((doc) => {
        const { x, y, text } = doc.data();
        createButton(x, y, text);
      });
    } catch (error) {
      console.error("Error loading buttons:", error);
    }
  }

  // Load buttons on page load
  loadButtons();
});

