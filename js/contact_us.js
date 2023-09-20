// Fetches and displays the currently active logo for both header and footer
const fetchAndDisplayLogo = async (elementId) => {
    try {
      const logoImage = document.getElementById(elementId);
      
      if (!logoImage) {
        console.error(`${elementId} element not found.`);
        return;
      }
  
      const response = await fetch('/api/active-logo');
  
      if (response.ok) {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        logoImage.src = imageUrl;
      } else {
        console.error("Image not found");
      }
    } catch (error) {
      console.error("There was a problem", error);
    }
  };
  document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayLogo('logo-image'); // Fetch and display header logo
    const form = document.getElementById("contact-form");
    
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        fetch("/submit", {
            method: "POST",
            body: new URLSearchParams(new FormData(event.target))
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const messageDiv = document.createElement("div");
                messageDiv.textContent = "Email sent successfully";
                messageDiv.className = "success-message";
                form.appendChild(messageDiv);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
  })