// Constants for default languages
const DEFAULT_LANG = "En";
const FALLBACK_LANG = "Gr";

const teamTextContent = {
  En: {
    team:{
      title: "Panagiotis Pitsis CEO",
     description:"Founding executive of the company, provides accounting, financial and consulting services. Graduated from the Department of Accounting & Finance  of the National and Kapodistrian University of Athens (Euripou Complex - Former Technological Institute of Central Greece) as an Accountant. Holder of a Master's degree from the Master's Department of the National and Kapodistrian University of Athens in Business Administration with specialization in Accounting (M.B.A. in Accounting). Member of the Economic Chamber of Greece as an Economist.Work experience as an Economist and Business Consultant since 2014 having worked with Commercial, Industrial, Hotel and Service Companies "
  
    } ,
    store:{
      title: "Meet our team",
      description: "In loyal tax etc."
    }
  },
  Gr: {
    team:{
      title: "Παναγιώτης Πίτσης Οικονομολόγος, Λογιστής Α΄τάξης",
      description:"Ιδρυτικό στέλεχος της εταιρείας, παρέχει λογιστικές, οικονομικές και συμβουλευτικές υπηρεσίες. Απόφοιτος  από το Τμήμα Λογιστικής & Χρηματοοικονομικήςτου Εθνικού και Καποδιστριακού Πανεπιστημίου Αθηνών (Συγκρότημα Ευρίπου - Πρώην ΑΤΕΙ Στερεάς Ελλάδας) ως Λογιστής.Κάτοχος Μεταπτυχιακού διπλώματος από το Μεταπτυχιακό Τμήμα του Εθνικούκαι Καποδιστριακού Πανεπιστημίου Αθηνών στη Διοίκηση Επιχειρήσεων με εξειδίκευση τη Λογιστική (M.B.A. στη Λογιστική). Μέλος του Οικονομικού Επιμελητηρίου Ελλάδος ως Οικονομολόγος.Εργασιακή εμπειρία ως Οικονομολόγος και Σύμβουλος επιχειρήσεων από το 2014 έχοντας συνεργασίες με Εμπορικές, Βιομηχανικές επιχειρήσεις, Ξενοδοχειακές επιχειρήσεις, καθώς και Εταιρείες παροχής υπηρεσιών"
  },
  store:{
    title: "Η ομάδα μας",
    description: "Στη LoyalTax πιστεύουμε στη δύναμη της Ομάδας. Προωθούμε και ευνοούμε καθημερινά τη συνεργασία μεταξύ των μελών της ομάδας, αναπτύσσοντας συνεχώς τις δεξιότητες των στελεχών μας προς αυτή τη κατεύθυνση."
  }
  }
};
// This function updates the Services Section based on the given language
function updateTeamSectionLanguage(lang) {
  // Convert the language code to lowercase to match the object keys correctly.
  const selectedLang = (lang || localStorage.getItem("selectedLanguage") || DEFAULT_LANG);

  // Ensure the comparison is done in the same case and correctly access the content.
  const content = teamTextContent[selectedLang] || teamTextContent[DEFAULT_LANG];

  // Update the title and description in the team content section.
  const teamTitleElement = document.querySelector('.team-content > h2');
  const teamDescriptionElement = document.querySelector('.team-content > p');
  const testTitle = document.querySelector('.test > h2')
  const testPar = document.querySelector('.store-section > p')
  if (teamTitleElement && teamDescriptionElement) {
    teamTitleElement.textContent = content.team.title;
    teamDescriptionElement.textContent = content.team.description;
  } else {
    console.error('Team content elements not found');
  }
  if (testTitle && testPar) {
    testTitle.textContent = content.store.title;
    testPar.textContent = content.store.description;
  }
}
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
      const imgElement = document.getElementById(elementId);
      if (imgElement && imgElement.tagName === "IMG") {
        imgElement.onload = () => {
          imgElement.style.display = "block"; // Only display the image when it's loaded
        };
        imgElement.src = imageUrl; // Start loading the image
      } else {
        console.error(
          `Element with id ${elementId} is not an img tag or does not exist`
        );
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
    const response = await fetch("/api/company-content");
    if (response.ok) {
      const data = await response.json();

      const titleLang = data.historyTitle?.[lang] ? lang : FALLBACK_LANG;
      const descLang = data.historyDescription?.[lang] ? lang : FALLBACK_LANG;

      document.getElementById("historyTitle").textContent =
        data.historyTitle[titleLang];
      document.getElementById("historyDescription").textContent =
        data.historyDescription[descLang];

      // Fetch and update images for history
      await displayImage("/api/history-image", "history-image");
    } else {
      console.error("Failed to fetch company content");
    }
  } catch (error) {
    console.error("Error fetching company content:", error);
  }
};

document.querySelector(".language-dropdown").addEventListener("click", (event) => {
    const lang = event.target.getAttribute("data-lang").toLowerCase();
    if (lang) {
        const standardizedLang = lang.toUpperCase() === "GR" ? "Gr" : "En";
        localStorage.setItem("selectedLanguage", standardizedLang);
        document.getElementById("selected-lang").textContent = standardizedLang;
        fetchAndUpdateHistoryContent(standardizedLang);
        updateTeamSectionLanguage(standardizedLang);
    }
});

  document.addEventListener("DOMContentLoaded", () => {
    fetchAndDisplayLogo("logo-image"); // Fetch and display header logo
    const savedLang = localStorage.getItem("selectedLanguage") || DEFAULT_LANG;
    const selectedLangElement = document.getElementById("selected-lang");
    if (selectedLangElement) {
        selectedLangElement.setAttribute("data-lang", savedLang.toLowerCase());
        selectedLangElement.textContent = savedLang;
        fetchAndUpdateHistoryContent(savedLang);
        updateTeamSectionLanguage(savedLang);
    }
});
