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
fetch("/api/service-details")
  .then((response) => response.json())
  .then((data) => {
    populateDetailedServices(data);
  });

function populateDetailedServices(details) {
  // Target the "service-details-container" div
  const serviceDetailsContainer = document.querySelector(
    ".service-details-container"
  );
  details.forEach((detail) => {
    const detailDiv = document.createElement("div");
    detailDiv.className = "service-detail";
    detailDiv.innerHTML = `
            <h3>${detail.title}</h3>
            <p>${detail.description}</p>
        `;
    serviceDetailsContainer.appendChild(detailDiv);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayLogo("logo-image");
  fetchAndDisplayLogo("side-logo-image");

  const serviceCategoriesDiv = document.getElementById("service-categories");

  // Utility function to populate service categories
  function populateServiceCategories(categories) {
    serviceCategoriesDiv.innerHTML = ""; // Clear existing content
    categories.forEach((category) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "service-category";
      categoryDiv.innerHTML = `
                <h2>${category.categoryName}</h2>
                <p>${
                  category.services[0] ? category.services[0].description : ""
                }</p>
            `;
      serviceCategoriesDiv.appendChild(categoryDiv);
    });
  }

  // Load existing service categories
  fetch("/api/service-categories")
    .then((response) => response.json())
    .then((data) => {
      populateServiceCategories(data);
    });
});
