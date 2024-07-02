import axios from "axios";

import { BASE_URL } from "../common/Constant";
import HttpException from "../common/exceptions/HttpException";

export const searchAvailableRoomByDateRange = async (payload) => {
  const response = await axios
    .post(BASE_URL + "/api/rooms/available", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch(HttpException.create);
  return response.data;
};

export const createBooking = async (payload) => {
    const response = await axios
      .post(BASE_URL + "/api/bookings", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch(HttpException.create);
    return response.data;
  };
  
