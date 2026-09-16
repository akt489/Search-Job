import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error('Missing DIRECT_DATABASE_URL or DATABASE_URL');

const migrationPool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
});
const client = await migrationPool.connect();
const directory = path.dirname(fileURLToPath(import.meta.url));
const migration = await fs.readFile(path.join(directory, '..', 'migrations', '001_add_enrichment_fields.sql'), 'utf8');

try {
    await client.query('BEGIN');
    await client.query(migration);
    await client.query('COMMIT');
    console.log('Applied 001_add_enrichment_fields.sql');
} catch (error) {
    await client.query('ROLLBACK');
    throw error;
} finally {
    client.release();
    await migrationPool.end();
}
