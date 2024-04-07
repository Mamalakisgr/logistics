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
const servicesTextContent = {
  en: {
      title: "Services",
      cards: [
          {
              title: "Company Formation – Business Start-up",
              description: "We undertake the complete establishment of your company up to the issuance of a VAT number with all legal procedures.",
              more: "Learn More"
          },
          {
              title: "Accounting Organization & Supervision",
              description: "We know exactly how to protect your business. Organization and maintenance of your accounting at a high level.",
              more: "Learn More"
          },
          {
              title: "Payroll",
              description: "We provide specialized services in Payroll management and human resources administration for any form of companies.",
              more: "Learn More"
          },
          {
              title: "MyData",
              description: "We offer consulting services for transitioning to the digital platform.",
              more: "Learn More"
          }
      ]
  },
  gr: {
      title: "Υπηρεσίες",
      cards: [
          {
              title: "Σύσταση – Έναρξη Επιχειρήσεως",
              description: "Αναλαμβάνουμε την εξ ολοκλήρου ίδρυση της εταιρίας σας μέχρι και την απόδοση Α.Φ.Μ. με όλες τις νόμιμες διαδικασίες.",
              more: "Περισσότερα"
          },
          {
            title: "Οργάνωση Επίβλεψη Λογιστηρίου",
            description: "Γνωρίζουμε άριστα πως να προφυλάξουμε την επιχείρηση σας. Οργάνωση και διατήρηση σε υψηλό επίπεδο του λογιστηρίου σας.",
            more: "Learn More"
        },
        {
            title: "Μισθοδοσία",
            description: "Παρέχουμε εξειδικευμένες υπηρεσίες στη διαχείριση της Μισθοδοσίας και στη διοίκηση του ανθρώπινου δυναμικού για οποιαδήποτε μορφή εταιρειών.",
            more: "Learn More"
        },
        {
            title: "MyData",
            description: "Παρέχουμε συμβουλευτικές υπηρεσίες μετάβασης στην ψηφιακή πλατφόρμα.",
            more: "Learn More"
        }
      ]
  }
};
// This function updates the Services Section based on the given language
function updateServicesSectionLanguage(lang) {
  const selectedLang = lang || localStorage.getItem("selectedLanguage") || 'en';
  const content = servicesTextContent[selectedLang];

  document.querySelector('#services > h1').textContent = content.title;

  const serviceCards = document.querySelectorAll('.services__card');
  serviceCards.forEach((card, index) => {
    const cardContent = content.cards[index];
    if (cardContent) {
      card.querySelector('h2').textContent = cardContent.title;
      card.querySelector('p').textContent = cardContent.description;
      card.querySelector('button').textContent = cardContent.more;
    }
  });
}
// Call this function when the page loads and whenever the language is changed
document.addEventListener('DOMContentLoaded', updateServicesSectionLanguage);
let slideInterval; // Declare this variable at the top of your script to store the interval ID

let slideIndex = 1; // Start at first slide

