import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PartAmount1748372988976 implements MigrationInterface {
  name = 'PartAmount1748372988976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('part', new TableColumn({
      name: 'amount',
      type: 'integer',
      isNullable: false,
      default: '1',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('part', 'amount');
  }
}
