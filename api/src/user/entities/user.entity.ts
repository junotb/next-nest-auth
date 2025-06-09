import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Column({ type: 'int', nullable: false, default: { generated: 'increment' } })
  IDX: number;

  @Column({ type: 'string', nullable: false, unique: true })
  ID: string;

  @Column({ type: 'string', nullable: false })
  PWD: string;

  @Column({ type: 'int', nullable: true })
  USE_PWD: number;

  @Column({ type: 'string', nullable: false })
  NAME: string;

  @Column({ type: 'string', nullable: true })
  NICK_NAME: string;

  @Column({ type: 'int', nullable: false })
  CREATE_DATE: number; // timestamp

  @Column({ type: 'int', nullable: false })
  UPDATE_DATE: number; // timestamp

  @Column({ type: 'int', nullable: true })
  LAST_LOGIN_DATE: number | null; // timestamp
}
