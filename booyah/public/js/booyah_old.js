// Add an event listener to the 'postTextButton' element

document.getElementById('postTextButton').addEventListener('click', function() {
  // Get the value of 'textInput' textarea
  var text = document.getElementById('textInput').value;
  
  // Check if there's any text entered; if not, display an alert and return
  if (!text) {
    alert("please enter some text to post.");
    return;
  }
  // create a new xmlhttprequest object for sending data to server via http post method   
  const xhr = new XMLHttpRequest();
  xhr.open("POST","http://localhost:3000/api/post_text",true);   

  xhr.onload= function(){

    if(xhr.status===200){

      console.log("successfully posted");
    }
  };

  xhr.send(JSON.stringify({content: text})); 

}); 

// Function responsible fetching already existing posts from backend-server API endpoints using fetch()

function fetchPosts(){
fetch("http://localhost:3000/api/post_text")
.then(response => response.json())
.then(data => {       
var postsContainer=document.getElementById ("postsList");     
  
data.forEach(post=>{            
var li=document.createElement('li');          
li.textContent= post ;            
postsContainer.appendChild(li);

});
});
// Call fetchPosts initially when page loads

window.addEventListener ('load' ,fetchPosts);

}
