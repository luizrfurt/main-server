import { Entity, Column } from "typeorm";
import Model from "./model.entity";

@Entity("termsConditions")
export class TermCondition extends Model {
  @Column()
  content: string;

  toJSON() {
    return { ...this };
  }
}
