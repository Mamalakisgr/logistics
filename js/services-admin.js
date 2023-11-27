document.addEventListener("DOMContentLoaded", function () {
  const serviceForm = document.getElementById("service-form");

  // Load existing service categories
  fetch("/api/service-categories")
    .then((response) => response.json())
    .then((data) => {
      populateServiceList(data);
    });

  // Handle form submission for adding or updating
  serviceForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const categoryName = document.getElementById("categoryName").value;
    const serviceName = document.getElementById("serviceName").value;
    const description = document.getElementById("description").value;

    const serviceData = {
      categoryName,
      services: [
        {
          serviceName,
          description,
        },
      ],
    };

    const isUpdating = serviceForm.getAttribute("data-update-id");
    const method = isUpdating ? "PUT" : "POST";
    const endpoint = isUpdating
      ? `/api/service-categories/${isUpdating}`
      : "/api/service-categories";

    // Make an API call to add/update the service category
    fetch(endpoint, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          isUpdating ? "Service category updated:" : "Service category added:",
          data
        );
        // Refresh the service list
        return fetch("/api/service-categories");
      })
      .then((response) => response.json())
      .then((data) => {
        populateServiceList(data);
        // Reset the form and clear update id attribute
        serviceForm.reset();
        serviceForm.removeAttribute("data-update-id");
      });
  });
});

const serviceListDiv = document.getElementById("service-list");
// Utility function to populate service list with edit options
function populateServiceList(services) {
  serviceListDiv.innerHTML = ""; // Clear existing content
  services.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `
            <h3>${category.categoryName}</h3>
            ${category.services
              .map(
                (service) => `
                <div>
                    <p>${service.serviceName}: ${service.description}</p>
                </div>
            `
              )
              .join("")}
            <button onclick="loadCategoryToForm('${
              category._id
            }')">Edit</button>
            <button onclick="deleteCategories('${
              category._id
            }')">Delete</button>
        `;
    serviceListDiv.appendChild(categoryDiv);
  });
}

// Delete a detailed service
function deleteCategories(id) {
  fetch(`/api/service-categories/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      // Refresh the detail list after deletion
      return fetch("/api/service-categories");
    })
    .then((response) => response.json())
    .then((data) => {
      populateServiceList(data);
    });
}

// Load a category to the form for editing
function loadCategoryToForm(id) {
  fetch(`/api/service-categories/${id}`)
    .then((response) => response.json())
    .then((category) => {
      document.getElementById("categoryName").value = category.categoryName;
      // For simplicity, loading only the first service for editing. Can be enhanced for multiple services.
      document.getElementById("serviceName").value =
        category.services[0].serviceName;
      document.getElementById("description").value =
        category.services[0].description;
      document
        .getElementById("service-form")
        .setAttribute("data-update-id", category._id);
    });
}

// Load existing detailed services
fetch("/api/service-details")
  .then((response) => response.json())
  .then((data) => {
    populateDetailList(data);
  });

const detailForm = document.getElementById("detail-form");
const detailListDiv = document.getElementById("detail-list");

// Utility function to populate detailed service list with edit and delete options
function populateDetailList(details) {
  detailListDiv.innerHTML = ""; // Clear existing content
  details.forEach((detail) => {
    const detailDiv = document.createElement("div");
    detailDiv.innerHTML = `
            <h3>${detail.title}</h3>
            <p>${detail.description}</p>
            <button onclick="loadDetailToForm('${detail._id}')">Edit</button>
            <button onclick="deleteDetail('${detail._id}')">Delete</button>
        `;
    detailListDiv.appendChild(detailDiv);
  });
}

// Load a detail to the form for editing
function loadDetailToForm(id) {
  fetch(`/api/service-details/${id}`)
    .then((response) => response.json())
    .then((detail) => {
      document.getElementById("detailTitle").value = detail.title;
      document.getElementById("detailDescription").value = detail.description;
      detailForm.setAttribute("data-update-id", detail._id);
    });
}

// Delete a detailed service
function deleteDetail(id) {
  fetch(`/api/service-details/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      // Refresh the detail list after deletion
      return fetch("/api/service-details");
    })
    .then((response) => response.json())
    .then((data) => {
      populateDetailList(data);
    });
}

// Handle form submission for adding or updating detailed services
detailForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("detailTitle").value;
  const description = document.getElementById("detailDescription").value;

  const detailData = {
    title,
    description,
  };

  const isUpdating = detailForm.getAttribute("data-update-id");
  const method = isUpdating ? "PUT" : "POST";
  const endpoint = isUpdating
    ? `/api/service-details/${isUpdating}`
    : "/api/service-details";

  // Make an API call to add/update the detailed service
  fetch(endpoint, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(detailData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(
        isUpdating ? "Detailed service updated:" : "Detailed service added:",
        data
      );
      // Refresh the detail list
      return fetch("/api/service-details");
    })
    .then((response) => response.json())
    .then((data) => {
      populateDetailList(data);
      // Reset the form and clear update id attribute
      detailForm.reset();
      detailForm.removeAttribute("data-update-id");
    });
});
