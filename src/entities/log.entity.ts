import { Entity, Column } from "typeorm";
import Model from "./model.entity";

@Entity("logs")
export class Log extends Model {
  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  user: string;

  @Column({ nullable: true })
  route: string;

  @Column({ type: "text", nullable: true })
  data: string;

  toJSON() {
    return { ...this, data: JSON.parse(this.data) };
  }
}
