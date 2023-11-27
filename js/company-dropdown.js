var dropdownHeader = document.querySelector(".dropdown-header");
var dropdown = document.querySelector(".company-dropdown");

dropdownHeader.addEventListener("mouseover", function () {
  dropdown.style.display = "block";
});

dropdownHeader.addEventListener("mouseout", function () {
  dropdown.style.display = "none";
});

dropdown.addEventListener("mouseover", function () {
  dropdown.style.display = "block";
});

dropdown.addEventListener("mouseout", function () {
  dropdown.style.display = "none";
});
