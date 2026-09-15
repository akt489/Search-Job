import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, withTransaction } from '../src/config/database.js';
import { assertProductionConfig } from '../src/config/env.js';

assertProductionConfig();
const directory = path.dirname(fileURLToPath(import.meta.url));
const migration = await fs.readFile(path.join(directory, '..', 'migrations', '001_add_ingestion_fields.sql'), 'utf8');
await withTransaction((client) => client.query(migration));
await pool.end();
console.log('Applied 001_add_ingestion_fields.sql');
