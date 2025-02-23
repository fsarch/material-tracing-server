import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'material_short_code',
})
export class MaterialShortCode {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk__material_short_code',
  })
  id: string;

  @Column({
    name: 'short_code_id',
    type: 'uuid',
    nullable: false,
  })
  shortCodeId: string;

  @Column({
    name: 'material_id',
    type: 'uuid',
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
