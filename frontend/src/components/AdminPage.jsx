import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [events, setEvents] = useState([]);
  const [adminToken, setAdminToken] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    image: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/events', {
        headers: { 'admin-token': adminToken }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/events', newEvent, {
        headers: { 'admin-token': adminToken }
      });
      setNewEvent({ title: '', description: '', image: '', expiryDate: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleFinalizeEvent = async (eventId, result) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/events/${eventId}/finalize`, { result }, {
        headers: { 'admin-token': adminToken }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error finalizing event:', error);
    }
  };

  const handleProcessClaims = async (eventId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/admin/events/${eventId}/process-claims`, {}, {
        headers: { 'admin-token': adminToken }
      });
      console.log('Claims processed:', response.data);
      fetchEvents();
    } catch (error) {
      console.error('Error processing claims:', error);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <input
        type="text"
        placeholder="Admin Token"
        value={adminToken}
        onChange={(e) => setAdminToken(e.target.value)}
      />
      <h2>Create New Event</h2>
      <form onSubmit={handleCreateEvent}>
        <input
          type="text"
          placeholder="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newEvent.image}
          onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newEvent.expiryDate}
          onChange={(e) => setNewEvent({ ...newEvent, expiryDate: e.target.value })}
        />
        <button type="submit">Create Event</button>
      </form>
      <h2>Events</h2>
      {events.map((event) => (
        <div key={event._id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>Expiry Date: {new Date(event.expiryDate).toLocaleString()}</p>
          <p>Finalized: {event.isFinalized ? 'Yes' : 'No'}</p>
          {!event.isFinalized && (
            <>
              <button onClick={() => handleFinalizeEvent(event._id, true)}>Finalize (Yes)</button>
              <button onClick={() => handleFinalizeEvent(event._id, false)}>Finalize (No)</button>
            </>
          )}
          {event.isFinalized && !event.claimsProcesed && (
            <button onClick={() => handleProcessClaims(event._id)}>Process Claims</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminPage;