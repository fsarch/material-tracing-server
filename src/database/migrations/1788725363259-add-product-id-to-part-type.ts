import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddProductIdToPartType1788725363259 implements MigrationInterface {
  name = 'AddProductIdToPartType1788725363259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'part_type',
      new TableColumn({
        name: 'product_id',
        type: 'varchar',
        length: '256',
        isNullable: true,
      }),
    );

    await queryRunner.createIndex(
      'part_type',
      new TableIndex({
        name: 'IDX__part_type__product_id',
        columnNames: ['product_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('part_type', 'IDX__part_type__product_id');
    await queryRunner.dropColumn('part_type', 'product_id');
  }
}
