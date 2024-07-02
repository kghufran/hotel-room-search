import { DataSource } from "typeorm";
import { HotelRoom } from "./entity/HotelRoom";
import { Booking } from "./entity/Booking";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [HotelRoom, Booking],
  subscribers: [],
  migrations: [],
});
