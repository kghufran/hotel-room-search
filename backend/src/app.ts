import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { useContainer } from "typeorm";
import { Container } from "typedi";
import roomRoutes from "./routes/room";
import bookingRoutes from "./routes/booking";
import { errorHandler } from "./middleware/errorHandler";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { AppDataSource } from "./data-source";

useContainer(Container);

AppDataSource.initialize().then(() => {
  const app = express();
  const port = 3001;

  // Security middleware
  app.use(helmet());

  // Enable CORS
  app.use(cors());

  // Logging middleware
  app.use(morgan("combined"));

  app.use(bodyParser.json());

  app.use("/api/rooms", roomRoutes);
  app.use("/api/bookings", bookingRoutes);

  app.use(errorHandler); // Add error handling middleware

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(error => console.log(error));
