import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { getDataType } from "./utils/data-type.mapper.js";

export class CheckoutTime1749376805136 implements MigrationInterface {
  name = 'CheckoutTime1749376805136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const databaseType = queryRunner.connection.driver.options.type;

    await queryRunner.addColumn('material', new TableColumn({
      name: 'checkout_time',
      type: getDataType(databaseType, 'timestamp'),
      isNullable: true,
    }));

    await queryRunner.addColumn('part', new TableColumn({
      name: 'checkout_time',
      type: getDataType(databaseType, 'timestamp'),
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('part', 'checkout_time');
    await queryRunner.dropColumn('material', 'checkout_time');
  }
}
