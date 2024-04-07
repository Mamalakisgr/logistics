const DEFAULT_LANG = "en";
const FALLBACK_LANG = "gr";
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
const newsTextContent = {
  en: {
    news1:{
      title: "Stay Updated with Our Latest News",
     description:"At LoyalTax, we are committed to keeping you informed about the latest developments, trends, and updates in our field."
  
    } ,
    news2:{
      title: "Explore more",
      description: "In loyal tax etc."
    }
  },
  gr: {
    news1:{
      title: "Μείνετε ενημερωμένοι με τα τελευταία μας νέα",
      description:"Στη LoyalTax, δεσμευόμαστε να σας κρατάμε ενήμερους για τις τελευταίες εξελίξεις, τάσεις και ενημερώσεις στον τομέα μας"
  },
  news2:{
    title: "Ανακαλύψτε περισσότερα εδώ",
    description: "Στη LoyalTax πιστεύουμε στη δύναμη της Ομάδας. Προωθούμε και ευνοούμε καθημερινά τη συνεργασία μεταξύ των μελών της ομάδας, αναπτύσσοντας συνεχώς τις δεξιότητες των στελεχών μας προς αυτή τη κατεύθυνση."
  }
  }
};
// This function updates the Services Section based on the given language
function updateNewsSectionLanguage(lang) {
  // Convert the language code to lowercase to match the object keys correctly.
  const selectedLang = (lang || localStorage.getItem("selectedLanguage") || DEFAULT_LANG);

  // Ensure the comparison is done in the same case and correctly access the content.
  const content = newsTextContent[selectedLang] || newsTextContent[DEFAULT_LANG];

  // Update the title and description in the team content section.
  const news1TitleElement = document.getElementById('newsusTitle');
  const news1DescriptionElement = document.getElementById('newsusDescription');
  const news2Title = document.getElementById('newsextTitle')
  // const news2Par = document.getElementById('newsextDescription')
  if (news1TitleElement && news1DescriptionElement) {
    news1TitleElement.textContent = content.news1.title;
    news1DescriptionElement.textContent = content.news1.description;
  } else {
    console.error('Team content elements not found');
  }
  // if (news2Title && news2Par) {
  //   news2Title.textContent = content.news2.title;
  //   news2Par.textContent = content.news2.description;
  // }
    if (news2Title) {
    news2Title.textContent = content.news2.title;
  }
}
document
  .querySelector(".language-dropdown")
  .addEventListener("click", (event) => {
    const lang = event.target.getAttribute("data-lang");
    if (lang) {
      localStorage.setItem("selectedLanguage", lang);
      document.getElementById("selected-lang").textContent =
        lang === "gr" ? FALLBACK_LANG : DEFAULT_LANG;
        updateNewsSectionLanguage(lang);
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayLogo("logo-image");
  fetchAndDisplayLogo("side-logo-image");
  const savedLang = localStorage.getItem("selectedLanguage") || DEFAULT_LANG;
  const selectedLangElement = document.getElementById("selected-lang");
  if (selectedLangElement) {
    selectedLangElement.setAttribute("data-lang", savedLang);
    selectedLangElement.textContent = savedLang;
    updateNewsSectionLanguage(savedLang);
  }
});
