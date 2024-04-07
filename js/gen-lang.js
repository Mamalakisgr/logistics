// Define an object to hold the text for each element in both languages
var langContent = {
    buttons: {
        contact: {
          gr: "ΕΠΙΚΟΙΝΩΝΙΑ",
          en: "CONTACT"
        },
        company: {
          gr: "ΕΤΑΙΡΕΙΑ",
          en: "COMPANY"
        }
      },
    navbar: {
      home: {
        gr: "Αρχική",
        en: "Home"
      },
      company: {
        gr: "Εταιρεία",
        en: "Company"
      },
      services: {
        gr: "Υπηρεσίες",
        en: "Services"
      },
      news: {
        gr: "Ενημέρωση",
        en: "News"
      },
      contact: {
        gr: "Επικοινωνία",
        en: "Contact"
      }
    },
    en: {
        locations: [
          { url: "https://tinyurl.com/y93wm9ka", text: "Agiou Meletiou 23, Athens" },
          { url: "https://tinyurl.com/2dd25urk", text: "Deligianni & Kasou 1, Vari 166 72" }
        ],
        phoneNumbers: ["6957553954", "2107217046"],
        email: "info@loyaltax.gr",
        workingHours: [
          { text: "Mon - Fri: 08:00 - 16:00" },
          { text: "Saturdays & Evenings: By Appointment" },
          { text: "By appointment only" }
        ],
        socialMedia: {
          facebook: "https://www.facebook.com/loyaltax",
          linkedin: "https://www.linkedin.com/in/panagiotispitsis/",
          viber: "viber://chat?number=%2B6957553954",
          whatsapp: "https://wa.me/6957553954"
        },
        dateForm: {
          text: "Book an appointment with us immediately by clicking",
        }
      },
      gr: {
        locations: [
          { url: "https://tinyurl.com/y93wm9ka", text: "Αγίου Μελετίου 23, Αθήνα" },
          { url: "https://tinyurl.com/2dd25urk", text: "Δεληγιάννη & Κασου 1, Βάρη 166 72" }
        ],
        phoneNumbers: ["6957553954", "2107217046"],
        email: "info@loyaltax.gr",
        workingHours: [
          { text: "Δευ - Παρ: 08:00 - 16:00" },
          { text: "Σάββατα & Απογεύματα: Κατόπιν Ραντεβού" },
          { text: "Ραντεβού κατόπιν τηλεφωνικής επικοινωνίας." }
        ],
        socialMedia: {
          facebook: "https://www.facebook.com/loyaltax",
          linkedin: "https://www.linkedin.com/in/panagiotispitsis/",
          viber: "viber://chat?number=%2B6957553954",
          whatsapp: "https://wa.me/6957553954"
        },
        dateForm: {
          text: "Κλείστε άμεσα ένα ραντεβού μαζί μας κάνοντας click",
          name: "Όνομα:",
          email: "Email:",
          message: "Μήνυμα:",
          send: "Αποστολή"
        }
      }
  };

  function updateLanguage(lang) {
    // Assuming langContent is correctly defined and accessible within this function
  
    // Update navbar content
    document.querySelector('.category-name-Home a').textContent = langContent.navbar.home[lang];
    document.querySelector('.category-name-Company a').textContent = langContent.navbar.company[lang];
    document.querySelector('.category-name-Services a').textContent = langContent.navbar.services[lang];
    document.querySelector('.category-name-News a').textContent = langContent.navbar.news[lang];
    document.querySelector('.category-name-Contact a').textContent = langContent.navbar.contact[lang];
    // Update button texts
  // Update all SEO buttons
  const seoButtons = document.querySelectorAll('.seo-button'); // Select all SEO buttons

  // Check if there are at least two buttons to update
  if (seoButtons.length >= 2) {
    // Assuming the first button is 'contact' and the second is 'company'
    seoButtons[0].textContent = langContent.buttons.company[lang]; // Update the first button
    seoButtons[1].textContent = langContent.buttons.contact[lang]; // Update the second button
  }

// Find each footer__link--wrapper and update its content
document.querySelectorAll('.footer__link--wrapper').forEach((wrapper) => {
    const locationLinks = wrapper.querySelectorAll('a[href^="https://tinyurl.com"]');
    locationLinks.forEach((link, index) => {
      // Assuming the same order and number of locations in each wrapper,
      // we use modulo to loop back through the locations array if it's shorter than the number of links
      const locationIndex = index % langContent[lang].locations.length;
      const locationData = langContent[lang].locations[locationIndex];
      if(locationData) { // Check if location data exists
        link.innerHTML = `<i class="${link.children[0].className}" style="color: white;"></i> ${locationData.text}`; // Keep the original icon class
        link.href = locationData.url;
      }
    });
  });

    // Update phone numbers
    document.querySelectorAll('.phone-number').forEach((phone, index) => {
      phone.textContent = langContent[lang].phoneNumbers[index];
    });
  
    // Update email
    document.querySelector('.footer__link--items a[href^="mailto:"]').innerHTML = `<i class="fa fa-envelope"></i> ${langContent[lang].email}`;
  
    // Update working hours
    document.querySelectorAll('.working-hours').forEach((hour, index) => {
      hour.innerHTML = `<i class="fas fa-clock"></i> ${langContent[lang].workingHours[index].text}`;
    });
  
    // Update social media links
    document.querySelector('a[href^="https://www.facebook.com"]').href = langContent[lang].socialMedia.facebook;
    document.querySelector('a[href^="https://www.linkedin.com"]').href = langContent[lang].socialMedia.linkedin;
    document.querySelector('a[href^="viber://"]').href = langContent[lang].socialMedia.viber;
    document.querySelector('a[href^="https://wa.me"]').href = langContent[lang].socialMedia.whatsapp;
  
    // Update contact form
// Determine the appropriate text based on the selected language
const dateFormText = langContent[lang].dateForm.text;
const linkText = lang === 'gr' ? 'εδώ' : 'here';

// Construct the HTML content with the language-specific text and the Calendly link
const htmlContent = `${dateFormText} <a href="#" style="text-decoration: none; color: rgb(217, 47, 47);" onclick="Calendly.initPopupWidget({url:'https://calendly.com/loyaltax/30min?'});return false;">${linkText}</a>.`;

// Update the .close-date element's innerHTML with the new HTML content
document.querySelector('.close-date p').innerHTML = htmlContent;
    document.querySelector('label[for="name"]').textContent = langContent[lang].contactForm.name;
    document.querySelector('label[for="email"]').textContent = langContent[lang].contactForm.email;
    document.querySelector('label[for="message"]').textContent = langContent[lang].contactForm.message;
    document.querySelector('#footer-contact-form button').textContent = langContent[lang].contactForm.send;
  }