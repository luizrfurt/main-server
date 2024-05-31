import { Entity, Column, ManyToOne } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";

@Entity("sessions")
export class Session extends Model {
  @Column()
  access_token: string;

  @Column({ type: "timestamp" })
  access_token_expires_in: string;

  @Column()
  refresh_token: string;

  @Column({ type: "timestamp" })
  refresh_token_expires_in: string;

  // Referência para entidade users
  @ManyToOne(() => User, (user: User) => user.sessions, { eager: true })
  user: User;

  toJSON() {
    return { ...this };
  }
}