const fetchBannerBlob = async (bannerId) => {
  const url = `/api/banners/${bannerId}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.blob();
    }
  } catch (error) {
    console.error(`Failed to fetch banner with ID ${bannerId}:`, error);
  }

  return null;
};
// Function to fetch and display the dynamic paragraph
const fetchAndDisplayDynamicParagraph = async () => {
  try {
    const response = await fetch("/api/get-description");
    if (response.ok) {
      const data = await response.json();

      // Update the description
      const descriptionParagraph = document.querySelector(
        "#dynamicDescription p"
      );
      if (descriptionParagraph) {
        descriptionParagraph.textContent = data.description;
      } else {
        console.error(
          "Failed to find paragraph element inside #dynamicDescription."
        );
      }
    } else {
      console.error("Failed to fetch description");
    }
  } catch (error) {
    console.error("Error fetching description:", error);
  }
};
//  Initialize Swiper
//  Initialize Swiper
let swiper = new Swiper(".mySwiper", {
  autoplay: {
    delay: 5000, // Delay between slides in milliseconds
    disableOnInteraction: false, // Disable autoplay on user interaction
  },
  
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
// Assuming Swiper initialization is correct and included after the populateBanners function
const populateBanners = async () => {
  try {
    const response = await fetch("/api/banners");
    const banners = await response.json();

    // Check if there are banners to display
    if (banners.length === 0) {
      console.error("No banners were found.");
      return;
    }

    const bannerList = document.getElementById("swiper-wrap");

    // Fetch all banners in parallel
    const fetchPromises = banners.map((banner, i) => fetchBannerBlob(banner._id).then(blob => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        const slideDiv = document.createElement("div");
        slideDiv.className = `swiper-slide slide_${i}`;
        slideDiv.innerHTML = `<img src="${imageUrl}" alt="${banner.name}">`;
        return slideDiv; // Return the slide div for later processing
      }
      return null;
    }));

    // Wait for all fetches to complete
    const slides = await Promise.all(fetchPromises);

    // Append fetched slides to the banner list
    slides.forEach(slide => {
      if (slide) {
        bannerList.appendChild(slide);
      }
    });

    // After all slides are added, update Swiper
    swiper.update();

    // If no images were added, show an error
    if (!bannerList.hasChildNodes()) {
      console.error("No banners were added to the slideshow.");
    }
  } catch (error) {
    console.error("There was a problem fetching banners:", error);
  }
};


// Ensure this script runs after the Swiper initialization script



const fetchAndSetRegionOneImage = async () => {
  try {
    const response = await fetch("/api/fetch-active-region-one-image");

    if (response.ok) {
      const imageBlob = await response.blob();

      if (imageBlob.size > 0) {
        // Ensure the blob isn't empty
        const imageUrl = URL.createObjectURL(imageBlob);
        const imageElement = document.querySelector(".region-one-image");

        if (imageElement) {
          imageElement.src = imageUrl; // Set the src to immediately load the image
        } else {
          console.error("Image element not found in the DOM.");
        }
      } else {
        console.error("The fetched image blob is empty.");
      }
    } else {
      // Log the server's response if it's not 200 OK
      const errorData = await response.text();
      console.error(`Server responded with ${response.status}: ${errorData}`);
    }
  } catch (error) {
    console.error("There was a problem fetching the region one image:", error);
  }
};

// This function returns the current selected language.
const getCurrentLanguage = () => {
  return document.getElementById("selected-lang").getAttribute("data-lang");
};
// New function to handle fetching and displaying SEO content
// New function to handle fetching and displaying SEO content
const fetchAndDisplaySEOContent = async () => {
  try {
    const lang = getCurrentLanguage();
    const response = await fetch(`/api/seo-content?lang=${lang}`);
    const data = await response.json();

    // Update the title and description based on the fetched data
    document.querySelector(".title").innerText = data.title;
    document.querySelector(".description p").innerText = data.description;
  } catch (error) {
    console.error(
      "There was a problem fetching and displaying SEO content:",
      error
    );
  }
};

// Function to fetch and update dynamic content
// const fetchAndUpdateDynamicContent = async () => {
//   try {
//     const response = await fetch("/api/update-dynamic-content");
//     if (response.ok) {
//       const data = await response.json();
//       document.getElementById("dynamicTitle").textContent = data.title;
//       document.getElementById("dynamicDescription").textContent =
//         data.description;
//     } else {
//       console.error("Failed to fetch dynamic content");
//     }
//   } catch (error) {
//     console.error("Error fetching dynamic content:", error);
//   }
// };
let companyCount = 0; // Global variable to store the company count
function isElementInViewport(ele) {
  const rect = ele.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
const fetchAndDisplayCompanyCount = async () => {
  try {
    const response = await fetch("/api/get-company-count");
    if (response.ok) {
      const data = await response.json();
      companyCount = data.count;

      // Optionally, start the animation immediately if needed
      // Check if the target element is visible and animate
      if (isElementInViewport(target)) {
        animateValue("counter", 0, companyCount, 2000);
      }
    } else {
      console.error("Failed to fetch company count");
    }
  } catch (error) {
    console.error("Error fetching company count:", error);
  }
};
// const fetchAndDisplaySeoImage = async () => {
//   fetch("/api/get-selected-seo-image")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.blob();
//     })
//     .then((imageBlob) => {
//       const imageUrl = URL.createObjectURL(imageBlob);
//       const imageWrapper = document.querySelector(
//         ".image-wrapper:nth-of-type(2)"
//       );
//       imageWrapper.style.backgroundImage = `url(${imageUrl})`;
//     })
//     .catch((error) => {
//       console.error("Failed to fetch selected SEO image:", error);
//     });
// };
function animateValue(id, start, end, duration) {
  let obj = document.getElementById(id);
  let range = end - start;
  let minTimer = 50;
  let stepTime = Math.abs(Math.floor(duration / range));
  stepTime = Math.max(stepTime, minTimer);
  let startTime = new Date().getTime();
  let endTime = startTime + duration;
  let timer;

  function run() {
    let now = new Date().getTime();
    let remaining = Math.max((endTime - now) / duration, 0);
    let value = Math.round(end - remaining * range);
    obj.innerHTML = value;
    if (value == end) {
      clearInterval(timer);
    }
  }

  timer = setInterval(run, stepTime);
  run();
}

// Trigger the animation
animateValue("counter", 0, 100, 150); // The last value is the duration of the animation in milliseconds
let observerOptions = {
  root: null, // Use the viewport as the root
  rootMargin: "0px",
  threshold: 0.1, // Trigger when 10% of the target is visible
};

let observer = new IntersectionObserver(onIntersection, observerOptions);

function onIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting && 100 > 0) {
      animateValue("counter", 0, 100, 2000);
      observer.disconnect();
    }
  });
}
// Start observing the element
let target = document.getElementById("dynamicDescription");
observer.observe(target);

// DOM Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  populateBanners();
  fetchAndSetRegionOneImage();
  const target = document.getElementById('counter'); // Make sure this is the element you want to observe

  fetchAndDisplayLogo("logo-image"); // Fetch and display header logo
  fetchAndDisplayLogo("side-logo-image");
  fetchAndDisplayCompanyCount();
  const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is now in the viewport, animate if not already done
        if (companyCount > 0 && !entry.target.classList.contains('animated')) {
          animateValue("counter", 0, companyCount, 2000);
          entry.target.classList.add('animated'); // Prevents re-animation
        }
      }
    });
  }, observerOptions);

  observer.observe(target);
  fetchAndDisplaySEOContent(); // Fetch and display SEO content
  // fetchAndUpdateDynamicContent();
  // fetchAndDisplaySeoImage();
  fetchAndDisplayDynamicParagraph();
  const lazyImages = document.querySelectorAll(".lazyload");
  const form = document.getElementById("footer-contact-form");
  const savedLang = localStorage.getItem("selectedLanguage");
  if (savedLang) {
    updateServicesSectionLanguage(savedLang); // Update services section upon page load
    // fetchAndUpdateDynamicContent();
  }

  const dropdownItems = document.querySelectorAll(".language-dropdown a");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", async function (event) {
      event.preventDefault(); // Prevent default link action
      const selectedLang = this.getAttribute("data-lang");
  
      // Store the selected language in localStorage
      localStorage.setItem("selectedLanguage", selectedLang);
  
      // Update all page content according to the selected language
      updateServicesSectionLanguage(selectedLang); // You're already doing this
      await fetchAndDisplaySEOContent(); // Fetch and display SEO content according to the selected language
      // Add calls to update other parts of the page if necessary
    });
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    fetch("/submit", {
      method: "POST",
      body: new URLSearchParams(new FormData(event.target)),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success) {
          const messageDiv = document.createElement("div");
          messageDiv.textContent = "Email sent successfully";
          messageDiv.className = "success-message";
          form.after(messageDiv); // This will append the messageDiv after the form.
        } else {
          console.log("Unexpected server response:", data);
        }
      });
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => {
            img.classList.add("lazyload-loaded");
          };
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => {
      observer.observe(img);
    });
  }
  // Add event listeners for slider buttons
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  if (prevButton) {
    prevButton.addEventListener("click", () => plusSlides(-1));
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => plusSlides(1));
  }
});
