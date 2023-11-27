// When the page loads, check for a saved language preference
document.addEventListener("DOMContentLoaded", function () {
  const savedLang = localStorage.getItem("selectedLanguage");
  if (savedLang) {
    const selectedLangElement = document.getElementById("selected-lang");
    if (selectedLangElement) {
      // Check if the element exists on the page
      selectedLangElement.setAttribute("data-lang", savedLang);
      selectedLangElement.textContent = savedLang;
      translatePage(savedLang); // Translate page content based on saved language
    }
  }
});

const dropdownItems = document.querySelectorAll(".language-dropdown a");
dropdownItems.forEach((item) => {
  item.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link action
    const selectedLang = this.getAttribute("data-lang");
    const selectedLangElement = document.getElementById("selected-lang");
    if (selectedLangElement) {
      // Check if the element exists on the page
      selectedLangElement.setAttribute("data-lang", selectedLang);
      selectedLangElement.textContent = selectedLang;
      localStorage.setItem("selectedLanguage", selectedLang);
      fetchAndDisplaySEOContent();
      translatePage(selectedLang); // Translate page content based on selected language
    }
  });
});
