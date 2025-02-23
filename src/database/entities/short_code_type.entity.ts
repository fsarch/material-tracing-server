import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'short_code_type',
})
export class ShortCodeType {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk__short_code_type',
  })
  id: string;

  @Column({
    name: 'name',
    length: '2048',
    nullable: false,
  })
  name: string;
}
