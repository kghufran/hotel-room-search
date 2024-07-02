import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar, Container } from 'reactstrap';
import HotelSearch from './components/HotelSearch';
import BookingForm from './components/BookingForm';

const App = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const handleRoomSelect = (room, startDate, endDate) => {
    console.log(room)
    setSelectedRoom(room);
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  };

  return (
    <Router>
      <div style={{marginTop:"2em", marginLeft:"200px", marginRight:"200px" }}>
        <Navbar color="light" light expand="md">
          <Container>
          <h1 class="text-center fs-1" >Hotel Booking App</h1>
          </Container>
        </Navbar>
        <Container>
        <Routes>
          <Route path="/" element={<HotelSearch onRoomSelect={handleRoomSelect} />} />
          <Route path="/book" element={<BookingForm selectedRoom={selectedRoom} selectedStartDate={selectedStartDate} selectedEndDate={selectedEndDate} />} />
        </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;


