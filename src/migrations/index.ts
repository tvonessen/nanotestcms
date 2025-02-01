import * as migration_20250129_220209_migration from './20250129_220209_migration';
import * as migration_20250201_201307_migration from './20250201_201307_migration';

export const migrations = [
  {
    up: migration_20250129_220209_migration.up,
    down: migration_20250129_220209_migration.down,
    name: '20250129_220209_migration',
  },
  {
    up: migration_20250201_201307_migration.up,
    down: migration_20250201_201307_migration.down,
    name: '20250201_201307_migration'
  },
];
