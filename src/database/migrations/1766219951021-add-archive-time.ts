import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { getDataType } from "./utils/data-type.mapper.js";

export class AddArchiveTime1766219951021 implements MigrationInterface {
  name = 'AddArchiveTime1766219951021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const databaseType = queryRunner.connection.driver.options.type;

    // Add archive_time column to material table
    await queryRunner.addColumn('material', new TableColumn({
      name: 'archive_time',
      type: getDataType(databaseType, 'timestamp'),
      isNullable: true,
    }));

    // Add archive_time column to material_type table
    await queryRunner.addColumn('material_type', new TableColumn({
      name: 'archive_time',
      type: getDataType(databaseType, 'timestamp'),
      isNullable: true,
    }));

    // Add archive_time column to part table
    await queryRunner.addColumn('part', new TableColumn({
      name: 'archive_time',
      type: getDataType(databaseType, 'timestamp'),
      isNullable: true,
    }));

    // Add archive_time column to part_type table
    await queryRunner.addColumn('part_type', new TableColumn({
      name: 'archive_time',
      type: getDataType(databaseType, 'timestamp'),
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop archive_time columns in reverse order
    await queryRunner.dropColumn('part_type', 'archive_time');
    await queryRunner.dropColumn('part', 'archive_time');
    await queryRunner.dropColumn('material_type', 'archive_time');
    await queryRunner.dropColumn('material', 'archive_time');
  }
}
