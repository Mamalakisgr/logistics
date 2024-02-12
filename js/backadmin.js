const handleLogoSelection = async () => {
  try {
    const selectedLogoId = document.getElementById("logo-dropdown").value;

    const response = await fetch("/api/select-logo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ logoId: selectedLogoId }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Successfully selected logo:", responseData);
    } else {
      const errorData = await response.json();
      console.error("Error in selecting logo:", errorData);
    }
  } catch (error) {
    console.error("There was a problem with logo selection:", error);
  }
};
// Function to handle image uploads (either logo or banner)
async function handleImageUpload(imageType, formId) {
  const formData = new FormData(document.getElementById(formId));
  try {
    const response = await fetch(`/api/upload-${imageType}`, {
      method: "POST",
      body: formData,
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

// Function to handle SEO image uploads
async function handleSeoImageUpload(formId) {
  const formData = new FormData(document.getElementById(formId));
  try {
    const response = await fetch(`/api/upload-seo`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Successfully uploaded SEO image:", responseData);
    } else {
      const errorData = await response.json();
      console.error("Error in uploading SEO image:", errorData);
    }
  } catch (error) {
    console.error("There was a problem with SEO image upload:", error);
  }
}
const handleDeleteSeoImage = async () => {
  try {
    const selectedSeoImageId =
      document.getElementById("seo-image-dropdown").value;

    if (!selectedSeoImageId) {
      console.error("No SEO image selected for deletion.");
      return;
    }

    const response = await fetch(
      `/api/delete-seo-image/${selectedSeoImageId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      console.log("Successfully deleted SEO image:", responseData);
      // Optionally refresh the SEO image list after deletion
    } else {
      const errorData = await response.json();
      console.error("Error in deleting SEO image:", errorData);
    }
  } catch (error) {
    console.error("There was a problem with SEO image deletion:", error);
  }
};
// Function to populate the SEO Image Dropdown
const updateSeoImageDropdown = async () => {
  try {
    const response = await fetch("/api/seoimages");
    const seoImages = await response.json();

    const dropdown = document.getElementById("seo-image-dropdown");
    dropdown.innerHTML = ""; // Clear existing options

    seoImages.forEach((img) => {
      const option = document.createElement("option");
      option.value = img._id;
      option.innerText = `Image ID: ${img._id} (${img.contentType})`; // Adjust the display format as needed
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error(
      "There was a problem populating the SEO image dropdown:",
      error
    );
  }
};
const handleSeoImageSelection = async () => {
  try {
    const selectedSeoImageId =
      document.getElementById("seo-image-dropdown").value;

    const response = await fetch("/api/select-seo-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seoImageId: selectedSeoImageId }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Successfully selected SEO image:", responseData);
    } else {
      const errorData = await response.json();
      console.error("Error in selecting SEO image:", errorData);
    }
  } catch (error) {
    console.error("There was a problem with SEO image selection:", error);
  }
};

// Function to update the Banner Dropdown
const updateBannerDropdown = async () => {
  try {
    const response = await fetch("/api/banners");
    const banners = await response.json();

    const bannerDropdown = document.getElementById("banner-dropdown");
    // Clear existing options
    bannerDropdown.innerHTML = "";

    banners.forEach((banner) => {
      const option = document.createElement("option");
      option.value = banner._id;
      option.innerText = banner.name; // Assuming you have a name field for banners
      bannerDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("There was a problem updating the banner dropdown:", error);
  }
};

// Function to handle banner deletion
const handleBannerDeletion = async () => {
  try {
    const selectedBannerId = document.getElementById("banner-dropdown").value;

    const response = await fetch(`/api/delete-banner/${selectedBannerId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Successfully deleted banner");
      // Remove the deleted banner from the dropdown
      updateBannerDropdown();
    } else {
      const errorData = await response.json();
      console.error("Error in deleting banner:", errorData);
    }
  } catch (error) {
    console.error("There was a problem with banner deletion:", error);
  }
};
// Function to fetch existing SEO content and populate the input fields
const fetchSeoContent = async () => {
  try {
    const lang = getCurrentLanguage();
    const response = await fetch(`/api/seo-content?lang=${lang}`);
    const data = await response.json();

    const titleInputId = lang === "en" ? "titleInputEn" : "titleInputGr";
    const descriptionInputId =
      lang === "en" ? "descriptionInputEn" : "descriptionInputGr";
    console.log(`Fetching content for language: ${lang}`);

    document.getElementById(titleInputId).value = data.title;
    document.getElementById(descriptionInputId).value = data.description;
  } catch (error) {
    console.error("There was a problem fetching SEO content:", error);
  }
};

const languageDropdownItems = document.querySelectorAll(".language-dropdown a");

const getCurrentLanguage = () => {
  if (document.getElementById("englishInputs").style.display !== "none") {
    return "en";
  } else if (document.getElementById("greekInputs").style.display !== "none") {
    return "gr";
  }
  // Default to 'gr' or throw an error if neither is visible
  return "gr";
};

languageDropdownItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    const selectedLang = e.target.textContent.trim();
    document.getElementById("selected-lang").textContent = selectedLang;

    // Refetch the SEO content based on the new language
    fetchSeoContent();
  });
});

const handleSeoContentUpdate = async () => {
  try {
    const lang = getCurrentLanguage();
    const titleInputId = lang === "en" ? "titleInputEn" : "titleInputGr";
    const descriptionInputId =
      lang === "en" ? "descriptionInputEn" : "descriptionInputGr";

    const title = document.getElementById(titleInputId).value;
    const description = document.getElementById(descriptionInputId).value;

    const payload = {};

    if (lang === "gr") {
      payload.titleGr = title;
      payload.descriptionGr = description;
    } else {
      payload.titleEn = title;
      payload.descriptionEn = description;
    }

    const response = await fetch("/api/seo-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Successfully updated SEO content:", data);
    } else {
      const errorData = await response.json();
      console.error("Error in updating SEO content:", errorData);
    }
  } catch (error) {
    console.error("There was a problem updating SEO content:", error);
  }
};

