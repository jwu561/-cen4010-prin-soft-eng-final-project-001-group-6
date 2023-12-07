const bodyParser = require('body-parser');
const Parse = require('parse/node');
const loggedin = false;

function checkLoggedin(){
  if(!loggedin){
    window.location.href = 'login.html';
  }
}
document.addEventListener('DOMContentLoaded', function() {
  checkLoggedIn();
});
$(document).ready(function () {
  // Initialize FullCalendar
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    selectable: true,
    selectHelper: true,
    defaultTimedEventDuration: '08:00:00', // Set default duration to 8 hours
    select: function (start, end, jsEvent, view) {
      var title = prompt('Event Title:');
      if (title) {
        // Check if it's month view, set default time range if true
        if (view.type === 'month') {
          start = moment(start.format('YYYY-MM-DD') + 'T08:00:00');  // Set start time to 8 am
          end = moment(start.format('YYYY-MM-DD') + 'T17:00:00');  // Set end time to 5 pm
        }

        // Create the event
        var eventData = {
          title: title,
          start: start,
          end: end,
          allDay: false
        };

        $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
      }
      $('#calendar').fullCalendar('unselect');
    },
    editable: true, // Enable drag-and-drop
    eventResize: function (event, delta, revertFunc) {
      if (!confirm("Are you sure about this change?")) {
        revertFunc();
      } else {
        // Handle event resize
      }
    },
    eventDrop: function (event, delta, revertFunc) {
      if (!confirm("Are you sure about this change?")) {
        revertFunc();
      } else {
        // Handle event drop
      }
    },
    eventClick: function (event) {
      var title = prompt('Edit Event Title:', event.title);
      if (title) {
        event.title = title;
        $('#calendar').fullCalendar('updateEvent', event);
      }
    },
    eventRender: function (event, element) {
      element.append("<span class='closeon'>X</span>");
      element.find(".closeon").click(function () {
        $('#calendar').fullCalendar('removeEvents', event._id);
      });
    },
    // Remove the empty events array or add specific events as needed
  });

  // Function to dynamically add the custom event form to the document
  function addCustomEventForm() {
    // Custom Event Form HTML
    var customEventFormHTML = `
      <div id="customEventForm" style="display: none;">
        <label for="customEventTitle">Event Title:</label>
        <input type="text" id="customEventTitle">

        <label for="startDate">Start Date (MM/DD/YYYY):</label>
        <input type="text" id="startDate" placeholder="MM/DD/YYYY">

        <label for="endDate">End Date (MM/DD/YYYY):</label>
        <input type="text" id="endDate" placeholder="MM/DD/YYYY">

        <button id="saveCustomEvent">Save Custom Event</button>
      </div>
    `;

    // Append the custom event form to the body
    $('body').append(customEventFormHTML);

    // Handle the click event for the dynamically added button
    $('#addCustomEvent').on('click', function () {
      // Show the custom event form with default dates
      showCustomEventForm(moment(), moment().add(1, 'days'));
    });
  }

  // Call the function to add the custom event form
  addCustomEventForm();

  // Function to show the custom event form
  function showCustomEventForm(start, end) {
    $('#customEventForm').show();
    $('#startDate').val(start.format('MM/DD/YYYY'));
    $('#endDate').val(end.format('MM/DD/YYYY'));
  }

  // Button click to save custom event
  $('#saveCustomEvent').click(function () {
    // Get input values
    var title = $('#customEventTitle').val();
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();

    // Validate inputs
    if (title && startDate && endDate) {
      // Create the event
      var eventData = {
        title: title,
        start: moment(startDate, 'MM/DD/YYYY'), // Parse the start date
        end: moment(endDate, 'MM/DD/YYYY').add(1, 'days'), // Parse the end date and add one day
        allDay: true
      };

      // Render the event on the calendar
      $('#calendar').fullCalendar('renderEvent', eventData, true);
      // Hide the custom event form
      $('#customEventForm').hide();
    } else {
      alert('Please fill in all fields.');
    }
  });

  // Button click to add custom event
  $('#addCustomEvent').click(function () {
    // Show the custom event form with default dates
    showCustomEventForm(moment(), moment().add(1, 'days'));
  });
});

  


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
  
    
  function attemptLogin() {
    // Get values from input fields
    var userId = document.getElementById("id").value;
    var password = document.getElementById("pw").value;
    

    // Call the login function with the obtained values
    login(userId, password);
}

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
           loggedin = false;
           const currentUserid = userId;
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

function logout() {
  loggedin = false;
  window.location.href = 'login.html'
  fetch('/logout', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      }
  })
  .then(response => {
    if (response.ok) {
      // Successful logout (HTTP status 200)
      window.location.href = 'login.html'; // Redirect to login page
    } else {
      throw new Error('Logout failed');
    }
  })
  .catch(error => {
    console.error('Error:', error.message);
    // Display error message in a div with id 'errormessage'
    document.getElementById('errormessage').innerText = 'Logout failed';
  });
}

function searchId()
{
  var userId = document.getElementById("userId").value;
  var apiUrl = ("/users/" + userId);

}
