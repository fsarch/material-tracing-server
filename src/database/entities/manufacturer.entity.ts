import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'manufacturer',
})
export class Manufacturer {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk__manufacturer',
  })
  id: string;

  @Column({
    name: 'name',
    length: '512',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'external_id',
    type: 'varchar',
    length: '256',
  })
  externalId: string;

  @CreateDateColumn({
    name: 'creation_time',
  })
  creationTime: Date;

  @DeleteDateColumn({
    name: 'deletion_time',
  })
  deletionTime: Date;

  @Column({
    name: 'hint',
    type: 'text',
    nullable: true,
  })
  hint: string | null = null;
}
