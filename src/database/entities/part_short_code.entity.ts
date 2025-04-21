import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'part_short_code',
})
export class PartShortCode {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk__part_short_code',
  })
  id: string;

  @Column({
    name: 'short_code_id',
    type: 'uuid',
    nullable: false,
  })
  shortCodeId: string;

  @Column({
    name: 'part_id',
    type: 'uuid',
  })
  partId: string;

  @CreateDateColumn({
    name: 'creation_time',
  })
  creationTime: Date;

  @DeleteDateColumn({
    name: 'deletion_time',
  })
  deletionTime: Date;
}
