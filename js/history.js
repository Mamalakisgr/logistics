// Constants for default languages
const DEFAULT_LANG = 'En';
const FALLBACK_LANG = 'Gr';
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
  
// Utility function to fetch and display image
const displayImage = async (url, elementId) => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            const element = document.getElementById(elementId);
            if (element) {
                if (element.tagName === 'IMG') {
                    element.src = imageUrl;
                } else {
                    element.style.backgroundImage = `url(${imageUrl})`;
                }
            }
        } else {
            console.error(`Failed to fetch image from ${url}`);
        }
    } catch (error) {
        console.error(`Error fetching image from ${url}:`, error);
    }
};

const fetchAndUpdateHistoryContent = async (lang = DEFAULT_LANG) => {
    try {
        const response = await fetch('/api/company-content');
        if (response.ok) {
            const data = await response.json();
            
            const titleLang = data.historyTitle?.[lang] ? lang : FALLBACK_LANG;
            const descLang = data.historyDescription?.[lang] ? lang : FALLBACK_LANG;

            document.getElementById('historyTitle').textContent = data.historyTitle[titleLang];
            document.getElementById('historyDescription').textContent = data.historyDescription[descLang];

            // Fetch and update images for history
            await displayImage('/api/history-image', 'history-section');
        } else {
            console.error('Failed to fetch company content');
        }
    } catch (error) {
        console.error('Error fetching company content:', error);
    }
};

document.querySelector('.language-dropdown').addEventListener('click', (event) => {
    const lang = event.target.getAttribute('data-lang');
    if (lang) {
        localStorage.setItem('selectedLanguage', lang);
        document.getElementById('selected-lang').textContent = lang === 'gr' ? FALLBACK_LANG : DEFAULT_LANG;
        fetchAndUpdateHistoryContent(lang);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetchAndDisplayLogo("logo-image"); // Fetch and display header logo
    const savedLang = localStorage.getItem("selectedLanguage") || DEFAULT_LANG;
    const selectedLangElement = document.getElementById("selected-lang");
    if (selectedLangElement) {
        selectedLangElement.setAttribute("data-lang", savedLang);
        selectedLangElement.textContent = savedLang;
        fetchAndUpdateHistoryContent(savedLang);
    }
});
