import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { HotelRoom } from "./HotelRoom";

@Entity()
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerName!: string;

  @Column()
  customerEmail?: string;

  @Column()
  checkInDate!: Date;

  @Column()
  checkOutDate!: Date;

  @ManyToOne(() => HotelRoom, (room) => room.bookings)
  room!: HotelRoom;
}
