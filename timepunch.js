

// Function to get the current date and time in a formatted string
function getCurrentDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return now.toLocaleDateString('en-US', options);
  }
  
  // Function to update the UI with the current time
  function updateUIWithCurrentTime(action) {
    const dateTime = getCurrentDateTime();
    let message;
  
    switch (action) {
      case 'in':
        message = 'Clocked In at ' + dateTime;
        break;
      case 'out':
        message = 'Clocked Out at ' + dateTime;
        break;
      case 'meal':
        message = 'Meal Time at ' + dateTime;
        break;
      default:
        message = 'Unknown action';
    }
  
    // Display the message in the UI
    document.getElementById('realTimeDate').innerText = message;
  }
  
  // Event listener for Clock In button
  document.querySelector('.btn-primary').addEventListener('click', function () {
    updateUIWithCurrentTime('in');
  });
  
  // Event listener for Clock Out button
  document.querySelector('.btn-danger').addEventListener('click', function () {
    updateUIWithCurrentTime('out');
  });
  
  // Event listener for Meal button
  document.querySelector('.btn-success').addEventListener('click', function () {
    updateUIWithCurrentTime('meal');
  });
  