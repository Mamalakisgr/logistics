


// Fetches and displays the currently active logo for both header and footer
const fetchAndDisplayLogo = async (elementId) => {
  try {
    const logoImage = document.getElementById(elementId);
    
    if (!logoImage) {
      console.error(`${elementId} element not found.`);
      return;
    }

    const response = await fetch('/api/active-logo');

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

let slideInterval;  // Declare this variable at the top of your script to store the interval ID

let slideIndex = 1;  // Start at first slide

const fetchBannerBlob = async (bannerId) => {
  const url = `/api/banners/${bannerId}`;
  console.log("Fetching banner blob from URL: ", url);  // Debug line

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

const populateBanners = async () => {
  try {
    const response = await fetch('/api/banners');
    const banners = await response.json();
    
    // Fetch all blobs in parallel
    const blobPromises = banners.map(banner => fetchBannerBlob(banner._id));
    const imageBlobs = await Promise.all(blobPromises);
    
    const bannerList = document.getElementById('banner-list');
    let htmlString = '';

    for (const [index, blob] of imageBlobs.entries()) {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        htmlString += `<div class="mySlides fade">
                        <img src="${imageUrl}" alt="${banners[index].name}">
                      </div>`;
      }
    }

    bannerList.innerHTML = htmlString;
    showSlides(slideIndex);  // Initialize the slideshow
  } catch (error) {
    console.error('There was a problem fetching banners:', error);
  }
};

const showSlides = (n) => {
  const slides = document.getElementsByClassName("mySlides");
  
  if (slides.length === 0) {
    console.error("No slides found.");
    return;
  }

  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].style.display = "block";
  } else {
    console.error(`Slide at index ${slideIndex - 1} does not exist.`);
  }
   // Clear previous interval
   clearInterval(slideInterval);

   // Set a new interval
   slideInterval = setInterval(() => {
     slideIndex++;
     if (slideIndex > slides.length) {
       slideIndex = 1;
     }
     showSlides(slideIndex);
   }, 5000);  // 5000 milliseconds = 5 seconds
};
// Function to change slides
const plusSlides = (n) => {
  showSlides(slideIndex += n);
};

// New function to handle fetching and displaying SEO content
const fetchAndDisplaySEOContent = async () => {
  try {
    const response = await fetch('/api/seo-content');
    const data = await response.json();

    // Update the title and description based on the fetched data
    document.querySelector('.title').innerText = data.title;
    document.querySelector('.description p').innerText = data.description;
  } catch (error) {
    console.error('There was a problem fetching the SEO data:', error);
  }
};// Function to fetch and update dynamic content
const fetchAndUpdateDynamicContent = async () => {
  try {
    const response = await fetch('/api/update-dynamic-content'); // Replace with your actual API endpoint
    if (response.ok) {
      const data = await response.json();
      document.getElementById('dynamicTitle').textContent = data.title;
      document.getElementById('dynamicDescription').textContent = data.description;
    } else {
      console.error('Failed to fetch dynamic content');
    }
  } catch (error) {
    console.error('Error fetching dynamic content:', error);
  }
};

// Function to fetch and display a general image
const fetchAndDisplayGeneralImage = async (elementId) => {
  try {
    const imageElement = document.getElementById(elementId);
    const response = await fetch('/api/general-image');

    if (response.ok) {
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      imageElement.src = imageUrl;
    } else {
      console.error("Image not found");
    }
  } catch (error) {
    console.error("There was a problem", error);
  }
};
// DOM Loaded Event
document.addEventListener('DOMContentLoaded', function() {
  fetchAndDisplayLogo('logo-image'); // Fetch and display header logo
  fetchAndDisplayLogo('logo-image-footer'); // Fetch and display footer logo
  populateBanners();
  fetchAndDisplaySEOContent(); // Fetch and display SEO content
  fetchAndUpdateDynamicContent();

  const lazyImages = document.querySelectorAll('.lazyload');

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => {
            img.classList.add('lazyload-loaded');
          };
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      observer.observe(img);
    });
  }
   // Add event listeners for slider buttons
   const prevButton = document.querySelector('.prev');
   const nextButton = document.querySelector('.next');
   
   if (prevButton) {
     prevButton.addEventListener('click', () => plusSlides(-1));
   }
   
   if (nextButton) {
     nextButton.addEventListener('click', () => plusSlides(1));
   }
});
