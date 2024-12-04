
// Firebase initialization and Firestore setup (via modular SDK)
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

// Firebase config
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

// Initialize Firestore
const db = getFirestore(app);

// Ensure the DOM is fully loaded before interacting with it
document.addEventListener("DOMContentLoaded", () => {
    // Get the element with the ID 'myClick'
    var clickBox = document.getElementById('myClick');
    // Get the OK button
    var okButton = document.getElementById('okBtn');
    // Get the main content area
    var mainContent = document.getElementById('mainContent');
    // Get the image container and map image element
    const imageContainer = document.getElementById("map-container");
    const image = document.getElementById("clickable-image");

    // Ensure that clickBox and okButton exist
    if (okButton) {
        okButton.onclick = function () {
            clickBox.style.display = 'none'; // Hide the box
            mainContent.style.display = 'block'; // Show the main content
        };
    }

    // Function to create and add a button to the map
    function createButton(x, y, userInput) {
        const button = document.createElement("button");
        button.classList.add("dot");
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;

        const img = document.createElement("img");
        img.src = "images/slugpinclear.JPG"; // Replace with your button image link
        img.alt = "Dot";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.borderRadius = "50%";
        button.appendChild(img);

        // Save user input as a tooltip
        button.title = userInput;
        button.setAttribute("data-text", userInput);
        button.setAttribute("data-x", x);
        button.setAttribute("data-y", y);

        // Add an event listener to show the custom modal
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            showModal(x, y, userInput, button);
        });

        // Append button to image container
        imageContainer.appendChild(button);
    }

    // Save button data to Firestore
    function saveButtonData(x, y, text) {
        const pinsCollection = collection(db, 'pins');  // Use 'collection' to get Firestore collection

        addDoc(pinsCollection, {
            x: x,
            y: y,
            text: text,
            createdAt: new Date() // Set the createdAt timestamp
        }).then(() => {
            console.log("Pin saved to Firestore.");
        }).catch((error) => {
            console.error("Error adding pin: ", error);
        });
    }

    // Delete button data from Firestore
    function deleteButtonData(x, y, text) {
        const pinsCollection = collection(db, 'pins');  // Use 'collection' to get Firestore collection

        // Find and delete the pin in Firestore
        const q = query(pinsCollection, where("x", "==", x), where("y", "==", y), where("text", "==", text));

        getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete(); // Delete the pin from Firestore
            });
        }).catch((error) => {
            console.error("Error deleting pin: ", error);
        });
    }

    // Load buttons from Firestore
    function loadButtons() {
        const pinsCollection = collection(db, 'pins');  // Use 'collection' to get Firestore collection

        // Listen for real-time updates from Firestore
        const q = query(pinsCollection, orderBy("createdAt"));
        getDocs(q).then((querySnapshot) => {
            // Clear existing buttons (if any) before re-rendering
            imageContainer.innerHTML = '';

            // Loop through the pins and create buttons
            querySnapshot.forEach((doc) => {
                const pin = doc.data();
                createButton(pin.x, pin.y, pin.text);
            });
        }).catch((error) => {
            console.error("Error loading pins: ", error);
        });
    }

    // Custom modal logic
    function showModal(x, y, userInput, buttonElement) {
        const modal = document.createElement("div");
        modal.classList.add("modal");

        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");
        modalContent.innerHTML = `
            <p>I'm listening to: ${userInput}</p>
            <button id="ok-btn">OK</button>
            <button id="delete-btn">Delete</button>
        `;
        modal.appendChild(modalContent);

        document.body.appendChild(modal);

        document.getElementById("ok-btn").addEventListener("click", () => {
            modal.remove(); // Close the modal
        });

        document.getElementById("delete-btn").addEventListener("click", () => {
            // Remove button from DOM
            buttonElement.remove();

            // Delete the pin data from Firestore
            const pinText = buttonElement.getAttribute("data-text");
            const pinX = parseFloat(buttonElement.getAttribute("data-x"));
            const pinY = parseFloat(buttonElement.getAttribute("data-y"));

            deleteButtonData(pinX, pinY, pinText);

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

        // Create the pin on the page
        createButton(x, y, userInput);

        // Save the pin data to Firestore
        saveButtonData(x, y, userInput);
    });

    // Load buttons from Firestore when the page loads
    clickBox.style.display = 'flex'; // Show the box
    loadButtons();  // Load pins from Firestore
});
