import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'material_type',
})
export class MaterialType {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk__material_type',
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

  @Column({
    name: 'manufacturer_id',
    type: 'uuid',
  })
  manufacturerId: string;

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
