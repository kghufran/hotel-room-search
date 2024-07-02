import { Router } from "express";
import { BookingController } from "../controllers/BookingController";
import { check } from "express-validator";

const router = Router();

router.post("/", [
  check('customerName').not().isEmpty(),
  check('customerEmail').isEmail(),
  check('checkInDate').isISO8601(),
  check('checkOutDate').isISO8601(),
  check('roomId').isInt()
], BookingController.createBooking);

export default router;
