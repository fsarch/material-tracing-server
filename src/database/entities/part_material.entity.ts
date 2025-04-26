import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'part_material',
})
export class PartMaterial {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk__part_material',
  })
  id: string;

  @Column({
    name: 'part_id',
    type: 'uuid',
  })
  partId: string;

  @Column({
    name: 'material_id',
    type: 'uuid',
    nullable: false,
  })
  materialId: string;

  @CreateDateColumn({
    name: 'creation_time',
  })
  creationTime: Date;

  @DeleteDateColumn({
    name: 'deletion_time',
  })
  deletionTime: Date;
}