// Function to update the dynamic company count
// const updateDynamicCompanyCount = async () => {
//   try {
//     // Get the number of companies from the counter element
//     const CompanyCount = document.getElementById('counter').textContent;

//     // Send the company count to the server
//     const response = await fetch('/api/update-company-count', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         count: CompanyCount,
//       }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log('Successfully updated company count:', data);
//     } else {
//       const errorData = await response.json();
//       console.error('Error in updating company count:', errorData);
//     }
//   } catch (error) {
//     console.error('There was a problem updating company count:', error);
//   }
// };

// Function to fetch and populate the dynamic company count
// const fetchAndPopulateCompanyCount = async () => {
//   try {
//     const response = await fetch('/api/get-company-count');
//     if (response.ok) {
//       const data = await response.json();
//       document.getElementById('counter').textContent = data.count;
//     } else {
//       console.error('Failed to fetch company count');
//     }
//   } catch (error) {
//     console.error('Error fetching company count:', error);
//   }
// };

// Function to update dynamic title and description
// const updateDynamicTitleAndDescription = async () => {
//   try {
//     const dynamicTitle = document.getElementById('dynamicTitleInput').value;
//     const dynamicDescription = document.getElementById('dynamicDescriptionInput').value;

//     // Send the title and description to the server
//     const response = await fetch('/api/update-dynamic-content', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         title: dynamicTitle,
//         description: dynamicDescription,
//       }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log('Successfully updated dynamic content:', data);
//     } else {
//       const errorData = await response.json();
//       console.error('Error in updating dynamic content:', errorData);
//     }
//   } catch (error) {
//     console.error('There was a problem updating dynamic content:', error);
//   }
// };
// // Function to fetch and populate existing dynamic content
// const fetchAndPopulateDynamicContent = async () => {
//   try {
//     const response = await fetch('/api/update-dynamic-content'); // Replace with your actual API endpoint
//     if (response.ok) {
//       const data = await response.json();
//       document.getElementById('dynamicTitleInput').value = data.title;
//       document.getElementById('dynamicDescriptionInput').value = data.description;
//     } else {
//       console.error('Failed to fetch existing dynamic content');
//     }
//   } catch (error) {
//     console.error('Error fetching existing dynamic content:', error);
//   }
// };
// // Add an event listener to the "Save" button for dynamic content
// const saveDynamicContentButton = document.getElementById('saveDynamicContentButton');
// if (saveDynamicContentButton) {
//   saveDynamicContentButton.addEventListener('click', updateDynamicTitleAndDescription);
// }
// Populate the region one images dropdown

