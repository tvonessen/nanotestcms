import * as migration_20250127_211033_migration from './20250127_211033_migration';

export const migrations = [
  {
    up: migration_20250127_211033_migration.up,
    down: migration_20250127_211033_migration.down,
    name: '20250127_211033_migration'
  },
];
