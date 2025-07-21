import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'material',
})
export class Material {
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
    name: 'material_type_id',
    type: 'uuid',
  })
  materialTypeId: string;

  @Column({
    name: 'image_ref',
    type: 'varchar',
    length: '2048',
  })
  imageRef: string;

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
    name: 'checkout_time',
    type: 'timestamp',
    nullable: true,
  })
  checkoutTime: Date | null = null;

  @Column({
    name: 'hint',
    type: 'text',
    nullable: true,
  })
  hint: string | null = null;
}
