import React, { useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useCommunication } from "../context/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./notificationCalander.css";

const localizer = momentLocalizer(moment);

function CalendarView() {
  const { state, getNextScheduledCommunication } = useCommunication();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Transform past communications into calendar events
  const pastEvents = useMemo(() => {
    return state.communications.map((comm) => {
      const company = state.companies.find((c) => c.id === comm.companyId);
      return {
        title: `${company ? company.name : "Unknown Company"} - ${comm.type}`,
        start: new Date(comm.timestamp),
        end: new Date(comm.timestamp),
        allDay: true,
        resource: comm,
        isPastEvent: true,
      };
    });
  }, [state.communications, state.companies]);

  // Generate upcoming communication events
  const upcomingEvents = useMemo(() => {
    return state.companies
      .map((company) => {
        const nextCommunication = getNextScheduledCommunication(company.id);
        if (!nextCommunication) return null;

        return {
          title: `${company.name} - Next ${nextCommunication.type}`,
          start: nextCommunication.date,
          end: nextCommunication.date,
          allDay: true,
          resource: {
            companyId: company.id,
            companyName: company.name,
            type: nextCommunication.type,
            sequence: nextCommunication.sequence,
          },
          isUpcomingEvent: true,
        };
      })
      .filter(Boolean);
  }, [state.companies, getNextScheduledCommunication]);

  // Combine past and upcoming events
  const events = [...pastEvents, ...upcomingEvents];

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  // Custom event style function
  const eventStyleGetter = (event) => {
    let backgroundColor = event.isPastEvent ? "#3498db" : "#2ecc71";
    let style = {
      backgroundColor,
      borderRadius: "6px",
      opacity: 0.9,
      color: "white",
    };
    return { style };
  };

  return (
    <div className="calendar-view">
      <h1>Communication Calendar</h1>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />

      {selectedEvent && (
        <div className="event-details-modal">
          <div className="event-details-content">
            <h2>Communication Details</h2>

            {selectedEvent.companyName ? (
              // Upcoming communication details
              <>
                <p>
                  <strong>Company:</strong> {selectedEvent.companyName}
                </p>
                <p>
                  <strong>Next Communication:</strong> {selectedEvent.type}
                </p>
                <p>
                  <strong>Scheduled Date:</strong>{" "}
                  {moment(selectedEvent.start).format("MMMM Do, YYYY")}
                </p>
              </>
            ) : (
              // Past communication details
              <>
                <p>
                  <strong>Type:</strong> {selectedEvent.type}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {moment(selectedEvent.timestamp).format("MMMM Do, YYYY")}
                </p>
                <p>
                  <strong>Notes:</strong>{" "}
                  {selectedEvent.notes || "No additional notes"}
                </p>
              </>
            )}

            <button onClick={closeEventDetails}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;
