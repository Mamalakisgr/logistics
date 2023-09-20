// Utility Functions
async function fetchAPI(url, options = {}) {
  try {
   

    const response = await fetch(url, options);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Failed to fetch: ${response.statusText}`);
  } catch (error) {
    console.error(`Fetch failed: ${error}`);
    return null;
  }
}

// Populate Dropdown with Items from API
async function populateDropdown(apiEndpoint, dropdownId) {
  const items = await fetchAPI(apiEndpoint);
  if (!items) return;
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = '';
  items.forEach((item) => {
    const option = new Option(item._id, item._id);
    dropdown.add(option);
  });
}

// Populate Input Fields with Existing Company Content
async function populateFields() {
  const data = await fetchAPI('/api/company-content');
  if (!data) return;
  Object.entries(data).forEach(([key, value]) => {
    const element = document.getElementById(`${key}Input`);
    if (element) {
      element.value = value;
    }
  });
}
// Handle image uploads for a specific section
async function handleImageUpload(section, formId) {
  try {
    const formData = new FormData(document.getElementById(formId));
     console.log(`Attempting to upload to /api/upload-${section}-image`);
    const response = await fetch(`/api/upload-${section}-image`, {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      console.log(`Successfully uploaded ${section} image:`, data);
      // Optionally, refresh the dropdown or do other UI updates here
    } else {
      console.log(`Failed to upload ${section} image. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to upload ${section} image: ${error}`);
  }
}
// Add your missing functions for updating content here, like updateSectionContent
async function deleteSelectedImage(section) {
  const selectedImageId = document.getElementById(`${section}ImageDropdown`).value;
  const options = {
    method: 'DELETE'
  };
  const response = await fetch(`/api/delete-image/${section}/${selectedImageId}`, options);
  if (response.ok) {
    populateDropdown(`/api/get-${section}-images`, `${section}ImageDropdown`);
  } else {
    console.error(`Failed to delete ${section} image.`);
  }
}
async function updateCurrentImage(section) {
  const selectedImageId = document.getElementById(`${section}ImageDropdown`).value;
  const options = {
    method: 'PUT'
  };
  const response = await fetch(`/api/set-active-image/${section}/${selectedImageId}`, options);
  if (response.ok) {
    console.log(`Successfully set active ${section} image.`);
    alert("Image updated. Please refresh the company.html page to see the changes.");
  } else {
    console.error(`Failed to set active ${section} image.`);
  }
}
// Function to Update All Section Content
async function updateAllSections() {
  try {
    const historyTitle = document.getElementById('historyTitleInput').value;
    const historyDescription = document.getElementById('historyDescriptionInput').value;
    const valuesTitle = document.getElementById('valuesTitleInput').value;
    const valuesDescription = document.getElementById('valuesDescriptionInput').value;
    const visionTitle = document.getElementById('visionTitleInput').value;
    const visionDescription = document.getElementById('visionDescriptionInput').value;

    const response = await fetch('/api/company-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        historyTitle,
        historyDescription,
        valuesTitle,
        valuesDescription,
        visionTitle,
        visionDescription,
      }),
    });

    if (response.ok) {
      console.log('Successfully updated all sections.');
    } else {
      console.log('Failed to update all sections.');
    }
  } catch (error) {
    console.error(`Failed to update all sections: ${error}`);
  }
}

// DOM Loaded Event
document.addEventListener('DOMContentLoaded', () => {
  populateFields();
  // Add lazy loading
  const lazyLoadSections = document.querySelectorAll('.lazy-load');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const section = entry.target;
        const bgImage = section.getAttribute('data-bg-image');
        if (bgImage) {
          section.style.backgroundImage = `url('${bgImage}')`;
          section.classList.remove('lazy-load');
          observer.unobserve(section);
        }
      }
    });
  });

  lazyLoadSections.forEach((section) => observer.observe(section));

  ['history', 'values', 'vision'].forEach((section) => {
    const updateBtnId = `update${section.charAt(0).toUpperCase() + section.slice(1)}Image`;
    const deleteBtnId = `delete${section.charAt(0).toUpperCase() + section.slice(1)}Image`;
    const formId = `${section}ImageForm`;
    const updateBtn = document.getElementById(updateBtnId);
    const deleteBtn = document.getElementById(deleteBtnId);
    const form = document.getElementById(formId);
    const saveBtn = document.getElementById(`save${section.charAt(0).toUpperCase() + section.slice(1)}Button`);
// Add event listener for the Save button for each section
['history', 'values', 'vision'].forEach((section) => {
  const saveBtn = document.getElementById(`save${section.charAt(0).toUpperCase() + section.slice(1)}Button`);
  if (saveBtn) {
    saveBtn.addEventListener('click', updateAllSections);
  }
});
    if (updateBtn && deleteBtn && form && saveBtn) {
      // populate dropdowns, attach event listeners
      populateDropdown(`/api/get-${section}-images`, `${section}ImageDropdown`);
      updateBtn.addEventListener('click', () => updateCurrentImage(section));
      deleteBtn.addEventListener('click', () => deleteSelectedImage(section));
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleImageUpload(section, formId);
      });
    }
  })
});
