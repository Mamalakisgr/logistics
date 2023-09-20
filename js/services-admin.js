// services-admin.js
document.addEventListener("DOMContentLoaded", function() {
    const serviceForm = document.getElementById("service-form");
    
    // Load existing services
    fetch("/api/services")
      .then(response => response.json())
      .then(data => {
        // Populate #service-list
      });
    
    // Handle form submission
    serviceForm.addEventListener("submit", function(event) {
      event.preventDefault();
      
      const categoryName = document.getElementById("categoryName").value;
      const serviceName = document.getElementById("serviceName").value;
      const description = document.getElementById("description").value;
      
      const serviceData = {
        categoryName,
        services: [
          {
            serviceName,
            description
          }
        ]
      };
      
      // Make an API call to add the service
      fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(serviceData)
      })
      .then(response => response.json())
      .then(data => {
        console.log("Service added:", data);
        // Refresh the service list
      });
    });
  });