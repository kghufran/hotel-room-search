import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { HotelRoom } from "../entity/HotelRoom";
import { validationResult } from "express-validator";
import { AppError } from "../errors/AppError";
import { addNoonTime } from "../utils/dateUtils";

export class HotelRoomController {
  static async getAllRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const roomRepository = AppDataSource.getRepository(HotelRoom);
      const rooms = await roomRepository.find();
      res.json(rooms);
    } catch (error) {
      next(new AppError("Failed to retrieve rooms", 500));
    }
  }

  static async createRoom(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { roomNumber, type, price } = req.body;
      const roomRepository = AppDataSource.getRepository(HotelRoom);

      const room = roomRepository.create({
        roomNumber,
        type,
        price,
      });

      await roomRepository.save(room);
      res.json(room);
    } catch (error) {
      next(new AppError("Failed to create room", 500));
    }
  }

  static async getAvailableRooms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { startDate, endDate } = req.body;
      if (!startDate || !endDate) {
        return next(new AppError("Start date and end date are required", 400));
      }
      const roomRepository = AppDataSource.getRepository(HotelRoom);
      const checkInDateAddNoonTime = addNoonTime(startDate);
      const checkOutDateAddNoonTime = addNoonTime(endDate);
      const queryBuilder = roomRepository
        .createQueryBuilder("room")
        .leftJoinAndSelect("room.bookings", "booking")
        .where(
          "(booking.checkInDate > :checkOutDateAddNoonTime OR booking.checkOutDate < :checkInDateAddNoonTime)",
          { checkInDateAddNoonTime, checkOutDateAddNoonTime }
        )
        .orWhere("booking.id IS NULL");

      const rooms = await queryBuilder.getMany();

      res.status(200).json(rooms);
    } catch (error) {
      next(new AppError("Failed to retrieve available rooms", 500));
    }
  }
}
