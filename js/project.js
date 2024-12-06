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
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore(app);

// Ensure the DOM is fully loaded before interacting with it
document.addEventListener("DOMContentLoaded", () => {
  // Get the main content area and other elements
  const mainContent = document.getElementById('main-web');
  const imageContainer = document.getElementById("map-container");
  const image = document.getElementById("clickable-image");

  // Overlay elements
  const learnMoreButton = document.getElementById('learnMoreButton');
  const overlay = document.getElementById('overlay');
  const closeButton = document.getElementById('closeButton');

  // Check if overlay elements exist
  if (!learnMoreButton || !overlay || !closeButton) {
    console.error('Overlay elements are missing!');
    return;
  }

  // Debugging: Check if the button is clickable
  console.log("Learn More button is loaded and clickable");

  // Show the overlay when the "Learn More" button is clicked
  learnMoreButton.addEventListener('click', () => {
    console.log("Learn More button clicked!");
    overlay.style.display = 'flex';  // Show overlay
  });

  // Hide the overlay when the close button is clicked
  closeButton.addEventListener('click', () => {
    overlay.style.display = 'none';  // Hide overlay
  });

  // Check if imageContainer and image are defined
  if (!imageContainer || !image) {
    console.error('Image container or image is not found!');
    return;
  }

  console.log("Image container and image loaded:", imageContainer, image);  // Debugging output

  // Function to create and add a button to the map
  function createButton(x, y, userInput) {
    console.log(`Creating button at x: ${x}, y: ${y}, with text: ${userInput}`);  // Debugging output

    const button = document.createElement("button");
    button.classList.add("dot");
    button.style.position = "absolute";
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.style.zIndex = 9999; // Ensure button is on top

    const img = document.createElement("img");
    img.src = "images/slugpinclear.JPG";  // Replace with your actual image URL
    img.alt = "Dot";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.borderRadius = "50%";
    button.appendChild(img);

    // Add tooltip text to the button (user input)
    button.title = userInput;

    // Add an event listener to show modal when clicked
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      showModal(x, y, userInput, button);
    });

    // Append the button to the image container
    imageContainer.appendChild(button);

    console.log("Button created and appended:", button);  // Debugging output
  }

  // Load pins from Firestore and display them on the image
  function loadPinsFromFirestore() {
    const pinsCollection = db.collection("pins");

    // Fetch pins from Firestore
    pinsCollection.get().then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("No pins found in Firestore.");
        return;
      }

      querySnapshot.forEach((doc) => {
        const pin = doc.data();
        console.log("Pin data from Firestore:", pin);  // Debugging output

        // Create button for each pin fetched from Firestore
        createButton(pin.x, pin.y, pin.text);
      });
    }).catch((error) => {
      console.error("Error getting pins from Firestore: ", error);
    });
  }

  // Custom modal logic for displaying pin info without delete option
  function showModal(x, y, userInput, buttonElement) {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modalContent.innerHTML = `
      <p>I'm listening to: ${userInput}</p>
      <button id="ok-btn">OK</button>
    `;
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    // OK button to close the modal
    document.getElementById("ok-btn").addEventListener("click", () => {
      modal.remove(); // Close the modal
    });
  }

  // Delete button data from Firestore
  function deleteButtonData(x, y, text) {
    const pinsCollection = db.collection("pins");

    const q = pinsCollection.where("x", "==", x).where("y", "==", y).where("text", "==", text);
    q.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete(); // Delete the pin from Firestore
      });
    }).catch((error) => {
      console.error("Error deleting pin: ", error);
    });
  }

  // Handle image clicks to add new pins
  image.addEventListener("click", (event) => {
    const rect = image.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const userInput = prompt("Enter your song:");

    if (!userInput) return;

    createButton(x, y, userInput);
    saveButtonData(x, y, userInput);
  });

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

  // Load pins when the page loads
  loadPinsFromFirestore();
});
