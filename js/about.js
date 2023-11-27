async function fetchAndDisplayEmployees() {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`); // Replace with your API endpoint
    const employees = await response.json();

    // Loop through each employee and render them in the appropriate section
    employees.forEach((employee) => {
      renderEmployee(employee);
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
}
function renderEmployee(employee) {
  let storeSections = document.querySelectorAll(".store-section h2");
  let targetSection;

  storeSections.forEach((section) => {
    if (section.textContent.trim() === employee.store) {
      targetSection = section.parentElement;
    }
  });

  if (targetSection) {
    const employeeContent = document.createElement("div");
    employeeContent.className = "employee-content";
    const imageUrl = `${API_BASE_URL}/employee-image/${employee._id}`;
    employeeContent.innerHTML = `
            <img class="employee-img" src="${imageUrl}" alt="Employee Image">
            <p class="employeeDescription">${employee.name.gr}</p>
            <p class="employeeTitle">${employee.title.gr}</p>
        `;
    targetSection.appendChild(employeeContent);
  }
}
const API_BASE_URL = "/api";
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayEmployees();
});
