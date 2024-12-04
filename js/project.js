// Firebase initialization and Firestore setup (via CDN)
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
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore(app);

// Ensure the DOM is fully loaded before interacting with it
document.addEventListener("DOMContentLoaded", () => {
    // Get the main content area
    const mainContent = document.getElementById('main-web');
    const imageContainer = document.getElementById("map-container");
    const image = document.getElementById("clickable-image");

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
        const pinsCollection = db.collection('pins');

        pinsCollection.add({
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

    // Load buttons from Firestore
    function loadButtons() {
        const pinsCollection = db.collection('pins');
        const q = pinsCollection.orderBy("createdAt");

        q.get().then((querySnapshot) => {
            imageContainer.innerHTML = ''; // Clear existing pins
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
            buttonElement.remove(); // Remove the button from the map
            const pinText = buttonElement.getAttribute("data-text");
            const pinX = parseFloat(buttonElement.getAttribute("data-x"));
            const pinY = parseFloat(buttonElement.getAttribute("data-y"));

            // Delete from Firestore
            deleteButtonData(pinX, pinY, pinText);

            modal.remove(); // Close modal
        });
    }

    // Handle image clicks to add pins
    image.addEventListener("click", (event) => {
        const rect = image.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const userInput = prompt("Enter your song:");

        if (!userInput) return;

        createButton(x, y, userInput);
        saveButtonData(x, y, userInput);
    });

    // Load buttons when the page loads
    loadButtons();
});

