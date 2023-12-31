

// Call the function on page load to set the initial state
window.onload = toggleInputFields;

function validateForm() {
  console.log("validateForm called");
  
  const mediaType = document.querySelector('[name="media_type"]').value; // Get the media type
  if (mediaType === 'links') {
      var originalLinkInput = document.querySelector('input[name="original_link"]');
      var originalLink = originalLinkInput.value;
      if (originalLink === '') {
          // Set the error message
          document.getElementById('error-data').setAttribute('data-error', 'Please provide an original link.');
          // Show your modal
          openModal();
          return false;  // Prevent form submission
      }
      if (!originalLink.startsWith('http://') && !originalLink.startsWith('https://')) {
          // Update the input value to include 'http://'
          originalLinkInput.value = 'http://' + originalLink;
      }
  } else if (mediaType === 'image') {
      var imageInput = document.querySelector('input[name="image"]');
      if (imageInput.files.length === 0) {
          // Set the error message
          document.getElementById('error-data').setAttribute('data-error', 'Please upload an image.');
          // Show your modal
          openModal();
          return false;  // Prevent form submission
      }
  }
  return true;  // Allow form submission
}



function openModal() {
  document.getElementById('errorModal').classList.add('is-active');
}

function closeModal() {
  document.getElementById('errorModal').classList.remove('is-active');
}

document.addEventListener('DOMContentLoaded', function () {
  var errorElement = document.getElementById('error-data');
  if (errorElement) {  // Check if errorElement is not null
      var error = errorElement.getAttribute('data-error');
      if (error) {
          var errorModal = document.getElementById('errorModal');
          errorModal.classList.add('is-active');

          var modalContent = errorModal.querySelector('.modal-card-body');
          modalContent.textContent = error;
      }
  } else {
      console.error('Error element not found');
  }
});

function showReplyForm(commentId) {
  // Hide all reply forms first if you only want one form open at a time
  document.querySelectorAll('.reply-form').forEach(form => form.style.display = 'none');

  // Now show the specific reply form for the comment
  var form = document.getElementById('reply-form-' + commentId);
  if (form) {
    form.style.display = 'block';
  }
}

function toggleCommentLike(commentId, userId) {
  // Make sure this function is only called for logged-in users
  if (!userId) {
    alert('Please log in to like comments.');
    return;
  }

  // Make an AJAX request to the server
  $.post('/toggle-comment-like', { commentId: commentId, userId: userId }, function(data) {
    if (data.success) {
      // Toggle the class on the like button for visual feedback
      const likeButton = $(`#like-button-${commentId}`);
      likeButton.toggleClass('liked', data.hasLiked);

      // Update the likes count
      const likesCountElement = $(`#comment-like-count-${commentId}`);
      let likesCount = parseInt(likesCountElement.text());
      likesCount = data.hasLiked ? likesCount + 1 : likesCount - 1;
      likesCountElement.text(likesCount);
    } else {
      // Handle error or guide user to login if not logged in
      alert(data.message);
    }
  }).fail(function() {
    alert('Please log in to like comments.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.querySelector('.file-input');
  const fileInputName = document.querySelector('.file-name');

  fileInput.addEventListener('change', (event) => {
    const fileName = event.target.files.length > 0 ? event.target.files[0].name : 'No file uploaded';
    fileInputName.textContent = fileName;
  });
});



function toggleLike(threadId, userId) {
  // Check if the user ID is provided
  if (!userId) {
    alert('Please log in to like this thread.');
    return;
  }

  fetch('/toggle-like/' + threadId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // No need to send the user ID; the server knows which user is logged in from the session
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if(data.success) {
      const likeButton = document.querySelector(`.heart-button[data-thread-id="${threadId}"]`);
      const likeCount = document.getElementById(`like-count-${threadId}`);
      likeCount.textContent = data.newLikeCount;
      likeButton.classList.toggle('liked', data.isLiked);
    } else {
      alert(data.message);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('There was an error processing your like.');
  });
}
