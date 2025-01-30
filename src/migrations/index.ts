import * as migration_20250129_220209_migration from './20250129_220209_migration';

export const migrations = [
  {
    up: migration_20250129_220209_migration.up,
    down: migration_20250129_220209_migration.down,
    name: '20250129_220209_migration'
  },
];
