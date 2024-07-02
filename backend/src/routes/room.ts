import { Router } from "express";
import { HotelRoomController } from "../controllers/HotelRoomController";
import { check } from "express-validator";

const router = Router();

router.get("/", HotelRoomController.getAllRooms);

router.post(
  "/",
  [
    check("roomNumber").not().isEmpty(),
    check("type").not().isEmpty(),
    check("price").isFloat({ gt: 0 }),
  ],
  HotelRoomController.createRoom
);

router.post(
  "/available",
  [check("startDate").not().isEmpty(), check("endDate").not().isEmpty()],
  HotelRoomController.getAvailableRooms
);

export default router;
