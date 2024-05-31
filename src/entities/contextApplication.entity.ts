import { Entity, Column, ManyToOne } from "typeorm";
import Model from "./model.entity";
import { Context } from "./context.entity";
import { Application } from "./application.entity";
import { User } from "./user.entity";

@Entity("contexts_applications")
export class ContextApplication extends Model {
  @Column({ default: false })
  contracted: boolean;

  // Referência para entidade contexts
  @ManyToOne(() => Context, (context: Context) => context.contexts_applications, {
    eager: true,
  })
  context: Context;

  // Referência para entidade applications
  @ManyToOne(
    () => Application,
    (application: Application) => application.contexts_applications,
    { eager: true }
  )
  application: Application;

  // Referência para entidade users
  @ManyToOne(() => User, (user: User) => user.contexts_applications, {
    eager: true,
  })
  user: User;

  toJSON() {
    return {
      ...this,
    };
  }
}
