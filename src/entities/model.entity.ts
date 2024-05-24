import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

export default abstract class Model extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp with time zone", nullable: false })
  createdAt: Date;

  @Column({ type: "timestamp with time zone", nullable: false })
  updatedAt: Date;

  @Column({ default: true })
  active: boolean;

  private currentDate(): Date {
    return new Date();
  }

  @BeforeInsert()
  async setCreationTimestamp() {
    const currentDate = this.currentDate();
    this.createdAt = currentDate;
    this.updatedAt = currentDate;
  }

  @BeforeUpdate()
  async setUpdateTimestamp() {
    this.updatedAt = this.currentDate();
  }
}
