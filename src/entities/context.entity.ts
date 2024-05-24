import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";
import { ContextApplication } from "./contextApplication.entity";

@Entity("contexts")
export class Context extends Model {
  @Column()
  code: string;

  @Column()
  description: string;

  // Referência para entidade users
  @ManyToOne(() => User, (user: User) => user.contexts, { eager: true })
  user: User;

  // Referência para entidade contextApplications
  @OneToMany(
    () => ContextApplication,
    (contextApplication: ContextApplication) => contextApplication.context
  )
  contextApplications: ContextApplication[];

  toJSON() {
    return {
      ...this,
    };
  }
}
