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
      // Add more options and events as needed
      events: [
        {
          title: 'Event 1',
          start: '2023-11-15T10:00:00',
          end: '2023-11-15T12:00:00'
        },
        // Add more events as needed
      ]
    });
  });