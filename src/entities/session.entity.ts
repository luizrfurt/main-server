import { Entity, Column, ManyToOne } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";

@Entity("sessions")
export class Session extends Model {
  @Column()
  accessToken: string;

  @Column({ type: "timestamp" })
  accessTokenExpiresIn: string;

  @Column()
  refreshToken: string;

  @Column({ type: "timestamp" })
  refreshTokenExpiresIn: string;

  // Referência para entidade users
  @ManyToOne(() => User, (user: User) => user.sessions, { eager: true })
  user: User;

  toJSON() {
    return { ...this };
  }
}
