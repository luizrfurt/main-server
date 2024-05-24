import { Entity, Column, ManyToOne } from "typeorm";
import Model from "./model.entity";
import { Context } from "./context.entity";
import { Application } from "./application.entity";
import { User } from "./user.entity";

@Entity("contextApplications")
export class ContextApplication extends Model {
  @Column({ default: false })
  contracted: boolean;

  // Referência para entidade contexts
  @ManyToOne(() => Context, (context: Context) => context.contextApplications, {
    eager: true,
  })
  context: Context;

  // Referência para entidade applications
  @ManyToOne(
    () => Application,
    (application: Application) => application.contextApplications,
    { eager: true }
  )
  application: Application;

  // Referência para entidade users
  @ManyToOne(() => User, (user: User) => user.contextApplications, {
    eager: true,
  })
  user: User;

  toJSON() {
    return {
      ...this,
    };
  }
}
