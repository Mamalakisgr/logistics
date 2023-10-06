function toggleSideMenu() {
    var sideMenu = document.getElementById("sideMenu");
    if (sideMenu.style.display === "block") {
        sideMenu.style.display = "none";
    } else {
        sideMenu.style.display = "block";
    }
}

function closeSideMenu() {
    var sideMenu = document.getElementById("sideMenu");
    sideMenu.style.display = "none";
}