const populateRegionOneImagesDropdown = async () => {
  try {
    const response = await fetch("/api/fetch-all-region-one-images");
    const images = await response.json();

    const dropdown = document.getElementById("regionOneImagesDropdown");
    dropdown.innerHTML = ""; // Clear existing options

    images.forEach((image) => {
      const option = document.createElement("option");
      option.value = image._id; // Assuming each image has a unique ID
      option.textContent = image.name; // Assuming each image has a name
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching region one images:", error);
  }
};
// Handle the image selection

const fetchAndPopulateDescription = async () => {
  try {
    const response = await fetch("/api/get-description");
    if (response.ok) {
      const data = await response.json();
      const descriptionInput = document.getElementById("descriptionInput-2");
      if (descriptionInput) {
        descriptionInput.value = data.description;
      } else {
        console.error(
          'Failed to find input element with ID "descriptionInput"'
        );
      }
    } else {
      console.error("Failed to fetch description");
    }
  } catch (error) {
    console.error("Error fetching description:", error);
  }
};
const handleDescriptionUpdate = async () => {
  try {
    const descriptionInput = document.getElementById("descriptionInput-2");
    if (descriptionInput) {
      const description = descriptionInput.value;
      const response = await fetch("/api/update-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Successfully updated description:", data);
      } else {
        const errorData = await response.json();
        console.error("Error in updating description:", errorData);
      }
    } else {
      console.error('Failed to find input element with ID "descriptionInput"');
    }
  } catch (error) {
    console.error("There was a problem updating the description:", error);
  }
};
// Function to fetch and populate the dynamic company count in backoffice.html
const fetchAndPopulateCompanyCountInBackoffice = async () => {
  try {
    const response = await fetch("/api/get-company-count");
    if (response.ok) {
      const data = await response.json();
      const companyCountInput = document.getElementById("editNumberInput");

      // Ensure the input element exists before setting its value
      if (companyCountInput) {
        companyCountInput.value = data.count;
      } else {
        console.error('Failed to find input element with ID "editNumberInput"');
      }
    } else {
      console.error("Failed to fetch company count");
    }
  } catch (error) {
    console.error("Error fetching company count:", error);
  }
};

const handleRegionOneImageSelection = async () => {
  try {
    const selectedImageId = document.getElementById(
      "regionOneImagesDropdown"
    ).value;

    const response = await fetch("/api/select-region-one-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId: selectedImageId }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Successfully selected Region One image:", responseData);

      // Fetch the now-active image and set it on the frontend
      //  handleRegionOneImage();  // Reuse the function you have
    } else {
      const errorData = await response.json();
      console.error("Error in selecting Region One image:", errorData);
    }
  } catch (error) {
    console.error(
      "There was a problem with Region One image selection:",
      error
    );
  }
};
const handleDeleteRegionOneImage = async () => {
  try {
    const selectedImageId = document.getElementById(
      "regionOneImagesDropdown"
    ).value;

    if (!selectedImageId) {
      console.error("No Region One image selected for deletion.");
      return;
    }

    const response = await fetch(
      `/api/delete-region-one-image/${selectedImageId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      console.log("Successfully deleted Region One image:", responseData);

      // Optionally refresh the Region One image list after deletion
      populateRegionOneImagesDropdown();
    } else {
      const errorData = await response.json();
      console.error("Error in deleting Region One image:", errorData);
    }
  } catch (error) {
    console.error("There was a problem with Region One image deletion:", error);
  }
};
const handleSetRegionOneImageAsActive = async () => {
  try {
    const selectedImageId = document.getElementById(
      "regionOneImagesDropdown"
    ).value;

    const response = await fetch("/api/select-region-one-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId: selectedImageId }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Successfully set image as active:", data);

      // Optionally, refresh the image in the main page if needed
      //handleRegionOneImage();
    } else {
      const errorData = await response.json();
      console.error("Error in setting image as active:", errorData);
    }
  } catch (error) {
    console.error("There was a problem setting the image as active:", error);
  }
};

const saveSeoContentButton = document.getElementById("saveSeoContentButton");
saveSeoContentButton.addEventListener("click", handleSeoContentUpdate);
const handleRegionOneImage = () => {
  const regionOneImageForm = document.getElementById("regionOneImageForm");

  regionOneImageForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(regionOneImageForm);

    fetch("/api/upload-region-one-image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.message) {
          console.log(data.message);
        } else {
          console.error("Unexpected server response:", data);
        }
      })
      .catch((error) => {
        console.error("Error uploading the image:", error);
      });
  });
};
// DOM Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("showEnglishInputs")
    .addEventListener("click", function () {
      document.getElementById("englishInputs").style.display = "block";
      document.getElementById("greekInputs").style.display = "none";
      fetchSeoContent(); // Fetch content after changing language
    });

  document
    .getElementById("showGreekInputs")
    .addEventListener("click", function () {
      document.getElementById("englishInputs").style.display = "none";
      document.getElementById("greekInputs").style.display = "block";
      fetchSeoContent(); // Fetch content after changing language
    });

  fetchSeoContent();
  document
    .getElementById("delete-seo-image-button")
    .addEventListener("click", handleDeleteSeoImage);

  document
    .getElementById("select-seo-image-button")
    .addEventListener("click", handleSeoImageSelection);

  document
    .getElementById("banner-upload-form")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the form from submitting via default HTML action
      handleImageUpload("banner", "banner-upload-form"); // Call your existing handleImageUpload function
    });
  document
    .getElementById("logo-upload-form")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the form from submitting via default HTML action
      handleImageUpload("logo", "logo-upload-form"); // Call your existing handleImageUpload function
    });
  document
    .getElementById("delete-region-one-image-button")
    .addEventListener("click", handleDeleteRegionOneImage);

  fetchAndPopulateCompanyCountInBackoffice();
  fetch("/api/logos")
    .then((response) => response.json())
    .then((logos) => {
      const logoDropdown = document.getElementById("logo-dropdown");
      logos.forEach((logo) => {
        const option = document.createElement("option");
        option.value = logo._id;
        option.innerText = logo.name;
        logoDropdown.appendChild(option);
      });
    });
  const editNumberForm = document.getElementById("edit-number-form");
  const editNumberInput = document.getElementById("editNumberInput");
  handleRegionOneImage();

  editNumberForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from actually submitting and causing a page reload

    const countValue = parseInt(editNumberInput.value);

    // Check if the input value is a valid number
    if (isNaN(countValue)) {
      alert("Please enter a valid number.");
      return;
    }

    fetch("/api/update-company-count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ count: countValue }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.count !== undefined) {
          alert(`Company count updated successfully to ${data.count}!`);
        } else {
          alert("Error updating the company count.");
        }
      })
      .catch((error) => {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
      });
  });
  fetchAndPopulateDescription();
  updateBannerDropdown();
  // fetchAndPopulateDynamicContent();
  // Logo selection event - now using handleLogoSelection function
  document
    .getElementById("select-logo-button")
    .addEventListener("click", handleLogoSelection);
  document
    .getElementById("delete-banner-button")
    .addEventListener("click", handleBannerDeletion);
  document
    .getElementById("seo-image-upload-form")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the form from submitting via default HTML action
      handleSeoImageUpload("seo-image-upload-form");
    });
  document
    .getElementById("selectRegionOneImageButton")
    .addEventListener("click", handleRegionOneImageSelection);
  updateSeoImageDropdown();
  populateRegionOneImagesDropdown();
});
