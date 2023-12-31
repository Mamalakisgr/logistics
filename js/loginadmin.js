document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var errorMessageDiv = document.getElementById("error-message"); // Get the error message element

    // Send these credentials to the server
    // Example: using fetch API
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Login successful
          window.location.href = "/backoffice";
        } else {
          // Display error message
          errorMessageDiv.style.display = "block"; // Make the error message element visible
          errorMessageDiv.textContent = "Invalid username or password"; // Set the error message
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
