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
