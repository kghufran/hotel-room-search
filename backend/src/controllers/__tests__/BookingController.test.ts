import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import { Container } from 'typedi';
import { useContainer, Connection } from 'typeorm';
import { Booking } from '../../entity/Booking';
import { HotelRoom } from '../../entity/HotelRoom';
import { AppDataSource } from '../../data-source';
import express from 'express';
import bookingRoutes from '../../routes/booking';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

// Use TypeDI container for TypeORM
useContainer(Container);

let app: express.Application;
let connection: Connection;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  app = express();
  app.use(helmet());
  app.use(cors());
  app.use(morgan('combined'));
  app.use(bodyParser.json());
  app.use('/api/bookings', bookingRoutes);
});

afterAll(async () => {
  await connection.close();
});

describe('BookingController', () => {
  beforeEach(async () => {
    await connection.getRepository(Booking).clear();
    await connection.getRepository(HotelRoom).clear();
  });

  it('should create a new booking', async () => {
    const room = await connection.getRepository(HotelRoom).save({
      roomNumber: '101',
      type: 'single',
      price: 100,
      available: true,
    });

    const response = await request(app)
      .post('/api/bookings')
      .send({
        customerName: 'Ghufran',
        customerEmail: 'ghufran@gmail.com',
        checkInDate: '2024-07-01',
        checkOutDate: '2024-07-10',
        roomId: room.id,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.customerName).toBe('Ghufran Khan');
  });
});
