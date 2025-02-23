import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'short_code',
})
export class ShortCode {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk__short_code',
  })
  id: string;

  @Column({
    name: 'code',
    length: '512',
    nullable: false,
  })
  code: string;

  @Column({
    name: 'short_code_type_id',
    type: 'uuid',
  })
  shortCodeTypeId: string;

  @CreateDateColumn({
    name: 'creation_time',
  })
  creationTime: Date;

  @DeleteDateColumn({
    name: 'deletion_time',
  })
  deletionTime: Date;
}
