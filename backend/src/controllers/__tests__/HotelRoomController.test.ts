import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import { Container } from 'typedi';
import { useContainer, Connection } from 'typeorm';
import { HotelRoom } from '../../entity/HotelRoom';
import { AppDataSource } from '../../data-source';
import express from 'express';
import roomRoutes from '../../routes/room';
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
  app.use('/api/rooms', roomRoutes);
});

afterAll(async () => {
  await connection.close();
});

describe('HotelRoomController', () => {
  beforeEach(async () => {
    await connection.getRepository(HotelRoom).clear();
  });

  it('should create a new room', async () => {
    const response = await request(app)
      .post('/api/rooms')
      .send({
        roomNumber: '101',
        type: 'single',
        price: 100,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.roomNumber).toBe('101');
  });

  it('should get all rooms', async () => {
    await connection.getRepository(HotelRoom).save({
      roomNumber: '102',
      type: 'double',
      price: 200,
    });

    const response = await request(app).get('/api/rooms');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].roomNumber).toBe('102');
  });

  it('should get available rooms', async () => {
    await connection.getRepository(HotelRoom).save({
      roomNumber: '103',
      type: 'single',
      price: 100,
      available: true,
    });

    await connection.getRepository(HotelRoom).save({
      roomNumber: '104',
      type: 'double',
      price: 150,
      available: false,
    });

    const response = await request(app).get('/api/rooms/available');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].roomNumber).toBe('103');
  });
});
