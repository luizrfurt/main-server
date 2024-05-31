import { Entity, Column, OneToMany } from "typeorm";
import Model from "./model.entity";
import { ContextApplication } from "./contextApplication.entity";

@Entity("applications")
export class Application extends Model {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: "text",
    nullable: true,
    default:
      "https://prime-repo.s3.sa-east-1.amazonaws.com/main/applications/default-application-logo.jpeg",
  })
  logo!: string | null;

  // Referência para entidade contextApplications
  @OneToMany(
    () => ContextApplication,
    (contextApplication: ContextApplication) => contextApplication.application
  )
  contexts_applications: ContextApplication[];

  toJSON() {
    return { ...this };
  }
}
