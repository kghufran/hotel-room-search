import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Booking } from './Booking';

@Entity()
export class HotelRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roomNumber!: string;

  @Column()
  type!: string;

  @Column()
  price!: number;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings?: Booking[];
}
