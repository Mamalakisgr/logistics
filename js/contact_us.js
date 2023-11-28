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

const translations = {
  en: {
    "contact-information": "Contact Information",
    "contact-form": "Get in Touch",
    "google-map": "Find us here",
  },
  gr: {
    "contact-information": "Πληροφορίες Επικοινωνίας",
    "contact-form": "Επικοινωνήστε μαζί μας",
    "google-map": "Βρείτε μας στον χάρτη",
  },
  // You can add more languages and translations here as needed
};
function translatePage(selectedLang) {
  const contactInfoSection = document.getElementById("contact-information");
  const contactFormSection = document.getElementById("contact-form");
  const MapSection = document.getElementById("google-map");

  if (contactInfoSection) {
    contactInfoSection.querySelector("h2").textContent =
      translations[selectedLang]["contact-information"];
  }
  if (contactFormSection) {
    contactFormSection.querySelector("h2").textContent =
      translations[selectedLang]["contact-form"];
  }
  if (MapSection) {
    MapSection.querySelector("h2").textContent =
      translations[selectedLang]["google-map"];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayLogo("logo-image");
  fetchAndDisplayLogo("side-logo-image");

  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    fetch("/submit", {
      method: "POST",
      body: new URLSearchParams(new FormData(event.target)),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const messageDiv = document.createElement("div");
          messageDiv.textContent = "Email sent successfully";
          messageDiv.className = "success-message";
          form.appendChild(messageDiv);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
