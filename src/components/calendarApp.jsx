import React, { useState } from 'react';

const CalendarApp = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'
  ];

  const currentDate = new Date();

  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [events, setEvents] = useState([]);
  const [startTime, setStartTime] = useState({ hours: '00', minutes: '00' });
  const [endTime, setEndTime] = useState({ hours: '00', minutes: '00' });
  const [eventText, setEventText] = useState('');
  const [eventType, setEventType] = useState('Work'); // Default event type is "Work"
  const [editingEvent, setEditingEvent] = useState(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const eventColors = {
    Work: 'coral',
    Personal: 'lightgreen',
    Others: 'lightcoral',
  };

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const today = new Date();

    if (clickedDate >= today || isSameDay(clickedDate, today)) {
      setSelectedDate(clickedDate);
      setShowEventPopup(true);
      setEventText('');
      setStartTime({ hours: '00', minutes: '00' });
      setEndTime({ hours: '00', minutes: '00' });
      setEventType('Work'); // Reset event type to "Work" by default
      setEditingEvent(null); // Reset editing state for a new event
    }
  };

  const isTimeOverlap = (newEvent) => {
    return events.some((event) => {
      const isSameDay =
        event.date.getFullYear() === newEvent.date.getFullYear() &&
        event.date.getMonth() === newEvent.date.getMonth() &&
        event.date.getDate() === newEvent.date.getDate();

      const existingStart = event.startTime.hours * 60 + parseInt(event.startTime.minutes);
      const existingEnd = event.endTime.hours * 60 + parseInt(event.endTime.minutes);
      const newStart = newEvent.startTime.hours * 60 + parseInt(newEvent.startTime.minutes);
      const newEnd = newEvent.endTime.hours * 60 + parseInt(newEvent.endTime.minutes);

      return isSameDay && !(newEnd <= existingStart || newStart >= existingEnd);
    });
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleEventSubmit = () => {
    const newEvent = {
      id: editingEvent ? editingEvent.id : Date.now(),
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
      text: eventText,
      type: eventType, // Use the selected event type
    };

    if (!eventText) {
      alert('Event text is required.');
      return;
    }

    if (parseInt(endTime.hours) < parseInt(startTime.hours) ||
      (parseInt(endTime.hours) === parseInt(startTime.hours) &&
        parseInt(endTime.minutes) <= parseInt(startTime.minutes))) {
      alert('End time must be after start time.');
      return;
    }

    if (!editingEvent && isTimeOverlap(newEvent)) {
      alert('This event overlaps with an existing event.');
      return;
    }

    let updatedEvents = [...events];
    if (editingEvent) {
      updatedEvents = updatedEvents.map((event) =>
        event.id === editingEvent.id ? newEvent : event
      );
    } else {
      updatedEvents.push(newEvent);
    }

    setEvents(updatedEvents);
    setShowEventPopup(false);
  };

  const handleEditEvent = (event) => {
    // When editing, populate the form with the event's data
    setEditingEvent(event);
    setSelectedDate(event.date);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setEventText(event.text);
    setEventType(event.type);
    setShowEventPopup(true);
  };

  return (
    <div className='calendar-app'>
      <div className='calendar'>
        <h1 className='heading'>Calendar</h1>
        <div className="navigate-date">
          <h2 className='month'>{monthsOfYear[currentMonth]} </h2>
          <h2 className='year'>{currentYear}</h2>
          <div className='buttons'>
            <i className="bx bx-chevron-left" onClick={prevMonth}></i>
            <i className="bx bx-chevron-right" onClick={nextMonth}></i>
          </div>
        </div>
        <div className='weekdays'>
          {daysOfWeek.map((day) =>
            <span key={day}>{day}</span>
          )}
        </div>
        <div className='days'>
          {[...Array(firstDayOfMonth).keys()].map((_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {[...Array(daysInMonth).keys()].map((day) =>
            <span
              key={day + 1}
              className={
                day + 1 === currentDate.getDate() &&
                currentMonth === currentDate.getMonth() &&
                currentYear === currentDate.getFullYear()
                  ? 'current-day' : ''
              }
              onClick={() => handleDayClick(day + 1)}
            >
              {day + 1}
            </span>
          )}
        </div>
      </div>

      <div className="events">
        {showEventPopup && (
          <div className="event-popup">
            <div className="time-input">
              <div className="event-popup-time">Start Time</div>
              <input
                type="number"
                name="hours"
                min={0}
                max={23}
                className="hours"
                value={startTime.hours}
                onChange={(e) => setStartTime({ ...startTime, hours: e.target.value })}
              />
              <input
                type="number"
                name="minutes"
                min={0}
                max={59}
                className="minutes"
                value={startTime.minutes}
                onChange={(e) => setStartTime({ ...startTime, minutes: e.target.value })}
              />
            </div>
            <div className="time-input">
              <div className="event-popup-time">End Time</div>
              <input
                type="number"
                name="hours"
                min={0}
                max={23}
                className="hours"
                value={endTime.hours}
                onChange={(e) => setEndTime({ ...endTime, hours: e.target.value })}
              />
              <input
                type="number"
                name="minutes"
                min={0}
                max={59}
                className="minutes"
                value={endTime.minutes}
                onChange={(e) => setEndTime({ ...endTime, minutes: e.target.value })}
              />
            </div>

            <textarea
              placeholder="Enter Event Text (Maximum 60 characters)"
              maxLength="60"
              value={eventText}
              onChange={(e) => {
                if (e.target.value.length <= 60) {
                  setEventText(e.target.value);
                }
              }}
            ></textarea>

            {/* Event Type Selection */}
            <div className="event-type">
              <label htmlFor="eventType">Event Type:</label>
              <select
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <button className="event-popup-btn" onClick={handleEventSubmit}>
              {editingEvent ? "Update Event" : "Add Event"}
            </button>
            <button className="close-event-popup" onClick={() => setShowEventPopup(false)}>
              <i className="bx bx-x"></i>
            </button>
          </div>
        )}

        {events.map((event, index) => (
          <div className="event" key={index} style={{ backgroundColor: eventColors[event.type] }}>
            <div className="event-date-wrapper">
              <div className="event-date">
                {`${monthsOfYear[event.date.getMonth()]} ${event.date.getDate()}, ${event.date.getFullYear()}`}
              </div>
              <div className="event-time">{`${event.startTime.hours}:${event.startTime.minutes} - ${event.endTime.hours}:${event.endTime.minutes}`}</div>
            </div>
            <div className="event-text">{event.text}</div>
            <div className="event-buttons">
              <i className="bx bxs-edit-alt" onClick={() => handleEditEvent(event)}></i>
              <i className="bx bxs-message-alt-x" onClick={() => setEvents(events.filter((e) => e.id !== event.id))}></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarApp;


