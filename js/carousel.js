document.addEventListener("DOMContentLoaded", function () {
  let currentIndex = 0;
  const images = document.querySelectorAll(".carousel img");
  const totalImages = images.length;

  function cycleImages() {
    images.forEach((img, index) => {
      img.style.display = index === currentIndex ? "block" : "none";
    });
    currentIndex = (currentIndex + 1) % totalImages;
  }

  setInterval(cycleImages, 3000); // Change image every 3 seconds
});
