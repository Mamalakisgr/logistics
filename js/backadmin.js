





// Function to handle logo selection
const handleLogoSelection = async () => {
  try {
    const selectedLogoId = document.getElementById('logo-dropdown').value;

    const response = await fetch('/api/select-logo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ logoId: selectedLogoId }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Successfully selected logo:", responseData);
    } else {
      const errorData = await response.json();
      console.error('Error in selecting logo:', errorData);
    }
  } catch (error) {
    console.error('There was a problem with logo selection:', error);
  }
};

// Function to handle image uploads (either logo or banner)
async function handleImageUpload(imageType, formId) {
  const formData = new FormData(document.getElementById(formId));
  try {
    const response = await fetch(`/api/upload-${imageType}`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(`Successfully uploaded ${imageType}:`, responseData);
      // Optionally refresh banners or logos if needed
    } else {
      const errorData = await response.json();
      console.error(`Error in uploading ${imageType}:`, errorData);
    }
  } catch (error) {
    console.error(`There was a problem with ${imageType} upload:`, error);
  }
}

// // Function to handle SEO image uploads
// async function handleSeoImageUpload(formId) {
//   const formData = new FormData(document.getElementById(formId));
//   try {
//     const response = await fetch(`/api/upload-seo-image`, {
//       method: 'POST',
//       body: formData
//     });

//     if (response.ok) {
//       const responseData = await response.json();
//       console.log('Successfully uploaded SEO image:', responseData);
//     } else {
//       const errorData = await response.json();
//       console.error('Error in uploading SEO image:', errorData);
//     }
//   } catch (error) {
//     console.error('There was a problem with SEO image upload:', error);
//   }
// }

// // Function to populate the SEO Image Dropdown
// const updateSeoImageDropdown = async () => {
//   try {
//     const response = await fetch('/api/seoimages');
//     const seoImages = await response.json();

//     const seoImageDropdown = document.getElementById('seo-image-dropdown');
//     // Clear existing options
//     seoImageDropdown.innerHTML = '';

//     seoImages.forEach(image => {
//       const option = document.createElement('option');
//       option.value = image._id;
//       option.innerText = image.name;  // Assuming you have a name field for seoimages
//       seoImageDropdown.appendChild(option);
//     });
//   } catch (error) {
//     console.error('There was a problem updating the SEO image dropdown:', error);
//   }
// };

// Function to update the Banner Dropdown
const updateBannerDropdown = async () => {
  try {
    const response = await fetch('/api/banners');
    const banners = await response.json();

    const bannerDropdown = document.getElementById('banner-dropdown');
    // Clear existing options
    bannerDropdown.innerHTML = '';

    banners.forEach(banner => {
      const option = document.createElement('option');
      option.value = banner._id;
      option.innerText = banner.name;  // Assuming you have a name field for banners
      bannerDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('There was a problem updating the banner dropdown:', error);
  }
};

// Function to handle banner deletion
const handleBannerDeletion = async () => {
  try {
    const selectedBannerId = document.getElementById('banner-dropdown').value;

    const response = await fetch(`/api/delete-banner/${selectedBannerId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log("Successfully deleted banner");
      // Remove the deleted banner from the dropdown
      updateBannerDropdown();
    } else {
      const errorData = await response.json();
      console.error('Error in deleting banner:', errorData);
    }
  } catch (error) {
    console.error('There was a problem with banner deletion:', error);
  }
};





// Function to fetch existing SEO content and populate the input fields
const fetchSeoContent = async () => {
  try {
    const response = await fetch('/api/seo-content');
    const data = await response.json();

    document.getElementById('titleInput').value = data.title;
    document.getElementById('descriptionInput').value = data.description;
  } catch (error) {
    console.error('There was a problem fetching SEO content:', error);
  }
};

// Function to handle SEO content update
const handleSeoContentUpdate = async () => {
  try {
    const title = document.getElementById('titleInput').value;
    const description = document.getElementById('descriptionInput').value;

    const response = await fetch('/api/seo-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Successfully updated SEO content:', data);
    } else {
      const errorData = await response.json();
      console.error('Error in updating SEO content:', errorData);
    }
  } catch (error) {
    console.error('There was a problem updating SEO content:', error);
  }
};// Function to update dynamic title and description
const updateDynamicTitleAndDescription = async () => {
  try {
    const dynamicTitle = document.getElementById('dynamicTitleInput').value;
    const dynamicDescription = document.getElementById('dynamicDescriptionInput').value;

    // Send the title and description to the server
    const response = await fetch('/api/update-dynamic-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: dynamicTitle,
        description: dynamicDescription,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Successfully updated dynamic content:', data);
    } else {
      const errorData = await response.json();
      console.error('Error in updating dynamic content:', errorData);
    }
  } catch (error) {
    console.error('There was a problem updating dynamic content:', error);
  }
};
// Function to fetch and populate existing dynamic content
const fetchAndPopulateDynamicContent = async () => {
  try {
    const response = await fetch('/api/update-dynamic-content'); // Replace with your actual API endpoint
    if (response.ok) {
      const data = await response.json();
      document.getElementById('dynamicTitleInput').value = data.title;
      document.getElementById('dynamicDescriptionInput').value = data.description;
    } else {
      console.error('Failed to fetch existing dynamic content');
    }
  } catch (error) {
    console.error('Error fetching existing dynamic content:', error);
  }
};
// Add an event listener to the "Save" button for dynamic content
const saveDynamicContentButton = document.getElementById('saveDynamicContentButton');
if (saveDynamicContentButton) {
  saveDynamicContentButton.addEventListener('click', updateDynamicTitleAndDescription);
}

const saveSeoContentButton = document.getElementById('saveSeoContentButton');
saveSeoContentButton.addEventListener('click', handleSeoContentUpdate);

// DOM Loaded Event
document.addEventListener('DOMContentLoaded', function() {
  fetchSeoContent();
  document.getElementById('banner-upload-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting via default HTML action
    handleImageUpload('banner', 'banner-upload-form'); // Call your existing handleImageUpload function
  });
  document.getElementById('logo-upload-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting via default HTML action
    handleImageUpload('logo', 'logo-upload-form'); // Call your existing handleImageUpload function
  });

  fetch('/api/logos')
    .then(response => response.json())
    .then(logos => {
      const logoDropdown = document.getElementById('logo-dropdown');  
      logos.forEach(logo => {
        const option = document.createElement('option');
        option.value = logo._id;
        option.innerText = logo.name;  
        logoDropdown.appendChild(option);  
      });
    });

  updateBannerDropdown();
  fetchAndPopulateDynamicContent();
  // Logo selection event - now using handleLogoSelection function
  document.getElementById('select-logo-button').addEventListener('click', handleLogoSelection);
  document.getElementById('delete-banner-button').addEventListener('click', handleBannerDeletion);
  document.getElementById('seo-image-upload-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting via default HTML action
    handleSeoImageUpload('seo-image-upload-form');
  });
  updateSeoImageDropdown();
});
