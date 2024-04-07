let currentLanguage = 'en'; // Default language

document.addEventListener("DOMContentLoaded", () => {
  fetchAndPopulateServices();
  setEventListeners();
});

function setEventListeners() {
  document.getElementById('switch-eng').addEventListener('click', () => toggleLanguage('en'));
  document.getElementById('switch-el').addEventListener('click', () => toggleLanguage('gr'));
  document.getElementById('switch-en2').addEventListener('click', () => toggleLanguage('en', 'detail-form'));
  document.getElementById('switch-el2').addEventListener('click', () => toggleLanguage('gr', 'detail-form'));

  const serviceForm = document.getElementById("service-form");
  serviceForm.addEventListener("submit", handleSubmit);
}

function toggleLanguage(language, formId = 'service-form') {
  currentLanguage = language;
  toggleLanguageInputs(language, formId);
  formId === 'service-form' ? fetchAndPopulateServices() : fetchAndDisplayServiceDetails();
}

function toggleLanguageInputs(language, formId) {
  const form = document.getElementById(formId);
  const enInputs = form.querySelector('#en-inputs');
  const grInputs = form.querySelector('#gr-inputs');

  enInputs.style.display = language === 'en' ? '' : 'none';
  grInputs.style.display = language === 'gr' ? '' : 'none';
}

function fetchAndPopulateServices() {
  fetch("/api/service-categories")
    .then(response => response.json())
    .then(data => populateServiceList(data));
}

function populateServiceList(services) {
  const serviceListDiv = document.getElementById("service-list");
  serviceListDiv.innerHTML = services.map(category => `
    <div>
      <h3>${category.categoryName[currentLanguage] || "No title in selected language"}</h3>
      <p>${(category.services[0] && category.services[0].description[currentLanguage]) || "No description in selected language"}</p>
      <button onclick="loadCategoryToForm('${category._id}')">Edit</button>
      <button onclick="deleteCategories('${category._id}')">Delete</button>
    </div>
  `).join('');
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const serviceData = {
    categoryName: {
      en: formData.get("categoryNameEn"),
      gr: formData.get("categoryNameGr"),
    },
    services: [{
      serviceName: {
        en: formData.get("serviceNameEn"),
        gr: formData.get("serviceNameGr"),
      },
      description: {
        en: formData.get("descriptionEn"),
        gr: formData.get("descriptionGr"),
      },
    }],
  };

  const isUpdating = form.getAttribute("data-update-id");
  fetch(`/api/service-categories/${isUpdating || ''}`, {
    method: isUpdating ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serviceData),
  })
  .then(response => response.json())
  .then(() => {
    fetchAndPopulateServices();
    form.reset();
    form.removeAttribute("data-update-id");
  });
}

function fetchAndDisplayServiceDetails() {
  fetch("/api/service-details")
      .then(response => response.json())
      .then(data => populateDetailedServices(data));
}

function populateDetailedServices(details) {
  const detailListDiv = document.getElementById("detail-list");
  const selectedLang = localStorage.getItem("selectedLanguage") || 'en'; // Default to English if no preference is set

  detailListDiv.innerHTML = ""; // Clear existing content before populating

  details.forEach((detail) => {
      const title = detail.title[selectedLang] || detail.title['en']; // Fallback to English if selected language is missing
      const description = detail.description[selectedLang] || detail.description['en']; // Fallback to English if selected language is missing
  
      const detailDiv = document.createElement("div");
      detailDiv.className = "service-detail";
      detailDiv.innerHTML = `
              <h3>${title}</h3>
              <p>${description}</p>
              <button onclick="loadDetailToForm('${detail._id}')">Edit</button>
              <button onclick="deleteDetail('${detail._id}')">Delete</button>
          `;
      detailListDiv.appendChild(detailDiv);
  });
}

// This ensures the detailed services are fetched and displayed upon page load
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayServiceDetails();
});

// Add this to the part where the language is changed
// to ensure detailed services are refreshed according to the new language
dropdownItems.forEach((item) => {
  item.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link action
      const selectedLang = this.getAttribute("data-lang");

      localStorage.setItem("selectedLanguage", selectedLang);
      fetchAndDisplayServiceDetails(); // Refresh the detailed services list
  });
});