import React, { useState, useEffect } from "react";
import { DatePicker } from "reactstrap-date-picker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { searchAvailableRoomByDateRange } from "../services/api";
import Loader from "../common/Loader";
import { formatPrice } from "../utils/priceUtils";
import { ToastContainer, toast } from "react-toastify";

const HotelSearch = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());
  const [availableRooms, setAvailableRooms] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const searchRooms = () => {
    setShowLoader(true);
    const payload = {
      startDate: startDate,
      endDate: endDate,
    };
    searchAvailableRoomByDateRange(payload)
      .then((response) => {
        console.log(response);
        setAvailableRooms(response);
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

  const handleSelectRoom = (room) => {
    navigate("/book", { state: { room, startDate, endDate } });
  };

  useEffect(() => {
    searchRooms();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col className="m-4">
          <h3>Search for Available Rooms</h3>
          <div className="mt-2 w-25">
            <label>Start Date: </label>
            <DatePicker value={startDate} onChange={(v) => setStartDate(v)} />
          </div>
          <div className="mt-2 w-25">
            <label>End Date: </label>
            <DatePicker value={endDate} onChange={(v) => setEndDate(v)} />
          </div>
          <Button color="primary" className="mt-4" onClick={searchRooms}>
            Search
          </Button>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="m-4">
          <h3>Available Rooms</h3>
          <ListGroup>
            {availableRooms &&
              availableRooms.length > 0 &&
              availableRooms.map((room) => (
                <ListGroupItem key={room.roomNumber}>
                  {`Room Number: ${room.roomNumber}, Type: ${
                    room.type
                  }, Price: ${formatPrice(room.price)}`}
                  <Button
                    color="secondary"
                    onClick={() => handleSelectRoom(room)}
                    style={{ marginLeft: "10px", float: "right" }}
                  >
                    Select
                  </Button>
                </ListGroupItem>
              ))}
          </ListGroup>
        </Col>
      </Row>
      {showLoader && <Loader />}
      <ToastContainer />
    </Container>
  );
};

export default HotelSearch;
