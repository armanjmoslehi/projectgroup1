


// BELOW FOR WELCOME PAGE

document.getElementById('myClick');

// Get the OK button

var okButton = document.getElementById('okBtn');

// Get the main content area

var mainContent = document.getElementById('mainContent');

// When the page loads, display the box

window.onload = function() {

  click.style.display = 'flex'; // Show the box

}

// When the user clicks the "OK" button, hide the box and show the content

okButton.onclick = function() {

  click.style.display = 'none'; // Hide the box

  mainContent.style.display = 'block'; // Show the main content

}


