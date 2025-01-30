import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import 'dotenv/config';

const execAsync = promisify(exec);

const PROD_DB_URI = process.env.DATABASE_URI_PROD;
const DEV_DB_URI = process.env.DATABASE_URI_DEV;
const TEMP_DIR = '/tmp/prodDump';

console.log('Starting database sync process...');

const runCommand = async (command) => {
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) console.error(`Stderr: ${stderr}`);
    console.log(`Stdout: ${stdout}`);
    return stdout;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const syncDatabases = async () => {
  try {
    await runCommand(`mongodump --uri="${PROD_DB_URI}" --out=${TEMP_DIR}`);
    await runCommand(`mongosh "${DEV_DB_URI}" --eval "db.dropDatabase()"`);
    await runCommand(`mongorestore --uri="${DEV_DB_URI}" --dir=${TEMP_DIR}`);
    console.log('Database sync completed successfully!');
  } catch (error) {
    console.error('Database sync failed:', error);
  }
};

syncDatabases();
