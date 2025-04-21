import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'part',
})
export class Part {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk__part',
  })
  id: string;

  @Column({
    name: 'parent_part_id',
    type: 'uuid',
    nullable: true,
  })
  parentPartId: string;

  @Column({
    name: 'name',
    length: '512',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'part_type_id',
    type: 'uuid',
  })
  partTypeId: string;

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
}
