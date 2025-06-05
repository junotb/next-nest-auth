import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Column({ type: 'bigint', nullable: false, unique: true })
  IDX: number;

  @Column({ type: 'varchar', nullable: false })
  ID: string;

  @Column({ type: 'varchar', nullable: false })
  PWD: string;

  @Column({ type: 'tinyint', nullable: true })
  USE_PWD: number;

  @Column({ type: 'varchar', nullable: false })
  NAME: string;

  @Column({ type: 'varchar', nullable: true })
  NICK_NAME: string;

  @Column({ type: 'bigint', nullable: false })
  CREATE_DATE: number; // timestamp

  @Column({ type: 'bigint', nullable: false })
  UPDATE_DATE: number; // timestamp

  @Column({ type: 'bigint', nullable: true })
  LAST_LOGIN_DATE: number; // timestamp
}
