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
  created_at: Date;

  @Column({ type: "timestamp with time zone", nullable: false })
  updated_at: Date;

  @Column({ default: true })
  active: boolean;

  private currentDate(): Date {
    return new Date();
  }

  @BeforeInsert()
  async setCreationTimestamp() {
    const currentDate = this.currentDate();
    this.created_at = currentDate;
    this.updated_at = currentDate;
  }

  @BeforeUpdate()
  async setUpdateTimestamp() {
    this.updated_at = this.currentDate();
  }
}
