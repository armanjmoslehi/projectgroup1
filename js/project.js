// Firebase Configuration and Initialization
const firebaseConfig = {
  apiKey: "AIzaSyBMiDKDPnkFWZGqrcgMRa4f6GxohGbvqyg",
  authDomain: "booyah2-f00fc.firebaseapp.com",
  projectId: "booyah2-f00fc",
  storageBucket: "booyah2-f00fc.firebasestorage.app",
  messagingSenderId: "278778285303",
  appId: "1:278778285303:web:f57c7297a1097ee4d6d7f2",
  measurementId: "G-2WKECGFX18"
};

// Initialize Firebase and Firestore
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const imageContainer = document.getElementById("map-container");
  const image = document.getElementById("clickable-image");

  // Function to create and add a button to the map
  function createButton(x, y, userInput) {
    console.log(`Creating button at x: ${x}, y: ${y}, with text: ${userInput}`);

    // Get the current size of the map container
    const containerWidth = imageContainer.clientWidth;
    const containerHeight = imageContainer.clientHeight;

    // Calculate the percentage positions based on container size
    const percentX = (x / containerWidth) * 100;
    const percentY = (y / containerHeight) * 100;

    // Create the pin button
    const button = document.createElement("button");
    button.classList.add("dot");
    button.style.position = "absolute";
    button.style.left = `${percentX}%`;  // Set as percentage of container width
    button.style.top = `${percentY}%`;   // Set as percentage of container height

    const img = document.createElement("img");
    img.src = "images/slugpinclear.JPG";  // Replace with your actual image URL
    img.alt = "Dot";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.borderRadius = "50%";
    button.appendChild(img);

    // Add tooltip text to the button (user input)
    button.title = userInput;

    // Add event listener to show modal when clicked
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      showModal(userInput, button);  // pass button to showModal
    });

    // Store the pin data in the button attributes for easy retrieval
    button.setAttribute("data-x", percentX);
    button.setAttribute("data-y", percentY);
    button.setAttribute("data-text", userInput);

    // Append the button to the image container
    imageContainer.appendChild(button);
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

      // Clear existing pins from the map container to avoid duplicates
      const existingPins = imageContainer.querySelectorAll(".dot");
      existingPins.forEach(pin => pin.remove());

      querySnapshot.forEach((doc) => {
        const pin = doc.data();
        console.log("Pin data:", pin);  // Debugging output

        // Get the current size of the map container
        const containerWidth = imageContainer.clientWidth;
        const containerHeight = imageContainer.clientHeight;

        // Recalculate the pixel position based on the percentage values
        const posX = (pin.x / 100) * containerWidth;
        const posY = (pin.y / 100) * containerHeight;

        // Create button for each pin fetched from Firestore
        createButtonAtPosition(posX, posY, pin.text);
      });
    }).catch((error) => {
      console.error("Error getting pins from Firestore: ", error);
    });
  }

  // Function to create and position a button based on pixel position
  function createButtonAtPosition(x, y, userInput) {
    const button = document.createElement("button");
    button.classList.add("dot");
    button.style.position = "absolute";
    button.style.left = `${x}px`; // Position using pixel values
    button.style.top = `${y}px`;  // Position using pixel values

    const img = document.createElement("img");
    img.src = "images/slugpinclear.JPG";  // Replace with your actual image URL
    img.alt = "Dot";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.borderRadius = "50%";
    button.appendChild(img);

    // Add tooltip text to the button (user input)
    button.title = userInput;

    // Add event listener to show modal when clicked
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      showModal(userInput, button);  // pass button to showModal
    });

    // Store the pin data in the button attributes for easy retrieval
    button.setAttribute("data-text", userInput);

    // Append the button to the image container
    imageContainer.appendChild(button);
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
