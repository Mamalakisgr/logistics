// Fetches and displays the currently active logo for both header and footer
const fetchAndDisplayLogo = async (elementId) => {
  try {
    const logoImage = document.getElementById(elementId);

    if (!logoImage) {
      console.error(`${elementId} element not found.`);
      return;
    }

    const response = await fetch("/api/active-logo");

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

// Function to fetch and update company content
const fetchAndUpdateCompanyContent = async () => {
  try {
    const response = await fetch("/api/company-content"); // Fetch data from server
    if (response.ok) {
      const data = await response.json();

      // Update HTML elements with fetched data
      document.getElementById("historyTitle").textContent = data.historyTitle;
      document.getElementById("historyDescription").textContent =
        data.historyDescription;
    } else {
      console.error("Failed to fetch company content");
    }
    // Fetch and update images for history, values, and vision
    // Fetch and update background images for history, values, and vision
    const sections = ["history", "values", "vision"];
    for (const section of sections) {
      const imageResponse = await fetch(`/api/${section}-image`);
      if (imageResponse.ok) {
        const imageBlob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        const element = document.getElementById(`${section}-section`);
        if (element) {
          element.style.backgroundImage = `url(${imageUrl})`;
        }
      } else {
        console.error(`Failed to fetch ${section} image`);
      }
    }
  } catch (error) {
    console.error("Error fetching company content:", error);
  }
};
// New code to listen for updates
window.addEventListener("storage", function (event) {
  if (event.key === "imageUpdated") {
    fetchAndDisplayLogo("logo-image");
    fetchAndDisplayLogo("logo-image-footer");
    fetchAndUpdateCompanyContent();
  }
});

// Execute these functions when the page loads
document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayLogo("logo-image"); // Fetch and display header logo
  // fetchAndDisplayLogo('logo-image-footer'); // Fetch and display footer logo
  fetchAndUpdateCompanyContent(); // Add this line to fetch and update the company content
});
