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
    name: 'amount',
    type: 'integer',
  })
  amount: number;

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
}
