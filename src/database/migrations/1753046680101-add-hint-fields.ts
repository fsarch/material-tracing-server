import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddHintFields1753046680101 implements MigrationInterface {
  name = 'AddHintFields1753046680101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add hint column to material table
    await queryRunner.addColumn('material', new TableColumn({
      name: 'hint',
      type: 'text',
      isNullable: true,
    }));

    // Add hint column to material_type table
    await queryRunner.addColumn('material_type', new TableColumn({
      name: 'hint',
      type: 'text',
      isNullable: true,
    }));

    // Add hint column to part table
    await queryRunner.addColumn('part', new TableColumn({
      name: 'hint',
      type: 'text',
      isNullable: true,
    }));

    // Add hint column to part_type table
    await queryRunner.addColumn('part_type', new TableColumn({
      name: 'hint',
      type: 'text',
      isNullable: true,
    }));

    // Add hint column to manufacturer table
    await queryRunner.addColumn('manufacturer', new TableColumn({
      name: 'hint',
      type: 'text',
      isNullable: true,
    }));

    // Add hint column to short_code table
    await queryRunner.addColumn('short_code', new TableColumn({
      name: 'hint',
      type: 'text',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop hint columns in reverse order
    await queryRunner.dropColumn('short_code', 'hint');
    await queryRunner.dropColumn('manufacturer', 'hint');
    await queryRunner.dropColumn('part_type', 'hint');
    await queryRunner.dropColumn('part', 'hint');
    await queryRunner.dropColumn('material_type', 'hint');
    await queryRunner.dropColumn('material', 'hint');
  }
}
