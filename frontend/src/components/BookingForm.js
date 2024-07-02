import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { DatePicker } from "reactstrap-date-picker";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import Loader from "../common/Loader";
import { createBooking } from "../services/api";
import { ToastContainer, toast } from "react-toastify";

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    room,
    startDate: initialStartDate,
    endDate: initialEndDate,
  } = location.state || {};
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roomNumber, setRoomNumber] = useState(room ? room.roomNumber : "");
  const [startDate, setStartDate] = useState(
    initialStartDate || new Date().toISOString()
  );
  const [endDate, setEndDate] = useState(
    initialEndDate || new Date().toISOString()
  );
  const [showLoader, setShowLoader] = useState(false);

  const handleBooking = (e) => {
    e.preventDefault();
    const payload = {
      customerName: name,
      customerEmail: email,
      checkInDate: startDate,
      checkOutDate: endDate,
      roomId: room.id,
    };
    setShowLoader(true);
    createBooking(payload)
      .then((response) => {
        alert("Room booked successfully!");
        navigate("/");
      })
      .catch((err) => {
        const error = JSON.parse(err.message);
        toast(error.message, {
          position: "top-center",
        });
      })
      .finally(() => {
        setShowLoader(false);
      });
  };

  useEffect(() => {
    if (room) {
      setRoomNumber(room.roomNumber);
    }
  }, [room]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Button
            color="secondary"
            onClick={handleBack}
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            <IoArrowBack /> Back
          </Button>
          <h3>Book a Room</h3>
          <Form onSubmit={handleBooking}>
            <FormGroup>
              <Label for="name">Name:</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email:</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="roomNumber">Room Number:</Label>
              <Input
                type="text"
                id="roomNumber"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label for="startDate">Start Date:</Label>
              <DatePicker
                id="startDate"
                showClearButton={false}
                value={startDate}
                onChange={(v) => setStartDate(v)}
                required
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label for="endDate">End Date:</Label>
              <DatePicker
                id="endDate"
                showClearButton={false}
                value={endDate}
                onChange={(v) => setEndDate(v)}
                required
                disabled
              />
            </FormGroup>
            <Button type="submit" color="primary" style={{ float: "right" }}>
              Book
            </Button>
          </Form>
        </Col>
      </Row>
      {showLoader && <Loader />}
      <ToastContainer />
    </Container>
  );
};

export default BookingForm;
