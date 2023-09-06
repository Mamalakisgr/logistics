  // Mobile Menu Functionality
  const menu = document.querySelector('#mobile-menu');
  const menuLinks = document.querySelector('.navbar__menu');

  const mobileMenu = () => {
      menu.classList.toggle('is-active');
      menuLinks.classList.toggle('active');
  };
  menu.addEventListener('click', mobileMenu);

    // Image Slider Functionality
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slider li');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let slideIndex = 0;

    const showSlide = (index) => {
        slides.forEach((slide) => {
            slide.style.display = 'none';
        });
        slides[index].style.display = 'block';
    };

    const nextSlide = () => {
        slideIndex = (slideIndex + 1) % slides.length;
        showSlide(slideIndex);
    };

    const prevSlide = () => {
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        showSlide(slideIndex);
    };

    // Initial slide
    showSlide(slideIndex);

    // Automatic slide change (change slide every 5 seconds)
    const autoSlideInterval = setInterval(nextSlide, 5000);

    // Add event listeners for previous and next buttons
    prevBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        prevSlide();
    });

    nextBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        nextSlide();
    });
  