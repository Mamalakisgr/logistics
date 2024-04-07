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
function fetchAndDisplayServiceDetails() {
  fetch("/api/service-details")
      .then((response) => response.json())
      .then((data) => {
          populateDetailedServices(data);
      });
}

  function populateDetailedServices(details) {
    const serviceDetailsContainer = document.querySelector(".service-details-container");
    const selectedLang = localStorage.getItem("selectedLanguage") || 'En'; // Default to English if no preference is set
  
    serviceDetailsContainer.innerHTML = ""; // Clear existing content before populating
  
    details.forEach((detail) => {
      const title = detail.title[selectedLang] || detail.title['En']; // Fallback to English if selected language is missing
      const description = detail.description[selectedLang] || detail.description['En'] || "";
  
      const detailDiv = document.createElement("div");
      detailDiv.className = "service-detail";
      detailDiv.innerHTML = `
              <h3>${title}</h3>
              <p>${description}</p>
          `;
      serviceDetailsContainer.appendChild(detailDiv);
    });
  }
  fetchAndDisplayServiceDetails();

document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayLogo("logo-image");
  fetchAndDisplayLogo("side-logo-image");

  const serviceCategoriesDiv = document.getElementById("service-categories");

// Updated populateServiceCategories to use the selected language
function populateServiceCategories(categories) {
  const swiperWrapper = document.querySelector("#swiper-wrap-service");
  const selectedLang = localStorage.getItem("selectedLanguage") || 'En'; // Default to English if no preference is set
  swiperWrapper.innerHTML = ""; // Clear existing content
  
  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "swiper-slide"; // Adjust class name for Swiper slide
    const categoryName = category.categoryName[selectedLang] || category.categoryName['En']; // Fallback to English if selected language is not available
    const serviceDescription = category.services[0] ? (category.services[0].description[selectedLang] || category.services[0].description['En'] || "") : "";

    categoryDiv.innerHTML = `
      <h2>${categoryName}</h2>
      <p>${serviceDescription}</p>
    `;
    swiperWrapper.appendChild(categoryDiv);
  });

  // Initialize Swiper
  new Swiper('.mySwiper2', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    freeMode: true,
    scrollbar: {
      el: '.swiper-scrollbar',
      hide: false,
      draggable: true,
    },
  });
}

// Load and display service categories based on the selected language
function fetchAndDisplayServiceCategories() {
  fetch("/api/service-categories")
    .then((response) => response.json())
    .then((data) => {
      populateServiceCategories(data);
    });
}
fetchAndDisplayServiceCategories();
dropdownItems.forEach((item) => {
  item.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link action
      const selectedLang = this.getAttribute("data-lang");

      localStorage.setItem("selectedLanguage", selectedLang);
      
      // Re-fetch and display both service categories and detailed services in the selected language
      fetchAndDisplayServiceCategories();
      fetchAndDisplayServiceDetails(); // Ensure this is also called

      // Update the selected language display, etc.
      const selectedLangElement = document.getElementById("selected-lang");
      if (selectedLangElement) {
          selectedLangElement.setAttribute("data-lang", selectedLang);
          selectedLangElement.textContent = selectedLang;
          // Assuming translatePage translates static content or triggers UI updates for the new language
          translatePage(selectedLang);
      }
  });
});
});
