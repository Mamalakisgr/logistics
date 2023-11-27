function toggleSideMenu() {
  var sideMenu = document.getElementById("sideMenu");
  var logo = document.getElementById(".side-logo-container .side-logo logo");
  if (sideMenu.style.display === "block") {
    sideMenu.style.display = "none";
  } else {
    sideMenu.style.display = "block";
    logo.style.display = "block";
  }
}

function closeSideMenu() {
  var sideMenu = document.getElementById("sideMenu");
  sideMenu.style.display = "none";
}
