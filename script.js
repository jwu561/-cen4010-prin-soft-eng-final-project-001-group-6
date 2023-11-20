function updateRealTimeDate() {
    var currentDate = new Date();
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var day = daysOfWeek[currentDate.getDay()];
    var month = months[currentDate.getMonth()];
    var date = currentDate.getDate();
    var year = currentDate.getFullYear();
    var formattedDate = "It's " + day + ", " + month + " " + date + ", " + year;
    document.getElementById("realTimeDate").textContent = formattedDate;
  }
  updateRealTimeDate();
  setInterval(updateRealTimeDate, 60000);
  
  document.querySelector(".login-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get values from input fields
    var userId = document.getElementById("id").value;
    var password = document.getElementById("pw").value;

    // Call the login function with the obtained values
    login(userId, password);
});

function login(userId, password) {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
            password: password
        }),
    })
    .then(response => {
        if (response.ok) {
            // Successful login (HTTP status 200)
            window.location.href = '/homepage.html'; // Redirect to home page
        } else if (response.status === 400 || response.status === 401) {
            // Unsuccessful login (HTTP status 400 or 401)
            return response.json();
        } else {
            throw new Error('Unexpected response from the server');
        }
    })
    .then(data => {
        // Handle error message for unsuccessful login
        console.error('Error:', data.message);
        // Display the error message on the HTML page
        document.getElementById("errorMessage").innerText = data.message;
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });
}