import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Booking } from "../entity/Booking";
import { HotelRoom } from "../entity/HotelRoom";
import { validationResult } from "express-validator";
import { AppError } from "../errors/AppError";
import { addNoonTime } from "../utils/dateUtils";

export class BookingController {
  static async createBooking(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { customerName, customerEmail, checkInDate, checkOutDate, roomId } =
        req.body;

      const roomRepository = AppDataSource.getRepository(HotelRoom);
      const bookingRepository = AppDataSource.getRepository(Booking);

      const room = await roomRepository.findOneBy({ id: roomId });

      if (!room) {
        return next(new AppError("Room is not available", 400));
      }

      const checkInDateAddNoonTime = addNoonTime(checkInDate);
      const checkOutDateAddNoonTime = addNoonTime(checkOutDate);

      if (checkInDateAddNoonTime === checkOutDateAddNoonTime) {
        return next(new AppError("Room can not be booked for same day", 400));
      }

      // Check if room is available for the requested dates
      const existingBooking = await bookingRepository
        .createQueryBuilder("booking")
        .where("booking.room = :roomId", { roomId })
        .andWhere(
          "(booking.checkInDate < :checkOutDateAddNoonTime AND booking.checkOutDate > :checkInDateAddNoonTime)",
          { checkInDateAddNoonTime, checkOutDateAddNoonTime }
        )
        .getOne();

      if (existingBooking) {
        return next(
          new AppError("Room is not available for the requested dates", 400)
        );
      }
      const booking = bookingRepository.create({
        customerName,
        customerEmail,
        checkInDate: new Date(addNoonTime(checkInDate)),
        checkOutDate: new Date(addNoonTime(checkOutDate)),
        room,
      });

      await roomRepository.save(room);
      await bookingRepository.save(booking);

      res.json(booking);
    } catch (error) {
      next(new AppError("Failed to create booking", 500));
    }
  }
}
