import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'part_children',
})
export class PartChildren {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk__part_children',
  })
  id: string;

  @Column({
    name: 'part_id',
    type: 'uuid',
    nullable: false,
  })
  partId: string;

  @Column({
    name: 'child_part_id',
    type: 'uuid',
    nullable: false,
  })
  childPartId: string;

  @Column({
    name: 'amount',
    type: 'integer',
    nullable: false,
  })
  amount: number;

  @CreateDateColumn({
    name: 'creation_time',
  })
  creationTime: Date;

  @DeleteDateColumn({
    name: 'deletion_time',
  })
  deletionTime: Date;
}
