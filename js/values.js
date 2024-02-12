// Constants for default languages
// const DEFAULT_LANG = 'En';
// const FALLBACK_LANG = 'Gr';
// const fetchAndDisplayLogo = async (elementId) => {
//     try {
//       const logoImage = document.getElementById(elementId);

//       if (!logoImage) {
//         console.error(`${elementId} element not found.`);
//         return;
//       }

//       const response = await fetch("/api/active-logo");

//       if (response.ok) {
//         const imageBlob = await response.blob();
//         const imageUrl = URL.createObjectURL(imageBlob);
//         logoImage.src = imageUrl;
//       } else {
//         console.error("Image not found");
//       }
//     } catch (error) {
//       console.error("There was a problem", error);
//     }
//   };

// Utility function to fetch and display image
// const displayImage = async (url, elementId) => {
//     try {
//         const response = await fetch(url);
//         if (response.ok) {
//             const imageBlob = await response.blob();
//             const imageUrl = URL.createObjectURL(imageBlob);
//             const imgElement = document.getElementById(elementId);
//             if (imgElement && imgElement.tagName === 'IMG') {
//                 // Hide img element by default
//                 imgElement.style.display = 'none';
//                 imgElement.onload = () => {
//                     // Show img element when the image is loaded
//                     imgElement.style.display = 'block';
//                 };
//                 // Set src attribute which will start loading the image
//                 imgElement.src = imageUrl;
//             }  else {
//                 console.error(`Element with id ${elementId} is not an img tag or does not exist`);
//             }
//         } else {
//             console.error(`Failed to fetch image from ${url}`);
//         }
//     } catch (error) {
//         console.error(`Error fetching image from ${url}:`, error);
//     }
// };

const fetchAndUpdateValuesContent = async (lang = DEFAULT_LANG) => {
  try {
    const response = await fetch("/api/company-content");
    if (response.ok) {
      const data = await response.json();

      // const titleLang = data.valuesTitle?.[lang] ? lang : FALLBACK_LANG;
      // const descLang = data.valuesDescription?.[lang] ? lang : FALLBACK_LANG;

      // document.getElementById('valuesTitle').textContent = data.valuesTitle[titleLang];
      // document.getElementById('valuesDescription').textContent = data.valuesDescription[descLang];

      // Fetch and update images for history
      await displayImage("/api/values-image", "values-image");
    } else {
      console.error("Failed to fetch company content");
    }
  } catch (error) {
    console.error("Error fetching company content:", error);
  }
};

document
  .querySelector(".language-dropdown")
  .addEventListener("click", (event) => {
    const lang = event.target.getAttribute("data-lang");
    if (lang) {
      localStorage.setItem("selectedLanguage", lang);
      document.getElementById("selected-lang").textContent =
        lang === "gr" ? FALLBACK_LANG : DEFAULT_LANG;
      fetchAndUpdateValuesContent(lang);
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayLogo("logo-image"); // Fetch and display header logo
  fetchAndDisplayLogo("side-logo-image");

  const savedLang = localStorage.getItem("selectedLanguage") || DEFAULT_LANG;
  const selectedLangElement = document.getElementById("selected-lang");
  if (selectedLangElement) {
    selectedLangElement.setAttribute("data-lang", savedLang);
    selectedLangElement.textContent = savedLang;
    fetchAndUpdateValuesContent(savedLang);
  }
});
