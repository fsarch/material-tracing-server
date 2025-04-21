import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { getDataType } from './utils/data-type.mapper.js';
import { ShortCodeType } from "../../constants/short-code-type.enum.js";

export class BaseTables1720373216667 implements MigrationInterface {
  name = 'BaseTables1720373216667';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const databaseType = queryRunner.connection.driver.options.type;

    // region ShortCodeType
    await queryRunner.createTable(
      new Table({
        name: 'short_code_type',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__short_code_type',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '512',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.manager.insert('short_code_type', {
      id: ShortCodeType.MATERIAL,
      name: 'Material',
    });

    await queryRunner.manager.insert('short_code_type', {
      id: ShortCodeType.PART,
      name: 'Bauteil',
    });
    // endregion

    // region ShortCode
    await queryRunner.createTable(
      new Table({
        name: 'short_code',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__short_code',
          },
          {
            name: 'short_code_type_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '512',
            isNullable: false,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
        indices: [{
          name: 'UQ__short_code__code',
          columnNames: ['code'],
          isUnique: true,
          where: 'deletion_time IS NULL'
        }, {
          name: 'IDX__short_code__short_code_type_id',
          columnNames: ['short_code_type_id'],
        }],
        foreignKeys: [{
          name: 'FK__short_code__short_code_type_id',
          columnNames: ['short_code_type_id'],
          referencedTableName: 'short_code_type',
          referencedColumnNames: ['id'],
        }],
      }),
    );
    // endregion

    // region Manufacturer
    await queryRunner.createTable(
      new Table({
        name: 'manufacturer',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__manufacturer',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '512',
            isNullable: false,
          },
          {
            name: 'external_id',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
        indices: [{
          name: 'IDX__manufacturer__external_id',
          columnNames: ['external_id'],
        }],
      }),
    );
    // endregion

    // region MaterialType
    await queryRunner.createTable(
      new Table({
        name: 'material_type',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__material_type',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '512',
            isNullable: false,
          },
          {
            name: 'manufacturer_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'external_id',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
        indices: [{
          name: 'IDX__material_type__external_id',
          columnNames: ['external_id'],
        }, {
          name: 'IDX__material_type__manufacturer_id',
          columnNames: ['manufacturer_id'],
        }],
        foreignKeys: [{
          name: 'FK__material_type__manufacturer_id',
          columnNames: ['manufacturer_id'],
          referencedTableName: 'manufacturer',
          referencedColumnNames: ['id'],
        }],
      }),
    );
    // endregion

    // region Material
    await queryRunner.createTable(
      new Table({
        name: 'material',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__material',
          },
          {
            name: 'material_type_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '512',
            isNullable: false,
          },
          {
            name: 'image_ref',
            type: 'varchar',
            length: '2048',
            isNullable: true,
          },
          {
            name: 'external_id',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
        indices: [{
          name: 'IDX__material__external_id',
          columnNames: ['external_id'],
        }, {
          name: 'IDX__material__material_type_id',
          columnNames: ['material_type_id'],
        }],
        foreignKeys: [{
          name: 'FK__material__material_type_id',
          columnNames: ['material_type_id'],
          referencedTableName: 'material_type',
          referencedColumnNames: ['id'],
        }],
      }),
    );
    // endregion

    // region MaterialShortCode
    await queryRunner.createTable(
      new Table({
        name: 'material_short_code',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__material_short_code',
          },
          {
            name: 'short_code_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'material_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
        foreignKeys: [{
          name: 'fk__material_short_code__short_code_id',
          onUpdate: 'NO ACTION',
          onDelete: 'NO ACTION',
          columnNames: ['short_code_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'short_code',
        }, {
          name: 'fk__material_short_code__material_id',
          onUpdate: 'NO ACTION',
          onDelete: 'NO ACTION',
          columnNames: ['material_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'material',
        }],
        indices: [{
          name: 'IDX__material_short_code__short_code_id',
          columnNames: ['short_code_id'],
        }, {
          name: 'IDX__material_short_code__material_id',
          columnNames: ['material_id'],
        }, {
          name: 'UQ__material_short_code__short_code_id__material_id',
          columnNames: ['short_code_id', 'material_id'],
          isUnique: true,
          where: 'deletion_time IS NULL',
        }],
      }),
    );
    // endregion

    // region PartType
    await queryRunner.createTable(
      new Table({
        name: 'part_type',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__part_type',
          },
          {
            name: 'external_id',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '2048',
            isNullable: false,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
        indices: [{
          name: 'IDX__part_type__external_id',
          columnNames: ['external_id'],
        }],
      }),
    );
    // endregion

    // region Part
    await queryRunner.createTable(
      new Table({
        name: 'part',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__part',
          },
          {
            name: 'parent_part_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'part_type_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '2048',
            isNullable: false,
          },
          {
            name: 'external_id',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
        indices: [{
          name: 'IDX__part__part_type_id',
          columnNames: ['part_type_id'],
        }, {
          name: 'IDX__part__external_id',
          columnNames: ['external_id'],
        }, {
          name: 'IDX__part__parent_part_id',
          columnNames: ['parent_part_id'],
        }],
        foreignKeys: [{
          name: 'fk__part__part_type_id',
          onUpdate: 'NO ACTION',
          onDelete: 'NO ACTION',
          columnNames: ['part_type_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'part_type',
        }],
      }),
    );
    // endregion

    // region PartShortCode
    await queryRunner.createTable(
      new Table({
        name: 'part_short_code',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__part_short_code',
          },
          {
            name: 'short_code_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'part_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
        indices: [{
          name: 'IDX__part_short_code__short_code_id',
          columnNames: ['short_code_id'],
        }, {
          name: 'IDX__part_short_code__part_id',
          columnNames: ['part_id'],
        }, {
          name: 'UQ__part_short_code__short_code_id__part_id',
          columnNames: ['short_code_id', 'part_id'],
          isUnique: true,
          where: 'deletion_time IS NULL',
        }],
        foreignKeys: [{
          name: 'fk__part_short_code__short_code_id',
          onUpdate: 'NO ACTION',
          onDelete: 'NO ACTION',
          columnNames: ['short_code_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'short_code',
        }, {
          name: 'fk__part_short_code__part_id',
          onUpdate: 'NO ACTION',
          onDelete: 'NO ACTION',
          columnNames: ['part_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'part',
        }],
      }),
    );
    // endregion
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('part_short_code');
    await queryRunner.dropTable('list_attribute_element');
    await queryRunner.dropTable('list_attribute');
    await queryRunner.dropTable('attribute_localization');
    await queryRunner.dropTable('attribute');
    await queryRunner.dropTable('attribute_type');
    await queryRunner.dropTable('catalog');
    await queryRunner.dropTable('localization');
  }
}
