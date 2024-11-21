document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const postTextButton = document.getElementById('postTextButton');
    const postsContainer = document.getElementById('postsContainer');

    // Function to render comments
    const renderComments = (comments) => {
        postsContainer.innerHTML = ''; // Clear the container
        comments.forEach((comment) => {
            const post = document.createElement('div');
            post.classList.add('post');

            const content = document.createElement('p');
            content.textContent = comment.content;

            const timestamp = document.createElement('small');
            timestamp.textContent = new Date(comment.timestamp).toLocaleString();

            post.appendChild(content);
            post.appendChild(timestamp);
            postsContainer.appendChild(post);
        });
    };

    // Function to fetch all comments from the server
    const fetchComments = async () => {
        try {
            const response = await fetch('/comments');
            const data = await response.json();
            if (data.success) {
                renderComments(data.comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Event listener for the "Post Comment" button
    postTextButton.addEventListener('click', async () => {
        const content = textInput.value.trim();
        if (!content) {
            alert('Comment cannot be empty!');
            return;
        }

        try {
            const response = await fetch('/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            const data = await response.json();
            if (data.success) {
                textInput.value = ''; // Clear the input field
                fetchComments(); // Reload the comments
            } else {
                alert('Failed to post comment: ' + data.message);
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    });

    // Fetch comments when the page loads
    fetchComments();
});
