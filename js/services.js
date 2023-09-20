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



document.addEventListener("DOMContentLoaded", function() {
    fetchAndDisplayLogo('logo-image'); 
    const serviceList = document.getElementById("service-list");
  
    // Fetch existing services from the server
    fetch("/api/services")
      .then(response => response.json())
      .then(data => {
        // Populate the service list
        data.forEach(category => {
          const categoryDiv = document.createElement("div");
          categoryDiv.className = "service-category";
          
          const categoryName = document.createElement("h2");
          categoryName.innerText = category.categoryName;
          
          categoryDiv.appendChild(categoryName);
          
          category.services.forEach(service => {
            const serviceDiv = document.createElement("div");
            serviceDiv.className = "service-detail";
            
            const serviceName = document.createElement("h3");
            serviceName.innerText = service.serviceName;
            
            const serviceDescription = document.createElement("p");
            serviceDescription.innerText = service.description;
            
            serviceDiv.appendChild(serviceName);
            serviceDiv.appendChild(serviceDescription);
            categoryDiv.appendChild(serviceDiv);
          });
          
          serviceList.appendChild(categoryDiv);
        });
      });
  });