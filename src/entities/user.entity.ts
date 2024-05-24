import bcrypt from "bcryptjs";
import { Entity, Column, Index, BeforeInsert, OneToMany } from "typeorm";
import Model from "./model.entity";
import { Session } from "./session.entity";
import { Context } from "./context.entity";
import { ContextApplication } from "./contextApplication.entity";

@Entity("users")
export class User extends Model {
  @Column()
  name: string;

  @Column()
  email: string;

  @Index("login_index")
  @Column({
    unique: true,
  })
  login: string;

  @Column()
  password: string;

  @Column({
    type: "text",
    nullable: true,
    default:
      "https://prime-repo.s3.sa-east-1.amazonaws.com/main/users/default-user-photo.jpeg",
  })
  photo!: string | null;

  @Column({ default: false })
  main: boolean;

  @Column({ default: false })
  leader: boolean;

  @Column({
    default: false,
  })
  emailConfirmed: boolean;

  @Index("emailConfirmToken_index")
  @Column({
    type: "text",
    nullable: true,
  })
  emailConfirmToken!: string | null;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  emailConfirmTokenExpires!: Date | null;

  @Column({
    default: false,
  })
  passwordReseted: boolean;

  @Index("passwordResetToken_index")
  @Column({
    type: "text",
    nullable: true,
  })
  passwordResetToken!: string | null;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  passwordResetTokenExpires!: Date | null;

  @Column({ default: null })
  cpf: string;

  @Column({ default: null })
  phone: string;

  // Referência para o usuário que criou este usuário
  @Column({ nullable: true })
  createdBy: number;

  // Referência para entidade sessions
  @OneToMany(() => Session, (session: Session) => session.user)
  sessions: Session[];

  // Referência para entidade contexts
  @OneToMany(() => Context, (context: Context) => context.user)
  contexts: Context[];

  // Referência para entidade contextApplications
  @OneToMany(
    () => ContextApplication,
    (contextApplication: ContextApplication) => contextApplication.user
  )
  contextApplications: ContextApplication[];

  // Hash senha antes de salvar no banco de dados
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  toJSON() {
    return {
      ...this,
      emailConfirmToken: undefined,
      emailConfirmTokenExpires: undefined,
      passwordReseted: undefined,
      passwordResetToken: undefined,
      passwordResetTokenExpires: undefined,
    };
  }
}
